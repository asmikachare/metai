# MetAI

An AI-powered Met Gala fashion critic. Drop any look, pick a year, and get a score, verdict, and full editorial critique — measured against that year's theme.

Live at: [metai-liart.vercel.app](https://metai-liart.vercel.app/)

---

## What it does

- **Search by name** — type any celebrity, MetAI verifies they attended that year, finds their look, and analyzes it
- **Upload a photo** — drop any image and get it scored against the year's theme
- **Deterministic scoring** — each year has 5 weighted pillars specific to that theme; Claude scores each one 0–10, MetAI computes the weighted average
- **Verdict tiers** — On Theme (≥8), Partial (6–7.9), Off Theme (4–5.9), Miss (<4)
- **Full critique** — brand ID, art references explained, standout element, and what they should have worn instead
- **Archive** — browse all 16 Met Gala years with editorial blurbs and images

---

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + TypeScript + Vite + React Router v7 |
| Backend (local) | Express + Bun |
| Backend (production) | Vercel serverless functions (`/api/`) |
| AI | Anthropic `claude-sonnet-4-6` |
| Image search | Serper API (Google Images) |
| Styling | Inline styles + CSS-in-JS (`<style>` tags) |
| Fonts | Cormorant Garamond, DM Sans |

---

## Running locally

**Prerequisites:** [Bun](https://bun.sh) installed.

```bash
# Install dependencies
bun install

# Create environment file
cp .env.example .env.local
# Add your ANTHROPIC_API_KEY and SERPER_API_KEY to .env.local

# Start both frontend and backend
bun run dev:all
```

The app runs at `http://localhost:5173`. The API runs at `http://localhost:3001`.

---

## Environment variables

```
ANTHROPIC_API_KEY=your_anthropic_key
SERPER_API_KEY=your_serper_key
```

For Vercel, add these in the project dashboard under Settings → Environment Variables.

---

## Deploying to Vercel

The repo is configured for Vercel out of the box via `vercel.json`:

- `bun run build` produces the static frontend in `dist/`
- Files in `/api/` are auto-deployed as serverless functions
- SPA routing is handled via a rewrite rule

Push to `main` and Vercel deploys automatically.

---

## Project structure

```
src/
  app/
    routes/       # Page components (ExplorePage, AnalyzePage, ArchivePage)
    components/   # Nav
    data/         # metYears.ts — year themes and pillar weights
  hooks/
    useIsMobile.ts
  types.ts

api/              # Vercel serverless functions
  _shared.ts      # Shared logic (scoring, prompts, pillar weights)
  analyze.ts
  search-look.ts
  archive-year.ts

server/
  index.ts        # Local Express server (mirrors api/ logic)
```
