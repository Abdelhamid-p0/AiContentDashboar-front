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
    generalRules: settings.general_rules,
    correctionPromptTemplate: settings.correction_prompt_template,
    chatPromptTemplate: settings.chat_prompt_template,
  }
}

export function mapFormToUpdateRequest(
  form: PromptSettingsFormState,
): PromptSettingsUpdateRequest {
  return {
    system_message_template: form.systemMessageTemplate,
    general_rules: form.generalRules,
    correction_prompt_template: form.correctionPromptTemplate,
    chat_prompt_template: form.chatPromptTemplate,
  }
}
