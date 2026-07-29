import { fetchJson } from '@/shared/lib/http'
import type {
  AssistantChatApiResponse,
  AssistantChatRequest,
  AssistantToolDescriptor,
} from '../model/assistant.types'

export async function sendAssistantMessage(
  payload: AssistantChatRequest,
): Promise<AssistantChatApiResponse> {
  return fetchJson<AssistantChatApiResponse>('/v1/assistant/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function getAssistantTools(): Promise<AssistantToolDescriptor[]> {
  return fetchJson<AssistantToolDescriptor[]>('/v1/assistant/tools')
}
