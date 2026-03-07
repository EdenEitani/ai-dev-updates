import { createHash } from 'crypto'
import type { RawItem, Item } from '../types.js'

export function normalizeUrl(url: string): string {
  try {
    const u = new URL(url)
    // Strip common tracking params
    const trackingParams = [
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
      'ref', 'fbclid', 'gclid', 'mc_cid', 'mc_eid', '_hsenc', '_hsmi',
    ]
    trackingParams.forEach((p) => u.searchParams.delete(p))
    // Normalize trailing slash
    const path = u.pathname.endsWith('/') && u.pathname.length > 1
      ? u.pathname.slice(0, -1)
      : u.pathname
    return `${u.protocol}//${u.host}${path}${u.search}`.toLowerCase()
  } catch {
    return url.toLowerCase().replace(/\/$/, '')
  }
}

function makeId(url: string): string {
  return createHash('sha256').update(url).digest('hex').slice(0, 12)
}

function normalizeDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return new Date().toISOString()
    return d.toISOString()
  } catch {
    return new Date().toISOString()
  }
}

export function normalizeItem(raw: RawItem): Item {
  const url = normalizeUrl(raw.url || 'https://unknown')
  return {
    id: makeId(url),
    source: raw.source,
    sourceName: raw.sourceName,
    title: raw.title.trim(),
    url,
    summary: raw.summary.trim(),
    publishedAt: normalizeDate(raw.publishedAt),
    author: raw.author.trim(),
    score: raw.score ?? 0,
    comments: raw.comments ?? 0,
    tags: { tools: [], industry: [], topic: [], type: [] },
    raw: raw.raw,
  }
}

// Levenshtein distance for fuzzy dedup
function levenshtein(a: string, b: string): number {
  if (Math.abs(a.length - b.length) > 30) return 999
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  )
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[m][n]
}

function titleSimilarity(a: string, b: string): number {
  const la = a.toLowerCase().replace(/[^a-z0-9 ]/g, '')
  const lb = b.toLowerCase().replace(/[^a-z0-9 ]/g, '')
  const dist = levenshtein(la, lb)
  const maxLen = Math.max(la.length, lb.length)
  return maxLen === 0 ? 1 : 1 - dist / maxLen
}

export function deduplicate(items: Item[], threshold = 0.85): Item[] {
  const seenUrls = new Set<string>()
  const seenTitles: string[] = []
  const result: Item[] = []

  for (const item of items) {
    // URL dedup
    if (seenUrls.has(item.url)) continue
    seenUrls.add(item.url)

    // Fuzzy title dedup (only check last 200 titles for performance)
    const titleWindow = seenTitles.slice(-50)
    const isDuplicate = titleWindow.some(
      (t) => titleSimilarity(t, item.title) >= threshold,
    )
    if (isDuplicate) continue

    seenTitles.push(item.title)
    result.push(item)
  }

  return result
}
