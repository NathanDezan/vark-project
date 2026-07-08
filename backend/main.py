from datetime import datetime, timezone

from fastapi import FastAPI

app = FastAPI(
    title="Vite + FastAPI Boilerplate",
    description="Minimal FastAPI backend mounted at /svc/api on Vercel Services",
    version="0.1.0",
)


@app.get("/svc/api/status")
def get_status():
    return {
        "service": "backend",
        "framework": "fastapi",
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
