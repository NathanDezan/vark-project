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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="btn-ghost">
          <Home className="h-4 w-4" /> Página inicial
        </Link>
        <Button variant="ghost" type="button" onClick={handleDownloadPdf} disabled={isGeneratingPdf}>
          <Download className="h-4 w-4" />
          {isGeneratingPdf ? "Gerando PDF..." : "Baixar PDF"}
        </Button>
      </div>
      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
