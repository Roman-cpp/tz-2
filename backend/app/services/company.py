from pydantic import BaseModel

from app.providers.ktemulator import KTEmulator
from app.providers.ktemulator.resources.companies import Companies
from app.providers.ktemulator.resources.streams import (
    StreamFilterInput,
    StreamOfferInput,
)

COUNTRY_FILTER = "country"

# Куда уводим трафик из указанных стран — мимо оферов.
DEFAULT_REDIRECT_URL = "https://www.google.com/"


class CompanyWithStreams(BaseModel):
    """Результат создания компании вместе со стримами.

    `redirect_stream_id` — первый стрим (фильтр страны → редирект),
    `fallback_stream_id` — второй (оферы для всех остальных).
    """

    company: Companies
    redirect_stream_id: int | None = None
    fallback_stream_id: int | None = None


def get(api: KTEmulator) -> list[Companies]:
    return api.companies.all()


def find(api: KTEmulator, company_id: int) -> Companies:
    return api.companies.find(company_id)


def create(api: KTEmulator, name: str) -> Companies:
    return api.companies.create(name)


def update(api: KTEmulator, company_id: int, name: str) -> None:
    api.companies.update(company_id, name)


def _stream_filters(country_codes: list[str]) -> list[StreamFilterInput]:
    """Фильтр страны: стрим принимает трафик только из перечисленных стран."""
    if not country_codes:
        return []
    return [StreamFilterInput(name=COUNTRY_FILTER, mode="accept", payload=country_codes)]


def create_with_streams(
    api: KTEmulator,
    name: str,
    country_codes: list[str],
    offer_ids: list[int],
    redirect_url: str = DEFAULT_REDIRECT_URL,
) -> CompanyWithStreams:
    """Создаёт компанию и два стрима под неё.

    Порядок важен: Keitaro обходит стримы по position, поэтому первый
    (с фильтром страны и редиректом) перехватывает трафик из указанных
    стран, а второй отдаёт всех остальных на оферы.

    Запросы идут последовательно: сначала кампания, затем стримы —
    им нужен campaign_id. Если второй стрим не создался, первый и
    кампания остаются: молча откатывать данные на внешнем сервисе
    не будем, клиент получит ошибку.
    """
    company = api.companies.create(name)

    redirect_stream_id: int | None = None
    fallback_stream_id: int | None = None

    filters = _stream_filters(country_codes)
    if filters:
        redirect_stream = api.streams.create(
            name=f"{name} — редирект по странам",
            company_id=company.id,
            filters=filters,
            action_payload=redirect_url,
        )
        redirect_stream_id = redirect_stream.id

    offers = [StreamOfferInput(offer_id=offer_id) for offer_id in offer_ids]
    if offers:
        fallback_stream = api.streams.create(
            name=f"{name} — оферы",
            company_id=company.id,
            offers=offers,
        )
        fallback_stream_id = fallback_stream.id

    return CompanyWithStreams(
        company=company,
        redirect_stream_id=redirect_stream_id,
        fallback_stream_id=fallback_stream_id,
    )
