import type { QuestionApiItem } from './question.types'

export type RagContextDocument = {
  title: string
  document_type: string
}

export type QuestionCorrectionApiResponse = {
  corrections: string[]
  explanation: string
  detected_errors: string
  original_question?: QuestionApiItem
  rag_context?: RagContextDocument[]
  improved_question: QuestionApiItem
}

export type QuestionCorrectionFeedbackRequest = {
  rating: number
  comment: string
  correction: QuestionCorrectionApiResponse
}

export type QuestionCorrectionFeedbackResponse = {
  id: string
  question_id: string
  rating: number
  comment: string | null
  created_at: string
}

export type QuestionCorrectionChatRequest = {
  user_message: string
  previous_correction: QuestionCorrectionApiResponse
}
