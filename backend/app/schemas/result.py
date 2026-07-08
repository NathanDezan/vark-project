from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.questions import Modality


class ScoreBreakdown(BaseModel):
    V: int = Field(ge=0, le=16)
    A: int = Field(ge=0, le=16)
    R: int = Field(ge=0, le=16)
    K: int = Field(ge=0, le=16)


class ModalityGuide(BaseModel):
    code: Modality
    name: str
    description: str
    strategies: list[str]


class ResultPayload(BaseModel):
    id: str
    quiz: Literal["vark"] = "vark"
    scores: ScoreBreakdown
    profile: str
    modalities: list[Modality]
    guide: list[ModalityGuide]
    created_at: str
