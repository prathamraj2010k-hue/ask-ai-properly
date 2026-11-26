/**
 * AI routes. All routes are mounted under /api in server.js.
 * The client never sees the API key - it only talks to these endpoints.
 */
const express = require('express');
const { generate, generateJSON, AIError, isDemoMode } = require('../services/aiProvider');
const { COACH_SYSTEM, FIXER_SYSTEM } = require('../services/prompts');

const router = express.Router();

/** GET /api/health - lets the frontend show a config banner */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    aiEnabled: !isDemoMode(),
    provider: process.env.AI_PROVIDER || 'gemini',
    demoMode: isDemoMode(),
  });
});

/**
 * POST /api/chat  { messages: [{role, content}, ...] }
 * Feature 2: AI Coach Chat. history includes only the last 12 turns.
 */
router.post('/chat', async (req, res, next) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AIError('No messages provided.', { status: 400, code: 'BAD_REQUEST' });
    }
    const clean = messages
      .filter((m) => m && typeof m.content === 'string' && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role === 'assistant' ? 'assistant' : 'user', content: String(m.content).slice(0, 4000) }));
    if (clean.length === 0) {
      throw new AIError('Messages must contain text content.', { status: 400, code: 'BAD_REQUEST' });
    }

    const reply = await generate({
      systemInstruction: COACH_SYSTEM,
      contents: clean,
      temperature: 0.7,
    });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/fix-prompt  { prompt, goal, tone }
 * Feature 3: Prompt Fixer Studio - returns strict JSON with the
 * upgraded prompt, a 5-part breakdown and a beginner explanation.
 */
router.post('/fix-prompt', async (req, res, next) => {
  try {
    const { prompt, goal = 'General', tone = 'Default' } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new AIError('Please type a prompt to fix.', { status: 400, code: 'BAD_REQUEST' });
    }
    if (prompt.length > 2000) {
      throw new AIError('Prompt is too long (max 2000 characters).', { status: 400, code: 'BAD_REQUEST' });
    }

    const result = await generateJSON({
      systemInstruction: FIXER_SYSTEM,
      contents: [
        {
          role: 'user',
          content: `Weak prompt to fix:\n"""\n${prompt.trim()}\n"""\nGOAL: ${goal}\nTONE: ${tone}`,
        },
      ],
      temperature: 0.4,
    });

    // Defensive validation of the AI's JSON
    if (!result || typeof result.proPrompt !== 'string' || !Array.isArray(result.breakdown)) {
      throw new AIError('The AI response was malformed. Please try again.', { code: 'AI_MALFORMED' });
    }

    res.json({
      proPrompt: String(result.proPrompt),
      whatChanged: String(result.whatChanged || ''),
      breakdown: result.breakdown.slice(0, 8),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/preview  { prompt }
 * Feature 3: Live Preview - actually run the upgraded prompt so the
 * student sees the difference between weak and strong prompts.
 */
router.post('/preview', async (req, res, next) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      throw new AIError('No prompt to preview.', { status: 400, code: 'BAD_REQUEST' });
    }
    if (prompt.length > 4000) {
      throw new AIError('Prompt is too long (max 4000 characters).', { status: 400, code: 'BAD_REQUEST' });
    }

    const reply = await generate({
      systemInstruction:
        'You are a helpful AI assistant completing the prompt you are given, exactly as a target AI would. Follow the prompt\'s format and tone instructions faithfully. Keep the answer under 350 words.',
      contents: [{ role: 'user', content: String(prompt).slice(0, 4000) }],
      temperature: 0.7,
    });

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
