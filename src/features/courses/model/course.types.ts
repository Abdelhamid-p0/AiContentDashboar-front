export type SemesterFilter = 'ALL' | 'S1' | 'S2'
export type CourseStatusFilter = 'ALL' | 'ACTIVE' | 'INACTIVE'

export type FilterOption = {
  value: string
  label: string
}

export type CourseFiltersApiResponse = {
  levels: FilterOption[]
  subjects: FilterOption[]
  semesters: FilterOption[]
}

export type CourseApiDomain = {
  id: string
  title: string
}

export type CourseApiItem = {
  id: string
  title: string
  image: string | null
  order_num: number | null
  active: boolean | null
  semester: string | null
  domain_id: string | null
  level_id: string | null
  subject_id: string | null
  domain: CourseApiDomain | null
}

export type PagedCoursesApiResponse = {
  courses: CourseApiItem[]
  page: number
  size: number
  total_elements: number
  total_pages: number
}

export type CourseRow = {
  id: string
  title: string
  domain: string
  semester: string
  orderNum: string
  active: boolean
  levelId: string
  subjectId: string
}
