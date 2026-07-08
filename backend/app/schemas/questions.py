from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field

Modality = Literal["V", "A", "R", "K"]


class QuestionOption(BaseModel):
    value: Modality
    text: str


class Question(BaseModel):
    id: int = Field(ge=1, le=16)
    prompt: str
    options: list[QuestionOption] = Field(min_length=4, max_length=4)


class ScoringMeta(BaseModel):
    type: Literal["radio"] = "radio"
    optionsPerQuestion: int = 4
    totalQuestions: int = 16
    totalSlots: int = 64
    modalityMapping: dict[Modality, str]


class QuizPayload(BaseModel):
    version: str
    translator: str
    translatorInstitution: str
    translatorYear: int
    source: str
    scoring: ScoringMeta
    mapVarkLetter: list[Modality] = Field(min_length=64, max_length=64)
    questions: list[Question] = Field(min_length=16, max_length=16)
