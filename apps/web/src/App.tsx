import { useItems } from './hooks/useItems'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Feed } from './components/Feed'
import { LearnSection } from './components/LearnSection'

export default function App() {
  const store = useItems()

  return (
    <div className="app">
      <Header />
      <div className="layout">
        <aside className="sidebar-wrapper">
          <Sidebar
            tagIndex={store.tagIndex}
            activeFilters={store.activeFilters}
            tagCounts={store.tagCounts}
            onTagToggle={store.toggleTag}
            onClearFilters={store.clearFilters}
          />
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
