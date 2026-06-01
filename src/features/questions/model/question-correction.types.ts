import type { QuestionApiItem } from './question.types'

export type QuestionCorrectionApiResponse = {
  corrections: string[]
  explanation: string
  detected_errors: string
  improved_question: QuestionApiItem
}

export type QuestionCorrectionChatRequest = {
  user_message: string
  previous_correction: QuestionCorrectionApiResponse
}
