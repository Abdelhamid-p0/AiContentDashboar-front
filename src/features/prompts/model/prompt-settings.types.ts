export type PromptSettingsApiResponse = {
  id: string
  system_message_template: string
  pedagogical_rules: string
  correction_prompt_template: string
  chat_prompt_template: string
  created_at: string
  updated_at: string
}

export type PromptSettingsUpdateRequest = {
  system_message_template: string
  pedagogical_rules: string
  correction_prompt_template: string
  chat_prompt_template: string
}

export type PromptSettingsFormState = {
  systemMessageTemplate: string
  pedagogicalRules: string
  correctionPromptTemplate: string
  chatPromptTemplate: string
}
