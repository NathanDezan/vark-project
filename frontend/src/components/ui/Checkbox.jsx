import { cn } from "../../lib/utils.js";

export function Checkbox({ label, checked, onChange, name, value, className }) {
  const id = `cb-${name}-${value}`.replace(/\s/g, "");
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 text-sm transition",
        checked ? "border-indigo-500 ring-2 ring-indigo-100" : "border-slate-200 hover:border-slate-300",
        className,
      )}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
      />
      <span className="text-slate-700">{label}</span>
    </label>
  );
}
