import type { Item, SortMode } from '../types'
import { Card } from './Card'

interface FeedProps {
  items: Item[]
  loading: boolean
  error: string | null
  searchQuery: string
  sortMode: SortMode
  totalCount: number
  onSearchChange: (q: string) => void
  onSortChange: (m: SortMode) => void
}

export function Feed({
  items,
  loading,
  error,
  searchQuery,
  sortMode,
  totalCount,
  onSearchChange,
  onSortChange,
}: FeedProps) {
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
      </div>

      <div className="feed-count">
        {loading ? (
          <span>Loading...</span>
        ) : error ? null : (
          <span>
            {items.length} of {totalCount} items
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

      {!loading && !error && items.length === 0 && (
        <div className="feed-state">
          <p className="feed-empty-title">No items found</p>
          <p className="feed-empty-sub">
            {totalCount === 0
              ? 'Run pnpm ingest to fetch AI news.'
              : 'Try adjusting your filters or search.'}
          </p>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="feed-list">
          {items.map((item) => (
            <li key={item.id}>
              <Card item={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
