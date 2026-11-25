# tz-2

Простое FastAPI-приложение. Запускается в Docker через Docker Compose, управление — через `Makefile`.

## Требования

- Docker с плагином Compose (`docker compose version`)
- GNU Make
- Для локального запуска без Docker: Python 3.14 и [uv](https://docs.astral.sh/uv/)

## Быстрый старт (Docker)

1. Создайте файл `.env` в корне проекта (он обязателен для команд Makefile) и заполните `KT_API_KEY`:

   ```bash
   cp .env.example .env
   $EDITOR .env
   ```

   Переменные: `KT_BASE_URL` (адрес Admin API Keitaro), `KT_API_KEY` (ключ, обязателен), `KT_TIMEOUT`.

2. Поднимите стек в фоне:

   ```bash
   make up
   ```

3. Приложение доступно на `http://localhost:8000`. Например:

   ```bash
   curl http://localhost:8000/companies
   # [{"id":1,"name":"..."}]
   ```

Документация Swagger UI: `http://localhost:8000/docs`.

## Фронтенд

React + Vite + TypeScript, архитектура [Feature-Sliced Design](https://feature-sliced.design/) (`frontend/src`: `app`, `pages`, `entities`, `shared`).

Страница `/` показывает список компаний и позволяет создавать, переименовывать и удалять их.
Backend отдаёт JSON-массив объектов `{"id": 1, "name": "..."}`:

| Метод | Путь | Что делает |
| --- | --- | --- |
| `GET` | `/companies` | список компаний |
| `POST` | `/companies` | создать (`{"name": "..."}`), 201 |
| `GET` | `/companies/{id}` | одна компания, 404 если нет |
| `PUT` | `/companies/{id}` | переименовать |
| `DELETE` | `/companies/{id}` | удалить, 204 |
| `GET` | `/companies/{id}/streams` | стримы компании |
| `POST` | `/companies/{id}/streams` | создать стрим (`{"name": "..."}`), 201 |
| `PUT` | `/streams/{id}` | переименовать стрим |
| `DELETE` | `/streams/{id}` | удалить стрим, 204 |
| `GET` | `/offers?search=` | оферы для автокомплита |

На фронте клик по компании открывает `/company/{id}` — карточку компании со списком стримов и кнопкой создания новой компании.

Работа с данными на фронте идёт через стор `useCompaniesStore` (`entities/company/store`) на TanStack Query — см. `docs/architecture/store/store.md`.

Запуск (нужен Node.js 20+ и запущенный backend на `:8000`):

```bash
cd frontend
npm install
npm run dev     # http://localhost:5173, запросы /companies проксируются на backend
```

Адрес backend можно переопределить: `VITE_BACKEND_URL=http://host:8000 npm run dev`.
