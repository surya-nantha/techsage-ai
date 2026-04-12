# TechSage AI 🤖
### Your friendly AI companion for senior technology literacy

Built for **GenLink Hacks 2026** — helping senior citizens feel confident with technology.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/techsage-ai)

---

## What it does

| Feature | Description |
|---|---|
| 🎤 **Voice AI Assistant** | Ask any tech question by speaking or typing — Claude answers in plain, senior-friendly language |
| 🛡️ **Scam Detector** | Paste or speak a suspicious message — AI tells you if it's a scam and why |
| 🎯 **Practice Quiz** | 10 real scam scenarios to practice spotting fraud |
| 📚 **Step-by-Step Tutorials** | 6 guided lessons: email, video calls, Wi-Fi, photos, AI assistants, passwords |
| 🌐 **Tamil + English** | Full bilingual support including voice input |
| 🔤 **Adjustable text size** | A+ / A− controls for accessibility |

---

## Local Development (5 minutes)

### Prerequisites
- Node.js 18 or higher — download from [nodejs.org](https://nodejs.org)
- A free OpenRouter API key — get one at [openrouter.ai/keys](https://openrouter.ai/keys)

### Step 1 — Clone and install
```bash
git clone https://github.com/YOUR_USERNAME/techsage-ai.git
cd techsage-ai
npm install
npm install express cors   # for local dev server only
```

### Step 2 — Add your API key
```bash
cp .env.example .env.local
```
Open `.env.local` and replace `sk-ant-your-key-here` with your real Anthropic API key.

### Step 3 — Run the app
You need two terminals:

**Terminal 1 — API proxy server:**
```bash
node dev-server.js
```

**Terminal 2 — React frontend:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

> **Voice input** works best in **Chrome** or **Edge**. Safari supports text input only.

---

## Deploy to Vercel (Free — takes 2 minutes)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit — TechSage AI"
git remote add origin https://github.com/YOUR_USERNAME/techsage-ai.git
git push -u origin main
```

### Step 2 — Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with your GitHub account
2. Click **"Add New Project"**
3. Select your `techsage-ai` repository
4. Click **Deploy** (Vercel auto-detects Vite — no config needed)

### Step 3 — Add your API key to Vercel
1. In Vercel dashboard → your project → **Settings → Environment Variables**
2. Add: `OPENROUTER_API_KEY` = your key
3. Click **Save** then **Redeploy**

Your app is now live at `https://techsage-ai.vercel.app` (or similar) — share this URL!

---

## Project Structure

```
techsage-ai/
├── api/
│   └── chat.js              ← Serverless proxy (Claude API lives here, key is safe)
├── src/
│   ├── App.jsx              ← Root: router, settings context, nav
│   ├── main.jsx             ← React entry point
│   ├── components/
│   │   ├── MicButton.jsx    ← Animated mic button (idle/listening/processing/error)
│   │   ├── Card.jsx         ← Reusable senior-friendly card container
│   │   └── VerdictCard.jsx  ← Scam verdict display (green/amber/red)
│   ├── hooks/
│   │   ├── useSpeechRecognition.js  ← Web Speech API (voice → text)
│   │   ├── useSpeechSynthesis.js    ← Web Speech API (text → voice)
│   │   └── useClaudeAPI.js          ← Fetch wrapper with rate limiting
│   ├── pages/
│   │   ├── HomePage.jsx     ← Voice assistant + quick questions
│   │   ├── ScamDetector.jsx ← Paste/speak message → AI verdict
│   │   ├── ScamQuiz.jsx     ← 10-question interactive quiz
│   │   └── Tutorials.jsx    ← 6 step-by-step lesson cards
│   └── data/
│       ├── tutorials.json   ← All tutorial content (edit freely)
│       └── quizScenarios.json ← All quiz questions (add more easily)
├── index.html
├── vite.config.js
├── vercel.json
├── dev-server.js            ← Local API proxy for development
└── .env.example             ← Copy to .env.local and add your key
```

---

## Customizing Content

### Add a new quiz scenario
Open `src/data/quizScenarios.json` and add:
```json
{
  "id": "q011",
  "scenario": "The suspicious message text goes here...",
  "correctAnswer": "SCAM",
  "explanation": "Why this is a scam, in plain language for seniors.",
  "redFlags": ["Red flag 1", "Red flag 2"]
}
```

### Add a new tutorial
Open `src/data/tutorials.json` and add a new object following the existing pattern. Each tutorial needs an `id`, `title`, `icon`, `difficulty`, `description`, and an array of `steps`.

### Change the AI personality
Edit the `ASSISTANT_SYSTEM_PROMPT` constant in `api/chat.js` to adjust how TechSage speaks to users.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Inline CSS (no dependencies) |
| Routing | React Router 6 |
| Voice I/O | Web Speech API (browser-native, free) |
| AI | Anthropic Claude API (claude-sonnet-4) |
| Backend | Vercel Serverless Functions (Node.js) |
| Deployment | Vercel (free tier) |

---

## Accessibility Features
- Minimum 18pt font size, adjustable up to 26pt
- All tap targets minimum 56×56px
- High-contrast color scheme (4.5:1+ ratio)
- Voice-first design — usable without typing
- ARIA labels on all interactive elements
- Graceful degradation if microphone unavailable

---

## GenLink Hackathon Submission

- **Team:** Vaishnavi Srivastava, Surya Nantha, 
- **Event:** GenLink Hacks 2026
- **Deadline:** April 18, 2026 @ 9:30 AM IST
- **Live demo:** https://your-app.vercel.app
- **GitHub:** https://github.com/surya-nantha/techsage-ai

---

Made with ❤️ for seniors everywhere.
