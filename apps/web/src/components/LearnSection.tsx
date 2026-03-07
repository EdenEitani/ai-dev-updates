import type { Item } from '../types'

interface LearnSectionProps {
  items: Item[]
}

// Priority order for display
const TOOL_ORDER = [
  'cursor', 'lovable', 'bolt', 'base44', 'windsurf', 'replit', 'v0',
  'devin', 'aider', 'continue',
  'openai', 'anthropic', 'claude-code', 'copilot',
  'langchain', 'vercel-ai-sdk', 'huggingface', 'llama',
]

const TOOL_META: Record<string, { label: string; color: string; emoji: string }> = {
  cursor:         { label: 'Cursor',        color: '#3b82f6', emoji: '⚡' },
  lovable:        { label: 'Lovable',       color: '#ec4899', emoji: '💜' },
  bolt:           { label: 'Bolt',          color: '#f97316', emoji: '⚡' },
  base44:         { label: 'Base44',        color: '#06b6d4', emoji: '🔷' },
  windsurf:       { label: 'Windsurf',      color: '#0ea5e9', emoji: '🌊' },
  replit:         { label: 'Replit',        color: '#e11d48', emoji: '🔴' },
  v0:             { label: 'v0',            color: '#a855f7', emoji: '🎨' },
  devin:          { label: 'Devin',         color: '#8b5cf6', emoji: '🤖' },
  aider:          { label: 'Aider',         color: '#10b981', emoji: '🛠' },
  continue:       { label: 'Continue',      color: '#6366f1', emoji: '▶' },
  openai:         { label: 'OpenAI',        color: '#10a37f', emoji: '🟢' },
  anthropic:      { label: 'Anthropic',     color: '#d97706', emoji: '🟠' },
  'claude-code':  { label: 'Claude Code',   color: '#d97706', emoji: '🤖' },
  copilot:        { label: 'Copilot',       color: '#6e40c9', emoji: '🐙' },
  langchain:      { label: 'LangChain',     color: '#1d4ed8', emoji: '🔗' },
  'vercel-ai-sdk':{ label: 'Vercel AI',     color: '#171717', emoji: '▲' },
  huggingface:    { label: 'HuggingFace',   color: '#f59e0b', emoji: '🤗' },
  llama:          { label: 'Llama',         color: '#7c3aed', emoji: '🦙' },
}

const LEARN_TYPES = new Set(['release', 'tutorial', 'roadmap'])

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const hrs = Math.floor(diff / 3600000)
  if (hrs < 1) return 'just now'
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}

interface LearnCard {
  tool: string
  item: Item
}

function buildLearnCards(items: Item[]): LearnCard[] {
  const sorted = [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  )

  const byTool: Record<string, Item> = {}

  // Pass 1: prefer items explicitly typed as release/tutorial/roadmap
  for (const item of sorted) {
    if (!item.tags.type.some((t) => LEARN_TYPES.has(t))) continue
    for (const tool of item.tags.tools) {
      if (!(tool in byTool)) byTool[tool] = item
    }
  }

  // Pass 2: fall back to most recent item for any TOOL_ORDER tool not yet covered
  for (const item of sorted) {
    for (const tool of item.tags.tools) {
      if (!(tool in byTool) && TOOL_ORDER.includes(tool)) {
        byTool[tool] = item
      }
    }
  }

  // Sort by TOOL_ORDER, then alphabetically for any extras
  const toolKeys = Object.keys(byTool).sort((a, b) => {
    const ai = TOOL_ORDER.indexOf(a)
    const bi = TOOL_ORDER.indexOf(b)
    if (ai !== -1 && bi !== -1) return ai - bi
    if (ai !== -1) return -1
    if (bi !== -1) return 1
    return a.localeCompare(b)
  })

  return toolKeys.map((tool) => ({ tool, item: byTool[tool] }))
}

export function LearnSection({ items }: LearnSectionProps) {
  const cards = buildLearnCards(items)
  if (cards.length === 0) return null

  return (
    <section className="learn-section">
      <div className="learn-header">
        <span className="learn-title">What's New to Learn</span>
        <span className="learn-sub">Latest release per tool — click to read</span>
      </div>
      <div className="learn-scroll">
        {cards.map(({ tool, item }) => {
          const meta = TOOL_META[tool] ?? { label: tool, color: '#8899a6', emoji: '🔧' }
          return (
            <a
              key={tool}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="learn-card"
              style={{ '--tool-color': meta.color } as React.CSSProperties}
            >
              <div className="learn-card-tool">
                <span className="learn-card-emoji">{meta.emoji}</span>
                <span className="learn-card-label">{meta.label}</span>
                <span className="learn-card-age">{timeAgo(item.publishedAt)}</span>
              </div>
              <p className="learn-card-title">{item.title}</p>
              {item.summary && (
                <p className="learn-card-summary">{item.summary}</p>
              )}
              <div className="learn-card-tags">
                {item.tags.type.slice(0, 2).map((t) => (
                  <span key={t} className="learn-card-type">{t}</span>
                ))}
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}
