import { useState } from 'react'

const KEY = 'lastVisit'

// Returns the timestamp of the *previous* visit (null on first visit).
// Immediately updates localStorage to now so next visit sees today's date.
export function useLastVisit(): Date | null {
  const [lastVisit] = useState<Date | null>(() => {
    const stored = localStorage.getItem(KEY)
    localStorage.setItem(KEY, new Date().toISOString())
    return stored ? new Date(stored) : null
  })
  return lastVisit
}
