const catalog = require('./catalog');
const { focuses, settings, paces, stages, education, labelOf } = require('./labels');

const POINTS = {
  domainDirect: 40,
  domainAdjacent: 18,
  skills: 30,
  focus: 10,
  setting: 6,
  pace: 6,
  stage: 5,
  education: 3
};

const MAX_RAW =
  POINTS.domainDirect +
  POINTS.skills +
  POINTS.focus +
  POINTS.setting +
  POINTS.pace +
  POINTS.stage +
  POINTS.education;

const ID_LISTS = {
  stage: stages,
  education,
  focus: focuses,
  setting: settings,
  pace: paces
};

const examples = {
  analyst: {
    stage: 'student-ug',
    education: 'bachelors-tech',
    domains: ['data-analytics', 'business-analysis'],
    focus: 'analyze',
    setting: 'small-team',
    pace: 'structured',
    skills: ['sql', 'excel', 'statistics', 'writing', 'research'],
    priority: 'learning',
    study: 'self-learn',
    note: 'I liked the statistics elective more than the web project. I have not done an internship.'
  },
  frontend: {
    stage: 'student-ug',
    education: 'bachelors-tech',
    domains: ['web-development'],
    focus: 'build',
    setting: 'small-team',
    pace: 'mixed',
    skills: ['javascript', 'html-css', 'react', 'git', 'programming'],
    priority: 'creativity',
    study: 'cert',
    note: 'I built a society website with a friend. I do not know SQL yet.'
  }
};

function isId(list, value) {
  return list.some((item) => item.id === value);
}

function unique(values) {
  return [...new Set(values)];
}

function normalizeAnswers(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Send the questionnaire as JSON.' };
  }

  const answers = {
    stage: typeof body.stage === 'string' ? body.stage : '',
    education: typeof body.education === 'string' ? body.education : '',
    domains: Array.isArray(body.domains) ? unique(body.domains.filter((id) => typeof id === 'string')) : [],
    focus: typeof body.focus === 'string' ? body.focus : '',
    setting: typeof body.setting === 'string' ? body.setting : '',
    pace: typeof body.pace === 'string' ? body.pace : '',
    skills: Array.isArray(body.skills) ? unique(body.skills.filter((id) => typeof id === 'string')) : [],
    note: typeof body.note === 'string' ? body.note.trim() : ''
  };

  if (!isId(stages, answers.stage)) return { error: 'Choose where you are in study or work.' };
  if (!isId(education, answers.education)) return { error: 'Choose the study you have, or are in.' };
  if (answers.domains.length < 1 || answers.domains.length > 3) {
    return { error: 'Pick one, two, or three domains.' };
  }
  if (answers.domains.some((id) => !catalog.domainById(id))) {
    return { error: 'One of those domains is not in the catalogue.' };
  }
  if (!isId(focuses, answers.focus)) return { error: 'Choose the kind of workday you want.' };
  if (!isId(settings, answers.setting)) return { error: 'Choose the setting you want.' };
  if (!isId(paces, answers.pace)) return { error: 'Choose the pace you want.' };
  if (answers.skills.length < 1) {
    return { error: 'Tick at least one skill you could use this month. Writing, Excel, and support count.' };
  }
  if (answers.skills.some((id) => !catalog.skillById(id))) {
    return { error: 'One of those skills is not in the list.' };
  }
  if (answers.note.length > 500) return { error: 'Keep the note under 500 characters.' };

  return { answers };
}

function bandFor(score) {
  if (score >= 70) return 'strong';
  if (score >= 50) return 'plausible';
  return 'stretch';
}

function pacePoints(role, pace) {
  if (role.paces.includes(pace)) return POINTS.pace;
  if (pace === 'mixed') return 3;
  return 0;
}

function domainRelation(role, selected) {
  if (selected.includes(role.domainId)) return 'direct';
  const neighbours = new Set(catalog.neighborIds(role.domainId));
  if (selected.some((id) => neighbours.has(id))) return 'adjacent';
  return 'none';
}

function focusSentence(focusId) {
  const found = focuses.find((item) => item.id === focusId);
  return found ? found.label.charAt(0).toLowerCase() + found.label.slice(1) : focusId;
}

function buildReasons(role, answers, parts, relation) {
  const domain = catalog.domainById(role.domainId);
  const pickedNames = answers.domains
    .map((id) => catalog.domainById(id)?.name)
    .filter(Boolean);

  let domainLine;
  if (relation === 'direct') {
    domainLine = `You included ${domain.name.toLowerCase()} in your picks, so this role starts with a full domain score.`;
  } else if (relation === 'adjacent') {
    const via = pickedNames.filter((name) => name !== domain.name);
    domainLine = `${domain.name} was not one of your picks. It sits next to ${via.join(' and ') || 'a field you chose'}, which is why it is still in the list.`;
  } else {
    domainLine = `${domain.name} was not a pick and is not next to one. It is here because the rest of the sheet still scored.`;
  }

  const matched = role.skills
    .filter(([id]) => answers.skills.includes(id))
    .map(([id]) => catalog.skillById(id).label);
  const gaps = role.skills
    .filter(([id]) => !answers.skills.includes(id))
    .map(([id, weight]) => ({ label: catalog.skillById(id).label, weight }));

  let skillLine;
  if (matched.length === 0) {
    skillLine = 'None of the skills you ticked are ones this role leans on. The learning list is the whole job, not a top-up.';
  } else if (gaps.length === 0) {
    skillLine = `You marked every skill this role lists, including ${matched.slice(0, 3).join(', ')}.`;
  } else {
    skillLine = `You already marked ${matched.slice(0, 3).join(', ')}. The first gap to close is ${gaps[0].label}.`;
  }

  const focusHit = role.focuses.includes(answers.focus);
  let extra;
  if (!focusHit) {
    extra = `You asked for work that is ${focusSentence(answers.focus)}. This job is closer to ${role.focuses.map(focusSentence).join(' or ')}.`;
  } else if (parts.stage.got < POINTS.stage) {
    extra = 'People usually reach this seat from a slightly different point than the one you are at. Treat it as a direction, not next month\'s only application.';
  } else if (relation === 'direct' && parts.skills.got < POINTS.skills * 0.4) {
    extra = 'The domain kept this role near the top even though the skill overlap is thin. Read the gap list before you drop or chase it.';
  } else {
    extra = `The centre of the job matches the workday you asked for: ${focusSentence(answers.focus)}.`;
  }

  return [domainLine, skillLine, extra];
}

function scoreRole(role, answers) {
  const relation = domainRelation(role, answers.domains);
  const domainGot = relation === 'direct' ? POINTS.domainDirect : relation === 'adjacent' ? POINTS.domainAdjacent : 0;

  const totalWeight = role.skills.reduce((sum, [, weight]) => sum + weight, 0);
  const matchedWeight = role.skills.reduce(
    (sum, [id, weight]) => sum + (answers.skills.includes(id) ? weight : 0),
    0
  );
  const skillsGot = totalWeight === 0 ? 0 : (matchedWeight / totalWeight) * POINTS.skills;

  const parts = {
    domain: { got: domainGot, max: POINTS.domainDirect, relation },
    skills: { got: skillsGot, max: POINTS.skills, matchedWeight, totalWeight },
    focus: { got: role.focuses.includes(answers.focus) ? POINTS.focus : 0, max: POINTS.focus },
    setting: { got: role.settings.includes(answers.setting) ? POINTS.setting : 0, max: POINTS.setting },
    pace: { got: pacePoints(role, answers.pace), max: POINTS.pace },
    stage: { got: role.stages.includes(answers.stage) ? POINTS.stage : 1, max: POINTS.stage },
    education: { got: role.education.includes(answers.education) ? POINTS.education : 0, max: POINTS.education }
  };

  const raw = Object.values(parts).reduce((sum, part) => sum + part.got, 0);
  const score = Math.round((raw / MAX_RAW) * 100);

  return {
    roleId: role.id,
    score,
    band: bandFor(score),
    raw,
    maxRaw: MAX_RAW,
    parts,
    reasons: buildReasons(role, answers, parts, relation),
    matchedSkillIds: role.skills.filter(([id]) => answers.skills.includes(id)).map(([id]) => id),
    gapSkillIds: role.skills.filter(([id]) => !answers.skills.includes(id)).map(([id]) => id)
  };
}

function rankRoles(answers) {
  return catalog.roles
    .map((role) => scoreRole(role, answers))
    .sort((a, b) => b.score - a.score || a.roleId.localeCompare(b.roleId));
}

function studyLine() {
  return 'Courses for the skills this role uses are listed under the match, free and paid separately.';
}

function weakestPart(parts) {
  const labels = {
    domain: 'domain fit',
    skills: 'skills',
    focus: 'workday',
    setting: 'setting',
    pace: 'pace',
    stage: 'where you are now',
    education: 'study background'
  };
  return Object.entries(parts)
    .map(([key, part]) => ({ key, label: labels[key], ratio: part.max ? part.got / part.max : 0, ...part }))
    .sort((a, b) => a.ratio - b.ratio)[0];
}

module.exports = {
  POINTS,
  MAX_RAW,
  examples,
  normalizeAnswers,
  bandFor,
  scoreRole,
  rankRoles,
  studyLine,
  weakestPart,
  labelOf,
  ID_LISTS
};