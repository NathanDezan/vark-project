import { Sparkles } from "lucide-react";
import { cn, modalityLabels, modalityBg } from "../../lib/utils.js";

export default function ProfileCard({ profile, modalities, scores }) {
  const top = Math.max(...Object.values(scores));
  const sortedModalities = [...modalities].sort((left, right) => {
    const scoreDiff = scores[right] - scores[left];
    if (scoreDiff !== 0) return scoreDiff;
    return left.localeCompare(right);
  });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          <Sparkles className="h-4 w-4 text-indigo-500" /> Seu perfil VARK
        </div>
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="space-y-3">
            <h1 className="font-display text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              {profile}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              {modalities.length > 1
                ? "Você tem mais de uma modalidade dominante — um perfil multimodal."
                : "Você tem uma modalidade dominante bem definida."}{" "}
              Use isso para ajustar a forma como estuda, revisa e apresenta informações.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Pontuação máxima
            </p>
            <p className="mt-1 font-display text-2xl font-bold text-slate-900">
              {top} / 16
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {modalities.length > 1 && (
            <span className="badge ring-1 bg-slate-100 text-slate-700 ring-slate-200">
              Multimodal
            </span>
          )}
          {sortedModalities.map((m) => (
            <span key={m} className={cn("badge ring-1", modalityBg[m])}>
              {modalityLabels[m]} · {scores[m]} pts
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
