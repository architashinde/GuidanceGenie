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

  function field(name) {
    return form.elements[name] ? form.elements[name].value.trim() : '';
  }

  function payload() {
    return {
      education: checked('education') ? checked('education').value : '',
      currentRole: field('currentRole'),
      years: field('years'),
      stream: checked('stream') ? checked('stream').value : '',
      streamOther: field('streamOther'),
      subjects: checkedAll('subjects'),
      subjectsOther: field('subjectsOther'),
      interests: checkedAll('interests'),
      interestsOther: field('interestsOther'),
      skills: checkedAll('skills'),
      skillsOther: field('skillsOther'),
      aim: checked('aim') ? checked('aim').value : '',
      note: field('note')
    };
  }

  function showError(message) {
    errorEl.hidden = !message;
    errorEl.textContent = message || '';
  }

  function validate(step) {
    const data = payload();
    if (step === 0 && !data.education) return 'Choose Class 10, Class 12, a diploma, a degree, postgraduate study, or already working.';
    if (step === 0 && data.education === 'working' && data.currentRole.length < 2) return 'Name the role you already have.';
    if (step === 0 && data.education === 'working' && !/^\d{1,2}$/.test(data.years)) return 'Add how many years you have been working.';
    if (step === 2 && data.subjects.length < 1 && data.subjectsOther.length < 2) {
      return 'Tick a subject, or type the courses you had.';
    }
    if (step === 3 && data.interests.length < 1 && data.interestsOther.length < 2) {
      return 'Tick an interest, or type what you actually want to do.';
    }
    if (step === 4 && data.skills.length < 1 && data.skillsOther.length < 2) {
      return 'Tick a skill you could use now, or type one.';
    }
    if (step === 5 && !data.aim) return 'Choose what you want next.';
    return '';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function names(selector) {
    return Array.from(form.querySelectorAll(selector)).map(choiceText).filter(Boolean).join(', ');
  }

  function fillReview() {
    const data = payload();
    const rows = [
      ['Education', choiceText(checked('education'))],
      ['Current role', data.currentRole],
      ['Years', data.years],
      ['Stream', [choiceText(checked('stream')), data.streamOther].filter(Boolean).join('. ')],
      ['Subjects', [names('input[name="subjects"]:checked'), data.subjectsOther].filter(Boolean).join('. ')],
      ['Interests', [names('input[name="interests"]:checked'), data.interestsOther].filter(Boolean).join('. ')],
      ['Skills', [names('input[name="skills"]:checked'), data.skillsOther].filter(Boolean).join('. ')],
      ['Next', choiceText(checked('aim'))],
      ['Note', data.note]
    ];
    const review = document.getElementById('review');
    review.innerHTML = rows.filter(function (row) { return row[1]; }).map(function (row) {
      return '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>';
    }).join('');
  }

  function show(step) {
    index = step;
    steps.forEach(function (section, i) {
      section.hidden = i !== step;
    });
    labelEl.textContent = 'Step ' + (step + 1) + ' of ' + steps.length;
    backBtn.hidden = step === 0;
    nextBtn.textContent = step === steps.length - 1 ? 'See careers' : 'Continue';
    if (step === steps.length - 1) fillReview();
    showError('');
  }

  function saveDraft() {
    const data = payload();
    data.step = index;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }

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
    nextBtn.textContent = 'Finding careers…';
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
        nextBtn.textContent = 'See careers';
        return;
      }
      sessionStorage.removeItem(storageKey);
      window.location.href = '/results/' + data.id;
    } catch (error) {
      showError('Could not reach the server. Leave this tab open and try again.');
      nextBtn.disabled = false;
      nextBtn.textContent = 'See careers';
    }
  });

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const draft = JSON.parse(raw);
      ['currentRole', 'years', 'streamOther', 'subjectsOther', 'interestsOther', 'skillsOther', 'note'].forEach(function (name) {
        if (draft[name] && form.elements[name]) form.elements[name].value = draft[name];
      });
      ['education', 'stream', 'aim'].forEach(function (name) {
        if (!draft[name]) return;
        const input = form.querySelector('input[name="' + name + '"][value="' + draft[name] + '"]');
        if (input) input.checked = true;
      });
      ['subjects', 'interests', 'skills'].forEach(function (name) {
        (draft[name] || []).forEach(function (value) {
          const input = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
          if (input) input.checked = true;
        });
      });
      if (Number.isInteger(draft.step)) show(Math.min(Math.max(draft.step, 0), steps.length - 1));
    }
  } catch (error) {
    sessionStorage.removeItem(storageKey);
  }

  show(index);
})();(function () {
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

  function field(name) {
    return form.elements[name] ? form.elements[name].value.trim() : '';
  }

  function payload() {
    return {
      education: checked('education') ? checked('education').value : '',
      currentRole: field('currentRole'),
      years: field('years'),
      stream: checked('stream') ? checked('stream').value : '',
      streamOther: field('streamOther'),
      subjects: checkedAll('subjects'),
      subjectsOther: field('subjectsOther'),
      interests: checkedAll('interests'),
      interestsOther: field('interestsOther'),
      skills: checkedAll('skills'),
      skillsOther: field('skillsOther'),
      aim: checked('aim') ? checked('aim').value : '',
      note: field('note')
    };
  }

  function showError(message) {
    errorEl.hidden = !message;
    errorEl.textContent = message || '';
  }

  function validate(step) {
    const data = payload();
    if (step === 0 && !data.education) return 'Choose Class 10, Class 12, a diploma, a degree, postgraduate study, or already working.';
    if (step === 0 && data.education === 'working' && data.currentRole.length < 2) return 'Name the role you already have.';
    if (step === 0 && data.education === 'working' && !/^\d{1,2}$/.test(data.years)) return 'Add how many years you have been working.';
    if (step === 2 && data.subjects.length < 1 && data.subjectsOther.length < 2) {
      return 'Tick a subject, or type the courses you had.';
    }
    if (step === 3 && data.interests.length < 1 && data.interestsOther.length < 2) {
      return 'Tick an interest, or type what you actually want to do.';
    }
    if (step === 4 && data.skills.length < 1 && data.skillsOther.length < 2) {
      return 'Tick a skill you could use now, or type one.';
    }
    if (step === 5 && !data.aim) return 'Choose what you want next.';
    return '';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function names(selector) {
    return Array.from(form.querySelectorAll(selector)).map(choiceText).filter(Boolean).join(', ');
  }

  function fillReview() {
    const data = payload();
    const rows = [
      ['Education', choiceText(checked('education'))],
      ['Current role', data.currentRole],
      ['Years', data.years],
      ['Stream', [choiceText(checked('stream')), data.streamOther].filter(Boolean).join('. ')],
      ['Subjects', [names('input[name="subjects"]:checked'), data.subjectsOther].filter(Boolean).join('. ')],
      ['Interests', [names('input[name="interests"]:checked'), data.interestsOther].filter(Boolean).join('. ')],
      ['Skills', [names('input[name="skills"]:checked'), data.skillsOther].filter(Boolean).join('. ')],
      ['Next', choiceText(checked('aim'))],
      ['Note', data.note]
    ];
    const review = document.getElementById('review');
    review.innerHTML = rows.filter(function (row) { return row[1]; }).map(function (row) {
      return '<div><dt>' + escapeHtml(row[0]) + '</dt><dd>' + escapeHtml(row[1]) + '</dd></div>';
    }).join('');
  }

  function show(step) {
    index = step;
    steps.forEach(function (section, i) {
      section.hidden = i !== step;
    });
    labelEl.textContent = 'Step ' + (step + 1) + ' of ' + steps.length;
    backBtn.hidden = step === 0;
    nextBtn.textContent = step === steps.length - 1 ? 'See careers' : 'Continue';
    if (step === steps.length - 1) fillReview();
    showError('');
  }

  function saveDraft() {
    const data = payload();
    data.step = index;
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }

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
    nextBtn.textContent = 'Finding careers…';
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
        nextBtn.textContent = 'See careers';
        return;
      }
      sessionStorage.removeItem(storageKey);
      window.location.href = '/results/' + data.id;
    } catch (error) {
      showError('Could not reach the server. Leave this tab open and try again.');
      nextBtn.disabled = false;
      nextBtn.textContent = 'See careers';
    }
  });

  try {
    const raw = sessionStorage.getItem(storageKey);
    if (raw) {
      const draft = JSON.parse(raw);
      ['currentRole', 'years', 'streamOther', 'subjectsOther', 'interestsOther', 'skillsOther', 'note'].forEach(function (name) {
        if (draft[name] && form.elements[name]) form.elements[name].value = draft[name];
      });
      ['education', 'stream', 'aim'].forEach(function (name) {
        if (!draft[name]) return;
        const input = form.querySelector('input[name="' + name + '"][value="' + draft[name] + '"]');
        if (input) input.checked = true;
      });
      ['subjects', 'interests', 'skills'].forEach(function (name) {
        (draft[name] || []).forEach(function (value) {
          const input = form.querySelector('input[name="' + name + '"][value="' + value + '"]');
          if (input) input.checked = true;
        });
      });
      if (Number.isInteger(draft.step)) show(Math.min(Math.max(draft.step, 0), steps.length - 1));
    }
  } catch (error) {
    sessionStorage.removeItem(storageKey);
  }

  show(index);
})();