const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { examples, rankRoles } = require('./engine');
const { roleById } = require('./catalog');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/guidancegenie';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    created_at: { type: String, required: true }
  },
  { collection: 'users' }
);

const assessmentSchema = new mongoose.Schema(
  {
    _id: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    created_at: { type: String, required: true },
    answers_json: { type: String, required: true },
    results_json: { type: String, required: true },
    top_role_id: { type: String, required: true },
    top_role_title: { type: String, required: true },
    top_score: { type: Number, required: true }
  },
  { collection: 'assessments' }
);

assessmentSchema.index({ user_id: 1, created_at: -1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Assessment = mongoose.models.Assessment || mongoose.model('Assessment', assessmentSchema);

function uriFromEnv() {
  return process.env.MONGO_URI || DEFAULT_URI;
}

function userRow(doc, withHash) {
  if (!doc) return null;
  const row = {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    created_at: doc.created_at
  };
  if (withHash) row.password_hash = doc.password_hash;
  return row;
}

function assessmentRow(doc) {
  if (!doc) return null;
  return {
    id: doc._id,
    user_id: doc.user_id ? String(doc.user_id) : null,
    created_at: doc.created_at,
    answers_json: doc.answers_json,
    results_json: doc.results_json,
    top_role_id: doc.top_role_id,
    top_role_title: doc.top_role_title,
    top_score: doc.top_score
  };
}

function isDuplicate(error) {
  return Boolean(error && (error.code === 11000 || error.code === 'UNIQUE'));
}

async function connect(uri = uriFromEnv()) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  await mongoose.connect(uri);
  await seedDemo();
  return mongoose.connection;
}

async function disconnect() {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
}

async function wipe() {
  await User.deleteMany({});
  await Assessment.deleteMany({});
}

async function seedDemo() {
  const email = 'meera.kulkarni@example.com';
  const existing = await User.findOne({ email });
  if (existing) return;

  const hash = bcrypt.hashSync('campus-2026', 10);
  let user;
  try {
    user = await User.create({
      name: 'Meera Kulkarni',
      email,
      password_hash: hash,
      created_at: new Date().toISOString()
    });
  } catch (error) {
    if (isDuplicate(error)) return;
    throw error;
  }

  const samples = [
    { id: 'demo-meera-analyst', answers: examples.analyst, daysAgo: 12 },
    { id: 'demo-meera-frontend', answers: examples.frontend, daysAgo: 2 }
  ];

  for (const sample of samples) {
    const results = rankRoles(sample.answers);
    const top = results[0];
    const created = new Date(Date.now() - sample.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    await Assessment.create({
      _id: sample.id,
      user_id: user._id,
      created_at: created,
      answers_json: JSON.stringify(sample.answers),
      results_json: JSON.stringify(results),
      top_role_id: top.roleId,
      top_role_title: roleById(top.roleId).title,
      top_score: top.score
    });
  }
}

async function createUser({ name, email, password }) {
  const hash = bcrypt.hashSync(password, 10);
  try {
    const doc = await User.create({
      name,
      email,
      password_hash: hash,
      created_at: new Date().toISOString()
    });
    return userRow(doc, false);
  } catch (error) {
    if (isDuplicate(error)) {
      const wrapped = new Error('UNIQUE constraint failed: users.email');
      wrapped.code = 'UNIQUE';
      throw wrapped;
    }
    throw error;
  }
}

async function findUserByEmail(email) {
  const doc = await User.findOne({ email: String(email || '').toLowerCase() });
  return userRow(doc, true);
}

async function findUserById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const doc = await User.findById(id).select('name email created_at');
  return userRow(doc, false);
}

function verifyPassword(user, password) {
  if (!user || !user.password_hash) return false;
  return bcrypt.compareSync(password, user.password_hash);
}

async function createAssessment({ id, userId, answers, results }) {
  const top = results[0];
  const title = roleById(top.roleId).title;
  await Assessment.create({
    _id: id,
    user_id: userId || null,
    created_at: new Date().toISOString(),
    answers_json: JSON.stringify(answers),
    results_json: JSON.stringify(results),
    top_role_id: top.roleId,
    top_role_title: title,
    top_score: top.score
  });
  return getAssessment(id);
}

async function getAssessment(id) {
  const doc = await Assessment.findById(id);
  return assessmentRow(doc);
}

async function listAssessments(userId) {
  if (!mongoose.isValidObjectId(userId)) return [];
  const docs = await Assessment.find({ user_id: userId }).sort({ created_at: -1 });
  return docs.map(assessmentRow);
}

async function deleteAssessment(id, userId) {
  if (!mongoose.isValidObjectId(userId)) return false;
  const result = await Assessment.deleteOne({ _id: id, user_id: userId });
  return result.deletedCount > 0;
}

async function claimAssessments(userId, ids) {
  if (!ids || !ids.length) return;
  if (!mongoose.isValidObjectId(userId)) return;
  await Assessment.updateMany(
    { _id: { $in: ids }, user_id: null },
    { $set: { user_id: userId } }
  );
}

module.exports = {
  DEFAULT_URI,
  connect,
  disconnect,
  wipe,
  seedDemo,
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  createAssessment,
  getAssessment,
  listAssessments,
  deleteAssessment,
  claimAssessments,
  isDuplicate
};