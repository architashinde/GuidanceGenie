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
  ['education', 'Study background'],
  ['priority', 'What you want next']
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

function sortResources(resources, study) {
  const copy = resources.slice();
  if (study === 'self-learn') {
    copy.sort((a, b) => Number(a.cost !== 'Free') - Number(b.cost !== 'Free'));
  }
  return copy;
}

function presentScored(scored, study) {
  const role = catalog.roleById(scored.roleId);
  const domain = catalog.domainById(role.domainId);
  const sheet = PART_LABELS.map(([key, label]) => ({
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
    resources: sortResources(role.resources, study)
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
    priority: labels.labelOf(labels.priorities, answers.priority),
    study: labels.labelOf(labels.studies, answers.study),
    studyLine: studyLine(answers.study)
  };
}

function presentAssessment(row) {
  const answers = JSON.parse(row.answers_json);
  const results = JSON.parse(row.results_json).map((item) => presentScored(item, answers.study));
  return {
    id: row.id,
    createdAt: row.created_at,
    when: labels.formatWhen(row.created_at),
    answers: presentAnswers(answers),
    rawAnswers: answers,
    featured: results[0],
    next: results.slice(1, 4),
    rest: results.slice(4),
    all: results
  };
}

function presentSavedRow(row) {
  const answers = JSON.parse(row.answers_json);
  return {
    id: row.id,
    when: labels.formatWhen(row.created_at),
    topTitle: row.top_role_title,
    topScore: row.top_score,
    domains: answers.domains
      .map((id) => catalog.domainById(id)?.name)
      .filter(Boolean)
  };
}

module.exports = {
  BANDS,
  weightWord,
  skillWeight,
  presentScored,
  presentAssessment,
  presentSavedRow
};