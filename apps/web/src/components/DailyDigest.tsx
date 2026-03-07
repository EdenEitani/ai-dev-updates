import { useState, useMemo } from 'react'
import type { Item } from '../types'

interface DailyDigestProps {
  items: Item[]
  onMarkRead: (id: string) => void
  lastVisit: Date | null
  newCount: number
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export function DailyDigest({ items, onMarkRead, lastVisit, newCount }: DailyDigestProps) {
  const [open, setOpen] = useState(true)

  const top5 = useMemo(() => {
    const cutoff = Date.now() - 48 * 60 * 60 * 1000 // last 48h for sparse days
    const recent = items.filter((i) => new Date(i.publishedAt).getTime() > cutoff)
    const pool = recent.length >= 5 ? recent : items // fallback to all if few recent
    return [...pool].sort((a, b) => b.score - a.score).slice(0, 5)
  }, [items])

  if (top5.length === 0) return null

  return (
    <section className="daily-digest">
      <button className="digest-header" onClick={() => setOpen((o) => !o)}>
        <span className="digest-title">
          <span className="digest-icon">⚡</span>
          Today's Top {top5.length}
          {newCount > 0 && (
            <span className="digest-new-badge">{newCount} new</span>
          )}
        </span>
        <span className="digest-chevron">{open ? '▲' : '▼'}</span>
      </button>
      {lastVisit && newCount > 0 && open && (
        <p className="digest-since">
          {newCount} new item{newCount !== 1 ? 's' : ''} since your last visit{' '}
          {timeAgo(lastVisit.toISOString())}
        </p>
      )}

      {open && (
        <ol className="digest-list">
          {top5.map((item, i) => (
            <li key={item.id} className="digest-item">
              <span className="digest-rank">{i + 1}</span>
              <div className="digest-body">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="digest-link"
                  onClick={() => onMarkRead(item.id)}
                >
                  {item.title}
                </a>
                <span className="digest-meta">
                  {item.sourceName} · {timeAgo(item.publishedAt)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
