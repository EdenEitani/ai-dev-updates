/**
 * build-data.ts
 *
 * Utility script to inspect or validate the current data/ directory.
 * Run with: pnpm tsx scripts/build-data.ts
 */
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const DATA_DIR = resolve(__dirname, '../data')

function readJson<T>(path: string, fallback: T): T {
  if (!existsSync(path)) return fallback
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as T
  } catch {
    return fallback
  }
}

interface Item {
  id: string
  sourceName: string
  title: string
  publishedAt: string
  tags: { tools: string[]; industry: string[]; topic: string[]; type: string[] }
}

interface TagIndex {
  tools: Record<string, string[]>
  industry: Record<string, string[]>
  topic: Record<string, string[]>
  type: Record<string, string[]>
}

const items = readJson<Item[]>(`${DATA_DIR}/items.json`, [])
const tags = readJson<TagIndex>(`${DATA_DIR}/index/tags.json`, {
  tools: {},
  industry: {},
  topic: {},
  type: {},
})
const recent = readJson<string[]>(`${DATA_DIR}/index/recent.json`, [])

console.log('\nAI Dev Updates — Data Summary')
console.log('==============================')
console.log(`Total items:    ${items.length}`)
console.log(`Recent index:   ${recent.length} IDs`)
console.log()

const categories = ['tools', 'industry', 'topic', 'type'] as const
for (const cat of categories) {
  const tagList = Object.entries(tags[cat])
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 10)
    .map(([tag, ids]) => `${tag}(${ids.length})`)
    .join(', ')
  console.log(`${cat.padEnd(10)} → ${tagList || '(none)'}`)
}

if (items.length > 0) {
  console.log('\nMost recent items:')
  items.slice(0, 5).forEach((item, i) => {
    const ago =
      Math.floor(
        (Date.now() - new Date(item.publishedAt).getTime()) / 3600000,
      ) + 'h ago'
    console.log(`  ${i + 1}. [${item.sourceName}] ${item.title.slice(0, 70)}... (${ago})`)
  })
}

console.log()
