document.querySelectorAll('form[data-confirm]').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    if (!window.confirm(form.getAttribute('data-confirm'))) {
      event.preventDefault();
    }
  });
});

document.querySelectorAll('form[action="/login"], form[action="/register"]').forEach(function (form) {
  form.addEventListener('submit', function () {
    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;
  });
});