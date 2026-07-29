import { AssistantView } from "../components";
import { useAssistantChat } from "../hooks/useAssistantChat";

export function AssistantPage() {
  const {
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
    suggestions,
    send,
    clear,
    applySuggestion,
  } = useAssistantChat();

  return (
    <AssistantView
      title="AI Assistant"
      subtitle="Plan and run orchestrated actions across courses, quizzes and questions."
      entries={entries}
      input={input}
      confirm={confirm}
      contextText={contextText}
      contextError={contextError}
      sending={sending}
      sendDisabled={sendDisabled}
      suggestions={suggestions}
      onInputChange={setInput}
      onConfirmChange={setConfirm}
      onContextChange={setContextText}
      onSend={send}
      onClear={clear}
      onSuggestion={applySuggestion}
    />
  );
}
