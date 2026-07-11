import { useState } from "react";
import { Link } from "react-router-dom";
import { Download, Home } from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { api } from "../../lib/api.js";

export default function ActionButtons({ result }) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [error, setError] = useState("");

  async function handleDownloadPdf() {
    if (!result?.id) return;
    setIsGeneratingPdf(true);
    setError("");

    try {
      const { blob, filename } = await api.downloadResultPdf(result);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || `resultado-vark-${result.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      setError(err?.message || "Não foi possível gerar o PDF.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-row items-center justify-between gap-2 sm:gap-3">
        <Link to="/" className="btn-ghost shrink-0 whitespace-nowrap">
          <Home className="h-4 w-4" /> Página inicial
        </Link>
        <Button
          variant="ghost"
          type="button"
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="shrink-0 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          {isGeneratingPdf ? "Gerando PDF..." : "Baixar PDF"}
        </Button>
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
