export type TagCategory = 'tools' | 'industry' | 'topic' | 'type'

export interface TagRule {
  tag: string
  category: TagCategory
  keywords: string[]
  domains?: string[]
  subreddits?: string[]
}

export const TAG_RULES: TagRule[] = [
  // --- tools ---
  { tag: 'openai', category: 'tools', keywords: ['openai', 'gpt-4', 'gpt-3', 'chatgpt', 'dall-e', 'whisper', 'sora'], domains: ['openai.com'] },
  { tag: 'anthropic', category: 'tools', keywords: ['anthropic', 'claude', 'claude-3', 'claude-4', 'sonnet', 'haiku', 'opus'], domains: ['anthropic.com'], subreddits: ['ClaudeAI'] },
  { tag: 'langchain', category: 'tools', keywords: ['langchain', 'langgraph', 'langsmith'], domains: ['langchain.dev', 'langsmith.com'], subreddits: ['LangChain'] },
  { tag: 'llama', category: 'tools', keywords: ['llama', 'llama2', 'llama3', 'meta ai', 'ollama'], subreddits: ['LocalLLaMA'] },
  { tag: 'huggingface', category: 'tools', keywords: ['hugging face', 'huggingface', 'transformers', 'diffusers', 'spaces'], domains: ['huggingface.co'] },
  { tag: 'cursor', category: 'tools', keywords: ['cursor ide', 'cursor editor', 'cursor ai', ' cursor '], domains: ['cursor.com', 'changelog.cursor.com'], subreddits: ['cursor'] },
  { tag: 'claude-code', category: 'tools', keywords: ['claude code', 'claude-code'] },
  { tag: 'vercel-ai-sdk', category: 'tools', keywords: ['vercel ai', 'ai sdk', 'ai/sdk', 'next.js ai'], domains: ['vercel.com'] },
  { tag: 'v0', category: 'tools', keywords: ['v0.dev', 'v0 by vercel', 'vercel v0'] },
  { tag: 'pinecone', category: 'tools', keywords: ['pinecone'], domains: ['pinecone.io'] },
  { tag: 'supabase', category: 'tools', keywords: ['supabase'], domains: ['supabase.com'] },
  // ── Vibe-coding tools ──
  { tag: 'lovable', category: 'tools', keywords: ['lovable', 'lovable.dev'], domains: ['lovable.dev'] },
  { tag: 'bolt', category: 'tools', keywords: ['bolt.new', 'bolt ai', 'stackblitz ai'], domains: ['bolt.new', 'stackblitz.com'] },
  { tag: 'replit', category: 'tools', keywords: ['replit', 'replit agent'], domains: ['replit.com', 'blog.replit.com'], subreddits: ['replit'] },
  { tag: 'windsurf', category: 'tools', keywords: ['windsurf', 'codeium', 'windsurfer'], domains: ['codeium.com', 'windsurf.com'] },
  { tag: 'base44', category: 'tools', keywords: ['base44'], domains: ['base44.com'] },
  { tag: 'copilot', category: 'tools', keywords: ['github copilot', 'copilot chat', 'copilot workspace'], domains: ['github.blog'] },
  { tag: 'devin', category: 'tools', keywords: ['devin', 'cognition ai', 'cognition labs'], domains: ['cognition.ai'] },
  { tag: 'aider', category: 'tools', keywords: ['aider', 'aider.chat'], domains: ['aider.chat'] },
  { tag: 'continue', category: 'tools', keywords: ['continue.dev', 'continue ai'], domains: ['continue.dev'] },
  // ── AI agents & orchestration ──
  { tag: 'crewai', category: 'tools', keywords: ['crewai', 'crew ai'], domains: ['crewai.com'] },
  { tag: 'autogen', category: 'tools', keywords: ['autogen', 'ag2', 'microsoft autogen'], domains: ['microsoft.github.io/autogen'] },
  { tag: 'litellm', category: 'tools', keywords: ['litellm'], domains: ['litellm.ai'] },
  { tag: 'dspy', category: 'tools', keywords: ['dspy', 'ds-py', 'stanford dspy'] },
  { tag: 'instructor', category: 'tools', keywords: ['instructor', 'instructor-ai', 'structured outputs'] },

  // --- industry ---
  { tag: 'fintech', category: 'industry', keywords: ['fintech', 'finance', 'banking', 'payments', 'trading', 'investment', 'hedge fund'] },
  { tag: 'healthcare', category: 'industry', keywords: ['healthcare', 'medical', 'clinical', 'drug discovery', 'biotech', 'hospital'] },
  { tag: 'ecommerce', category: 'industry', keywords: ['ecommerce', 'e-commerce', 'retail', 'shopping', 'marketplace'] },
  { tag: 'gaming', category: 'industry', keywords: ['gaming', 'game dev', 'game development', 'video game', 'npc'] },
  { tag: 'education', category: 'industry', keywords: ['education', 'edtech', 'learning', 'tutoring', 'classroom', 'student'] },
  { tag: 'enterprise', category: 'industry', keywords: ['enterprise', 'b2b', 'saas', 'corporate', 'fortune 500'] },
  { tag: 'security', category: 'industry', keywords: ['security', 'cybersecurity', 'jailbreak', 'red team', 'adversarial', 'vulnerability'] },
  { tag: 'devtools', category: 'industry', keywords: ['developer tools', 'devtools', 'ide', 'code editor', 'cli', 'sdk', 'api'] },

  // --- topic ---
  { tag: 'agents', category: 'topic', keywords: ['agent', 'autonomous', 'agentic', 'multi-agent', 'tool use', 'function calling', 'computer use'] },
  { tag: 'rag', category: 'topic', keywords: ['rag', 'retrieval augmented', 'retrieval-augmented', 'vector search', 'knowledge base'] },
  { tag: 'evals', category: 'topic', keywords: ['eval', 'evals', 'evaluation', 'benchmark', 'leaderboard', 'mmlu', 'hellaswag', 'accuracy'] },
  { tag: 'fine-tuning', category: 'topic', keywords: ['fine-tuning', 'fine tuning', 'finetuning', 'lora', 'qlora', 'sft', 'rlhf', 'dpo'] },
  { tag: 'embeddings', category: 'topic', keywords: ['embeddings', 'embedding model', 'semantic search', 'vector database', 'vector store'] },
  { tag: 'voice', category: 'topic', keywords: ['voice', 'speech', 'tts', 'stt', 'audio', 'spoken', 'real-time audio'] },
  { tag: 'vision', category: 'topic', keywords: ['vision', 'multimodal', 'image', 'video', 'visual', 'screenshot', 'ocr'] },
  { tag: 'safety', category: 'topic', keywords: ['safety', 'alignment', 'constitutional ai', 'harmless', 'bias', 'responsible ai', 'guardrails'] },
  { tag: 'infra', category: 'topic', keywords: ['infrastructure', 'serving', 'deployment', 'kubernetes', 'gpu', 'tpu', 'vllm', 'triton'] },
  { tag: 'latency', category: 'topic', keywords: ['latency', 'throughput', 'tokens per second', 'performance', 'speed', 'optimization', 'quantization'] },
  { tag: 'pricing', category: 'topic', keywords: ['pricing', 'cost', 'price', 'cheaper', 'expensive', 'free tier', 'api cost'] },

  // --- type ---
  { tag: 'release', category: 'type', keywords: ['release', 'launch', 'announce', 'introducing', 'available now', 'new model', 'released', 'shipped', 'v2', 'v3', 'v4'] },
  { tag: 'tutorial', category: 'type', keywords: ['tutorial', 'guide', 'how to', 'walkthrough', 'step by step', 'getting started', 'quickstart', 'cookbook'] },
  { tag: 'benchmark', category: 'type', keywords: ['benchmark', 'leaderboard', 'comparison', 'vs ', 'versus', 'outperforms', 'state of the art', 'sota'] },
  { tag: 'deprecation', category: 'type', keywords: ['deprecat', 'sunsetting', 'end of life', 'eol', 'shutting down', 'discontinued'] },
  { tag: 'pricing', category: 'type', keywords: ['price cut', 'price reduction', 'cheaper', 'free tier', 'pricing update', 'cost reduction'] },
  { tag: 'research', category: 'type', keywords: ['paper', 'research', 'study', 'arxiv', 'we propose', 'we present', 'empirical'] },
  { tag: 'incident', category: 'type', keywords: ['outage', 'incident', 'downtime', 'degraded', 'postmortem', 'bug', 'issue'] },
  { tag: 'roadmap', category: 'type', keywords: ['roadmap', "what's next", 'coming soon', 'future', 'planned', 'upcoming'] },
]
