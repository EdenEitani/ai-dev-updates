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

  // ── Insider Twitter/X feeds (via rss.app) ─────────────────────
  {
    name: 'Thariq Shihipar (Claude Code)',
    url: 'https://rss.app/feeds/saYRSw5hD8C6Vh4W.xml',
    type: 'rss',
    tags: ['anthropic', 'claude-code'],
  },
  {
    name: 'Claude Code Community',
    url: 'https://rss.app/feeds/zmfv1QC7YXsbFJKV.xml',
    type: 'rss',
    tags: ['anthropic', 'claude-code'],
  },

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
    name: 'Meta AI Blog',
    url: 'https://ai.meta.com/blog/rss/',
    type: 'rss',
    tags: ['llama'],
  },
  {
    name: 'Mistral Blog',
    url: 'https://mistral.ai/news/rss',
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
    name: 'Vercel Blog',
    url: 'https://vercel.com/blog/feed.xml',
    type: 'rss',
    tags: ['vercel-ai-sdk', 'v0'],
  },
  {
    name: 'AWS Machine Learning Blog',
    url: 'https://aws.amazon.com/blogs/machine-learning/feed/',
    type: 'rss',
    tags: [],
    limit: 8,
  },
  {
    name: 'Lightning AI Blog',
    url: 'https://lightning.ai/blog/rss/',
    type: 'rss',
    tags: [],
    limit: 5,
  },
  {
    name: 'Together AI Blog',
    url: 'https://www.together.ai/blog/rss.xml',
    type: 'rss',
    tags: [],
    limit: 5,
  },

  // ── GitHub Releases (Atom) — SDK & Core Tools ─────────────────
  {
    name: 'Claude Code Releases',
    url: 'https://github.com/anthropics/claude-code/releases.atom',
    type: 'rss',
    tags: ['anthropic', 'claude-code', 'release'],
  },
  {
    name: 'Anthropic Python SDK Releases',
    url: 'https://github.com/anthropics/anthropic-sdk-python/releases.atom',
    type: 'rss',
    tags: ['anthropic', 'release'],
  },
  {
    name: 'Anthropic TypeScript SDK Releases',
    url: 'https://github.com/anthropics/anthropic-sdk-typescript/releases.atom',
    type: 'rss',
    tags: ['anthropic', 'release'],
  },
  {
    name: 'OpenAI Python SDK Releases',
    url: 'https://github.com/openai/openai-python/releases.atom',
    type: 'rss',
    tags: ['openai', 'release'],
  },
  {
    name: 'OpenAI Node SDK Releases',
    url: 'https://github.com/openai/openai-node/releases.atom',
    type: 'rss',
    tags: ['openai', 'release'],
  },
  {
    name: 'Vercel AI SDK Releases',
    url: 'https://github.com/vercel/ai/releases.atom',
    type: 'rss',
    tags: ['vercel-ai-sdk', 'release'],
  },
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
    name: 'HuggingFace Transformers Releases',
    url: 'https://github.com/huggingface/transformers/releases.atom',
    type: 'rss',
    tags: ['huggingface', 'release'],
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

  // ── GitHub Releases — AI Agents & Orchestration ───────────────
  {
    name: 'CrewAI Releases',
    url: 'https://github.com/crewAIInc/crewAI/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'AutoGen Releases',
    url: 'https://github.com/microsoft/autogen/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'LiteLLM Releases',
    url: 'https://github.com/BerriAI/litellm/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'DSPy Releases',
    url: 'https://github.com/stanfordnlp/dspy/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'Instructor Releases',
    url: 'https://github.com/instructor-ai/instructor/releases.atom',
    type: 'rss',
    tags: ['release'],
  },
  {
    name: 'Continue.dev Releases',
    url: 'https://github.com/continuedev/continue/releases.atom',
    type: 'rss',
    tags: ['continue', 'release'],
  },
  {
    name: 'PyTorch Releases',
    url: 'https://github.com/pytorch/pytorch/releases.atom',
    type: 'rss',
    tags: ['release'],
  },

  // ── arXiv Research (capped — context only) ────────────────────
  {
    name: 'arXiv cs.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    type: 'rss',
    tags: [],
    limit: 5,
  },
  {
    name: 'arXiv cs.CL',
    url: 'https://rss.arxiv.org/rss/cs.CL',
    type: 'rss',
    tags: [],
    limit: 5,
  },

  // ── AI News Sites ─────────────────────────────────────────────
  {
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    type: 'rss',
    tags: [],
    limit: 8,
  },
  {
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    type: 'rss',
    tags: [],
    limit: 5,
  },
  {
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    type: 'rss',
    tags: [],
    limit: 5,
  },
  {
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    type: 'rss',
    tags: [],
    limit: 5,
  },
  {
    name: 'Wired AI',
    url: 'https://www.wired.com/feed/tag/artificial-intelligence/latest/rss',
    type: 'rss',
    tags: [],
    limit: 5,
  },
  {
    name: 'CNBC AI',
    url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html',
    type: 'rss',
    tags: [],
    limit: 5,
  },

  // ── Developer Communities ─────────────────────────────────────
  {
    name: 'Hacker News — AI/LLM (viral)',
    url: 'https://hnrss.org/newest?q=LLM+OR+GPT+OR+Claude+OR+Gemini+OR+agent&points=100',
    type: 'rss',
    tags: [],
    limit: 15,
  },
  {
    name: 'Hacker News — Vibe Coding',
    url: 'https://hnrss.org/newest?q=cursor+OR+lovable+OR+bolt+OR+windsurf+OR+replit+OR+copilot&points=50',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'Hacker News — Releases',
    url: 'https://hnrss.org/newest?q=Show+HN&points=100',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'Dev.to — AI',
    url: 'https://dev.to/feed/tag/ai',
    type: 'rss',
    tags: [],
    limit: 8,
  },
  {
    name: 'Dev.to — LLM',
    url: 'https://dev.to/feed/tag/llm',
    type: 'rss',
    tags: [],
    limit: 8,
  },

  // ── AI Newsletters ────────────────────────────────────────────
  {
    name: 'Latent Space',
    url: 'https://www.latent.space/feed',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Interconnects (Nathan Lambert)',
    url: 'https://www.interconnects.ai/feed',
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
  {
    name: "Ben's Bites",
    url: 'https://www.bensbites.com/feed',
    type: 'rss',
    tags: [],
  },
  {
    name: 'Import AI (Jack Clark)',
    url: 'https://importai.substack.com/feed',
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
    limit: 10,
  },

  // ── Reddit RSS (no auth required — fallback for community signal) ─
  // These complement the JSON API (which adds score/comments when OAuth is set)
  {
    name: 'r/LocalLLaMA',
    url: 'https://www.reddit.com/r/LocalLLaMA/.rss?limit=25',
    type: 'rss',
    tags: ['llama'],
    limit: 15,
  },
  {
    name: 'r/MachineLearning',
    url: 'https://www.reddit.com/r/MachineLearning/.rss?limit=25',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'r/ClaudeAI',
    url: 'https://www.reddit.com/r/ClaudeAI/.rss?limit=20',
    type: 'rss',
    tags: ['anthropic'],
    limit: 10,
  },
  {
    name: 'r/ChatGPTCoding',
    url: 'https://www.reddit.com/r/ChatGPTCoding/.rss?limit=20',
    type: 'rss',
    tags: [],
    limit: 10,
  },
  {
    name: 'r/cursor',
    url: 'https://www.reddit.com/r/cursor/.rss?limit=20',
    type: 'rss',
    tags: ['cursor'],
    limit: 10,
  },
  {
    name: 'r/singularity',
    url: 'https://www.reddit.com/r/singularity/.rss?limit=20',
    type: 'rss',
    tags: [],
    limit: 8,
  },
]

// Reddit via JSON API — provides score + comment count for better ranking.
// Falls back gracefully to RSS feeds above if 403 (no OAuth set).
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
export const MAX_ITEMS = 300
export const DEDUP_TITLE_THRESHOLD = 0.15
