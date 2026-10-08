const labels = require('./labels');
const catalog = require('./catalog');

function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function layout(data, body) {
  const on = (name) => (data.page === name ? ' class="is-on"' : '');
  const account = data.user
    ? `<a${on('saved')} href="/saved">Saved</a>
          <form action="/logout" method="post">
            <button type="submit">Sign out</button>
          </form>`
    : `<a${on('account')} href="/login">Sign in</a>`;
  const flash = data.flash ? `<p class="flash" role="status">${esc(data.flash)}</p>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(data.title)}</title>
  <meta name="description" content="${esc(data.description)}">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>
  <a class="skip" href="#content">Skip to content</a>
  <header class="top">
    <div class="top-inner">
      <div class="top-left">
        <button type="button" class="back-arrow" id="go-back" aria-label="Back to the previous page">←</button>
        <a class="mark" href="/">GuidanceGenie</a>
      </div>
      <nav aria-label="Primary">
        <a${on('domains')} href="/domains">Catalogue</a>
        <a${on('assess')} href="/assess">Questionnaire</a>
        <a${on('chat')} href="/chat">Chat</a>
        <a${on('how')} href="/how">How it ranks</a>
        ${account}
      </nav>
      <a class="home-btn" href="/">Home</a>
    </div>
  </header>
  <main id="content" class="layout">
    ${flash}
    ${body}
  </main>
  <footer class="foot">
    <div class="foot-inner">
      <p>A questionnaire or a conversation collects your education, subjects, and interests. Careers come back with the skills they need and links to courses. Gemini can name a career that is not in the catalogue and add those course links.</p>
      <p>Pay lines are indicative ranges for India. They are not offers. Accounts and saved assessments are stored in MongoDB.</p>
    </div>
  </footer>
  <script src="/js/site.js"></script>
</body>
</html>`;
}

function coursesBlock(courses) {
  if (!courses) return '';
  const list = (title, items) => {
    if (!items || !items.length) return '';
    return `<h3>${title}</h3>
  <ul class="resources">
    ${items
      .map(
        (item) => `<li>
        <a href="${esc(item.url)}" rel="noopener noreferrer">${esc(item.title)}</a>
        <span class="meta">${esc(item.kind)} · ${esc(item.cost)}</span>
        <p>${esc(item.note)}</p>
      </li>`
      )
      .join('')}
  </ul>`;
  };
  return `${list('Free courses', courses.free)}
  ${list('Paid courses', courses.paid)}`;
}

function toc(groups, withCount) {
  return groups
    .map(
      (group) => `<h${withCount ? '2' : '3'} class="group-label">${esc(group.name)}</h${withCount ? '2' : '3'}>
    <ul class="toc">
      ${group.domains
        .map((domain) => {
          const count = withCount
            ? `<em>${esc(domain.roleCount)} ${domain.roleCount === 1 ? 'role' : 'roles'}</em>`
            : '';
          return `<li>
          <a href="/domains/${esc(domain.id)}">
            <span class="num">${esc(domain.number)}</span>
            <span><strong>${esc(domain.name)}</strong>${esc(domain.blurb)}${count}</span>
          </a>
        </li>`;
        })
        .join('')}
    </ul>`
    )
    .join('');
}

function home(data) {
  const count = data.groups.reduce((n, group) => n + group.domains.length, 0);
  return layout(
    data,
    `<section>
  <p class="eyebrow">Career guidance · ${esc(count)} domains</p>
  <h1>Tell it your education and what you actually want to do.</h1>
  <p class="lede">Use the questionnaire, or talk it through. Both ask about Class 10, Class 12, a diploma, a degree, postgraduate study, or work you already have, then the subjects you studied and the work you want. You get careers, the skills those careers need, and course links. Save an account if you want to open that result again.</p>
  <div class="actions">
    <a class="button" href="/assess">Start the questionnaire</a>
    <a class="quiet" href="/chat">Talk it through</a>
  </div>
</section>

<section class="block">
  <h2>What you will be asked</h2>
  <ol class="ask-list">
    <li>
      <span>01</span>
      <div>
        <h3>Last education</h3>
        <p>Class 10, Class 12, a diploma, a degree, postgraduate study, or already working.</p>
      </div>
    </li>
    <li>
      <span>02</span>
      <div>
        <h3>Subjects and courses</h3>
        <p>Tick the ones you had, and type any the list missed.</p>
      </div>
    </li>
    <li>
      <span>03</span>
      <div>
        <h3>What you actually want</h3>
        <p>Interests can be from the list or in your own words. The chat will ask again if this part is thin.</p>
      </div>
    </li>
    <li>
      <span>04</span>
      <div>
        <h3>What you can already do, and what you want next</h3>
        <p>A skill you could use this month, then a job, more study, a switch, or not sure yet.</p>
      </div>
    </li>
  </ol>
</section>

<section class="block">
  <div class="section-head">
    <h2>The catalogue</h2>
    <a href="/domains">Open the full list</a>
  </div>
  <p class="lede thin">Each field has at least one role, with the skills it uses and courses for those skills. Salary lines are indicative for India and labelled as such.</p>
  ${toc(data.groups, false)}
</section>`
  );
}

function domains(data) {
  const count = data.groups.reduce((n, group) => n + group.domains.length, 0);
  return layout(
    data,
    `<p class="eyebrow">Catalogue</p>
<h1>${esc(count)} fields, ${esc(data.roleCount)} roles.</h1>
<p class="lede">Read a field before you take the questionnaire if you want a name for what you are already circling. The questionnaire is what turns a pick into a ranked list.</p>
${toc(data.groups, true)}`
  );
}

function domain(data) {
  return layout(
    data,
    `<p class="eyebrow"><a href="/domains">Catalogue</a> · ${esc(data.domain.group)}</p>
<h1>${esc(data.domain.name)}</h1>
<div class="prose">
  <p>${esc(data.domain.overview)}</p>
  <p>${esc(data.domain.hiring)}</p>
</div>
<p class="actions">
  <a class="button" href="/assess?domain=${esc(data.domain.id)}">Start with this domain ticked</a>
</p>

<h2>Roles in this field</h2>
<ul class="role-index">
  ${data.roles
    .map(
      (role) => `<li>
      <a href="/roles/${esc(role.id)}">
        <strong>${esc(role.title)}</strong>
        <span>${esc(role.summary)}</span>
      </a>
    </li>`
    )
    .join('')}
</ul>
${
  data.neighbours.length
    ? `<h2>Nearby fields</h2>
  <ul class="inline-links">
    ${data.neighbours.map((item) => `<li><a href="/domains/${esc(item.id)}">${esc(item.name)}</a></li>`).join('')}
  </ul>
  <p class="fine">A nearby field can outrank a field you picked, if your skills and workday fit it better. The result page says when that happens.</p>`
    : ''
}`
  );
}

function role(data) {
  const fromQuery = data.from ? `?from=${esc(data.from)}` : '';
  const mine = data.mine
    ? `<aside class="mine">
    <p>From your assessment, this role scored <strong>${esc(data.mine.score)}/100</strong> · ${esc(data.mine.bandLabel)}.</p>
    <p>${esc(data.mine.reasons[1] || '')}</p>
    <a href="/results/${esc(data.from)}">Back to that full result</a>
  </aside>`
    : '';
  const others = data.others.length
    ? `<h2>Other roles in ${esc(data.domain.name)}</h2>
  <ul class="inline-links">
    ${data.others
      .map((item) => `<li><a href="/roles/${esc(item.id)}${fromQuery}">${esc(item.title)}</a></li>`)
      .join('')}
  </ul>`
    : '';

  return layout(
    data,
    `<p class="eyebrow"><a href="/domains/${esc(data.domain.id)}">${esc(data.domain.name)}</a></p>
<h1>${esc(data.role.title)}</h1>
<p class="lede">${esc(data.role.summary)}</p>
${mine}
<div class="split">
  <section>
    <h2>A normal week</h2>
    <ol class="week">
      ${data.role.week.map((line) => `<li>${esc(line)}</li>`).join('')}
    </ol>
  </section>
  <section>
    <h2>Pay, roughly</h2>
    <dl class="pay">
      <div><dt>Early</dt><dd>${esc(data.role.salary.early)}</dd></div>
      <div><dt>A few years in</dt><dd>${esc(data.role.salary.later)}</dd></div>
    </dl>
    <p class="fine">${esc(data.role.salary.note)}</p>
  </section>
</div>

<h2>Skills this role leans on</h2>
<ul class="skill-weights">
  ${data.skills
    .map(
      (skill) => `<li>
      <span class="tag">${esc(skill.weightWord)}</span>
      <div>
        <strong>${esc(skill.label)}</strong>
        <p>${esc(skill.detail)}</p>
      </div>
    </li>`
    )
    .join('')}
</ul>

<h2>How people usually get in</h2>
<ul class="plain">
  ${data.role.entry.map((line) => `<li>${esc(line)}</li>`).join('')}
</ul>

<h2>Courses for these skills</h2>
<p class="fine">Free and paid. Pick from the gaps if you already have some of the skills above.</p>
${coursesBlock(data.courses)}
${others}
<h2>Nearby fields</h2>
<ul class="inline-links">
  ${data.neighbours.map((item) => `<li><a href="/domains/${esc(item.id)}">${esc(item.name)}</a></li>`).join('')}
</ul>

<p class="actions"><a class="button" href="/assess?domain=${esc(data.domain.id)}">Score yourself against this field</a></p>`
  );
}

function how(data) {
  return layout(
    data,
    `<p class="eyebrow">Recommendation logic</p>
<h1>A sheet, not a model.</h1>
<div class="prose">
  <p>The catalogue still has a fixed sheet, shown below, so a known role can be checked. The questionnaire and the chat are what you use. They collect education, subjects, interests, and what you want next. Matching careers inside the catalogue use its course links. When <code>GEMINI_API_KEY</code> is set, Gemini can also name a career that is not in the catalogue and add course links for the skills that career needs. Saved results stay in MongoDB.</p>
  <p>A direct domain pick is worth more than any single skill. That is deliberate. If you say you want cybersecurity, a security role stays in the conversation even when your skill list is thin. The gap list is then the useful part of the page. A neighbouring field can still finish above your pick when the skills and the workday fit it better. The result says so when that happens.</p>
</div>

<h2>The points</h2>
<table class="sheet">
  <thead>
    <tr><th>Piece</th><th>Points</th><th>How it is earned</th></tr>
  </thead>
  <tbody>
    <tr><td>Domain</td><td>${esc(data.points.domainDirect)}</td><td>Full marks if you picked the role’s field. ${esc(data.points.domainAdjacent)} if you picked a neighbour. Zero otherwise.</td></tr>
    <tr><td>Skills</td><td>${esc(data.points.skills)}</td><td>Share of the role’s weighted skill list that you ticked. A core skill is worth more than a useful one.</td></tr>
    <tr><td>Workday</td><td>${esc(data.points.focus)}</td><td>Your “centre of the day” is one of the centres of that job.</td></tr>
    <tr><td>Setting</td><td>${esc(data.points.setting)}</td><td>Small team, large organisation, independent, or client-facing, if the role lives there.</td></tr>
    <tr><td>Pace</td><td>${esc(data.points.pace)}</td><td>Full marks on a match. Choosing “a mix” still scores 3 against a role that wanted something sharper.</td></tr>
    <tr><td>Where you are</td><td>${esc(data.points.stage)}</td><td>Full marks if this is a reasonable next step from your stage. Otherwise 1, so it is not a ban.</td></tr>
    <tr><td>Study</td><td>${esc(data.points.education)}</td><td>Your degree or diploma is a usual door for the role.</td></tr>
  </tbody>
</table>
<p class="fine">The maximum raw total is ${esc(data.maxRaw)}, because domain points do not stack. The score you see is that total scaled to 100. 70 and above is a strong match. 50 to 69 is plausible. Below 50 is a stretch.</p>

<h2>One profile, so these numbers stay checkable</h2>
<p>A bachelor’s student who picked data analytics and business analysis, likes taking evidence apart, and already has SQL, spreadsheets, statistics, writing, and a bit of research.</p>
<p class="example-score"><span>${esc(data.sample.score)}</span>/100 · ${esc(data.sample.role.title)}</p>
<table class="sheet">
  <thead><tr><th>Piece</th><th>Points</th></tr></thead>
  <tbody>
    ${data.sample.sheet
      .map(
        (row) => `<tr>
        <td>${esc(row.label)}</td>
        <td>${esc(row.got)} / ${esc(row.max)}</td>
      </tr>`
      )
      .join('')}
  </tbody>
</table>
<p class="fine">${esc(data.sample.rawLabel)} raw points, scaled. ${esc(data.sample.reasons[1] || '')}</p>`
  );
}

function asList(items) {
  return Array.isArray(items) ? items : [];
}

function radioChoices(items, name, withHint) {
  return asList(items)
    .map(
      (item) => `<label class="choice">
          <input type="radio" name="${esc(name)}" value="${esc(item.id)}">
          <span>${withHint ? `<strong>${esc(item.label)}</strong><small>${esc(item.hint)}</small>` : esc(item.label)}</span>
        </label>`
    )
    .join('');
}

function checkChoices(items, name) {
  return asList(items)
    .map(
      (item) => `<label class="choice">
          <input type="checkbox" name="${esc(name)}" value="${esc(item.id)}">
          <span>${esc(item.label)}</span>
        </label>`
    )
    .join('');
}

function assess(data) {
  const educationLevels = asList(data.educationLevels).length ? data.educationLevels : labels.educationLevels;
  const streams = asList(data.streams).length ? data.streams : labels.streams;
  const subjects = asList(data.subjects).length ? data.subjects : labels.subjects;
  const interests = asList(data.interests).length ? data.interests : labels.interests;
  const aims = asList(data.aims).length ? data.aims : labels.aims;
  const skillGroups = asList(data.skillGroups).length ? data.skillGroups : catalog.skillGroups();
  return layout(
    data,
    `<p class="eyebrow">Questionnaire</p>
<h1>Education, subjects, and what you want.</h1>
<p class="lede thin">A short form, then careers. Tick what fits and type anything the list misses. Submitting goes straight to recommendations. The points sheet for the catalogue stays on that page.</p>

<noscript>
  <p class="flash">This questionnaire needs JavaScript to move between steps. The catalogue and the role briefs work without it.</p>
</noscript>

<form id="assess" class="assess" novalidate>
  <p id="step-label" class="step-label">Step 1 of 7</p>
  <p id="form-error" class="form-error" hidden></p>

  <section data-step>
    <h2>What is the last education you finished or are in?</h2>
    <fieldset>
      <legend>Education</legend>
      ${radioChoices(educationLevels, 'education', true)}
    </fieldset>
    <label class="stack" for="current-role">If you are already working, what is the role?</label>
    <input id="current-role" name="currentRole" maxlength="120" placeholder="Example: store accountant, support engineer">
    <label class="stack" for="years">Years in that work</label>
    <input id="years" name="years" inputmode="numeric" maxlength="2" placeholder="Example: 2">
  </section>

  <section data-step hidden>
    <h2>What stream or branch was that?</h2>
    <p>Skip the spirit of this if you did not have one. Science, Commerce, Arts, and Engineering cover most school and college paths. Type a branch the list misses.</p>
    <fieldset>
      <legend>Stream or branch</legend>
      ${radioChoices(streams, 'stream', false)}
    </fieldset>
    <label class="stack" for="stream-other">Or type the branch</label>
    <input id="stream-other" name="streamOther" maxlength="200" placeholder="Example: mechanical, B.Com, PCB">
  </section>

  <section data-step hidden>
    <h2>Which subjects or courses were part of that?</h2>
    <p>Tick the ones you had. Type the rest if the list does not name them.</p>
    <div class="choices grid">
      ${checkChoices(subjects, 'subjects')}
    </div>
    <label class="stack" for="subjects-other">Subjects or courses to add in your own words</label>
    <textarea id="subjects-other" name="subjectsOther" maxlength="300" rows="3" placeholder="Example: entrepreneurship elective, Tally, a Python module."></textarea>
  </section>

  <section data-step hidden>
    <h2>What are you actually interested in?</h2>
    <p>This can be different from the subjects you were taught.</p>
    <div class="choices grid">
      ${checkChoices(interests, 'interests')}
    </div>
    <label class="stack" for="interests-other">Interests to add in your own words</label>
    <textarea id="interests-other" name="interestsOther" maxlength="300" rows="3" placeholder="Example: wildlife photography, hospital administration, game audio."></textarea>
  </section>

  <section data-step hidden>
    <h2>What can you already do?</h2>
    <p>Only tick a line if you could use it this month. Type anything the list misses.</p>
    ${asList(skillGroups)
      .map(
        (group) => `<fieldset data-group>
        <legend>${esc(group.name)}</legend>
        <div class="choices grid">
          ${group.skills
            .map(
              (skill) => `<label class="choice">
                <input type="checkbox" name="skills" value="${esc(skill.id)}">
                <span><strong>${esc(skill.label)}</strong><small>${esc(skill.detail)}</small></span>
              </label>`
            )
            .join('')}
        </div>
      </fieldset>`
      )
      .join('')}
    <label class="stack" for="skills-other">A skill to add in your own words</label>
    <textarea id="skills-other" name="skillsOther" maxlength="300" rows="3" placeholder="Example: I edit reels, I reconcile a cash book, I have taught a tuition batch."></textarea>
  </section>

  <section data-step hidden>
    <h2>What do you want next?</h2>
    <fieldset>
      <legend>The next step</legend>
      ${radioChoices(aims, 'aim', true)}
    </fieldset>
    <label class="stack" for="note">Anything else to keep with this result</label>
    <textarea id="note" name="note" maxlength="500" rows="3" placeholder="Optional. A class you liked, a constraint, a city you need to stay in."></textarea>
  </section>

  <section data-step hidden>
    <h2>Check this, then see careers.</h2>
    <p>You can go back and change a step. Submitting asks for careers and course links.</p>
    <dl class="review" id="review"></dl>
  </section>

  <div class="assess-nav">
    <button type="button" id="back" class="button secondary" hidden>← Back</button>
    <button type="button" id="next" class="button">Continue</button>
  </div>
</form>

<script src="/js/assess.js"></script>`
  );
}

function results(data) {
  const assessment = data.assessment;
  const saveNote = data.saved
    ? `<p class="save-note">Saved on your account. Open it again from <a href="/saved">Saved</a>.</p>`
    : `<aside class="save-note">
    <p>This result stays in this browser until you keep it. Create an account and it is filed under Saved.</p>
    <p class="actions">
      <a class="button" href="/register">Create an account</a>
      <a class="quiet" href="/login">I already have one</a>
    </p>
  </aside>`;
  const sourceLine = assessment.source === 'gemini'
    ? 'Gemini named these from your education, subjects, and interests. Course links from the catalogue are used when the career is already in the project. Other careers include links Gemini added.'
    : 'These come from the catalogue, matched to what you said. Add GEMINI_API_KEY in the project .env if you want careers that are not in the catalogue, with course links added for them.';
  const cards = (assessment.recommendations || [])
    .map((item) => {
      const free = (item.courses || []).filter((course) => !/^paid\b/i.test(course.cost));
      const paid = (item.courses || []).filter((course) => /^paid\b/i.test(course.cost));
      const courseList = (title, list) =>
        list.length
          ? `<h3>${title}</h3><ul class="resources">${list
              .map(
                (course) => `<li>
            <a href="${esc(course.url)}" rel="noopener noreferrer">${esc(course.title)}</a>
            <span class="meta">${esc(course.cost)}</span>
            ${course.note ? `<p>${esc(course.note)}</p>` : ''}
          </li>`
              )
              .join('')}</ul>`
          : '';
      const brief = item.roleId
        ? `<p><a href="/roles/${esc(item.roleId)}?from=${esc(assessment.id)}">Open the role brief</a></p>`
        : '';
      return `<article class="match featured">
      <header class="match-head">
        <p class="eyebrow">${item.roleId ? 'In the catalogue' : 'Added for this result'}</p>
        <h2>${esc(item.title)}</h2>
      </header>
      <p>${esc(item.why)}</p>
      ${item.skills && item.skills.length ? `<p class="fine">Skills this uses: ${esc(item.skills.join(', '))}</p>` : ''}
      ${courseList('Free courses', free)}
      ${courseList('Paid courses', paid)}
      ${brief}
    </article>`;
    })
    .join('');
  return layout(
    data,
    `<p class="eyebrow">Result · ${esc(assessment.when)}</p>
<h1>${esc(assessment.headline)}</h1>
<p class="lede">${esc(sourceLine)}</p>
${saveNote}
<section class="recap">
  <h2>What you told us</h2>
  <dl class="mini">
    ${(assessment.told || []).map(([label, value]) => `<div><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('')}
  </dl>
</section>
<div class="split result-pair">
<div>
<h2>Suggestions</h2>
${cards}
</div>
${assessment.featured ? `<aside>
<h2>Catalogue sheet</h2>
<p class="fine">This is the recommendation logic for roles already in the project. It uses the same points for everyone. The suggestions can name a career this sheet does not have.</p>
<article class="match">
  <header class="match-head">
    <p class="eyebrow">${esc(assessment.featured.bandLabel)} · ${esc(assessment.featured.domain.name)}</p>
    <h2>${esc(assessment.featured.role.title)}</h2>
    <p class="score"><span>${esc(assessment.featured.score)}</span>/100</p>
  </header>
  <table class="sheet">
    <thead><tr><th>Piece</th><th>Points</th></tr></thead>
    <tbody>
      ${assessment.featured.sheet.map((row) => `<tr><td>${esc(row.label)}</td><td>${esc(row.got)} / ${esc(row.max)}</td></tr>`).join('')}
    </tbody>
  </table>
  <p><a href="/roles/${esc(assessment.featured.role.id)}?from=${esc(assessment.id)}">Open this role brief</a></p>
</article>
<div class="table-wrap">
  <table class="rank">
    <thead><tr><th>Rank</th><th>Role</th><th>Score</th></tr></thead>
    <tbody>
      ${assessment.ranking.map((row) => `<tr><td>${esc(row.rank)}</td><td>${esc(row.title)}</td><td>${esc(row.score)}</td></tr>`).join('')}
    </tbody>
  </table>
</div>
</aside>` : '<div></div>'}
</div>
${assessment.messages && assessment.messages.length ? `<h2>The chat</h2>
<div class="thread">${assessment.messages.map((message) => `<p class="bubble ${message.role === 'user' ? 'user' : 'guide'}">${esc(message.content)}</p>`).join('')}</div>` : ''}
<p class="actions"><a class="button secondary" href="/assess">Take it again</a> <a class="quiet" href="/chat">Talk it through</a></p>`
  );
}

function chat(data) {
  const thread = (data.messages || [])
    .map(
      (message) => `<p class="bubble ${message.role === 'user' ? 'user' : 'guide'}">${esc(message.content)}</p>`
    )
    .join('');
  return layout(
    data,
    `<p class="eyebrow">Chat</p>
<h1>Talk it through.</h1>
<p class="lede thin">Say what you studied and what you want. The guide asks a follow-up when something is missing, then names careers and course links.</p>
<div id="thread" class="thread">${thread}</div>
<form id="chat-form" class="chat-form">
  <label class="visually-hidden" for="chat-message">Your message</label>
  <input id="chat-message" name="message" maxlength="1000" required placeholder="Class 12, computer science, I want to build websites">
  <button class="button" type="submit">Send</button>
</form>
<p id="chat-error" class="form-error" hidden></p>
<form method="post" action="/chat/reset"><button class="quiet" type="submit">Start again</button></form>
<script src="/js/chat.js"></script>`
  );
}
function register(data) {
  return layout(
    data,
    `<div class="narrow">
  <p class="eyebrow">Account</p>
  <h1>Create an account</h1>
  <p>We store your name, email, a hash of the password, and any assessment you submit while signed in. Guest results from this browser are attached when you register, so you do not lose the page you just saw.</p>
  <form class="stack-form" method="post" action="/register">
    <label for="name">Name</label>
    <input id="name" name="name" type="text" autocomplete="name" required>
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="new-password" required minlength="8">
    <label for="confirm">Password again</label>
    <input id="confirm" name="confirm" type="password" autocomplete="new-password" required minlength="8">
    <button class="button" type="submit">Create account</button>
  </form>
  <p class="fine">Already registered? <a href="/login">Sign in</a>.</p>
</div>`
  );
}

function login(data) {
  return layout(
    data,
    `<div class="narrow">
  <p class="eyebrow">Account</p>
  <h1>Sign in</h1>
  <p>Saved assessments are listed after you sign in. If you just finished the questionnaire in this browser, signing in files that result on the account.</p>
  <form class="stack-form" method="post" action="/login">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" autocomplete="email" required>
    <label for="password">Password</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required>
    <button class="button" type="submit">Sign in</button>
  </form>
  <p class="fine">No account yet? <a href="/register">Create one</a>. There is no password reset. On your own machine, dropping the <code>guidancegenie</code> database in MongoDB wipes accounts and saved results. The demo account is created again the next time the server starts against an empty database.</p>
  <aside class="example">
    <p class="eyebrow">Demo account</p>
    <p>On an empty database: <code>meera.kulkarni@example.com</code> / <code>campus-2026</code>. Two saved assessments are already there.</p>
  </aside>
</div>`
  );
}

function saved(data) {
  const body = data.rows.length
    ? `<p class="lede thin">Each row is one submission. Opening it shows the answers, the points, and the learning links from that day. Taking it again adds another row. It does not overwrite this one.</p>
  <ul class="saved-list">
    ${data.rows
      .map(
        (row) => `<li>
        <div>
          <p class="eyebrow">${esc(row.when)}</p>
          <h2><a href="/results/${esc(row.id)}">${esc(row.topTitle)}</a></h2>
          <p>${row.via ? esc(row.via) + ' · ' : ''}${esc(row.topScore)}/100${row.domains.length ? ' · ' + esc(row.domains.join(', ')) : ''}</p>
        </div>
        <form method="post" action="/saved/${esc(row.id)}/delete" data-confirm="Delete this assessment? The answers and scores go with it.">
          <button type="submit" class="text-button">Delete</button>
        </form>
      </li>`
      )
      .join('')}
  </ul>`
    : `<p class="lede">Nothing saved yet. Finish the questionnaire while you are signed in, or finish it first and then create the account in the same browser.</p>
  <p><a class="button" href="/assess">Start the questionnaire</a></p>`;
  const first = data.user.name.split(' ')[0];
  return layout(
    data,
    `<p class="eyebrow">Account</p>
<h1>${esc(first)}, your saved assessments.</h1>
${body}`
  );
}

function notFound(data) {
  return layout(
    data,
    `<h1>That page is not in the catalogue.</h1>
<p>The link may be mistyped, or the assessment was deleted.</p>
<p><a href="/">Back to the start</a> · <a href="/domains">Browse fields</a></p>`
  );
}

function locked(data) {
  const detail = data.signedIn
    ? `<p>You are signed in as ${esc(data.user.email)}. This result was saved by a different account.</p>`
    : `<p>Sign in with the account that saved it.</p>
  <p><a class="button" href="/login">Sign in</a></p>`;
  return layout(data, `<h1>This assessment is on an account.</h1>
${detail}`);
}

function error(data) {
  return layout(
    data,
    `<h1>Something went wrong.</h1>
<p>${esc(data.message)}</p>
<p><a href="/">Back to the start</a></p>`
  );
}

module.exports = {
  home,
  domains,
  domain,
  role,
  how,
  assess,
  results,
  chat,
  register,
  login,
  saved,
  notFound,
  locked,
  error
};