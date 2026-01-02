/**
 * Utility functions
 */

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function retry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e as Error;
      if (i < maxRetries - 1) await sleep(delay * Math.pow(2, i));
    }
  }
  throw lastError!;
}

export const generateId = (prefix = '') =>
  `${prefix}${prefix ? '_' : ''}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;

export const isEmpty = (v: unknown): boolean =>
  v == null || (typeof v === 'string' && !v.trim()) ||
  (Array.isArray(v) && !v.length) || (typeof v === 'object' && !Object.keys(v).length);

export const parseINN = (inn: string) => {
  const clean = inn.replace(/\D/g, '');
  return {
    valid: clean.length === 10 || clean.length === 12,
    type: clean.length === 10 ? 'legal' : clean.length === 12 ? 'individual' : null
  };
};

export const formatBytes = (bytes: number) => {
  if (!bytes) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};
