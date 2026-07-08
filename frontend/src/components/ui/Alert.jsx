import { cn } from "../../lib/utils.js";

const variants = {
  info: "border-indigo-200 bg-indigo-50 text-indigo-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
};

export function Alert({ variant = "info", className, children, title }) {
  return (
    <div className={cn("rounded-xl border p-4 text-sm", variants[variant], className)} role="alert">
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}
