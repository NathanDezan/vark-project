from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import Settings, get_settings
from app.schemas.questions import QuizPayload
from app.services.scoring import load_quiz

router = APIRouter(prefix="/svc/api", tags=["questions"])


@router.get("/questions", response_model=QuizPayload)
def get_questions(settings: Settings = Depends(get_settings)) -> QuizPayload:
    try:
        return load_quiz(str(settings.questions_file))
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Arquivo de questões não encontrado.",
        ) from exc
