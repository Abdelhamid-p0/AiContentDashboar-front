export type QuizTypeFilter = 'ALL' | 'FLASHCARD' | 'QUIZ'

export type QuizApiItem = {
  id: string
  title: string
  type: string | null
}

export type QuizGroupApiResponse = {
  flashcards: QuizApiItem[]
  quizzes: QuizApiItem[]
}

export type QuizRow = {
  id: string
  title: string
  type: string
}
