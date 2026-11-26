class ApiError(Exception):
    """Ошибка обращения к Keitaro. status — HTTP-код upstream, если он был."""

    def __init__(self, message: str, status: int | None = None) -> None:
        super().__init__(message)
        self.status = status

    @property
    def is_not_found(self) -> bool:
        return self.status == 404
