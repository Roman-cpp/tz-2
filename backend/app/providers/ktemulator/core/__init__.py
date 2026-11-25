# myapi/core/__init__.py
from .client import BaseClient
from .exceptions import ApiError

__all__ = ["BaseClient", "ApiError"]