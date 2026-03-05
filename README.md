# AI Dev Updates

A free-hosted, self-updating web app that aggregates AI developer news from RSS feeds and Reddit — keeping you on top of releases, research, and tooling changes.

**Stack:** React + Vite · TypeScript · GitHub Actions · Cloudflare Pages

---

## How it works

1. **GitHub Actions** runs `pnpm ingest` every hour
2. The ingest pipeline fetches RSS feeds + Reddit posts, normalizes, deduplicates, tags, and ranks them
3. Results are committed to `data/` as static JSON
4. **Cloudflare Pages** auto-deploys the static site when `data/` changes
5. The React frontend loads JSON directly — no backend needed

---

## Local Development

### Prerequisites

- Node.js 18+
- pnpm 9+

```bash
# Install pnpm if needed
npm install -g pnpm
```

### 1. Install dependencies

```bash
pnpm install
```

### 2. Run ingestion locally

```bash
pnpm ingest
```

This fetches from all configured RSS feeds and Reddit subreddits, then writes to `data/`.

### 3. Inspect the data

```bash
pnpm tsx scripts/build-data.ts
```

### 4. Run the frontend dev server

```bash
pnpm dev
# or specifically:
pnpm --filter web dev
```

The dev server automatically serves `data/` at `/data/*`.

Open [http://localhost:5173](http://localhost:5173)

---

## Building for Production

```bash
pnpm build
```

This runs ingestion, then builds the Vite app. Output is in `apps/web/dist/`.

To build just the frontend (if data is already populated):

```bash
pnpm build:web
```

---

## Deploying to Cloudflare Pages

### Automatic setup (everything is pre-configured)

The `wrangler.toml` at the repo root is already configured:

```toml
name = "ai-dev-updates"
compatibility_date = "2024-01-01"
pages_build_output_dir = "apps/web/dist"
```

### Deploy manually

```bash
pnpm deploy:cf
# equivalent to: wrangler pages deploy apps/web/dist --project-name ai-dev-updates
```

### Connect GitHub repo to Cloudflare Pages (one-time manual step)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create**
2. Select **Pages** → **Connect to Git**
3. Authorize GitHub and select your repository
4. Configure build settings:
   - **Framework preset:** None
   - **Build command:** `pnpm build:web`
   - **Build output directory:** `apps/web/dist`
   - **Root directory:** `/` (leave empty)
5. Click **Save and Deploy**

After this, every push to `main` (including the hourly data commits from GitHub Actions) will trigger a new Cloudflare Pages deployment.

---

## Configuring Data Sources

### RSS Feeds

Edit `packages/ingest/config/feeds.ts`:

```ts
export const RSS_FEEDS: FeedConfig[] = [
  { name: 'My Blog', url: 'https://myblog.com/feed.xml', type: 'rss', tags: ['openai'] },
  // ...
]
```

### Reddit Subreddits

```ts
export const REDDIT_SOURCES: RedditConfig[] = [
  { subreddit: 'MachineLearning' },
  { subreddit: 'LocalLLaMA', tags: ['llama'] },
  // ...
]
```

### Tag Rules

Edit `packages/ingest/config/tags.ts` to add or modify keyword-based tagging rules:

```ts
{ tag: 'mytool', category: 'tools', keywords: ['mytool', 'my tool'], domains: ['mytool.com'] },
```

---

## Project Structure

```
ai-dev-updates/
├── apps/
│   └── web/                    # React + Vite frontend
│       ├── src/
│       │   ├── components/     # Feed, Card, Sidebar, Header
│       │   ├── hooks/          # useItems (data loading + filtering)
│       │   └── types.ts        # Shared TypeScript types
│       └── vite.config.ts      # Includes data-serving plugin
├── packages/
│   └── ingest/                 # Node.js ingestion pipeline
│       ├── config/             # feeds.ts, tags.ts
│       └── src/
│           ├── fetch/          # rss.ts, reddit.ts
│           ├── normalize/      # URL normalization, dedup
│           ├── tagger/         # Keyword-based tagging
│           ├── ranking/        # Recency + engagement score
│           └── indexer/        # Writes data/ JSON files
├── data/
│   ├── items.json              # All items (up to 500)
│   └── index/
│       ├── recent.json         # Top 100 IDs by date
│       ├── tags.json           # Tag → [id] index
│       └── by_tag/             # Per-tag ID files
├── scripts/
│   └── build-data.ts           # Data inspection utility
├── .github/workflows/
│   └── ingest.yml              # Hourly GitHub Action
└── wrangler.toml               # Cloudflare Pages config
```

---

## Item Data Model

```ts
interface Item {
  id: string           // SHA-256 hash of canonical URL (12 chars)
  source: 'rss' | 'reddit'
  sourceName: string   // "OpenAI Blog" | "r/MachineLearning"
  title: string
  url: string          // Canonical, tracking params stripped
  summary: string
  publishedAt: string  // ISO 8601
  author: string
  score: number        // Ranking score (recency × engagement × keywords)
  comments: number     // Reddit comments, 0 for RSS
  tags: {
    tools: string[]    // openai, anthropic, langchain, ...
    industry: string[] // fintech, healthcare, devtools, ...
    topic: string[]    // agents, rag, fine-tuning, ...
    type: string[]     // release, tutorial, benchmark, ...
  }
}
```

---

## GitHub Actions — Required Permissions

The workflow writes back to the repo. Make sure **Actions → General → Workflow permissions** is set to **Read and write permissions** in your repo settings.
