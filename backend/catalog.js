const SALARY_NOTE =
  'Indicative ranges for India, early in a career. City and company type move them. Not an offer.';

const domains = [
  {
    id: 'software-engineering',
    name: 'Software engineering',
    group: 'Tech',
    blurb: 'Shipping and repairing the code a product runs on.',
    overview:
      'Software engineering here means application work: features, bugs, reviews, and the occasional production incident. It is a wide door. Service companies still hire the largest fresher batches. Product companies hire fewer people and usually want a project you can walk through without reading from a slide.',
    hiring:
      'A GitHub link with one finished project beats a certificate list. Be ready to explain a bug you actually caused.'
  },
  {
    id: 'web-development',
    name: 'Web development',
    group: 'Tech',
    blurb: 'The pages and web apps people open in a browser.',
    overview:
      'Web work splits into marketing sites, internal tools, and product interfaces. Early roles often mix HTML, CSS, and a component library. The people who get stuck are usually weak at layout and at reading an API response, not at collecting frameworks.',
    hiring:
      'A small site you deployed, with a page that works on a phone, is the usual proof. Course certificates alone rarely are.'
  },
  {
    id: 'mobile-development',
    name: 'Mobile development',
    group: 'Tech',
    blurb: 'Apps on a phone, including the parts a store review will reject.',
    overview:
      'Mobile roles are fewer than web roles on most Indian campuses. The work is a real client app: offline states, permissions, a flaky network, and a release process. React Native is a common way in if you already write JavaScript. Android with Kotlin is the other frequent ask.',
    hiring:
      'Ship something to an internal track or a public store, even if the audience is your class. A repository that never ran on a device is a weaker signal.'
  },
  {
    id: 'data-analytics',
    name: 'Data analytics',
    group: 'Tech',
    blurb: 'Questions answered with tables, not with a hunch.',
    overview:
      'The title is used loosely. Some postings are Excel reporting inside operations. Others are product metrics with SQL and a dashboard. Both are real jobs. The useful question in an interview is what the team shipped last month, and who argued with the numbers.',
    hiring:
      'SQL plus a short write-up of a dataset you cleaned is the combination that keeps coming up in fresher screens.'
  },
  {
    id: 'data-engineering',
    name: 'Data engineering',
    group: 'Tech',
    blurb: 'Getting data somewhere trustworthy before anyone charts it.',
    overview:
      'Analysts ask questions of tables. Data engineers build the tables: pipelines, checks, and the boring failure when a file arrives late. Junior openings are rarer than analyst openings. People often arrive from software or from a year of analytics.',
    hiring:
      'Show a pipeline, even a small one: a script that loads a file into Postgres and fails loudly when a column is missing.'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    group: 'Tech',
    blurb: 'Finding the weak door before someone else uses it.',
    overview:
      'Junior security work is often monitoring, access reviews, and writing up what an alert actually was. It is less often the film version of breaking into a server. Labs still matter, because they teach you to read a system instead of memorising tool names.',
    hiring:
      'TryHackMe or a college lab is a fair start. Pair it with networking fundamentals or the interview stalls at the first packet question.'
  },
  {
    id: 'cloud-infrastructure',
    name: 'Cloud infrastructure',
    group: 'Tech',
    blurb: 'The servers and networks a team rents instead of racks.',
    overview:
      'Cloud roles cover accounts, networks, identity, and the bill. Freshers are often hired into support or operations tracks and grow into design work. Knowing one console properly is worth more than a slide that lists three providers.',
    hiring:
      'An AWS, Azure, or Google associate-level certificate helps at service companies. A small project you can draw on a whiteboard helps everywhere else.'
  },
  {
    id: 'devops',
    name: 'DevOps and platform',
    group: 'Tech',
    blurb: 'How code gets from a laptop to a running service without a ritual.',
    overview:
      'DevOps is a second job for a lot of people, not a first one. The day is builds, deploys, flaky tests, and permissions. Teams that hire a fresher straight into the title usually mean "you will maintain Jenkins and write shell". Ask which.',
    hiring:
      'Come from software, QA automation, or support, with one pipeline you owned. Docker is the usual first proof.'
  },
  {
    id: 'quality-assurance',
    name: 'Quality assurance',
    group: 'Tech',
    blurb: 'Proving a feature fails, in a way a developer can reproduce.',
    overview:
      'QA is not a consolation prize for people who dislike code. Good testers write cases, find the awkward path, and file a bug a stranger can follow. Automation is a later layer. Manual testing is still how many people enter.',
    hiring:
      'A bug report on a public site, written clearly, is a better portfolio piece than a tool logo. Service companies hire QA in bulk. Product teams hire fewer and ask for sharper notes.'
  },
  {
    id: 'product-design',
    name: 'Product design',
    group: 'Tech',
    blurb: 'How a screen is arranged, and whether a person can finish the task.',
    overview:
      'Product design in software is not the same as making posters. The job is flows, states, and the sentence you write when a button fails. Visual craft matters. So does sitting with a user, or at least with five classmates who did not build the thing.',
    hiring:
      'Three case studies beat thirty dribbble shots. Each one should say what you changed after someone tried to use it.'
  },
  {
    id: 'machine-learning',
    name: 'Machine learning engineering',
    group: 'Tech',
    blurb: 'Models inside a product, which is a smaller job than the posters suggest.',
    overview:
      'Most campus "AI" roles that are actually open to freshers are data cleaning, evaluation, or a model wired into an existing service. Research scientist tracks are a different, narrower door. This catalogue treats the practical track. The app itself does not train a model to recommend careers.',
    hiring:
      'Python, statistics, and one project where you can explain the failure cases. If you cannot write code yet, data analytics is the more common first job in the same companies.'
  },
  {
    id: 'it-support',
    name: 'IT support',
    group: 'Tech',
    blurb: 'Getting a colleague back to work when something breaks.',
    overview:
      'Support is tickets, accounts, devices, and a calm explanation. It is a real entry into infrastructure and security for people who were not the strongest coders in the batch. The skill that gets rewarded is closing a problem without making the user feel slow.',
    hiring:
      'Helpdesk and desktop support roles hire from diplomas and from non-CS degrees. A home lab or a clear story of fixing a lab network helps.'
  },
  {
    id: 'product-management',
    name: 'Product management',
    group: 'Business',
    blurb: 'Deciding what to build next, then living with that call.',
    overview:
      'Associate product manager seats are scarce. A lot of internships with the word product in them are note-taking for someone else\'s roadmap. The actual job is choosing, writing the problem down, and noticing when the metric you picked was vanity.',
    hiring:
      'Campus APM programs are the structured path. Off campus, people arrive from support, analytics, consulting, or engineering. A spec you wrote for a real user is the artefact to keep.'
  },
  {
    id: 'business-analysis',
    name: 'Business analysis',
    group: 'Business',
    blurb: 'Turning a messy process into something a team can change.',
    overview:
      'Business analysts sit between a team that has a process and a team that might build or buy a system for it. The work is workshops, requirements, and the argument about what "done" was supposed to mean. In IT services this title is common. In product companies the same work may be called product operations or just "the PM".',
    hiring:
      'Excel, clear writing, and one process you mapped are enough to start the conversation. SQL moves you up the pile.'
  },
  {
    id: 'digital-marketing',
    name: 'Digital marketing',
    group: 'Business',
    blurb: 'Getting the right people to a page, and knowing which effort did it.',
    overview:
      'Early marketing jobs are often execution: a set of posts, a small ad budget, a landing page, a weekly report nobody reads unless the number moved. The people who progress can say which change caused the move. Taste matters, and so does the spreadsheet.',
    hiring:
      'Run something small with a number attached, even a college fest page. "I handled social media" without a result is a weak line.'
  },
  {
    id: 'finance',
    name: 'Finance and accounting',
    group: 'Business',
    blurb: 'Reading the numbers of a business and saying what they do.',
    overview:
      'This covers financial analyst and adjacent junior accounting work, not investment banking recruiting. The day is models, reconciliations, and a note for someone who will not open the workbook. Commerce degrees are the common path. Engineers do enter corporate finance, usually through a steep Excel month.',
    hiring:
      'Be able to walk a simple P&L and explain one assumption you would not trust. A CFA level is optional at the start and is not a substitute for the spreadsheet.'
  },
  {
    id: 'human-resources',
    name: 'Human resources',
    group: 'Business',
    blurb: 'Hiring, joining, and the admin that keeps people paid.',
    overview:
      'HR coordinators run joining, letters, and the calendar of a process. Recruiters spend the day on pipelines and conversations. They are different jobs that share a department. Both punish vague writing. Neither is "I like people" as a complete skill.',
    hiring:
      'College placement teams and staffing firms are the usual first employers. A short stint screening applications for a fest or a club is legitimate experience if you can describe the criteria you used.'
  },
  {
    id: 'consulting',
    name: 'Management consulting',
    group: 'Business',
    blurb: 'Borrowed into a client problem for a few weeks or months.',
    overview:
      'Analyst hiring at the well-known firms is narrow and case-based. The day, if you get in, is slides, interviews, and a recommendation someone else will deliver. A lot of students who like the idea are better matched to business analysis inside a company, where the problem stays after the deck is done.',
    hiring:
      'Case practice is the hurdle. A certificate in "business strategy" does not replace it. Off-campus entry gets harder, not easier, after the campus window.'
  },
  {
    id: 'sales',
    name: 'Sales and business development',
    group: 'Business',
    blurb: 'Starting conversations that are supposed to end in a purchase.',
    overview:
      'A sales development role is calls, emails, and a CRM that shows whether you did them. It is measurable in a way most internships are not. People who do well are specific, and they can hear a no. It is also a common accidental landing spot for students who did not pick a track. Treat it as a choice if you take it.',
    hiring:
      'Staffing, SaaS, and ed-tech companies hire without a specific degree. Ask how quota works in month three, and what happened to the last person who missed it.'
  },
  {
    id: 'operations',
    name: 'Operations',
    group: 'Business',
    blurb: 'The work that makes an order, a drive, or a process actually happen.',
    overview:
      'Operations associates keep a repeating process from falling over: vendors, schedules, exceptions, a tracker. It shows up in supply chain, in campuses, in marketplaces, and inside large companies under duller titles. The skill is noticing the exception before it becomes a complaint.',
    hiring:
      'Internships in this area are easier to get than the title suggests, and easier to waste if you only shadowed. Keep one process you improved, with the before and after.'
  },
  {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    group: 'Business',
    blurb: 'Starting something, or being early enough that the job is whatever is on fire.',
    overview:
      'This is not a campus role with a band. It means founding a small company, or joining as one of the first few operators. The week has no template. Pay is often worse than a service-company offer, and equity is often worth nothing. It belongs in the catalogue because some people are choosing it on purpose.',
    hiring:
      'There is no placement drive. A founder will look at whether you have finished anything unsupervised. Customers, even a few, matter more than a pitch deck.'
  },
  {
    id: 'content',
    name: 'Content and communications',
    group: 'Business',
    blurb: 'Words and pages that have a job to do.',
    overview:
      'Content work ranges from campaign copy to documentation. The shared skill is cutting a paragraph until a stranger can act on it. Technical writing is the version that sits next to engineering. Content strategy is the version that sits next to marketing. Both die if the only sample is a caption.',
    hiring:
      'Bring three pieces in the form the job uses: a help article, a landing page, a thread with a point. Internships are common. Pay at the start is often modest.'
  },
  {
    id: 'project-management',
    name: 'Project management',
    group: 'Business',
    blurb: 'Dates, owners, and the chase when either slips.',
    overview:
      'A coordinator on a project is not yet a programme head. The work is the plan, the notes, the risk someone hoped to skip, and the message that a date moved. Tools matter less than whether people answer you. CAPM and similar certificates are a later polish, not the entry ticket.',
    hiring:
      'College fests, implementation projects at service firms, and operations teams are the usual first proof. "I was the leader of my team" needs a date you protected.'
  }
];

const skills = [
  { id: 'programming', group: 'Making software', label: 'Writing small programs', detail: 'Any language. You can finish a task without a tutorial open the whole time.' },
  { id: 'javascript', group: 'Making software', label: 'JavaScript', detail: 'In the browser or in Node. You have used it for something other than a single alert.' },
  { id: 'python', group: 'Making software', label: 'Python', detail: 'Scripts, coursework, or a notebook you could rerun.' },
  { id: 'html-css', group: 'Making software', label: 'HTML and CSS', detail: 'A page that lines up, including on a narrow screen.' },
  { id: 'react', group: 'Making software', label: 'React or a similar UI library', detail: 'Components, state, and a screen you built with them.' },
  { id: 'apis', group: 'Making software', label: 'HTTP APIs', detail: 'You have called one, or sketched one, and can say what the error looked like.' },
  { id: 'git', group: 'Making software', label: 'Git', detail: 'Branches and a pull request on your own project, not only git commit on the default branch.' },
  { id: 'mobile', group: 'Making software', label: 'A mobile app', detail: 'Something that ran on a phone or an emulator, not only in a browser resized small.' },
  { id: 'testing', group: 'Making software', label: 'Testing', detail: 'Written cases, or automated tests, that caught a real mistake.' },
  { id: 'sql', group: 'Data and systems', label: 'SQL', detail: 'Joins and filters you can write. A cheat sheet at the edge of the desk is fine. A cheat sheet for every clause is not.' },
  { id: 'statistics', group: 'Data and systems', label: 'Basic statistics', detail: 'Average, spread, and the nerve to say a chart does not support the claim.' },
  { id: 'data-viz', group: 'Data and systems', label: 'Charts people can read', detail: 'Excel, Sheets, or a BI tool. You have removed a chart that looked impressive and said nothing.' },
  { id: 'excel', group: 'Data and systems', label: 'Spreadsheets', detail: 'Real tables: lookups, a pivot, a sheet someone else could follow.' },
  { id: 'linux', group: 'Data and systems', label: 'A terminal', detail: 'You can move around a Unix shell without fear, and you have read a log.' },
  { id: 'networking', group: 'Data and systems', label: 'Practical networking', detail: 'IP, DNS, and HTTP well enough to debug "it is not loading".' },
  { id: 'cloud', group: 'Data and systems', label: 'One cloud console', detail: 'AWS, Azure, or Google Cloud. You have created something and found the bill, or the free-tier warning.' },
  { id: 'security', group: 'Data and systems', label: 'Security basics', detail: 'Accounts, permissions, or a lab where you broke a small system on purpose.' },
  { id: 'databases', group: 'Data and systems', label: 'Tables you designed', detail: 'Beyond a single class assignment. You can say why a column exists.' },
  { id: 'writing', group: 'Working with people', label: 'Writing people finish', detail: 'Emails, docs, or posts a reader could act on. Not only answers in an exam booklet.' },
  { id: 'speaking', group: 'Working with people', label: 'Explaining out loud', detail: 'A class, a client, a panel, or a teammate. You have done it more than once.' },
  { id: 'research', group: 'Working with people', label: 'Desk research', detail: 'You can gather sources, and you can tell which one you would not cite.' },
  { id: 'accounting', group: 'Working with people', label: 'Reading accounts', detail: 'A P&L, a simple set of entries, or a budget you reconciled.' },
  { id: 'seo', group: 'Working with people', label: 'Search basics', detail: 'You have changed a page for search and looked at what happened.' },
  { id: 'ads', group: 'Working with people', label: 'A small campaign', detail: 'You have spent a budget, or analysed one, and can name the waste.' },
  { id: 'crm', group: 'Working with people', label: 'A pipeline or CRM', detail: 'You have tracked leads, applications, or tickets in a tool, not in your head.' },
  { id: 'negotiation', group: 'Working with people', label: 'A negotiated outcome', detail: 'Price, scope, a date, or a role. Someone pushed back and the result changed.' },
  { id: 'support', group: 'Working with people', label: 'Handling questions', detail: 'Users, customers, or classmates, where you had to close the loop.' },
  { id: 'design', group: 'Working with people', label: 'Visual layout', detail: 'Figma, a similar tool, or careful work in slides. Someone has critiqued it.' },
  { id: 'recruiting', group: 'Working with people', label: 'Screening people', detail: 'You have read applications or run an interview against criteria you could repeat.' },
  { id: 'planning', group: 'Working with people', label: 'A plan other people used', detail: 'Dates and owners, and at least one moment when the plan was wrong and you updated it.' }
];

const roles = [
  {
    id: 'software-engineer',
    title: 'Software engineer',
    domainId: 'software-engineering',
    summary:
      'Writes and fixes application code that other people run. The week is tickets, reviews, and the occasional outage. It is not a blank-file tutorial.',
    week: [
      'Read a bug or a small feature and find the part of the code that owns it.',
      'Write the change, cover the risky bit with a test, and put it up for review.',
      'Say, in planning, what is actually left. Include the part you hoped to skip.',
      'Help someone reproduce a failure from a log or a screenshot.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'large-team'],
    paces: ['mixed', 'ambiguous'],
    priorities: ['learning', 'salary', 'creativity'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['programming', 3],
      ['git', 2],
      ['apis', 2],
      ['javascript', 1],
      ['python', 1],
      ['testing', 1],
      ['sql', 1]
    ],
    salary: {
      early: '₹3.5–9 LPA',
      later: '₹12–24 LPA after a few years, with a wide gap between firms',
      note: 'Service-company offers often start nearer the bottom of the early band. Product companies sit higher, and many freshers never see that end. ' + SALARY_NOTE
    },
    entry: [
      'One project you can run, with a README that says how.',
      'Be able to talk through a bug, including the wrong guess you made first.',
      'Campus drives at service firms are still the largest door. Off-campus product roles want the project more than the college name, and still reject most people.'
    ],
    resources: [
      { title: 'The Odin Project, Foundations', url: 'https://www.theodinproject.com/paths/foundations/courses/foundations', kind: 'Course', cost: 'Free', note: 'A long path. Finish a slice and deploy it before you collect the next framework.' },
      { title: 'CS50x', url: 'https://cs50.harvard.edu/x/', kind: 'Course', cost: 'Free', note: 'The problem sets are the point. The certificate is not.' },
      { title: 'GitHub, about Git', url: 'https://docs.github.com/en/get-started/using-git/about-git', kind: 'Docs', cost: 'Free', note: 'Short, and enough to stop treating Git like a save button.' }
    ]
  },
  {
    id: 'backend-engineer',
    title: 'Backend engineer',
    domainId: 'software-engineering',
    summary:
      'Builds the part of a product users do not see: requests, stored data, and the rules in between. A good week is uneventful. A bad week is a slow query and a queue nobody owns.',
    week: [
      'Trace a request from the route to the query and back.',
      'Change a rule in the data, and write down what old rows will do.',
      'Read an error from production without guessing the cause in the first minute.',
      'Review someone else\'s endpoint for the case they did not test.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'independent', 'large-team'],
    paces: ['mixed', 'ambiguous'],
    priorities: ['learning', 'salary', 'stability'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['programming', 3],
      ['apis', 3],
      ['sql', 2],
      ['databases', 2],
      ['python', 1],
      ['linux', 1],
      ['git', 1]
    ],
    salary: {
      early: '₹4–10 LPA',
      later: '₹14–28 LPA in product teams, less in many services roles',
      note: SALARY_NOTE
    },
    entry: [
      'Build a small API with a real database, not an in-memory list.',
      'Be ready to draw the tables and say what happens when two people edit the same row.',
      'This title is often the same fresher seat as software engineer. The split becomes real after you join.'
    ],
    resources: [
      { title: 'MDN, an overview of HTTP', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview', kind: 'Docs', cost: 'Free', note: 'Read it once slowly. Status codes stop being superstition.' },
      { title: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', kind: 'Docs', cost: 'Free', note: 'Install it locally. A hosted toy database hides the failures you need to see.' },
      { title: 'Node.js, getting started', url: 'https://nodejs.org/en/learn/getting-started/introduction-to-nodejs', kind: 'Docs', cost: 'Free', note: 'Enough to put an API on a port. Pair it with the Postgres tutorial.' }
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend developer',
    domainId: 'web-development',
    summary:
      'Builds the screens people use, and is the person who notices when a layout breaks on a phone. The job is CSS, state, and the API that did not return what the mock said.',
    week: [
      'Turn a design, or a rough brief, into a screen with empty and error states.',
      'Fix a layout bug that only shows up at one width.',
      'Wire a form to an API and handle the failure, not only the happy JSON.',
      'Read a review comment about accessibility and actually tab through the page.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'large-team'],
    paces: ['mixed', 'structured'],
    priorities: ['creativity', 'learning', 'salary'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['html-css', 3],
      ['javascript', 3],
      ['react', 2],
      ['git', 1],
      ['apis', 1],
      ['design', 1]
    ],
    salary: {
      early: '₹3–8 LPA',
      later: '₹10–22 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Deploy one site. A localhost screenshot is weaker than a URL.',
      'Be able to explain a layout without saying "I used a template".',
      'Agencies and product teams both hire. Agencies will ask you to be faster. Product teams will ask you to be more careful.'
    ],
    resources: [
      { title: 'MDN, learn web development', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development', kind: 'Course', cost: 'Free', note: 'Start with HTML and CSS even if you have already touched React.' },
      { title: 'React, Quick Start', url: 'https://react.dev/learn', kind: 'Docs', cost: 'Free', note: 'Official and current. Skip the third-party crash course until this makes sense.' },
      { title: 'web.dev, learn design', url: 'https://web.dev/learn/design', kind: 'Course', cost: 'Free', note: 'Responsive layout, taught without a framework in the way.' }
    ]
  },
  {
    id: 'mobile-developer',
    title: 'Mobile app developer',
    domainId: 'mobile-development',
    summary:
      'Builds an app people install. The work includes permissions, offline moments, and a release checklist. It is a smaller hiring market than web, and the proof is a build on a device.',
    week: [
      'Implement a screen and the loading state the design forgot.',
      'Hit an API from the device and deal with a timeout.',
      'Fix a crash from a stack trace, on a phone that is not the one you own.',
      'Prepare a build for someone else to install.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'independent'],
    paces: ['mixed', 'ambiguous'],
    priorities: ['creativity', 'learning', 'salary'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['mobile', 3],
      ['programming', 3],
      ['apis', 2],
      ['git', 1],
      ['testing', 1],
      ['design', 1]
    ],
    salary: {
      early: '₹3.5–9 LPA',
      later: '₹12–24 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Pick Android or React Native and finish one flow, not a home screen.',
      'Install the build on a phone that is not the emulator.',
      'If you are choosing a first track and you only want a job quickly, web hiring is wider.'
    ],
    resources: [
      { title: 'Android basics', url: 'https://developer.android.com/courses', kind: 'Course', cost: 'Free', note: 'Google\'s own path. Do the codelabs on a device.' },
      { title: 'React Native environment setup', url: 'https://reactnative.dev/docs/environment-setup', kind: 'Docs', cost: 'Free', note: 'Only if you already write JavaScript. It is a poor first language.' },
      { title: 'Swift guided tour', url: 'https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/', kind: 'Docs', cost: 'Free', note: 'The Apple-side door. You will need a Mac for the real tooling.' }
    ]
  },
  {
    id: 'data-analyst',
    title: 'Data analyst',
    domainId: 'data-analytics',
    summary:
      'Answers a business question with a table and a paragraph. Some seats are product metrics. Some are weekly reporting in operations. The honest ones tell you which, before you join.',
    week: [
      'Take a vague question and turn it into a count you can defend.',
      'Write the SQL, then check it against a number someone already trusts.',
      'Make one chart and delete two.',
      'Write what the number does not say, in case a slide tries to.'
    ],
    focuses: ['analyze'],
    settings: ['small-team', 'large-team', 'client-facing'],
    paces: ['structured', 'mixed'],
    priorities: ['learning', 'stability', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['sql', 3],
      ['excel', 3],
      ['statistics', 2],
      ['data-viz', 2],
      ['writing', 2],
      ['python', 1]
    ],
    salary: {
      early: '₹3.5–7 LPA',
      later: '₹8–16 LPA',
      note: 'Analyst titles inside IT services can start lower and mean reporting. ' + SALARY_NOTE
    },
    entry: [
      'SQLBolt or an equivalent, then a dataset you can talk about for ten minutes.',
      'Write the conclusion in sentences. A dashboard with no sentence is not analysis.',
      'Commerce and science graduates get this seat, not only engineers. The SQL is the common filter.'
    ],
    resources: [
      { title: 'SQLBolt', url: 'https://sqlbolt.com/', kind: 'Practice', cost: 'Free', note: 'Do the lessons in a sitting or two, then repeat the joins without looking.' },
      { title: 'Kaggle Learn', url: 'https://www.kaggle.com/learn', kind: 'Course', cost: 'Free', note: 'Python and Pandas if you want a second tool. SQL still comes first for most junior seats.' },
      { title: 'Google Data Analytics certificate', url: 'https://www.coursera.org/professional-certificates/google-data-analytics', kind: 'Course', cost: 'Paid', note: 'Useful structure if you want a paced course. It will not replace a SQL screen.' }
    ]
  },
  {
    id: 'data-engineer',
    title: 'Data engineer',
    domainId: 'data-engineering',
    summary:
      'Builds the pipeline that analysts trust. The prestige is lower than the posters, and the work is more useful: schemas, retries, and a check that fails when a column goes missing.',
    week: [
      'Find why yesterday\'s table is late or wrong.',
      'Add a column without breaking the three reports that use the old one.',
      'Write a check that would have caught the last incident.',
      'Explain to an analyst why their query is slow, without contempt.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'large-team'],
    paces: ['mixed', 'structured'],
    priorities: ['learning', 'salary', 'stability'],
    stages: ['student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['sql', 3],
      ['python', 3],
      ['databases', 2],
      ['programming', 2],
      ['linux', 1],
      ['cloud', 1]
    ],
    salary: {
      early: '₹5–12 LPA',
      later: '₹14–30 LPA',
      note: 'True junior openings are fewer than analyst openings. The early band assumes you already write code. ' + SALARY_NOTE
    },
    entry: [
      'A script that loads a file into Postgres and refuses a bad row.',
      'Most people arrive after software or analytics, not as a first title out of college.',
      'If the posting says data engineer and the test is only Excel, it is an analyst role with a grander name.'
    ],
    resources: [
      { title: 'PostgreSQL tutorial', url: 'https://www.postgresql.org/docs/current/tutorial.html', kind: 'Docs', cost: 'Free', note: 'Schemas and constraints. The tutorial is short on purpose.' },
      { title: 'Python tutorial', url: 'https://docs.python.org/3/tutorial/', kind: 'Docs', cost: 'Free', note: 'The official one. Enough language to move files and talk to a database.' },
      { title: 'dbt, getting started', url: 'https://docs.getdbt.com/docs/introduction', kind: 'Docs', cost: 'Free', note: 'A common way teams transform tables. Read it after you can write SQL.' }
    ]
  },
  {
    id: 'security-analyst',
    title: 'Security analyst',
    domainId: 'cybersecurity',
    summary:
      'Watches for the thing that should not have happened, and writes it up so someone can act. Junior work is alerts, access, and hygiene. Theatrically breaking in is a smaller slice than YouTube suggests.',
    week: [
      'Triage an alert and decide whether it is noise.',
      'Check who has access to something they should not.',
      'Write an incident note a non-specialist can follow.',
      'Spend time in a lab so the tools are not magic.'
    ],
    focuses: ['analyze'],
    settings: ['large-team', 'small-team'],
    paces: ['structured', 'mixed'],
    priorities: ['stability', 'learning', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['security', 3],
      ['networking', 3],
      ['linux', 2],
      ['programming', 1],
      ['writing', 1]
    ],
    salary: {
      early: '₹3.5–8 LPA',
      later: '₹10–20 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Networking first, then a beginner lab path. Tool names without fundamentals fall apart in the interview.',
      'SOC and audit-support roles are the common fresher seats.',
      'A computer science degree helps and is not a hard gate at every firm.'
    ],
    resources: [
      { title: 'TryHackMe, Pre Security', url: 'https://tryhackme.com/path/outline/presecurity', kind: 'Practice', cost: 'Free tier', note: 'A guided lab. Do not stop at the first badge and call yourself a pentester.' },
      { title: 'Cisco, Introduction to Cybersecurity', url: 'https://www.netacad.com/courses/introduction-to-cybersecurity', kind: 'Course', cost: 'Free', note: 'A plain vocabulary course. Useful before you pay for anything.' },
      { title: 'Linux Journey', url: 'https://linuxjourney.com/', kind: 'Course', cost: 'Free', note: 'You will live in a shell. Learn it before the security tools.' }
    ]
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud engineer',
    domainId: 'cloud-infrastructure',
    summary:
      'Looks after accounts, networks, identity, and the bill for servers the company does not own. Junior seats are often support with a cloud logo. The grown-up version designs the account so the next person cannot break it by accident.',
    week: [
      'Answer a ticket about access or a service that will not start.',
      'Draw the path from a user to a server, including the part that is private.',
      'Notice a cost spike before finance does.',
      'Change one setting in a test account and write down the blast radius.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'large-team'],
    paces: ['mixed', 'structured'],
    priorities: ['salary', 'learning', 'stability'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['cloud', 3],
      ['linux', 2],
      ['networking', 2],
      ['security', 1],
      ['programming', 1],
      ['git', 1]
    ],
    salary: {
      early: '₹4–9 LPA',
      later: '₹12–26 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Pick one provider and use the free tier until you can explain a VPC without the slide.',
      'An associate certificate helps with service-company screens.',
      'Support engineering is an honest first title on the way here.'
    ],
    resources: [
      { title: 'AWS Skill Builder, digital training', url: 'https://aws.amazon.com/training/digital/', kind: 'Course', cost: 'Free courses in the catalogue', note: 'Filter for free. Cloud Practitioner material is the right altitude to start.' },
      { title: 'Google Cloud Skills Boost, Cloud Essentials', url: 'https://www.cloudskillsboost.google/course_templates/11', kind: 'Course', cost: 'Free tier limits apply', note: 'A second console, after you can already find your way around one.' },
      { title: 'Linux Journey', url: 'https://linuxjourney.com/', kind: 'Course', cost: 'Free', note: 'The machine is still Linux, even when a console hides it.' }
    ]
  },
  {
    id: 'devops-engineer',
    title: 'DevOps engineer',
    domainId: 'devops',
    summary:
      'Keeps the path from a merge to a running service short and repeatable. The day is pipelines, environments, and a failure that only happens when someone else deploys. It is a hard first job and a common second one.',
    week: [
      'Unstick a build that passed yesterday.',
      'Tighten a deploy so a human is not copying files.',
      'Trace a bad release and say how you would catch it next time.',
      'Say no to a permission that was requested "just for today".'
    ],
    focuses: ['build'],
    settings: ['small-team', 'large-team'],
    paces: ['mixed', 'ambiguous'],
    priorities: ['learning', 'salary', 'stability'],
    stages: ['fresher', 'student-pg', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'masters'],
    skills: [
      ['linux', 3],
      ['git', 2],
      ['cloud', 2],
      ['programming', 2],
      ['networking', 1],
      ['testing', 1]
    ],
    salary: {
      early: '₹5–12 LPA',
      later: '₹15–32 LPA',
      note: 'The early band assumes some related experience. A fresher title that pays at the bottom may be pipeline maintenance. ' + SALARY_NOTE
    },
    entry: [
      'Dockerise one app and deploy it with a script you can re-run.',
      'People usually arrive from software, QA automation, or systems support.',
      'If a fresher posting lists five orchestrators, it is a wishlist. Ask what you would touch in the first month.'
    ],
    resources: [
      { title: 'Docker, get started', url: 'https://docs.docker.com/get-started/', kind: 'Docs', cost: 'Free', note: 'Run the guide on your machine. Stop when you can explain an image versus a container.' },
      { title: 'GitHub Actions, learn', url: 'https://docs.github.com/en/actions/learn-github-actions', kind: 'Docs', cost: 'Free', note: 'Put the Docker build in a workflow. That is a portfolio piece.' },
      { title: 'Kubernetes basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/', kind: 'Docs', cost: 'Free', note: 'Read it after Docker. Learning the cluster first is how people get lost.' }
    ]
  },
  {
    id: 'qa-engineer',
    title: 'QA engineer',
    domainId: 'quality-assurance',
    summary:
      'Finds the way a feature fails, and writes it so a developer can repeat the failure. Automation comes after you can already design a case. The role is a real craft, including at companies that still treat it as a leftover.',
    week: [
      'Read a story and list the cases the author did not write.',
      'File a bug with steps, expected, actual, and the build you used.',
      'Retest a fix without assuming the adjacent screen is fine.',
      'Add one automated check for a bug that already escaped once.'
    ],
    focuses: ['analyze'],
    settings: ['small-team', 'large-team'],
    paces: ['structured', 'mixed'],
    priorities: ['stability', 'learning', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['testing', 3],
      ['writing', 2],
      ['apis', 1],
      ['html-css', 1],
      ['programming', 1],
      ['planning', 1]
    ],
    salary: {
      early: '₹2.5–6 LPA',
      later: '₹8–16 LPA, higher if you automate',
      note: SALARY_NOTE
    },
    entry: [
      'Write three bug reports on a product you use. Clarity is the portfolio.',
      'Service companies hire in volume. Read the posting for "manual" versus "automation" before you celebrate the title.',
      'A non-CS degree is common and not a problem if the notes are good.'
    ],
    resources: [
      { title: 'Playwright, introduction', url: 'https://playwright.dev/docs/intro', kind: 'Docs', cost: 'Free', note: 'A modern way to automate a browser. Learn one tool, not five.' },
      { title: 'Ministry of Testing, software testing', url: 'https://www.ministryoftesting.com/software-testing', kind: 'Reading', cost: 'Free articles', note: 'A practitioner\'s view of the job, which is more useful than a tool roundup.' },
      { title: 'ISTQB Foundation Level', url: 'https://www.istqb.org/certifications/certified-tester-foundation-level', kind: 'Cert info', cost: 'Paid exam', note: 'Some service firms ask for it. Read the syllabus ideas first. The badge can wait until a job requires it.' }
    ]
  },
  {
    id: 'product-designer',
    title: 'Product designer',
    domainId: 'product-design',
    summary:
      'Decides how a task looks and behaves on a screen, then changes it after a person tries to finish the task. Visual skill is necessary. It is not the whole job.',
    week: [
      'Sketch a flow, including the error and the empty state.',
      'Watch someone use it without helping them.',
      'Revise the screen and say what you threw away.',
      'Hand a developer a spec that includes spacing, not only a picture.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'client-facing'],
    paces: ['ambiguous', 'mixed'],
    priorities: ['creativity', 'learning', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['design', 3],
      ['research', 2],
      ['html-css', 1],
      ['writing', 1],
      ['speaking', 1]
    ],
    salary: {
      early: '₹3–8 LPA',
      later: '₹10–22 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Three case studies. Each needs a user, a change, and what you would redo.',
      'A poster portfolio will be read as graphic design, which is a different market.',
      'Design degrees help and are not mandatory when the case studies are specific.'
    ],
    resources: [
      { title: 'Nielsen Norman, 10 usability heuristics', url: 'https://www.nngroup.com/articles/ten-usability-heuristics/', kind: 'Reading', cost: 'Free', note: 'Short, and still the fastest way to critique your own screen.' },
      { title: 'Figma help centre', url: 'https://help.figma.com/hc/en-us', kind: 'Docs', cost: 'Free', note: 'Learn the tool on a real flow, not on a button exercise.' },
      { title: 'Google UX Design certificate', url: 'https://www.coursera.org/professional-certificates/google-ux-design', kind: 'Course', cost: 'Paid', note: 'A structured path if you want pacing. The portfolio projects are the part that matters.' }
    ]
  },
  {
    id: 'ml-engineer',
    title: 'Machine learning engineer',
    domainId: 'machine-learning',
    summary:
      'Puts a model into a product or a reporting flow, and checks when it is wrong. A lot of junior time is data, evaluation, and plumbing. It is a poor first bet if you do not write code yet.',
    week: [
      'Look at where a model fails, not only at the average score.',
      'Clean a dataset and write down what you dropped.',
      'Wire a saved model into a small service, or explain why you should not.',
      'Tell a teammate, in plain language, what the system will not catch.'
    ],
    focuses: ['analyze'],
    settings: ['small-team', 'independent', 'large-team'],
    paces: ['ambiguous', 'mixed'],
    priorities: ['learning', 'salary'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['bachelors-tech', 'masters'],
    skills: [
      ['python', 3],
      ['statistics', 3],
      ['programming', 2],
      ['sql', 1],
      ['data-viz', 1]
    ],
    salary: {
      early: '₹6–14 LPA where the role is real',
      later: '₹16–35 LPA, with a long tail of titles that are ordinary software',
      note: 'Many campus posters say AI and hire for software or analytics. Ask what model is in production. ' + SALARY_NOTE
    },
    entry: [
      'Python and statistics before any framework marathon.',
      'One project with a baseline, a result, and a note on when it fails.',
      'If this score is high but you have little code, look at data analyst as the door that is actually open.'
    ],
    resources: [
      { title: 'Python tutorial', url: 'https://docs.python.org/3/tutorial/', kind: 'Docs', cost: 'Free', note: 'The language comes before the library.' },
      { title: 'Kaggle, Intro to Machine Learning', url: 'https://www.kaggle.com/learn/intro-to-machine-learning', kind: 'Course', cost: 'Free', note: 'Short and practical. Keep the failure cases, not only the score.' },
      { title: 'Google Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course', kind: 'Course', cost: 'Free', note: 'A clearer map of the ideas than a random playlist. This career app does not use these models.' }
    ]
  },
  {
    id: 'it-support',
    title: 'IT support specialist',
    domainId: 'it-support',
    summary:
      'Gets a person back to work. Tickets, accounts, devices, and a network that "was fine yesterday". It is a legitimate start in technology, including for people who do not want to write application code.',
    week: [
      'Close a ticket, and write what you did so the next person is not guessing.',
      'Reset access without handing out more permission than the job needs.',
      'Sit with a user who is frustrated and finish the sentence for them.',
      'Escalate once, with the evidence, instead of three times with a shrug.'
    ],
    focuses: ['people'],
    settings: ['large-team', 'client-facing', 'small-team'],
    paces: ['structured'],
    priorities: ['stability', 'impact', 'salary'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['support', 3],
      ['networking', 2],
      ['linux', 1],
      ['security', 1],
      ['writing', 1],
      ['excel', 1]
    ],
    salary: {
      early: '₹2–4.5 LPA',
      later: '₹5–10 LPA, more if you move into systems or security',
      note: SALARY_NOTE
    },
    entry: [
      'A diploma is a common and sufficient start.',
      'Tell a story of a problem you diagnosed, not only a password you reset.',
      'This is also a side door into cloud and security if you keep learning the systems, not only the script.'
    ],
    resources: [
      { title: 'Google IT Support certificate', url: 'https://www.coursera.org/professional-certificates/google-it-support', kind: 'Course', cost: 'Paid', note: 'A well-known paced path for people starting from zero. The labs are the part to finish.' },
      { title: 'Professor Messer, free training', url: 'https://www.professormesser.com/', kind: 'Course', cost: 'Free videos', note: 'CompTIA A+ material, taught plainly. Check that the exam version matches if you later sit it.' },
      { title: 'Linux Journey', url: 'https://linuxjourney.com/', kind: 'Course', cost: 'Free', note: 'Support work reaches a terminal faster than people expect.' }
    ]
  },
  {
    id: 'associate-pm',
    title: 'Associate product manager',
    domainId: 'product-management',
    summary:
      'Helps decide what a team builds next, and writes the problem clearly enough that design and engineering can argue with it. True APM seats are few. A lot of "product intern" posts are coordination.',
    week: [
      'Write the user problem in a page, before anyone opens a ticket tool.',
      'Sit in on a support call or read twenty tickets.',
      'Cut a scope. Say what will not ship.',
      'Check, after release, whether the metric you named was the right one.'
    ],
    focuses: ['organize'],
    settings: ['small-team', 'client-facing'],
    paces: ['ambiguous', 'mixed'],
    priorities: ['impact', 'learning', 'creativity'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['writing', 3],
      ['research', 2],
      ['speaking', 2],
      ['planning', 2],
      ['data-viz', 1],
      ['design', 1]
    ],
    salary: {
      early: '₹6–14 LPA in structured APM programs',
      later: '₹16–35 LPA',
      note: 'Outside those programs the title is often unpaid coordination or a much lower band. Ask who decides what ships. ' + SALARY_NOTE
    },
    entry: [
      'A written spec for a product you use, including what you would not build.',
      'Campus APM programs are the clean path. They are also competitive out of proportion to the headcount.',
      'Analytics, support, consulting, and engineering are the longer paths into the same work.'
    ],
    resources: [
      { title: 'SVPG, product versus feature teams', url: 'https://www.svpg.com/product-vs-feature-teams/', kind: 'Reading', cost: 'Free', note: 'One essay that explains why some product jobs feel empty.' },
      { title: 'Atlassian, product management', url: 'https://www.atlassian.com/agile/product-management', kind: 'Reading', cost: 'Free', note: 'A practical overview of the artefacts. Ignore the parts that are an ad for the tool.' },
      { title: 'Intercom on Jobs to be Done', url: 'https://www.intercom.com/blog/jobs-to-be-done/', kind: 'Reading', cost: 'Free', note: 'A way to write a problem that is not "add a button".' }
    ]
  },
  {
    id: 'business-analyst',
    title: 'Business analyst',
    domainId: 'business-analysis',
    summary:
      'Sits between a team that runs a process and a team that might change the system under it. The output is a requirement someone can build, test, or reject. Meetings are the job, not a distraction from it.',
    week: [
      'Run a workshop and leave with decisions, not only notes.',
      'Write a requirement and the case that would prove it failed.',
      'Map a process, including the workaround people actually use.',
      'Translate a developer\'s constraint back into the business\'s language.'
    ],
    focuses: ['analyze'],
    settings: ['large-team', 'client-facing', 'small-team'],
    paces: ['structured', 'mixed'],
    priorities: ['stability', 'learning', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['excel', 3],
      ['writing', 2],
      ['sql', 2],
      ['speaking', 2],
      ['research', 1],
      ['planning', 1]
    ],
    salary: {
      early: '₹3.5–8 LPA',
      later: '₹10–18 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Map one process you know, on paper, with the exceptions.',
      'Excel is assumed. SQL is what separates you in the second round at a lot of firms.',
      'This is the closer day-to-day, for most people, than management consulting.'
    ],
    resources: [
      { title: 'IIBA, business analysis resources', url: 'https://www.iiba.org/business-analysis-resources/', kind: 'Reading', cost: 'Free resources, paid membership', note: 'Use the public material to learn the vocabulary. You do not need a certificate to apply.' },
      { title: 'SQLBolt', url: 'https://sqlbolt.com/', kind: 'Practice', cost: 'Free', note: 'The fastest way to stop being the analyst who waits for someone else to pull the number.' },
      { title: 'Microsoft Excel help', url: 'https://support.microsoft.com/excel', kind: 'Docs', cost: 'Free', note: 'Look up pivot tables and lookups and use them on a sheet you already have.' }
    ]
  },
  {
    id: 'marketing-associate',
    title: 'Digital marketing associate',
    domainId: 'digital-marketing',
    summary:
      'Runs the unglamorous layer of marketing: pages, posts, a small budget, and a report on what moved. The job gets better when you can point at a change and a number in the same sentence.',
    week: [
      'Draft a page or a set of posts for one audience, not for "everyone".',
      'Check yesterday\'s spend and kill the part that did nothing.',
      'Read the search or analytics report and write three lines a founder would believe.',
      'Ask for the next asset with a deadline, not a vibe.'
    ],
    focuses: ['people'],
    settings: ['small-team', 'client-facing', 'independent'],
    paces: ['mixed', 'structured'],
    priorities: ['creativity', 'salary', 'learning'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['seo', 3],
      ['ads', 3],
      ['writing', 2],
      ['data-viz', 1],
      ['design', 1],
      ['research', 1]
    ],
    salary: {
      early: '₹2.5–6 LPA',
      later: '₹7–15 LPA',
      note: 'Agencies often start lower. In-house at a company that sells something can pay better and teach you less variety. ' + SALARY_NOTE
    },
    entry: [
      'One campaign or page with a before and after. A college fest counts if the number is real.',
      'Degrees are rarely the filter. Writing and a spreadsheet are.',
      'If you hate reporting, you will hate the job. The posts are the visible third.'
    ],
    resources: [
      { title: 'Google Digital Garage', url: 'https://grow.google/intl/en_in/courses-and-tools/', kind: 'Course', cost: 'Free', note: 'Fundamentals, in a form built for this. Finish one course and apply it the same week.' },
      { title: 'HubSpot Academy, digital marketing', url: 'https://academy.hubspot.com/courses/digital-marketing', kind: 'Course', cost: 'Free', note: 'Inbound vocabulary that agencies actually use. Skip the badge-collecting.' },
      { title: 'Google Search Central, helpful content', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', kind: 'Docs', cost: 'Free', note: 'Read this before you take SEO advice from a thread.' }
    ]
  },
  {
    id: 'financial-analyst',
    title: 'Financial analyst',
    domainId: 'finance',
    summary:
      'Builds and checks the numbers a company uses to decide. Models, reconciliations, and a note for someone who will not open the workbook. This is corporate finance and reporting, not a trading floor.',
    week: [
      'Update a model and mark the cell you do not trust.',
      'Reconcile two numbers that should have matched.',
      'Write a short note: what changed, and what you would not conclude.',
      'Answer a follow-up from someone who only read the first line.'
    ],
    focuses: ['analyze'],
    settings: ['large-team', 'small-team'],
    paces: ['structured'],
    priorities: ['salary', 'stability', 'learning'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['bachelors-other', 'bachelors-tech', 'masters'],
    skills: [
      ['excel', 3],
      ['accounting', 3],
      ['statistics', 2],
      ['writing', 1],
      ['research', 1],
      ['data-viz', 1]
    ],
    salary: {
      early: '₹3.5–8 LPA',
      later: '₹10–20 LPA in corporate roles',
      note: 'Investment banking and markets recruiting are a different, harsher process and are not what this role describes. ' + SALARY_NOTE
    },
    entry: [
      'Be able to walk a simple P&L and name one assumption.',
      'Commerce degrees are the common path. Engineers do get in, and spend the first month frightened of accounting.',
      'A CFA level is not required to start. A clean spreadsheet is.'
    ],
    resources: [
      { title: 'Khan Academy, finance and capital markets', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance', kind: 'Course', cost: 'Free', note: 'Enough theory to stop nodding along in a meeting.' },
      { title: 'Investopedia dictionary', url: 'https://www.investopedia.com/financial-term-dictionary-4769738', kind: 'Reading', cost: 'Free', note: 'Look terms up as they appear. Do not try to read it through.' },
      { title: 'Microsoft Excel help', url: 'https://support.microsoft.com/excel', kind: 'Docs', cost: 'Free', note: 'Index, match, and a pivot. Build them into a sheet you already care about.' }
    ]
  },
  {
    id: 'hr-coordinator',
    title: 'HR coordinator',
    domainId: 'human-resources',
    summary:
      'Keeps joining, letters, and the people-process calendar from slipping. It is administration with consequences. A missed document is not a small thing to the person waiting on it.',
    week: [
      'Prepare a joining packet and check it against the checklist, not your memory.',
      'Answer an employee question without inventing policy.',
      'Chase a missing approval and record that you did.',
      'Notice a date clash before someone arrives to an empty desk.'
    ],
    focuses: ['people'],
    settings: ['large-team', 'small-team'],
    paces: ['structured', 'mixed'],
    priorities: ['stability', 'impact', 'learning'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['writing', 2],
      ['speaking', 2],
      ['planning', 2],
      ['recruiting', 2],
      ['excel', 1],
      ['support', 1]
    ],
    salary: {
      early: '₹2.5–5 LPA',
      later: '₹6–12 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Any degree. Clear writing and discretion matter more than the subject.',
      'Placement-cell work counts if you can describe a process you ran, not only "I coordinated".',
      'This is the operations side of HR. If you want conversations all day, look at recruiting.'
    ],
    resources: [
      { title: 'SHRM topics and tools', url: 'https://www.shrm.org/topics-tools', kind: 'Reading', cost: 'Some free articles', note: 'US-heavy, and still the cleanest public explanation of HR work. Read for the ideas, then check Indian labour practice separately.' },
      { title: 'Coursera, recruiting, hiring, and onboarding', url: 'https://www.coursera.org/learn/recruiting-hiring-onboarding-employees', kind: 'Course', cost: 'Free to audit', note: 'A university course on the process. Audit it if you do not want the certificate.' },
      { title: 'Microsoft Excel help', url: 'https://support.microsoft.com/excel', kind: 'Docs', cost: 'Free', note: 'Headcount trackers live in sheets. Learn them before you need them on a Monday.' }
    ]
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    domainId: 'human-resources',
    summary:
      'Fills a role by talking to people and keeping a pipeline honest. The day is screens, follow-ups, and a hiring manager who changed the brief. It rewards people who can hear a weak fit and say so.',
    week: [
      'Source a list and write why each person is on it.',
      'Run a screen against the criteria, not against your mood.',
      'Update the tracker the same day. A pipeline in your head is not a pipeline.',
      'Tell a candidate no, clearly, when the firm allows it.'
    ],
    focuses: ['people'],
    settings: ['client-facing', 'large-team', 'small-team'],
    paces: ['mixed', 'structured'],
    priorities: ['salary', 'impact', 'stability'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['speaking', 3],
      ['recruiting', 3],
      ['crm', 2],
      ['negotiation', 2],
      ['writing', 1],
      ['research', 1]
    ],
    salary: {
      early: '₹2.5–6 LPA, sometimes with incentives',
      later: '₹8–18 LPA depending on agency versus in-house',
      note: 'Agency recruiting pays incentives and has a sharper quota. In-house is steadier. Ask which you are joining. ' + SALARY_NOTE
    },
    entry: [
      'Staffing firms hire freshers in volume. The first months are a script plus a target.',
      'Practice explaining a role in four sentences without reading the JD aloud.',
      'If you dislike rejection, the metrics will be a miserable surprise. They are the job.'
    ],
    resources: [
      { title: 'The Muse, common interview questions', url: 'https://www.themuse.com/advice/interview-questions-and-answers', kind: 'Reading', cost: 'Free', note: 'Read it to see what candidates are coached to say, so your screen is not fooled by it.' },
      { title: 'Coursera, recruiting, hiring, and onboarding', url: 'https://www.coursera.org/learn/recruiting-hiring-onboarding-employees', kind: 'Course', cost: 'Free to audit', note: 'Process, not motivation. That is what you want.' },
      { title: 'HubSpot CRM', url: 'https://www.hubspot.com/products/crm', kind: 'Tool', cost: 'Free tier', note: 'Stand up a tiny pipeline for a club or a fest so the tool is not theoretical.' }
    ]
  },
  {
    id: 'consulting-analyst',
    title: 'Consulting analyst',
    domainId: 'consulting',
    summary:
      'Joins a client problem for a short stretch, turns interviews and numbers into a recommendation, and leaves. The hiring process is the famous part. The job is slides, late evenings, and a manager between you and the client.',
    week: [
      'Pull a number and footnote where it came from.',
      'Interview someone at the client and write what they would not say in the meeting.',
      'Rebuild a slide until the title is a sentence, not a topic.',
      'Change the recommendation when the evidence does not hold.'
    ],
    focuses: ['analyze'],
    settings: ['client-facing', 'large-team', 'small-team'],
    paces: ['ambiguous', 'mixed'],
    priorities: ['salary', 'learning', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['research', 3],
      ['excel', 2],
      ['speaking', 2],
      ['writing', 2],
      ['statistics', 1],
      ['planning', 1]
    ],
    salary: {
      early: '₹8–20 LPA at well-known firms, much less at small local shops using the same word',
      later: 'Rises quickly if you stay, and the hours are part of the deal',
      note: 'The band is meaningless until you know which kind of firm. A "strategy" title at a tiny outfit can pay like an internship. ' + SALARY_NOTE
    },
    entry: [
      'Case interviews are the hurdle. Start practice before you fall in love with the title.',
      'The campus window is the realistic window for the famous firms.',
      'If the cases bore you, business analysis is the neighbouring job and hires more people.'
    ],
    resources: [
      { title: 'McKinsey, interviewing', url: 'https://www.mckinsey.com/careers/interviewing', kind: 'Reading', cost: 'Free', note: 'The firm\'s own description of the process. Read it before a third-party script.' },
      { title: 'CaseInterview, example cases', url: 'https://www.caseinterview.com/case-interview-examples', kind: 'Practice', cost: 'Free samples', note: 'A classic starting set. Practice out loud with another person.' },
      { title: 'Microsoft Excel help', url: 'https://support.microsoft.com/excel', kind: 'Docs', cost: 'Free', note: 'You will still build the exhibit in a sheet.' }
    ]
  },
  {
    id: 'sales-development',
    title: 'Sales development representative',
    domainId: 'sales',
    summary:
      'Starts conversations that are supposed to become pipeline. Calls, emails, a CRM, and a number at the end of the week. It is measurable, and it is a poor accidental landing if you take it without meaning to.',
    week: [
      'Research ten accounts enough to write a first line that is not a template.',
      'Make the calls. Log them the same day.',
      'Hand a qualified conversation to an account executive with notes they can use.',
      'Look at what did not convert and change the next list.'
    ],
    focuses: ['people'],
    settings: ['client-facing', 'large-team'],
    paces: ['structured', 'mixed'],
    priorities: ['salary', 'impact', 'creativity'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['speaking', 3],
      ['writing', 2],
      ['crm', 2],
      ['negotiation', 2],
      ['research', 1],
      ['support', 1]
    ],
    salary: {
      early: '₹3–6 LPA base, plus incentives that may not pay out',
      later: '₹8–18 LPA if you move to closing roles and you are good at it',
      note: 'Ask what percentage of the team hit quota last quarter. The posted "OTE" is not a salary. ' + SALARY_NOTE
    },
    entry: [
      'No specific degree. A clear speaking voice and a tolerance for no.',
      'SaaS, staffing, and ed-tech hire constantly. That is a warning and an opportunity.',
      'Keep your own log for a month if you intern. It is the only way to know if the work fits.'
    ],
    resources: [
      { title: 'HubSpot, the sales process', url: 'https://blog.hubspot.com/sales/sales-process', kind: 'Reading', cost: 'Free', note: 'A plain map of the stages, so the CRM fields mean something.' },
      { title: 'HubSpot Academy, inbound sales', url: 'https://academy.hubspot.com/courses/inbound-sales', kind: 'Course', cost: 'Free', note: 'Free and specific. Finish it, then ignore the parts that are theatre.' },
      { title: 'HubSpot CRM free tier', url: 'https://www.hubspot.com/products/crm', kind: 'Tool', cost: 'Free tier', note: 'Track a real list, even a small one for a college sponsorship drive.' }
    ]
  },
  {
    id: 'operations-associate',
    title: 'Operations associate',
    domainId: 'operations',
    summary:
      'Keeps a repeating process from falling over. Vendors, schedules, exceptions, a tracker. The work is visible only when it fails, which is why good operators are underestimated until the week they are away.',
    week: [
      'Walk the process and find the step people skip.',
      'Chase an exception before it becomes a complaint.',
      'Update the tracker so it matches reality, not the plan from Monday.',
      'Write a short note when something should change for good.'
    ],
    focuses: ['organize'],
    settings: ['large-team', 'small-team'],
    paces: ['structured', 'mixed'],
    priorities: ['stability', 'impact', 'salary'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['excel', 3],
      ['planning', 3],
      ['writing', 2],
      ['negotiation', 1],
      ['support', 1],
      ['data-viz', 1]
    ],
    salary: {
      early: '₹2.5–6 LPA',
      later: '₹7–15 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Internships are relatively easier to get. Waste them and you will only have "exposed to" on the CV.',
      'Document one improvement with a before and after.',
      'Marketplace, logistics, campus ops, and large-company shared services all use this work under different names.'
    ],
    resources: [
      { title: 'ASCM, supply chain topics', url: 'https://www.ascm.org/topics/supply-chain-management/', kind: 'Reading', cost: 'Free articles', note: 'Useful if your operations interest is physical goods. Skip the certification sales pitch at the start.' },
      { title: 'Coursera, Wharton operations introduction', url: 'https://www.coursera.org/learn/wharton-operations', kind: 'Course', cost: 'Free to audit', note: 'A short university course on how operations thinks. Audit is enough.' },
      { title: 'Microsoft Excel help', url: 'https://support.microsoft.com/excel', kind: 'Docs', cost: 'Free', note: 'The tracker is the job. Make one that someone else can update.' }
    ]
  },
  {
    id: 'early-operator',
    title: 'Early-stage generalist',
    domainId: 'entrepreneurship',
    summary:
      'The second or third person at a small company, or the person starting one. There is no template for the week. You do the thing that is blocking, including the things you did not study. Pay is often worse than a campus offer.',
    week: [
      'Talk to a user or a customer before you build the next thing.',
      'Do the unblocked task yourself: a page, an invoice, a follow-up, a bug.',
      'Write down what you assumed, because next month you will misremember it.',
      'Decide what you will not do this week. A company of three still needs a no.'
    ],
    focuses: ['organize'],
    settings: ['small-team', 'independent'],
    paces: ['ambiguous'],
    priorities: ['learning', 'impact', 'creativity'],
    stages: ['student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['planning', 2],
      ['writing', 2],
      ['speaking', 2],
      ['research', 1],
      ['excel', 1],
      ['negotiation', 1]
    ],
    salary: {
      early: 'Often below a campus offer. Sometimes unpaid at the very start.',
      later: 'Depends on the company surviving. Equity is often worth nothing.',
      note: 'Do not use a salary band from this page to negotiate here. Ask what runway is, in months, and who has not been paid.'
    },
    entry: [
      'Finish something unsupervised. A customer, even a few, beats a pitch deck.',
      'There is no placement process. You write to founders or you start.',
      'If you need a stable first salary, take a job and keep this as a later move. The catalogue is allowed to say that.'
    ],
    resources: [
      { title: 'Startup School', url: 'https://www.startupschool.org/', kind: 'Course', cost: 'Free', note: 'Y Combinator\'s free course. Watch it with a specific idea, or it becomes inspiration and nothing else.' },
      { title: 'YC library', url: 'https://www.ycombinator.com/library', kind: 'Reading', cost: 'Free', note: 'Essays from people who have done it. Read the ones about talking to users first.' },
      { title: 'YC essential startup advice', url: 'https://www.ycombinator.com/library/4D-yc-s-essential-startup-advice', kind: 'Reading', cost: 'Free', note: 'A single page you can return to when the week gets noisy.' }
    ]
  },
  {
    id: 'content-strategist',
    title: 'Content strategist',
    domainId: 'content',
    summary:
      'Decides what a company should publish and why, then often writes it too at the start of a career. The job is audience, a point of view, and a piece that has a next step. Captions alone will not get you there.',
    week: [
      'Pick one reader and one action for a piece.',
      'Edit until a stranger can tell what to do.',
      'Look at what was read and what was ignored.',
      'Brief someone else without hovering over every sentence.'
    ],
    focuses: ['build'],
    settings: ['small-team', 'independent', 'client-facing'],
    paces: ['mixed', 'ambiguous'],
    priorities: ['creativity', 'learning', 'impact'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['writing', 3],
      ['research', 2],
      ['seo', 2],
      ['speaking', 1],
      ['design', 1]
    ],
    salary: {
      early: '₹2.5–6 LPA',
      later: '₹8–16 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Three pieces in a form a company would publish. Not captions, unless the job is only captions.',
      'Subject of degree matters less than the samples.',
      'In-house teaches you one voice. An agency teaches you speed. Pick on purpose.'
    ],
    resources: [
      { title: 'Nielsen Norman, how users read on the web', url: 'https://www.nngroup.com/articles/how-users-read-on-the-web/', kind: 'Reading', cost: 'Free', note: 'Changes how you structure a page. Short.' },
      { title: 'Google, creating helpful content', url: 'https://developers.google.com/search/docs/fundamentals/creating-helpful-content', kind: 'Docs', cost: 'Free', note: 'The search-quality view, which is the constraint on a lot of content jobs.' },
      { title: 'Hemingway editor', url: 'https://hemingwayapp.com/', kind: 'Tool', cost: 'Free in the browser', note: 'A harsh editor. Use it on your own paragraph, then break its rules where your voice needs them.' }
    ]
  },
  {
    id: 'technical-writer',
    title: 'Technical writer',
    domainId: 'content',
    summary:
      'Writes the docs, help articles, and release notes that let someone use a product without asking a person. You sit next to engineering. You do not need to be the strongest coder on the team. You do need to try the product.',
    week: [
      'Do the task the doc describes, and fix the doc where you got stuck.',
      'Ask an engineer what they think is obvious. Write that part down.',
      'Cut a sentence that explains the technology instead of the task.',
      'Update a page when the UI changes, the same week, not the next quarter.'
    ],
    focuses: ['build'],
    settings: ['independent', 'small-team', 'large-team'],
    paces: ['structured', 'mixed'],
    priorities: ['learning', 'stability', 'creativity'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['writing', 3],
      ['research', 2],
      ['programming', 1],
      ['apis', 1],
      ['html-css', 1],
      ['planning', 1]
    ],
    salary: {
      early: '₹3–7 LPA',
      later: '₹9–18 LPA',
      note: SALARY_NOTE
    },
    entry: [
      'Rewrite a confusing help page for a tool you use. Show the before and after.',
      'A technical degree helps you get the interview. A clear sample gets you the offer.',
      'This is the content job to pick if you like software but do not want a ticket queue.'
    ],
    resources: [
      { title: 'Google developer documentation style guide', url: 'https://developers.google.com/style', kind: 'Docs', cost: 'Free', note: 'Steal the rules about second person and present tense. They are good.' },
      { title: 'Write the Docs, beginners\' guide', url: 'https://www.writethedocs.org/guide/writing/beginners-guide-to-docs/', kind: 'Reading', cost: 'Free', note: 'Written by people who do the job.' },
      { title: 'MDN writing guidelines', url: 'https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines', kind: 'Docs', cost: 'Free', note: 'A high bar for reference pages. Read one guideline and apply it to a paragraph.' }
    ]
  },
  {
    id: 'project-coordinator',
    title: 'Project coordinator',
    domainId: 'project-management',
    summary:
      'Keeps a plan, a note, and a chase list so a project does not depend on memory. You are not the head of the programme. You are the person who notices a date moved and tells the people who needed to know yesterday.',
    week: [
      'Update the plan to match what was actually said in the meeting.',
      'Chase an owner who went quiet, and record the new date.',
      'Write notes a person who missed the meeting can use.',
      'Flag a risk while it is still a risk, not a miss.'
    ],
    focuses: ['organize'],
    settings: ['large-team', 'small-team', 'client-facing'],
    paces: ['structured', 'mixed'],
    priorities: ['stability', 'impact', 'salary'],
    stages: ['student-ug', 'student-pg', 'fresher', 'switcher-1-3', 'experienced'],
    education: ['school', 'diploma', 'bachelors-tech', 'bachelors-other', 'masters'],
    skills: [
      ['planning', 3],
      ['writing', 2],
      ['speaking', 2],
      ['excel', 1],
      ['negotiation', 1],
      ['support', 1]
    ],
    salary: {
      early: '₹3–6 LPA',
      later: '₹8–16 LPA as you move from coordinating to managing',
      note: SALARY_NOTE
    },
    entry: [
      'A fest, a implementation project, or an operations internship where you owned dates.',
      'CAPM and PMP are later. A firm that demands PMP from a fresher is confused.',
      '"I was the leader" is not enough. Name a date you protected and a person you chased.'
    ],
    resources: [
      { title: 'Atlassian, agile guide', url: 'https://www.atlassian.com/agile', kind: 'Reading', cost: 'Free', note: 'Enough ceremony to recognise the words in a standup. Not a religion.' },
      { title: 'Scrum.org, what is Scrum', url: 'https://www.scrum.org/resources/what-scrum-module', kind: 'Reading', cost: 'Free', note: 'A primary source. Short. Many teams say Scrum and mean a weekly meeting.' },
      { title: 'PMI, CAPM', url: 'https://www.pmi.org/certifications/certified-associate-capm', kind: 'Cert info', cost: 'Paid', note: 'Read what it covers. Take it later if an employer cares. Do not lead with it.' }
    ]
  }
];

const adjacent = {
  'software-engineering': ['web-development', 'mobile-development', 'quality-assurance', 'devops', 'machine-learning'],
  'web-development': ['software-engineering', 'product-design', 'mobile-development'],
  'mobile-development': ['software-engineering', 'web-development', 'product-design'],
  'data-analytics': ['data-engineering', 'business-analysis', 'finance', 'machine-learning'],
  'data-engineering': ['data-analytics', 'software-engineering', 'cloud-infrastructure'],
  'cybersecurity': ['cloud-infrastructure', 'it-support', 'software-engineering'],
  'cloud-infrastructure': ['devops', 'cybersecurity', 'it-support'],
  'devops': ['cloud-infrastructure', 'software-engineering', 'quality-assurance'],
  'quality-assurance': ['software-engineering', 'web-development', 'devops'],
  'product-design': ['web-development', 'content', 'product-management'],
  'machine-learning': ['data-analytics', 'software-engineering', 'data-engineering'],
  'it-support': ['cybersecurity', 'cloud-infrastructure', 'operations'],
  'product-management': ['business-analysis', 'project-management', 'product-design'],
  'business-analysis': ['data-analytics', 'product-management', 'consulting', 'finance'],
  'digital-marketing': ['content', 'sales', 'data-analytics'],
  finance: ['business-analysis', 'consulting', 'operations'],
  'human-resources': ['operations', 'consulting', 'sales'],
  consulting: ['business-analysis', 'finance', 'project-management'],
  sales: ['digital-marketing', 'entrepreneurship', 'human-resources'],
  operations: ['project-management', 'entrepreneurship', 'finance', 'it-support'],
  entrepreneurship: ['sales', 'operations', 'product-management'],
  content: ['digital-marketing', 'product-design', 'product-management'],
  'project-management': ['operations', 'product-management', 'consulting']
};

function domainById(id) {
  return domains.find((domain) => domain.id === id) || null;
}

function skillById(id) {
  return skills.find((skill) => skill.id === id) || null;
}

function roleById(id) {
  return roles.find((role) => role.id === id) || null;
}

function rolesInDomain(domainId) {
  return roles.filter((role) => role.domainId === domainId);
}

function neighborIds(domainId) {
  const found = new Set(adjacent[domainId] || []);
  for (const [id, list] of Object.entries(adjacent)) {
    if (list.includes(domainId)) found.add(id);
  }
  found.delete(domainId);
  return [...found];
}

function groupedDomains() {
  return ['Tech', 'Business'].map((name) => ({
    name,
    domains: domains
      .filter((domain) => domain.group === name)
      .map((domain, index) => ({
        ...domain,
        number: String(index + 1).padStart(2, '0'),
        roleCount: rolesInDomain(domain.id).length
      }))
  }));
}

function skillGroups() {
  const order = [];
  const map = new Map();
  for (const skill of skills) {
    if (!map.has(skill.group)) {
      map.set(skill.group, []);
      order.push(skill.group);
    }
    map.get(skill.group).push(skill);
  }
  return order.map((name) => ({ name, skills: map.get(name) }));
}

function assertCatalog() {
  const domainIds = new Set(domains.map((domain) => domain.id));
  const skillIds = new Set(skills.map((skill) => skill.id));
  const roleIds = new Set();

  if (domainIds.size !== domains.length) {
    throw new Error('Duplicate domain id');
  }
  if (skillIds.size !== skills.length) {
    throw new Error('Duplicate skill id');
  }

  for (const [id, list] of Object.entries(adjacent)) {
    if (!domainIds.has(id)) throw new Error(`Unknown adjacent key ${id}`);
    for (const other of list) {
      if (!domainIds.has(other)) throw new Error(`Unknown neighbour ${other} on ${id}`);
    }
  }

  for (const domain of domains) {
    if (rolesInDomain(domain.id).length === 0) {
      throw new Error(`Domain ${domain.id} has no role`);
    }
  }

  for (const role of roles) {
    if (roleIds.has(role.id)) throw new Error(`Duplicate role ${role.id}`);
    roleIds.add(role.id);
    if (!domainIds.has(role.domainId)) throw new Error(`Role ${role.id} has a bad domain`);
    const seen = new Set();
    for (const [skillId, weight] of role.skills) {
      if (!skillIds.has(skillId)) throw new Error(`Role ${role.id} has unknown skill ${skillId}`);
      if (seen.has(skillId)) throw new Error(`Role ${role.id} lists ${skillId} twice`);
      if (![1, 2, 3].includes(weight)) throw new Error(`Role ${role.id} has a bad weight`);
      seen.add(skillId);
    }
    if (!role.focuses.length) throw new Error(`Role ${role.id} has no focus`);
  }
}

assertCatalog();

module.exports = {
  SALARY_NOTE,
  domains,
  skills,
  roles,
  adjacent,
  domainById,
  skillById,
  roleById,
  rolesInDomain,
  neighborIds,
  groupedDomains,
  skillGroups,
  assertCatalog
};