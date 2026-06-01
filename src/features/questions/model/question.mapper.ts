import type { QuestionSummaryApiItem, QuestionRow } from './question.types'

export function mapQuestionToRow(question: QuestionSummaryApiItem): QuestionRow {
  return {
    id: question.id,
    order: question.order_num == null ? '—' : String(question.order_num),
    question: question.question,
    questionType: question.question_type ?? '—',
    objective: question.objective?.objective ?? '—',
  }
}
