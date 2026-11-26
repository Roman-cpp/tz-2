from .core import BaseClient, ApiError
from .resources.companies import CompaniesApi
from .resources.offers import OffersApi
from .resources.streams import StreamsApi


class KTEmulator(BaseClient):
    def __init__(self, base_url: str, key: str, **kwargs):
        super().__init__(base_url, key, **kwargs)
        self.companies = CompaniesApi(self)
        self.streams = StreamsApi(self)
        self.offers = OffersApi(self)


__all__ = ["KTEmulator", "ApiError"]
