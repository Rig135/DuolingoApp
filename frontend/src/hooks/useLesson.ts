import { useState, useEffect, useCallback } from "react"

export type ExercisePublic = {
  id: number
  lesson_id: number
  type: string
  question: string
  options?: any
  order: number
}

export type LessonDetail = {
  id: number
  skill_id: number
  order: number
  exercises: ExercisePublic[]
}

export type CheckAnswerResponse = {
  is_correct: boolean
  hearts_remaining: number
  correct_answer: any
  message: string
}

export type CompleteLessonResponse = {
  success: boolean
  xp_awarded: number
  total_xp: number
  streak: number
  skill_completed: boolean
  next_skill_unlocked: boolean
  message: string
}

export function useLesson(lessonId: string) {
  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`http://localhost:8000/api/lessons/${lessonId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lesson")
        return res.json()
      })
      .then((data) => {
        setLesson(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [lessonId])

  const checkAnswer = useCallback(
    async (exerciseId: number, answer: any): Promise<CheckAnswerResponse> => {
      const res = await fetch(`http://localhost:8000/api/exercises/${exerciseId}/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_answer: answer }),
      })
      if (!res.ok) throw new Error("Failed to check answer")
      return res.json()
    },
    []
  )

  const completeLesson = useCallback(
    async (): Promise<CompleteLessonResponse> => {
      const res = await fetch(`http://localhost:8000/api/lessons/${lessonId}/complete`, {
        method: "POST",
      })
      if (!res.ok) throw new Error("Failed to complete lesson")
      return res.json()
    },
    [lessonId]
  )

  return { lesson, loading, error, checkAnswer, completeLesson }
}
