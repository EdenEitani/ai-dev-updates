import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import type { Item, TagIndex } from '../types.js'

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

export function writeIndexes(items: Item[], existingItems: Item[]): void {
  // Merge new items with existing, new items win on conflict
  const existingById = new Map(existingItems.map((i) => [i.id, i]))
  for (const item of items) {
    existingById.set(item.id, item)
  }

  const allItems = Array.from(existingById.values())
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, 500)

  const tagIndex = buildTagIndex(allItems)
  const recentIds = allItems.slice(0, 100).map((i) => i.id)

  writeJson(join(DATA_DIR, 'items.json'), allItems)

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
  console.log(`  items.json       → ${allItems.length} items`)
  console.log(`  index/recent.json → ${recentIds.length} ids`)
  console.log(`  index/tags.json   → ${totalTags} unique tags`)
}
