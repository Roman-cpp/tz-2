from collections import OrderedDict
from typing import Annotated

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import APIKeyHeader

from app.pkg.config import get_settings
from app.providers.ktemulator import KTEmulator

API_KEY_HEADER = "X-Api-Key"

# auto_error=False: свой текст ошибки вместо стандартного 403 от FastAPI
api_key_header = APIKeyHeader(name=API_KEY_HEADER, auto_error=False)


def _missing_key() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=f"Не передан ключ Keitaro в заголовке {API_KEY_HEADER}",
    )


class ClientPool:
    """Клиенты Keitaro по ключу: сессия с пулом соединений переиспользуется.

    Ключ входит в ключ кэша, поэтому у каждого пользователя свой клиент,
    а повторные запросы с тем же ключом не поднимают новое TLS-соединение.
    Ограничение размера не даёт копить клиентов бесконечно.
    """

    def __init__(self, max_clients: int = 32) -> None:
        self._max_clients = max_clients
        self._clients: OrderedDict[tuple[str, str, float], KTEmulator] = OrderedDict()

    def get(self, base_url: str, api_key: str, timeout: float) -> KTEmulator:
        cache_key = (base_url, api_key, timeout)

        client = self._clients.get(cache_key)
        if client is not None:
            self._clients.move_to_end(cache_key)
            return client

        # Вытесняем самый давний по использованию — им и закрываем сессию
        while len(self._clients) >= self._max_clients:
            _, evicted = self._clients.popitem(last=False)
            evicted.close()

        client = KTEmulator(base_url, api_key, timeout=timeout)
        self._clients[cache_key] = client
        return client

    def close(self) -> None:
        for client in self._clients.values():
            client.close()
        self._clients.clear()


def get_kt(
    request: Request,
    header_key: Annotated[str | None, Depends(api_key_header)],
) -> KTEmulator:
    """Клиент Keitaro под ключ из заголовка запроса.

    Ключ приходит только с клиента: серверного дефолта нет, поэтому
    запрос без заголовка — 401.
    """
    api_key = (header_key or "").strip()
    if not api_key:
        raise _missing_key()

    settings = get_settings()
    return request.app.state.kt_pool.get(settings.base_url, api_key, settings.timeout)


KtDep = Annotated[KTEmulator, Depends(get_kt)]
