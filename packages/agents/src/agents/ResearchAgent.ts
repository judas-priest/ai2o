/**
 * ResearchAgent - Deep research with source attribution
 */

import { LLMAgent, LLMAgentOptions, ChatMessage } from '../base/LLMAgent';
import { TaskContext, TaskResult } from '../base/BaseAgent';

export interface ResearchQuery {
  topic: string;
  depth?: 'quick' | 'standard' | 'deep';
  maxSources?: number;
}

export interface ResearchResult {
  summary: string;
  keyFindings: string[];
  sources: { title: string; url?: string; relevance: number }[];
  confidence: number;
}

export class ResearchAgent extends LLMAgent {
  constructor(options?: Partial<LLMAgentOptions>) {
    super({
      id: options?.id || 'research-agent',
      name: options?.name || 'Research Agent',
      description: 'Deep research agent with source attribution',
      config: {
        model: 'deepseek-chat',
        temperature: 0.3,
        systemPrompt: `You are a research analyst. Provide well-structured research with:
1. Executive summary
2. Key findings (bullet points)
3. Sources with relevance scores
4. Confidence level (0-1)

Always respond in JSON format.`,
        ...options?.config
      },
      ...options
    });
  }

  async research(query: ResearchQuery): Promise<ResearchResult> {
    const prompt = `Research topic: "${query.topic}"
Depth: ${query.depth || 'standard'}
Max sources: ${query.maxSources || 5}

Provide comprehensive research in JSON format:
{
  "summary": "...",
  "keyFindings": ["...", "..."],
  "sources": [{"title": "...", "url": "...", "relevance": 0.9}],
  "confidence": 0.85
}`;

    return this.chatJSON<ResearchResult>([{ role: 'user', content: prompt }]);
  }

  protected async execute(task: TaskContext): Promise<ResearchResult> {
    const query = typeof task.input === 'string'
      ? { topic: task.input }
      : task.input as ResearchQuery;

    return this.research(query);
  }
}
