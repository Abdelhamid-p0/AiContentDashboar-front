import { useMemo, useState } from "react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { SegmentedControl } from "@/shared/components/molecules/SegmentedControl";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";

const SAMPLE_QUESTION_JSON = JSON.stringify(
  {
    id: "q-203",
    question: "Which number is a prime?",
    question_type: "ONE_CHOICE",
    sub_questions: [
      {
        id: "sq-1",
        question: "Pick the only correct answer.",
        answers: [
          { id: "a-1", answer: "12", is_right: false },
          { id: "a-2", answer: "13", is_right: true },
          { id: "a-3", answer: "15", is_right: false },
        ],
      },
    ],
  },
  null,
  2,
);

const SAMPLE_CORRECTION_JSON = JSON.stringify(
  {
    corrections: ["Clarified the question wording."],
    explanation: "The original phrasing was ambiguous.",
    detected_errors: "Two choices were unclear.",
    improved_question: { id: "q-203", question: "Which number is prime?" },
  },
  null,
  2,
);

const SAMPLE_OUTPUT_FORMAT = "[OUTPUT_FORMAT inserted by server]";

const TOKEN_GROUPS = [
  {
    title: "Context variables",
    tokens: [
      { token: "{{level}}", label: "Course level" },
      { token: "{{subject}}", label: "Subject" },
      { token: "{{domain}}", label: "Domain" },
      { token: "{{semester}}", label: "Semester" },
    ],
  },
  {
    title: "Prompt blocks",
    tokens: [
      {
        token: "{{pedagogical_rules}}",
        label: "Pedagogical rules",
        required: true,
      },
      { token: "{{question_json}}", label: "Question JSON", required: true },
      { token: "{{instruction}}", label: "User instruction", required: true },
      {
        token: "{{previous_correction_json}}",
        label: "Previous correction",
        required: true,
      },
      {
        token: "{{output_format}}",
        label: "Output format (locked)",
        required: true,
        locked: true,
      },
    ],
  },
];

type MissingTokens = {
  system: string[];
  correction: string[];
  chat: string[];
};

type PromptSettingsViewProps = {
  systemMessageTemplate: string;
  pedagogicalRules: string;
  correctionPromptTemplate: string;
  chatPromptTemplate: string;
  updatedAt: string | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  resetting: boolean;
  saveError: string | null;
  dirty: boolean;
  saveDisabled: boolean;
  missingTokens: MissingTokens;
  onSystemMessageChange: (value: string) => void;
  onPedagogicalRulesChange: (value: string) => void;
  onCorrectionPromptChange: (value: string) => void;
  onChatPromptChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
};

type PreviewTab = "system" | "correction" | "chat";

function renderTemplate(template: string, tokens: Record<string, string>) {
  return Object.entries(tokens).reduce(
    (current, [key, value]) => current.split(`{{${key}}}`).join(value),
    template,
  );
}

export function PromptSettingsView({
  systemMessageTemplate,
  pedagogicalRules,
  correctionPromptTemplate,
  chatPromptTemplate,
  updatedAt,
  loading,
  error,
  saving,
  resetting,
  saveError,
  dirty,
  saveDisabled,
  missingTokens,
  onSystemMessageChange,
  onPedagogicalRulesChange,
  onCorrectionPromptChange,
  onChatPromptChange,
  onSave,
  onReset,
}: PromptSettingsViewProps) {
  const [previewTab, setPreviewTab] = useState<PreviewTab>("system");

  const preview = useMemo(() => {
    const tokens = {
      level: "Grade 8",
      subject: "Mathematics",
      domain: "Algebra",
      semester: "S1",
      pedagogical_rules:
        pedagogicalRules || "- Add your pedagogical rules here",
      question_json: SAMPLE_QUESTION_JSON,
      instruction: "Simplify the question for younger students.",
      previous_correction_json: SAMPLE_CORRECTION_JSON,
      output_format: SAMPLE_OUTPUT_FORMAT,
    };

    return {
      system: renderTemplate(systemMessageTemplate || "", tokens),
      correction: renderTemplate(correctionPromptTemplate || "", tokens),
      chat: renderTemplate(chatPromptTemplate || "", tokens),
    };
  }, [
    systemMessageTemplate,
    correctionPromptTemplate,
    chatPromptTemplate,
    pedagogicalRules,
  ]);

  const lastUpdatedLabel = useMemo(() => {
    if (!updatedAt) return "Not saved yet";
    const parsed = new Date(updatedAt);
    if (Number.isNaN(parsed.getTime())) return updatedAt;
    return parsed.toLocaleString();
  }, [updatedAt]);

  const saveHint = saveDisabled
    ? "Add missing tokens or make a change to save."
    : dirty
      ? "Ready to publish your updates."
      : "No changes to save.";

  return (
    <DashboardShell
      title="Prompt studio"
      subtitle="Edit the system message, rules, and task prompts used for AI question correction."
      actionLabel="Save"
    >
      <div className="layout">
        <div className="prompt-hero">
          <div className="prompt-hero-copy">
            <span className="prompt-hero-kicker">Prompt governance</span>
            <h2 className="prompt-hero-title">Curate the AI voice</h2>
            <p className="prompt-hero-subtitle">
              Keep the structured output format locked server-side, and iterate
              on everything else safely.
            </p>
          </div>
          <div className="prompt-hero-meta">
            <Badge variant={dirty ? "warning" : "success"}>
              {dirty ? "Unsaved changes" : "Up to date"}
            </Badge>
            <Badge variant="neutral">Last updated: {lastUpdatedLabel}</Badge>
          </div>
        </div>

        <div className="toolbar prompt-toolbar">
          <div className="toolbar-left">
            <Badge variant="neutral">API /api/v1/prompt-settings</Badge>
            <Badge variant={saveDisabled ? "warning" : "success"}>
              {saveHint}
            </Badge>
          </div>
          <div className="toolbar-right">
            <Button
              variant="secondary"
              onClick={onReset}
              disabled={resetting || loading}
            >
              {resetting ? "Resetting..." : "Reset to default"}
            </Button>
            <Button variant="primary" onClick={onSave} disabled={saveDisabled}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>

        {error ? <div className="error-state">{error}</div> : null}
        {saveError ? <div className="error-state">{saveError}</div> : null}
        {loading ? (
          <div className="loading-state">Loading prompt settings...</div>
        ) : null}

        <div className="prompt-grid">
          <div className="prompt-editor">
            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">System message template</h3>
                  <p className="prompt-card-subtitle">
                    Sets the AI role, course context, and rule injection point.
                  </p>
                </div>
                <Badge
                  variant={
                    missingTokens.system.length > 0 ? "warning" : "success"
                  }
                >
                  {missingTokens.system.length > 0 ? "Missing tokens" : "Ready"}
                </Badge>
              </div>
              <textarea
                className="prompt-textarea"
                value={systemMessageTemplate}
                onChange={(event) => onSystemMessageChange(event.target.value)}
                rows={10}
                placeholder="Add the system message template here."
                disabled={loading}
              />
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">Pedagogical rules</h3>
                  <p className="prompt-card-subtitle">
                    Keep one rule per line for readable AI guidance.
                  </p>
                </div>
                <Badge variant="neutral">{"{{pedagogical_rules}}"}</Badge>
              </div>
              <textarea
                className="prompt-textarea prompt-textarea-short"
                value={pedagogicalRules}
                onChange={(event) =>
                  onPedagogicalRulesChange(event.target.value)
                }
                rows={8}
                placeholder="- Rule 1\n- Rule 2"
                disabled={loading}
              />
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">Correction prompt</h3>
                  <p className="prompt-card-subtitle">
                    Defines the main task instructions for question correction.
                  </p>
                </div>
                <Badge
                  variant={
                    missingTokens.correction.length > 0 ? "warning" : "success"
                  }
                >
                  {missingTokens.correction.length > 0
                    ? "Missing tokens"
                    : "Ready"}
                </Badge>
              </div>
              <textarea
                className="prompt-textarea"
                value={correctionPromptTemplate}
                onChange={(event) =>
                  onCorrectionPromptChange(event.target.value)
                }
                rows={12}
                placeholder="Add the correction prompt template here."
                disabled={loading}
              />
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">Chat prompt</h3>
                  <p className="prompt-card-subtitle">
                    Used when the user personalizes a correction.
                  </p>
                </div>
                <Badge
                  variant={
                    missingTokens.chat.length > 0 ? "warning" : "success"
                  }
                >
                  {missingTokens.chat.length > 0 ? "Missing tokens" : "Ready"}
                </Badge>
              </div>
              <textarea
                className="prompt-textarea"
                value={chatPromptTemplate}
                onChange={(event) => onChatPromptChange(event.target.value)}
                rows={12}
                placeholder="Add the chat prompt template here."
                disabled={loading}
              />
            </section>
          </div>

          <aside className="prompt-sidebar">
            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">Prompt tokens</h3>
                  <p className="prompt-card-subtitle">
                    Keep required placeholders to avoid breaking the flow.
                  </p>
                </div>
              </div>
              <div className="prompt-token-stack">
                {TOKEN_GROUPS.map((group) => (
                  <div key={group.title} className="prompt-token-group">
                    <span className="prompt-token-title">{group.title}</span>
                    <div className="prompt-token-grid">
                      {group.tokens.map((token) => (
                        <span
                          key={token.token}
                          className="prompt-token"
                          data-locked={token.locked || undefined}
                        >
                          <span className="prompt-token-value">
                            {token.token}
                          </span>
                          <span className="prompt-token-label">
                            {token.label}
                          </span>
                          {token.required ? (
                            <span className="prompt-token-required">
                              Required
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">Preview</h3>
                  <p className="prompt-card-subtitle">
                    Sample render with placeholder data.
                  </p>
                </div>
              </div>
              <div className="prompt-preview-tabs">
                <SegmentedControl
                  options={[
                    { label: "System", value: "system" },
                    { label: "Correction", value: "correction" },
                    { label: "Chat", value: "chat" },
                  ]}
                  value={previewTab}
                  onChange={(value) => setPreviewTab(value as PreviewTab)}
                />
              </div>
              <pre className="prompt-preview">{preview[previewTab]}</pre>
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">Integrity checks</h3>
                  <p className="prompt-card-subtitle">
                    Required tokens must stay in each template.
                  </p>
                </div>
                <Badge
                  variant={
                    missingTokens.system.length ||
                    missingTokens.correction.length ||
                    missingTokens.chat.length
                      ? "warning"
                      : "success"
                  }
                >
                  {missingTokens.system.length ||
                  missingTokens.correction.length ||
                  missingTokens.chat.length
                    ? "Needs attention"
                    : "All good"}
                </Badge>
              </div>
              <div className="prompt-checklist">
                <div className="prompt-check-item">
                  <span>System message</span>
                  <span>
                    {missingTokens.system.length > 0
                      ? missingTokens.system.join(", ")
                      : "OK"}
                  </span>
                </div>
                <div className="prompt-check-item">
                  <span>Correction prompt</span>
                  <span>
                    {missingTokens.correction.length > 0
                      ? missingTokens.correction.join(", ")
                      : "OK"}
                  </span>
                </div>
                <div className="prompt-check-item">
                  <span>Chat prompt</span>
                  <span>
                    {missingTokens.chat.length > 0
                      ? missingTokens.chat.join(", ")
                      : "OK"}
                  </span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardShell>
  );
}
