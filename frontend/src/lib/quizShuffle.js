import { getSafeSessionStorage } from "./storage.js";

const QUIZ_SHUFFLE_SEED_KEY = "vark-quiz-shuffle-seed";

function createSeed() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function hashSeed(input) {
  let hash = 2166136261;

  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed) {
  let state = hashSeed(seed) || 0x9e3779b9;

  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return (state >>> 0) / 4294967296;
  };
}

export function shuffleWithSeed(items, seed) {
  const shuffled = [...items];
  const random = createRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

export function ensureQuizShuffleSeed() {
  const storage = getSafeSessionStorage();
  const existing = storage.getItem(QUIZ_SHUFFLE_SEED_KEY);

  if (existing) {
    return existing;
  }

  const next = createSeed();
  storage.setItem(QUIZ_SHUFFLE_SEED_KEY, next);
  return next;
}

export function clearQuizShuffleSeed() {
  getSafeSessionStorage().removeItem(QUIZ_SHUFFLE_SEED_KEY);
}

export function shuffleQuiz(quiz, seed) {
  return {
    ...quiz,
    questions: shuffleWithSeed(quiz.questions, `${seed}:questions`).map((question) => ({
      ...question,
      options: shuffleWithSeed(
        question.options,
        `${seed}:question:${question.id}:options`,
      ),
    })),
  };
}
