import clsx from "clsx";

export const cn = (...args) => clsx(...args);

export const formatDate = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      dateStyle: "long",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
};

export const modalityLabels = {
  V: "Visual",
  A: "Auditivo",
  R: "Leitura/Escrita",
  K: "Cinestésico",
};

export const modalityColors = {
  V: "#6366f1",
  A: "#10b981",
  R: "#f59e0b",
  K: "#ec4899",
};

export const modalityBg = {
  V: "bg-indigo-100 text-indigo-700 ring-indigo-200",
  A: "bg-emerald-100 text-emerald-700 ring-emerald-200",
  R: "bg-amber-100 text-amber-700 ring-amber-200",
  K: "bg-pink-100 text-pink-700 ring-pink-200",
};
