import { RadioGroup } from "../ui/RadioGroup.jsx";
import { useQuizStore } from "../../store/quiz.js";

export default function QuestionCard({ question, displayNumber = question.id }) {
  const choice = useQuizStore((s) => s.answers[question.id]);
  const setAnswer = useQuizStore((s) => s.setAnswer);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-2.5 flex items-start gap-2.5 sm:mb-3 sm:gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-700 sm:h-8 sm:w-8 sm:text-sm">
          {displayNumber}
        </span>
        <h3 className="text-[13px] font-semibold leading-snug text-slate-800 sm:text-base">
          {question.prompt}
        </h3>
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
