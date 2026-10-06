const catalog = require('./catalog');
const labels = require('./labels');
const { studyLine, weakestPart } = require('./engine');

const PART_LABELS = [
  ['domain', 'Domain'],
  ['skills', 'Skills you already marked'],
  ['focus', 'Kind of workday'],
  ['setting', 'Setting'],
  ['pace', 'Pace'],
  ['stage', 'Where you are now'],
  ['education', 'Study background']
];

const BANDS = {
  strong: 'Strong match',
  plausible: 'Plausible',
  stretch: 'Stretch'
};

function skillWeight(role, skillId) {
  const found = role.skills.find(([id]) => id === skillId);
  return found ? found[1] : 0;
}

function weightWord(weight) {
  if (weight >= 3) return 'Core';
  if (weight === 2) return 'Used often';
  return 'Useful';
}

function isPaidCourse(cost) {
  return typeof cost === 'string' && /^paid\b/i.test(cost);
}

function splitCourses(resources) {
  const free = [];
  const paid = [];
  for (const item of resources || []) {
    if (isPaidCourse(item.cost)) paid.push(item);
    else free.push(item);
  }
  return { free, paid };
}

function presentScored(scored) {
  const role = catalog.roleById(scored.roleId);
  const domain = catalog.domainById(role.domainId);
  const sheet = PART_LABELS.filter(([key]) => scored.parts[key]).map(([key, label]) => ({
    key,
    label,
    got: labels.formatPoints(scored.parts[key].got),
    max: scored.parts[key].max,
    note: key === 'pace' && scored.parts.pace.got === 3 ? 'Partial. You chose a mix.' : ''
  }));

  return {
    ...scored,
    rawLabel: labels.formatPoints(scored.raw),
    bandLabel: BANDS[scored.band],
    role,
    domain,
    sheet,
    weak: weakestPart(scored.parts),
    matched: scored.matchedSkillIds.map((id) => catalog.skillById(id)),
    gaps: scored.gapSkillIds.map((id) => {
      const skill = catalog.skillById(id);
      const weight = skillWeight(role, id);
      return { ...skill, weight, weightWord: weightWord(weight) };
    }),
    courses: splitCourses(role.resources)
  };
}

function presentAnswers(answers) {
  return {
    ...answers,
    stage: labels.labelOf(labels.stages, answers.stage),
    education: labels.labelOf(labels.education, answers.education),
    domains: answers.domains.map((id) => catalog.domainById(id)).filter(Boolean),
    focus: labels.labelOf(labels.focuses, answers.focus),
    setting: labels.labelOf(labels.settings, answers.setting),
    pace: labels.labelOf(labels.paces, answers.pace),
    skills: answers.skills.map((id) => catalog.skillById(id)).filter(Boolean),
    priority: answers.priority ? labels.labelOf(labels.priorities, answers.priority) : '',
    study: answers.study ? labels.labelOf(labels.studies, answers.study) : '',
    studyLine: studyLine()
  };
}

function cardFromScored(item) {
  const scored = presentScored(item);
  return {
    title: scored.role.title,
    roleId: scored.role.id,
    score: scored.score,
    why: (scored.reasons && scored.reasons[0]) || scored.role.summary,
    skills: scored.gaps.map((skill) => skill.label),
    courses: [...scored.courses.free, ...scored.courses.paid]
  };
}

function toldFromAnswers(answers) {
  const modern = answers && (answers.via || labels.educationLevels.some((item) => item.id === answers.education));
  if (modern) {
    const education = answers.educationText || labels.labelOf(labels.educationLevels, answers.education);
    const subjectNames = (answers.subjects || []).map((id) => labels.labelOf(labels.subjects, id));
    const interestNames = (answers.interests || []).map((id) => labels.labelOf(labels.interests, id));
    const skillNames = (answers.skills || []).map((id) => catalog.skillById(id)?.label).filter(Boolean);
    const stream = answers.stream && answers.stream !== 'none'
      ? labels.labelOf(labels.streams, answers.stream)
      : answers.streamOther;
    return [
      ['Education', education],
      stream ? ['Stream or branch', stream] : null,
      ['Subjects', [...subjectNames, answers.subjectsOther].filter(Boolean).join(', ')],
      ['Interests', [...interestNames, answers.interestsOther].filter(Boolean).join(', ')],
      ['Skills', [...skillNames, answers.skillsOther].filter(Boolean).join(', ')],
      ['Next step', labels.labelOf(labels.aims, answers.aim)],
      answers.currentRole ? ['Current role', answers.currentRole] : null,
      answers.years ? ['Years working', String(answers.years)] : null,
      answers.workNote && !answers.currentRole ? ['Work now', answers.workNote] : null,
      answers.note ? ['Note', answers.note] : null
    ].filter((row) => row && row[1]);
  }
  const presented = presentAnswers(answers);
  return [
    ['Where', presented.stage],
    ['Study', presented.education],
    ['Domains', presented.domains.map((item) => item.name).join(', ')],
    ['Skills', presented.skills.map((item) => item.label).join(', ')]
  ];
}

function presentAssessment(row) {
  const answers = JSON.parse(row.answers_json);
  const stored = JSON.parse(row.results_json);
  const ranked = Array.isArray(stored) ? stored : (stored.sheet || []);
  const recommendations = Array.isArray(stored)
    ? stored.slice(0, 4).map(cardFromScored)
    : (stored.recommendations || []);
  const source = Array.isArray(stored) ? 'catalogue' : stored.source || 'catalogue';
  let messages = [];
  if (row.messages_json) {
    try {
      messages = JSON.parse(row.messages_json);
    } catch (error) {
      messages = [];
    }
  }
  return {
    id: row.id,
    createdAt: row.created_at,
    when: labels.formatWhen(row.created_at),
    via: answers.via || '',
    source,
    told: toldFromAnswers(answers),
    recommendations,
    featured: ranked[0] ? presentScored(ranked[0]) : null,
    ranking: ranked.slice(0, 8).map((item, index) => ({
      rank: index + 1,
      title: catalog.roleById(item.roleId).title,
      score: item.score,
      band: item.band
    })),
    messages,
    headline: recommendations[0] ? recommendations[0].title : 'Your matches'
  };
}

function presentSavedRow(row) {
  const answers = JSON.parse(row.answers_json);
  return {
    id: row.id,
    when: labels.formatWhen(row.created_at),
    topTitle: row.top_role_title,
    topScore: row.top_score,
    via: answers.via === 'chat' ? 'Chat' : answers.via === 'form' ? 'Questionnaire' : '',
    domains: Array.isArray(answers.domains)
      ? answers.domains.map((id) => catalog.domainById(id)?.name).filter(Boolean)
      : []
  };
}

module.exports = {
  BANDS,
  weightWord,
  skillWeight,
  splitCourses,
  presentScored,
  presentAssessment,
  presentSavedRow
};