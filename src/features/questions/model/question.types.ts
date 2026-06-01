export type QuestionApiObjective = {
  id: string
  objective: string
}

export type QuestionApiAnswer = {
  id: string
  answer: string
  image: string | null
  is_right: boolean
  answer_audio: string | null
  order_num: number | null
}

export type QuestionApiSubQuestion = {
  id: string
  question: string
  order_num: number | null
  answers: QuestionApiAnswer[]
}

export type QuestionApiItem = {
  id: string
  question: string
  question_type: string | null
  image: string | null
  feedback: string | null
  feedback_audio: string | null
  question_audio: string | null
  order_num: number | null
  objective: QuestionApiObjective | null
  sub_questions: QuestionApiSubQuestion[]
}

export type QuestionSummaryApiItem = {
  id: string
  question: string
  question_type: string | null
  order_num: number | null
  objective: QuestionApiObjective | null
}

export type QuestionsApiResponse = {
  questions: QuestionSummaryApiItem[]
}

export type QuestionRow = {
  id: string
  order: string
  question: string
  questionType: string
  objective: string
}
