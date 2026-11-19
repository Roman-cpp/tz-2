import uvicorn

def main() -> None:
    uvicorn.run("tz_2.main:app", host="127.0.0.1", port=8000, reload=True)
