const session = require('express-session');

class SqliteSessionStore extends session.Store {
  constructor(db) {
    super();
    this.db = db;
    this.getStmt = db.prepare('SELECT data, expires_at FROM sessions WHERE sid = ?');
    this.setStmt = db.prepare(`
      INSERT INTO sessions (sid, data, expires_at) VALUES (?, ?, ?)
      ON CONFLICT(sid) DO UPDATE SET data = excluded.data, expires_at = excluded.expires_at
    `);
    this.destroyStmt = db.prepare('DELETE FROM sessions WHERE sid = ?');
  }

  get(sid, callback) {
    try {
      const row = this.getStmt.get(sid);
      if (!row) return callback(null, null);
      if (row.expires_at < Date.now()) {
        this.destroyStmt.run(sid);
        return callback(null, null);
      }
      callback(null, JSON.parse(row.data));
    } catch (error) {
      callback(error);
    }
  }

  set(sid, sess, callback) {
    try {
      const maxAge = sess.cookie && sess.cookie.maxAge ? sess.cookie.maxAge : 1000 * 60 * 60 * 24 * 14;
      const expires = sess.cookie && sess.cookie.expires
        ? new Date(sess.cookie.expires).getTime()
        : Date.now() + maxAge;
      this.setStmt.run(sid, JSON.stringify(sess), expires);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  destroy(sid, callback) {
    try {
      this.destroyStmt.run(sid);
      callback(null);
    } catch (error) {
      callback(error);
    }
  }

  touch(sid, sess, callback) {
    this.set(sid, sess, callback);
  }
}

module.exports = { SqliteSessionStore };