import { Star } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";

type QuestionCorrectionFeedbackPanelProps = {
  enabled: boolean;
  rating: number | null;
  comment: string;
  sending: boolean;
  submitted: boolean;
  error: string | null;
  onRatingChange: (rating: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
};

export function QuestionCorrectionFeedbackPanel({
  enabled,
  rating,
  comment,
  sending,
  submitted,
  error,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: QuestionCorrectionFeedbackPanelProps) {
  const canSubmit = enabled && rating != null && !sending && !submitted;

  return (
    <section className="chatgpt-feedback-card" aria-label="Correction feedback">
      <div className="chatgpt-feedback-head">
        <div>
          <div className="chatgpt-feedback-kicker">Feedback</div>
          <h4 className="chatgpt-feedback-title">Rate this correction</h4>
        </div>
        <span className="chatgpt-feedback-note">5 stars + comment</span>
      </div>

      <div
        className="chatgpt-rating"
        role="radiogroup"
        aria-label="Rating from 1 to 5 stars"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const value = index + 1;
          const selected = rating != null && value <= rating;

          return (
            <button
              key={value}
              type="button"
              className={`chatgpt-star${selected ? " is-selected" : ""}`}
              onClick={() => onRatingChange(value)}
              aria-label={`${value} star${value > 1 ? "s" : ""}`}
              aria-pressed={rating === value}
              disabled={!enabled}
            >
              <Star size={18} fill={selected ? "currentColor" : "none"} />
            </button>
          );
        })}
      </div>

      <textarea
        className="chatgpt-feedback-textarea"
        placeholder="Add an optional comment about what should be improved..."
        value={comment}
        onChange={(event) => onCommentChange(event.target.value)}
        rows={3}
        disabled={!enabled}
      />

      <div className="chatgpt-feedback-actions">
        <Button variant="secondary" onClick={onSubmit} disabled={!canSubmit}>
          {sending
            ? "Sending..."
            : submitted
              ? "Feedback sent"
              : "Submit feedback"}
        </Button>
        {submitted ? (
          <span className="chatgpt-feedback-success">
            Thanks for your feedback.
          </span>
        ) : error ? (
          <span className="chatgpt-feedback-error">{error}</span>
        ) : (
          <span className="chatgpt-feedback-hint">Stored in Neon.</span>
        )}
      </div>
    </section>
  );
}
