export type PromptToken = {
  token: string;
  label: string;
  required?: boolean;
  locked?: boolean;
};

export type PromptTokenGroup = {
  title: string;
  tokens: PromptToken[];
};

export type MissingTokens = {
  system: string[];
  correction: string[];
  chat: string[];
};

export type Language = "fr" | "en" | "ar";

export const LANGUAGE_OPTIONS: Array<{ value: Language; label: string }> = [
  { value: "fr", label: "Francais" },
  { value: "en", label: "English" },
  { value: "ar", label: "Arabe" },
];

export const PROMPT_SETTINGS_STRINGS = {
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
    generalRulesTitle: "General rules",
    generalRulesSubtitle: "Keep one rule per line for readable AI guidance.",
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
    placeholderGeneral: "- Rule 1\n- Rule 2",
    placeholderCorrection: "Add the correction prompt template here.",
    placeholderChat: "Add the chat prompt template here.",
    tokenGroupContext: "Context variables",
    tokenGroupBlocks: "Prompt blocks",
    tokenLevel: "Course level",
    tokenSubject: "Subject",
    tokenDomain: "Domain",
    tokenSemester: "Semester",
    tokenRules: "General rules",
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
    generalRulesTitle: "Regles generales",
    generalRulesSubtitle: "Une regle par ligne pour une lecture claire.",
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
    placeholderGeneral: "- Regle 1\n- Regle 2",
    placeholderCorrection: "Ajoutez le template du prompt de correction ici.",
    placeholderChat: "Ajoutez le template du prompt de chat ici.",
    tokenGroupContext: "Variables de contexte",
    tokenGroupBlocks: "Blocs de prompt",
    tokenLevel: "Niveau du cours",
    tokenSubject: "Matiere",
    tokenDomain: "Domaine",
    tokenSemester: "Semestre",
    tokenRules: "Regles generales",
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
    generalRulesTitle: "قواعد تعليمية",
    generalRulesSubtitle: "قاعدة واحدة لكل سطر لقراءة واضحة.",
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
    placeholderGeneral: "- قاعدة 1\n- قاعدة 2",
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

export const PROMPT_TOKEN_GROUPS: PromptTokenGroup[] = [
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

export function createPromptPreviewTokens(generalRules: string) {
  return {
    level: "Grade 8",
    subject: "Mathematics",
    domain: "Algebra",
    semester: "S1",
    general_rules: generalRules || "- Add your general rules here",
    question_json: JSON.stringify(
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
    ),
    instruction: "Simplify the question for younger students.",
    previous_correction_json: JSON.stringify(
      {
        corrections: ["Clarified the question wording."],
        explanation: "The original phrasing was ambiguous.",
        detected_errors: "Two choices were unclear.",
        improved_question: { id: "q-203", question: "Which number is prime?" },
      },
      null,
      2,
    ),
    output_format: "[OUTPUT_FORMAT inserted by server]",
  };
}

export function renderPromptTemplate(
  template: string,
  tokens: Record<string, string>,
) {
  return Object.entries(tokens).reduce(
    (current, [key, value]) => current.split(`{{${key}}}`).join(value),
    template,
  );
}