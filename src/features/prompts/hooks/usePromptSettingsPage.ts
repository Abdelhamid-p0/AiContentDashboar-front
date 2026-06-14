import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  getPromptSettings,
  resetPromptSettings,
  updatePromptSettings,
} from '../api/prompts.api'
import {
  mapFormToUpdateRequest,
  mapPromptSettingsToForm,
} from '../model/prompt-settings.mapper'
import type {
  PromptSettingsApiResponse,
  PromptSettingsFormState,
} from '../model/prompt-settings.types'

const REQUIRED_SYSTEM_TOKENS = ['{{general_rules}}']
const REQUIRED_CORRECTION_TOKENS = ['{{question_json}}']
const REQUIRED_CHAT_TOKENS = [
  '{{instruction}}',
  '{{previous_correction_json}}',
  '{{question_json}}',
]

const EMPTY_FORM: PromptSettingsFormState = {
  systemMessageTemplate: '',
  generalRules: '',
  correctionPromptTemplate: '',
  chatPromptTemplate: '',
}

function getMissingTokens(template: string, requiredTokens: string[]): string[] {
  return requiredTokens.filter((token) => !template.includes(token))
}

export function usePromptSettingsPage() {
  const [settings, setSettings] = useState<PromptSettingsApiResponse | null>(null)
  const [form, setForm] = useState<PromptSettingsFormState>(EMPTY_FORM)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const loadSettings = useCallback(() => {
    setLoading(true)
    setError(null)

    getPromptSettings()
      .then((response) => {
        setSettings(response)
        setForm(mapPromptSettingsToForm(response))
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load prompt settings')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const missingSystemTokens = useMemo(
    () => getMissingTokens(form.systemMessageTemplate, REQUIRED_SYSTEM_TOKENS),
    [form.systemMessageTemplate],
  )
  const missingCorrectionTokens = useMemo(
    () => getMissingTokens(form.correctionPromptTemplate, REQUIRED_CORRECTION_TOKENS),
    [form.correctionPromptTemplate],
  )
  const missingChatTokens = useMemo(
    () => getMissingTokens(form.chatPromptTemplate, REQUIRED_CHAT_TOKENS),
    [form.chatPromptTemplate],
  )

  const hasMissingRequiredTokens =
    missingSystemTokens.length > 0 ||
    missingCorrectionTokens.length > 0 ||
    missingChatTokens.length > 0

  const dirty = useMemo(() => {
    if (!settings) return false
    return (
      form.systemMessageTemplate !== settings.system_message_template ||
      form.generalRules !== settings.general_rules ||
      form.correctionPromptTemplate !== settings.correction_prompt_template ||
      form.chatPromptTemplate !== settings.chat_prompt_template
    )
  }, [form, settings])

  const saveDisabled = loading || saving || !dirty || hasMissingRequiredTokens

  const save = useCallback(async () => {
    if (saveDisabled) return

    setSaving(true)
    setSaveError(null)

    try {
      const updated = await updatePromptSettings(mapFormToUpdateRequest(form))
      setSettings(updated)
      setForm(mapPromptSettingsToForm(updated))
    } catch (requestError: unknown) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to update prompt settings',
      )
    } finally {
      setSaving(false)
    }
  }, [form, saveDisabled])

  const reset = useCallback(async () => {
    if (resetting || loading) return

    setResetting(true)
    setSaveError(null)

    try {
      await resetPromptSettings()
      loadSettings()
    } catch (requestError: unknown) {
      setSaveError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to reset prompt settings',
      )
    } finally {
      setResetting(false)
    }
  }, [loadSettings, loading, resetting])

  return {
    settings,
    form,
    loading,
    error,
    saving,
    resetting,
    saveError,
    dirty,
    saveDisabled,
    missingTokens: {
      system: missingSystemTokens,
      correction: missingCorrectionTokens,
      chat: missingChatTokens,
    },
    setForm,
    save,
    reset,
  }
}
