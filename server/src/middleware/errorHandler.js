/**
 * Centralised error handling.
 * Every thrown error in routes funnels through here so the client
 * always receives clean JSON - never stack traces or leaked secrets.
 */

function notFound(req, res) {
  res.status(404).json({ error: 'NOT_FOUND', message: `Route ${req.method} ${req.originalUrl} does not exist.` });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || 500;

  // Log server-side, but never send internals to the client.
  if (status >= 500) {
    console.error('[ERROR]', err.message, '\n', err.stack);
  }

  let message = err.message || 'Something went wrong on our side. Please try again.';

  // Map common upstream failures to friendly messages.
  if (err.name === 'AbortError') {
    message = 'The AI took too long to respond. Please try again.';
    err.status = 504;
  }

  res.status(err.status || status).json({
    error: err.code || 'SERVER_ERROR',
    message,
  });
}

module.exports = { notFound, errorHandler };
