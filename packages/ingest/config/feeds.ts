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
    tags: ['vercel-ai-sdk'],
  },
  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    type: 'rss',
    tags: [],
  },
  {
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    type: 'rss',
    tags: ['research'],
  },
  {
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com/feed',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Sebastian Raschka AI',
    url: 'https://magazine.sebastianraschka.com/feed',
    type: 'rss',
    tags: ['research'],
  },
]

export const REDDIT_SOURCES: RedditConfig[] = [
  { subreddit: 'MachineLearning' },
  { subreddit: 'LocalLLaMA', tags: ['llama'] },
  { subreddit: 'OpenAI', tags: ['openai'] },
  { subreddit: 'ClaudeAI', tags: ['anthropic'] },
  { subreddit: 'LangChain', tags: ['langchain'] },
  { subreddit: 'artificial' },
]

export const DATA_DIR = '../../data'
export const MAX_ITEMS = 500
export const DEDUP_TITLE_THRESHOLD = 0.15
