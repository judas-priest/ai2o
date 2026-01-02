/**
 * ai2o telegram - Telegram bot
 */

import TelegramBot from 'node-telegram-bot-api';
import { logger, getEnv } from '@ai2o/core';
import { ResearchAgent, SupportAgent } from '@ai2o/agents';

const token = getEnv('TELEGRAM_BOT_TOKEN');

if (!token) {
  logger.error('TELEGRAM_BOT_TOKEN not set');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const researchAgent = new ResearchAgent();
const supportAgent = new SupportAgent();

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `Welcome to ai2o bot!

Available commands:
/research <topic> - Research a topic
/support <message> - Get support

Or just send any message to chat with AI.`);
});

bot.onText(/\/research (.+)/, async (msg, match) => {
  const topic = match?.[1];
  if (!topic) return;

  bot.sendMessage(msg.chat.id, `Researching "${topic}"...`);

  try {
    const result = await researchAgent.research({ topic });
    bot.sendMessage(msg.chat.id, `📊 Research Results:\n\n${result.summary}`);
  } catch (error) {
    bot.sendMessage(msg.chat.id, `Error: ${(error as Error).message}`);
  }
});

bot.on('message', async (msg) => {
  if (msg.text?.startsWith('/')) return;

  try {
    const result = await supportAgent.handleTicket({ message: msg.text || '' });
    bot.sendMessage(msg.chat.id, result.response);
  } catch (error) {
    bot.sendMessage(msg.chat.id, 'Sorry, something went wrong.');
  }
});

logger.info('ai2o Telegram bot started');
