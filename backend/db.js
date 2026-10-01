const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { DatabaseSync } = require('node:sqlite');
const { examples, rankRoles } = require('./engine');
const { roleById } = require('./catalog');

const DEFAULT_PATH = path.join(__dirname, '..', 'data', 'guidancegenie.db');

function createDatabase(file = process.env.GG_DB || DEFAULT_PATH) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const db = new DatabaseSync(file);
  db.exec(`
    PRAGMA foreign_keys = ON;
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      sid TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      user_id INTEGER,
      created_at TEXT NOT NULL,
      answers_json TEXT NOT NULL,
      results_json TEXT NOT NULL,
      top_role_id TEXT NOT NULL,
      top_role_title TEXT NOT NULL,
      top_score INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE INDEX IF NOT EXISTS idx_assessments_user ON assessments(user_id, created_at);
  `);

  seedDemo(db);
  return db;
}

function seedDemo(db) {
  const email = 'meera.kulkarni@example.com';
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return;

  const hash = bcrypt.hashSync('campus-2026', 10);
  const inserted = db
    .prepare('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
    .run('Meera Kulkarni', email, hash, new Date().toISOString());
  const userId = Number(inserted.lastInsertRowid);

  const samples = [
    { id: 'demo-meera-analyst', answers: examples.analyst, daysAgo: 12 },
    { id: 'demo-meera-frontend', answers: examples.frontend, daysAgo: 2 }
  ];

  const insert = db.prepare(`
    INSERT INTO assessments (
      id, user_id, created_at, answers_json, results_json, top_role_id, top_role_title, top_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const sample of samples) {
    const results = rankRoles(sample.answers);
    const top = results[0];
    const created = new Date(Date.now() - sample.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    insert.run(
      sample.id,
      userId,
      created,
      JSON.stringify(sample.answers),
      JSON.stringify(results),
      top.roleId,
      roleById(top.roleId).title,
      top.score
    );
  }
}

function createUser(db, { name, email, password }) {
  const hash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)')
    .run(name, email, hash, new Date().toISOString());
  return findUserById(db, Number(result.lastInsertRowid));
}

function findUserByEmail(db, email) {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) || null;
}

function findUserById(db, id) {
  const row = db.prepare('SELECT id, name, email, created_at FROM users WHERE id = ?').get(id);
  return row || null;
}

function verifyPassword(user, password) {
  return bcrypt.compareSync(password, user.password_hash);
}

function createAssessment(db, { id, userId, answers, results }) {
  const top = results[0];
  const title = roleById(top.roleId).title;
  db.prepare(`
    INSERT INTO assessments (
      id, user_id, created_at, answers_json, results_json, top_role_id, top_role_title, top_score
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    id,
    userId || null,
    new Date().toISOString(),
    JSON.stringify(answers),
    JSON.stringify(results),
    top.roleId,
    title,
    top.score
  );
  return getAssessment(db, id);
}

function getAssessment(db, id) {
  return db.prepare('SELECT * FROM assessments WHERE id = ?').get(id) || null;
}

function listAssessments(db, userId) {
  return db
    .prepare('SELECT * FROM assessments WHERE user_id = ? ORDER BY created_at DESC')
    .all(userId);
}

function deleteAssessment(db, id, userId) {
  const result = db.prepare('DELETE FROM assessments WHERE id = ? AND user_id = ?').run(id, userId);
  return result.changes > 0;
}

function claimAssessments(db, userId, ids) {
  const update = db.prepare(
    'UPDATE assessments SET user_id = ? WHERE id = ? AND user_id IS NULL'
  );
  for (const id of ids) {
    update.run(userId, id);
  }
}

module.exports = {
  DEFAULT_PATH,
  createDatabase,
  createUser,
  findUserByEmail,
  findUserById,
  verifyPassword,
  createAssessment,
  getAssessment,
  listAssessments,
  deleteAssessment,
  claimAssessments
};