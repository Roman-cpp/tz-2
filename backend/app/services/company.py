from pydantic import BaseModel

from app.providers.ktemulator import KTEmulator
from app.providers.ktemulator.resources.companies import Companies
from app.providers.ktemulator.resources.streams import (
    StreamFilterInput,
    StreamOfferInput,
)

COUNTRY_FILTER = "country"


class CompanyWithStream(BaseModel):
    """Результат создания компании вместе с первым стримом."""

    company: Companies
    stream_id: int | None = None


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


def create_with_stream(
    api: KTEmulator,
    name: str,
    country_codes: list[str],
    offer_ids: list[int],
) -> CompanyWithStream:
    """Создаёт компанию, затем стрим с фильтром страны и оферами.

    Два запроса к Keitaro: кампания, потом стрим. Если стрим не создался,
    кампания остаётся — откатывать её молча не будем, но сообщим об ошибке.
    """
    company = api.companies.create(name)

    filters = _stream_filters(country_codes)
    offers = [StreamOfferInput(offer_id=offer_id) for offer_id in offer_ids]

    # Без фильтров и оферов стрим не нужен: пустой стрим только мешает кампании
    if not filters and not offers:
        return CompanyWithStream(company=company)

    stream = api.streams.create(name=name, company_id=company.id, filters=filters, offers=offers)
    return CompanyWithStream(company=company, stream_id=stream.id)
