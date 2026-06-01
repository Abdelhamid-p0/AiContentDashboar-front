import { useEffect, useMemo, useState } from 'react'
import { getCourseFilters, getCourses } from '../api/courses.api'
import { mapCourseToRow } from '../model/course.mapper'
import type {
  FilterOption,
  CourseRow,
  CourseStatusFilter,
  SemesterFilter,
} from '../model/course.types'

const PAGE_SIZE = 8

export function useCoursesPage() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [semester, setSemester] = useState<SemesterFilter>('ALL')
  const [levelId, setLevelId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const [status, setStatus] = useState<CourseStatusFilter>('ALL')
  const [filterOptions, setFilterOptions] = useState<{
    levels: FilterOption[]
    subjects: FilterOption[]
    semesters: FilterOption[]
  }>({
    levels: [],
    subjects: [],
    semesters: [],
  })
  const [rows, setRows] = useState<CourseRow[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    getCourseFilters()
      .then((response) => {
        if (!active) return
        setFilterOptions(response)
      })
      .catch(() => {
        if (!active) return
        setFilterOptions({ levels: [], subjects: [], semesters: [] })
      })

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    getCourses({
      page,
      size: PAGE_SIZE,
      semester,
      levelId,
      subjectId,
    })
      .then((response) => {
        if (!active) return

        setRows(response.courses.map(mapCourseToRow))
        setTotalPages(response.total_pages)
        setTotalElements(response.total_elements)
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load courses')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [page, semester, levelId, subjectId])

  const filteredRows = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return rows.filter((row) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [row.title, row.domain, row.semester].some((value) =>
          value.toLowerCase().includes(normalizedSearch),
        )

      const matchesStatus =
        status === 'ALL' ||
        (status === 'ACTIVE' && row.active) ||
        (status === 'INACTIVE' && !row.active)

      return matchesSearch && matchesStatus
    })
  }, [rows, search, status])

  return {
    courses: filteredRows,
    filterOptions,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
    totalElements,
    loading,
    error,
    search,
    setSearch,
    semester,
    setSemester,
    levelId,
    setLevelId,
    subjectId,
    setSubjectId,
    status,
    setStatus,
    setPage,
  }
}
