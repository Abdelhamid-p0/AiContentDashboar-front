import type { RagContextDocument } from "@/features/questions/model/question-correction.types";

type QuestionCorrectionContextPopoverProps = {
  open: boolean;
  id: string;
  questionId: string;
  ragContext: RagContextDocument[] | null;
  loading: boolean;
  error: string | null;
};

export function QuestionCorrectionContextPopover({
  open,
  id,
  questionId,
  ragContext,
  loading,
  error,
}: QuestionCorrectionContextPopoverProps) {
  if (!open) {
    return null;
  }

  const ragDocuments = Array.isArray(ragContext) ? ragContext : [];

  return (
    <div
      id={id}
      className="chatgpt-context-popover"
      role="dialog"
      aria-modal="false"
      aria-label="Context attached to the correction prompt"
    >
      <div className="chatgpt-context-header">
        <div>
          <div className="chatgpt-context-kicker">Attached context</div>
          <h4 className="chatgpt-context-title">Prompt payload</h4>
        </div>
        <span className="chatgpt-context-chip">Question {questionId}</span>
      </div>

      <p className="chatgpt-context-note">
        These attached documents are sent with the next AI request.
      </p>

      {loading ? (
        <div className="chatgpt-context-status">Loading context...</div>
      ) : null}
      {error ? (
        <div className="chatgpt-context-status is-error">{error}</div>
      ) : null}

      <div className="chatgpt-context-grid">
        <div className="chatgpt-context-item chatgpt-context-item-full">
          <span className="chatgpt-context-label">RAG context</span>
          {ragDocuments.length ? (
            <div className="chatgpt-rag-list">
              {ragDocuments.map((document, index) => (
                <article
                  key={`${document.title}-${document.document_type}-${index}`}
                  className="chatgpt-rag-item"
                >
                  <div className="chatgpt-rag-item-header">
                    <span className="chatgpt-rag-item-title">
                      {document.title}
                    </span>
                    <span className="chatgpt-rag-item-chip">
                      {document.document_type}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="chatgpt-context-value">-</p>
          )}
        </div>
      </div>
    </div>
  );
}
