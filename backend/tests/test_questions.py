from __future__ import annotations

import pytest
from httpx import AsyncClient


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
