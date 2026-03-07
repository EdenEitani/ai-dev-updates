import { useState } from 'react'

const STORAGE_KEY = 'ai-dev-read-ids'

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function saveToStorage(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  } catch {}
}

export function useReadItems() {
  const [readIds, setReadIds] = useState<Set<string>>(loadFromStorage)

  const markRead = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.add(id)
      saveToStorage(next)
      return next
    })
  }

  const markUnread = (id: string) => {
    setReadIds((prev) => {
      const next = new Set(prev)
      next.delete(id)
      saveToStorage(next)
      return next
    })
  }

  const clearAll = () => {
    setReadIds(new Set())
    saveToStorage(new Set())
  }

  return { readIds, markRead, markUnread, clearAll }
}
