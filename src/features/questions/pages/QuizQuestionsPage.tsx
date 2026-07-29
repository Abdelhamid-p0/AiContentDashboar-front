import { useCallback, useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { exportRowsToExcel } from "@/shared/lib/excel";
import { QuizQuestionsView } from "../components";
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

  const { details, openDetails, closeDetails } = useQuestionDialogs();

  const openChat = useCallback(
    (questionId: string) => {
      navigate(
        `/courses/${courseId}/quizzes/${quizId}/questions/${questionId}/chat`,
        {
          state: {
            courseId,
            courseTitle,
            quizId,
            quizTitle,
          },
        },
      );
    },
    [courseId, courseTitle, navigate, quizId, quizTitle],
  );

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
      onOpenChat={openChat}
      detailsDialog={{
        open: details.open,
        loading: details.loading,
        error: details.error,
        question: details.question,
        onClose: closeDetails,
      }}
    />
  );
}
