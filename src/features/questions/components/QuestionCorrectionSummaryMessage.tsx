import { QuestionCorrectionFeedbackPanel } from "./QuestionCorrectionFeedbackPanel";

type QuestionCorrectionSummaryMessageProps = {
  content: string;
  feedbackEnabled: boolean;
  feedbackRating: number | null;
  feedbackComment: string;
  feedbackSending: boolean;
  feedbackSubmitted: boolean;
  feedbackError: string | null;
  onFeedbackRatingChange: (rating: number) => void;
  onFeedbackCommentChange: (value: string) => void;
  onSubmitFeedback: () => void;
};

export function QuestionCorrectionSummaryMessage({
  content,
  feedbackEnabled,
  feedbackRating,
  feedbackComment,
  feedbackSending,
  feedbackSubmitted,
  feedbackError,
  onFeedbackRatingChange,
  onFeedbackCommentChange,
  onSubmitFeedback,
}: QuestionCorrectionSummaryMessageProps) {
  const sections = content
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [rawLabel, ...rest] = part.split(":");
      const label = rawLabel?.trim();
      const value = rest.join(":").trim();
      return { label, value };
    });

  return (
    <div className="chatgpt-summary-message">
      <div className="chatgpt-summary-head">
        <span className="chatgpt-summary-badge">LLM feedback</span>
        <span className="chatgpt-summary-note">Correction summary</span>
      </div>
      <div className="chatgpt-summary-sections">
        {sections.map((section) => (
          <div key={section.label} className="chatgpt-summary-section">
            <div className="chatgpt-summary-section-label">{section.label}</div>
            <div className="chatgpt-summary-section-value">
              {section.value || "-"}
            </div>
          </div>
        ))}
      </div>

      <div className="chatgpt-summary-feedback">
        <QuestionCorrectionFeedbackPanel
          enabled={feedbackEnabled}
          rating={feedbackRating}
          comment={feedbackComment}
          sending={feedbackSending}
          submitted={feedbackSubmitted}
          error={feedbackError}
          onRatingChange={onFeedbackRatingChange}
          onCommentChange={onFeedbackCommentChange}
          onSubmit={onSubmitFeedback}
        />
      </div>
    </div>
  );
}
