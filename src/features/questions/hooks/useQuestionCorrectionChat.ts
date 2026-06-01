import { useCallback, useEffect, useState } from "react";
import {
  getQuestionCorrection,
  getQuestionDetails,
  postQuestionCorrectionChat,
} from "@/features/questions/api/questions.api";
import type { QuestionCorrectionApiResponse } from "@/features/questions/model/question-correction.types";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type QuestionCorrectionChatInitial = {
  originalQuestion?: QuestionApiItem | null;
  correction?: QuestionCorrectionApiResponse | null;
};

export function useQuestionCorrectionChat(
  questionId: string,
  initial: QuestionCorrectionChatInitial,
) {
  const [originalQuestion, setOriginalQuestion] = useState<QuestionApiItem | null>(
    initial.originalQuestion ?? null,
  );
  const [correctionResponse, setCorrectionResponse] =
    useState<QuestionCorrectionApiResponse | null>(
      initial.correction ?? null,
    );
  const [loading, setLoading] = useState(
    !initial.originalQuestion || !initial.correction,
  );
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const needsInitialFetch = !originalQuestion || !correctionResponse;

  useEffect(() => {
    if (!questionId || !needsInitialFetch) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([
      originalQuestion ? Promise.resolve(originalQuestion) : getQuestionDetails(questionId),
      correctionResponse
        ? Promise.resolve(correctionResponse)
        : getQuestionCorrection(questionId),
    ])
      .then(([question, correction]) => {
        if (!active) return;
        setOriginalQuestion(question);
        setCorrectionResponse(correction);
      })
      .catch((requestError: unknown) => {
        if (!active) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load AI correction",
        );
      })
      .finally(() => {
        if (!active) return;
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    correctionResponse,
    needsInitialFetch,
    originalQuestion,
    questionId,
  ]);

  const sendMessage = useCallback(
    async (message: string) => {
      const trimmed = message.trim();
      if (!questionId || !trimmed || !correctionResponse) {
        return false;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: trimmed,
      };

      setMessages((current) => [...current, userMessage]);
      setSending(true);
      setError(null);

      try {
        const response = await postQuestionCorrectionChat(questionId, {
          user_message: trimmed,
          previous_correction: correctionResponse,
        });

        setCorrectionResponse(response);
        setMessages((current) => [
          ...current,
          {
            id: `assistant-${Date.now()}`,
            role: "assistant",
            content: "Correction updated with your instructions.",
          },
        ]);

        return true;
      } catch (requestError: unknown) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to personalize AI correction",
        );
        return false;
      } finally {
        setSending(false);
      }
    },
    [correctionResponse, questionId],
  );

  return {
    originalQuestion,
    correctionResponse,
    loading,
    sending,
    error,
    messages,
    sendMessage,
  };
}
