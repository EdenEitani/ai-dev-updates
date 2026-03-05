import type { Item } from '../types.js'

const HIGH_VALUE_KEYWORDS = [
  'api', 'sdk', 'release', 'deprecat', 'pricing', 'changelog', 'launch',
  'introducing', 'announce', 'new model', 'update', 'v2', 'v3', 'v4',
  'breaking change', 'outage', 'incident', 'free', 'open source', 'open-source',
]

function recencyMultiplier(publishedAt: string): number {
  const ageMs = Date.now() - new Date(publishedAt).getTime()
  const ageHours = ageMs / (1000 * 60 * 60)

  if (ageHours < 1) return 4.0
  if (ageHours < 6) return 3.0
  if (ageHours < 24) return 2.0
  if (ageHours < 48) return 1.5
  if (ageHours < 168) return 1.0
  if (ageHours < 720) return 0.7
  return 0.4
}

function engagementMultiplier(item: Item): number {
  if (item.source === 'reddit') {
    // Log scale: score of 100 → 2.0, 1000 → 3.0
    return 1 + Math.log10(Math.max(item.score, 1)) / 3
  }
  return 1.0
}

function keywordMultiplier(item: Item): number {
  const text = `${item.title} ${item.summary}`.toLowerCase()
  const hits = HIGH_VALUE_KEYWORDS.filter((kw) => text.includes(kw)).length
  return 1 + Math.min(hits * 0.15, 0.75)
}

function sourceMultiplier(item: Item): number {
  // Official RSS sources (blogs, changelogs, GitHub releases) rank above social posts
  if (item.source === 'rss') return 1.3
  return 1.0
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
