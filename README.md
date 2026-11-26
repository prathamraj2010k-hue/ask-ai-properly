# AskAIProperly.app

An interactive AI education platform that teaches everyday users how to:

- understand how AI actually "thinks" (prediction, tokens, hallucinations),
- write high-performing prompts using the **Golden Formula: Role + Task + Context + Format + Tone**,
- iterate on conversations like a pro,
- understand the difference between Chatbots, Copilots and Autonomous AI Agents.

---

## What's inside

| Tab | Feature | Needs API key? |
|---|---|---|
| **Learn** | 4 interactive modules with analogies, Bad-vs-Good prompt demos and unlock quizzes (progress saved in localStorage) | No |
| **Coach** | AI chat tutor with a patient-teacher persona + 4 starter questions | **Yes** |
| **Fixer** | Prompt Fixer Studio: paste a weak prompt, get a pro prompt, a colour-coded Role/Task/Context/Format/Tone breakdown and a live AI preview | **Yes** |
| **Visual Lab** | Animated simulator comparing Standard Chatbot vs AI Copilot vs Autonomous Agent on the same task | No |
| **Templates** | 15 fill-in-the-blank prompt templates across 5 categories, with live preview, Copy and "Test in Coach Chat" | No (AI needed only for the test) |

---

## Tech stack

- **Frontend:** React 18 + Vite + Tailwind CSS + lucide-react (light/dark mode, mobile-first)
- **Backend:** Node.js + Express - a secure AI proxy. **Your API key lives only on the server and never reaches the browser.**
- **AI provider:** Google Gemini (default) or OpenAI - switch with one env var. No SDK lock-in, plain REST.
- **Rate limiting:** `express-rate-limit` with a global limit plus a stricter limit on AI endpoints.
- **Storage:** localStorage on the client (progress, chat history, saved prompts). No database needed.

---

## Step-by-step local setup

### Prerequisites
- **Node.js 18+** (check with `node -v`)
- One free AI API key:
  - Gemini (recommended, has a free tier): https://aistudio.google.com/apikey
  - or OpenAI: https://platform.openai.com/api-keys

### 1. Install dependencies

```bash
npm install          # root tooling (concurrently)
npm --prefix server install
npm --prefix client install
```

or simply:

```bash
npm run install-all
```

### 2. Configure your API key (REQUIRED only for AI features)

```bash
cd server
cp env.example .env
```

Then open `server/.env` and edit:

```env
AI_PROVIDER=gemini
AI_API_KEY=your_key_here      <-- paste your real key here
GEMINI_MODEL=gemini-1.5-flash
```

> **No key yet?** The app still runs in **demo mode**: Learn, Visual Lab and
> Templates work fully offline; AI tabs show a friendly "not configured" message.

### 3. Run the app

From the project root:

```bash
npm run dev
```

This starts both servers:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

Open **http://localhost:5173** in your browser. Done!

### 4. Production build (optional)

```bash
npm run build            # builds the frontend into client/dist
npm start                # serves the backend API on port 5000
```

---

## Project structure

```
ask-ai-properly/
├── package.json               # root scripts (dev both, install-all)
├── server/                    # Express backend (AI proxy)
│   ├── server.js              # entry point, CORS, rate-limit wiring
│   ├── env.example            # AI_API_KEY and settings template (rename to .env)
│   └── src/
│       ├── config.js          # env loading + demo-mode detection
│       ├── middleware/
│       │   ├── rateLimiter.js # global + strict AI rate limits
│       │   └── errorHandler.js# clean JSON errors, no leaked internals
│       ├── routes/ai.js       # /api/health /api/chat /api/fix-prompt /api/preview
│       └── services/
│           ├── aiProvider.js  # Gemini/OpenAI REST client, JSON mode, retries
│           └── prompts.js     # server-side system instructions (Coach & Fixer personas)
└── client/                    # React + Vite frontend
    └── src/
        ├── App.jsx            # layout, sidebar, mobile nav, theme toggle
        ├── context/           # ThemeContext, ProgressContext (localStorage)
        ├── hooks/useLocalStorage.js
        ├── lib/api.js         # typed client for the backend
        ├── data/
        │   ├── lessons.js     # 4 learning modules + quizzes
        │   └── templates.js   # 15 prompt templates, 5 categories
        ├── components/
        │   ├── LessonModal.jsx / Quiz.jsx
        │   └── TemplateModal.jsx
        └── pages/
            ├── Learn.jsx      # Feature 1: learning path
            ├── Coach.jsx      # Feature 2: AI Coach chat
            ├── Fixer.jsx      # Feature 3: Prompt Fixer Studio
            ├── Lab.jsx        # Feature 4: Agent Visual Lab
            └── Templates.jsx  # Feature 5: template library
```

---

## Going live on your domain (askaimproperly.app)

When you deploy to a real domain, two settings must change:

1. **CORS** - in `server/.env` add your live origin (comma-separated for www + apex):

   ```env
   CLIENT_ORIGIN=https://askaimproperly.app,https://www.askaimproperly.app
   ```

2. **Serving the frontend** - build it once:

   ```bash
   npm run build       # outputs client/dist
   ```

   Then serve `client/dist` as static files and point `/api` to the Express
   server. Two common options:

   - **Single server (simplest):** serve the built frontend from Express - add
     `app.use(express.static(path.join(__dirname, '../client/dist')))` and a
     catch-all route to `index.html` in `server.js`, and host one process.
   - **Two hosts (e.g. Vercel/Netlify for frontend + VPS/Railway for backend):**
     host `client/dist` on the static host, and set the API base URL in
     `client/src/lib/api.js` to your backend URL (e.g. `https://api.askaimproperly.app`).

3. **DNS** - point the domain's A/AAAA or CNAME record at your host, enable
   HTTPS (Let's Encrypt is free), and you are live.

> Reminder: never commit `server/.env`. On your host, set `AI_API_KEY` in the
> host's environment-variable settings instead.

---

## Security notes

- The API key is read **only** by the Express server from `server/.env`.
- The browser talks exclusively to `/api/*` on your own backend - no key is ever bundled into the frontend.
- CORS restricts which origins may call the API (default: `http://localhost:5173`).
- All AI endpoints are rate-limited; errors are returned as clean JSON without stack traces.

## Troubleshooting

| Problem | Fix |
|---|---|
| "Cannot reach the AskAIProperly server" | Make sure the backend runs: `npm --prefix server run dev` |
| "Demo mode" banner / AI tabs show a message | Add your key to `server/.env` and restart the server |
| 429 / "Too many requests" | You hit the rate limit - wait for the window (default 15 min) to reset |
| Provider error 401/403 | Check the API key value and that `AI_PROVIDER` matches the key you have |
| Port already in use | Change `PORT` in `server/.env` and the target in `client/vite.config.js` |
