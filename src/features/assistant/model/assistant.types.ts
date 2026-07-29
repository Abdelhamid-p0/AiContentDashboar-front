export type AssistantStepStatus = 'SUCCESS' | 'FAILED' | 'SKIPPED'

export type AssistantStep = {
  order: number
  tool: string
  status: AssistantStepStatus
  message: string
  output: unknown
  durationMs: number
}

export type AssistantChatApiResponse = {
  success: boolean
  summary: string
  steps: AssistantStep[]
  result: unknown
}

export type AssistantChatRequest = {
  message: string
  context?: Record<string, unknown>
}

export type AssistantToolDescriptor = {
  name: string
  description: string
  write: boolean
  sensitive: boolean
}

export type UserEntry = {
  id: string
  role: 'user'
  text: string
}

export type AssistantEntry = {
  id: string
  role: 'assistant'
  response: AssistantChatApiResponse
}

export type ErrorEntry = {
  id: string
  role: 'error'
  text: string
}

export type ConversationEntry = UserEntry | AssistantEntry | ErrorEntry
