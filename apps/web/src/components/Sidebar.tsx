import { useState } from 'react'
import type { TagIndex, ActiveFilters } from '../types'

interface SidebarProps {
  tagIndex: TagIndex
  activeFilters: ActiveFilters
  tagCounts: Record<string, Record<string, number>>
  onTagToggle: (category: keyof ActiveFilters, tag: string) => void
  onClearFilters: () => void
}

const CATEGORY_LABELS: Record<string, string> = {
  tools: 'Tools',
  industry: 'Industry',
  topic: 'Topic',
  type: 'Type',
}

const CATEGORY_ORDER = ['tools', 'topic', 'type', 'industry'] as const

function CategorySection({
  category,
  tags,
  activeTags,
  counts,
  onToggle,
}: {
  category: string
  tags: string[]
  activeTags: Set<string>
  counts: Record<string, number>
  onToggle: (tag: string) => void
}) {
  const [expanded, setExpanded] = useState(true)

  if (tags.length === 0) return null

  return (
    <div className="sidebar-section">
      <button
        className="sidebar-section-header"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        <span>{CATEGORY_LABELS[category] ?? category}</span>
        <span className="sidebar-chevron">{expanded ? '▾' : '▸'}</span>
      </button>
      {expanded && (
        <ul className="sidebar-tag-list">
          {tags.map((tag) => {
            const count = counts[tag] ?? 0
            const active = activeTags.has(tag)
            return (
              <li key={tag}>
                <button
                  className={`sidebar-tag ${active ? 'active' : ''}`}
                  onClick={() => onToggle(tag)}
                  title={`${count} items`}
                >
                  <span className="sidebar-tag-name">{tag}</span>
                  <span className="sidebar-tag-count">{count}</span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function Sidebar({
  tagIndex,
  activeFilters,
  tagCounts,
  onTagToggle,
  onClearFilters,
}: SidebarProps) {
  const totalActive = Object.values(activeFilters).reduce(
    (s, set) => s + set.size,
    0,
  )

  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-title">Filters</span>
        {totalActive > 0 && (
          <button className="clear-btn" onClick={onClearFilters}>
            Clear ({totalActive})
          </button>
        )}
      </div>

      {CATEGORY_ORDER.map((cat) => {
        const allTags = Object.keys(tagIndex[cat]).sort((a, b) => {
          // Sort by count descending
          const ca = tagCounts[cat]?.[a] ?? 0
          const cb = tagCounts[cat]?.[b] ?? 0
          return cb - ca
        })
        return (
          <CategorySection
            key={cat}
            category={cat}
            tags={allTags}
            activeTags={activeFilters[cat]}
            counts={tagCounts[cat] ?? {}}
            onToggle={(tag) => onTagToggle(cat, tag)}
          />
        )
      })}
    </nav>
  )
}
