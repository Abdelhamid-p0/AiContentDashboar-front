import { useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { Badge } from "@/shared/components/atoms/Badge";
import { Button } from "@/shared/components/atoms/Button";
import { SegmentedControl } from "@/shared/components/molecules/SegmentedControl";
import { DashboardShell } from "@/shared/components/organisms/DashboardShell";
import {
  createPromptPreviewTokens,
  LANGUAGE_OPTIONS,
  type Language,
  type MissingTokens,
  PROMPT_SETTINGS_STRINGS,
  PROMPT_TOKEN_GROUPS,
  renderPromptTemplate,
} from "../model/prompt-settings-view.model";

type PromptSettingsViewProps = {
  systemMessageTemplate: string;
  generalRules: string;
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
  onGeneralRulesChange: (value: string) => void;
  onCorrectionPromptChange: (value: string) => void;
  onChatPromptChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
};

type PreviewTab = "system" | "correction" | "chat";

export function PromptSettingsView({
  systemMessageTemplate,
  generalRules,
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
  onGeneralRulesChange,
  onCorrectionPromptChange,
  onChatPromptChange,
  onSave,
  onReset,
}: PromptSettingsViewProps) {
  const [language, setLanguage] = useState<Language>("fr");
  const [showSettings, setShowSettings] = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("system");
  const copy = PROMPT_SETTINGS_STRINGS[language];

  const preview = useMemo(() => {
    const tokens = createPromptPreviewTokens(generalRules);

    return {
      system: renderPromptTemplate(systemMessageTemplate || "", tokens),
      correction: renderPromptTemplate(correctionPromptTemplate || "", tokens),
      chat: renderPromptTemplate(chatPromptTemplate || "", tokens),
    };
  }, [
    systemMessageTemplate,
    correctionPromptTemplate,
    chatPromptTemplate,
    generalRules,
  ]);

  const lastUpdatedLabel = useMemo(() => {
    if (!updatedAt) return copy.badgeUpToDate;
    const parsed = new Date(updatedAt);
    if (Number.isNaN(parsed.getTime())) return updatedAt;
    return parsed.toLocaleString();
  }, [copy.badgeUpToDate, updatedAt]);

  const saveHint = saveDisabled
    ? copy.saveHintMissing
    : dirty
      ? copy.saveHintDirty
      : copy.saveHintClean;

  return (
    <DashboardShell
      title={copy.title}
      subtitle={copy.subtitle}
      actionLabel={copy.saveButton}
    >
      <div className="layout">
        <div className="prompt-hero">
          <div className="prompt-hero-copy">
            <span className="prompt-hero-kicker">{copy.heroKicker}</span>
            <h2 className="prompt-hero-title">{copy.heroTitle}</h2>
            <p className="prompt-hero-subtitle">{copy.heroSubtitle}</p>
          </div>
          <div className="prompt-hero-meta">
            <Badge variant={dirty ? "warning" : "success"}>
              {dirty ? copy.badgeUnsaved : copy.badgeUpToDate}
            </Badge>
            <Badge variant="neutral">
              {copy.lastUpdated}: {lastUpdatedLabel}
            </Badge>
          </div>
        </div>

        <div className="toolbar prompt-toolbar">
          <div className="toolbar-left">
            <Badge variant="neutral">{copy.toolbarEndpoint}</Badge>
            <Badge variant={saveDisabled ? "warning" : "success"}>
              {saveHint}
            </Badge>
          </div>
          <div className="toolbar-right">
            <Button
              variant="ghost"
              icon={<Settings size={16} />}
              onClick={() => setShowSettings((current) => !current)}
            >
              {copy.settingsButton}
            </Button>
            <Button
              variant="secondary"
              onClick={onReset}
              disabled={resetting || loading}
            >
              {resetting ? copy.resetLoading : copy.resetButton}
            </Button>
            <Button variant="primary" onClick={onSave} disabled={saveDisabled}>
              {saving ? copy.saveLoading : copy.saveButton}
            </Button>
          </div>
        </div>

        {showSettings ? (
          <section className="prompt-settings-panel">
            <div className="prompt-settings-row">
              <span className="prompt-settings-label">
                {copy.languageLabel}
              </span>
              <select
                className="select"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value as Language)
                }
              >
                {LANGUAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </section>
        ) : null}

        {error ? <div className="error-state">{error}</div> : null}
        {saveError ? <div className="error-state">{saveError}</div> : null}
        {loading ? <div className="loading-state">{copy.loading}</div> : null}

        <div className="prompt-grid">
          <div className="prompt-editor">
            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">{copy.systemTitle}</h3>
                  <p className="prompt-card-subtitle">{copy.systemSubtitle}</p>
                </div>
                <Badge
                  variant={
                    missingTokens.system.length > 0 ? "warning" : "success"
                  }
                >
                  {missingTokens.system.length > 0
                    ? copy.missingTokens
                    : copy.ready}
                </Badge>
              </div>
              <textarea
                className="prompt-textarea"
                value={systemMessageTemplate}
                onChange={(event) => onSystemMessageChange(event.target.value)}
                rows={10}
                placeholder={copy.placeholderSystem}
                disabled={loading}
              />
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">
                    {copy.generalRulesTitle}
                  </h3>
                  <p className="prompt-card-subtitle">
                    {copy.generalRulesSubtitle}
                  </p>
                </div>
                <Badge variant="neutral">{"{{general_rules}}"}</Badge>
              </div>
              <textarea
                className="prompt-textarea prompt-textarea-short"
                value={generalRules}
                onChange={(event) => onGeneralRulesChange(event.target.value)}
                rows={8}
                placeholder={copy.placeholderGeneral}
                disabled={loading}
              />
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">{copy.correctionTitle}</h3>
                  <p className="prompt-card-subtitle">
                    {copy.correctionSubtitle}
                  </p>
                </div>
                <Badge
                  variant={
                    missingTokens.correction.length > 0 ? "warning" : "success"
                  }
                >
                  {missingTokens.correction.length > 0
                    ? copy.missingTokens
                    : copy.ready}
                </Badge>
              </div>
              <textarea
                className="prompt-textarea"
                value={correctionPromptTemplate}
                onChange={(event) =>
                  onCorrectionPromptChange(event.target.value)
                }
                rows={12}
                placeholder={copy.placeholderCorrection}
                disabled={loading}
              />
            </section>

            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">{copy.chatTitle}</h3>
                  <p className="prompt-card-subtitle">{copy.chatSubtitle}</p>
                </div>
                <Badge
                  variant={
                    missingTokens.chat.length > 0 ? "warning" : "success"
                  }
                >
                  {missingTokens.chat.length > 0
                    ? copy.missingTokens
                    : copy.ready}
                </Badge>
              </div>
              <textarea
                className="prompt-textarea"
                value={chatPromptTemplate}
                onChange={(event) => onChatPromptChange(event.target.value)}
                rows={12}
                placeholder={copy.placeholderChat}
                disabled={loading}
              />
            </section>
          </div>

          <aside className="prompt-sidebar">
            <section className="prompt-card">
              <div className="prompt-card-header">
                <div>
                  <h3 className="prompt-card-title">{copy.previewTitle}</h3>
                  <p className="prompt-card-subtitle">{copy.previewSubtitle}</p>
                </div>
              </div>
              <div className="prompt-preview-tabs">
                <SegmentedControl
                  options={[
                    { label: copy.previewTabSystem, value: "system" },
                    { label: copy.previewTabCorrection, value: "correction" },
                    { label: copy.previewTabChat, value: "chat" },
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
                  <h3 className="prompt-card-title">{copy.tokensTitle}</h3>
                  <p className="prompt-card-subtitle">{copy.tokensSubtitle}</p>
                </div>
              </div>
              <div className="prompt-token-stack">
                {PROMPT_TOKEN_GROUPS.map((group) => (
                  <div key={group.title} className="prompt-token-group">
                    <span className="prompt-token-title">
                      {copy[group.title as keyof typeof copy]}
                    </span>
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
                            {copy[token.label as keyof typeof copy]}
                          </span>
                          {token.required ? (
                            <span className="prompt-token-required">
                              {copy.tokenRequired}
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
                  <h3 className="prompt-card-title">{copy.integrityTitle}</h3>
                  <p className="prompt-card-subtitle">
                    {copy.integritySubtitle}
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
                    ? copy.integrityNeeds
                    : copy.integrityOk}
                </Badge>
              </div>
              <div className="prompt-checklist">
                <div className="prompt-check-item">
                  <span>{copy.integritySystem}</span>
                  <span>
                    {missingTokens.system.length > 0
                      ? missingTokens.system.join(", ")
                      : copy.ok}
                  </span>
                </div>
                <div className="prompt-check-item">
                  <span>{copy.integrityCorrection}</span>
                  <span>
                    {missingTokens.correction.length > 0
                      ? missingTokens.correction.join(", ")
                      : copy.ok}
                  </span>
                </div>
                <div className="prompt-check-item">
                  <span>{copy.integrityChat}</span>
                  <span>
                    {missingTokens.chat.length > 0
                      ? missingTokens.chat.join(", ")
                      : copy.ok}
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
