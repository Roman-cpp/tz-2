from pydantic import BaseModel


class Offers(BaseModel):
    id: int
    name: str


class OffersApi:
    def __init__(self, client):
        self._c = client          # общий клиент

    def all(self) -> list[Offers]:
        """Список оферов. search — подстрока имени, фильтруется на стороне Keitaro."""
        data = self._c.request("GET", "/offers") or []
        return [Offers(**item) for item in data]

    def find(self, offer_id: int) -> Offers:
        return Offers(**(self._c.request("GET", f"/offers/{offer_id}") or {}))
