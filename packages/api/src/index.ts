/**
 * @ai2o/api - Express.js API Gateway
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { logger, loadConfig } from '@ai2o/core';
import { ResearchAgent, SupportAgent, OSINTAgent } from '@ai2o/agents';
import { organizationService } from '@ai2o/osint';

const config = loadConfig();
const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Agents
const researchAgent = new ResearchAgent();
const supportAgent = new SupportAgent();
const osintAgent = new OSINTAgent();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

app.post('/api/agents/research', async (req, res) => {
  try {
    const result = await researchAgent.research(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/agents/support', async (req, res) => {
  try {
    const result = await supportAgent.handleTicket(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.post('/api/osint/investigate', async (req, res) => {
  try {
    const result = await osintAgent.investigate(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

app.get('/api/osint/company/:inn', async (req, res) => {
  try {
    const result = await organizationService.getReport(req.params.inn);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Start server
const port = config.PORT;
app.listen(port, () => {
  logger.info({ port }, 'ai2o API started');
});

export default app;
