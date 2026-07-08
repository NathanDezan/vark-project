import { Lightbulb, BookOpen } from "lucide-react";
import { cn, modalityLabels, modalityBg, modalityColors } from "../../lib/utils.js";

export default function LearningGuide({ modalities, guide }) {
  return (
    <div className="space-y-4">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold text-slate-900">
        <BookOpen className="h-5 w-5 text-indigo-600" />
        Guia de estudo personalizado
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {guide.map((g) => (
          <div
            key={g.code}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className={cn("badge ring-1", modalityBg[g.code])}
                style={{ color: modalityColors[g.code] }}
              >
                {modalityLabels[g.code]}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700">{g.description}</p>
            <div className="mt-4">
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <Lightbulb className="h-3.5 w-3.5" /> Estratégias práticas
              </p>
              <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
                {g.strategies.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
