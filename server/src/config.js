/**
 * AskAIProperly - Configuration loader
 * Reads and validates environment variables. The AI provider is
 * switchable (Gemini or OpenAI) without touching any other code.
 */
require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  clientOrigin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean),

  ai: {
    provider: (process.env.AI_PROVIDER || 'gemini').toLowerCase(),
    apiKey: process.env.AI_API_KEY || '',
    geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    // DEMO_MODE=1 lets the server start without a key; AI endpoints
    // then return a friendly "not configured" response instead of crashing.
    demoMode: process.env.DEMO_MODE === '1' || !process.env.AI_API_KEY || process.env.AI_API_KEY === 'your_key_here',
  },

  rateLimit: {
    windowMinutes: parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX || '60', 10),
  },
};

module.exports = config;
