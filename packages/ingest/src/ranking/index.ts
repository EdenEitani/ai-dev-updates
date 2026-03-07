import type { Item } from '../types.js'

// ── Keyword signals ─────────────────────────────────────────────────────────

const HIGH_VALUE_KEYWORDS = [
  // Model / product launches
  'new model', 'releasing', 'launches', 'launch', 'introducing', 'announced',
  'gpt-5', 'gpt-4o', 'claude 4', 'claude 3', 'gemini 2', 'gemini ultra',
  'llama 4', 'llama 3', 'o3', 'o4', 'mistral', 'qwen', 'deepseek',
  // Developer-critical
  'api', 'sdk', 'release', 'changelog', 'breaking change', 'deprecat',
  'migration guide', 'open source', 'open-source', 'pricing', 'free tier', 'rate limit',
  // Investment / business
  'billion', 'million', 'funding', 'raises', 'raised', 'investment',
  'series a', 'series b', 'series c', 'valuation', 'ipo', 'acqui', 'partnership',
  // General high-signal
  'agent', 'agentic', 'multimodal', 'reasoning', 'outage', 'incident',
  'security', 'breach', 'update', 'v2', 'v3', 'v4', 'major', 'critical',
]

// Educational / tutorial content — what developers actually learn from
const EDUCATIONAL_KEYWORDS = [
  'how to', 'tutorial', 'guide', 'walkthrough', 'step by step',
  'getting started', 'quickstart', 'cookbook', 'introduction to',
  'deep dive', 'explained', 'understanding', 'learn ', 'build with',
  'hands-on', 'practical', 'demo', 'example', 'implement',
]

const CODE_SIGNALS = [
  'python', 'typescript', 'javascript', '```', 'snippet',
  'import ', 'def ', 'function ', 'github.com',
]

// ── Source reputation tiers ──────────────────────────────────────────────────
// Map sourceName patterns (lowercase) → multiplier

const SOURCE_TIERS: Array<{ patterns: string[]; mult: number }> = [
  // S-tier: highest trust — exact version releases, top researchers
  { patterns: ['releases', 'release'], mult: 2.0 },
  { patterns: ['latent space', 'simon willison', 'interconnects'], mult: 1.9 },

  // A-tier: official company blogs from major AI labs
  {
    patterns: ['openai blog', 'anthropic news', 'google deepmind', 'google ai blog', 'meta ai', 'mistral'],
    mult: 1.8,
  },

  // A-tier: high-quality technical sources and curated newsletters
  {
    patterns: [
      'huggingface', 'arxiv', 'langchain blog', 'vercel blog',
      'sebastian raschka', 'the gradient', 'import ai', "ben's bites",
      'lightning ai', 'together ai',
      // Filtered HN feeds are high quality (≥50-100 pts threshold)
      'hacker news — ai', 'hacker news — vibe', 'hacker news — releases',
    ],
    mult: 1.5,
  },

  // B-tier: reputable tech media and dev communities
  {
    patterns: [
      'venturebeat', 'mit technology', 'the verge', 'techcrunch',
      'wired', 'ars technica', 'aws machine learning',
      'dev.to', 'github blog', 'replit blog', 'stackblitz',
      'hacker news frontpage',
    ],
    mult: 1.2,
  },

  // C-tier: business news and Reddit RSS (no engagement score)
  {
    patterns: ['cnbc', 'fortune', 'reuters', 'r/'],
    mult: 0.85,
  },
]

function getSourceTier(sourceName: string): number {
  const lower = sourceName.toLowerCase()
  for (const { patterns, mult } of SOURCE_TIERS) {
    if (patterns.some((p) => lower.includes(p))) return mult
  }
  return 1.0 // unknown source
}

// ── Multiplier functions ─────────────────────────────────────────────────────

function recencyMultiplier(item: Item): number {
  const ageHours = (Date.now() - new Date(item.publishedAt).getTime()) / 3_600_000
  const isRelease = item.tags.type.includes('release')

  if (isRelease) {
    // Releases stay relevant much longer — a 3-day-old SDK release still matters
    if (ageHours < 2) return 5.0
    if (ageHours < 12) return 3.5
    if (ageHours < 72) return 2.5
    if (ageHours < 168) return 1.8
    if (ageHours < 720) return 1.0
    return 0.5
  } else {
    // News articles decay fast
    if (ageHours < 1) return 5.0
    if (ageHours < 6) return 3.5
    if (ageHours < 24) return 2.0
    if (ageHours < 48) return 1.4
    if (ageHours < 168) return 1.0
    if (ageHours < 720) return 0.6
    return 0.3
  }
}

function engagementMultiplier(item: Item): number {
  if (item.source === 'reddit' && item.score > 0) {
    const scorePoints = Math.log10(Math.max(item.score, 1))
    const commentPoints = Math.log10(Math.max(item.comments ?? 0, 1)) * 0.5
    return 1 + (scorePoints + commentPoints) / 2.5
  }
  return 1.0
}

function keywordMultiplier(item: Item): number {
  const text = `${item.title} ${item.summary}`.toLowerCase()
  const hits = HIGH_VALUE_KEYWORDS.filter((kw) => text.includes(kw)).length
  return 1 + Math.min(hits * 0.2, 1.2)
}

function educationalMultiplier(item: Item): number {
  const text = `${item.title} ${item.summary}`.toLowerCase()
  const tutorialHits = EDUCATIONAL_KEYWORDS.filter((kw) => text.includes(kw)).length
  const codeHits = CODE_SIGNALS.filter((kw) => text.includes(kw)).length
  const bonus = Math.min(tutorialHits * 0.15 + codeHits * 0.1, 0.5)
  return 1 + bonus
}

function sourceMultiplier(item: Item): number {
  return getSourceTier(item.sourceName)
}

// ── Author reputation ────────────────────────────────────────────────────────

const AUTHOR_REPUTATION: Array<{ names: string[]; mult: number }> = [
  { names: ['andrej karpathy'], mult: 1.6 },
  { names: ['simon willison'], mult: 1.5 },
  { names: ['nathan lambert'], mult: 1.4 },
  { names: ['sebastian raschka'], mult: 1.4 },
  { names: ['francois chollet', 'chollet'], mult: 1.3 },
  { names: ['swyx', 'shawn wang'], mult: 1.3 },
  { names: ['dario amodei', 'amanda askell'], mult: 1.3 },
  { names: ['sam altman'], mult: 1.2 },
  { names: ['yann lecun'], mult: 1.2 },
  { names: ['alex albert'], mult: 1.2 },
  { names: ['greg brockman'], mult: 1.2 },
]

function authorMultiplier(item: Item): number {
  const author = item.author.toLowerCase()
  for (const { names, mult } of AUTHOR_REPUTATION) {
    if (names.some((n) => author.includes(n))) return mult
  }
  return 1.0
}

// ── Public API ───────────────────────────────────────────────────────────────

export function rankItem(item: Item, hnUrls?: Set<string>): number {
  const hnBoost = hnUrls?.has(item.url) ? 1.5 : 1.0
  return (
    recencyMultiplier(item) *
    engagementMultiplier(item) *
    keywordMultiplier(item) *
    educationalMultiplier(item) *
    sourceMultiplier(item) *
    authorMultiplier(item) *
    hnBoost
  )
}

export function rankItems(items: Item[], hnUrls?: Set<string>): Item[] {
  return items
    .map((item) => ({ ...item, score: rankItem(item, hnUrls) }))
    .sort((a, b) => b.score - a.score)
}
