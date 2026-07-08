from __future__ import annotations

from collections.abc import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from main import app


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def valid_answers_all_v() -> list[dict[str, str]]:
    return [{"questionId": q, "choice": "V"} for q in range(1, 17)]


@pytest.fixture
def valid_answers_mixed() -> list[dict[str, str]]:
    pattern = ["V", "A", "R", "K"]
    return [{"questionId": q, "choice": pattern[(q - 1) % 4]} for q in range(1, 17)]
