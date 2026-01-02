/**
 * OSINTAgent - Open Source Intelligence gathering
 */

import { LLMAgent, LLMAgentOptions } from '../base/LLMAgent';
import { TaskContext } from '../base/BaseAgent';
import type { Organization, FSSPCase } from '@ai2o/core';

export interface OSINTQuery {
  type: 'company' | 'person' | 'domain' | 'general';
  query: string;
  sources?: ('egrul' | 'fssp' | 'torgi' | 'web')[];
}

export interface OSINTResult {
  query: string;
  type: string;
  findings: {
    source: string;
    data: unknown;
    confidence: number;
  }[];
  summary: string;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export class OSINTAgent extends LLMAgent {
  constructor(options?: Partial<LLMAgentOptions>) {
    super({
      id: options?.id || 'osint-agent',
      name: options?.name || 'OSINT Agent',
      description: 'Open Source Intelligence gathering agent',
      config: {
        model: 'deepseek-chat',
        temperature: 0.2,
        systemPrompt: `You are an OSINT (Open Source Intelligence) analyst.

Your capabilities:
- Company analysis (EGRUL, financial reports)
- Court cases and legal issues (FSSP)
- Tender/procurement analysis
- General web intelligence

Provide structured, factual analysis with:
1. Key findings from each source
2. Risk assessment
3. Actionable recommendations

Always respond in JSON format.`,
        ...options?.config
      },
      ...options
    });
  }

  async investigate(query: OSINTQuery): Promise<OSINTResult> {
    const prompt = `OSINT Investigation Request:
Type: ${query.type}
Query: "${query.query}"
Sources to check: ${(query.sources || ['egrul', 'fssp', 'web']).join(', ')}

Provide analysis in JSON:
{
  "query": "${query.query}",
  "type": "${query.type}",
  "findings": [
    {"source": "egrul", "data": {...}, "confidence": 0.9}
  ],
  "summary": "Executive summary...",
  "riskLevel": "low|medium|high",
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    return this.chatJSON<OSINTResult>([{ role: 'user', content: prompt }]);
  }

  async analyzeCompany(inn: string): Promise<{
    company: Partial<Organization>;
    fsspCases: Partial<FSSPCase>[];
    riskLevel: string;
    summary: string;
  }> {
    const prompt = `Analyze Russian company with INN: ${inn}

Check:
1. EGRUL registration status
2. FSSP court cases and debts
3. Financial indicators
4. Risk factors

Respond in JSON:
{
  "company": {"inn": "${inn}", "name": "...", "status": "active|liquidated"},
  "fsspCases": [{"caseNumber": "...", "amount": 0}],
  "riskLevel": "low|medium|high",
  "summary": "..."
}`;

    return this.chatJSON([{ role: 'user', content: prompt }]);
  }

  protected async execute(task: TaskContext) {
    const query = typeof task.input === 'string'
      ? { type: 'general' as const, query: task.input }
      : task.input as OSINTQuery;

    return this.investigate(query);
  }
}
