const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const catalog = require('../backend/catalog');
const engine = require('../backend/engine');
const dbApi = require('../backend/db');

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

const file = path.join(os.tmpdir(), 'guidancegenie-test-' + process.pid + '.db');
for (const suffix of ['', '-wal', '-shm']) {
  fs.rmSync(file + suffix, { force: true });
}
const db = dbApi.createDatabase(file);
const demo = dbApi.findUserByEmail(db, 'meera.kulkarni@example.com');
assert.ok(demo, 'demo user should be seeded');
assert.ok(dbApi.verifyPassword(demo, 'campus-2026'));
assert.ok(!dbApi.verifyPassword(demo, 'wrong-password'));
const saved = dbApi.listAssessments(db, Number(demo.id));
assert.strictEqual(saved.length, 2);
assert.ok(saved.some((row) => row.top_role_id === 'data-analyst'));
assert.ok(saved.some((row) => row.top_role_id === 'frontend-developer'));

const created = dbApi.createUser(db, {
  name: 'Asha Rao',
  email: 'asha.rao@example.com',
  password: 'campus-2026'
});
assert.strictEqual(created.email, 'asha.rao@example.com');
dbApi.claimAssessments(db, created.id, ['demo-meera-analyst']);
const stillDemo = dbApi.getAssessment(db, 'demo-meera-analyst');
assert.notStrictEqual(Number(stillDemo.user_id), created.id, 'claim must not steal an owned assessment');

const guestId = 'guest-result-test';
dbApi.createAssessment(db, {
  id: guestId,
  userId: null,
  answers: engine.examples.analyst,
  results: analyst
});
dbApi.claimAssessments(db, created.id, [guestId]);
assert.strictEqual(Number(dbApi.getAssessment(db, guestId).user_id), created.id);
assert.ok(dbApi.deleteAssessment(db, guestId, created.id));
assert.strictEqual(dbApi.getAssessment(db, guestId), null);

db.close();
for (const suffix of ['', '-wal', '-shm']) {
  fs.rmSync(file + suffix, { force: true });
}

console.log('engine and account checks passed');