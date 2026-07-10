from __future__ import annotations

import pytest
from httpx import AsyncClient

from main import app


@app.get("/_boom")
def boom() -> None:
    raise RuntimeError("boom")


@pytest.mark.asyncio
async def test_unhandled_exception_handler(client: AsyncClient):
    res = await client.get("/_boom")
    assert res.status_code == 500
    body = res.json()
    assert body["detail"] == "Erro interno. Tente novamente em alguns instantes."
    assert body["path"] == "/_boom"
