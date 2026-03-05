export interface FeedConfig {
  name: string
  url: string
  type: 'rss'
  tags?: string[]
}

export interface RedditConfig {
  subreddit: string
  tags?: string[]
}

export const RSS_FEEDS: FeedConfig[] = [
  // ── Foundation models ──────────────────────────────────────────
  {
    name: 'OpenAI Blog',
    url: 'https://openai.com/news/rss.xml',
    type: 'rss',
    tags: ['openai'],
  },
  {
    name: 'Anthropic News',
    url: 'https://www.anthropic.com/rss.xml',
    type: 'rss',
    tags: ['anthropic'],
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    type: 'rss',
    tags: ['google'],
  },
  {
    name: 'HuggingFace Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    type: 'rss',
    tags: ['huggingface'],
  },

  // ── Dev tooling / frameworks ───────────────────────────────────
  {
    name: 'LangChain Blog',
    url: 'https://blog.langchain.dev/rss/',
    type: 'rss',
    tags: ['langchain'],
  },
  {
    name: 'Vercel Blog',
    url: 'https://vercel.com/blog/feed',
    type: 'rss',
    tags: ['vercel-ai-sdk', 'v0'],
  },
  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    type: 'rss',
    tags: [],
  },

  // ── Vibe-coding / AI builders ──────────────────────────────────
  {
    name: 'Replit Blog',
    url: 'https://blog.replit.com/rss.xml',
    type: 'rss',
    tags: ['replit'],
  },
  {
    name: 'Lovable Blog',
    url: 'https://lovable.dev/blog/rss.xml',
    type: 'rss',
    tags: ['lovable'],
  },
  {
    name: 'StackBlitz / Bolt Blog',
    url: 'https://blog.stackblitz.com/rss.xml',
    type: 'rss',
    tags: ['bolt'],
  },
  {
    name: 'Cursor Changelog',
    url: 'https://changelog.cursor.com/rss.xml',
    type: 'rss',
    tags: ['cursor'],
  },
  {
    name: 'Codeium / Windsurf Blog',
    url: 'https://codeium.com/blog/rss.xml',
    type: 'rss',
    tags: ['windsurf'],
  },
  {
    name: 'Base44 Blog',
    url: 'https://base44.com/blog/rss.xml',
    type: 'rss',
    tags: ['base44'],
  },
  {
    name: 'GitHub Blog (AI)',
    url: 'https://github.blog/category/ai-ml/feed/',
    type: 'rss',
    tags: ['copilot'],
  },
  {
    name: 'Cognition / Devin Blog',
    url: 'https://cognition.ai/blog/rss.xml',
    type: 'rss',
    tags: ['devin'],
  },

  // ── Research / learning ────────────────────────────────────────
  {
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Sebastian Raschka AI',
    url: 'https://magazine.sebastianraschka.com/feed',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Simon Willison',
    url: 'https://simonwillison.net/atom/everything/',
    type: 'rss',
    tags: [],
  },
]

export const REDDIT_SOURCES: RedditConfig[] = [
  { subreddit: 'MachineLearning' },
  { subreddit: 'LocalLLaMA', tags: ['llama'] },
  { subreddit: 'OpenAI', tags: ['openai'] },
  { subreddit: 'ClaudeAI', tags: ['anthropic'] },
  { subreddit: 'LangChain', tags: ['langchain'] },
  { subreddit: 'artificial' },
  { subreddit: 'cursor', tags: ['cursor'] },
  { subreddit: 'replit', tags: ['replit'] },
  { subreddit: 'ChatGPTCoding', tags: ['openai'] },
]

export const DATA_DIR = '../../data'
export const MAX_ITEMS = 500
export const DEDUP_TITLE_THRESHOLD = 0.15
