import { Bell, Paperclip, Send, Settings, Star } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { SearchField } from "@/shared/components/atoms/SearchField";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import type {
  QuestionCorrectionApiResponse,
  RagContextDocument,
} from "@/features/questions/model/question-correction.types";
import type { QuestionApiItem } from "@/features/questions/model/question.types";
import { useEffect, useId, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type QuestionCorrectionChatViewProps = {
  title: string;
  subtitle: string;
  questionId: string;
  originalQuestion: QuestionApiItem | null;
  correctedQuestion: QuestionApiItem | null;
  corrections: string[] | null;
  explanation: string | null;
  detectedErrors: string | null;
  ragContext: RagContextDocument[] | null;
  correctionResponse: QuestionCorrectionApiResponse | null;
  loading: boolean;
  error: string | null;
  messages: ChatMessage[];
  messageValue: string;
  sending: boolean;
  sendDisabled: boolean;
  feedbackRating: number | null;
  feedbackComment: string;
  feedbackSending: boolean;
  feedbackSubmitted: boolean;
  feedbackError: string | null;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onFeedbackRatingChange: (rating: number) => void;
  onFeedbackCommentChange: (value: string) => void;
  onSubmitFeedback: () => void;
  onBack: () => void;
};

function QuestionDetailCard({
  title,
  question,
}: {
  title: string;
  question: QuestionApiItem | null;
}) {
  const subQuestions = Array.isArray(question?.sub_questions)
    ? question.sub_questions
    : [];

  return (
    <div className="chatgpt-question-card">
      <div className="chatgpt-question-head">
        <span className="chatgpt-question-title">{title}</span>
        <span className="chatgpt-question-type">
          {question?.question_type ?? "-"}
        </span>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Question</span>
        <p className="chatgpt-field-value">{question?.question ?? "-"}</p>
      </div>
      <div className="chatgpt-field-grid">
        <div className="chatgpt-field">
          <span className="chatgpt-field-label">Order</span>
          <span className="chatgpt-field-value">
            {question?.order_num ?? "-"}
          </span>
        </div>
        <div className="chatgpt-field">
          <span className="chatgpt-field-label">Type</span>
          <span className="chatgpt-field-value">
            {question?.question_type ?? "-"}
          </span>
        </div>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Objectif</span>
        <p className="chatgpt-field-value">
          {question?.objective?.objective ?? "-"}
        </p>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Feedback</span>
        <p className="chatgpt-field-value">{question?.feedback ?? "-"}</p>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Sub-questions et reponses</span>
        <div className="chatgpt-subquestions">
          {subQuestions.length ? (
            subQuestions.map((subQuestion) => (
              <div key={subQuestion.id} className="chatgpt-subquestion">
                <div className="chatgpt-subquestion-title">
                  {subQuestion.order_num ?? "-"}. {subQuestion.question}
                </div>
                <div className="chatgpt-answers">
                  {(Array.isArray(subQuestion.answers)
                    ? subQuestion.answers
                    : []
                  ).map((answer) => (
                    <span
                      key={answer.id}
                      className={`chatgpt-answer${
                        answer.is_right ? " is-right" : ""
                      }`}
                    >
                      {answer.answer}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="chatgpt-field-value">-</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryMessage({
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
}: {
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
}) {
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
        <FeedbackPanel
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

function ContextPopover({
  open,
  id,
  questionId,
  ragContext,
  loading,
  error,
}: {
  open: boolean;
  id: string;
  questionId: string;
  ragContext: RagContextDocument[] | null;
  loading: boolean;
  error: string | null;
}) {
  if (!open) {
    return null;
  }

  const ragDocuments = Array.isArray(ragContext) ? ragContext : [];

  return (
    <div
      id={id}
      className="chatgpt-context-popover"
      role="dialog"
      aria-modal="false"
      aria-label="Context attached to the correction prompt"
    >
      <div className="chatgpt-context-header">
        <div>
          <div className="chatgpt-context-kicker">Attached context</div>
          <h4 className="chatgpt-context-title">Prompt payload</h4>
        </div>
        <span className="chatgpt-context-chip">Question {questionId}</span>
      </div>

      <p className="chatgpt-context-note">
        These attached documents are sent with the next AI request.
      </p>

      {loading ? (
        <div className="chatgpt-context-status">Loading context...</div>
      ) : null}
      {error ? (
        <div className="chatgpt-context-status is-error">{error}</div>
      ) : null}

      <div className="chatgpt-context-grid">
        <div className="chatgpt-context-item chatgpt-context-item-full">
          <span className="chatgpt-context-label">RAG context</span>
          {ragDocuments.length ? (
            <div className="chatgpt-rag-list">
              {ragDocuments.map((document, index) => (
                <article
                  key={`${document.title}-${document.document_type}-${index}`}
                  className="chatgpt-rag-item"
                >
                  <div className="chatgpt-rag-item-header">
                    <span className="chatgpt-rag-item-title">
                      {document.title}
                    </span>
                    <span className="chatgpt-rag-item-chip">
                      {document.document_type}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="chatgpt-context-value">-</p>
          )}
        </div>
      </div>
    </div>
  );
}

function FeedbackPanel({
  enabled,
  rating,
  comment,
  sending,
  submitted,
  error,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: {
  enabled: boolean;
  rating: number | null;
  comment: string;
  sending: boolean;
  submitted: boolean;
  error: string | null;
  onRatingChange: (rating: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}) {
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

export function QuestionCorrectionChatView({
  title,
  subtitle,
  questionId,
  originalQuestion,
  correctedQuestion,
  corrections,
  explanation,
  detectedErrors,
  ragContext,
  correctionResponse,
  loading,
  error,
  messages,
  messageValue,
  sending,
  sendDisabled,
  feedbackRating,
  feedbackComment,
  feedbackSending,
  feedbackSubmitted,
  feedbackError,
  onMessageChange,
  onSendMessage,
  onFeedbackRatingChange,
  onFeedbackCommentChange,
  onSubmitFeedback,
  onBack,
}: QuestionCorrectionChatViewProps) {
  const historyRef = useRef<HTMLDivElement | null>(null);
  const composerRef = useRef<HTMLDivElement | null>(null);
  const contextPopoverId = useId();
  const [contextOpen, setContextOpen] = useState(false);
  // Build displayed messages: original messages plus a synthesized assistant
  // message with the correction summary so it appears in the chat stream.
  const displayedMessages = useMemo(() => {
    const list = [...messages];

    const hasSummary = list.some((m) => m.id === "correction-summary");

    const parts: string[] = [];
    if (detectedErrors) parts.push(`Erreurs détectées: ${detectedErrors}`);
    if (explanation) parts.push(`Explication: ${explanation}`);
    if (corrections && corrections.length)
      parts.push(`Corrections: ${corrections.join("; ")}`);

    if (!hasSummary && parts.length) {
      list.push({
        id: "correction-summary",
        role: "assistant",
        content: parts.join("\n\n"),
      });
    }

    return list;
  }, [messages, corrections, explanation, detectedErrors]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [displayedMessages]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (composerRef.current?.contains(target)) {
        return;
      }

      setContextOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setContextOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      actionLabel="Export Excel"
      variant="chat"
      hideHeader
    >
      <div className="chatgpt-shell">
        <div className="chatgpt-topbar">
          <SearchField placeholder="Search conversations..." />
          <div className="chatgpt-actions">
            <IconButton icon={<Bell size={16} />} label="Notifications" />
            <IconButton icon={<Settings size={16} />} label="Settings" />
            <span className="chatgpt-title">AI Assistant</span>
            <span className="chatgpt-pill">
              {sending ? "Thinking" : "Ready"}
            </span>
            <Button variant="ghost" onClick={onBack}>
              Back to questions
            </Button>
          </div>
        </div>

        {error ? <div className="chatgpt-notice">{error}</div> : null}
        {loading ? (
          <div className="chatgpt-notice">Loading AI correction...</div>
        ) : null}

        <div className="chatgpt-compare">
          <QuestionDetailCard
            title="Question originale"
            question={originalQuestion}
          />
          <QuestionDetailCard
            title="Question amelioree"
            question={correctedQuestion}
          />
        </div>

        <div className="chatgpt-main">
          <div className="chatgpt-history" ref={historyRef}>
            {displayedMessages.length === 0 ? (
              <p className="chatgpt-empty">No messages yet.</p>
            ) : (
              displayedMessages.map((message) => (
                <div
                  key={message.id}
                  className={`chatgpt-bubble chatgpt-bubble-${message.role}`}
                >
                  <span className="chatgpt-role">
                    {message.role === "user" ? "You" : "AI"}
                  </span>
                  {message.id === "correction-summary" ? (
                    <SummaryMessage
                      content={message.content}
                      feedbackEnabled={Boolean(correctionResponse)}
                      feedbackRating={feedbackRating}
                      feedbackComment={feedbackComment}
                      feedbackSending={feedbackSending}
                      feedbackSubmitted={feedbackSubmitted}
                      feedbackError={feedbackError}
                      onFeedbackRatingChange={onFeedbackRatingChange}
                      onFeedbackCommentChange={onFeedbackCommentChange}
                      onSubmitFeedback={onSubmitFeedback}
                    />
                  ) : (
                    <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="chatgpt-composer" ref={composerRef}>
            <ContextPopover
              open={contextOpen}
              id={contextPopoverId}
              questionId={questionId}
              ragContext={ragContext}
              loading={loading}
              error={error}
            />
            <div className="chatgpt-input-row">
              <textarea
                className="chatgpt-textarea"
                placeholder="Ex: Simplifie la question pour des eleves de 12 ans et propose une reponse plus courte."
                value={messageValue}
                onChange={(event) => onMessageChange(event.target.value)}
                rows={3}
              />
              <div className="chatgpt-send-group">
                <IconButton
                  icon={<Paperclip size={16} />}
                  label="Show attached context"
                  variant="primary"
                  className="chatgpt-context-trigger"
                  aria-expanded={contextOpen}
                  aria-controls={contextPopoverId}
                  onClick={() => setContextOpen((current) => !current)}
                />
                <Button
                  variant="primary"
                  className="chatgpt-send"
                  icon={<Send size={16} />}
                  iconPosition="right"
                  onClick={onSendMessage}
                  disabled={sendDisabled}
                >
                  Send
                </Button>
              </div>
            </div>
            {/* summary moved into chat stream as assistant message */}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
