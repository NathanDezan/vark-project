import { useEffect } from "react";
import { api } from "../lib/api.js";
import { ensureQuizShuffleSeed, shuffleQuiz } from "../lib/quizShuffle.js";
import { useQuizStore } from "../store/quiz.js";

function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function useQuiz() {
  const {
    quiz,
    setQuiz,
    step,
    nextStep,
    prevStep,
    answers,
    result,
    setResult,
    isLoadingQuiz,
    setLoadingQuiz,
    isCalculating,
    setCalculating,
    submitError,
    setSubmitError,
    reset,
  } = useQuizStore();

  useEffect(() => {
    if (quiz) return;
    setLoadingQuiz(true);
    setSubmitError(null);
    const shuffleSeed = ensureQuizShuffleSeed();
    api
      .getQuestions()
      .then((data) => setQuiz(shuffleQuiz(data, shuffleSeed)))
      .catch((err) => setSubmitError(err.message))
      .finally(() => setLoadingQuiz(false));
  }, [quiz, setQuiz, setLoadingQuiz, setSubmitError]);

  const totalAnswered = Object.keys(answers).length;
  const orderedQuestions = quiz?.questions ?? [];
  const totalQuestions = orderedQuestions.length || 16;

  const BLOCK_SIZE = 4;
  const TOTAL_BLOCKS = 4;
  const PERCENT_PER_BLOCK = 100 / TOTAL_BLOCKS;

  function isBlockComplete(block) {
    const start = (block - 1) * BLOCK_SIZE;
    const blockQuestions = orderedQuestions.slice(start, start + BLOCK_SIZE);
    return blockQuestions.length === BLOCK_SIZE && blockQuestions.every((q) => Boolean(answers[q.id]));
  }

  let blocksComplete = 0;
  for (let b = 1; b <= TOTAL_BLOCKS; b++) {
    if (isBlockComplete(b)) blocksComplete++;
  }

  const currentBlockQuestions =
    step >= 1 && step <= TOTAL_BLOCKS
      ? orderedQuestions.slice((step - 1) * BLOCK_SIZE, step * BLOCK_SIZE)
      : [];
  const answeredInCurrentBlock = currentBlockQuestions.filter((q) => Boolean(answers[q.id])).length;
  const currentBlockPartialFraction =
    currentBlockQuestions.length === BLOCK_SIZE && answeredInCurrentBlock < BLOCK_SIZE
      ? answeredInCurrentBlock / BLOCK_SIZE
      : 0;

  const progress =
    step === 0
      ? 0
      : Math.min(
          100,
          (blocksComplete + currentBlockPartialFraction) * PERCENT_PER_BLOCK,
        );

  async function calculate() {
    if (!quiz) return null;
    setCalculating(true);
    setSubmitError(null);
    try {
      const payload = {
        id: uuid(),
        created_at: new Date().toISOString(),
        quiz: "vark",
        answers: Object.entries(answers).map(([qid, choice]) => ({
          questionId: Number(qid),
          choice,
        })),
      };
      const data = await api.calculate(payload);
      setResult(data);
      return data;
    } catch (err) {
      setSubmitError(err.message || "Não foi possível calcular o resultado.");
      return null;
    } finally {
      setCalculating(false);
    }
  }

  return {
    quiz,
    step,
    nextStep,
    prevStep,
    setStep: (s) => useQuizStore.setState({ step: s }),
    answers,
    result,
    isLoadingQuiz,
    isCalculating,
    submitError,
    totalAnswered,
    totalQuestions,
    progress,
    calculate,
    reset,
  };
}
