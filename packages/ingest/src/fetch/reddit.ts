import type { RedditConfig } from '../../config/feeds.js'
import type { RawItem } from '../types.js'

interface RedditPost {
  data: {
    id: string
    title: string
    url: string
    permalink: string
    selftext: string
    author: string
    score: number
    num_comments: number
    created_utc: number
    subreddit: string
    is_self: boolean
    over_18: boolean
    stickied: boolean
  }
}

interface RedditListing {
  data: {
    children: RedditPost[]
  }
}

const USER_AGENT = 'AI-Dev-Updates-Bot/1.0 (github.com/EdenEitani/ai-dev-updates)'

// Module-level token cache for the current run
let cachedToken: string | null = null

async function getOAuthToken(): Promise<string | null> {
  const clientId = process.env.REDDIT_CLIENT_ID
  const clientSecret = process.env.REDDIT_CLIENT_SECRET
  if (!clientId || !clientSecret) return null

  if (cachedToken) return cachedToken

  try {
    const creds = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    const res = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
        'User-Agent': USER_AGENT,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
      signal: AbortSignal.timeout(10000),
    })
    if (!res.ok) {
      console.warn(`  [reddit] OAuth token fetch failed: ${res.status}`)
      return null
    }
    const json = (await res.json()) as { access_token?: string }
    cachedToken = json.access_token ?? null
    if (cachedToken) console.log('  [reddit] OAuth token obtained')
    return cachedToken
  } catch (err) {
    console.warn('  [reddit] OAuth token error:', err instanceof Error ? err.message : String(err))
    return null
  }
}

export async function fetchReddit(config: RedditConfig): Promise<RawItem[]> {
  const { subreddit } = config
  try {
    console.log(`  [reddit] fetching r/${subreddit}...`)

    const token = await getOAuthToken()
    const baseUrl = token
      ? `https://oauth.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`
      : `https://www.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`

    const headers: Record<string, string> = {
      'User-Agent': USER_AGENT,
      Accept: 'application/json',
    }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(baseUrl, {
      headers,
      signal: AbortSignal.timeout(15000),
    })

    if (res.status === 403 || res.status === 429) {
      console.warn(`  [reddit] r/${subreddit} blocked (${res.status}) — skipping`)
      return []
    }
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} ${res.statusText}`)
    }

    const json = (await res.json()) as RedditListing

    return json.data.children
      .map((post) => post.data)
      .filter((d) => !d.stickied && !d.over_18 && d.title && d.url && d.score >= 20)
      .map((d) => ({
        title: d.title.slice(0, 300),
        url: d.is_self
          ? `https://www.reddit.com${d.permalink}`
          : d.url.split('?')[0].replace(/\/$/, ''),
        summary: d.selftext.slice(0, 600),
        publishedAt: new Date(d.created_utc * 1000).toISOString(),
        author: `u/${d.author}`,
        source: 'reddit' as const,
        sourceName: `r/${d.subreddit}`,
        score: d.score,
        comments: d.num_comments,
        sourceTags: config.tags ?? [],
        raw: d,
      }))
  } catch (err) {
    console.error(
      `  [reddit] failed r/${subreddit}:`,
      err instanceof Error ? err.message : String(err),
    )
    return []
  }
}
