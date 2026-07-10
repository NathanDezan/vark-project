import { ShieldCheck } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";

export default function SobrePage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <header>
        <h1 className="font-display text-3xl font-bold text-slate-900 sm:text-4xl">Sobre o VARK</h1>
        <p className="mt-2 max-w-3xl text-base text-slate-600">
          O VARK é um dos instrumentos mais utilizados no mundo para identificar preferências de
          aprendizagem. Foi desenvolvido por Neil Fleming, e categoriza quatro
          modalidades principais.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-bold">As 4 modalidades</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li><strong className="text-indigo-700">V — Visual:</strong> diagramas, gráficos, mapas, cores.</li>
            <li><strong className="text-emerald-700">A — Auditivo:</strong> explicações orais, podcasts, discussão.</li>
            <li><strong className="text-amber-700">R — Leitura/Escrita:</strong> textos, listas, anotações.</li>
            <li><strong className="text-pink-700">K — Cinestésico:</strong> prática, simulação, manipulação.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-lg font-bold">Como é calculado</h2>
          <p className="mt-3 text-sm text-slate-700">
            Cada uma das 16 questões oferece 4 opções, cada uma representando uma modalidade.
            A resposta do usuário incrementa a contagem da modalidade correspondente. A
            pontuação final é comparada entre as 4 modalidades e o perfil é gerado a partir
            da(s) modalidade(s) de maior pontuação (com empates permitidos).
          </p>
        </Card>
      </section>

      <section>
        <Card>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Privacidade por padrão
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            Este questionário é totalmente anônimo. Nenhum dado pessoal é solicitado ou
            armazenado. O cálculo do perfil acontece on-demand e o resultado fica disponível
            apenas na sua sessão atual — ao sair ou recarregar, ele é descartado.
          </p>
        </Card>
      </section>

      <section>
        <Card>
          <h2 className="font-display text-lg font-bold">Referências</h2>
          <ul className="mt-3 space-y-1 text-sm text-slate-700">
            <li>Fleming, N. D. (2006). <em>Teaching and learning styles: VARK strategies</em>.</li>
            <li>Nakamoto, F. K. (2021). Tradução e adaptação do VARK para PT-BR. Centro Universitário São Camilo.</li>
            <li>Questionário original: <a className="text-indigo-600 underline" href="https://vark-learn.com" target="_blank" rel="noreferrer">vark-learn.com</a></li>
          </ul>
        </Card>
      </section>
    </div>
  );
}
