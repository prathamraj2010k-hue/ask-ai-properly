/**
 * Thin API client. All AI calls go through the Express backend,
 * so the API key never touches the browser.
 */

async function request(path, body) {
  let res;
  try {
    res = await fetch(path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the AskAIProperly server. Is it running on port 5000?');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* non-JSON response */
  }

  if (!res.ok) {
    const message =
      data?.message ||
      (res.status === 429
        ? 'Rate limit reached - please wait a few minutes and try again.'
        : 'The server returned an error. Please try again.');
    const error = new Error(message);
    error.code = data?.error;
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  health: () =>
    fetch('/api/health')
      .then((r) => r.json())
      .catch(() => ({ status: 'down', aiEnabled: false, demoMode: true })),

  chat: (messages) => request('/api/chat', { messages }),

  fixPrompt: (prompt, goal, tone) => request('/api/fix-prompt', { prompt, goal, tone }),

  preview: (prompt) => request('/api/preview', { prompt }),
};
