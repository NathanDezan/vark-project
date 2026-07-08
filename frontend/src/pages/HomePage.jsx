import { Link } from "react-router-dom";
import { ArrowRight, Eye, Ear, BookOpen, Hand, Brain, Clock, Combine } from "lucide-react";
import { Card } from "../components/ui/Card.jsx";

const modalities = [
  {
    code: "V",
    icon: Eye,
    name: "Visual",
    color: "from-indigo-500 to-violet-600",
    description: "Aprende com imagens, gráficos, mapas mentais e cores.",
  },
  {
    code: "A",
    icon: Ear,
    name: "Auditivo",
    color: "from-emerald-500 to-teal-600",
    description: "Aprende ouvindo, discutindo e explicando em voz alta.",
  },
  {
    code: "R",
    icon: BookOpen,
    name: "Leitura/Escrita",
    color: "from-amber-500 to-orange-600",
    description: "Aprende lendo, escrevendo e organizando textos e listas.",
  },
  {
    code: "K",
    icon: Hand,
    name: "Cinestésico",
    color: "from-pink-500 to-rose-600",
    description: "Aprende fazendo, praticando e experimentando.",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
            Descubra como você <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">aprende melhor</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
            Em apenas 16 perguntas, descubra o seu perfil de aprendizagem entre as quatro
            modalidades: <strong className="text-slate-800">Visual</strong>, <strong className="text-slate-800">Auditivo</strong>,{" "}
            <strong className="text-slate-800">Leitura/Escrita</strong> e <strong className="text-slate-800">Cinestésico</strong>. Receba
            um guia prático para estudar e revisar com mais eficiência.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/quiz" className="btn-primary">
              Começar agora <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/sobre" className="btn-secondary">
              Entenda o VARK
            </Link>
          </div>
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <Clock className="h-4 w-4" /> Leva cerca de 5 minutos · 16 questões
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-200 via-violet-200 to-pink-200 opacity-60 blur-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {modalities.map((m) => (
              <Card key={m.code} className="flex flex-col items-start gap-3 hover:scale-[1.02]">
                <span
                  className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${m.color} text-white shadow-soft`}
                >
                  <m.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="font-display text-base font-bold text-slate-900">{m.name}</p>
                  <p className="mt-1 text-xs text-slate-600">{m.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Por que conhecer o seu estilo?
            </h2>
            <p className="mt-1 text-sm text-slate-600">Estudos consistentes mostram que ajustar o estudo ao estilo melhora retenção e motivação.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <Brain className="h-6 w-6 text-indigo-600" />
            <h3 className="mt-3 font-display text-lg font-bold">Estude com foco</h3>
            <p className="mt-1 text-sm text-slate-600">
              Descubra quais técnicas de estudo combinam com a sua forma natural de processar informação.
            </p>
          </Card>
          <Card>
            <Combine className="h-6 w-6 text-violet-600" />
            <h3 className="mt-3 font-display text-lg font-bold">Multiplique recursos</h3>
            <p className="mt-1 text-sm text-slate-600">
              Se você é multimodal, combine mapas mentais, áudio, textos e prática para um aprendizado completo.
            </p>
          </Card>
          <Card>
            <BookOpen className="h-6 w-6 text-pink-600" />
            <h3 className="mt-3 font-display text-lg font-bold">Resultados em minutos</h3>
            <p className="mt-1 text-sm text-slate-600">
              16 perguntas, validadas cientificamente, com resultado e guia imediato.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}
