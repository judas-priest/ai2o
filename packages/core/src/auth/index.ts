/**
 * Authentication utilities
 */

import axios from 'axios';
import { getEnv } from '../config';
import { logger } from '../logging';

export interface AuthResult {
  token: string;
  xsrf: string;
}

export async function authenticateIntegram(
  login: string,
  password: string,
  database = 'my',
  serverUrl = getEnv('INTEGRAM_URL', 'https://dronedoc.ru')
): Promise<AuthResult> {
  const url = `${serverUrl}/${database}/auth?JSON_KV`;

  const response = await axios.post(url,
    new URLSearchParams({ login, pwd: password }).toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  if (!response.data.token) {
    throw new Error('Authentication failed');
  }

  logger.info({ database }, 'Authenticated with Integram');
  return { token: response.data.token, xsrf: response.data._xsrf };
}

export const isValidToken = (token: string): boolean =>
  token?.startsWith('dd_tok_') || token?.startsWith('dd_sys_') || token?.split('.').length === 3;

export const createAuthHeader = (token: string) => ({
  'X-Authorization': token,
  'Authorization': `Bearer ${token}`
});
