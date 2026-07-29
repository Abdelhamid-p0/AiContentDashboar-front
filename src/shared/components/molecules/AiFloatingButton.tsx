import { Bot } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import "@/features/assistant/assistant.css";

/**
 * Discreet, always-visible floating button that opens the AI assistant page.
 * Hidden while already on the assistant route.
 */
export function AiFloatingButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (pathname.startsWith("/assistant")) {
    return null;
  }

  return (
    <button
      type="button"
      className="ai-fab"
      aria-label="Open AI assistant"
      title="AI assistant"
      onClick={() => navigate("/assistant")}
    >
      <span className="ai-fab-icon">
        <Bot size={20} />
      </span>
      <span className="ai-fab-label">AI assistant</span>
    </button>
  );
}
