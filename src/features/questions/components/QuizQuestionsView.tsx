import { useMemo, useState } from "react";
import { Eye, Pencil, Sparkles, Trash2 } from "lucide-react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { SearchField } from "@/shared/components/atoms/SearchField";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/organisms/DataTable";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import { SettingsDialog } from "@/shared/components/organisms/dialogs/SettingsDialog";
import { QuestionDetailsDialog } from "@/shared/components/organisms/dialogs/QuestionDetailsDialog";
import type {
  QuestionApiItem,
  QuestionRow,
} from "@/features/questions/model/question.types";

type QuestionDetailsDialogState = {
  open: boolean;
  loading: boolean;
  error: string | null;
  question: QuestionApiItem | null;
  onClose: () => void;
};

type QuizQuestionsViewProps = {
  quizId: string;
  quizTitle: string;
  courseTitle: string;
  questions: QuestionRow[];
  loading: boolean;
  error: string | null;
  onBackToQuizzes: () => void;
  onExport: () => void;
  onOpenDetails: (questionId: string) => void;
  onOpenChat: (questionId: string) => void;
  detailsDialog: QuestionDetailsDialogState;
};

export function QuizQuestionsView({
  quizId,
  quizTitle,
  courseTitle,
  questions,
  loading,
  error,
  onBackToQuizzes,
  onExport,
  onOpenDetails,
  onOpenChat,
  detailsDialog,
}: QuizQuestionsViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredQuestions = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return questions;
    }

    return questions.filter((question) =>
      question.question.toLowerCase().includes(normalized),
    );
  }, [questions, search]);

  const columns = useMemo<DataTableColumn<QuestionRow>[]>(
    () => [
      { key: "order", label: "Order", width: "9%", align: "center" },
      { key: "question", label: "Question", width: "39%", align: "left" },
      { key: "questionType", label: "Type", width: "14%" },
      { key: "objective", label: "Objective", width: "18%", align: "left" },
      {
        key: "answersCount",
        label: "Status",
        width: "10%",
        align: "center",
        render: () => (
          <Badge variant="success" dot>
            Ready
          </Badge>
        ),
      },
      {
        key: "actions",
        label: "Action",
        width: "10%",
        align: "right",
        render: (question) => (
          <div className="row-actions">
            <IconButton
              icon={<Eye size={16} />}
              label="View question"
              onClick={() => onOpenDetails(question.id)}
            />
            <IconButton
              icon={<Sparkles size={16} />}
              label="Ask AI"
              onClick={() => onOpenChat(question.id)}
            />
            <IconButton
              icon={<Pencil size={16} />}
              label="Edit question"
              disabled
            />
            <IconButton
              icon={<Trash2 size={16} />}
              label="Delete question"
              disabled
            />
          </div>
        ),
      },
    ],
    [onOpenChat, onOpenDetails],
  );

  return (
    <>
      <DashboardShell
        title={quizTitle}
        subtitle="Questions list for the selected quiz. Use View to open complete question details in a popup."
        actionLabel="Exporter"
        onExport={onExport}
        onToggleSettings={() => setSettingsOpen((current) => !current)}
      >
        <div className="filters-bar">
          <div className="filters-group">
            <SearchField
              placeholder="Search a question"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Badge variant="neutral">
              {filteredQuestions.length} questions
            </Badge>
            <Badge variant="success" dot>
              API /api/v1/quizzes/{quizId}/questions
            </Badge>
          </div>
          <div className="filters-actions">
            <Button variant="ghost" onClick={onBackToQuizzes}>
              Back to quizzes
            </Button>
            <Button variant="primary" disabled>
              Create question
            </Button>
          </div>
        </div>

        {error ? <div className="error-state">{error}</div> : null}
        {loading ? (
          <div className="loading-state">Loading questions...</div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredQuestions}
            emptyMessage="No questions found for this quiz."
          />
        )}

        <div className="table-footer">
          <div className="pagination-info">
            Course: {courseTitle} · Quiz: {quizTitle}
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
            { label: "Course", value: courseTitle },
            {
              label: "Endpoint",
              value: `/api/v1/quizzes/${quizId}/questions`,
            },
          ]}
          onClose={() => setSettingsOpen(false)}
        />
      </DashboardShell>

      {detailsDialog.open ? (
        <QuestionDetailsDialog
          question={detailsDialog.question}
          loading={detailsDialog.loading}
          error={detailsDialog.error}
          onClose={detailsDialog.onClose}
        />
      ) : null}
    </>
  );
}
