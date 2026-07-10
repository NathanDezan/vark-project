from __future__ import annotations

from datetime import datetime, timezone

import pytest
from httpx import AsyncClient

from app.schemas.result import ModalityGuide, ResultPayload, ScoreBreakdown


def _payload(
    *,
    submission_id: str = "abc12345",
    profile: str = "Visual",
    scores: ScoreBreakdown | None = None,
    modalities: list[str] | None = None,
    guide: list[ModalityGuide] | None = None,
):
    if scores is None:
        scores = ScoreBreakdown(V=16, A=0, R=0, K=0)
    if modalities is None:
        modalities = ["V"]
    if guide is None:
        guide = [
            ModalityGuide(
                code="V",
                name="Visual",
                description="desc",
                strategies=["estratégia 1"],
            )
        ]

    return ResultPayload(
        id=submission_id,
        quiz="vark",
        scores=scores,
        profile=profile,
        modalities=modalities,
        guide=guide,
        created_at=datetime(2026, 7, 8, 12, 0, tzinfo=timezone.utc).isoformat(),
    )


@pytest.mark.asyncio
async def test_result_pdf_success_single_profile(client: AsyncClient):
    res = await client.post("/svc/api/result/pdf", json=_payload().model_dump())
    assert res.status_code == 200, res.text
    assert res.headers["content-type"].startswith("application/pdf")
    assert 'filename="resultado-vark-abc12345.pdf"' in res.headers["content-disposition"]
    assert res.content.startswith(b"%PDF")
    assert len(res.content) > 1000


@pytest.mark.asyncio
async def test_result_pdf_success_multimodal(client: AsyncClient):
    payload = _payload(
        profile="Multimodal",
        scores=ScoreBreakdown(V=4, A=4, R=0, K=0),
        modalities=["A", "V"],
        guide=[
            ModalityGuide(
                code="A",
                name="Auditivo",
                description="desc",
                strategies=["estratégia 1"],
            ),
            ModalityGuide(
                code="V",
                name="Visual",
                description="desc",
                strategies=["estratégia 1"],
            ),
        ],
    )
    res = await client.post("/svc/api/result/pdf", json=payload.model_dump())
    assert res.status_code == 200, res.text
    assert res.headers["content-type"].startswith("application/pdf")
    assert res.content.startswith(b"%PDF")
    assert len(res.content) > 1000


@pytest.mark.asyncio
async def test_result_pdf_invalid_payload_rejected(client: AsyncClient):
    res = await client.post("/svc/api/result/pdf", json={"id": "abc12345"})
    assert res.status_code == 422
