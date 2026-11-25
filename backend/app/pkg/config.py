from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Настройки приложения из переменных окружения (префикс KT_)."""

    model_config = SettingsConfigDict(
        env_prefix="KT_",
        # Локальный запуск из backend/ и из корня репозитория.
        env_file=(".env", "../.env"),
        extra="ignore",
    )

    base_url: str = "https://keitaro-for-tests.etolegko.com/admin_api/v1"
    api_key: str
    timeout: float = 10.0


@lru_cache
def get_settings() -> Settings:
    return Settings()
