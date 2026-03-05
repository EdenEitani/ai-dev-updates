import Parser from 'rss-parser'
import type { FeedConfig } from '../../config/feeds.js'
import type { RawItem } from '../types.js'

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'AI-Dev-Updates-Bot/1.0 (github.com/ai-dev-updates)',
    Accept: 'application/rss+xml, application/xml, text/xml, */*',
  },
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
})

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

function getField(obj: unknown, key: string): string {
  if (obj && typeof obj === 'object' && key in (obj as object)) {
    const val = (obj as Record<string, unknown>)[key]
    return typeof val === 'string' ? val : ''
  }
  return ''
}

export async function fetchRss(feed: FeedConfig): Promise<RawItem[]> {
  try {
    console.log(`  [rss] fetching ${feed.name}...`)
    const result = await parser.parseURL(feed.url)

    return result.items
      .filter((item) => item.title && (item.link || item.guid))
      .map((item) => {
        const rawSummary =
          getField(item, 'contentSnippet') ||
          getField(item, 'content') ||
          getField(item, 'summary') ||
          item.contentSnippet ||
          ''

        return {
          title: stripHtml(item.title ?? '').slice(0, 300),
          url: (item.link ?? item.guid ?? '').split('?')[0].replace(/\/$/, ''),
          summary: stripHtml(rawSummary).slice(0, 600),
          publishedAt: item.isoDate ?? item.pubDate ?? new Date().toISOString(),
          author:
            getField(item, 'creator') ||
            getField(item, 'author') ||
            feed.name,
          source: 'rss' as const,
          sourceName: feed.name,
          score: 0,
          comments: 0,
          sourceTags: feed.tags ?? [],
          raw: item,
        }
      })
  } catch (err) {
    console.error(
      `  [rss] failed ${feed.name}:`,
      err instanceof Error ? err.message : String(err),
    )
    return []
  }
}
