import { useEffect, useState } from 'react'
import { getQuizQuestions } from '../api/questions.api'
import { mapQuestionToRow } from '../model/question.mapper'
import type { QuestionRow } from '../model/question.types'

export function useQuizQuestionsPage(quizId: string) {
  const [rows, setRows] = useState<QuestionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setLoading(true)
    setError(null)

    getQuizQuestions(quizId)
      .then((response) => {
        if (!active) return
        setRows(response.questions.map(mapQuestionToRow))
      })
      .catch((requestError: unknown) => {
        if (!active) return
        setError(requestError instanceof Error ? requestError.message : 'Unable to load questions')
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [quizId])

  return {
    questions: rows,
    loading,
    error,
  }
}
