import { useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import {
  DataTable,
  type DataTableColumn,
} from "@/shared/components/organisms/DataTable";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import { SettingsDialog } from "@/shared/components/organisms/dialogs/SettingsDialog";
import { QuestionDetailsDialog } from "@/shared/components/organisms/dialogs/QuestionDetailsDialog";
import { QuestionCorrectionDialog } from "@/shared/components/organisms/dialogs/QuestionCorrectionDialog";
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

type QuestionCorrectionDialogState = {
  open: boolean;
  loading: boolean;
  error: string | null;
  originalQuestion: QuestionApiItem | null;
  correctedQuestion: QuestionApiItem | null;
  corrections: string[] | null;
  explanation: string | null;
  detectedErrors: string | null;
  onClose: () => void;
  onOpenChat: () => void;
  chatEnabled: boolean;
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
  onOpenCorrection: (questionId: string) => void;
  detailsDialog: QuestionDetailsDialogState;
  correctionDialog: QuestionCorrectionDialogState;
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
  onOpenCorrection,
  detailsDialog,
  correctionDialog,
}: QuizQuestionsViewProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        render: () => <Badge variant="neutral">Ready</Badge>,
      },
      {
        key: "actions",
        label: "Action",
        width: "10%",
        align: "right",
        render: (question) => (
          <div className="row-actions">
            <Button
              variant="ghost"
              icon={<Eye size={16} />}
              onClick={() => onOpenDetails(question.id)}
            >
              View
            </Button>
            <Button
              variant="secondary"
              onClick={() => onOpenCorrection(question.id)}
            >
              Ask AI
            </Button>
          </div>
        ),
      },
    ],
    [onOpenCorrection, onOpenDetails],
  );

  return (
    <>
      <DashboardShell
        title={quizTitle}
        subtitle="Questions list for the selected quiz. Use View to open complete question details in a popup."
        actionLabel="Export Excel"
        onExport={onExport}
        onToggleSettings={() => setSettingsOpen((current) => !current)}
      >
        <div className="layout">
          <div className="toolbar">
            <div className="toolbar-left">
              <Badge variant="neutral">{questions.length} questions</Badge>
              <Badge variant="success">
                API /api/v1/quizzes/{quizId}/questions
              </Badge>
            </div>

            <div className="toolbar-right">
              <Button variant="ghost" onClick={onBackToQuizzes}>
                Back to quizzes
              </Button>
            </div>
          </div>

          {error ? <div className="error-state">{error}</div> : null}
          {loading ? (
            <div className="loading-state">Loading questions...</div>
          ) : (
            <DataTable
              columns={columns}
              data={questions}
              emptyMessage="No questions found for this quiz."
            />
          )}
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

      {correctionDialog.open ? (
        <QuestionCorrectionDialog
          originalQuestion={correctionDialog.originalQuestion}
          correctedQuestion={correctionDialog.correctedQuestion}
          corrections={correctionDialog.corrections}
          explanation={correctionDialog.explanation}
          detectedErrors={correctionDialog.detectedErrors}
          loading={correctionDialog.loading}
          error={correctionDialog.error}
          onClose={correctionDialog.onClose}
          onOpenChat={correctionDialog.onOpenChat}
          chatEnabled={correctionDialog.chatEnabled}
        />
      ) : null}
    </>
  );
}
