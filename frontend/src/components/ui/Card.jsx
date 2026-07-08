import { cn } from "../../lib/utils.js";

export function Card({ className, children, ...props }) {
  return (
    <div className={cn("card", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn("text-lg font-semibold text-slate-900", className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn("mt-1 text-sm text-slate-600", className)}>{children}</p>;
}

export function CardContent({ className, children }) {
  return <div className={cn("text-sm text-slate-700", className)}>{children}</div>;
}
