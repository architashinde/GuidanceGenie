const labels = require('./labels');
const catalog = require('./catalog');
const recommend = require('./recommend');

const OPENING = 'What is the last education you finished or are in now: Class 10, Class 12, a diploma, a degree, postgraduate study, or are you already working?';

function start() {
  return {
    messages: [{ role: 'assistant', content: OPENING }],
    profile: {},
    expecting: 'education'
  };
}

function namedIn(list, lower) {
  return list
    .filter((item) => {
      const token = item.label.toLowerCase().split(/[^a-z0-9]+/).find((word) => word.length > 3);
      return token && lower.includes(token);
    })
    .map((item) => item.id);
}

function absorb(profile, expecting, text) {
  const raw = text.trim();
  const lower = raw.toLowerCase();
  if (!profile.education) {
    if (/post[\s-]?grad|master|mba|m\.?\s?tech/.test(lower)) profile.education = 'postgraduate';
    else if (/already working|i am working|i'm working|i work as|i have a job/.test(lower)) profile.education = 'working';
    else if (/diploma|polytechnic/.test(lower)) profile.education = 'diploma';
    else if (/degree|bachelor|b\.?\s?tech|b\.?\s?com|b\.?\s?sc/.test(lower)) profile.education = 'degree';
    else if (/\b12\b|12th|twelfth|higher secondary|\bhsc\b/.test(lower)) profile.education = 'class-12';
    else if (/\b10\b|10th|tenth|\bssc\b/.test(lower)) profile.education = 'class-10';
  }
  if (expecting === 'stream') {
    if (/science/.test(lower)) profile.stream = 'science';
    else if (/commerce|account/.test(lower)) profile.stream = 'commerce';
    else if (/engineer/.test(lower)) profile.stream = 'engineering';
    else if (/\barts?\b/.test(lower)) profile.stream = 'arts';
    else if (/no stream|don't have|do not have|none|not applicable/.test(lower)) profile.stream = 'none';
    else {
      profile.stream = 'none';
      profile.streamOther = raw.slice(0, 200);
    }
  }
  if (expecting === 'work') {
    profile.currentRole = raw.slice(0, 120);
    profile.workNote = raw.slice(0, 300);
    const years = raw.match(/(\d{1,2})/);
    if (years) profile.years = years[1];
  }
  if (expecting === 'subjects') {
    profile.subjects = [...new Set([...(profile.subjects || []), ...namedIn(labels.subjects, lower)])];
    profile.subjectsOther = raw.slice(0, 300);
  }
  if (expecting === 'interests') {
    profile.interests = [...new Set([...(profile.interests || []), ...namedIn(labels.interests, lower)])];
    profile.interestsOther = raw.slice(0, 300);
  }
  if (expecting === 'skills') {
    profile.skills = [...new Set([...(profile.skills || []), ...namedIn(catalog.skills, lower)])];
    profile.skillsOther = raw.slice(0, 300);
  }
  if (!profile.aim) {
    if (/not sure|unsure|don'?t know/.test(lower)) profile.aim = 'unsure';
    else if (/switch|change the work|career change/.test(lower)) profile.aim = 'switch';
    else if (/further study|study more|another degree|want to study/.test(lower)) profile.aim = 'study';
    else if (expecting === 'aim' && /job|hire|employ/.test(lower)) profile.aim = 'job';
  }
  if (profile.education === 'working' && expecting === 'education') profile.workNote = raw.slice(0, 300);
}

function missing(profile) {
  if (!profile.education) return 'education';
  if (profile.education === 'working' && !(profile.currentRole || '').trim()) return 'work';
  if (!profile.stream && !(profile.streamOther || '').trim()) return 'stream';
  if (!(profile.subjects || []).length && !(profile.subjectsOther || '').trim()) return 'subjects';
  if (!(profile.interests || []).length && !(profile.interestsOther || '').trim()) return 'interests';
  if (!(profile.skills || []).length && !(profile.skillsOther || '').trim()) return 'skills';
  if (!profile.aim) return 'aim';
  return '';
}

function question(expecting) {
  if (expecting === 'work') return 'What role are you already doing, and about how many years have you been doing it?';
  if (expecting === 'stream') return 'What stream or branch was that, if you had one: Science, Commerce, Arts, Engineering, or say you did not have one?';
  if (expecting === 'subjects') return 'Which subjects or courses were part of that? You can name them, for example mathematics, accounts, or computer science.';
  if (expecting === 'interests') return 'What do you actually want to spend your time on, even if you have not studied it? Software, data, design, finance, writing, and customers are all fine answers.';
  if (expecting === 'skills') return 'What can you already do this month? Name something concrete: a spreadsheet, a page you built, writing, or talking to customers.';
  if (expecting === 'aim') return 'What do you want next: a job, more study, a change from work you already do, or are you not sure?';
  return OPENING;
}

function scripted(state, text) {
  const profile = { ...state.profile, subjects: [...(state.profile.subjects || [])], interests: [...(state.profile.interests || [])], skills: [...(state.profile.skills || [])] };
  absorb(profile, state.expecting, text);
  const next = missing(profile);
  const messages = state.messages.concat(
    { role: 'user', content: text },
    { role: 'assistant', content: next ? question(next) : 'Here are careers that fit what you told me, with courses for the skills they need.' }
  );
  if (!next) {
    const guideProfile = {
      via: 'chat',
      education: profile.education,
      stream: profile.stream || '',
      streamOther: profile.streamOther || '',
      subjects: profile.subjects || [],
      subjectsOther: profile.subjectsOther || '',
      interests: profile.interests || [],
      interestsOther: profile.interestsOther || '',
      skills: profile.skills || [],
      skillsOther: profile.skillsOther || '',
      aim: profile.aim,
      currentRole: profile.currentRole || '',
      years: profile.years || '',
      workNote: profile.workNote || '',
      note: ''
    };
    return {
      state: { messages, profile, expecting: '' },
      reply: messages[messages.length - 1].content,
      profile: guideProfile,
      local: true
    };
  }
  return {
    state: { messages, profile, expecting: next },
    reply: question(next),
    profile: null,
    local: true
  };
}

function parseModel(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (error) {
    return null;
  }
}

async function fromGemini(messages) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  const transcript = messages.map((item) => `${item.role}: ${item.content}`).join('\n');
  const prompt = [
    'You are GuidanceGenie, a career guide. Reply as JSON: {"reply":"","ready":false,"profile":{"education":"","stream":"","currentRole":"","years":"","subjects":"","interests":"","skills":"","aim":""},"recommendations":[]}',
    'Ask one follow-up question until you know last education (class 10, class 12, diploma, degree, postgraduate, or already working), the stream or branch (science, commerce, arts, engineering, or none), subjects, interests, skills they can use now, and whether they want a job, more study, a switch, or are unsure. If they are already working, also ask the current role and how many years.',
    'When you know enough, set ready to true, put the suggestion in reply, and fill recommendations with up to 3 careers.',
    'Each recommendation is {"title":"","why":"","skills":[""],"courses":[{"title":"","url":"","cost":"Free","note":""}]}.',
    'You may name a career that is not in the catalogue. Course links must be https pages on NPTEL, SWAYAM, YouTube, Coursera, edX, freeCodeCamp, Khan Academy, MDN, or official docs from Python, Node.js, React, Microsoft, Google, or AWS. If it matches a catalogue role, reuse that title and those course URLs.',
    '',
    recommend.catalogueDigest(),
    '',
    transcript
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
    const parsed = parseModel(text);
    if (!parsed || typeof parsed.reply !== 'string' || !parsed.reply.trim()) return null;
    return parsed;
  } catch (error) {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function chatProfile(state, modelProfile) {
  const profile = {
    ...(state.profile || {}),
    subjects: [...((state.profile && state.profile.subjects) || [])],
    interests: [...((state.profile && state.profile.interests) || [])],
    skills: [...((state.profile && state.profile.skills) || [])]
  };
  const given = modelProfile || {};
  absorb(profile, 'education', String(given.education || ''));
  absorb(profile, 'stream', String(given.stream || ''));
  if (given.currentRole) profile.currentRole = String(given.currentRole).slice(0, 120);
  if (given.years) profile.years = String(given.years).replace(/\D/g, '').slice(0, 2);
  absorb(profile, 'subjects', String(given.subjects || ''));
  absorb(profile, 'interests', String(given.interests || ''));
  absorb(profile, 'skills', String(given.skills || ''));
  absorb(profile, 'aim', String(given.aim || ''));
  return {
    via: 'chat',
    education: profile.education || 'degree',
    stream: profile.stream || '',
    streamOther: profile.streamOther || '',
    subjects: profile.subjects || [],
    subjectsOther: String(given.subjects || profile.subjectsOther || '').slice(0, 300),
    interests: profile.interests || [],
    interestsOther: String(given.interests || profile.interestsOther || '').slice(0, 300),
    skills: profile.skills || [],
    skillsOther: String(given.skills || profile.skillsOther || '').slice(0, 300),
    aim: profile.aim || 'unsure',
    currentRole: profile.currentRole || '',
    years: profile.years || '',
    workNote: profile.workNote || '',
    note: '',
    educationText: given.education ? String(given.education).slice(0, 120) : ''
  };
}

async function turn(state, text) {
  const base = state && state.messages ? state : start();
  const model = await fromGemini(base.messages.concat({ role: 'user', content: text }));
  if (model) {
    const messages = base.messages.concat(
      { role: 'user', content: text },
      { role: 'assistant', content: model.reply.trim() }
    );
    if (model.ready && Array.isArray(model.recommendations) && model.recommendations.length) {
      const recommendations = model.recommendations.slice(0, 4).map(recommend.enrich).filter((item) => item.title);
      if (recommendations.length) {
        return {
          state: { messages, profile: model.profile || {}, expecting: '' },
          reply: model.reply.trim(),
          profile: chatProfile(base, model.profile),
          recommendations
        };
      }
    }
    return { state: { messages, profile: base.profile, expecting: base.expecting }, reply: model.reply.trim() };
  }
  const fallback = scripted(base, text);
  if (!fallback.profile) return { state: fallback.state, reply: fallback.reply };
  const built = recommend.localRecommendations(fallback.profile);
  return {
    state: fallback.state,
    reply: fallback.reply,
    profile: fallback.profile,
    recommendations: built.recommendations,
    source: built.source
  };
}

module.exports = { start, turn, OPENING };