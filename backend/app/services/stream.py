from app.providers.ktemulator import KTEmulator
from app.providers.ktemulator.resources.streams import (
    OffersPremiere,
    Streams,
    StreamsPremiere,
)


def _to_premiere(api: KTEmulator, stream: Streams) -> StreamsPremiere:
    """Дотягивает имя каждого офера стрима через /offers/{id}."""
    offers = []

    for offer in stream.offers:
        found = api.offers.find(offer.id)
        offers.append(OffersPremiere(id=offer.id, name=found.name))

    return StreamsPremiere(id=stream.id, name=stream.name, offers=offers)


def get(api: KTEmulator, company_id: int) -> list[StreamsPremiere]:
    return [_to_premiere(api, stream) for stream in api.streams.all(company_id)]


def create(api: KTEmulator, company_id: int, name: str) -> Streams:
    return api.streams.create(name, company_id)


def update(api: KTEmulator, stream_id: int, name: str) -> None:
    api.streams.update(stream_id, name)


def delete(api: KTEmulator, stream_id: int) -> None:
    api.streams.delete(stream_id)
