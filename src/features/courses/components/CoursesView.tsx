import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { SearchField } from "@/shared/components/atoms/SearchField";
import { SelectField } from "@/shared/components/atoms/SelectField";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/organisms/DataTable";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import { Pagination } from "@/shared/components/organisms/Pagination";
import { SettingsDialog } from "@/shared/components/organisms/dialogs/SettingsDialog";
import type {
  CourseRow,
  CourseStatusFilter,
  FilterOption,
  SemesterFilter,
} from "@/features/courses/model/course.types";

const statusOptions: Array<{ label: string; value: CourseStatusFilter }> = [
  { label: "All", value: "ALL" },
  { label: "Active", value: "ACTIVE" },
  { label: "Inactive", value: "INACTIVE" },
];

type CoursesViewProps = {
  courses: CourseRow[];
  filterOptions: {
    levels: FilterOption[];
    subjects: FilterOption[];
    semesters: FilterOption[];
  };
  page: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  loading: boolean;
  error: string | null;
  search: string;
  semester: SemesterFilter;
  levelId: string;
  subjectId: string;
  status: CourseStatusFilter;
  onSearchChange: (value: string) => void;
  onSemesterChange: (value: SemesterFilter) => void;
  onLevelChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onStatusChange: (value: CourseStatusFilter) => void;
  onPageChange: (page: number) => void;
  onResetFilters: () => void;
  onExport: () => void;
  onOpenQuizzes: (courseId: string, courseTitle: string) => void;
};

export function CoursesView({
  courses,
  filterOptions,
  page,
  pageSize,
  totalPages,
  totalElements,
  loading,
  error,
  search,
  semester,
  levelId,
  subjectId,
  status,
  onSearchChange,
  onSemesterChange,
  onLevelChange,
  onSubjectChange,
  onStatusChange,
  onPageChange,
  onResetFilters,
  onExport,
  onOpenQuizzes,
}: CoursesViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

  const semesterOptions = useMemo(
    () => [
      { label: "All semesters", value: "ALL" },
      ...filterOptions.semesters,
    ],
    [filterOptions.semesters],
  );
  const levelOptions = useMemo(
    () => [{ label: "All levels", value: "ALL" }, ...filterOptions.levels],
    [filterOptions.levels],
  );
  const subjectOptions = useMemo(
    () => [{ label: "All subjects", value: "ALL" }, ...filterOptions.subjects],
    [filterOptions.subjects],
  );

  const selectedLevelLabel =
    filterOptions.levels.find((option) => option.value === levelId)?.label ??
    levelId;
  const selectedSubjectLabel =
    filterOptions.subjects.find((option) => option.value === subjectId)
      ?.label ?? subjectId;

  const columns = useMemo<DataTableColumn<CourseRow>[]>(
    () => [
      { key: "title", label: "Course", width: "28%", align: "left" },
      { key: "domain", label: "Domain", width: "24%", align: "left" },
      { key: "semester", label: "Semester", width: "14%", align: "left" },
      {
        key: "active",
        label: "Status",
        width: "12%",
        render: (course) => (
          <Badge variant={course.active ? "success" : "danger"} dot>
            {course.active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      { key: "orderNum", label: "Order", width: "10%", align: "center" },
      {
        key: "actions",
        label: "Action",
        width: "12%",
        align: "right",
        render: (course) => (
          <div className="row-actions">
            <IconButton
              icon={<Eye size={16} />}
              label="View quizzes"
              onClick={() => onOpenQuizzes(course.id, course.title)}
            />
            <IconButton
              icon={<Pencil size={16} />}
              label="Edit course"
              disabled
            />
            <IconButton
              icon={<Trash2 size={16} />}
              label="Delete course"
              disabled
            />
          </div>
        ),
      },
    ],
    [onOpenQuizzes],
  );

  return (
    <DashboardShell
      title="Courses"
      subtitle="Explore the course catalog, filter what you need, and jump into the quizzes for any course."
      actionLabel="Exporter"
      onExport={onExport}
      onToggleSettings={() => setSettingsOpen((current) => !current)}
    >
      <div className="filters-bar">
        <div className="filters-group">
          <SearchField
            placeholder="Search a course"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          <SelectField
            value={semester}
            onChange={(event) =>
              onSemesterChange(event.target.value as SemesterFilter)
            }
          >
            {semesterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={subjectId || "ALL"}
            onChange={(event) =>
              onSubjectChange(
                event.target.value === "ALL" ? "" : event.target.value,
              )
            }
          >
            {subjectOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={levelId || "ALL"}
            onChange={(event) =>
              onLevelChange(
                event.target.value === "ALL" ? "" : event.target.value,
              )
            }
          >
            {levelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          <SelectField
            value={status}
            onChange={(event) =>
              onStatusChange(event.target.value as CourseStatusFilter)
            }
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
        </div>
        <div className="filters-actions">
          <Button variant="secondary" onClick={onResetFilters}>
            Clear filters
          </Button>
          <Button variant="primary" disabled>
            Create course
          </Button>
        </div>
      </div>

      {error ? <div className="error-state">{error}</div> : null}
      {loading ? (
        <div className="loading-state">Loading courses...</div>
      ) : (
        <DataTable
          columns={columns}
          data={courses}
          emptyMessage="No courses match the selected filters."
        />
      )}

      <div className="table-footer">
        <div className="pagination-info">
          Page {page + 1} of {Math.max(totalPages, 1)} · {totalElements} courses
          {` · ${pageSize} per page`}
          {subjectId ? ` · Subject: ${selectedSubjectLabel}` : ""}
          {levelId ? ` · Level: ${selectedLevelLabel}` : ""}
          {semester !== "ALL" ? ` · Semester: ${semester}` : ""}
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      <SettingsDialog
        open={settingsOpen}
        items={[
          { label: "Connected API", value: "/api" },
          { label: "Proxy target", value: "localhost:8080" },
        ]}
        onClose={() => setSettingsOpen(false)}
      />
    </DashboardShell>
  );
}
