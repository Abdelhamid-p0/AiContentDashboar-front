import { Bell, Paperclip, Send, Settings } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { SearchField } from "@/shared/components/atoms/SearchField";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { QuestionCorrectionContextPopover } from "./QuestionCorrectionContextPopover";
import { QuestionCorrectionQuestionCard } from "./QuestionCorrectionQuestionCard";
import { QuestionCorrectionSummaryMessage } from "./QuestionCorrectionSummaryMessage";
import type {
  QuestionCorrectionApiResponse,
  RagContextDocument,
} from "@/features/questions/model/question-correction.types";
import type { QuestionApiItem } from "@/features/questions/model/question.types";
import type { ChatMessage } from "@/features/questions/model/question-correction-chat.types";

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
          <QuestionCorrectionQuestionCard
            title="Question originale"
            question={originalQuestion}
          />
          <QuestionCorrectionQuestionCard
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
                    <QuestionCorrectionSummaryMessage
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
            <QuestionCorrectionContextPopover
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
