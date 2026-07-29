import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAssistantTools, sendAssistantMessage } from '../api/assistant.api'
import type {
  AssistantToolDescriptor,
  ConversationEntry,
} from '../model/assistant.types'

const SUGGESTIONS = [
  'Show me the current database stats',
  'List the available courses',
  'Generate a 10-question quiz for a course and correct every question',
] as const

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useAssistantChat() {
  const [entries, setEntries] = useState<ConversationEntry[]>([])
  const [input, setInput] = useState('')
  const [confirm, setConfirm] = useState(false)
  const [contextText, setContextText] = useState('')
  const [contextError, setContextError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [tools, setTools] = useState<AssistantToolDescriptor[]>([])

  const pendingRef = useRef(false)

  useEffect(() => {
    let active = true
    getAssistantTools()
      .then((list) => {
        if (active) setTools(list)
        console.info('[assistant] tool catalog loaded:', list.length, 'tools')
      })
      .catch((error) => {
        // Tool catalog is a non-critical hint; ignore failures silently.
        console.warn('[assistant] failed to load tool catalog', error)
      })
    return () => {
      active = false
    }
  }, [])

  const sendDisabled = sending || input.trim().length === 0

  const send = useCallback(async () => {
    if (pendingRef.current) return
    const message = input.trim()
    if (message.length === 0) return

    let parsedContext: Record<string, unknown> = {}
    const rawContext = contextText.trim()
    if (rawContext.length > 0) {
      try {
        const parsed = JSON.parse(rawContext)
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Context must be a JSON object')
        }
        parsedContext = parsed as Record<string, unknown>
        setContextError(null)
      } catch (error) {
        setContextError(
          error instanceof Error ? error.message : 'Invalid JSON context',
        )
        return
      }
    } else {
      setContextError(null)
    }

    const context: Record<string, unknown> = { ...parsedContext }
    if (confirm) {
      context.confirm = true
    }

    pendingRef.current = true
    setSending(true)
    setEntries((current) => [
      ...current,
      { id: createId('user'), role: 'user', text: message },
    ])
    setInput('')

    console.info('[assistant] sending message', {
      message,
      context: Object.keys(context).length > 0 ? context : undefined,
    })

    try {
      const response = await sendAssistantMessage({
        message,
        context: Object.keys(context).length > 0 ? context : undefined,
      })
      console.info('[assistant] response received', {
        success: response.success,
        steps: response.steps.length,
        summary: response.summary,
      })
      setEntries((current) => [
        ...current,
        { id: createId('assistant'), role: 'assistant', response },
      ])
    } catch (error) {
      console.error('[assistant] request failed', error)
      setEntries((current) => [
        ...current,
        {
          id: createId('error'),
          role: 'error',
          text:
            error instanceof Error
              ? error.message
              : 'The assistant is unavailable. Please try again.',
        },
      ])
    } finally {
      pendingRef.current = false
      setSending(false)
    }
  }, [confirm, contextText, input])

  const clear = useCallback(() => {
    if (pendingRef.current) return
    setEntries([])
    setContextError(null)
  }, [])

  const applySuggestion = useCallback((value: string) => {
    setInput(value)
  }, [])

  const suggestions = useMemo(() => [...SUGGESTIONS], [])

  return {
    entries,
    input,
    setInput,
    confirm,
    setConfirm,
    contextText,
    setContextText,
    contextError,
    sending,
    sendDisabled,
    tools,
    suggestions,
    send,
    clear,
    applySuggestion,
  }
}
