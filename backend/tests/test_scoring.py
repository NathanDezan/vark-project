from __future__ import annotations

import pytest

from app.schemas.result import ScoreBreakdown
from app.services.scoring import (
    count_scores,
    learning_profile,
    load_guides_for_modalities,
    load_quiz,
    score_quiz,
)


@pytest.fixture(scope="module")
def quiz():
    return load_quiz("./app/data/vark_questions.json")


def test_load_quiz_has_sixteen_questions(quiz):
    assert len(quiz.questions) == 16
    for q in quiz.questions:
        assert len(q.options) == 4
        assert {o.value for o in q.options} == {"V", "A", "R", "K"}


def test_map_vark_letter_length(quiz):
    assert len(quiz.mapVarkLetter) == 64


def test_all_visual_scores_sixteen(quiz):
    answers = [{"questionId": q, "choice": "V"} for q in range(1, 17)]
    scores = count_scores(answers, quiz.mapVarkLetter)
    assert scores.V == 16
    assert scores.A == 0
    assert scores.R == 0
    assert scores.K == 0


def test_mixed_answers_counts_correctly(quiz):
    answers = [
        {"questionId": 1, "choice": "K"},
        {"questionId": 2, "choice": "V"},
        {"questionId": 3, "choice": "K"},
        {"questionId": 4, "choice": "A"},
        {"questionId": 5, "choice": "R"},
        {"questionId": 6, "choice": "V"},
        {"questionId": 7, "choice": "A"},
        {"questionId": 8, "choice": "R"},
        {"questionId": 9, "choice": "K"},
        {"questionId": 10, "choice": "A"},
        {"questionId": 11, "choice": "R"},
        {"questionId": 12, "choice": "K"},
        {"questionId": 13, "choice": "A"},
        {"questionId": 14, "choice": "R"},
        {"questionId": 15, "choice": "K"},
        {"questionId": 16, "choice": "A"},
    ]
    scores = count_scores(answers, quiz.mapVarkLetter)
    assert scores.V == 2
    assert scores.A == 5
    assert scores.R == 4
    assert scores.K == 5


def test_tie_detected_in_profile():
    scores = ScoreBreakdown(V=4, A=4, R=4, K=4)
    profile, winners = learning_profile(scores)
    assert winners == ["A", "K", "R", "V"]
    assert profile == "Multimodal"


def test_unique_winner():
    scores = ScoreBreakdown(V=2, A=8, R=3, K=3)
    profile, winners = learning_profile(scores)
    assert winners == ["A"]
    assert profile == "Auditivo"


def test_load_guides_for_modalities_preserves_order():
    guides = load_guides_for_modalities(["A", "V"])
    assert [guide.code for guide in guides] == ["A", "V"]
    assert [guide.name for guide in guides] == ["Auditivo", "Visual"]


def test_score_quiz_returns_tuple(quiz):
    answers = [{"questionId": q, "choice": "K"} for q in range(1, 17)]
    scores, profile, modalities = score_quiz(answers, quiz.mapVarkLetter)
    assert scores.K == 16
    assert profile == "Cinestésico"
    assert modalities == ["K"]


def test_invalid_choice_rejected(quiz):
    answers = [{"questionId": 1, "choice": "X"}] + [
        {"questionId": q, "choice": "V"} for q in range(2, 17)
    ]
    with pytest.raises(ValueError, match="Modalidade inválida"):
        count_scores(answers, quiz.mapVarkLetter)


def test_duplicate_question_id_rejected(quiz):
    answers = [{"questionId": 1, "choice": "V"}] * 16
    with pytest.raises(ValueError, match="mais de uma vez"):
        count_scores(answers, quiz.mapVarkLetter)


def test_wrong_total_questions_rejected(quiz):
    answers = [{"questionId": q, "choice": "V"} for q in range(1, 16)]
    with pytest.raises(ValueError, match="Esperava 16"):
        count_scores(answers, quiz.mapVarkLetter)
