from pydantic import BaseModel


class Companies(BaseModel):
    id: int
    name: str


class CompaniesApi:
    def __init__(self, client):
        self._c = client          # общий клиент

    def all(self) -> list[Companies]:
        data = self._c.request("GET", "/campaigns") or []
        return [Companies(**item) for item in data]

    def find(self, company_id: int) -> Companies:
        return Companies(**(self._c.request("GET", f"/campaigns/{company_id}") or {}))

    def create(self, name: str) -> Companies:
        """Создаёт кампанию. Keitaro отвечает {"id": ...}, иногда с name."""
        created = self._c.request("POST", "/campaigns", json={"name": name}) or {}
        if isinstance(created, list):
            created = created[0] if created else {}
        created.setdefault("name", name)
        return Companies(**created)

    def update(self, company_id: int, name: str) -> None:
        self._c.request("PUT", f"/campaigns/{company_id}", json={"name": name})

    def delete(self, company_id: int) -> None:
        self._c.request("DELETE", f"/campaigns/{company_id}")
