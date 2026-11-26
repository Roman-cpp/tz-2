from app.providers.ktemulator import KTEmulator
from app.providers.ktemulator.resources.offers import Offers


def get(api: KTEmulator) -> list[Offers]:
    return api.offers.all()
