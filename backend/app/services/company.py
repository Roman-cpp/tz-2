from app.providers.ktemulator import KTEmulator
from app.providers.ktemulator.resources.companies import Companies


def get(api: KTEmulator) -> list[Companies]:
    return api.companies.all()


def find(api: KTEmulator, company_id: int) -> Companies:
    return api.companies.find(company_id)


def create(api: KTEmulator, name: str) -> Companies:
    return api.companies.create(name)


def update(api: KTEmulator, company_id: int, name: str) -> None:
    api.companies.update(company_id, name)
