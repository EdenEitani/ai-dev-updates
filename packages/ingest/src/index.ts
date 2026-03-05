import { RSS_FEEDS, REDDIT_SOURCES } from '../config/feeds.js'
import { fetchRss } from './fetch/rss.js'
import { fetchReddit } from './fetch/reddit.js'
import { normalizeItem, deduplicate } from './normalize/index.js'
import { tagItems } from './tagger/index.js'
import { rankItems } from './ranking/index.js'
import { writeIndexes, loadExistingItems } from './indexer/index.js'
import type { RawItem, Item } from './types.js'

async function run(): Promise<void> {
  console.log('AI Dev Updates — Ingestion Pipeline')
  console.log('====================================\n')

  // 1. Fetch
  console.log('Fetching RSS feeds...')
  const rssResults = await Promise.allSettled(RSS_FEEDS.map(fetchRss))
  const rssItems: RawItem[] = rssResults.flatMap((r) =>
    r.status === 'fulfilled' ? r.value : [],
  )

  console.log('\nFetching Reddit posts...')
  const redditResults = await Promise.allSettled(
    REDDIT_SOURCES.map(fetchReddit),
  )
  const redditItems: RawItem[] = redditResults.flatMap((r) =>
    r.status === 'fulfilled' ? r.value : [],
  )

  const allRaw: RawItem[] = [...rssItems, ...redditItems]
  console.log(`\nFetched: ${rssItems.length} RSS + ${redditItems.length} Reddit = ${allRaw.length} raw items`)

  // 2. Normalize
  console.log('\nNormalizing...')
  const normalized: Item[] = allRaw
    .filter((r) => r.title && r.url)
    .map((r) => normalizeItem(r))

  // 3. Deduplicate
  console.log('Deduplicating...')
  const deduped = deduplicate(normalized)
  console.log(`  ${normalized.length} → ${deduped.length} after dedup`)

  // 4. Tag
  console.log('Tagging...')
  // Build source tags map: item.id → sourceTags from raw items
  const sourceTagsMap = new Map<string, string[]>()
  for (const raw of allRaw) {
    if (raw.url && raw.sourceTags) {
      const url = raw.url.split('?')[0].replace(/\/$/, '').toLowerCase()
      const item = deduped.find(
        (i) =>
          i.url === url ||
          i.url.includes(url.replace(/^https?:\/\//, '')),
      )
      if (item) sourceTagsMap.set(item.id, raw.sourceTags)
    }
  }
  const tagged = tagItems(deduped, sourceTagsMap)

  // 5. Rank
  console.log('Ranking...')
  const ranked = rankItems(tagged)

  // 6. Load existing and write indexes
  console.log('Loading existing items...')
  const existing = loadExistingItems()
  console.log(`  Found ${existing.length} existing items`)

  console.log('Writing indexes...')
  writeIndexes(ranked, existing)

  console.log('\nDone!')
}

run().catch((err) => {
  console.error('Ingestion failed:', err)
  process.exit(1)
})
