import { useState, useMemo } from 'react'
import { useItems } from './hooks/useItems'
import { useReadItems } from './hooks/useReadItems'
import { useLastVisit } from './hooks/useLastVisit'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Feed } from './components/Feed'
import { LearnSection } from './components/LearnSection'
import { DailyDigest } from './components/DailyDigest'

export default function App() {
  const store = useItems()
  const { readIds, markRead, markUnread, clearAll } = useReadItems()
  const lastVisit = useLastVisit()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [hideRead, setHideRead] = useState(false)

  const newCount = useMemo(() => {
    if (!lastVisit) return 0
    return store.items.filter((i) => new Date(i.publishedAt) > lastVisit).length
  }, [store.items, lastVisit])

  const totalActive = Object.values(store.activeFilters).reduce(
    (s, set) => s + set.size,
    0,
  )

  return (
    <div className="app">
      <Header newCount={newCount} />
      <div className="layout">
        <aside className="sidebar-wrapper">
          <button
            className="filters-toggle"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
          >
            <span className="filters-toggle-label">
              Filters
              {totalActive > 0 && (
                <span className="filters-toggle-badge">{totalActive}</span>
              )}
            </span>
            <span className="filters-toggle-chevron">
              {filtersOpen ? '▲' : '▼'}
            </span>
          </button>

          <div className={`sidebar-collapsible ${filtersOpen ? 'open' : ''}`}>
            <Sidebar
              tagIndex={store.tagIndex}
              activeFilters={store.activeFilters}
              tagCounts={store.tagCounts}
              onTagToggle={store.toggleTag}
              onClearFilters={store.clearFilters}
            />
          </div>
        </aside>
        <main className="feed-wrapper">
          <DailyDigest items={store.items} onMarkRead={markRead} lastVisit={lastVisit} newCount={newCount} />
          <LearnSection items={store.items} />
          <Feed
            items={store.filtered}
            loading={store.loading}
            error={store.error}
            searchQuery={store.searchQuery}
            sortMode={store.sortMode}
            totalCount={store.items.length}
            hideRead={hideRead}
            readIds={readIds}
            onSearchChange={store.setSearchQuery}
            onSortChange={store.setSortMode}
            onToggleHideRead={() => setHideRead((h) => !h)}
            onMarkRead={markRead}
            onMarkUnread={markUnread}
            onClearRead={clearAll}
          />
        </main>
      </div>
    </div>
  )
}
