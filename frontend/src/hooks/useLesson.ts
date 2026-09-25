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
  out_of_hearts?: boolean
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
    if (!lessonId || lessonId === "undefined") return
    setLoading(true)
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
      try {
        const res = await fetch(`http://localhost:8000/api/exercises/${exerciseId}/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user_answer: answer }),
        })
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          const detailStr = typeof errorData.detail === "string" ? errorData.detail : ""
          if (res.status === 400 && detailStr.toLowerCase().includes("heart")) {
            return {
              is_correct: false,
              hearts_remaining: 0,
              correct_answer: null,
              message: detailStr || "Out of hearts",
              out_of_hearts: true,
            }
          }
          return {
            is_correct: false,
            hearts_remaining: 0,
            correct_answer: null,
            message: detailStr || "Failed to check answer",
          }
        }
        return await res.json()
      } catch {
        return {
          is_correct: false,
          hearts_remaining: 0,
          correct_answer: null,
          message: "Network error occurred",
        }
      }
    },
    []
  )

  const refillHearts = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("http://localhost:8000/api/users/me/refill-hearts", {
        method: "POST",
      })
      return res.ok
    } catch {
      return false
    }
  }, [])

  const completeLesson = useCallback(
    async (): Promise<CompleteLessonResponse> => {
      try {
        const res = await fetch(`http://localhost:8000/api/lessons/${lessonId}/complete`, {
          method: "POST",
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          return {
            success: false,
            xp_awarded: 0,
            total_xp: 0,
            streak: 0,
            skill_completed: false,
            next_skill_unlocked: false,
            message: errData.detail || "Failed to complete lesson",
          }
        }
        return await res.json()
      } catch {
        return {
          success: false,
          xp_awarded: 0,
          total_xp: 0,
          streak: 0,
          skill_completed: false,
          next_skill_unlocked: false,
          message: "Network error completing lesson",
        }
      }
    },
    [lessonId]
  )

  return { lesson, loading, error, checkAnswer, completeLesson, refillHearts }
}
