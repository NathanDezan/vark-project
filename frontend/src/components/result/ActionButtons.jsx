import { useNavigate } from "react-router-dom";
import { RefreshCw, Home, Printer } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { useQuizStore } from "../../store/quiz.js";

export default function ActionButtons() {
  const navigate = useNavigate();
  const reset = useQuizStore((s) => s.reset);

  function handleRedo() {
    reset();
    navigate("/quiz");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <a href="/" className="btn-ghost">
        <Home className="h-4 w-4" /> Página inicial
      </a>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Imprimir / PDF
        </Button>
        <button type="button" onClick={handleRedo} className="btn-primary">
          <RefreshCw className="h-4 w-4" /> Refazer questionário
        </button>
      </div>
    </div>
  );
}
