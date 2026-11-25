from pydantic import BaseModel, field_validator


def _strip_required_name(value: str) -> str:
    name = value.strip()
    if not name:
        raise ValueError("Название не может быть пустым")
    if len(name) > 255:
        raise ValueError("Название длиннее 255 символов")
    return name


class CompanyCreate(BaseModel):
    name: str = ...

    @field_validator("name")
    @classmethod
    def strip_and_require_name(cls, value: str) -> str:
        return _strip_required_name(value)


class StreamCreate(BaseModel):
    name: str = ...

    @field_validator("name")
    @classmethod
    def strip_and_require_name(cls, value: str) -> str:
        return _strip_required_name(value)
