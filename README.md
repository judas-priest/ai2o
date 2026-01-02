# ai2o

AI-платформа для OSINT и автоматизации бизнеса.

**Домен**: [ai2o.ru](https://ai2o.ru)

## Что это

ai2o — модульная платформа, объединяющая:

- **OSINT-инструменты** — данные о компаниях (ЕГРЮЛ), судебные дела (ФССП), тендеры
- **AI-агенты** — 50+ специализированных агентов для исследований, поддержки, продаж
- **Автоматизация** — обработка документов, аналитика, интеграции

## Структура

```
ai2o/
├── packages/
│   ├── core/           # @ai2o/core — общие утилиты
│   ├── agents/         # @ai2o/agents — движок AI-агентов
│   ├── osint/          # @ai2o/osint — парсеры ОСИНТ
│   └── api/            # @ai2o/api — Express.js бэкенд
├── apps/
│   ├── web/            # Vue 3 фронтенд
│   └── telegram/       # Telegram бот
├── docs/               # Документация
└── deploy/             # Docker, CI/CD
```

## Быстрый старт

```bash
# Клонировать
git clone https://github.com/unidel2035/ai2o.git
cd ai2o

# Установить зависимости
pnpm install

# Разработка
pnpm dev

# Сборка
pnpm build

# Тесты
pnpm test
```

## Пакеты

| Пакет | Описание |
|-------|----------|
| `@ai2o/core` | Утилиты, типы, логирование, авторизация |
| `@ai2o/agents` | AI-агенты: Research, Support, OSINT и др. |
| `@ai2o/osint` | Парсеры: ЕГРЮЛ, ФССП, Торги |
| `@ai2o/api` | REST API на Express.js |

## Приложения

| Приложение | Описание |
|------------|----------|
| web | Vue 3 SPA — основной интерфейс |
| telegram | Telegram бот с AI |

## Стек

- **Runtime**: Node.js 18+, Bun
- **Язык**: TypeScript
- **Фронтенд**: Vue 3, Pinia, PrimeVue
- **Бэкенд**: Express.js
- **AI**: DeepSeek, OpenAI, Anthropic
- **БД**: Integram (через MCP)
- **Сборка**: pnpm workspaces, tsup, Vite

## Команды

```bash
# Запустить конкретный пакет
pnpm --filter @ai2o/core dev

# Запустить приложение
pnpm --filter web dev

# Добавить зависимость в пакет
pnpm --filter @ai2o/agents add openai

# Сборка всех пакетов
pnpm build

# Проверка типов
pnpm typecheck
```

## Связанные проекты

- [integram-standalone](https://github.com/unidel2035/integram-standalone) — платформа БД
- [dronedoc2025](https://github.com/unidel2035/dronedoc2025) — оригинальный монолит (legacy)

## Лицензия

MIT
