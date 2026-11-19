# tz-2

Простое FastAPI-приложение. Запускается в Docker через Docker Compose, управление — через `Makefile`.

## Требования

- Docker с плагином Compose (`docker compose version`)
- GNU Make
- Для локального запуска без Docker: Python 3.14 и [uv](https://docs.astral.sh/uv/)

## Быстрый старт (Docker)

1. Создайте файл `.env` в корне проекта (он обязателен для команд Makefile, даже если пустой):

   ```bash
   touch .env
   ```

2. Поднимите стек в фоне:

   ```bash
   make up
   ```

3. Приложение доступно на `http://localhost:8000`. Например:

   ```bash
   curl http://localhost:8000/
   # {"Hello":"World"}
   ```

Документация Swagger UI: `http://localhost:8000/docs`.
