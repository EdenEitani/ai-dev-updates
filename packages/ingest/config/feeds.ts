export interface FeedConfig {
  name: string
  url: string
  type: 'rss'
  tags?: string[]
  limit?: number
}

export interface RedditConfig {
  subreddit: string
  tags?: string[]
}

export const RSS_FEEDS: FeedConfig[] = [

  // ── AI Companies ──────────────────────────────────────────────
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
    name: 'Google DeepMind Blog',
    url: 'https://deepmind.google/blog/rss.xml',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Google AI Blog',
    url: 'https://blog.google/technology/ai/rss/',
    type: 'rss',
    tags: [],
  },
  {
    name: 'HuggingFace Blog',
    url: 'https://huggingface.co/blog/feed.xml',
    type: 'rss',
    tags: ['huggingface'],
  },
  {
    name: 'Cohere Blog',
    url: 'https://cohere.com/blog/rss',
    type: 'rss',
    tags: [],
  },

  // ── AI Frameworks / Tooling ───────────────────────────────────
  {
    name: 'LangChain Blog',
    url: 'https://blog.langchain.dev/rss/',
    type: 'rss',
    tags: ['langchain'],
  },
  {
    name: 'LlamaIndex Blog',
    url: 'https://www.llamaindex.ai/blog/rss',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Vercel Blog',
    url: 'https://vercel.com/blog/feed.xml',
    type: 'rss',
    tags: ['vercel-ai-sdk', 'v0'],
  },
  {
    name: 'Pinecone Blog',
    url: 'https://www.pinecone.io/blog/rss.xml',
    type: 'rss',
    tags: ['pinecone'],
  },
  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    type: 'rss',
    tags: [],
    limit: 15,
  },

  // ── GitHub Releases (Atom) ────────────────────────────────────
  {
    name: 'LangChain Releases',
    url: 'https://github.com/langchain-ai/langchain/releases.atom',
    type: 'rss',
    tags: ['langchain', 'release'],
  },
  {
    name: 'LlamaIndex Releases',
    url: 'https://github.com/run-llama/llama_index/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'OpenAI Python SDK Releases',
    url: 'https://github.com/openai/openai-python/releases.atom',
    type: 'rss',
    tags: ['openai', 'release'],
  },
  {
    name: 'Anthropic Python SDK Releases',
    url: 'https://github.com/anthropics/anthropic-sdk-python/releases.atom',
    type: 'rss',
    tags: ['anthropic', 'release'],
  },
  {
    name: 'Vercel AI SDK Releases',
    url: 'https://github.com/vercel/ai/releases.atom',
    type: 'rss',
    tags: ['vercel-ai-sdk', 'release'],
  },
  {
    name: 'HuggingFace Transformers Releases',
    url: 'https://github.com/huggingface/transformers/releases.atom',
    type: 'rss',
    tags: ['huggingface', 'release'],
  },
  {
    name: 'PyTorch Releases',
    url: 'https://github.com/pytorch/pytorch/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'Ollama Releases',
    url: 'https://github.com/ollama/ollama/releases.atom',
    type: 'rss',
    tags: ['llama', 'release'],
  },
  {
    name: 'vLLM Releases',
    url: 'https://github.com/vllm-project/vllm/releases.atom',
    type: 'rss',
    tags: ['release'],
  },

  // ── arXiv Research ───────────────────────────────────────────
  {
    name: 'arXiv cs.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    type: 'rss',
    tags: [],
    limit: 20,
  },
  {
    name: 'arXiv cs.LG',
    url: 'https://rss.arxiv.org/rss/cs.LG',
    type: 'rss',
    tags: [],
    limit: 20,
  },
  {
    name: 'arXiv cs.CL',
    url: 'https://rss.arxiv.org/rss/cs.CL',
    type: 'rss',
    tags: [],
    limit: 20,
  },

  // ── AI News Sites ─────────────────────────────────────────────
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss',
    tags: [],
    limit: 15,
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'Ars Technica AI',
    url: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
    type: 'rss',
    tags: [],
    limit: 10,
  },

  // ── Business / Investment AI News ────────────────────────────
  {
    name: 'Reuters Technology',
    url: 'https://feeds.reuters.com/reuters/technologyNews',
    type: 'rss',
    tags: [],
    limit: 15,
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/feed/tag/artificial-intelligence/latest/rss',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'Fortune Technology',
    url: 'https://fortune.com/feed/fortune-feeds/?id=3230629',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'CNBC AI',
    url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html',
    type: 'rss',
    tags: [],
    limit: 10,
  },

  // ── Developer Communities ─────────────────────────────────────
  {
    name: 'Hacker News Frontpage',
    url: 'https://hnrss.org/frontpage',
    type: 'rss',
    tags: [],
    limit: 20,
  },
  {
    name: 'Hacker News — AI/LLM',
    url: 'https://hnrss.org/newest?q=LLM+OR+GPT+OR+Claude+OR+Gemini&points=50',
    type: 'rss',
    tags: [],
    limit: 20,
  },
  {
    name: 'Dev.to — AI',
    url: 'https://dev.to/feed/tag/ai',
    type: 'rss',
    tags: [],
    limit: 15,
  },
  {
    name: 'Dev.to — LLM',
    url: 'https://dev.to/feed/tag/llm',
    type: 'rss',
    tags: [],
    limit: 15,
  },

  // ── AI Newsletters ────────────────────────────────────────────
  {
    name: 'Import AI (Jack Clark)',
    url: 'https://importai.substack.com/feed',
    type: 'rss',
    tags: [],
  },
  {
    name: "Ben's Bites",
    url: 'https://www.bensbites.com/feed',
    type: 'rss',
    tags: [],
  },
  {
    name: 'The Rundown AI',
    url: 'https://www.therundown.ai/rss',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Simon Willison',
    url: 'https://simonwillison.net/atom/everything/',
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
    name: 'The Gradient',
    url: 'https://thegradient.pub/rss/',
    type: 'rss',
    tags: [],
  },

  // ── Vibe-coding / AI builders ─────────────────────────────────
  {
    name: 'Replit Blog',
    url: 'https://blog.replit.com/atom.xml',
    type: 'rss',
    tags: ['replit'],
  },
  {
    name: 'StackBlitz / Bolt Blog',
    url: 'https://blog.stackblitz.com/rss.xml',
    type: 'rss',
    tags: ['bolt'],
  },
  {
    name: 'GitHub Blog',
    url: 'https://github.blog/feed/',
    type: 'rss',
    tags: ['copilot'],
    limit: 15,
  },
]

// Reddit via JSON API (preserves upvote score + comment count for ranking)
export const REDDIT_SOURCES: RedditConfig[] = [
  { subreddit: 'MachineLearning' },
  { subreddit: 'LocalLLaMA', tags: ['llama'] },
  { subreddit: 'OpenAI', tags: ['openai'] },
  { subreddit: 'ClaudeAI', tags: ['anthropic'] },
  { subreddit: 'LangChain', tags: ['langchain'] },
  { subreddit: 'artificial' },
  { subreddit: 'cursor', tags: ['cursor'] },
  { subreddit: 'replit', tags: ['replit'] },
  { subreddit: 'ChatGPTCoding' },
  { subreddit: 'singularity' },
]

export const DATA_DIR = '../../data'
export const MAX_ITEMS = 1000
export const DEDUP_TITLE_THRESHOLD = 0.15
