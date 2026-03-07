import { useState, useEffect } from 'react'
import type { Item, SortMode } from '../types'
import { Card } from './Card'

const PAGE_SIZE = 30

interface FeedProps {
  items: Item[]
  loading: boolean
  error: string | null
  searchQuery: string
  sortMode: SortMode
  totalCount: number
  hideRead: boolean
  readIds: Set<string>
  onSearchChange: (q: string) => void
  onSortChange: (m: SortMode) => void
  onToggleHideRead: () => void
  onMarkRead: (id: string) => void
  onMarkUnread: (id: string) => void
  onClearRead: () => void
}

export function Feed({
  items,
  loading,
  error,
  searchQuery,
  sortMode,
  totalCount,
  hideRead,
  readIds,
  onSearchChange,
  onSortChange,
  onToggleHideRead,
  onMarkRead,
  onMarkUnread,
  onClearRead,
}: FeedProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  // Reset pagination when items list changes (filter/sort change)
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [items])

  const unfiltered = hideRead ? items.filter((i) => !readIds.has(i.id)) : items
  const visible = unfiltered.slice(0, visibleCount)
  const remaining = unfiltered.length - visibleCount

  return (
    <div className="feed">
      <div className="feed-toolbar">
        <div className="search-wrapper">
          <span className="search-icon">&#128269;</span>
          <input
            className="search-input"
            type="search"
            placeholder="Search titles, summaries, sources..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search"
          />
          {searchQuery && (
            <button
              className="search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              &#215;
            </button>
          )}
        </div>

        <div className="toolbar-right">
          <div className="sort-tabs">
            <button
              className={`sort-tab ${sortMode === 'newest' ? 'active' : ''}`}
              onClick={() => onSortChange('newest')}
            >
              Newest
            </button>
            <button
              className={`sort-tab ${sortMode === 'top' ? 'active' : ''}`}
              onClick={() => onSortChange('top')}
            >
              Top
            </button>
          </div>

          <button
            className={`hide-read-btn${hideRead ? ' hide-read-btn--active' : ''}`}
            onClick={onToggleHideRead}
            title={hideRead ? 'Show all items' : 'Hide read items'}
          >
            {hideRead ? `Unread only (${items.length - [...readIds].filter(id => items.some(i => i.id === id)).length} hidden)` : 'Hide read'}
          </button>

          {readIds.size > 0 && (
            <button className="clear-read-btn" onClick={onClearRead} title="Clear all read marks">
              Clear read ({readIds.size})
            </button>
          )}
        </div>
      </div>

      <div className="feed-count">
        {loading ? (
          <span>Loading...</span>
        ) : error ? null : (
          <span>
            {visible.length} of {unfiltered.length} items
            {readIds.size > 0 && <span className="feed-read-count"> · {readIds.size} read</span>}
          </span>
        )}
      </div>

      {loading && (
        <div className="feed-state">
          <div className="spinner" />
          <p>Loading AI news...</p>
        </div>
      )}

      {!loading && error && (
        <div className="feed-state feed-error">
          <p>Failed to load data: {error}</p>
          <p className="feed-error-hint">
            Run <code>pnpm ingest</code> to populate the data, then restart the
            dev server.
          </p>
        </div>
      )}

      {!loading && !error && visible.length === 0 && (
        <div className="feed-state">
          <p className="feed-empty-title">No items found</p>
          <p className="feed-empty-sub">
            {totalCount === 0
              ? 'Run pnpm ingest to fetch AI news.'
              : hideRead && readIds.size > 0
              ? 'All caught up! Toggle "Hide read" to see everything.'
              : 'Try adjusting your filters or search.'}
          </p>
        </div>
      )}

      {!loading && !error && visible.length > 0 && (
        <>
          <ul className="feed-list">
            {visible.map((item) => (
              <li key={item.id}>
                <Card
                  item={item}
                  isRead={readIds.has(item.id)}
                  onMarkRead={onMarkRead}
                  onMarkUnread={onMarkUnread}
                />
              </li>
            ))}
          </ul>
          {remaining > 0 && (
            <div className="load-more-wrapper">
              <button
                className="load-more-btn"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              >
                Load {Math.min(remaining, PAGE_SIZE)} more
                <span className="load-more-count">({remaining} remaining)</span>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
