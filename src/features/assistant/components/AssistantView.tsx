import { useEffect, useRef } from "react";
import {
  Bot,
  CheckCircle2,
  Loader2,
  MinusCircle,
  Send,
  Sparkles,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/atoms/Button";
import { IconButton } from "@/shared/components/atoms/IconButton";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import { QuestionCorrectionContent } from "@/shared/components/organisms/QuestionCorrectionContent";
import type { QuestionApiItem } from "@/features/questions/model/question.types";
import type {
  AssistantChatApiResponse,
  AssistantStep,
  AssistantStepStatus,
  ConversationEntry,
} from "@/features/assistant/model/assistant.types";
import "@/features/assistant/assistant.css";

type AssistantViewProps = {
  title: string;
  subtitle: string;
  entries: ConversationEntry[];
  input: string;
  confirm: boolean;
  contextText: string;
  contextError: string | null;
  sending: boolean;
  sendDisabled: boolean;
  suggestions: string[];
  onInputChange: (value: string) => void;
  onConfirmChange: (value: boolean) => void;
  onContextChange: (value: string) => void;
  onSend: () => void;
  onClear: () => void;
  onSuggestion: (value: string) => void;
};

function formatJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value as object).length > 0;
  return true;
}

type CorrectionResult = {
  corrections?: string[] | null;
  explanation?: string | null;
  detected_errors?: string | null;
  original_question?: QuestionApiItem | null;
  improved_question?: QuestionApiItem | null;
};

/**
 * Detects a single-question correction payload (same shape as the "Ask AI"
 * correction endpoint) so it can be shown as a rich preview instead of raw JSON.
 */
function asCorrection(value: unknown): CorrectionResult | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const improved = record.improved_question;
  const hasImproved = !!improved && typeof improved === "object";
  const hasCorrectionFields =
    "corrections" in record ||
    "detected_errors" in record ||
    "explanation" in record;
  if (hasImproved && hasCorrectionFields) {
    return record as CorrectionResult;
  }
  return null;
}

function CorrectionPreview({ correction }: { correction: CorrectionResult }) {
  return (
    <QuestionCorrectionContent
      originalQuestion={correction.original_question ?? null}
      correctedQuestion={correction.improved_question ?? null}
      corrections={correction.corrections ?? null}
      explanation={correction.explanation ?? null}
      detectedErrors={correction.detected_errors ?? null}
    />
  );
}

function StepStatusIcon({ status }: { status: AssistantStepStatus }) {
  if (status === "SUCCESS") return <CheckCircle2 size={16} />;
  if (status === "FAILED") return <XCircle size={16} />;
  return <MinusCircle size={16} />;
}

function runTone(response: AssistantChatApiResponse): {
  tone: "success" | "partial" | "failed";
  label: string;
} {
  if (response.success) return { tone: "success", label: "Success" };
  const someSucceeded = response.steps.some((s) => s.status === "SUCCESS");
  if (someSucceeded) return { tone: "partial", label: "Partial" };
  return { tone: "failed", label: "Failed" };
}

function StepItem({ step }: { step: AssistantStep }) {
  return (
    <div className="assistant-step">
      <span className="assistant-step-icon" data-status={step.status}>
        <StepStatusIcon status={step.status} />
      </span>
      <div className="assistant-step-body">
        <div className="assistant-step-head">
          <span className="assistant-step-order">#{step.order}</span>
          <span className="assistant-step-tool">{step.tool}</span>
          <span className="assistant-step-duration">{step.durationMs} ms</span>
        </div>
        <p className="assistant-step-message">{step.message}</p>
        {hasContent(step.output) ? (
          <details className="assistant-output">
            <summary>View output</summary>
            <pre className="assistant-json">{formatJson(step.output)}</pre>
          </details>
        ) : null}
      </div>
    </div>
  );
}

function RunCard({ response }: { response: AssistantChatApiResponse }) {
  const { tone, label } = runTone(response);

  // Conversational reply (general chatbot): no steps, no structured result.
  if (response.steps.length === 0 && !hasContent(response.result)) {
    return <div className="assistant-bubble-ai">{response.summary}</div>;
  }

  const correction = asCorrection(response.result);

  return (
    <div className="assistant-run">
      <div className="assistant-run-head">
        <span className="assistant-run-badge" data-tone={tone}>
          {label}
        </span>
        <span className="assistant-run-summary">{response.summary}</span>
      </div>

      {response.steps.length > 0 ? (
        <div className="assistant-steps">
          {response.steps.map((step) => (
            <StepItem key={`${step.order}-${step.tool}`} step={step} />
          ))}
        </div>
      ) : null}

      {correction ? (
        <div className="assistant-result">
          <div className="assistant-result-label">Correction preview</div>
          <CorrectionPreview correction={correction} />
        </div>
      ) : hasContent(response.result) ? (
        <div className="assistant-result">
          <div className="assistant-result-label">Final result</div>
          <pre className="assistant-json">{formatJson(response.result)}</pre>
        </div>
      ) : null}
    </div>
  );
}

export function AssistantView({
  title,
  subtitle,
  entries,
  input,
  confirm,
  contextText,
  contextError,
  sending,
  sendDisabled,
  suggestions,
  onInputChange,
  onConfirmChange,
  onContextChange,
  onSend,
  onClear,
  onSuggestion,
}: AssistantViewProps) {
  const historyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [entries, sending]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!sendDisabled) onSend();
    }
  };

  return (
    <DashboardShell
      title={title}
      subtitle={subtitle}
      actionLabel="Assistant"
      variant="chat"
      hideHeader
    >
      <div className="assistant-shell">
        <div className="assistant-topbar">
          <span className="assistant-topbar-title">
            <Bot size={18} />
            {title}
          </span>
          <div className="assistant-topbar-actions">
            <span className="assistant-status" data-running={sending}>
              <span className="assistant-status-dot" />
              {sending ? "Running" : "Ready"}
            </span>
            <IconButton
              icon={<Trash2 size={16} />}
              label="Clear conversation"
              onClick={onClear}
              disabled={sending || entries.length === 0}
            />
          </div>
        </div>

        <div className="assistant-history" ref={historyRef}>
          {entries.length === 0 && !sending ? (
            <div className="assistant-empty">
              <span className="assistant-empty-icon">
                <Sparkles size={26} />
              </span>
              <div>
                <div className="assistant-empty-title">
                  Orchestration assistant
                </div>
                <p>{subtitle}</p>
              </div>
              <div className="assistant-suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="assistant-suggestion"
                    onClick={() => onSuggestion(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {entries.map((entry) => {
                if (entry.role === "user") {
                  return (
                    <div
                      key={entry.id}
                      className="assistant-row"
                      data-role="user"
                    >
                      <span className="assistant-role">You</span>
                      <div className="assistant-bubble-user">{entry.text}</div>
                    </div>
                  );
                }
                if (entry.role === "error") {
                  return (
                    <div
                      key={entry.id}
                      className="assistant-row"
                      data-role="assistant"
                    >
                      <span className="assistant-role">Assistant</span>
                      <div className="assistant-error">{entry.text}</div>
                    </div>
                  );
                }
                return (
                  <div
                    key={entry.id}
                    className="assistant-row"
                    data-role="assistant"
                  >
                    <span className="assistant-role">Assistant</span>
                    <RunCard response={entry.response} />
                  </div>
                );
              })}

              {sending ? (
                <div className="assistant-row" data-role="assistant">
                  <span className="assistant-role">Assistant</span>
                  <div className="assistant-running">
                    <Loader2 size={18} className="assistant-spin" />
                    Planning and executing your request…
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="assistant-composer">
          <textarea
            className="assistant-textarea"
            placeholder="Ask the assistant to inspect, create, correct or generate…"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
          />

          <div className="assistant-composer-row">
            <label className="assistant-check">
              <input
                type="checkbox"
                checked={confirm}
                onChange={(event) => onConfirmChange(event.target.checked)}
              />
              Allow sensitive actions (create / delete / pipeline)
            </label>

            <details className="assistant-advanced">
              <summary>Advanced context (JSON)</summary>
              <textarea
                className="assistant-context-input"
                placeholder='{ "courseId": "..." } or { "levelId": "...", "subjectId": "..." }'
                value={contextText}
                onChange={(event) => onContextChange(event.target.value)}
                disabled={sending}
              />
              {contextError ? (
                <p className="assistant-context-error">{contextError}</p>
              ) : null}
            </details>

            <Button
              className="assistant-send"
              variant="primary"
              icon={<Send size={16} />}
              onClick={onSend}
              disabled={sendDisabled}
            >
              {sending ? "Running" : "Send"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
