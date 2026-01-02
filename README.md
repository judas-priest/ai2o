# ai2o

AI-powered OSINT and productivity platform for organizations.

**Domain**: [ai2o.ru](https://ai2o.ru)

## Overview

ai2o is a modular platform that combines:

- **OSINT Tools** - Company data from EGRUL, court cases from FSSP, tender monitoring
- **AI Agents** - 50+ specialized agents for research, support, sales, and more
- **Productivity** - Task automation, document processing, analytics

## Monorepo Structure

```
ai2o/
├── packages/
│   ├── core/           # @ai2o/core - shared utilities
│   ├── agents/         # @ai2o/agents - AI agent engine
│   ├── osint/          # @ai2o/osint - OSINT parsers
│   └── api/            # @ai2o/api - Express.js backend
├── apps/
│   ├── web/            # Vue 3 frontend
│   └── telegram/       # Telegram bot
├── docs/               # Documentation
└── deploy/             # Docker, CI/CD
```

## Quick Start

```bash
# Clone
git clone https://github.com/judas-priest/ai2o.git
cd ai2o

# Install dependencies
pnpm install

# Development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
```

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| `@ai2o/core` | Shared utilities, types, logging | ✅ |
| `@ai2o/agents` | AI Agent engine (50+ agents) | ✅ |
| `@ai2o/osint` | OSINT tools (EGRUL, FSSP, Torgi) | ✅ |
| `@ai2o/api` | Express.js API Gateway | ✅ |

## Apps

| App | Description | URL |
|-----|-------------|-----|
| Web | Vue 3 frontend | https://ai2o.ru |
| Telegram | AI bot | @ai2o_bot |

## Technology Stack

- **Runtime**: Node.js 18+, Bun
- **Language**: TypeScript
- **Frontend**: Vue 3, Pinia, PrimeVue
- **Backend**: Express.js
- **AI**: DeepSeek, OpenAI, Anthropic
- **Database**: Integram (via MCP)
- **Build**: pnpm, tsup, Vite

## Development

```bash
# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install

# Run specific package
pnpm --filter @ai2o/core dev

# Run specific app
pnpm --filter web dev

# Add dependency to package
pnpm --filter @ai2o/agents add openai
```

## Related Projects

- [integram-standalone](https://github.com/unidel2035/integram-standalone) - Database platform
- [dronedoc2025](https://github.com/unidel2035/dronedoc2025) - Original monolith (legacy)

## License

MIT
