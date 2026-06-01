import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { SegmentedControl } from "@/shared/components/molecules/SegmentedControl";
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

  const columns = useMemo<DataTableColumn<QuizRow>[]>(
    () => [
      { key: "title", label: "Quiz title", width: "70%", align: "left" },
      {
        key: "type",
        label: "Type",
        width: "20%",
        render: (quiz) => (
          <Badge variant={quiz.type === "FLASHCARD" ? "warning" : "neutral"}>
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
          <Button
            variant="ghost"
            icon={<Eye size={16} />}
            onClick={() => onOpenQuestions(quiz.id, quiz.title)}
          >
            View
          </Button>
        ),
      },
    ],
    [onOpenQuestions],
  );

  return (
    <DashboardShell
      title={courseTitle}
      subtitle="Switch between Flashcards and Quiz to inspect the course structure."
      actionLabel="Export Excel"
      onExport={onExport}
      onToggleSettings={() => setSettingsOpen((current) => !current)}
    >
      <div className="layout">
        <div className="toolbar">
          <div className="toolbar-left">
            <SegmentedControl
              options={quizTypeOptions}
              value={selectedType}
              onChange={onTypeChange}
            />
            <Button variant="ghost" onClick={onShowAll}>
              Show all
            </Button>
          </div>

          <div className="toolbar-right">
            <Badge variant="neutral">{quizzes.length} items</Badge>
            <Badge variant="warning">Grouped by type</Badge>
          </div>
        </div>

        {error ? <div className="error-state">{error}</div> : null}
        {loading ? (
          <div className="loading-state">Loading quizzes...</div>
        ) : (
          <DataTable
            columns={columns}
            data={quizzes}
            emptyMessage="No quizzes match this type filter."
          />
        )}

        <div className="page-footer">
          <div className="pagination-info">
            Filtered view for course <strong>{courseTitle}</strong>
          </div>
          <div className="toolbar-actions">
            <Button variant="ghost" onClick={onBackToCourses}>
              Back to courses
            </Button>
            <Button variant="secondary" onClick={onExport}>
              Export visible rows
            </Button>
          </div>
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
