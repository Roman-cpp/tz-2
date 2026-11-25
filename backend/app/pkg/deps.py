from typing import Annotated

from fastapi import Depends, Request

from app.providers.ktemulator import KTEmulator


def get_kt(request: Request) -> KTEmulator:
    """Клиент Keitaro, созданный один раз в lifespan приложения."""
    return request.app.state.kt


KtDep = Annotated[KTEmulator, Depends(get_kt)]
