import { fetchJson } from '@/shared/lib/http'
import type { QuizGroupApiResponse } from '../model/quiz.types'

export async function getCourseQuizzes(courseId: string): Promise<QuizGroupApiResponse> {
  return fetchJson<QuizGroupApiResponse>(`/v1/courses/${courseId}/quizzes`)
}
