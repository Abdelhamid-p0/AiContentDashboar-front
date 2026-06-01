import { fetchJson } from '@/shared/lib/http'
import type {
  CourseFiltersApiResponse,
  CourseApiItem,
  PagedCoursesApiResponse,
  SemesterFilter,
} from '../model/course.types'
import type { QuizGroupApiResponse } from '@/features/quizzes/model/quiz.types'

type CoursesQuery = {
  page?: number
  size?: number
  levelId?: string
  subjectId?: string
  semester?: SemesterFilter
}

export async function getCourses(
  query: CoursesQuery,
): Promise<PagedCoursesApiResponse> {
  const params = new URLSearchParams()

  if (typeof query.page === 'number') params.set('page', String(query.page))
  if (typeof query.size === 'number') params.set('size', String(query.size))
  if (query.levelId?.trim()) params.set('level_id', query.levelId.trim())
  if (query.subjectId?.trim()) params.set('subject_id', query.subjectId.trim())
  if (query.semester && query.semester !== 'ALL') params.set('semester', query.semester)

  const queryString = params.toString()
  return fetchJson<PagedCoursesApiResponse>(
    queryString.length > 0 ? `/v1/courses?${queryString}` : '/v1/courses',
  )
}

export async function getCourseFilters(): Promise<CourseFiltersApiResponse> {
  return fetchJson<CourseFiltersApiResponse>('/v1/courses/filters')
}

export async function getCourseQuizzes(
  courseId: string,
): Promise<QuizGroupApiResponse> {
  return fetchJson<QuizGroupApiResponse>(`/v1/courses/${courseId}/quizzes`)
}

export type { CourseApiItem }
