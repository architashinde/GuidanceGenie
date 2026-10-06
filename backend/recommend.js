const catalog = require('./catalog');
const labels = require('./labels');
const engine = require('./engine');

const KNOWN_HOSTS = [
  'nptel.ac.in',
  'swayam.gov.in',
  'youtube.com',
  'youtu.be',
  'coursera.org',
  'edx.org',
  'freecodecamp.org',
  'khanacademy.org',
  'developer.mozilla.org',
  'developer.android.com',
  'docs.python.org',
  'python.org',
  'nodejs.org',
  'react.dev',
  'learn.microsoft.com',
  'support.microsoft.com',
  'developers.google.com',
  'cloud.google.com',
  'docs.aws.amazon.com',
  'aws.amazon.com',
  'w3.org',
  'cs50.harvard.edu',
  'ocw.mit.edu',
  'kubernetes.io',
  'postgresql.org',
  'developer.apple.com'
];

const subjectDomains = {
  maths: ['data-analytics', 'software-engineering', 'finance'],
  physics: ['software-engineering', 'data-engineering'],
  chemistry: ['data-analytics'],
  biology: ['data-analytics'],
  'computer-science': ['software-engineering', 'web-development', 'data-analytics'],
  statistics: ['data-analytics', 'business-analysis'],
  accountancy: ['finance'],
  'business-studies': ['business-analysis', 'product-management', 'operations'],
  economics: ['finance', 'business-analysis', 'consulting'],
  commerce: ['finance', 'sales', 'operations'],
  english: ['content', 'digital-marketing'],
  design: ['product-design', 'content'],
  engineering: ['software-engineering', 'cloud-infrastructure', 'devops'],
  history: ['content', 'consulting'],
  'political-science': ['consulting', 'human-resources'],
  psychology: ['human-resources', 'product-design']
};

const streamDomains = {
  science: ['data-analytics', 'software-engineering', 'data-engineering'],
  commerce: ['finance', 'business-analysis', 'sales'],
  arts: ['content', 'product-design'],
  engineering: ['software-engineering', 'cloud-infrastructure', 'devops']
};

function clip(value, max) {
  const text = typeof value === 'string' ? value.trim() : '';
  return text.slice(0, max);
}

function unique(values) {
  return [...new Set(values)];
}

function allowedIds(list, values) {
  const ids = new Set(list.map((item) => item.id));
  if (!Array.isArray(values)) return [];
  return unique(values.filter((id) => typeof id === 'string' && ids.has(id)));
}

function normalize(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Send the questionnaire as JSON.' };
  }
  const education = typeof body.education === 'string' ? body.education : '';
  if (!labels.educationLevels.some((item) => item.id === education)) {
    return { error: 'Choose Class 10, Class 12, a diploma, a degree, postgraduate study, or already working.' };
  }
  const subjects = allowedIds(labels.subjects, body.subjects);
  const subjectsOther = clip(body.subjectsOther, 300);
  if (!subjects.length && subjectsOther.length < 2) {
    return { error: 'Tick at least one subject, or type the courses you actually had.' };
  }
  const interests = allowedIds(labels.interests, body.interests);
  const interestsOther = clip(body.interestsOther, 300);
  if (!interests.length && interestsOther.length < 2) {
    return { error: 'Tick at least one interest, or type what you actually want to do.' };
  }
  const skills = allowedIds(catalog.skills, body.skills);
  const skillsOther = clip(body.skillsOther, 300);
  if (!skills.length && skillsOther.length < 2) {
    return { error: 'Tick a skill you could use now, or type one in your own words.' };
  }
  const aim = typeof body.aim === 'string' ? body.aim : '';
  if (!labels.aims.some((item) => item.id === aim)) {
    return { error: 'Choose what you want next.' };
  }
  const stream = typeof body.stream === 'string' ? body.stream : '';
  const streamOther = clip(body.streamOther, 200);
  if (stream && !labels.streams.some((item) => item.id === stream)) {
    return { error: 'Choose a stream, or type the branch in your own words.' };
  }
  const currentRole = clip(body.currentRole, 120);
  const years = clip(String(body.years == null ? '' : body.years), 2);
  if (education === 'working') {
    if (currentRole.length < 2) return { error: 'Name the role you already have.' };
    if (!/^\d{1,2}$/.test(years) || Number(years) > 60) return { error: 'Add how many years you have been working, as a number.' };
  }
  const note = clip(body.note, 500);
  return {
    profile: {
      via: 'form',
      education,
      stream,
      streamOther,
      subjects,
      subjectsOther,
      interests,
      interestsOther,
      skills,
      skillsOther,
      aim,
      currentRole,
      years: education === 'working' ? years : '',
      workNote: education === 'working' ? currentRole : clip(body.workNote, 300),
      note
    }
  };
}

function textBlob(profile) {
  return [profile.subjectsOther, profile.interestsOther, profile.skillsOther, profile.workNote]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function localRecommendations(profile) {
  const blob = textBlob(profile);
  const ranked = catalog.roles.map((role) => {
    let score = 0;
    for (const interestId of profile.interests || []) {
      const interest = labels.interests.find((item) => item.id === interestId);
      if (interest && interest.domains.includes(role.domainId)) score += 40;
    }
    for (const subjectId of profile.subjects || []) {
      const domains = subjectDomains[subjectId] || [];
      if (domains.includes(role.domainId)) score += 12;
    }
    const skillIds = new Set(profile.skills || []);
    let overlap = 0;
    for (const [skillId] of role.skills) {
      if (skillIds.has(skillId)) overlap += 1;
    }
    score += overlap * 8;
    const words = `${role.title} ${catalog.domainById(role.domainId).name}`.toLowerCase();
    if (blob && words.split(/[^a-z0-9]+/).some((word) => word.length > 4 && blob.includes(word))) {
      score += 18;
    }
    return { role, score };
  });
  ranked.sort((a, b) => b.score - a.score);
  const top = ranked.slice(0, 3);
  const education = labels.labelOf(labels.educationLevels, profile.education);
  const early = profile.education === 'class-10' || profile.education === 'class-12';
  return {
    source: 'catalogue',
    recommendations: top.map(({ role, score }) => ({
      title: role.title,
      roleId: role.id,
      score,
      why: early
        ? `${education} is early for this title. The useful part is the skill list: start there, then treat the role as a later step.`
        : `${education}. This role sits next to what you marked, and the courses below are for the skills it uses.`,
      skills: role.skills.map(([id]) => catalog.skillById(id).label),
      courses: role.resources.map(courseFromResource)
    }))
  };
}

function courseFromResource(item) {
  return {
    title: item.title,
    url: item.url,
    cost: /^paid\b/i.test(item.cost) ? 'Paid' : 'Free',
    note: item.note || ''
  };
}

function matchRole(title) {
  const needle = String(title || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  if (!needle) return null;
  return catalog.roles.find((role) => {
    const name = role.title.toLowerCase();
    return needle === name || needle.includes(name) || name.includes(needle);
  }) || null;
}

function knownCourseUrl(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '').toLowerCase();
    return KNOWN_HOSTS.some((allowed) => host === allowed || host.endsWith('.' + allowed));
  } catch (error) {
    return false;
  }
}

function courseShape(course) {
  if (!course || typeof course.title !== 'string' || typeof course.url !== 'string') return null;
  const url = course.url.trim();
  if (!/^https:\/\//i.test(url)) return null;
  const cost = /^paid\b/i.test(course.cost) ? 'Paid' : 'Free';
  return {
    title: course.title.trim().slice(0, 140),
    url,
    cost,
    note: typeof course.note === 'string' ? course.note.trim().slice(0, 240) : ''
  };
}

function cleanCourse(course) {
  const shaped = courseShape(course);
  if (!shaped || !knownCourseUrl(shaped.url)) return null;
  return shaped;
}

function enrich(recommendation) {
  const role = recommendation.roleId ? catalog.roleById(recommendation.roleId) : matchRole(recommendation.title);
  const courses = [];
  const seen = new Set();
  const push = (course, fromCatalogue) => {
    const clean = fromCatalogue ? courseShape(course) : cleanCourse(course);
    if (!clean || seen.has(clean.url)) return;
    seen.add(clean.url);
    courses.push(clean);
  };
  for (const course of recommendation.courses || []) push(course, false);
  if (role) {
    for (const item of role.resources) push(courseFromResource(item), true);
  }
  const skills = unique(
    (Array.isArray(recommendation.skills) ? recommendation.skills : [])
      .filter((item) => typeof item === 'string' && item.trim())
      .map((item) => item.trim().slice(0, 80))
  );
  if (role) {
    for (const [id] of role.skills) skills.push(catalog.skillById(id).label);
  }
  return {
    title: String(recommendation.title || (role && role.title) || 'Career').trim().slice(0, 120),
    roleId: role ? role.id : '',
    score: Number.isFinite(Number(recommendation.score)) ? Number(recommendation.score) : null,
    why: String(recommendation.why || (role && role.summary) || '').trim().slice(0, 600),
    skills: unique(skills).slice(0, 8),
    courses: courses.slice(0, 6)
  };
}

function catalogueDigest() {
  return catalog.roles.map((role) => {
    const courses = role.resources.slice(0, 2).map((item) => `${item.cost}: ${item.title} ${item.url}`).join(' | ');
    return `${role.title} (${catalog.domainById(role.domainId).name}). Courses already in the project: ${courses}`;
  }).join('\n');
}

function profileText(profile) {
  const names = (list, ids) => (ids || []).map((id) => labels.labelOf(list, id)).filter(Boolean);
  return [
    `Education: ${labels.labelOf(labels.educationLevels, profile.education)}`,
    profile.stream ? `Stream or branch: ${profile.stream === 'none' ? profile.streamOther || 'none' : labels.labelOf(labels.streams, profile.stream)}` : '',
    profile.currentRole ? `Current role: ${profile.currentRole}` : '',
    profile.years ? `Years working: ${profile.years}` : '',
    `Subjects ticked: ${names(labels.subjects, profile.subjects).join(', ') || 'none'}`,
    profile.subjectsOther ? `Subjects they typed: ${profile.subjectsOther}` : '',
    `Interests ticked: ${names(labels.interests, profile.interests).join(', ') || 'none'}`,
    profile.interestsOther ? `Interests they typed: ${profile.interestsOther}` : '',
    `Skills ticked: ${(profile.skills || []).map((id) => catalog.skillById(id)?.label).filter(Boolean).join(', ') || 'none'}`,
    profile.skillsOther ? `Skills they typed: ${profile.skillsOther}` : '',
    `What they want next: ${labels.labelOf(labels.aims, profile.aim)}`,
    profile.workNote ? `Work they described: ${profile.workNote}` : '',
    profile.note ? `Note: ${profile.note}` : ''
  ].filter(Boolean).join('\n');
}

async function fromGemini(profile) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const prompt = [
    'Return JSON only, with this shape: {"recommendations":[{"title":"","why":"","skills":[""],"courses":[{"title":"","url":"","cost":"Free","note":""}]}]}',
    'Give three careers. Use the person\'s education, subjects, and interests.',
    'You may name a career that is not in the catalogue. For those, add https course links only from public sites you know well: NPTEL, SWAYAM, YouTube, Coursera, edX, freeCodeCamp, Khan Academy, MDN, and official docs from Python, Node.js, React, Microsoft, Google, or AWS. Use both a free and a paid link when you know real pages.',
    'When the career matches a catalogue role, use that role\'s title and include its course URLs.',
    'Class 10 and Class 12 can still receive a career, with the why-text saying what to study first.',
    '',
    profileText(profile),
    '',
    'Catalogue:',
    catalogueDigest()
  ].join('\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 25000);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 1800, responseMimeType: 'application/json' }
        }),
        signal: controller.signal
      }
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) return null;
    const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
    const parsed = JSON.parse(text);
    const recommendations = (parsed.recommendations || []).slice(0, 4).map(enrich).filter((item) => item.title && item.courses.length);
    if (!recommendations.length) return null;
    return { source: 'gemini', recommendations };
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function sheetAnswers(profile) {
  const domainScore = new Map();
  const add = (id, weight) => {
    if (!catalog.domainById(id)) return;
    domainScore.set(id, (domainScore.get(id) || 0) + weight);
  };
  for (const interestId of profile.interests || []) {
    const interest = labels.interests.find((item) => item.id === interestId);
    for (const id of (interest && interest.domains) || []) add(id, 5);
  }
  for (const subjectId of profile.subjects || []) {
    for (const id of subjectDomains[subjectId] || []) add(id, 2);
  }
  for (const id of streamDomains[profile.stream] || []) add(id, 3);
  let domains = [...domainScore.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id).slice(0, 3);
  if (!domains.length) domains = ['software-engineering'];

  let education = 'bachelors-other';
  let stage = 'fresher';
  if (profile.education === 'class-10' || profile.education === 'class-12') {
    education = 'school';
    stage = 'student-ug';
  } else if (profile.education === 'diploma') {
    education = 'diploma';
    stage = 'student-ug';
  } else if (profile.education === 'degree') {
    education = profile.stream === 'engineering' || (profile.subjects || []).includes('computer-science')
      ? 'bachelors-tech'
      : 'bachelors-other';
    stage = 'student-ug';
  } else if (profile.education === 'postgraduate') {
    education = 'masters';
    stage = 'student-pg';
  } else if (profile.education === 'working') {
    const years = Number(profile.years) || 1;
    stage = years > 3 ? 'experienced' : 'switcher-1-3';
    education = profile.stream === 'engineering' ? 'bachelors-tech' : 'bachelors-other';
  }

  const picked = new Set(profile.interests || []);
  let focus = 'analyze';
  if (['software', 'web', 'design', 'ml'].some((id) => picked.has(id))) focus = 'build';
  else if (['sales', 'people', 'support'].some((id) => picked.has(id))) focus = 'people';
  else if (['business', 'product'].some((id) => picked.has(id))) focus = 'organize';

  return {
    stage,
    education,
    domains,
    focus,
    setting: 'small-team',
    pace: 'mixed',
    skills: profile.skills || [],
    note: profile.note || ''
  };
}

function sheetFor(profile) {
  return engine.rankRoles(sheetAnswers(profile));
}

async function build(profile) {
  const sheet = sheetFor(profile);
  const ai = await fromGemini(profile);
  if (ai) return { ...ai, sheet };
  return { ...localRecommendations(profile), sheet };
}

module.exports = {
  normalize,
  localRecommendations,
  enrich,
  sheetFor,
  knownCourseUrl,
  build,
  profileText,
  catalogueDigest
};