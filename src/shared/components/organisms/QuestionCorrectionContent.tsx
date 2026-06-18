import { Badge } from "@/shared/components/atoms/Badge";
import type { QuestionApiItem } from "@/features/questions/model/question.types";

type QuestionCorrectionContentProps = {
  originalQuestion: QuestionApiItem | null;
  correctedQuestion: QuestionApiItem | null;
  corrections: string[] | null;
  explanation: string | null;
  detectedErrors: string | null;
};

function QuestionCard({
  title,
  question,
}: {
  title: string;
  question: QuestionApiItem | null;
}) {
  const subQuestions = Array.isArray(question?.sub_questions)
    ? question.sub_questions
    : [];

  return (
    <div className="compare-card">
      <div className="compare-card-head">
        <h4>{title}</h4>
        {question ? (
          <Badge variant="neutral">{question.question_type ?? "-"}</Badge>
        ) : null}
      </div>

      {question ? (
        <div className="compare-card-body">
          <div className="modal-field">
            <span className="modal-label">Question</span>
            <p className="modal-text">{question.question}</p>
          </div>
          <div className="modal-two-cols">
            <div className="modal-field">
              <span className="modal-label">Order</span>
              <Badge variant="neutral">
                {question.order_num == null ? "-" : question.order_num}
              </Badge>
            </div>
            <div className="modal-field">
              <span className="modal-label">Type</span>
              <Badge variant="neutral">{question.question_type ?? "-"}</Badge>
            </div>
          </div>
          <div className="modal-field">
            <span className="modal-label">Objectif</span>
            <p className="modal-text">{question.objective?.objective ?? "-"}</p>
          </div>
          <div className="modal-field">
            <span className="modal-label">Image</span>
            <p className="modal-text">{question.image ?? "Pas d'image"}</p>
          </div>
          <div className="modal-field">
            <span className="modal-label">Feedback</span>
            <p className="modal-text">{question.feedback ?? "-"}</p>
          </div>
          <div className="modal-two-cols">
            <div className="modal-field">
              <span className="modal-label">Question audio</span>
              <p className="modal-text">{question.question_audio ?? "-"}</p>
            </div>
            <div className="modal-field">
              <span className="modal-label">Feedback audio</span>
              <p className="modal-text">{question.feedback_audio ?? "-"}</p>
            </div>
          </div>
          <div className="modal-field">
            <span className="modal-label">Sub-questions et reponses</span>
            <div className="modal-subquestions">
              {subQuestions.length === 0 ? (
                <p className="modal-text">No sub-questions.</p>
              ) : (
                subQuestions.map((subQuestion) => (
                  <div key={subQuestion.id} className="modal-subquestion-card">
                    <div className="modal-subquestion-head">
                      <strong>
                        {subQuestion.order_num == null
                          ? "-"
                          : subQuestion.order_num}
                        . {subQuestion.question}
                      </strong>
                    </div>
                    <div className="modal-answer-list">
                      {(Array.isArray(subQuestion.answers)
                        ? subQuestion.answers
                        : []
                      ).map((answer) => (
                        <div key={answer.id} className="modal-answer-item">
                          <Badge
                            variant={answer.is_right ? "success" : "neutral"}
                          >
                            {answer.is_right ? "Right" : "Wrong"}
                          </Badge>
                          <span>{answer.answer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <p className="modal-empty">No question data available.</p>
      )}
    </div>
  );
}

export function QuestionCorrectionContent({
  originalQuestion,
  correctedQuestion,
  corrections,
  explanation,
  detectedErrors,
}: QuestionCorrectionContentProps) {
  return (
    <>
      <div className="compare-summary">
        <div className="compare-summary-item">
          <span className="modal-label">Detected errors</span>
          <p className="modal-text">{detectedErrors ?? "-"}</p>
        </div>
        <div className="compare-summary-item">
          <span className="modal-label">Explanation</span>
          <p className="modal-text">{explanation ?? "-"}</p>
        </div>
        <div className="compare-summary-item">
          <span className="modal-label">Corrections</span>
          {corrections && corrections.length > 0 ? (
            <ul className="modal-list">
              {corrections.map((item, index) => (
                <li key={`${index}-${item}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="modal-text">-</p>
          )}
        </div>
      </div>

      <div className="compare-grid">
        <QuestionCard title="Original question" question={originalQuestion} />
        <QuestionCard
          title="AI corrected question"
          question={correctedQuestion}
        />
      </div>
    </>
  );
}
