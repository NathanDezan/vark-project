import { Sparkles } from "lucide-react";
import { cn, modalityLabels, modalityBg } from "../../lib/utils.js";

export default function ProfileCard({ profile, modalities, scores }) {
  const top = Math.max(...Object.values(scores));
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-soft">
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-pink-400/20 blur-2xl" />
      <div className="relative">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-indigo-100">
          <Sparkles className="h-4 w-4" /> Seu perfil VARK
        </div>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">
          {profile}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-indigo-100 sm:text-base">
          {modalities.length > 1
            ? "Você tem mais de uma modalidade dominante — um perfil multimodal."
            : "Você tem uma modalidade dominante bem definida."}{" "}
          Use isso para ajustar a forma como estuda, revisa e apresenta informações.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {modalities.map((m) => (
            <span
              key={m}
              className={cn(
                "badge bg-white/15 text-white ring-1 ring-white/30 backdrop-blur",
              )}
            >
              {modalityLabels[m]} · {scores[m]} pts
            </span>
          ))}
          {modalities.length > 1 && (
            <span className="badge bg-white/15 text-white ring-1 ring-white/30 backdrop-blur">
              {top} pts (top)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
