(function () {
  var back = document.getElementById('go-back');
  if (!back) return;
  var sameSite = false;
  try {
    sameSite = document.referrer && new URL(document.referrer).origin === window.location.origin;
  } catch (error) {
    sameSite = false;
  }
  if (!sameSite) {
    back.hidden = true;
    return;
  }
  back.addEventListener('click', function () {
    window.history.back();
  });
})();

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