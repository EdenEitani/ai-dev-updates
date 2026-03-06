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

const USER_AGENT = 'AI-Dev-Updates-Bot/1.0 (github.com/ai-dev-updates)'

export async function fetchReddit(config: RedditConfig): Promise<RawItem[]> {
  const { subreddit } = config
  try {
    console.log(`  [reddit] fetching r/${subreddit}...`)

    const res = await fetch(
      `https://www.reddit.com/r/${subreddit}/hot.json?limit=50&raw_json=1`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(15000),
      },
    )

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
