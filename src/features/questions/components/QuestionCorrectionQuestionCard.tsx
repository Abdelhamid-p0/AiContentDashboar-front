import type { QuestionApiItem } from "@/features/questions/model/question.types";

type QuestionCorrectionQuestionCardProps = {
  title: string;
  question: QuestionApiItem | null;
};

export function QuestionCorrectionQuestionCard({
  title,
  question,
}: QuestionCorrectionQuestionCardProps) {
  const subQuestions = Array.isArray(question?.sub_questions)
    ? question.sub_questions
    : [];

  return (
    <div className="chatgpt-question-card">
      <div className="chatgpt-question-head">
        <span className="chatgpt-question-title">{title}</span>
        <span className="chatgpt-question-type">
          {question?.question_type ?? "-"}
        </span>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Question</span>
        <p className="chatgpt-field-value">{question?.question ?? "-"}</p>
      </div>
      <div className="chatgpt-field-grid">
        <div className="chatgpt-field">
          <span className="chatgpt-field-label">Order</span>
          <span className="chatgpt-field-value">
            {question?.order_num ?? "-"}
          </span>
        </div>
        <div className="chatgpt-field">
          <span className="chatgpt-field-label">Type</span>
          <span className="chatgpt-field-value">
            {question?.question_type ?? "-"}
          </span>
        </div>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Objectif</span>
        <p className="chatgpt-field-value">
          {question?.objective?.objective ?? "-"}
        </p>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Feedback</span>
        <p className="chatgpt-field-value">{question?.feedback ?? "-"}</p>
      </div>
      <div className="chatgpt-field">
        <span className="chatgpt-field-label">Sub-questions et reponses</span>
        <div className="chatgpt-subquestions">
          {subQuestions.length ? (
            subQuestions.map((subQuestion) => (
              <div key={subQuestion.id} className="chatgpt-subquestion">
                <div className="chatgpt-subquestion-title">
                  {subQuestion.order_num ?? "-"}. {subQuestion.question}
                </div>
                <div className="chatgpt-answers">
                  {(Array.isArray(subQuestion.answers)
                    ? subQuestion.answers
                    : []
                  ).map((answer) => (
                    <span
                      key={answer.id}
                      className={`chatgpt-answer${
                        answer.is_right ? " is-right" : ""
                      }`}
                    >
                      {answer.answer}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="chatgpt-field-value">-</p>
          )}
        </div>
      </div>
    </div>
  );
}
