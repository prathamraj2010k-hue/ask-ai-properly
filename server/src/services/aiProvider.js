/**
 * AI service layer.
 * Talks to Google Gemini or OpenAI via plain REST (fetch) - no SDK lock-in.
 * The API key lives ONLY here, on the server. It is never sent to the client.
 */

const config = require('../config');

const TIMEOUT_MS = 45000;

class AIError extends Error {
  constructor(message, { status = 502, code = 'AI_ERROR' } = {}) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function assertReady() {
  if (config.ai.demoMode) {
    throw new AIError(
      'Demo mode is ON: no AI_API_KEY configured. Learn, Lab and Templates still work - add your free Gemini key to server/.env to enable AI features.',
      { status: 503, code: 'AI_NOT_CONFIGURED' }
    );
  }
}

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new AIError(
        `AI provider error (${res.status}). Check your API key and model name. ${body.slice(0, 200)}`,
        { status: 502, code: 'AI_PROVIDER_ERROR' }
      );
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Gemini: simple text generation */
async function geminiText({ systemInstruction, contents, temperature = 0.7, json = false }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.ai.geminiModel}:generateContent?key=${encodeURIComponent(config.ai.apiKey)}`;
  const body = {
    systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
    contents: contents.map((c) => ({ role: c.role === 'assistant' ? 'model' : 'user', parts: [{ text: c.content }] })),
    generationConfig: {
      temperature,
      maxOutputTokens: 2048,
      ...(json ? { responseMimeType: 'application/json' } : {}),
    },
  };
  const data = await fetchWithTimeout(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  if (!text) throw new AIError('The AI returned an empty response. Please rephrase and try again.');
  return text;
}

/** OpenAI: simple text generation */
async function openaiText({ systemInstruction, contents, temperature = 0.7, json = false }) {
  const data = await fetchWithTimeout('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.ai.apiKey}`,
    },
    body: JSON.stringify({
      model: config.ai.openaiModel,
      temperature,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
      messages: [
        ...(systemInstruction ? [{ role: 'system', content: systemInstruction }] : []),
        ...contents.map((c) => ({ role: c.role, content: c.content })),
      ],
    }),
  });
  const text = data?.choices?.[0]?.message?.content || '';
  if (!text) throw new AIError('The AI returned an empty response. Please rephrase and try again.');
  return text;
}

/** Unified entry point */
async function generate(opts) {
  assertReady();
  return config.ai.provider === 'openai' ? openaiText(opts) : geminiText(opts);
}

/**
 * Generates JSON and robustly parses it (strips markdown fences, finds object).
 * Retries once with a "fix your JSON" nudge if parsing fails.
 */
async function generateJSON(opts) {
  let raw = await generate({ ...opts, json: true, temperature: opts.temperature ?? 0.4 });
  const first = safeParse(raw);
  if (first) return first;
  raw = await generate({
    ...opts,
    json: true,
    contents: [...opts.contents, { role: 'user', content: 'Your previous reply was not valid JSON. Reply again with ONLY the valid JSON object, no markdown fences.' }],
  });
  const second = safeParse(raw);
  if (second) return second;
  throw new AIError('Could not get a structured answer from the AI. Please try again.');
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    /* try to salvage */
  }
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    /* try to find first {...} block */
  }
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end > start) {
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      return null;
    }
  }
  return null;
}

module.exports = { generate, generateJSON, AIError, isDemoMode: () => config.ai.demoMode };
