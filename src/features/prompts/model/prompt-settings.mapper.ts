import type {
  PromptSettingsApiResponse,
  PromptSettingsFormState,
  PromptSettingsUpdateRequest,
} from './prompt-settings.types'

export function mapPromptSettingsToForm(
  settings: PromptSettingsApiResponse,
): PromptSettingsFormState {
  return {
    systemMessageTemplate: settings.system_message_template,
    pedagogicalRules: settings.pedagogical_rules,
    correctionPromptTemplate: settings.correction_prompt_template,
    chatPromptTemplate: settings.chat_prompt_template,
  }
}

export function mapFormToUpdateRequest(
  form: PromptSettingsFormState,
): PromptSettingsUpdateRequest {
  return {
    system_message_template: form.systemMessageTemplate,
    pedagogical_rules: form.pedagogicalRules,
    correction_prompt_template: form.correctionPromptTemplate,
    chat_prompt_template: form.chatPromptTemplate,
  }
}
