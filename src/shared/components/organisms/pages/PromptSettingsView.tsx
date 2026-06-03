import { useMemo, useState } from "react";
import { Settings } from "lucide-react";
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

type PromptToken = {
  token: string;
  label: string;
  required?: boolean;
  locked?: boolean;
};

type PromptTokenGroup = {
  title: string;
  tokens: PromptToken[];
};

type Language = "fr" | "en" | "ar";

const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: "fr", label: "Francais" },
  { value: "en", label: "English" },
  { value: "ar", label: "Arabe" },
];

const STRINGS = {
  en: {
    title: "Prompt studio",
    subtitle:
      "Edit the system message, rules, and task prompts used for AI question correction.",
    heroKicker: "Prompt governance",
    heroTitle: "Curate the AI voice",
    heroSubtitle:
      "Keep the structured output format locked server-side, and iterate on everything else safely.",
    badgeUnsaved: "Unsaved changes",
    badgeUpToDate: "Up to date",
    lastUpdated: "Last updated",
    saveHintMissing: "Add missing tokens or make a change to save.",
    saveHintDirty: "Ready to publish your updates.",
    saveHintClean: "No changes to save.",
    toolbarEndpoint: "API /api/v1/prompt-settings",
    resetButton: "Reset to default",
    resetLoading: "Resetting...",
    saveButton: "Save changes",
    saveLoading: "Saving...",
    loading: "Loading prompt settings...",
    settingsButton: "Settings",
    languageLabel: "Language",
    systemTitle: "System message template",
    systemSubtitle:
      "Sets the AI role, course context, and rule injection point.",
    pedagogicalTitle: "Pedagogical rules",
    pedagogicalSubtitle: "Keep one rule per line for readable AI guidance.",
    correctionTitle: "Correction prompt",
    correctionSubtitle:
      "Defines the main task instructions for question correction.",
    chatTitle: "Chat prompt",
    chatSubtitle: "Used when the user personalizes a correction.",
    missingTokens: "Missing tokens",
    ready: "Ready",
    previewTitle: "Preview",
    previewSubtitle: "Sample render with placeholder data.",
    previewTabSystem: "System",
    previewTabCorrection: "Correction",
    previewTabChat: "Chat",
    tokensTitle: "Prompt tokens",
    tokensSubtitle: "Keep required placeholders to avoid breaking the flow.",
    integrityTitle: "Integrity checks",
    integritySubtitle: "Required tokens must stay in each template.",
    integrityNeeds: "Needs attention",
    integrityOk: "All good",
    tokenRequired: "Required",
    ok: "OK",
    placeholderSystem: "Add the system message template here.",
    placeholderPedagogical: "- Rule 1\n- Rule 2",
    placeholderCorrection: "Add the correction prompt template here.",
    placeholderChat: "Add the chat prompt template here.",
    tokenGroupContext: "Context variables",
    tokenGroupBlocks: "Prompt blocks",
    tokenLevel: "Course level",
    tokenSubject: "Subject",
    tokenDomain: "Domain",
    tokenSemester: "Semester",
    tokenRules: "Pedagogical rules",
    tokenQuestionJson: "Question JSON",
    tokenInstruction: "User instruction",
    tokenPrevious: "Previous correction",
    tokenOutput: "Output format (locked)",
    integritySystem: "System message",
    integrityCorrection: "Correction prompt",
    integrityChat: "Chat prompt",
  },
  fr: {
    title: "Studio de prompt",
    subtitle:
      "Editez le message systeme, les regles, et les prompts utilises pour la correction IA.",
    heroKicker: "Gouvernance prompt",
    heroTitle: "Piloter la voix IA",
    heroSubtitle:
      "Gardez le format de sortie verrouille cote serveur, et ajustez le reste en securite.",
    badgeUnsaved: "Modifications non enregistrees",
    badgeUpToDate: "A jour",
    lastUpdated: "Derniere mise a jour",
    saveHintMissing:
      "Ajoutez les tokens manquants ou modifiez pour enregistrer.",
    saveHintDirty: "Pret a publier vos mises a jour.",
    saveHintClean: "Aucun changement a enregistrer.",
    toolbarEndpoint: "API /api/v1/prompt-settings",
    resetButton: "Reinitialiser",
    resetLoading: "Reinitialisation...",
    saveButton: "Enregistrer",
    saveLoading: "Enregistrement...",
    loading: "Chargement des reglages...",
    settingsButton: "Parametres",
    languageLabel: "Langue",
    systemTitle: "Template message systeme",
    systemSubtitle:
      "Definit le role IA, le contexte cours, et le point d'injection des regles.",
    pedagogicalTitle: "Regles pedagogiques",
    pedagogicalSubtitle: "Une regle par ligne pour une lecture claire.",
    correctionTitle: "Prompt de correction",
    correctionSubtitle:
      "Definit les instructions principales pour corriger la question.",
    chatTitle: "Prompt de chat",
    chatSubtitle: "Utilise quand l'utilisateur personnalise une correction.",
    missingTokens: "Tokens manquants",
    ready: "Pret",
    previewTitle: "Preview",
    previewSubtitle: "Rendu exemple avec donnees fictives.",
    previewTabSystem: "Systeme",
    previewTabCorrection: "Correction",
    previewTabChat: "Chat",
    tokensTitle: "Tokens du prompt",
    tokensSubtitle:
      "Gardez les placeholders requis pour ne pas casser le flux.",
    integrityTitle: "Controles d'integrite",
    integritySubtitle: "Les tokens requis doivent rester dans chaque template.",
    integrityNeeds: "A verifier",
    integrityOk: "OK",
    tokenRequired: "Requis",
    ok: "OK",
    placeholderSystem: "Ajoutez le template du message systeme ici.",
    placeholderPedagogical: "- Regle 1\n- Regle 2",
    placeholderCorrection: "Ajoutez le template du prompt de correction ici.",
    placeholderChat: "Ajoutez le template du prompt de chat ici.",
    tokenGroupContext: "Variables de contexte",
    tokenGroupBlocks: "Blocs de prompt",
    tokenLevel: "Niveau du cours",
    tokenSubject: "Matiere",
    tokenDomain: "Domaine",
    tokenSemester: "Semestre",
    tokenRules: "Regles pedagogiques",
    tokenQuestionJson: "Question JSON",
    tokenInstruction: "Instruction utilisateur",
    tokenPrevious: "Correction precedente",
    tokenOutput: "Format de sortie (verrouille)",
    integritySystem: "Message systeme",
    integrityCorrection: "Prompt de correction",
    integrityChat: "Prompt de chat",
  },
  ar: {
    title: "استوديو التعليمات",
    subtitle:
      "عدل رسالة النظام والقواعد وتعليمات المهام المستخدمة لتصحيح الاسئلة بالذكاء الاصطناعي.",
    heroKicker: "حوكمة التعليمات",
    heroTitle: "اضبط صوت الذكاء الاصطناعي",
    heroSubtitle:
      "احتفظ بتنسيق الاخراج مقفلا من جهة الخادم وعدل بقية الاجزاء بأمان.",
    badgeUnsaved: "تغييرات غير محفوظة",
    badgeUpToDate: "محدث",
    lastUpdated: "اخر تحديث",
    saveHintMissing: "اضف الرموز الناقصة او قم بتعديل للحفظ.",
    saveHintDirty: "جاهز لنشر التحديثات.",
    saveHintClean: "لا توجد تغييرات للحفظ.",
    toolbarEndpoint: "API /api/v1/prompt-settings",
    resetButton: "اعادة ضبط",
    resetLoading: "جار اعادة الضبط...",
    saveButton: "حفظ التغييرات",
    saveLoading: "جار الحفظ...",
    loading: "جار تحميل الاعدادات...",
    settingsButton: "الاعدادات",
    languageLabel: "اللغة",
    systemTitle: "قالب رسالة النظام",
    systemSubtitle:
      "يحدد دور الذكاء الاصطناعي وسياق المقرر ونقطة ادراج القواعد.",
    pedagogicalTitle: "قواعد تعليمية",
    pedagogicalSubtitle: "قاعدة واحدة لكل سطر لقراءة واضحة.",
    correctionTitle: "تعليمات التصحيح",
    correctionSubtitle: "تعليمات المهمة الاساسية لتصحيح السؤال.",
    chatTitle: "تعليمات الدردشة",
    chatSubtitle: "تستخدم عند تخصيص التصحيح.",
    missingTokens: "رموز ناقصة",
    ready: "جاهز",
    previewTitle: "معاينة",
    previewSubtitle: "عرض تجريبي ببيانات بديلة.",
    previewTabSystem: "النظام",
    previewTabCorrection: "التصحيح",
    previewTabChat: "الدردشة",
    tokensTitle: "رموز التعليمات",
    tokensSubtitle: "احتفظ بالرموز المطلوبة لتجنب كسر التدفق.",
    integrityTitle: "فحوصات السلامة",
    integritySubtitle: "يجب بقاء الرموز المطلوبة في كل قالب.",
    integrityNeeds: "يحتاج مراجعة",
    integrityOk: "كل شيء جيد",
    tokenRequired: "مطلوب",
    ok: "حسنا",
    placeholderSystem: "اضف قالب رسالة النظام هنا.",
    placeholderPedagogical: "- قاعدة 1\n- قاعدة 2",
    placeholderCorrection: "اضف قالب تعليمات التصحيح هنا.",
    placeholderChat: "اضف قالب تعليمات الدردشة هنا.",
    tokenGroupContext: "متغيرات السياق",
    tokenGroupBlocks: "كتل التعليمات",
    tokenLevel: "مستوى المقرر",
    tokenSubject: "المادة",
    tokenDomain: "المجال",
    tokenSemester: "الفصل",
    tokenRules: "قواعد تعليمية",
    tokenQuestionJson: "JSON السؤال",
    tokenInstruction: "تعليمات المستخدم",
    tokenPrevious: "التصحيح السابق",
    tokenOutput: "تنسيق الاخراج (مقفل)",
    integritySystem: "رسالة النظام",
    integrityCorrection: "تعليمات التصحيح",
    integrityChat: "تعليمات الدردشة",
  },
} as const;

const TOKEN_GROUPS: PromptTokenGroup[] = [
  {
    title: "tokenGroupContext",
    tokens: [
      { token: "{{level}}", label: "tokenLevel" },
      { token: "{{subject}}", label: "tokenSubject" },
      { token: "{{domain}}", label: "tokenDomain" },
      { token: "{{semester}}", label: "tokenSemester" },
    ],
  },
  {
    title: "tokenGroupBlocks",
    tokens: [
      {
        token: "{{pedagogical_rules}}",
        label: "tokenRules",
        required: true,
      },
      {
        token: "{{question_json}}",
        label: "tokenQuestionJson",
        required: true,
      },
      { token: "{{instruction}}", label: "tokenInstruction", required: true },
      {
        token: "{{previous_correction_json}}",
        label: "tokenPrevious",
        required: true,
      },
      {
        token: "{{output_format}}",
        label: "tokenOutput",
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
  const [language, setLanguage] = useState<Language>("fr");
  const [showSettings, setShowSettings] = useState(false);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("system");
  const copy = STRINGS[language];

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
                  <h3 className="prompt-card-title">{copy.pedagogicalTitle}</h3>
                  <p className="prompt-card-subtitle">
                    {copy.pedagogicalSubtitle}
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
                placeholder={copy.placeholderPedagogical}
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
                {TOKEN_GROUPS.map((group) => (
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
