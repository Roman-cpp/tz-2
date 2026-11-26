from pydantic import BaseModel, Field, field_validator


def _strip_required_name(value: str) -> str:
    name = value.strip()
    if not name:
        raise ValueError("Название не может быть пустым")
    if len(name) > 255:
        raise ValueError("Название длиннее 255 символов")
    return name


COUNTRY_CODE_LENGTH = 2
MAX_COUNTRY_CODES = 250


def _normalize_countries(values: list[str]) -> list[str]:
    """Коды стран — ISO 3166-1 alpha-2; приводим к верхнему регистру и убираем дубли."""
    result: list[str] = []
    seen: set[str] = set()

    for value in values:
        code = value.strip().upper()
        if not code:
            continue
        if len(code) != COUNTRY_CODE_LENGTH or not code.isalpha() or not code.isascii():
            raise ValueError(f"Код страны должен состоять из двух латинских букв: {value!r}")
        if code in seen:
            continue
        seen.add(code)
        result.append(code)

    if len(result) > MAX_COUNTRY_CODES:
        raise ValueError(f"Слишком много кодов стран: максимум {MAX_COUNTRY_CODES}")

    return result


class CompanyCreate(BaseModel):
    name: str = ...

    @field_validator("name")
    @classmethod
    def strip_and_require_name(cls, value: str) -> str:
        return _strip_required_name(value)


class CompanyWithStreams(BaseModel):
    """Создание компании вместе с двумя стримами.

    Компания и стримы создаются последовательными запросами к Keitaro:
    кампания, затем стрим с фильтром страны (редирект) и стрим с оферами.
    """

    name: str = ...
    country_codes: list[str] = Field(default_factory=list)
    offer_ids: list[int] = Field(default_factory=list)

    @field_validator("name")
    @classmethod
    def strip_and_require_name(cls, value: str) -> str:
        return _strip_required_name(value)

    @field_validator("country_codes")
    @classmethod
    def normalize_country_codes(cls, value: list[str]) -> list[str]:
        return _normalize_countries(value)

    @field_validator("offer_ids")
    @classmethod
    def unique_offer_ids(cls, value: list[int]) -> list[int]:
        # Порядок важен: Keitaro распределяет share в порядке добавления
        return list(dict.fromkeys(value))


class StreamCreate(BaseModel):
    name: str = ...

    @field_validator("name")
    @classmethod
    def strip_and_require_name(cls, value: str) -> str:
        return _strip_required_name(value)


class StreamOffersUpdate(BaseModel):
    """Новый набор оферов потока: полный список, пустой — снять все."""

    offer_ids: list[int] = Field(default_factory=list)

    @field_validator("offer_ids")
    @classmethod
    def unique_offer_ids(cls, value: list[int]) -> list[int]:
        return list(dict.fromkeys(value))
