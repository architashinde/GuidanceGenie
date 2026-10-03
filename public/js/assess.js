(function () {
  const form = document.getElementById('assess');
  if (!form) return;

  const steps = Array.from(form.querySelectorAll('[data-step]'));
  const errorEl = document.getElementById('form-error');
  const labelEl = document.getElementById('step-label');
  const backBtn = document.getElementById('back');
  const nextBtn = document.getElementById('next');
  const storageKey = 'gg-assess-draft';
  let index = 0;

  function checked(name) {
    return form.querySelector('input[name="' + name + '"]:checked');
  }

  function checkedAll(name) {
    return Array.from(form.querySelectorAll('input[name="' + name + '"]:checked')).map(function (el) {
      return el.value;
    });
  }

  function choiceText(input) {
    if (!input) return '';
    const label = input.closest('label');
    const strong = label.querySelector('strong');
    return (strong ? strong.textContent : label.textContent).trim();
  }

  function payload() {
    return {
      stage: checked('stage') ? checked('stage').value : '',
      education: checked('education') ? checked('education').value : '',
      domains: checkedAll('domains'),
      focus: checked('focus') ? checked('focus').value : '',
      setting: checked('setting') ? checked('setting').value : '',
      pace: checked('pace') ? checked('pace').value : '',
      skills: checkedAll('skills'),
      note: form.elements.note.value.trim()
    };
  }

  function showError(message) {
    errorEl.hidden = !message;
    errorEl.textContent = message || '';
  }

  function validate(step) {
    const data = payload();
    if (step === 0 && (!data.stage || !data.education)) {
      return 'Choose where you are, and the study you have or are in.';
    }
    if (step === 1 && (data.domains.length < 1 || data.domains.length > 3)) {
      return 'Pick one, two, or three domains.';
    }
    if (step === 2 && (!data.focus || !data.setting || !data.pace)) {
      return 'Answer all three parts of the workday.';
    }
    if (step === 3 && data.skills.length < 1) {
      return 'Tick at least one skill you could use this month. Writing, Excel, and support count.';
    }
    if (step === 3 && data.note.length > 500) {
      return 'Keep the note under 500 characters.';
    }
    return '';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function fillReview() {
    const data = payload();
    const rows = [
      ['Where', choiceText(checked('stage'))],
      ['Study', choiceText(checked('education'))],
      ['Domains', Array.from(form.querySelectorAll('input[name="domains"]:checked')).map(choiceText).join(', ')],
      ['Workday', choiceText(checked('focus'))],
      ['Setting', choiceText(checked('setting'))],
      ['Pace', choiceText(checked('pace'))],
      ['Skills', Array.from(form.querySelectorAll('input[name="skills"]:checked')).map(choiceText).join(', ')],
      ['Note', data.note || 'None']
    ];
    document.getElementById('review').innerHTML = rows.map(function (row) {
      return '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>';
    }).join('');
  }

  function show(step) {
    index = step;
    steps.forEach(function (section, n) {
      section.hidden = n !== step;
    });
    labelEl.textContent = 'Step ' + (step + 1) + ' of ' + steps.length;
    backBtn.hidden = step === 0;
    nextBtn.disabled = false;
    nextBtn.textContent = step === steps.length - 1 ? 'See my matches' : 'Continue';
    showError('');
    if (step === steps.length - 1) fillReview();
    window.scrollTo(0, 0);
  }

  function saveDraft() {
    sessionStorage.setItem(storageKey, JSON.stringify({ step: index, answers: payload() }));
  }

  function updateDomainCount() {
    const count = checkedAll('domains').length;
    const el = document.getElementById('domain-count');
    if (count === 0) el.textContent = 'None selected. Pick 1 to 3.';
    else if (count === 1) el.textContent = '1 selected. You can add two more.';
    else el.textContent = count + ' selected.';
  }

  function updateSkillCount() {
    const count = checkedAll('skills').length;
    document.getElementById('skill-count').textContent = count === 0 ? 'None ticked yet.' : count + ' ticked.';
  }

  function applyAnswers(answers) {
    ['stage', 'education', 'focus', 'setting', 'pace'].forEach(function (name) {
      if (!answers[name]) return;
      const el = form.querySelector('input[name="' + name + '"][value="' + CSS.escape(answers[name]) + '"]');
      if (el) el.checked = true;
    });
    ['domains', 'skills'].forEach(function (name) {
      const picked = new Set(answers[name] || []);
      form.querySelectorAll('input[name="' + name + '"]').forEach(function (el) {
        el.checked = picked.has(el.value);
      });
    });
    if (typeof answers.note === 'string') form.elements.note.value = answers.note;
    updateDomainCount();
    updateSkillCount();
  }

  form.addEventListener('change', function (event) {
    if (event.target.name === 'domains') {
      if (checkedAll('domains').length > 3) {
        event.target.checked = false;
        showError('Three is the cap. Clear one if this field matters more.');
      } else {
        showError('');
      }
      updateDomainCount();
    }
    if (event.target.name === 'skills') updateSkillCount();
  });

  form.querySelectorAll('[data-filter]').forEach(function (input) {
    input.addEventListener('input', function () {
      const query = input.value.trim().toLowerCase();
      const section = input.closest('section');
      section.querySelectorAll('label.choice').forEach(function (label) {
        label.hidden = query.length > 0 && label.textContent.toLowerCase().indexOf(query) === -1;
      });
      section.querySelectorAll('[data-group]').forEach(function (group) {
        const visible = Array.from(group.querySelectorAll('label.choice')).some(function (label) {
          return !label.hidden;
        });
        group.hidden = !visible;
      });
    });
  });

  backBtn.addEventListener('click', function () {
    if (index === 0) return;
    saveDraft();
    show(index - 1);
  });

  nextBtn.addEventListener('click', async function () {
    const message = validate(index);
    if (message) {
      showError(message);
      return;
    }
    saveDraft();
    if (index < steps.length - 1) {
      show(index + 1);
      return;
    }

    nextBtn.disabled = true;
    nextBtn.textContent = 'Ranking roles…';
    showError('');
    try {
      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload())
      });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        showError(data.error || 'The server rejected that submission.');
        nextBtn.disabled = false;
        nextBtn.textContent = 'See my matches';
        return;
      }
      sessionStorage.removeItem(storageKey);
      window.location.href = '/results/' + data.id;
    } catch (error) {
      showError('Could not reach the server. Leave this tab open and try again.');
      nextBtn.disabled = false;
      nextBtn.textContent = 'See my matches';
    }
  });

  let restored = false;
  try {
    const draft = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    if (draft && draft.answers) {
      applyAnswers(draft.answers);
      const step = Number.isInteger(draft.step) ? Math.min(Math.max(draft.step, 0), steps.length - 1) : 0;
      show(step);
      restored = true;
    }
  } catch (error) {
    sessionStorage.removeItem(storageKey);
  }

  if (!restored) {
    const preset = form.dataset.preset;
    if (preset) {
      const box = form.querySelector('input[name="domains"][value="' + CSS.escape(preset) + '"]');
      if (box) box.checked = true;
      updateDomainCount();
    }
    show(0);
  }
})();