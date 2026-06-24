import { API_BASE_URL, fetchJson } from '@/shared/lib/http'
import type {
  PromptSettingsApiResponse,
  PromptSettingsUpdateRequest,
} from '../model/prompt-settings.types'

export async function getPromptSettings(): Promise<PromptSettingsApiResponse> {
  return fetchJson<PromptSettingsApiResponse>('/v1/prompt-settings')
}

export async function updatePromptSettings(
  payload: PromptSettingsUpdateRequest,
): Promise<PromptSettingsApiResponse> {
  return fetchJson<PromptSettingsApiResponse>('/v1/prompt-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function resetPromptSettings(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/v1/prompt-settings`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }
}
