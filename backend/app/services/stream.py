from app.providers.ktemulator import KTEmulator
from app.providers.ktemulator.resources.streams import (
    OffersPremiere,
    StreamOfferInput,
    Streams,
    StreamsPremiere,
)

COUNTRY_FILTER = "country"


def _to_premiere(api: KTEmulator, stream: Streams) -> StreamsPremiere:
    """Дотягивает имя каждого офера стрима через /offers/{id}."""
    offers = []

    for offer in stream.offers:
        found = api.offers.find(offer.id)
        offers.append(OffersPremiere(id=offer.id, name=found.name, share=offer.share))

    return StreamsPremiere(
        id=stream.id,
        name=stream.name,
        campaign_id=stream.campaign_id,
        position=stream.position,
        state=stream.state,
        created_at=stream.created_at,
        type=stream.type,
        action_type=stream.action_type,
        action_payload=stream.action_payload,
        schema_name=stream.schema_name,
        collect_clicks=stream.collect_clicks,
        filter_or=stream.filter_or,
        weight=stream.weight,
        offer_selection=stream.offer_selection,
        offers=offers,
        filters=stream.filters,
    )


def get(api: KTEmulator, company_id: int) -> list[StreamsPremiere]:
    return [_to_premiere(api, stream) for stream in api.streams.all(company_id)]


def find(api: KTEmulator, stream_id: int) -> StreamsPremiere:
    return _to_premiere(api, api.streams.find(stream_id))


def create(api: KTEmulator, company_id: int, name: str) -> Streams:
    return api.streams.create(name, company_id)


def update(api: KTEmulator, stream_id: int, name: str) -> None:
    api.streams.update(stream_id, name)


def update_offers(api: KTEmulator, stream_id: int, offer_ids: list[int]) -> StreamsPremiere:
    """Заменяет оферы потока и возвращает его актуальное состояние."""
    offers = [StreamOfferInput(offer_id=offer_id) for offer_id in offer_ids]
    updated = api.streams.update_offers(stream_id, offers)
    return _to_premiere(api, updated)


def delete(api: KTEmulator, stream_id: int) -> None:
    api.streams.delete(stream_id)
