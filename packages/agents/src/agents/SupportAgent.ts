/**
 * SupportAgent - Customer support automation
 */

import { LLMAgent, LLMAgentOptions, ChatMessage } from '../base/LLMAgent';
import { TaskContext } from '../base/BaseAgent';

export interface SupportTicket {
  message: string;
  userId?: string;
  context?: string;
  history?: ChatMessage[];
}

export interface SupportResponse {
  response: string;
  category: 'question' | 'complaint' | 'request' | 'feedback';
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestedActions?: string[];
  escalate?: boolean;
}

export class SupportAgent extends LLMAgent {
  constructor(options?: Partial<LLMAgentOptions>) {
    super({
      id: options?.id || 'support-agent',
      name: options?.name || 'Support Agent',
      description: 'Customer support automation agent',
      config: {
        model: 'deepseek-chat',
        temperature: 0.5,
        systemPrompt: `You are a helpful customer support agent. Be:
- Professional and empathetic
- Clear and concise
- Solution-oriented

Analyze each message and provide:
1. Helpful response
2. Category (question/complaint/request/feedback)
3. Sentiment (positive/neutral/negative)
4. Suggested actions if needed
5. Whether to escalate to human

Respond in JSON format.`,
        ...options?.config
      },
      ...options
    });
  }

  async handleTicket(ticket: SupportTicket): Promise<SupportResponse> {
    const messages: ChatMessage[] = ticket.history || [];

    if (ticket.context) {
      messages.unshift({ role: 'system', content: `Context: ${ticket.context}` });
    }

    messages.push({ role: 'user', content: ticket.message });

    const prompt = `Customer message: "${ticket.message}"

Analyze and respond in JSON:
{
  "response": "Your helpful response...",
  "category": "question|complaint|request|feedback",
  "sentiment": "positive|neutral|negative",
  "suggestedActions": ["action1", "action2"],
  "escalate": false
}`;

    return this.chatJSON<SupportResponse>([{ role: 'user', content: prompt }]);
  }

  protected async execute(task: TaskContext): Promise<SupportResponse> {
    const ticket = typeof task.input === 'string'
      ? { message: task.input }
      : task.input as SupportTicket;

    return this.handleTicket(ticket);
  }
}
