import { useEffect, useMemo, useState } from 'react'
import { getCourseQuizzes } from '../api/quizzes.api'
import { mapQuizToRow } from '../model/quiz.mapper'
import type { QuizRow, QuizTypeFilter } from '../model/quiz.types'

export function useCourseQuizzesPage(courseId: string) {
  const [selectedType, setSelectedType] = useState<QuizTypeFilter>('ALL')
  const [rows, setRows] = useState<QuizRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    getCourseQuizzes(courseId)
      .then((response) => {
        if (!active) return

        const flashcards = response.flashcards.map(mapQuizToRow)
        const quizzes = response.quizzes.map(mapQuizToRow)
        setRows([...flashcards, ...quizzes])
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load quizzes')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [courseId])

  const filteredRows = useMemo(() => {
    if (selectedType === 'ALL') {
      return rows
    }

    return rows.filter((row) => row.type === selectedType)
  }, [rows, selectedType])

  return {
    quizzes: filteredRows,
    loading,
    error,
    selectedType,
    setSelectedType,
  }
}
