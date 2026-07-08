import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="grid place-items-center py-16 text-center">
      <p className="font-display text-6xl font-bold text-slate-200">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-slate-900">Página não encontrada</h1>
      <p className="mt-1 text-sm text-slate-600">A rota acessada não existe ou foi removida.</p>
      <Link to="/" className="btn-primary mt-6">
        <Home className="h-4 w-4" /> Voltar ao início
      </Link>
    </div>
  );
}
