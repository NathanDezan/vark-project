import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { Progress } from "../ui/Progress.jsx";
import QuestionCard from "./QuestionCard.jsx";
import IntroStep from "./IntroStep.jsx";
import { useQuizStore } from "../../store/quiz.js";

export default function QuestionsStep({
  step,
  questions,
  totalAnswered,
  totalQuestions,
  progress = 0,
  onPrev,
  onNext,
  onCalculate,
  isCalculating,
}) {
  const answers = useQuizStore((s) => s.answers);

  if (step === 0) {
    return <IntroStep onNext={onNext} />;
  }

  const blockQuestions = questions.slice((step - 1) * 4, step * 4);
  const blockComplete = blockQuestions.every((q) => Boolean(answers[q.id]));
  const allAnswered = totalAnswered === totalQuestions;
  const isLastBlock = step === 4;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600">Bloco {step} de 4</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          Responda com sinceridade
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Escolha a opção que melhor reflete a sua preferência. Não existe resposta certa ou errada.
        </p>
      </div>

      <Progress value={progress} max={100} label="Progresso geral" />

      <div className="space-y-3 sm:space-y-4">
        {blockQuestions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            displayNumber={(step - 1) * 4 + index + 1}
          />
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200 pt-3 sm:gap-3 sm:pt-4">
        <Button variant="secondary" onClick={onPrev}>
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>

        {!isLastBlock && (
          <Button onClick={onNext} disabled={!blockComplete}>
            Próximo bloco <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {isLastBlock && (
          <Button onClick={onCalculate} disabled={!allAnswered || isCalculating}>
            {isCalculating ? "Calculando..." : "Calcular resultado"}
          </Button>
        )}
      </div>
    </div>
  );
}
