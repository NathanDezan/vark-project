from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

router = APIRouter(prefix="/svc/api", tags=["health"])


@router.get("/status")
def get_status() -> dict[str, str]:
    return {
        "service": "vark-backend",
        "framework": "fastapi",
        "status": "ok",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok"}
