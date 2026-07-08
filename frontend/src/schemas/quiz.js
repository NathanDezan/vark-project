import { z } from "zod";

export const answerSchema = z.object({
  questionId: z.number().int().min(1).max(16),
  choice: z.enum(["V", "A", "R", "K"]),
});
