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
  <link rel="icon" href="/favicon.ico" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;0,6..72,600;1,6..72,500&family=Public+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/site.css">
</head>
<body>
  <a class="skip" href="#content">Skip to content</a>
  <header class="top">
    <div class="top-inner">
      <a class="mark" href="/">GuidanceGenie</a>
      <nav aria-label="Primary">
        <a${on('domains')} href="/domains">Catalogue</a>
        <a${on('assess')} href="/assess">Questionnaire</a>
        <a${on('how')} href="/how">How it ranks</a>
        ${account}
      </nav>
    </div>
  </header>
  <main id="content" class="layout">
    ${flash}
    ${body}
  </main>
  <footer class="foot">
    <div class="foot-inner">
      <p class="foot-name">GuidanceGenie</p>
      <p>Career guidance across tech and business, from a short questionnaire to roles, skills, and courses.</p>
      <nav class="foot-links" aria-label="Footer">
        <a href="/">Home</a>
        <a href="/domains">Catalogue</a>
        <a href="/how">How it ranks</a>
      </nav>
      <p>© 2026 GuidanceGenie</p>
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
  <h1>Answer a few questions. See which roles fit.</h1>
  <p class="lede">Say where you are, which fields you want to look at, and what you can already do. Recommendation logic ranks roles across tech and business against those answers, then lists the skills each role needs and courses for those skills, free and paid. Save an account if you want to open that result again.</p>
  <div class="actions">
    <a class="button" href="/assess">Start the questionnaire</a>
  </div>
</section>

<section class="block">
  <h2>What the questionnaire actually asks</h2>
  <ol class="ask-list">
    <li>
      <span>01</span>
      <div>
        <h3>Where you are</h3>
        <p>Still in a degree, just finished, or already working. A final-year student and someone three years into a job should not get the same “you could start next month” line.</p>
      </div>
    </li>
    <li>
      <span>02</span>
      <div>
        <h3>One to three domains</h3>
        <p>Tech and business fields, named as hiring markets rather than moods. Three is the cap, so the result is not a list of everything.</p>
      </div>
    </li>
    <li>
      <span>03</span>
      <div>
        <h3>The shape of a workday</h3>
        <p>Making, analysing, talking, or keeping a plan alive. Plus whether you want a small team, a large organisation, or clients in the room.</p>
      </div>
    </li>
    <li>
      <span>04</span>
      <div>
        <h3>Skills you could use this month</h3>
        <p>Not skills you have heard of. The result then names the skills the role still needs, with a free course and a paid course for learning them.</p>
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
  <p>The recommendation logic is this sheet. GuidanceGenie does not train a model and does not call an outside service when you submit. The server scores every role in the catalogue with the same points. The top of that list is your result. If you are signed in, the answers and the scores are written to your account in MongoDB.</p>
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

function radioChoices(items, name, withHint) {
  return items
    .map(
      (item) => `<label class="choice">
          <input type="radio" name="${esc(name)}" value="${esc(item.id)}">
          <span>${withHint ? `<strong>${esc(item.label)}</strong><small>${esc(item.hint)}</small>` : esc(item.label)}</span>
        </label>`
    )
    .join('');
}

function assess(data) {
  return layout(
    data,
    `<p class="eyebrow">Questionnaire</p>
<h1>Tell us what is already true.</h1>
<p class="lede thin">Four short steps, then a review. Tick skills you could use this month, not ones you plan to look up. The result is roles, the skills those roles need, and courses for the gaps.</p>

<noscript>
  <p class="flash">This questionnaire needs JavaScript to move between steps. The catalogue and the role briefs work without it.</p>
</noscript>

<form id="assess" class="assess" novalidate data-preset="${esc(data.preset)}">
  <p id="step-label" class="step-label">Step 1 of 6</p>
  <p id="form-error" class="form-error" hidden></p>

  <section data-step>
    <h2>Where are you?</h2>
    <fieldset>
      <legend>Study or work</legend>
      ${radioChoices(data.stages, 'stage', true)}
    </fieldset>
    <fieldset>
      <legend>Highest study, finished or in progress</legend>
      ${radioChoices(data.education, 'education', false)}
    </fieldset>
  </section>

  <section data-step hidden>
    <h2>Which fields should we look at?</h2>
    <p>Pick one, two, or three. A field you do not pick can still appear if it sits next to one you did and your skills fit it.</p>
    <label class="filter-label" for="domain-filter">Filter the list</label>
    <input id="domain-filter" type="search" data-filter="domains" placeholder="Try data, design, finance…">
    <p id="domain-count" class="fine">None selected. Pick 1 to 3.</p>
    ${data.groups
      .map(
        (group) => `<fieldset data-group>
        <legend>${esc(group.name)}</legend>
        ${group.domains
          .map(
            (domain) => `<label class="choice">
            <input type="checkbox" name="domains" value="${esc(domain.id)}">
            <span><strong>${esc(domain.name)}</strong><small>${esc(domain.blurb)}</small></span>
          </label>`
          )
          .join('')}
      </fieldset>`
      )
      .join('')}
  </section>

  <section data-step hidden>
    <h2>What should a workday be like?</h2>
    <fieldset>
      <legend>The centre of the day</legend>
      ${radioChoices(data.focuses, 'focus', true)}
    </fieldset>
    <fieldset>
      <legend>Who is around</legend>
      ${radioChoices(data.settings, 'setting', false)}
    </fieldset>
    <fieldset>
      <legend>How defined the work is</legend>
      ${radioChoices(data.paces, 'pace', false)}
    </fieldset>
  </section>

  <section data-step hidden>
    <h2>What can you already do?</h2>
    <p>Only tick a line if you could use it at work this month. Hearing of it does not count.</p>
    <label class="filter-label" for="skill-filter">Filter skills</label>
    <input id="skill-filter" type="search" data-filter="skills" placeholder="Try SQL, writing, Excel…">
    <p id="skill-count" class="fine">None ticked yet.</p>
    ${data.skillGroups
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
    <label class="stack" for="note">Anything else we should keep with this result</label>
    <textarea id="note" name="note" maxlength="500" rows="4" placeholder="A class you liked, a project, a constraint. Optional."></textarea>
  </section>

  <section data-step hidden>
    <h2>Check this, then score it.</h2>
    <p>You can go back and change a step. Submitting runs every role in the catalogue through the same sheet.</p>
    <dl class="review" id="review"></dl>
  </section>

  <div class="assess-nav">
    <button type="button" id="back" class="button secondary" hidden>Back</button>
    <button type="button" id="next" class="button">Continue</button>
  </div>
</form>

<script src="/js/assess.js"></script>`
  );
}

function results(data) {
  const assessment = data.assessment;
  const featured = assessment.featured;
  const answers = assessment.answers;
  const saveNote = data.saved
    ? `<p class="save-note">Saved on your account. Open it again from <a href="/saved">Saved</a>.</p>`
    : `<aside class="save-note">
    <p>This result is tied to this browser session until you keep it. Create an account and it is filed under Saved, with the answers and the scores.</p>
    <p class="actions">
      <a class="button" href="/register">Create an account</a>
      <a class="quiet" href="/login">I already have one</a>
    </p>
  </aside>`;
  const note = answers.note ? `<div><dt>Your note</dt><dd>${esc(answers.note)}</dd></div>` : '';
  const matched = featured.matched.length
    ? `<p class="fine">You marked</p>
        <ul class="pills">
          ${featured.matched.map((skill) => `<li>${esc(skill.label)}</li>`).join('')}
        </ul>`
    : `<p>Nothing you marked is on this role’s list.</p>`;
  const gaps = featured.gaps.length
    ? `<p class="fine">Learn next, heavier first</p>
        <ol class="plain">
          ${featured.gaps
            .map((skill) => `<li><strong>${esc(skill.label)}</strong> · ${esc(skill.weightWord)}</li>`)
            .join('')}
        </ol>`
    : '';
  const next = assessment.next.length
    ? `<h2>The next matches</h2>
  <div class="next-list">
    ${assessment.next
      .map((item, index) => {
        const gap = item.gaps.length ? `<p class="fine">First gap: ${esc(item.gaps[0].label)}</p>` : '';
        const freeWord = item.courses.free.length === 1 ? 'course' : 'courses';
        return `<article class="match compact">
        <p class="eyebrow">${esc(index + 2)} · ${esc(item.bandLabel)} · ${esc(item.score)}/100</p>
        <h3><a href="/roles/${esc(item.role.id)}?from=${esc(assessment.id)}">${esc(item.role.title)}</a></h3>
        <p class="fine">${esc(item.domain.name)}</p>
        <p>${esc(item.reasons[0] || '')}</p>
        <p>${esc(item.reasons[1] || '')}</p>
        ${gap}
        <p class="fine">${esc(item.courses.free.length)} free ${freeWord}, ${esc(item.courses.paid.length)} paid, on the role brief.</p>
      </article>`;
      })
      .join('')}
  </div>`
    : '';

  return layout(
    data,
    `<p class="eyebrow">Result · ${esc(assessment.when)}</p>
<h1>${esc(featured.role.title)}, at ${esc(featured.score)}/100.</h1>
<p class="lede">${esc(answers.studyLine)} The lowest piece on the top match is ${esc(featured.weak.label)}.</p>
${saveNote}
<section class="recap">
  <h2>What you told us</h2>
  <dl class="mini">
    <div><dt>Where</dt><dd>${esc(answers.stage)}</dd></div>
    <div><dt>Study</dt><dd>${esc(answers.education)}</dd></div>
    <div><dt>Domains</dt><dd>${esc(answers.domains.map((item) => item.name).join(', '))}</dd></div>
    <div><dt>Workday</dt><dd>${esc(answers.focus)}</dd></div>
    <div><dt>Setting</dt><dd>${esc(answers.setting)}</dd></div>
    <div><dt>Pace</dt><dd>${esc(answers.pace)}</dd></div>
    <div><dt>Skills</dt><dd>${esc(answers.skills.map((item) => item.label).join(', '))}</dd></div>
    ${note}
  </dl>
</section>

<article class="match featured">
  <header class="match-head">
    <p class="eyebrow">${esc(featured.bandLabel)} · ${esc(featured.domain.name)}</p>
    <h2>${esc(featured.role.title)}</h2>
    <p class="score"><span>${esc(featured.score)}</span>/100</p>
    <div class="meter" aria-hidden="true"><span style="width: ${Number(featured.score)}%"></span></div>
  </header>
  <p>${esc(featured.role.summary)}</p>
  <ol class="reasons">
    ${featured.reasons.map((line) => `<li>${esc(line)}</li>`).join('')}
  </ol>
  <p class="fine">${esc(featured.rawLabel)} of ${esc(featured.maxRaw)} raw points, scaled to 100. <a href="/how">The sheet</a>.</p>

  <div class="split">
    <section>
      <h3>Points</h3>
      <table class="sheet">
        <thead>
          <tr><th>Piece</th><th>Points</th></tr>
        </thead>
        <tbody>
          ${featured.sheet
            .map(
              (row) => `<tr>
              <td>${esc(row.label)}${row.note ? `<small>${esc(row.note)}</small>` : ''}</td>
              <td>${esc(row.got)} / ${esc(row.max)}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </section>
    <section>
      <h3>Skills</h3>
      ${matched}
      ${gaps}
    </section>
  </div>

  <h3>Courses for the skills this role needs</h3>
  <p class="fine">Use these for the gaps above. Free and paid are separate, so you can see the cost before you open one.</p>
  ${coursesBlock(featured.courses)}
  <p><a href="/roles/${esc(featured.role.id)}?from=${esc(assessment.id)}">Open the role brief</a></p>
</article>
${next}
<h2>Every role, same sheet</h2>
<p class="fine">The four above are the ones worth reading first. The rest stayed in the ranking so you can see what the sheet did not prefer.</p>
<div class="table-wrap">
  <table class="rank">
    <thead>
      <tr>
        <th>Rank</th>
        <th>Role</th>
        <th>Field</th>
        <th>Score</th>
        <th>Read</th>
      </tr>
    </thead>
    <tbody>
      ${assessment.all
        .map(
          (item, index) => `<tr>
          <td>${esc(index + 1)}</td>
          <td>${esc(item.role.title)}</td>
          <td>${esc(item.domain.name)}</td>
          <td>${esc(item.score)} · ${esc(item.bandLabel)}</td>
          <td><a href="/roles/${esc(item.role.id)}?from=${esc(assessment.id)}">Brief</a></td>
        </tr>`
        )
        .join('')}
    </tbody>
  </table>
</div>

<p class="actions"><a class="button secondary" href="/assess">Take it again</a></p>`
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
  <p class="fine">No account yet? <a href="/register">Sign Up</a></p>
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
          <p>${esc(row.topScore)}/100 · ${esc(row.domains.join(', '))}</p>
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
  register,
  login,
  saved,
  notFound,
  locked,
  error
};