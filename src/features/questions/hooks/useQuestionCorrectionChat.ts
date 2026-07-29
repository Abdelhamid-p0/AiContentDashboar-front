import { useCallback, useEffect, useState } from "react";
import {
  getQuestionCorrection,
  getQuestionDetails,
  postQuestionCorrectionChat,
  postQuestionCorrectionFeedback,
} from "@/features/questions/api/questions.api";
import type { ChatMessage } from "@/features/questions/model/question-correction-chat.types";
import type { QuestionCorrectionApiResponse } from "@/features/questions/model/question-correction.types";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

type QuestionCorrectionChatInitial = {
  originalQuestion?: QuestionApiItem | null;
  correction?: QuestionCorrectionApiResponse | null;
};

export function useQuestionCorrectionChat(
  questionId: string,
  initial: QuestionCorrectionChatInitial,
) {
  const [originalQuestion, setOriginalQuestion] = useState<QuestionApiItem | null>(
    initial.originalQuestion ?? initial.correction?.original_question ?? null,
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
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const needsInitialFetch = !correctionResponse || !originalQuestion;

  useEffect(() => {
    if (!questionId || !needsInitialFetch) {
      return;
    }

    let active = true;
    setLoading(true);
    setError(null);

    const correctionPromise = correctionResponse
      ? Promise.resolve(correctionResponse)
      : getQuestionCorrection(questionId);

    correctionPromise
      .then((correction) => {
        if (!active) return null;
        setCorrectionResponse(correction);

        const original =
          originalQuestion ?? correction.original_question ?? null;

        if (original) {
          setOriginalQuestion(original);
          return null;
        }

        return getQuestionDetails(questionId).then((question) => {
          if (!active) return null;
          setOriginalQuestion(question);
          return null;
        });
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
  }, [correctionResponse, needsInitialFetch, originalQuestion, questionId]);

  useEffect(() => {
    setFeedbackRating(null);
    setFeedbackComment("");
    setFeedbackSubmitted(false);
    setFeedbackError(null);
  }, [correctionResponse]);

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

  const submitFeedback = useCallback(async () => {
    if (!questionId || !correctionResponse || feedbackRating == null) {
      return false;
    }

    setFeedbackSending(true);
    setFeedbackError(null);

    try {
      await postQuestionCorrectionFeedback(questionId, {
        rating: feedbackRating,
        comment: feedbackComment.trim(),
        correction: correctionResponse,
      });

      setFeedbackSubmitted(true);
      return true;
    } catch (requestError: unknown) {
      setFeedbackError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to submit correction feedback",
      );
      return false;
    } finally {
      setFeedbackSending(false);
    }
  }, [correctionResponse, feedbackComment, feedbackRating, questionId]);

  return {
    originalQuestion,
    correctionResponse,
    loading,
    sending,
    error,
    messages,
    sendMessage,
    feedbackRating,
    feedbackComment,
    feedbackSending,
    feedbackSubmitted,
    feedbackError,
    setFeedbackRating,
    setFeedbackComment,
    submitFeedback,
  };
}
