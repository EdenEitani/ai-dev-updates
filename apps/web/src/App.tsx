import { useState } from 'react'
import { useItems } from './hooks/useItems'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Feed } from './components/Feed'
import { LearnSection } from './components/LearnSection'

export default function App() {
  const store = useItems()
  const [filtersOpen, setFiltersOpen] = useState(false)

  const totalActive = Object.values(store.activeFilters).reduce(
    (s, set) => s + set.size,
    0,
  )

  return (
    <div className="app">
      <Header />
      <div className="layout">
        <aside className="sidebar-wrapper">
          {/* Mobile toggle button */}
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
          <LearnSection items={store.items} />
          <Feed
            items={store.filtered}
            loading={store.loading}
            error={store.error}
            searchQuery={store.searchQuery}
            sortMode={store.sortMode}
            totalCount={store.items.length}
            onSearchChange={store.setSearchQuery}
            onSortChange={store.setSortMode}
          />
        </main>
      </div>
    </div>
  )
}
