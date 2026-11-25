from app.pkg.deps import KtDep
from app.pkg.error import not_found_resource, upstream_error
from app.providers.ktemulator import ApiError
from app.providers.ktemulator.resources.offers import Offers
from app.services import offer


def index(api: KtDep) -> list[Offers]:
    try:
        return offer.get(api)
    except ApiError as error:
        if error.is_not_found:
            raise not_found_resource() from error
        raise upstream_error(str(error)) from error
