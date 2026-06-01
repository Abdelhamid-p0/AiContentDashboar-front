import type { CourseApiItem, CourseRow } from './course.types'

export function mapCourseToRow(course: CourseApiItem): CourseRow {
  return {
    id: course.id,
    title: course.title,
    domain: course.domain?.title ?? course.domain_id ?? '—',
    semester: course.semester ?? '—',
    active: Boolean(course.active),
    orderNum: course.order_num?.toString() ?? '—',
    levelId: course.level_id ?? '—',
    subjectId: course.subject_id ?? '—',
  }
}
