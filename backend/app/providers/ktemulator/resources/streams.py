from pydantic import BaseModel, ConfigDict, Field


class StreamOffers(BaseModel):
    """Офер в составе стрима: Keitaro отдаёт ссылку с id и статусом, без имени."""

    # Keitaro присылает offer_id, но в коде модель удобнее собирать по id
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(alias="offer_id")


class Streams(BaseModel):
    id: int
    name: str
    offers: list[StreamOffers] = []


class OffersPremiere(BaseModel):
    """Офер, обогащённый именем из /offers/{id}."""

    id: int
    name: str


class StreamsPremiere(BaseModel):
    id: int
    name: str
    offers: list[OffersPremiere] = []


class StreamsApi:
    def __init__(self, client):
        self._c = client          # общий клиент

    def all(self, company_id: int) -> list[Streams]:
        """Стримы кампании: Keitaro отдаёт их вложенно в кампанию."""
        data = self._c.request("GET", f"/campaigns/{company_id}/streams") or []
        return [Streams(**item) for item in data]

    def find(self, stream_id: int) -> Streams:
        return Streams(**(self._c.request("GET", f"/streams/{stream_id}") or {}))

    def create(self, name: str, company_id: int) -> Streams:
        """Создаёт стрим. Keitaro отвечает {"id": ...}, иногда с name."""
        created = self._c.request("POST", "/streams", json={"name": name, "campaign_id": company_id}) or {}
        if isinstance(created, list):
            created = created[0] if created else {}
        created.setdefault("name", name)
        return Streams(**created)

    def update(self, stream_id: int, name: str) -> None:
        self._c.request("PUT", f"/streams/{stream_id}", json={"name": name})

    def delete(self, stream_id: int) -> None:
        self._c.request("DELETE", f"/streams/{stream_id}")
