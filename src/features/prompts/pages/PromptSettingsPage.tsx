import { PromptSettingsView } from "../components";
import { usePromptSettingsPage } from "../hooks/usePromptSettingsPage";

export function PromptSettingsPage() {
  const {
    settings,
    form,
    loading,
    error,
    saving,
    resetting,
    saveError,
    dirty,
    saveDisabled,
    missingTokens,
    setForm,
    save,
    reset,
  } = usePromptSettingsPage();

  return (
    <PromptSettingsView
      systemMessageTemplate={form.systemMessageTemplate}
      generalRules={form.generalRules}
      correctionPromptTemplate={form.correctionPromptTemplate}
      chatPromptTemplate={form.chatPromptTemplate}
      updatedAt={settings?.updated_at ?? null}
      loading={loading}
      error={error}
      saving={saving}
      resetting={resetting}
      saveError={saveError}
      dirty={dirty}
      saveDisabled={saveDisabled}
      missingTokens={missingTokens}
      onSystemMessageChange={(value) =>
        setForm((current) => ({ ...current, systemMessageTemplate: value }))
      }
      onGeneralRulesChange={(value) =>
        setForm((current) => ({ ...current, generalRules: value }))
      }
      onCorrectionPromptChange={(value) =>
        setForm((current) => ({ ...current, correctionPromptTemplate: value }))
      }
      onChatPromptChange={(value) =>
        setForm((current) => ({ ...current, chatPromptTemplate: value }))
      }
      onSave={save}
      onReset={reset}
    />
  );
}
