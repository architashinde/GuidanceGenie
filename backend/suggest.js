const catalog = require('./catalog');
const labels = require('./labels');

const DEFAULT_MODEL = 'gemini-3.5-flash';

function brief(answers, results) {
  const top = results.slice(0, 3).map((item) => {
    const role = catalog.roleById(item.roleId);
    const gaps = (item.gapSkillIds || [])
      .slice(0, 3)
      .map((id) => catalog.skillById(id)?.label)
      .filter(Boolean);
    return `${role.title} (${item.score}/100, ${item.band}). First skill gaps: ${gaps.join(', ') || 'none listed'}.`;
  });

  return [
    `Where they are: ${labels.labelOf(labels.stages, answers.stage)}`,
    `Study: ${labels.labelOf(labels.education, answers.education)}`,
    `Domains they picked: ${answers.domains.map((id) => catalog.domainById(id)?.name).filter(Boolean).join(', ')}`,
    `Workday: ${labels.labelOf(labels.focuses, answers.focus)}; ${labels.labelOf(labels.settings, answers.setting)}; ${labels.labelOf(labels.paces, answers.pace)}`,
    `Skills they marked: ${answers.skills.map((id) => catalog.skillById(id)?.label).filter(Boolean).join(', ')}`,
    answers.note ? `Their note: ${answers.note}` : '',
    'Top matches from the recommendation logic:',
    ...top
  ]
    .filter(Boolean)
    .join('\n');
}

async function suggestCareer({ answers, results }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return { text: '', error: '' };

  const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
  const prompt = [
    'Write a career suggestion for one person, in two short paragraphs of plain prose.',
    'Use only the facts below. Recommend the top listed role, say why it fits, and name the first skill to learn.',
    'Do not invent employers, salaries, or roles that are not in the list. Do not use markdown headings or bullet lists.',
    '',
    brief(answers, results)
  ].join('\n');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': key
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.4, maxOutputTokens: 500 }
        }),
        signal: controller.signal
      }
    );
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.error && payload.error.message ? payload.error.message : `Gemini returned ${response.status}`;
      return { text: '', error: message };
    }
    const text = payload.candidates &&
      payload.candidates[0] &&
      payload.candidates[0].content &&
      payload.candidates[0].content.parts
      ? payload.candidates[0].content.parts.map((part) => part.text || '').join('').trim()
      : '';
    if (!text) return { text: '', error: 'Gemini returned an empty suggestion.' };
    return { text, error: '' };
  } catch (error) {
    const message = error.name === 'AbortError' ? 'Gemini took too long to answer.' : 'Could not reach Gemini.';
    return { text: '', error: message };
  } finally {
    clearTimeout(timer);
  }
}

module.exports = { suggestCareer, DEFAULT_MODEL };