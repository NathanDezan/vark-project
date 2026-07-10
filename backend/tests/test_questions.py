from __future__ import annotations

from pathlib import Path
from types import SimpleNamespace

import pytest
from httpx import AsyncClient

from app.config import get_settings
from main import app


@pytest.mark.asyncio
async def test_get_questions_returns_full_payload(client: AsyncClient):
    res = await client.get("/svc/api/questions")
    assert res.status_code == 200
    body = res.json()
    assert body["version"] == "8.01"
    assert body["scoring"]["type"] == "radio"
    assert body["scoring"]["totalQuestions"] == 16
    assert len(body["mapVarkLetter"]) == 64
    assert len(body["questions"]) == 16
    first = body["questions"][0]
    assert first["id"] == 1
    assert {o["value"] for o in first["options"]} == {"V", "A", "R", "K"}


@pytest.mark.asyncio
async def test_get_questions_missing_file_returns_500(client: AsyncClient):
    def override_settings():
        return SimpleNamespace(questions_file=Path("/tmp/does-not-exist.json"))

    app.dependency_overrides[get_settings] = override_settings
    try:
        res = await client.get("/svc/api/questions")
        assert res.status_code == 500
        assert res.json()["detail"] == "Arquivo de questões não encontrado."
    finally:
        app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_status_endpoint(client: AsyncClient):
    res = await client.get("/svc/api/status")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == "ok"
    assert body["service"] == "vark-backend"


@pytest.mark.asyncio
async def test_healthz_endpoint(client: AsyncClient):
    res = await client.get("/svc/api/healthz")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


@pytest.mark.asyncio
async def test_root_endpoint(client: AsyncClient):
    res = await client.get("/")
    assert res.status_code == 200
    body = res.json()
    assert "VARK" in body["service"]
