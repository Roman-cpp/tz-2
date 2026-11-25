from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.pkg.config import get_settings
from app.providers.ktemulator import KTEmulator
from app.routes import register


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    app.state.kt = KTEmulator(settings.base_url, settings.api_key, timeout=settings.timeout)
    try:
        yield
    finally:
        app.state.kt.close()


app = FastAPI(lifespan=lifespan)
register(app)
