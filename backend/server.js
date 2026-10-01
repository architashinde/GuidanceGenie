const path = require('path');
const crypto = require('crypto');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const express = require('express');
const session = require('express-session');

const catalog = require('./catalog');
const labels = require('./labels');
const engine = require('./engine');
const dbApi = require('./db');
const { SqliteSessionStore } = require('./sessionStore');
const present = require('./present');

const db = dbApi.createDatabase();
const app = express();
const PORT = Number(process.env.PORT) || 4721;

if (!process.env.SESSION_SECRET) {
  console.log(
    'SESSION_SECRET is not set. Using a dev default. Fine on your own laptop. Set one in .env before anyone else can reach this server.'
  );
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.disable('x-powered-by');

app.use(express.urlencoded({ extended: false, limit: '32kb' }));
app.use(express.json({ limit: '64kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(
  session({
    store: new SqliteSessionStore(db),
    name: 'gg.sid',
    secret: process.env.SESSION_SECRET || 'dev-only-secret-change-before-sharing',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 14
    }
  })
);

function view(req, extra = {}) {
  const flash = req.session ? req.session.flash || null : null;
  if (req.session && Object.prototype.hasOwnProperty.call(req.session, 'flash')) {
    delete req.session.flash;
  }
  return {
    title: 'GuidanceGenie',
    description: 'A career questionnaire that maps your answers to roles, skills, and places to learn them.',
    user: req.session && req.session.user ? req.session.user : null,
    flash,
    page: '',
    ...extra
  };
}

function flash(req, message) {
  req.session.flash = message;
}

function publicUser(user) {
  return { id: Number(user.id), name: user.name, email: user.email };
}

function canView(req, row) {
  if (row.user_id == null) return true;
  return Boolean(req.session.user && Number(req.session.user.id) === Number(row.user_id));
}

const ID_RE = /^[A-Za-z0-9_-]{8,40}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function rememberAssessment(req, id) {
  const list = Array.isArray(req.session.pendingAssessments) ? req.session.pendingAssessments : [];
  list.push(id);
  req.session.pendingAssessments = list.slice(-10);
}

function signIn(req, user, callback) {
  const pending = Array.isArray(req.session.pendingAssessments) ? req.session.pendingAssessments.slice() : [];
  req.session.regenerate((error) => {
    if (error) return callback(error);
    req.session.user = publicUser(user);
    if (pending.length) {
      dbApi.claimAssessments(db, user.id, pending);
      req.session.pendingAssessments = pending;
    }
    req.session.save((saveError) => callback(saveError, pending));
  });
}

app.get('/', (req, res) => {
  const ranked = engine.rankRoles(engine.examples.analyst);
  const sample = present.presentScored(ranked[0], engine.examples.analyst.study);
  res.render(
    'home',
    view(req, {
      page: 'home',
      title: 'GuidanceGenie',
      groups: catalog.groupedDomains(),
      sample,
      sampleAnswers: present.presentAssessment({
        id: 'sample',
        created_at: new Date().toISOString(),
        answers_json: JSON.stringify(engine.examples.analyst),
        results_json: JSON.stringify(ranked),
        top_role_title: sample.role.title,
        top_score: sample.score
      }).answers
    })
  );
});

app.get('/domains', (req, res) => {
  res.render(
    'domains',
    view(req, {
      page: 'domains',
      title: 'Catalogue · GuidanceGenie',
      groups: catalog.groupedDomains(),
      roleCount: catalog.roles.length
    })
  );
});

app.get('/domains/:id', (req, res) => {
  const domain = catalog.domainById(req.params.id);
  if (!domain) return res.status(404).render('404', view(req, { title: 'Not found · GuidanceGenie' }));
  const neighbours = catalog.neighborIds(domain.id).map((id) => catalog.domainById(id));
  res.render(
    'domain',
    view(req, {
      page: 'domains',
      title: `${domain.name} · GuidanceGenie`,
      domain,
      roles: catalog.rolesInDomain(domain.id),
      neighbours
    })
  );
});

app.get('/roles/:id', (req, res) => {
  const role = catalog.roleById(req.params.id);
  if (!role) return res.status(404).render('404', view(req, { title: 'Not found · GuidanceGenie' }));
  const domain = catalog.domainById(role.domainId);
  const others = catalog.rolesInDomain(domain.id).filter((item) => item.id !== role.id);
  const neighbours = catalog.neighborIds(domain.id).map((id) => catalog.domainById(id));
  const skills = role.skills.map(([id, weight]) => ({
    ...catalog.skillById(id),
    weight,
    weightWord: present.weightWord(weight)
  }));

  let mine = null;
  const from = typeof req.query.from === 'string' ? req.query.from : '';
  if (ID_RE.test(from)) {
    const row = dbApi.getAssessment(db, from);
    if (row && canView(req, row)) {
      const answers = JSON.parse(row.answers_json);
      const hit = JSON.parse(row.results_json).find((item) => item.roleId === role.id);
      if (hit) mine = present.presentScored(hit, answers.study);
    }
  }

  res.render(
    'role',
    view(req, {
      page: 'domains',
      title: `${role.title} · GuidanceGenie`,
      role,
      domain,
      others,
      neighbours,
      skills,
      mine,
      from: mine ? from : ''
    })
  );
});

app.get('/how', (req, res) => {
  const ranked = engine.rankRoles(engine.examples.analyst);
  const sample = present.presentScored(ranked[0], 'self-learn');
  res.render(
    'how',
    view(req, {
      page: 'how',
      title: 'How scoring works · GuidanceGenie',
      points: engine.POINTS,
      maxRaw: engine.MAX_RAW,
      sample
    })
  );
});

app.get('/assess', (req, res) => {
  const preset = typeof req.query.domain === 'string' ? req.query.domain : '';
  res.render(
    'assess',
    view(req, {
      page: 'assess',
      title: 'Questionnaire · GuidanceGenie',
      stages: labels.stages,
      education: labels.education,
      focuses: labels.focuses,
      settings: labels.settings,
      paces: labels.paces,
      priorities: labels.priorities,
      studies: labels.studies,
      groups: catalog.groupedDomains(),
      skillGroups: catalog.skillGroups(),
      preset: catalog.domainById(preset) ? preset : ''
    })
  );
});

app.post('/api/assessments', (req, res) => {
  const parsed = engine.normalizeAnswers(req.body);
  if (parsed.error) return res.status(400).json({ error: parsed.error });

  const id = crypto.randomBytes(12).toString('base64url');
  const results = engine.rankRoles(parsed.answers);
  const userId = req.session.user ? req.session.user.id : null;
  dbApi.createAssessment(db, { id, userId, answers: parsed.answers, results });
  if (!userId) rememberAssessment(req, id);

  res.status(201).json({ id });
});

app.get('/results/:id', (req, res) => {
  if (!ID_RE.test(req.params.id)) {
    return res.status(404).render('404', view(req, { title: 'Not found · GuidanceGenie' }));
  }
  const row = dbApi.getAssessment(db, req.params.id);
  if (!row) return res.status(404).render('404', view(req, { title: 'Not found · GuidanceGenie' }));
  if (!canView(req, row)) {
    return res.status(403).render(
      'locked',
      view(req, {
        title: 'Saved assessment · GuidanceGenie',
        signedIn: Boolean(req.session.user)
      })
    );
  }
  const assessment = present.presentAssessment(row);
  res.render(
    'results',
    view(req, {
      page: 'assess',
      title: `${assessment.featured.role.title} · your matches`,
      assessment,
      saved: Boolean(row.user_id)
    })
  );
});

app.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/saved');
  res.render('register', view(req, { page: 'account', title: 'Create an account · GuidanceGenie' }));
});

app.post('/register', (req, res) => {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const confirm = typeof req.body.confirm === 'string' ? req.body.confirm : '';

  if (name.length < 2 || name.length > 80) {
    flash(req, 'Add your name, between 2 and 80 characters.');
    return res.redirect('/register');
  }
  if (!EMAIL_RE.test(email) || email.length > 200) {
    flash(req, 'Enter a valid email address.');
    return res.redirect('/register');
  }
  if (password.length < 8 || password.length > 72) {
    flash(req, 'Use a password of 8 to 72 characters. The hasher ignores anything past 72.');
    return res.redirect('/register');
  }
  if (password !== confirm) {
    flash(req, 'The two passwords do not match.');
    return res.redirect('/register');
  }
  if (dbApi.findUserByEmail(db, email)) {
    flash(req, 'That email is already registered. Sign in instead.');
    return res.redirect('/login');
  }

  let user;
  try {
    user = dbApi.createUser(db, { name, email, password });
  } catch (error) {
    if (String(error.message).includes('UNIQUE')) {
      flash(req, 'That email is already registered. Sign in instead.');
      return res.redirect('/login');
    }
    throw error;
  }

  signIn(req, user, (error, pending) => {
    if (error) throw error;
    const latest = pending[pending.length - 1];
    res.redirect(latest ? `/results/${latest}` : '/saved');
  });
});

app.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/saved');
  res.render('login', view(req, { page: 'account', title: 'Sign in · GuidanceGenie' }));
});

app.post('/login', (req, res) => {
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
  const password = typeof req.body.password === 'string' ? req.body.password : '';
  const user = dbApi.findUserByEmail(db, email);

  if (!user || !dbApi.verifyPassword(user, password)) {
    flash(req, 'That email and password do not match.');
    return res.redirect('/login');
  }

  signIn(req, user, (error, pending) => {
    if (error) throw error;
    const latest = pending[pending.length - 1];
    res.redirect(latest ? `/results/${latest}` : '/saved');
  });
});

app.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('gg.sid');
    res.redirect('/');
  });
});

app.get('/saved', (req, res) => {
  if (!req.session.user) {
    flash(req, 'Sign in to see assessments saved on your account.');
    return res.redirect('/login');
  }
  const rows = dbApi.listAssessments(db, req.session.user.id).map(present.presentSavedRow);
  res.render(
    'saved',
    view(req, {
      page: 'saved',
      title: 'Saved assessments · GuidanceGenie',
      rows
    })
  );
});

app.post('/saved/:id/delete', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  if (!ID_RE.test(req.params.id)) return res.redirect('/saved');
  const removed = dbApi.deleteAssessment(db, req.params.id, req.session.user.id);
  flash(req, removed ? 'Assessment deleted.' : 'That assessment is not on this account.');
  res.redirect('/saved');
});

app.get('/health', (req, res) => {
  res.json({
    ok: true,
    domains: catalog.domains.length,
    roles: catalog.roles.length
  });
});

app.use((req, res) => {
  res.status(404).render('404', view(req, { title: 'Not found · GuidanceGenie' }));
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).render(
    'error',
    view(req, {
      title: 'Something went wrong · GuidanceGenie',
      message: 'The server hit an error handling that request. Nothing was partially saved unless the page says so.'
    })
  );
});

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GuidanceGenie is running at http://127.0.0.1:${PORT}`);
  });
}

module.exports = app;