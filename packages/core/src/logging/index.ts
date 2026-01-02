/**
 * Logging utilities
 */

import pino from 'pino';
import { getEnv, isDevelopment } from '../config';

export function createLogger(name = 'ai2o') {
  return pino({
    name,
    level: getEnv('LOG_LEVEL', 'info'),
    transport: isDevelopment() ? {
      target: 'pino-pretty',
      options: { colorize: true }
    } : undefined
  });
}

export const logger = createLogger();
