import { cn } from "../../lib/utils.js";

export function RadioGroup({ name, value, onChange, options, className }) {
  return (
    <div role="radiogroup" className={cn("space-y-1.5 sm:space-y-2", className)}>
      {options.map((opt) => {
        const checked = value === opt.value;
        const id = `${name}-${opt.value}`;
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-start gap-2.5 rounded-xl border bg-white p-3 text-[13px] transition sm:gap-3 sm:p-4 sm:text-sm",
              checked
                ? "border-indigo-500 ring-2 ring-indigo-100"
                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
            )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 h-3.5 w-3.5 cursor-pointer border-slate-300 text-indigo-600 focus:ring-indigo-500 sm:h-4 sm:w-4"
              />
              <div className="flex-1">
                <div className="font-medium text-slate-900">{opt.text}</div>
                {opt.description && (
                  <div className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">{opt.description}</div>
                )}
              </div>
            </label>
          );
        })}
    </div>
  );
}
