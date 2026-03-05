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
  raw?: unknown
}

export interface RawItem {
  title: string
  url: string
  summary: string
  publishedAt: string
  author: string
  source: 'rss' | 'reddit'
  sourceName: string
  score?: number
  comments?: number
  sourceTags?: string[]
  raw?: unknown
}

export interface TagIndex {
  tools: Record<string, string[]>
  industry: Record<string, string[]>
  topic: Record<string, string[]>
  type: Record<string, string[]>
}

export interface DataOutput {
  items: Item[]
  index: {
    recent: string[]
    tags: TagIndex
  }
}
