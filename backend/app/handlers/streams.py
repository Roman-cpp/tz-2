from fastapi import Response

from app.pkg.deps import KtDep
from app.pkg.error import not_found_resource, upstream_error
from app.pkg.schemas import StreamCreate, StreamOffersUpdate
from app.providers.ktemulator import ApiError
from app.providers.ktemulator.resources.streams import Streams, StreamsPremiere
from app.services import stream


def _map_error(error: ApiError):
    """404 от Keitaro — ресурса нет; всё остальное — сбой внешнего API."""
    if error.is_not_found:
        raise not_found_resource() from error
    raise upstream_error(str(error)) from error


def index(company_id: int, api: KtDep) -> list[StreamsPremiere]:
    try:
        return stream.get(api, company_id)
    except ApiError as error:
        _map_error(error)


def find(stream_id: int, api: KtDep) -> StreamsPremiere:
    try:
        return stream.find(api, stream_id)
    except ApiError as error:
        _map_error(error)


def create(company_id: int, payload: StreamCreate, api: KtDep) -> Streams:
    try:
        return stream.create(api, company_id, payload.name)
    except ApiError as error:
        _map_error(error)


def update(stream_id: int, payload: StreamCreate, api: KtDep) -> Streams:
    try:
        stream.update(api, stream_id, payload.name)
    except ApiError as error:
        _map_error(error)
    return Streams(id=stream_id, name=payload.name)


def update_offers(stream_id: int, payload: StreamOffersUpdate, api: KtDep) -> StreamsPremiere:
    """Добавление и удаление оферов: клиент присылает итоговый набор."""
    try:
        return stream.update_offers(api, stream_id, payload.offer_ids)
    except ApiError as error:
        _map_error(error)


def delete(stream_id: int, api: KtDep) -> Response:
    try:
        stream.delete(api, stream_id)
    except ApiError as error:
        _map_error(error)
    return Response(status_code=204)
