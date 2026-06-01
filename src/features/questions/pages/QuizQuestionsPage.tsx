import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { QuizQuestionsView } from "@/shared/components/organisms";
import { exportRowsToExcel } from "@/shared/lib/excel";
import { useQuizQuestionsPage } from "../hooks/useQuizQuestionsPage";
import { useQuestionDialogs } from "../hooks/useQuestionDialogs";

type QuizLocationState = {
  courseId?: string;
  courseTitle?: string;
  quizTitle?: string;
};

export function QuizQuestionsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const courseId = params.courseId ?? "";
  const quizId = params.quizId ?? "";
  const state = location.state as QuizLocationState | null;
  const quizTitle = state?.quizTitle ?? quizId;
  const courseTitle = state?.courseTitle ?? "Course";

  const { questions, loading, error } = useQuizQuestionsPage(quizId);

  const exportRows = useMemo(
    () =>
      questions.map((question) => ({
        Order: question.order,
        Question: question.question,
        Type: question.questionType,
        Objective: question.objective,
      })),
    [questions],
  );

  const {
    details,
    correction,
    openDetails,
    closeDetails,
    openCorrection,
    closeCorrection,
  } = useQuestionDialogs();

  const chatEnabled = Boolean(
    correction.questionId &&
    correction.originalQuestion &&
    correction.correctionResponse &&
    !correction.loading &&
    !correction.error,
  );

  const openChat = useCallback(() => {
    if (
      !correction.questionId ||
      !correction.correctionResponse ||
      !correction.originalQuestion
    ) {
      return;
    }

    navigate(
      `/courses/${courseId}/quizzes/${quizId}/questions/${correction.questionId}/chat`,
      {
        state: {
          courseId,
          courseTitle,
          quizId,
          quizTitle,
          originalQuestion: correction.originalQuestion,
          correction: correction.correctionResponse,
        },
      },
    );
  }, [
    correction.correctionResponse,
    correction.originalQuestion,
    correction.questionId,
    courseId,
    courseTitle,
    navigate,
    quizId,
    quizTitle,
  ]);

  return (
    <QuizQuestionsView
      quizId={quizId}
      quizTitle={quizTitle}
      courseTitle={courseTitle}
      questions={questions}
      loading={loading}
      error={error}
      onBackToQuizzes={() =>
        navigate(`/courses/${courseId}/quizzes`, {
          state: { courseTitle },
        })
      }
      onExport={() =>
        exportRowsToExcel(exportRows, "Questions", `questions-${quizId}`)
      }
      onOpenDetails={openDetails}
      onOpenCorrection={openCorrection}
      detailsDialog={{
        open: details.open,
        loading: details.loading,
        error: details.error,
        question: details.question,
        onClose: closeDetails,
      }}
      correctionDialog={{
        open: correction.open,
        loading: correction.loading,
        error: correction.error,
        originalQuestion: correction.originalQuestion,
        correctedQuestion: correction.correctedQuestion,
        corrections: correction.corrections,
        explanation: correction.explanation,
        detectedErrors: correction.detectedErrors,
        onClose: closeCorrection,
        onOpenChat: openChat,
        chatEnabled,
      }}
    />
  );
}
