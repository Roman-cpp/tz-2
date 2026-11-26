from fastapi import Response

from app.pkg.deps import KtDep
from app.pkg.error import not_found_resource, upstream_error
from app.pkg.schemas import CompanyCreate, CompanyWithStream as CompanyWithStreamCreate
from app.providers.ktemulator import ApiError
from app.providers.ktemulator.resources.companies import Companies
from app.services import company
from app.services.company import CompanyWithStream


def _map_error(error: ApiError):
    """404 от Keitaro — ресурса нет; всё остальное — сбой внешнего API."""
    if error.is_not_found:
        raise not_found_resource() from error
    raise upstream_error(str(error)) from error


def index(api: KtDep) -> list[Companies]:
    try:
        return company.get(api)
    except ApiError as error:
        _map_error(error)


def find(company_id: int, api: KtDep) -> Companies:
    try:
        return company.find(api, company_id)
    except ApiError as error:
        _map_error(error)


def create(payload: CompanyWithStreamCreate, api: KtDep) -> CompanyWithStream:
    """Компания + первый стрим: имя, коды стран и оферы в одном запросе."""
    try:
        return company.create_with_stream(
            api,
            payload.name,
            payload.country_codes,
            payload.offer_ids,
        )
    except ApiError as error:
        _map_error(error)


def update(company_id: int, payload: CompanyCreate, api: KtDep) -> Companies:
    try:
        company.update(api, company_id, payload.name)
    except ApiError as error:
        _map_error(error)
    return Companies(id=company_id, name=payload.name)


def delete(company_id: int, api: KtDep) -> Response:
    try:
        api.companies.delete(company_id)
    except ApiError as error:
        _map_error(error)
    return Response(status_code=204)
