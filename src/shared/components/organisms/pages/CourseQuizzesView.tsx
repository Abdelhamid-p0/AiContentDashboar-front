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
import { SettingsDialog } from "@/shared/components/organisms/dialogs/SettingsDialog";
import type {
  QuizRow,
  QuizTypeFilter,
} from "@/features/quizzes/model/quiz.types";

const quizTypeOptions: Array<{ label: string; value: QuizTypeFilter }> = [
  { label: "All types", value: "ALL" },
  { label: "Flashcards", value: "FLASHCARD" },
  { label: "Quiz", value: "QUIZ" },
];

type CourseQuizzesViewProps = {
  courseId: string;
  courseTitle: string;
  quizzes: QuizRow[];
  loading: boolean;
  error: string | null;
  selectedType: QuizTypeFilter;
  onTypeChange: (value: QuizTypeFilter) => void;
  onShowAll: () => void;
  onOpenQuestions: (quizId: string, quizTitle: string) => void;
  onExport: () => void;
  onBackToCourses: () => void;
};

export function CourseQuizzesView({
  courseId,
  courseTitle,
  quizzes,
  loading,
  error,
  selectedType,
  onTypeChange,
  onShowAll,
  onOpenQuestions,
  onExport,
  onBackToCourses,
}: CourseQuizzesViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredQuizzes = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return quizzes;
    }

    return quizzes.filter((quiz) =>
      quiz.title.toLowerCase().includes(normalized),
    );
  }, [quizzes, search]);

  const columns = useMemo<DataTableColumn<QuizRow>[]>(
    () => [
      { key: "title", label: "Quiz title", width: "70%", align: "left" },
      {
        key: "type",
        label: "Type",
        width: "20%",
        render: (quiz) => (
          <Badge
            variant={quiz.type === "FLASHCARD" ? "warning" : "neutral"}
            dot
          >
            {quiz.type}
          </Badge>
        ),
      },
      {
        key: "actions",
        label: "Action",
        width: "10%",
        align: "right",
        render: (quiz) => (
          <div className="row-actions">
            <IconButton
              icon={<Eye size={16} />}
              label="View questions"
              onClick={() => onOpenQuestions(quiz.id, quiz.title)}
            />
            <IconButton
              icon={<Pencil size={16} />}
              label="Edit quiz"
              disabled
            />
            <IconButton
              icon={<Trash2 size={16} />}
              label="Delete quiz"
              disabled
            />
          </div>
        ),
      },
    ],
    [onOpenQuestions],
  );

  return (
    <DashboardShell
      title={courseTitle}
      subtitle="Switch between Flashcards and Quiz to inspect the course structure."
      actionLabel="Exporter"
      onExport={onExport}
      onToggleSettings={() => setSettingsOpen((current) => !current)}
    >
      <div className="filters-bar">
        <div className="filters-group">
          <SearchField
            placeholder="Search a quiz"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <SelectField
            value={selectedType}
            onChange={(event) =>
              onTypeChange(event.target.value as QuizTypeFilter)
            }
          >
            {quizTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </SelectField>
          {selectedType !== "ALL" ? (
            <Button variant="ghost" onClick={onShowAll}>
              Show all
            </Button>
          ) : null}
        </div>
        <div className="filters-actions">
          <Button variant="ghost" onClick={onBackToCourses}>
            Back to courses
          </Button>
          <Button variant="primary" disabled>
            Create quiz
          </Button>
        </div>
      </div>

      {error ? <div className="error-state">{error}</div> : null}
      {loading ? (
        <div className="loading-state">Loading quizzes...</div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredQuizzes}
          emptyMessage="No quizzes match this filter."
        />
      )}

      <div className="table-footer">
        <div className="pagination-info">
          Showing {filteredQuizzes.length} quizzes for {courseTitle}
        </div>
        <div className="filters-actions">
          <Button variant="secondary" onClick={onExport}>
            Export visible rows
          </Button>
        </div>
      </div>

      <SettingsDialog
        open={settingsOpen}
        items={[
          { label: "Selected course", value: courseTitle },
          {
            label: "Endpoint",
            value: `/api/v1/courses/${courseId}/quizzes`,
          },
        ]}
        onClose={() => setSettingsOpen(false)}
      />
    </DashboardShell>
  );
}
