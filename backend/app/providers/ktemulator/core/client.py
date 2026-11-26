import requests
from requests.adapters import HTTPAdapter

from .exceptions import ApiError


class BaseClient:
    def __init__(self, base_url: str, key: str, timeout: float = 10):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.session = requests.Session()
        self.session.headers["Api-Key"] = f"{key}"
        # Хендлеры синхронные и выполняются в threadpool, поэтому один Session
        # используется из нескольких потоков: держим пул соединений больше
        # дефолтных 10.
        self.session.mount("https://", HTTPAdapter(pool_connections=10, pool_maxsize=50))
        self.session.mount("http://", HTTPAdapter(pool_connections=10, pool_maxsize=50))

    def request(self, method: str, path: str, **kwargs):
        url = f"{self.base_url}/{path.lstrip('/')}"
        try:
            resp = self.session.request(method, url, timeout=self.timeout, **kwargs)
            resp.raise_for_status()
        except requests.HTTPError as e:
            raise ApiError(
                f"{method} {url} -> {e.response.status_code}: {e.response.text}",
                status=e.response.status_code,
            ) from e
        except requests.RequestException as e:
            raise ApiError(f"{method} {url} -> ошибка сети: {e}") from e
        return resp.json() if resp.content else None

    def close(self) -> None:
        self.session.close()
