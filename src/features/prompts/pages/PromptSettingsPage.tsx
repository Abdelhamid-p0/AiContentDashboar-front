import { PromptSettingsView } from "@/shared/components/organisms";
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
      pedagogicalRules={form.pedagogicalRules}
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
      onPedagogicalRulesChange={(value) =>
        setForm((current) => ({ ...current, pedagogicalRules: value }))
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
