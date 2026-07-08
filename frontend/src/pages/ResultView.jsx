import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";
import ProfileCard from "../components/result/ProfileCard.jsx";
import ScoresChart from "../components/result/ScoresChart.jsx";
import LearningGuide from "../components/result/LearningGuide.jsx";
import ActionButtons from "../components/result/ActionButtons.jsx";
import { useQuizStore } from "../store/quiz.js";
import { formatDate } from "../lib/utils.js";

export default function ResultView() {
  const result = useQuizStore((s) => s.result);

  if (!result?.id) {
    return <Navigate to="/quiz" replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Submissão #{result.id.slice(0, 8)} · {formatDate(result.created_at)}
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/quiz" className="btn-ghost">
            <ArrowLeft className="h-4 w-4" /> Refazer
          </Link>
          <Link to="/sobre" className="btn-ghost">
            Sobre o VARK <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
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

      <ActionButtons />
    </div>
  );
}
