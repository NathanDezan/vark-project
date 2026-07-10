import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card.jsx";
import { Alert } from "../components/ui/Alert.jsx";
import WizardProgress from "../components/wizard/WizardProgress.jsx";
import QuestionsStep from "../components/wizard/QuestionsStep.jsx";
import { useQuiz } from "../hooks/useQuiz.js";
import { useQuizStore } from "../store/quiz.js";

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    quiz,
    step,
    nextStep,
    prevStep,
    totalAnswered,
    totalQuestions,
    progress,
    isLoadingQuiz,
    isCalculating,
    submitError,
    calculate,
  } = useQuiz();
  const result = useQuizStore((s) => s.result);
  const previousStepRef = useRef(step);

  function handlePrevStep() {
    prevStep();
  }

  function handleNextStep() {
    nextStep();
  }

  useEffect(() => {
    if (previousStepRef.current === step) return;
    previousStepRef.current = step;

    if (typeof window === "undefined") return;

    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, [step]);

  useEffect(() => {
    if (result?.id) {
      navigate("/resultado", { replace: true });
    }
  }, [result, navigate]);

  if (isLoadingQuiz) {
    return (
      <Card className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <p className="mt-4 text-sm text-slate-600">Carregando o questionário...</p>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Alert variant="error" title="Não foi possível carregar o questionário">
        {submitError || "Tente recarregar a página."}
      </Alert>
    );
  }

  async function handleCalculate() {
    const r = await calculate();
    if (r?.id) {
      navigate("/resultado");
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <div className="mb-6">
          <WizardProgress step={step} />
        </div>
      </Card>

      <Card>
        <QuestionsStep
          step={step}
          questions={quiz.questions}
          totalAnswered={totalAnswered}
          totalQuestions={totalQuestions}
          progress={progress}
          onPrev={handlePrevStep}
          onNext={handleNextStep}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />
      </Card>

      <p className="text-center text-xs text-slate-500">
        Dica: você pode voltar e revisar qualquer resposta. Seu progresso fica salvo enquanto esta aba estiver aberta.
      </p>
    </div>
  );
}
