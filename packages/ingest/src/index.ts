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

  // 3. Build HN cross-reference set BEFORE dedup
  // Items that appeared in Hacker News filtered feeds get a boost in ranking
  const hnUrls = new Set(
    normalized
      .filter((i) => i.sourceName.toLowerCase().includes('hacker news'))
      .map((i) => i.url),
  )
  console.log(`  HN-referenced URLs: ${hnUrls.size}`)

  // 4. Deduplicate
  console.log('Deduplicating...')
  const deduped = deduplicate(normalized)
  console.log(`  ${normalized.length} → ${deduped.length} after dedup`)

  // 5. Quality filter — drop low-content items before tagging
  const qualityFiltered = deduped.filter(
    (item) => item.title.length >= 20 && item.summary.length >= 40,
  )
  console.log(`  ${deduped.length} → ${qualityFiltered.length} after quality filter`)

  // 6. Build source tags map
  const sourceTagsMap = new Map<string, string[]>()
  for (const raw of allRaw) {
    if (raw.url && raw.sourceTags) {
      const url = raw.url.split('?')[0].replace(/\/$/, '').toLowerCase()
      const item = qualityFiltered.find(
        (i) =>
          i.url === url ||
          i.url.includes(url.replace(/^https?:\/\//, '')),
      )
      if (item) sourceTagsMap.set(item.id, raw.sourceTags)
    }
  }

  // 7. Tag
  console.log('Tagging...')
  const tagged = tagItems(qualityFiltered, sourceTagsMap)

  // 8. Rank new items
  console.log('Ranking...')
  const ranked = rankItems(tagged, hnUrls)

  // 9. Load existing items and re-rank them with fresh timestamps
  console.log('Loading existing items...')
  const existing = loadExistingItems()
  console.log(`  Found ${existing.length} existing items`)
  const rerankedExisting = rankItems(existing, hnUrls)

  // 10. Write indexes
  console.log('Writing indexes...')
  writeIndexes(ranked, rerankedExisting)

  console.log('\nDone!')
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Ingestion failed:', err)
    process.exit(1)
  })
