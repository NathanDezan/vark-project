from __future__ import annotations

import os
from collections.abc import AsyncGenerator

os.environ["DEBUG"] = "false"

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from main import app


@pytest_asyncio.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app, raise_app_exceptions=False)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def valid_answers_all_v() -> list[dict[str, str]]:
    return [{"questionId": q, "choice": "V"} for q in range(1, 17)]


@pytest.fixture
def valid_answers_mixed() -> list[dict[str, str]]:
    pattern = ["V", "A", "R", "K"]
    return [{"questionId": q, "choice": pattern[(q - 1) % 4]} for q in range(1, 17)]
