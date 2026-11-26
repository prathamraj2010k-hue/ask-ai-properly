# Deploying AskAIProperly (frontend + backend on one URL)

This app is designed to run as **ONE Node.js server** in production:
after building the frontend, Express serves `client/dist` and the API
from the same origin. No CORS problems, one URL for your domain.

Recommended host for beginners: **Render.com** (also works the same on
Railway, Fly.io or any VPS). A free tier exists; paid plans remove
cold-start sleeps.

---

## Step 0 - Put the code on GitHub

```bash
cd ask-ai-properly
git init
git add .
git commit -m "AskAIProperly initial release"
# create a repo on github.com, then:
git remote add origin https://github.com/<your-username>/ask-ai-properly.git
git push -u origin main
```

> Do NOT commit `server/.env` (it is already in `.gitignore`).

---

## Step 1 - Create the service on Render

1. Go to https://render.com → sign in → **New → Web Service**.
2. Connect your GitHub repo `ask-ai-properly`.
3. Fill in:
   - **Runtime:** Node
   - **Build Command:**
     ```
     npm install && npm --prefix server install && npm --prefix client install && npm --prefix client run build
     ```
   - **Start Command:**
     ```
     npm --prefix server start
     ```
4. Open **Environment** and add these variables:

   | Key | Value |
   |---|---|
   | `AI_PROVIDER` | `gemini` (or `openai`) |
   | `AI_API_KEY` | your real Gemini/OpenAI key |
   | `GEMINI_MODEL` | `gemini-1.5-flash` |
   | `OPENAI_MODEL` | `gpt-4o-mini` |
   | `CLIENT_ORIGIN` | `https://askaimproperly.app,https://www.askaimproperly.app` |
   | `RATE_LIMIT_WINDOW_MINUTES` | `15` |
   | `RATE_LIMIT_MAX` | `60` |

   (`PORT` is set automatically by Render - do not override it.)
5. Click **Create Web Service**. First deploy takes ~5 minutes.
   You will get a URL like `https://ask-ai-properly.onrender.com`.
   Test it: opening the URL should show the app, and
   `https://<your-app>.onrender.com/api/health` should return JSON.

---

## Step 2 - Connect your domain (askaimproperly.app)

1. In Render: your service → **Settings → Custom Domains → Add Custom Domain**
   → enter `askaimproperly.app` (repeat for `www.askaimproperly.app`).
2. Render shows a **CNAME record** (something like
   `ask-ai-properly.onrender.com`) or an A record for the apex domain.
3. Go to your domain registrar's DNS panel (where you bought the domain)
   and add exactly what Render asked for:

   | Type | Host/Name | Value |
   |---|---|---|
   | CNAME | `www` | `ask-ai-properly.onrender.com` |
   | ALIAS/ANAME or A | `@` | (the IP Render shows, or use CNAME flattening) |

4. Wait for DNS propagation (5 min - a few hours). HTTPS is issued
   automatically and renewed by Render - nothing to configure.

---

## Step 3 - Verify everything works

| Check | URL | Expected |
|---|---|---|
| App loads | `https://askaimproperly.app` | Home page with learning path |
| API reachable | `https://askaimproperly.app/api/health` | `{"status":"ok","aiEnabled":true,...}` |
| AI features | Coach tab → ask a question | Real AI reply (no demo banner) |
| Rate limiting | spam 40+ requests quickly | 429 "Too many requests" |

If `aiEnabled` is `false`, the `AI_API_KEY` environment variable is missing
or still `your_key_here` - fix it in the Render dashboard and redeploy.

---

## Alternative: your own VPS (Ubuntu + Caddy)

If you prefer a $5 VPS (Hetzner/DigitalOcean/Linode):

```bash
# 1. Install Node and Caddy (Caddy handles HTTPS automatically)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs caddy

# 2. Get the code and build
git clone https://github.com/<your-username>/ask-ai-properly.git
cd ask-ai-properly
npm run install-all && npm run build
cp server/env.example server/.env   # then edit: paste AI_API_KEY

# 3. Run forever with pm2
sudo npm i -g pm2
pm2 start server/server.js --name askai
pm2 save && pm2 startup

# 4. Point Caddy at it - /etc/caddy/Caddyfile:
#    askaimproperly.app, www.askaimproperly.app {
#        reverse_proxy localhost:5000
#    }
sudo systemctl reload caddy
```

Done - Caddy obtains and renews HTTPS certificates automatically.

---

## Cost / limits cheat sheet

| Thing | Free tier reality |
|---|---|
| Render free instance | Sleeps after 15 min idle; first visit ~30-50s cold start |
| Gemini API | Free tier is generous; fine for a learning site |
| OpenAI API | Pay-as-you-go; `gpt-4o-mini` keeps costs tiny |
| Rate limiting | Already built in (60 req / 15 min per IP, stricter on AI endpoints) |
