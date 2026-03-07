import type { Item } from '../types'

interface CardProps {
  item: Item
  isRead: boolean
  onMarkRead: (id: string) => void
  onMarkUnread: (id: string) => void
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

const SOURCE_COLORS: Record<string, string> = {
  rss: '#1d9bf0',
  reddit: '#ff4500',
}

const TAG_COLORS: Record<string, string> = {
  tools: '#7b68ee',
  industry: '#20b2aa',
  topic: '#3cb371',
  type: '#cd853f',
}

export function Card({ item, isRead, onMarkRead, onMarkUnread }: CardProps) {
  const allTags = [
    ...item.tags.tools.map((t) => ({ label: t, cat: 'tools' })),
    ...item.tags.topic.map((t) => ({ label: t, cat: 'topic' })),
    ...item.tags.type.map((t) => ({ label: t, cat: 'type' })),
    ...item.tags.industry.map((t) => ({ label: t, cat: 'industry' })),
  ].slice(0, 6)

  return (
    <article className={`card${isRead ? ' card--read' : ''}`}>
      <div className="card-meta">
        <span
          className="card-source-badge"
          style={{ borderColor: SOURCE_COLORS[item.source] ?? '#8899a6' }}
        >
          {item.sourceName}
        </span>
        <span className="card-author">{item.author}</span>
        <span className="card-dot">·</span>
        <time className="card-time" dateTime={item.publishedAt}>
          {timeAgo(item.publishedAt)}
        </time>
        {item.source === 'reddit' && item.score > 0 && (
          <>
            <span className="card-dot">·</span>
            <span className="card-score">{item.score.toFixed(0)} pts</span>
          </>
        )}
        {item.source === 'reddit' && item.comments > 0 && (
          <span className="card-comments">{item.comments} comments</span>
        )}
      </div>

      <h2 className="card-title">
        <a href={item.url} target="_blank" rel="noopener noreferrer" onClick={() => onMarkRead(item.id)}>
          {item.title}
        </a>
      </h2>

      {item.summary && (
        <p className="card-summary">{item.summary}</p>
      )}

      <div className="card-footer">
        {allTags.length > 0 && (
          <div className="card-tags">
            {allTags.map(({ label, cat }) => (
              <span
                key={`${cat}-${label}`}
                className="tag-badge"
                style={{ '--tag-color': TAG_COLORS[cat] } as React.CSSProperties}
              >
                {label}
              </span>
            ))}
          </div>
        )}
        <div className="card-actions">
          <button
            className={`mark-read-btn${isRead ? ' mark-read-btn--done' : ''}`}
            onClick={() => isRead ? onMarkUnread(item.id) : onMarkRead(item.id)}
            title={isRead ? 'Mark as unread' : 'Mark as read'}
          >
            {isRead ? '✓ Read' : 'Mark read'}
          </button>
          <button
            className="share-btn"
            title="Share"
            onClick={async () => {
              const shareData = { title: item.title, url: item.url }
              if (navigator.share) {
                await navigator.share(shareData).catch(() => null)
              } else {
                await navigator.clipboard.writeText(item.url).catch(() => null)
                // brief visual feedback via title attr change — handled by CSS :active
              }
            }}
          >
            Share
          </button>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-link-btn"
            onClick={() => onMarkRead(item.id)}
          >
            Open
          </a>
        </div>
      </div>
    </article>
  )
}
