import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clearQuizShuffleSeed } from "../lib/quizShuffle.js";
import { getSafeSessionStorage } from "../lib/storage.js";

export const useQuizStore = create(
  persist(
    (set, get) => ({
      quiz: null,
      step: 0,
      answers: {},
      result: null,
      isLoadingQuiz: false,
      isCalculating: false,
      submitError: null,

      setQuiz: (quiz) => set({ quiz }),
      setStep: (step) => set({ step }),
      nextStep: () => set({ step: Math.min(get().step + 1, 4) }),
      prevStep: () => set({ step: Math.max(get().step - 1, 0) }),

      setAnswer: (questionId, choice) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: choice } })),

      clearAnswer: (questionId) =>
        set((s) => {
          const next = { ...s.answers };
          delete next[questionId];
          return { answers: next };
        }),

      setResult: (result) => set({ result }),
      setLoadingQuiz: (v) => set({ isLoadingQuiz: v }),
      setCalculating: (v) => set({ isCalculating: v }),
      setSubmitError: (err) => set({ submitError: err }),

      reset: () => {
        clearQuizShuffleSeed();
        set({
          quiz: null,
          step: 0,
          answers: {},
          result: null,
          submitError: null,
          isLoadingQuiz: false,
          isCalculating: false,
        });
      },
    }),
    {
      name: "vark-quiz-state",
      storage: createJSONStorage(getSafeSessionStorage),
      partialize: (s) => ({ step: s.step, answers: s.answers }),
    },
  ),
);
