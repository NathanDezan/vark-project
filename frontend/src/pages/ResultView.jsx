import { Link, Navigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import ProfileCard from "../components/result/ProfileCard.jsx";
import ScoresChart from "../components/result/ScoresChart.jsx";
import LearningGuide from "../components/result/LearningGuide.jsx";
import ActionButtons from "../components/result/ActionButtons.jsx";
import { useQuizStore } from "../store/quiz.js";
import { formatDate } from "../lib/utils.js";

export default function ResultView() {
  const result = useQuizStore((s) => s.result);
  const reset = useQuizStore((s) => s.reset);

  if (!result?.id) {
    return <Navigate to="/quiz" replace />;
  }

  function handleRedo() {
    reset();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:items-center sm:justify-between">
        <p className="min-w-0 text-[11px] leading-tight text-slate-500 sm:text-xs">
          Submissão #{result.id.slice(0, 8)} · {formatDate(result.created_at)}
        </p>
        <Link
          to="/quiz"
          replace
          onClick={handleRedo}
          className="btn-ghost shrink-0 whitespace-nowrap px-2.5 py-1.5 text-xs sm:px-3 sm:py-2 sm:text-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Refazer questionário
        </Link>
      </div>

      <ProfileCard
        profile={result.profile}
        modalities={result.modalities}
        scores={result.scores}
      />

      <Card>
        <h2 className="font-display text-xl font-bold text-slate-900">Distribuição por modalidade</h2>
        <p className="mt-1 text-sm text-slate-600">
          Cada modalidade pontua de 0 a 16 pontos (1 ponto por questão em que foi a sua escolha).
        </p>
        <div className="mt-4">
          <ScoresChart scores={result.scores} />
        </div>
      </Card>

      <LearningGuide modalities={result.modalities} guide={result.guide} />

      <ActionButtons result={result} />
    </div>
  );
}
