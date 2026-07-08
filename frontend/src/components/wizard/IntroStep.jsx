import { ArrowRight, ClipboardList, ListChecks, Repeat2, ShieldCheck } from "lucide-react";
import { Button } from "../ui/Button.jsx";

const TIPS = [
  {
    icon: ListChecks,
    title: "16 questões em 4 blocos",
    body: "Responda todas as 16 para liberar o resultado do seu perfil.",
  },
  {
    icon: ShieldCheck,
    title: "Anônimo de verdade",
    body: "Nenhum dado pessoal é solicitado. O cálculo é on-demand e o resultado fica só na sua sessão atual.",
  },
  {
    icon: ClipboardList,
    title: "Sem certo ou errado",
    body: "Escolha a opção que melhor reflete como você prefere receber informação — seja na escola, no trabalho ou no dia a dia.",
  },
  {
    icon: Repeat2,
    title: "Pode revisar",
    body: "Volte a qualquer bloco e ajuste respostas antes de calcular o resultado final.",
  },
];

export default function IntroStep({ onNext }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-indigo-600">Antes de começar</p>
        <h2 className="mt-1 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
          Você está pronto?
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          O VARK mapeia como você prefere aprender (Visual, Auditivo, Leitura/Escrita, Cinestésico). Leva
          cerca de 5 minutos e, ao terminar, você vê o resultado na hora.
        </p>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {TIPS.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-indigo-100 text-indigo-700">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{body}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-end border-t border-slate-200 pt-4">
        <Button onClick={onNext}>
          Começar questionário <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
