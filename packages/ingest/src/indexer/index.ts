import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Item, TagIndex } from '../types.js'
import { MAX_ITEMS } from '../../config/feeds.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_DIR = resolve(__dirname, '../../../../data')

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
}

function writeJson(filePath: string, data: unknown): void {
  ensureDir(dirname(filePath))
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

// Ensure feed diversity: no single tool tag dominates the stored set.
// Untagged items (no tools) always pass through.
function diversify(items: Item[], maxPerTool = 4): Item[] {
  const toolCounts = new Map<string, number>()
  return items.filter((item) => {
    const tools = item.tags.tools
    if (tools.length === 0) return true

    const maxCount = Math.max(...tools.map((t) => toolCounts.get(t) ?? 0))
    if (maxCount >= maxPerTool) return false

    for (const t of tools) toolCounts.set(t, (toolCounts.get(t) ?? 0) + 1)
    return true
  })
}

export function buildTagIndex(items: Item[]): TagIndex {
  const index: TagIndex = { tools: {}, industry: {}, topic: {}, type: {} }

  for (const item of items) {
    const categories = Object.keys(item.tags) as (keyof TagIndex)[]
    for (const category of categories) {
      for (const tag of item.tags[category]) {
        if (!index[category][tag]) index[category][tag] = []
        index[category][tag].push(item.id)
      }
    }
  }

  return index
}

export function loadExistingItems(): Item[] {
  const itemsPath = join(DATA_DIR, 'items.json')
  if (!existsSync(itemsPath)) return []
  try {
    return JSON.parse(readFileSync(itemsPath, 'utf-8')) as Item[]
  } catch {
    return []
  }
}

export function writeIndexes(newItems: Item[], existingItems: Item[]): void {
  // Merge: new items win on conflict (fresher scores)
  const byId = new Map(existingItems.map((i) => [i.id, i]))
  for (const item of newItems) {
    byId.set(item.id, item)
  }

  // Sort by score (quality), not date — keeps the most valuable items
  const allSorted = Array.from(byId.values())
    .sort((a, b) => b.score - a.score)

  // Apply diversity cap then take top MAX_ITEMS
  const stored = diversify(allSorted).slice(0, MAX_ITEMS)

  const tagIndex = buildTagIndex(stored)
  // recent.json = newest 50 by publishedAt (for the Daily Digest)
  const recentIds = [...stored]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 50)
    .map((i) => i.id)

  writeJson(join(DATA_DIR, 'items.json'), stored)

  const indexDir = join(DATA_DIR, 'index')
  writeJson(join(indexDir, 'recent.json'), recentIds)
  writeJson(join(indexDir, 'tags.json'), tagIndex)

  const categories = ['tools', 'industry', 'topic', 'type'] as const
  for (const cat of categories) {
    const catDir = join(indexDir, 'by_tag', cat)
    ensureDir(catDir)
    for (const [tag, ids] of Object.entries(tagIndex[cat])) {
      writeJson(join(catDir, `${tag}.json`), ids)
    }
  }

  const totalTags = Object.values(tagIndex).reduce(
    (s, c) => s + Object.keys(c).length,
    0,
  )
  console.log(`\nWrote to ${DATA_DIR}:`)
  console.log(`  items.json        → ${stored.length} items (top by quality score)`)
  console.log(`  index/recent.json → ${recentIds.length} ids (newest 50)`)
  console.log(`  index/tags.json   → ${totalTags} unique tags`)
}
