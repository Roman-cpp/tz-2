from pydantic import BaseModel, ConfigDict, Field


class StreamOffers(BaseModel):
    """Офер в составе стрима: Keitaro отдаёт ссылку с id, статусом и долей трафика."""

    # Keitaro присылает offer_id, но в коде модель удобнее собирать по id
    model_config = ConfigDict(populate_by_name=True)

    id: int = Field(alias="offer_id")
    # Доля трафика стрима в процентах, которую Keitaro распределяет между оферами
    share: int | None = None

class StreamFilter(BaseModel):
    id: int
    streamId: int = Field(alias="stream_id")
    name: str
    mode: str
    payload: list[str]
    oid: int

class Streams(BaseModel):
    id: int
    name: str
    campaign_id: int | None = None
    position: int | None = None
    state: str | None = None
    created_at: str | None = None
    type: str | None = None
    action_type: str | None = None
    action_payload: str | None = None
    # Keitaro зовёт поле "schema", но это имя метода BaseModel — держим алиасы
    schema_name: str | None = Field(
        default=None, validation_alias="schema", serialization_alias="schema"
    )
    collect_clicks: bool | None = None
    filter_or: bool | None = None
    weight: float | None = None
    offer_selection: str | None = None
    offers: list[StreamOffers] = []
    filters: list[StreamFilter] = []


class OffersPremiere(BaseModel):
    """Офер, обогащённый именем из /offers/{id}."""

    id: int
    name: str
    # Доля трафика стрима в процентах, которую Keitaro распределяет между оферами
    share: int | None = None


class StreamFilterInput(BaseModel):
    """Фильтр в теле запроса: Keitaro сам присвоит id и oid."""

    name: str
    mode: str = "accept"
    payload: list[str] = Field(default_factory=list)


class StreamOfferInput(BaseModel):
    """Офер в теле запроса: распределение share Keitaro считает сам."""

    offer_id: int


class StreamsPremiere(BaseModel):
    id: int
    name: str
    campaign_id: int | None = None
    position: int | None = None
    state: str | None = None
    created_at: str | None = None
    type: str | None = None
    action_type: str | None = None
    action_payload: str | None = None
    schema_name: str | None = None
    collect_clicks: bool | None = None
    filter_or: bool | None = None
    weight: float | None = None
    offer_selection: str | None = None
    offers: list[OffersPremiere] = []
    filters: list[StreamFilter] = []


class StreamsApi:
    def __init__(self, client):
        self._c = client          # общий клиент

    def all(self, company_id: int) -> list[Streams]:
        """Стримы кампании: Keitaro отдаёт их вложенно в кампанию."""
        data = self._c.request("GET", f"/campaigns/{company_id}/streams") or []
        return [Streams(**item) for item in data]

    def find(self, stream_id: int) -> Streams:
        """Один стрим целиком — со всеми полями для карточки потока."""
        return Streams(**(self._c.request("GET", f"/streams/{stream_id}") or {}))

    def create(
        self,
        name: str,
        company_id: int,
        filters: list[StreamFilterInput] | None = None,
        offers: list[StreamOfferInput] | None = None,
        action_payload: str | None = None,
    ) -> Streams:
        """Создаёт стрим сразу с фильтрами, оферами или редиректом — одним запросом.

        Пустые списки в тело не кладём: иначе схема остаётся "redirect"
        и оферы игнорируются. `action_payload` задаёт адрес редиректа
        для стрима без оферов.
        """
        body: dict = {"name": name, "campaign_id": company_id}
        if filters:
            body["filters"] = [item.model_dump() for item in filters]
        if offers:
            body["offers"] = [item.model_dump() for item in offers]
            # Схема "landings" — стрим распределяет трафик между оферами
            body["schema"] = "landings"
        elif action_payload:
            body["action_type"] = "http"
            body["action_payload"] = action_payload

        created = self._c.request("POST", "/streams", json=body) or {}
        if isinstance(created, list):
            created = created[0] if created else {}
        created.setdefault("name", name)
        return Streams(**created)

    def update(self, stream_id: int, name: str) -> None:
        self._c.request("PUT", f"/streams/{stream_id}", json={"name": name})

    def update_offers(self, stream_id: int, offers: list[StreamOfferInput]) -> Streams:
        """Заменяет набор оферов стрима.

        Keitaro принимает полный список: добавление, удаление и очистка —
        это один PUT. Пустой список снимает оферы и возвращает схему
        в "redirect", иначе стрим остался бы в "landings" без оферов.
        """
        body: dict = {"offers": [item.model_dump() for item in offers]}
        body["schema"] = "landings" if offers else "redirect"

        updated = self._c.request("PUT", f"/streams/{stream_id}", json=body) or {}
        return Streams(**updated)

    def delete(self, stream_id: int) -> None:
        self._c.request("DELETE", f"/streams/{stream_id}")
