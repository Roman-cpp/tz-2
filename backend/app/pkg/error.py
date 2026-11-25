from fastapi import HTTPException, status


def not_found_resource() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Запись не найдена",
    )


def upstream_error(detail: str) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_502_BAD_GATEWAY,
        detail=f"Ошибка Keitaro: {detail}",
    )
