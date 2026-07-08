from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.schemas.questions import Modality, QuizPayload
from app.schemas.result import ModalityGuide, ScoreBreakdown

MODALITY_NAMES: dict[Modality, str] = {
    "V": "Visual",
    "A": "Auditivo",
    "R": "Leitura/Escrita",
    "K": "Cinestésico",
}


def _validate_questions(answers: list[dict[str, Any]], total_questions: int = 16) -> None:
    if len(answers) != total_questions:
        raise ValueError(f"Esperava {total_questions} respostas, recebeu {len(answers)}.")
    seen: set[int] = set()
    for entry in answers:
        qid = entry.get("questionId")
        choice = entry.get("choice")
        if qid is None or choice is None:
            raise ValueError("Cada resposta precisa de 'questionId' e 'choice'.")
        if qid in seen:
            raise ValueError(f"Questão {qid} respondida mais de uma vez.")
        seen.add(qid)
        if choice not in MODALITY_NAMES:
            raise ValueError(f"Modalidade inválida: {choice!r}.")
    if seen != set(range(1, total_questions + 1)):
        raise ValueError("IDs de questão devem ser 1..16 sem repetição.")


def count_scores(
    answers: list[dict[str, Any]],
    map_vark_letter: list[Modality],
    total_questions: int = 16,
) -> ScoreBreakdown:
    _validate_questions(answers, total_questions)
    if len(map_vark_letter) != total_questions * 4:
        raise ValueError(
            f"mapVarkLetter deve ter {total_questions * 4} entradas, tem {len(map_vark_letter)}."
        )

    choice_by_q: dict[int, Modality] = {a["questionId"]: a["choice"] for a in answers}
    counts: dict[Modality, int] = {"V": 0, "A": 0, "R": 0, "K": 0}

    for q in range(1, total_questions + 1):
        slot_index = (q - 1) * 4
        chosen = choice_by_q[q]
        for offset in range(4):
            if map_vark_letter[slot_index + offset] == chosen:
                counts[chosen] += 1

    return ScoreBreakdown(**counts)


def learning_profile(scores: ScoreBreakdown) -> tuple[str, list[Modality]]:
    counts: dict[Modality, int] = {"V": scores.V, "A": scores.A, "R": scores.R, "K": scores.K}
    top = max(counts.values())
    winners = sorted([m for m, v in counts.items() if v == top])
    profile = " | ".join(MODALITY_NAMES[m] for m in winners) if winners else "—"
    return profile, winners


def score_quiz(
    answers: list[dict[str, Any]],
    map_vark_letter: list[Modality],
) -> tuple[ScoreBreakdown, str, list[Modality]]:
    scores = count_scores(answers, map_vark_letter)
    profile, winners = learning_profile(scores)
    return scores, profile, winners


@lru_cache
def load_quiz(path: str) -> QuizPayload:
    raw = json.loads(Path(path).read_text(encoding="utf-8"))
    return QuizPayload(**raw)


def load_guides_for_modalities(modalities: list[Modality]) -> list[ModalityGuide]:
    from app.services.learning_guide import LEARNING_GUIDE

    guides: list[ModalityGuide] = []
    for m in modalities:
        entry = LEARNING_GUIDE.get(m)
        if entry:
            guides.append(ModalityGuide(code=m, name=MODALITY_NAMES[m], **entry))
    return guides
