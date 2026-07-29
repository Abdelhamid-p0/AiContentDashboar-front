import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { exportRowsToExcel } from "@/shared/lib/excel";
import { CoursesView } from "../components";
import { useCoursesPage } from "../hooks/useCoursesPage";

export function CoursesPage() {
  const navigate = useNavigate();
  const {
    courses,
    filterOptions,
    page,
    pageSize,
    totalPages,
    totalElements,
    loading,
    error,
    search,
    setSearch,
    semester,
    setSemester,
    levelId,
    setLevelId,
    subjectId,
    setSubjectId,
    status,
    setStatus,
    setPage,
  } = useCoursesPage();

  const exportRows = useMemo(
    () =>
      courses.map((course) => ({
        Course: course.title,
        Domain: course.domain,
        Semester: course.semester,
        Status: course.active ? "Active" : "Inactive",
        Order: course.orderNum,
      })),
    [courses],
  );

  return (
    <CoursesView
      courses={courses}
      filterOptions={filterOptions}
      page={page}
      pageSize={pageSize}
      totalPages={totalPages}
      totalElements={totalElements}
      loading={loading}
      error={error}
      search={search}
      semester={semester}
      levelId={levelId}
      subjectId={subjectId}
      status={status}
      onSearchChange={setSearch}
      onSemesterChange={(value) => {
        setSemester(value);
        setPage(0);
      }}
      onLevelChange={(value) => {
        setLevelId(value);
        setPage(0);
      }}
      onSubjectChange={(value) => {
        setSubjectId(value);
        setPage(0);
      }}
      onStatusChange={setStatus}
      onPageChange={setPage}
      onResetFilters={() => {
        setSearch("");
        setSemester("ALL");
        setLevelId("");
        setSubjectId("");
        setStatus("ALL");
        setPage(0);
      }}
      onExport={() => exportRowsToExcel(exportRows, "Courses", "courses-table")}
      onOpenQuizzes={(courseId, courseTitle) =>
        navigate(`/courses/${courseId}/quizzes`, {
          state: { courseTitle },
        })
      }
    />
  );
}
