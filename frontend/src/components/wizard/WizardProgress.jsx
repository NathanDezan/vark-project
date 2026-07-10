import { Fragment } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils.js";

const STEPS = [
  { id: 1, label: "Introdução" },
  { id: 2, label: "Bloco 1" },
  { id: 3, label: "Bloco 2" },
  { id: 4, label: "Bloco 3" },
  { id: 5, label: "Bloco 4" },
];

export default function WizardProgress({ step = 0 }) {
  const displayId = step + 1;

  return (
    <div className="grid grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto_1fr_auto] items-start gap-x-1 sm:gap-x-2">
      {STEPS.map((s, idx) => {
        const isDone = displayId > s.id;
        const isCurrent = displayId === s.id;
        const connectorDone = idx > 0 && displayId > STEPS[idx - 1].id;

        return (
          <Fragment key={s.id}>
            {idx > 0 && (
              <div
                className={cn(
                  "mt-[13px] h-0.5 rounded-full transition sm:mt-[15px] md:mt-[17px]",
                  connectorDone ? "bg-emerald-500" : "bg-slate-200",
                )}
                aria-hidden="true"
              />
            )}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "grid h-7 w-7 place-items-center rounded-full border-2 text-[11px] font-semibold transition sm:h-8 sm:w-8 sm:text-xs md:h-9 md:w-9",
                  isDone && "border-emerald-500 bg-emerald-500 text-white",
                  isCurrent && "border-indigo-600 bg-indigo-600 text-white shadow-soft",
                  !isDone && !isCurrent && "border-slate-200 bg-white text-slate-400",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={cn(
                  "mt-1.5 hidden text-[11px] font-medium sm:block",
                  isCurrent
                    ? "text-indigo-700"
                    : isDone
                      ? "text-emerald-700"
                      : "text-slate-400",
                )}
              >
                {s.label}
              </span>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
