/**
 * LLMAgent - Agent with LLM integration
 */

import OpenAI from 'openai';
import { BaseAgent, AgentOptions, TaskContext } from './BaseAgent';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMAgentOptions extends AgentOptions {
  apiKey?: string;
  baseURL?: string;
  provider?: 'deepseek' | 'openai' | 'together';
}

export class LLMAgent extends BaseAgent {
  protected client: OpenAI;
  protected systemPrompt: string;

  constructor(options: LLMAgentOptions) {
    super(options);
    this.systemPrompt = options.config?.systemPrompt || `You are ${this.name}. ${this.description}`;

    const baseURLs: Record<string, string> = {
      deepseek: 'https://api.deepseek.com/v1',
      openai: 'https://api.openai.com/v1',
      together: 'https://api.together.xyz/v1'
    };

    this.client = new OpenAI({
      apiKey: options.apiKey || process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY,
      baseURL: options.baseURL || baseURLs[options.provider || 'deepseek']
    });
  }

  async chat(messages: ChatMessage[], options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    jsonMode?: boolean;
  } = {}) {
    const fullMessages = messages[0]?.role === 'system'
      ? messages
      : [{ role: 'system' as const, content: this.systemPrompt }, ...messages];

    const response = await this.client.chat.completions.create({
      model: options.model || this.config.model,
      messages: fullMessages,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.maxTokens ?? this.config.maxTokens,
      ...(options.jsonMode && { response_format: { type: 'json_object' } })
    });

    const choice = response.choices[0];
    return {
      content: choice.message.content || '',
      usage: response.usage ? {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      } : undefined
    };
  }

  async chatJSON<T>(messages: ChatMessage[]): Promise<T> {
    const response = await this.chat(messages, { jsonMode: true });
    return JSON.parse(response.content);
  }

  protected async execute(task: TaskContext) {
    const messages: ChatMessage[] = typeof task.input === 'string'
      ? [{ role: 'user', content: task.input }]
      : (task.messages || []).map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    return this.chat(messages);
  }
}
