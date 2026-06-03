import { Bell, Send, Settings } from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { SearchField } from "@/shared/components/atoms/SearchField";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import type { QuestionApiItem } from "@/features/questions/model/question.types";
import { useEffect, useMemo, useRef } from "react";

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
  loading: boolean;
  error: string | null;
  messages: ChatMessage[];
  messageValue: string;
  sending: boolean;
  sendDisabled: boolean;
  onMessageChange: (value: string) => void;
  onSendMessage: () => void;
  onBack: () => void;
};

function QuestionDetailCard({
  title,
  question,
}: {
  title: string;
  question: QuestionApiItem | null;
}) {
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
          {question?.sub_questions?.length ? (
            question.sub_questions.map((subQuestion) => (
              <div key={subQuestion.id} className="chatgpt-subquestion">
                <div className="chatgpt-subquestion-title">
                  {subQuestion.order_num ?? "-"}. {subQuestion.question}
                </div>
                <div className="chatgpt-answers">
                  {subQuestion.answers.map((answer) => (
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

function SummaryMessage({ content }: { content: string }) {
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
    </div>
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
  loading,
  error,
  messages,
  messageValue,
  sending,
  sendDisabled,
  onMessageChange,
  onSendMessage,
  onBack,
}: QuestionCorrectionChatViewProps) {
  const historyRef = useRef<HTMLDivElement | null>(null);
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
                    <SummaryMessage content={message.content} />
                  ) : (
                    <p style={{ whiteSpace: "pre-wrap" }}>{message.content}</p>
                  )}
                </div>
              ))
            )}
          </div>

          <div className="chatgpt-composer">
            <div className="chatgpt-input-row">
              <textarea
                className="chatgpt-textarea"
                placeholder="Ex: Simplifie la question pour des eleves de 12 ans et propose une reponse plus courte."
                value={messageValue}
                onChange={(event) => onMessageChange(event.target.value)}
                rows={3}
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
            {/* summary moved into chat stream as assistant message */}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
