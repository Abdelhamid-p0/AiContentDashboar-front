import type { QuestionCorrectionApiResponse } from "./question-correction.types";
import type { QuestionApiItem } from "./question.types";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type CorrectionChatLocationState = {
  courseId?: string;
  courseTitle?: string;
  quizId?: string;
  quizTitle?: string;
  originalQuestion?: QuestionApiItem;
  correction?: QuestionCorrectionApiResponse;
};