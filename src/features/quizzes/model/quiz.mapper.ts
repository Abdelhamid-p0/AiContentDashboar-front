import type { QuizApiItem, QuizRow } from './quiz.types'

export function mapQuizToRow(quiz: QuizApiItem): QuizRow {
  return {
    id: quiz.id,
    title: quiz.title,
    type: quiz.type ?? '—',
  }
}
