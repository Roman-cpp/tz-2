# tz-2

Простое FastAPI-приложение. Запускается в Docker через Docker Compose, управление — через `Makefile`.

## Требования

- Docker с плагином Compose (`docker compose version`)
- GNU Make
- Для локального запуска без Docker: Python 3.14 и [uv](https://docs.astral.sh/uv/)

## Быстрый старт (Docker)

1. Создайте файл `.env` в корне проекта (он обязателен для команд Makefile):

   ```bash
   cp .env.example .env
   $EDITOR .env
   ```

   Переменные: `KT_BASE_URL` (адрес Admin API Keitaro), `KT_TIMEOUT`.

2. Поднимите стек в фоне:

   ```bash
   make up
   ```

3. Приложение доступно на `http://localhost:8000`. Ключ Keitaro передаётся заголовком:

   ```bash
   curl -H "X-Api-Key: <ключ>" http://localhost:8000/companies
   # [{"id":1,"name":"..."}]
   ```

Документация Swagger UI: `http://localhost:8000/docs`.
