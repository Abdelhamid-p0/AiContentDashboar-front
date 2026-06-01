import { X } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";
import { QuestionCorrectionContent } from "@/shared/components/organisms/QuestionCorrectionContent";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

type QuestionCorrectionDialogProps = {
  originalQuestion: QuestionApiItem | null;
  correctedQuestion: QuestionApiItem | null;
  corrections: string[] | null;
  explanation: string | null;
  detectedErrors: string | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onOpenChat: () => void;
  chatEnabled: boolean;
};

export function QuestionCorrectionDialog({
  originalQuestion,
  correctedQuestion,
  corrections,
  explanation,
  detectedErrors,
  loading,
  error,
  onClose,
  onOpenChat,
  chatEnabled,
}: QuestionCorrectionDialogProps) {
  const isChatDisabled = loading || !!error || !chatEnabled;

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Ask AI question comparison"
      onClick={onClose}
    >
      <div
        className="modal-card modal-card-large"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Ask AI</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close comparison"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading AI correction...</div>
        ) : null}
        {error ? <div className="error-state">{error}</div> : null}
        <QuestionCorrectionContent
          originalQuestion={originalQuestion}
          correctedQuestion={correctedQuestion}
          corrections={corrections}
          explanation={explanation}
          detectedErrors={detectedErrors}
        />

        <div className="modal-actions">
          <Button
            variant="secondary"
            onClick={onOpenChat}
            disabled={isChatDisabled}
          >
            Chatbot
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
