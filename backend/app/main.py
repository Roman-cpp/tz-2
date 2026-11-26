from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.pkg.deps import ClientPool
from app.routes import register


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Клиенты Keitaro создаются под ключ из заголовка запроса, а не один раз:
    # пул переиспользует их сессии и закрывает все при остановке приложения.
    app.state.kt_pool = ClientPool()
    try:
        yield
    finally:
        app.state.kt_pool.close()


app = FastAPI(lifespan=lifespan)
register(app)
