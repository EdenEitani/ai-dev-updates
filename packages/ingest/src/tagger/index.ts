import { TAG_RULES } from '../../config/tags.js'
import type { Item, Tags } from '../types.js'

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function matchesRule(
  item: Item,
  keywords: string[],
  domains: string[] | undefined,
  subreddits: string[] | undefined,
): boolean {
  const text = `${item.title} ${item.summary}`.toLowerCase()
  const domain = getDomain(item.url)
  const subreddit = item.sourceName.startsWith('r/')
    ? item.sourceName.slice(2)
    : null

  if (subreddits && subreddit && subreddits.includes(subreddit)) return true
  if (domains && domains.some((d) => domain.endsWith(d))) return true
  if (keywords.some((kw) => text.includes(kw.toLowerCase()))) return true
  return false
}

export function tagItem(item: Item, sourceTags: string[] = []): Tags {
  const tags: Tags = { tools: [], industry: [], topic: [], type: [] }
  const added = new Set<string>()

  // Apply source tags (from feed config)
  for (const st of sourceTags) {
    const rule = TAG_RULES.find((r) => r.tag === st && !added.has(r.tag))
    if (rule) {
      tags[rule.category].push(rule.tag)
      added.add(rule.tag)
    }
  }

  // Apply rule-based tags
  for (const rule of TAG_RULES) {
    if (added.has(rule.tag)) continue
    if (matchesRule(item, rule.keywords, rule.domains, rule.subreddits)) {
      tags[rule.category].push(rule.tag)
      added.add(rule.tag)
    }
  }

  return tags
}

export function tagItems(
  items: Item[],
  sourceTagsMap: Map<string, string[]>,
): Item[] {
  return items.map((item) => ({
    ...item,
    tags: tagItem(item, sourceTagsMap.get(item.id) ?? []),
  }))
}
