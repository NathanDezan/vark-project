from __future__ import annotations

from datetime import datetime, timezone

import pytest
from httpx import AsyncClient


def _payload(answers, submission_id="abc12345", created_at=None):
    if created_at is None:
        created_at = datetime(2026, 7, 8, 12, 0, tzinfo=timezone.utc)
    return {
        "id": submission_id,
        "created_at": created_at.isoformat(),
        "quiz": "vark",
        "answers": answers,
    }


@pytest.mark.asyncio
async def test_score_success_all_visual(client: AsyncClient, valid_answers_all_v):
    res = await client.post("/svc/api/score", json=_payload(valid_answers_all_v))
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["id"] == "abc12345"
    assert body["created_at"].startswith("2026-07-08T12:00:00")
    assert body["scores"] == {"V": 16, "A": 0, "R": 0, "K": 0}
    assert body["profile"] == "Visual"
    assert body["modalities"] == ["V"]
    assert len(body["guide"]) == 1
    assert body["guide"][0]["code"] == "V"
    assert body["guide"][0]["name"] == "Visual"


@pytest.mark.asyncio
async def test_score_success_mixed_modalities(client: AsyncClient, valid_answers_mixed):
    res = await client.post("/svc/api/score", json=_payload(valid_answers_mixed))
    assert res.status_code == 200, res.text
    body = res.json()
    assert body["scores"] == {"V": 4, "A": 4, "R": 4, "K": 4}
    assert body["profile"] == "Multimodal"
    assert body["modalities"] == ["A", "K", "R", "V"]
    assert [guide["code"] for guide in body["guide"]] == ["A", "K", "R", "V"]


@pytest.mark.asyncio
async def test_score_missing_answers_rejected(client: AsyncClient, valid_answers_all_v):
    res = await client.post(
        "/svc/api/score", json=_payload(valid_answers_all_v[:8])
    )
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_score_invalid_question_id_rejected(client: AsyncClient):
    bad = [{"questionId": q, "choice": "V"} for q in range(1, 17)]
    bad[0] = {"questionId": 99, "choice": "V"}
    res = await client.post("/svc/api/score", json=_payload(bad))
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_score_invalid_modality_rejected(client: AsyncClient, valid_answers_all_v):
    bad = [dict(a) for a in valid_answers_all_v]
    bad[0] = {"questionId": 1, "choice": "X"}
    res = await client.post("/svc/api/score", json=_payload(bad))
    assert res.status_code == 422


@pytest.mark.asyncio
async def test_score_is_stateless(client: AsyncClient, valid_answers_all_v):
    first = await client.post(
        "/svc/api/score",
        json=_payload(valid_answers_all_v, submission_id="id-first"),
    )
    second = await client.post(
        "/svc/api/score",
        json=_payload(valid_answers_all_v, submission_id="id-second"),
    )
    assert first.status_code == 200
    assert second.status_code == 200
    assert first.json()["id"] == "id-first"
    assert second.json()["id"] == "id-second"
