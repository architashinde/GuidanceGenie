(function () {
  const form = document.getElementById('chat-form');
  const thread = document.getElementById('thread');
  const errorEl = document.getElementById('chat-error');
  const input = document.getElementById('chat-message');
  if (!form || !thread || !input) return;

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function add(role, text) {
    const node = document.createElement('p');
    node.className = 'bubble ' + (role === 'user' ? 'user' : 'guide');
    node.textContent = text;
    thread.appendChild(node);
    node.scrollIntoView({ block: 'nearest' });
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    errorEl.hidden = true;
    add('user', message);
    input.value = '';
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ message: message })
      });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) {
        errorEl.hidden = false;
        errorEl.textContent = data.error || 'The guide could not take that message.';
        return;
      }
      add('guide', data.reply);
      if (data.assessmentId) {
        const link = document.createElement('p');
        link.innerHTML = '<a class="button" href="/results/' + escapeHtml(data.assessmentId) + '">Open the careers and courses</a>';
        thread.appendChild(link);
      }
    } catch (error) {
      errorEl.hidden = false;
      errorEl.textContent = 'Could not reach the server.';
    } finally {
      button.disabled = false;
      input.focus();
    }
  });
})();