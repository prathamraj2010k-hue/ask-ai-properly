/**
 * AskAIProperly - Express server entry point.
 *
 * Responsibilities:
 *  - Serve a small, secure proxy API in front of the AI provider
 *  - Never expose the API key to the client
 *  - Apply rate limiting and centralised error handling
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const config = require('./src/config');
const { apiLimiter, aiLimiter } = require('./src/middleware/rateLimiter');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');
const aiRoutes = require('./src/routes/ai');

const app = express();

// ---- Global middleware ----
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));

// CORS: only allow the configured frontend origins.
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || config.clientOrigin.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  })
);

// Rate limiting (per IP)
app.use('/api', apiLimiter);

// AI generation endpoints get a stricter limiter on top of the global one.
app.use(['/api/chat', '/api/fix-prompt', '/api/preview'], aiLimiter);

// ---- Routes ----
app.use('/api', aiRoutes);

// ---- Production: serve the built frontend from ONE server ----
// After `npm run build`, client/dist exists. Then this single process serves
// both the website and the API on the same origin - no CORS issues, one URL
// to point your domain at.
const distDir = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(path.join(distDir, 'index.html'))) {
  app.use(express.static(distDir));
  // SPA fallback: any non-API route returns the app shell.
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distDir, 'index.html'));
  });
  console.log('  Serving frontend from client/dist (production mode)');
} else {
  app.get('/', (req, res) => {
    res.json({ name: 'AskAIProperly server', status: 'ok', docs: 'See README.md at the repo root.' });
  });
}

// ---- Errors ----
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log('==========================================');
  console.log('  AskAIProperly server is running');
  console.log(`  Port:            ${config.port}`);
  console.log(`  Allowed origin:  ${config.clientOrigin.join(', ')}`);
  console.log(`  AI provider:     ${config.ai.provider}`);
  console.log(`  AI enabled:      ${config.ai.demoMode ? 'NO  (demo mode - add AI_API_KEY to .env)' : 'YES'}`);
  console.log('==========================================');
});
