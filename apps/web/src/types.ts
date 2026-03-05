export interface Tags {
  tools: string[]
  industry: string[]
  topic: string[]
  type: string[]
}

export interface Item {
  id: string
  source: 'rss' | 'reddit'
  sourceName: string
  title: string
  url: string
  summary: string
  publishedAt: string
  author: string
  score: number
  comments: number
  tags: Tags
}

export interface TagIndex {
  tools: Record<string, string[]>
  industry: Record<string, string[]>
  topic: Record<string, string[]>
  type: Record<string, string[]>
}

export type TagCategory = keyof Tags
export type SortMode = 'newest' | 'top'

export interface ActiveFilters {
  tools: Set<string>
  industry: Set<string>
  topic: Set<string>
  type: Set<string>
}
