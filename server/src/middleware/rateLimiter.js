/**
 * Basic rate limiter applied to all /api routes.
 * Protects your API key (and your wallet) from abuse and runaway loops.
 */
const rateLimit = require('express-rate-limit');
const config = require('../config');

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMinutes * 60 * 1000,
  max: config.rateLimit.max, // max requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMITED',
    message: `Too many requests. Please wait ${config.rateLimit.windowMinutes} minutes and try again.`,
  },
});

// Stricter limiter for AI generation endpoints (they cost real tokens).
const aiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMinutes * 60 * 1000,
  max: Math.max(10, Math.floor(config.rateLimit.max / 2)),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'RATE_LIMITED',
    message: 'You are using the AI very quickly. Take a short break and try again in a few minutes.',
  },
});

module.exports = { apiLimiter, aiLimiter };
