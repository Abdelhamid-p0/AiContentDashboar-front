import { useCallback, useState } from "react";
import {
  getQuestionCorrection,
  getQuestionDetails,
} from "@/features/questions/api/questions.api";
import type { QuestionCorrectionApiResponse } from "@/features/questions/model/question-correction.types";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

type DetailsState = {
  open: boolean;
  loading: boolean;
  error: string | null;
  question: QuestionApiItem | null;
};

type CorrectionState = {
  open: boolean;
  loading: boolean;
  error: string | null;
  questionId: string | null;
  originalQuestion: QuestionApiItem | null;
  correctedQuestion: QuestionApiItem | null;
  corrections: string[] | null;
  explanation: string | null;
  detectedErrors: string | null;
  correctionResponse: QuestionCorrectionApiResponse | null;
};

export function useQuestionDialogs() {
  const [details, setDetails] = useState<DetailsState>({
    open: false,
    loading: false,
    error: null,
    question: null,
  });
  const [correction, setCorrection] = useState<CorrectionState>({
    open: false,
    loading: false,
    error: null,
    questionId: null,
    originalQuestion: null,
    correctedQuestion: null,
    corrections: null,
    explanation: null,
    detectedErrors: null,
    correctionResponse: null,
  });

  const openDetails = useCallback(async (questionId: string) => {
    setDetails({ open: true, loading: true, error: null, question: null });

    try {
      const question = await getQuestionDetails(questionId);
      setDetails({ open: true, loading: false, error: null, question });
    } catch (requestError: unknown) {
      setDetails({
        open: true,
        loading: false,
        error:
          requestError instanceof Error
            ? requestError.message
            : "Unable to load question details",
        question: null,
      });
    }
  }, []);

  const closeDetails = useCallback(() => {
    setDetails({ open: false, loading: false, error: null, question: null });
  }, []);

  const openCorrection = useCallback(async (questionId: string) => {
    setCorrection({
      open: true,
      loading: true,
      error: null,
      questionId,
      originalQuestion: null,
      correctedQuestion: null,
      corrections: null,
      explanation: null,
      detectedErrors: null,
      correctionResponse: null,
    });

    try {
      const [originalQuestion, correctionResponse] = await Promise.all([
        getQuestionDetails(questionId),
        getQuestionCorrection(questionId),
      ]);

      setCorrection({
        open: true,
        loading: false,
        error: null,
        questionId,
        originalQuestion,
        correctedQuestion: correctionResponse.improved_question,
        corrections: correctionResponse.corrections,
        explanation: correctionResponse.explanation,
        detectedErrors: correctionResponse.detected_errors,
        correctionResponse,
      });
    } catch (requestError: unknown) {
      setCorrection({
        open: true,
        loading: false,
        error:
          requestError instanceof Error
            ? requestError.message
            : "Unable to load AI correction",
        questionId,
        originalQuestion: null,
        correctedQuestion: null,
        corrections: null,
        explanation: null,
        detectedErrors: null,
        correctionResponse: null,
      });
    }
  }, []);

  const closeCorrection = useCallback(() => {
    setCorrection({
      open: false,
      loading: false,
      error: null,
      questionId: null,
      originalQuestion: null,
      correctedQuestion: null,
      corrections: null,
      explanation: null,
      detectedErrors: null,
      correctionResponse: null,
    });
  }, []);

  return {
    details,
    correction,
    openDetails,
    closeDetails,
    openCorrection,
    closeCorrection,
  };
}
