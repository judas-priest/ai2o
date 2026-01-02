/**
 * Configuration management
 */

import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  API_URL: z.string().url().optional(),
  INTEGRAM_URL: z.string().url().default('https://dronedoc.ru'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error']).default('info'),
  DEEPSEEK_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;

export function loadConfig(): Config {
  const result = configSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Config validation failed:', result.error.format());
    throw new Error('Invalid configuration');
  }
  return result.data;
}

export const getEnv = (key: string, defaultValue = ''): string =>
  process.env[key] ?? defaultValue;

export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';
