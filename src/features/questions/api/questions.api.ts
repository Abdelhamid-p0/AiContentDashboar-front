import { fetchJson } from '@/shared/lib/http'
import type { QuestionApiItem, QuestionsApiResponse } from '../model/question.types'
import type {
  QuestionCorrectionApiResponse,
  QuestionCorrectionChatRequest,
} from '../model/question-correction.types'

export async function getQuizQuestions(quizId: string): Promise<QuestionsApiResponse> {
  return fetchJson<QuestionsApiResponse>(`/v1/quizzes/${quizId}/questions`)
}

export async function getQuestionDetails(questionId: string): Promise<QuestionApiItem> {
  return fetchJson<QuestionApiItem>(`/v1/questions/${questionId}`)
}

export async function getQuestionCorrection(
  questionId: string,
): Promise<QuestionCorrectionApiResponse> {
  return fetchJson<QuestionCorrectionApiResponse>(`/v1/questions/${questionId}/correct`)
}

export async function postQuestionCorrectionChat(
  questionId: string,
  payload: QuestionCorrectionChatRequest,
): Promise<QuestionCorrectionApiResponse> {
  return fetchJson<QuestionCorrectionApiResponse>(
    `/v1/questions/${questionId}/correct/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    },
  )
}
