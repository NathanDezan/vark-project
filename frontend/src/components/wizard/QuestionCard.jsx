import { RadioGroup } from "../ui/RadioGroup.jsx";
import { useQuizStore } from "../../store/quiz.js";

export default function QuestionCard({ question }) {
  const choice = useQuizStore((s) => s.answers[question.id]);
  const setAnswer = useQuizStore((s) => s.setAnswer);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
          {question.id}
        </span>
        <h3 className="text-sm font-semibold text-slate-800 sm:text-base">{question.prompt}</h3>
      </div>
      <RadioGroup
        name={`q-${question.id}`}
        value={choice}
        onChange={(v) => setAnswer(question.id, v)}
        options={question.options}
      />
    </div>
  );
}
