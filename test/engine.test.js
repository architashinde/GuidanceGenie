const assert = require('assert');

const catalog = require('../backend/catalog');
const engine = require('../backend/engine');
const dbApi = require('../backend/db');

const TEST_URI = process.env.GG_TEST_MONGO_URI || 'mongodb://127.0.0.1:27017/guidancegenie_test';

const domains = catalog.domains;
assert.ok(domains.length >= 20, 'expected at least 20 domains');
assert.ok(domains.some((domain) => domain.group === 'Tech'));
assert.ok(domains.some((domain) => domain.group === 'Business'));
assert.ok(catalog.roles.length >= domains.length);

const analyst = engine.rankRoles(engine.examples.analyst);
assert.strictEqual(analyst[0].roleId, 'data-analyst');
assert.ok(analyst[0].score >= 80);
assert.ok(analyst.every((row, index) => index === 0 || analyst[index - 1].score >= row.score));
assert.ok(analyst.find((row) => row.roleId === 'security-analyst').score < 50);

const frontend = engine.rankRoles(engine.examples.frontend);
assert.strictEqual(frontend[0].roleId, 'frontend-developer');
assert.ok(frontend[0].score > frontend.find((row) => row.roleId === 'security-analyst').score);

const bad = engine.normalizeAnswers({
  ...engine.examples.analyst,
  domains: ['data-analytics', 'finance', 'sales', 'content']
});
assert.ok(bad.error);

const emptySkills = engine.normalizeAnswers({ ...engine.examples.analyst, skills: [] });
assert.ok(emptySkills.error);

const ok = engine.normalizeAnswers(engine.examples.analyst);
assert.deepStrictEqual(ok.answers.domains, engine.examples.analyst.domains);

async function checkAccounts() {
  try {
    await dbApi.connect(TEST_URI);
  } catch (error) {
    console.error('MongoDB is not running, so the account checks could not run.');
    console.error('Start MongoDB on 127.0.0.1:27017, then run npm test again.');
    console.error(error.message);
    process.exit(1);
  }

  await dbApi.wipe();
  await dbApi.seedDemo();

  const demo = await dbApi.findUserByEmail('meera.kulkarni@example.com');
  assert.ok(demo, 'demo user should be seeded');
  assert.ok(dbApi.verifyPassword(demo, 'campus-2026'));
  assert.ok(!dbApi.verifyPassword(demo, 'wrong-password'));
  const saved = await dbApi.listAssessments(demo.id);
  assert.strictEqual(saved.length, 2);
  assert.ok(saved.some((row) => row.top_role_id === 'data-analyst'));
  assert.ok(saved.some((row) => row.top_role_id === 'frontend-developer'));

  const created = await dbApi.createUser({
    name: 'Asha Rao',
    email: 'asha.rao@example.com',
    password: 'campus-2026'
  });
  assert.strictEqual(created.email, 'asha.rao@example.com');
  await dbApi.claimAssessments(created.id, ['demo-meera-analyst']);
  const stillDemo = await dbApi.getAssessment('demo-meera-analyst');
  assert.notStrictEqual(String(stillDemo.user_id), String(created.id), 'claim must not steal an owned assessment');

  const guestId = 'guest-result-test';
  await dbApi.createAssessment({
    id: guestId,
    userId: null,
    answers: engine.examples.analyst,
    results: analyst
  });
  await dbApi.claimAssessments(created.id, [guestId]);
  assert.strictEqual(String((await dbApi.getAssessment(guestId)).user_id), String(created.id));
  assert.ok(await dbApi.deleteAssessment(guestId, created.id));
  assert.strictEqual(await dbApi.getAssessment(guestId), null);

  await dbApi.wipe();
  await dbApi.disconnect();
}

checkAccounts()
  .then(() => {
    console.log('engine and account checks passed');
  })
  .catch(async (error) => {
    console.error(error);
    try {
      await dbApi.disconnect();
    } catch (disconnectError) {
      console.error(disconnectError);
    }
    process.exit(1);
  });