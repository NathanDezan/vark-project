from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import Settings, get_settings
from app.schemas.result import ResultPayload
from app.schemas.score import ScoreRequest
from app.services.scoring import load_guides_for_modalities, load_quiz, score_quiz

router = APIRouter(prefix="/svc/api", tags=["score"])


@router.post(
    "/score",
    response_model=ResultPayload,
)
async def calculate_score(
    payload: ScoreRequest,
    settings: Settings = Depends(get_settings),
) -> ResultPayload:
    quiz = load_quiz(str(settings.questions_file))
    answers_dicts = [{"questionId": a.questionId, "choice": a.choice} for a in payload.answers]

    try:
        scores, profile, modalities = score_quiz(answers_dicts, quiz.mapVarkLetter)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        ) from exc

    guides = load_guides_for_modalities(modalities)

    return ResultPayload(
        id=payload.id,
        quiz="vark",
        scores=scores,
        profile=profile,
        modalities=modalities,
        guide=guides,
        created_at=payload.created_at.isoformat(),
    )
