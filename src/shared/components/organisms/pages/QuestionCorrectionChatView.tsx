import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import { QuestionCorrectionContent } from "@/shared/components/organisms/QuestionCorrectionContent";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

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
  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      actionLabel="Export Excel"
    >
      <div className="layout">
        <div className="toolbar">
          <div className="toolbar-left">
            <Badge variant="neutral">Question {questionId}</Badge>
            <Badge variant="success">Ask AI + Chatbot</Badge>
          </div>
          <div className="toolbar-right">
            <Button variant="ghost" onClick={onBack}>
              Back to questions
            </Button>
          </div>
        </div>

        {error ? <div className="error-state">{error}</div> : null}
        {loading ? (
          <div className="loading-state">Loading AI correction...</div>
        ) : (
          <QuestionCorrectionContent
            originalQuestion={originalQuestion}
            correctedQuestion={correctedQuestion}
            corrections={corrections}
            explanation={explanation}
            detectedErrors={detectedErrors}
          />
        )}

        <div className="chat-panel">
          <div className="chat-header">
            <div>
              <h3 className="chat-title">Chatbot de personnalisation</h3>
              <p className="chat-subtitle">
                Expliquez la personnalisation souhaitee pour la correction.
              </p>
            </div>
            <Badge variant={sending ? "warning" : "success"}>
              {sending ? "Thinking" : "Ready"}
            </Badge>
          </div>

          <div className="chat-history">
            {messages.length === 0 ? (
              <p className="chat-empty">No messages yet.</p>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`chat-bubble chat-bubble-${message.role}`}
                >
                  <span className="chat-role">
                    {message.role === "user" ? "You" : "AI"}
                  </span>
                  <p>{message.content}</p>
                </div>
              ))
            )}
          </div>

          <div className="chat-input">
            <textarea
              className="chat-textarea"
              placeholder="Ex: Simplifie la question pour des eleves de 12 ans et propose une reponse plus courte."
              value={messageValue}
              onChange={(event) => onMessageChange(event.target.value)}
              rows={4}
            />
            <div className="chat-actions">
              <Button
                variant="secondary"
                onClick={onSendMessage}
                disabled={sendDisabled}
              >
                Send to AI
              </Button>
            </div>
            <p className="chat-hint">
              LLM will update the correction based on your instruction.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
