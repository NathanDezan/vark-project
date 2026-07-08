from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field, field_validator

from app.schemas.questions import Modality


class AnswerEntry(BaseModel):
    questionId: int = Field(ge=1, le=16)
    choice: Modality


class ScoreRequest(BaseModel):
    id: str = Field(min_length=1, max_length=64)
    created_at: datetime
    quiz: str = Field(default="vark")
    answers: list[AnswerEntry] = Field(min_length=16, max_length=16)

    @field_validator("answers")
    @classmethod
    def answers_unique_and_complete(cls, v: list[AnswerEntry]) -> list[AnswerEntry]:
        ids = [a.questionId for a in v]
        if len(set(ids)) != 16:
            raise ValueError("Cada uma das 16 questões deve ter exatamente uma resposta.")
        if set(ids) != set(range(1, 17)):
            raise ValueError("IDs de questão inválidos.")
        return v
