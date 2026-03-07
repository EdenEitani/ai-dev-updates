import type { Item } from '../types.js'

// Tier 1 — must-know announcements, funding, model releases
const HIGH_VALUE_KEYWORDS = [
  // Model / product launches
  'new model', 'releasing', 'launches', 'launch', 'introducing', 'announce', 'announced',
  'gpt-5', 'gpt-4o', 'claude 4', 'claude 3', 'gemini 2', 'gemini ultra', 'llama 4', 'llama 3',
  'o3', 'o4', 'mistral', 'qwen', 'deepseek',
  // Developer-critical
  'api', 'sdk', 'release', 'changelog', 'breaking change', 'deprecat', 'migration guide',
  'open source', 'open-source', 'pricing', 'free tier', 'rate limit',
  // Investment / business
  'billion', 'million', 'funding', 'raises', 'raised', 'investment', 'series a', 'series b',
  'series c', 'valuation', 'ipo', 'acqui', 'partnership', 'deal',
  // General high-signal
  'agent', 'agentic', 'multimodal', 'reasoning', 'outage', 'incident', 'security', 'breach',
  'update', 'v2', 'v3', 'v4', 'major', 'critical',
]

function recencyMultiplier(publishedAt: string): number {
  const ageMs = Date.now() - new Date(publishedAt).getTime()
  const ageHours = ageMs / (1000 * 60 * 60)

  if (ageHours < 1) return 5.0
  if (ageHours < 6) return 3.5
  if (ageHours < 24) return 2.0
  if (ageHours < 48) return 1.4
  if (ageHours < 168) return 1.0
  if (ageHours < 720) return 0.6
  return 0.3
}

function engagementMultiplier(item: Item): number {
  if (item.source === 'reddit') {
    // Score + comments both count; log scale to avoid huge outliers dominating
    const scorePoints = Math.log10(Math.max(item.score, 1))
    const commentPoints = Math.log10(Math.max(item.comments ?? 0, 1)) * 0.5
    return 1 + (scorePoints + commentPoints) / 2.5
  }
  return 1.0
}

function keywordMultiplier(item: Item): number {
  const text = `${item.title} ${item.summary}`.toLowerCase()
  const hits = HIGH_VALUE_KEYWORDS.filter((kw) => text.includes(kw)).length
  // More aggressive boost: each hit adds 0.2, cap at 1.2x bonus
  return 1 + Math.min(hits * 0.2, 1.2)
}

const VIBE_TOOLS = new Set([
  'cursor', 'lovable', 'bolt', 'replit', 'windsurf', 'base44', 'v0',
  'devin', 'copilot', 'aider', 'continue', 'claude-code',
  'crewai', 'autogen', 'litellm', 'dspy', 'instructor',
])

function sourceMultiplier(item: Item): number {
  if (item.source !== 'rss') return 1.0
  const name = item.sourceName.toLowerCase()
  // GitHub release feeds: highest signal (exact version releases)
  if (name.includes('release')) return 1.6
  // Official company blogs
  if (
    name.includes('openai') || name.includes('anthropic') ||
    name.includes('deepmind') || name.includes('google ai') ||
    name.includes('huggingface') || name.includes('arxiv')
  ) return 1.4
  // Vibe-coding tools: boost any RSS item tagged with a vibe tool
  if (item.tags.tools.some((t) => VIBE_TOOLS.has(t))) return 1.4
  // Quality news outlets
  return 1.2
}

export function rankItem(item: Item): number {
  return (
    recencyMultiplier(item.publishedAt) *
    engagementMultiplier(item) *
    keywordMultiplier(item) *
    sourceMultiplier(item)
  )
}

export function rankItems(items: Item[]): Item[] {
  return items
    .map((item) => ({ ...item, score: rankItem(item) }))
    .sort((a, b) => b.score - a.score)
}
