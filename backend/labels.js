const stages = [
  {
    id: 'student-ug',
    label: "In a bachelor's degree",
    hint: 'Any year. The match treats you as someone still before a first steady job.'
  },
  {
    id: 'student-pg',
    label: "In a master's or another postgraduate course",
    hint: 'Including an MBA, an M.Tech, or a second degree you started after working.'
  },
  {
    id: 'fresher',
    label: 'Finished studying, not in a steady role yet',
    hint: 'A gap after college counts. So does a string of internships.'
  },
  {
    id: 'switcher-1-3',
    label: 'Working, with about one to three years in',
    hint: 'You have a job. You are looking at a shift, or at a clearer version of the one you have.'
  },
  {
    id: 'experienced',
    label: 'Working, and past the first few years',
    hint: 'Use this if a junior title would be a step down you are willing to name out loud.'
  }
];

const education = [
  { id: 'school', label: '12th standard, or still there' },
  { id: 'diploma', label: 'Diploma or polytechnic' },
  { id: 'bachelors-tech', label: "Bachelor's in engineering, computer science, IT, or a close technical subject" },
  { id: 'bachelors-other', label: "Bachelor's in business, commerce, science, arts, or something else" },
  { id: 'masters', label: "Master's degree" }
];

const focuses = [
  {
    id: 'build',
    label: 'Making something that runs or ships',
    hint: 'Code, a page, a tool, a draft someone else will use.'
  },
  {
    id: 'analyze',
    label: 'Taking evidence apart',
    hint: 'Numbers, logs, a messy sheet, a pile of research.'
  },
  {
    id: 'people',
    label: 'Talking until the real problem shows up',
    hint: 'Users, customers, candidates, clients, a teammate who is stuck.'
  },
  {
    id: 'organize',
    label: 'Keeping work moving',
    hint: 'Owners, dates, follow-ups, the list everyone else has stopped reading.'
  }
];

const settings = [
  { id: 'independent', label: 'Mostly on my own, with a check-in when I am stuck' },
  { id: 'small-team', label: 'A small team where I can see what everyone is doing' },
  { id: 'large-team', label: 'A larger organisation, with a defined role and a manager' },
  { id: 'client-facing', label: 'In front of clients or customers for a good part of the week' }
];

const paces = [
  { id: 'structured', label: 'Give me a clear task and a way to know it is finished' },
  { id: 'mixed', label: 'A mix. Some set process, some figuring it out' },
  { id: 'ambiguous', label: 'Hand me a vague problem and let me decide what done means' }
];

const priorities = [
  { id: 'salary', label: 'Pay. The better package I can realistically reach' },
  { id: 'learning', label: 'A craft I will still be better at in two years' },
  { id: 'stability', label: 'A stable employer, and a role that is easy to explain' },
  { id: 'creativity', label: 'Work people can see, that I had a hand in shaping' },
  { id: 'impact', label: 'Being useful to a teammate or a customer in a direct way' }
];

const studies = [
  { id: 'self-learn', label: 'I will teach myself from free material' },
  { id: 'cert', label: 'I can spend time, and some money, on a certificate' },
  { id: 'degree', label: 'I am open to another diploma or degree' }
];

function labelOf(list, id) {
  const found = list.find((item) => item.id === id);
  return found ? found.label : id;
}

function formatPoints(n) {
  const rounded = Math.round(n * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatWhen(iso) {
  const date = new Date(iso);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

module.exports = {
  stages,
  education,
  focuses,
  settings,
  paces,
  priorities,
  studies,
  labelOf,
  formatPoints,
  formatWhen
};