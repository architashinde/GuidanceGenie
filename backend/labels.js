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

const educationLevels = [
  { id: 'class-10', label: 'Class 10', hint: 'Finished, or you are in it now.' },
  { id: 'class-12', label: 'Class 12', hint: 'Higher secondary, or you are in it now.' },
  { id: 'diploma', label: 'Diploma', hint: 'Polytechnic or another diploma after school.' },
  { id: 'degree', label: 'Degree', hint: 'A bachelor’s, finished or in progress.' },
  { id: 'postgraduate', label: 'Postgraduate', hint: 'A master’s, MBA, M.Tech, or another degree after the first.' },
  { id: 'working', label: 'Already working', hint: 'A job is the main thing, whatever the last certificate was.' }
];

const subjects = [
  { id: 'maths', label: 'Mathematics' },
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'biology', label: 'Biology' },
  { id: 'computer-science', label: 'Computer science' },
  { id: 'statistics', label: 'Statistics' },
  { id: 'accountancy', label: 'Accountancy' },
  { id: 'business-studies', label: 'Business studies' },
  { id: 'economics', label: 'Economics' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'english', label: 'English' },
  { id: 'design', label: 'Design or drawing' },
  { id: 'engineering', label: 'An engineering subject' },
  { id: 'history', label: 'History' },
  { id: 'political-science', label: 'Political science' },
  { id: 'psychology', label: 'Psychology' }
];

const interests = [
  { id: 'software', label: 'Building software', domains: ['software-engineering', 'quality-assurance'] },
  { id: 'web', label: 'Websites and apps', domains: ['web-development', 'mobile-development'] },
  { id: 'data', label: 'Data and numbers', domains: ['data-analytics', 'data-engineering', 'business-analysis'] },
  { id: 'security', label: 'Keeping systems safe', domains: ['cybersecurity'] },
  { id: 'cloud', label: 'Cloud and how software is run', domains: ['cloud-infrastructure', 'devops'] },
  { id: 'design', label: 'How something looks and works', domains: ['product-design'] },
  { id: 'product', label: 'Deciding what gets built', domains: ['product-management'] },
  { id: 'ml', label: 'Machine learning as a job', domains: ['machine-learning'] },
  { id: 'marketing', label: 'Reaching an audience', domains: ['digital-marketing', 'content'] },
  { id: 'finance', label: 'Money and accounts', domains: ['finance'] },
  { id: 'people', label: 'Hiring and teams', domains: ['human-resources'] },
  { id: 'sales', label: 'Clients and selling', domains: ['sales', 'consulting'] },
  { id: 'writing', label: 'Writing and content', domains: ['content'] },
  { id: 'business', label: 'Starting or running something', domains: ['entrepreneurship', 'operations', 'project-management'] },
  { id: 'support', label: 'Helping someone who is stuck', domains: ['it-support'] }
];

const streams = [
  { id: 'science', label: 'Science' },
  { id: 'commerce', label: 'Commerce' },
  { id: 'arts', label: 'Arts' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'none', label: 'No stream or branch' }
];

const aims = [
  { id: 'job', label: 'Start a job', hint: 'The next step is work, including a first job.' },
  { id: 'study', label: 'Study further', hint: 'A course, diploma, or degree comes before the job.' },
  { id: 'switch', label: 'Change the work I already do', hint: 'You have a role. You want a different one.' },
  { id: 'unsure', label: 'Not sure yet', hint: 'Show the closest options and what each one needs.' }
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
  educationLevels,
  streams,
  subjects,
  interests,
  aims,
  labelOf,
  formatPoints,
  formatWhen
};