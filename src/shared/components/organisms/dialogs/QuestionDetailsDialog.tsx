import { X } from "lucide-react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

type QuestionDetailsDialogProps = {
  question: QuestionApiItem | null;
  loading: boolean;
  error: string | null;
  onClose: () => void;
};

export function QuestionDetailsDialog({
  question,
  loading,
  error,
  onClose,
}: QuestionDetailsDialogProps) {
  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Question details"
      onClick={onClose}
    >
      <div className="modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Modifier cette question</h3>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close details"
          >
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div className="loading-state">Loading question details...</div>
        ) : null}
        {error ? <div className="error-state">{error}</div> : null}

        {question ? (
          <div className="modal-grid">
            <div className="modal-field">
              <span className="modal-label">ID</span>
              <p className="modal-text">{question.id}</p>
            </div>

            <div className="modal-field">
              <span className="modal-label">Question</span>
              <p className="modal-text">{question.question}</p>
            </div>

            <div className="modal-two-cols">
              <div className="modal-field">
                <span className="modal-label">Type</span>
                <Badge variant="neutral">{question.question_type ?? "-"}</Badge>
              </div>
              <div className="modal-field">
                <span className="modal-label">Order</span>
                <Badge variant="neutral">
                  {question.order_num == null ? "-" : question.order_num}
                </Badge>
              </div>
            </div>

            <div className="modal-field">
              <span className="modal-label">Objectif</span>
              <p className="modal-text">
                {question.objective?.objective ?? "-"}
              </p>
            </div>

            <div className="modal-field">
              <span className="modal-label">Image</span>
              <p className="modal-text">{question.image ?? "Pas d'image"}</p>
            </div>

            <div className="modal-field">
              <span className="modal-label">Feedback</span>
              <p className="modal-text">{question.feedback ?? "-"}</p>
            </div>

            <div className="modal-two-cols">
              <div className="modal-field">
                <span className="modal-label">Question audio</span>
                <p className="modal-text">{question.question_audio ?? "-"}</p>
              </div>
              <div className="modal-field">
                <span className="modal-label">Feedback audio</span>
                <p className="modal-text">{question.feedback_audio ?? "-"}</p>
              </div>
            </div>

            <div className="modal-field">
              <span className="modal-label">Sub-questions et reponses</span>
              <div className="modal-subquestions">
                {question.sub_questions.length === 0 ? (
                  <p className="modal-text">No sub-questions.</p>
                ) : (
                  question.sub_questions.map((subQuestion) => (
                    <div
                      key={subQuestion.id}
                      className="modal-subquestion-card"
                    >
                      <div className="modal-subquestion-head">
                        <strong>
                          {subQuestion.order_num == null
                            ? "-"
                            : subQuestion.order_num}
                          . {subQuestion.question}
                        </strong>
                      </div>
                      <div className="modal-answer-list">
                        {subQuestion.answers.map((answer) => (
                          <div key={answer.id} className="modal-answer-item">
                            <Badge
                              variant={answer.is_right ? "success" : "neutral"}
                            >
                              {answer.is_right ? "Right" : "Wrong"}
                            </Badge>
                            <span>{answer.answer}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}

        <div className="modal-actions">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
