/**
 * BaseAgent - Base class for all ai2o agents
 */

import { EventEmitter } from 'events';
import type { Agent, AgentConfig, AgentMessage } from '@ai2o/core';

export interface TaskContext {
  id: string;
  type: string;
  input: unknown;
  messages?: AgentMessage[];
  metadata?: Record<string, unknown>;
}

export interface TaskResult {
  success: boolean;
  output: unknown;
  error?: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  duration?: number;
}

export interface AgentOptions {
  id: string;
  name: string;
  description?: string;
  config?: Partial<AgentConfig>;
}

export class BaseAgent extends EventEmitter {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  protected config: AgentConfig;
  protected status: 'idle' | 'processing' | 'error' = 'idle';
  protected memory = new Map<string, unknown>();

  constructor(options: AgentOptions) {
    super();
    this.id = options.id;
    this.name = options.name;
    this.description = options.description || '';
    this.config = {
      model: 'deepseek-chat',
      temperature: 0.7,
      maxTokens: 4096,
      ...options.config
    };
  }

  async initialize(): Promise<void> {
    this.emit('initialized', { agentId: this.id });
  }

  async processTask(task: TaskContext): Promise<TaskResult> {
    if (this.status === 'processing') {
      throw new Error('Agent is already processing');
    }

    const start = Date.now();
    this.status = 'processing';
    this.emit('task:started', { agentId: this.id, taskId: task.id });

    try {
      const output = await this.execute(task);
      const result: TaskResult = { success: true, output, duration: Date.now() - start };
      this.emit('task:completed', { agentId: this.id, taskId: task.id, result });
      return result;
    } catch (e) {
      const error = e as Error;
      this.status = 'error';
      return { success: false, output: null, error: error.message, duration: Date.now() - start };
    } finally {
      this.status = 'idle';
    }
  }

  protected async execute(task: TaskContext): Promise<unknown> {
    throw new Error('execute() must be implemented');
  }

  getStatus() { return this.status; }

  getInfo(): Agent {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: 'custom',
      status: this.status === 'processing' ? 'active' : 'inactive',
      config: this.config
    };
  }

  async shutdown(): Promise<void> {
    this.memory.clear();
    this.removeAllListeners();
  }
}
