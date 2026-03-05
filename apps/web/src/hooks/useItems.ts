import { useState, useEffect, useMemo } from 'react'
import type { Item, TagIndex, ActiveFilters, SortMode } from '../types'

interface UseItemsResult {
  items: Item[]
  filtered: Item[]
  tagIndex: TagIndex
  loading: boolean
  error: string | null
  activeFilters: ActiveFilters
  searchQuery: string
  sortMode: SortMode
  toggleTag: (category: keyof ActiveFilters, tag: string) => void
  clearFilters: () => void
  setSearchQuery: (q: string) => void
  setSortMode: (m: SortMode) => void
  tagCounts: Record<string, Record<string, number>>
}

const EMPTY_FILTERS: ActiveFilters = {
  tools: new Set(),
  industry: new Set(),
  topic: new Set(),
  type: new Set(),
}

const EMPTY_TAG_INDEX: TagIndex = {
  tools: {},
  industry: {},
  topic: {},
  type: {},
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`)
  return res.json() as Promise<T>
}

export function useItems(): UseItemsResult {
  const [items, setItems] = useState<Item[]>([])
  const [tagIndex, setTagIndex] = useState<TagIndex>(EMPTY_TAG_INDEX)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(EMPTY_FILTERS)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('newest')

  useEffect(() => {
    async function load() {
      try {
        const [fetchedItems, fetchedIndex] = await Promise.all([
          fetchJson<Item[]>('/data/items.json'),
          fetchJson<TagIndex>('/data/index/tags.json'),
        ])
        setItems(fetchedItems)
        setTagIndex(fetchedIndex)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  const toggleTag = (category: keyof ActiveFilters, tag: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev, [category]: new Set(prev[category]) }
      if (next[category].has(tag)) {
        next[category].delete(tag)
      } else {
        next[category].add(tag)
      }
      return next
    })
  }

  const clearFilters = () => {
    setActiveFilters(EMPTY_FILTERS)
    setSearchQuery('')
  }

  // Compute matching item IDs from active tag filters
  const matchingIdSets = useMemo(() => {
    const categories = Object.keys(activeFilters) as (keyof ActiveFilters)[]
    return categories
      .filter((cat) => activeFilters[cat].size > 0)
      .map((cat) => {
        const ids = new Set<string>()
        for (const tag of activeFilters[cat]) {
          for (const id of tagIndex[cat][tag] ?? []) {
            ids.add(id)
          }
        }
        return ids
      })
  }, [activeFilters, tagIndex])

  const filtered = useMemo(() => {
    let result = items

    // AND across categories, OR within
    for (const idSet of matchingIdSets) {
      result = result.filter((item) => idSet.has(item.id))
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.summary.toLowerCase().includes(q) ||
          item.sourceName.toLowerCase().includes(q),
      )
    }

    // Sort
    if (sortMode === 'newest') {
      result = [...result].sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
    } else {
      result = [...result].sort((a, b) => b.score - a.score)
    }

    return result
  }, [items, matchingIdSets, searchQuery, sortMode])

  // Tag counts within current filtered set
  const tagCounts = useMemo(() => {
    const filteredIds = new Set(filtered.map((i) => i.id))
    const counts: Record<string, Record<string, number>> = {}
    const categories = ['tools', 'industry', 'topic', 'type'] as const
    for (const cat of categories) {
      counts[cat] = {}
      for (const [tag, ids] of Object.entries(tagIndex[cat])) {
        const count = ids.filter((id) => filteredIds.has(id)).length
        if (count > 0) counts[cat][tag] = count
      }
    }
    return counts
  }, [filtered, tagIndex])

  return {
    items,
    filtered,
    tagIndex,
    loading,
    error,
    activeFilters,
    searchQuery,
    sortMode,
    toggleTag,
    clearFilters,
    setSearchQuery,
    setSortMode,
    tagCounts,
  }
}
