import { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { exportRowsToExcel } from "@/shared/lib/excel";
import { CourseQuizzesView } from "../components";
import { useCourseQuizzesPage } from "../hooks/useCourseQuizzesPage";

type CourseLocationState = {
  courseTitle?: string;
};

export function CourseQuizzesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const courseId = params.courseId ?? "";
  const courseTitle =
    (location.state as CourseLocationState | null)?.courseTitle ?? courseId;

  const { quizzes, loading, error, selectedType, setSelectedType } =
    useCourseQuizzesPage(courseId);

  const exportRows = useMemo(
    () =>
      quizzes.map((quiz) => ({
        Title: quiz.title,
        Type: quiz.type,
      })),
    [quizzes],
  );

  return (
    <CourseQuizzesView
      courseId={courseId}
      courseTitle={courseTitle}
      quizzes={quizzes}
      loading={loading}
      error={error}
      selectedType={selectedType}
      onTypeChange={setSelectedType}
      onShowAll={() => setSelectedType("ALL")}
      onOpenQuestions={(quizId, quizTitle) =>
        navigate(`/courses/${courseId}/quizzes/${quizId}/questions`, {
          state: {
            courseId,
            courseTitle,
            quizTitle,
          },
        })
      }
      onExport={() =>
        exportRowsToExcel(exportRows, "Quizzes", `quizzes-${courseId}`)
      }
      onBackToCourses={() => navigate("/courses")}
    />
  );
}
