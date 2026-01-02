/**
 * Shared types
 */

// API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// User
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
}

// Agent
export interface Agent {
  id: string;
  name: string;
  description: string;
  type: 'research' | 'support' | 'sales' | 'analysis' | 'code' | 'hr' | 'custom';
  status: 'active' | 'inactive' | 'error';
  config: AgentConfig;
}

export interface AgentConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

// OSINT
export interface Organization {
  inn: string;
  ogrn?: string;
  name: string;
  shortName?: string;
  address?: string;
  status: 'active' | 'liquidated' | 'reorganizing';
  director?: string;
}

export interface FSSPCase {
  id: string;
  caseNumber: string;
  debtorName: string;
  amount: number;
  status: string;
}

// AI Token
export interface AIToken {
  id: string;
  userId: number;
  provider: 'deepseek' | 'openai' | 'anthropic';
  model: string;
  limits: { daily: number; monthly: number };
  usage: { daily: number; monthly: number };
}

// Errors
export class AI2OError extends Error {
  constructor(message: string, public code: string, public statusCode = 500) {
    super(message);
    this.name = 'AI2OError';
  }
}

export class ValidationError extends AI2OError {
  constructor(message: string) { super(message, 'VALIDATION_ERROR', 400); }
}

export class AuthError extends AI2OError {
  constructor(message = 'Authentication required') { super(message, 'AUTH_ERROR', 401); }
}

export class NotFoundError extends AI2OError {
  constructor(resource: string) { super(`${resource} not found`, 'NOT_FOUND', 404); }
}
