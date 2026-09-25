"use client"

import { useState, useEffect } from "react"
import { useLesson, ExercisePublic } from "@/hooks/useLesson"
import { ExerciseRenderer } from "./ExerciseRenderer"
import { useRouter } from "next/navigation"

type LessonState =
  | "LOADING"
  | "ERROR"
  | "ACTIVE"
  | "CHECKING"
  | "CORRECT"
  | "INCORRECT"
  | "COMPLETED"
  | "OUT_OF_HEARTS"
  | "EXIT_CONFIRM"

export function LessonPlayer({ lessonId }: { lessonId: string }) {
  const router = useRouter()
  const { lesson, loading, error, checkAnswer, completeLesson } = useLesson(lessonId)
  
  const [state, setState] = useState<LessonState>("LOADING")
  const [exerciseQueue, setExerciseQueue] = useState<ExercisePublic[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hearts, setHearts] = useState(5) // Default to 5, ideally synced from user profile
  const [currentAnswer, setCurrentAnswer] = useState<any>(null)
  const [feedback, setFeedback] = useState<{ is_correct?: boolean; correct_answer?: any; message?: string } | null>(null)
  
  useEffect(() => {
    if (loading) setState("LOADING")
    else if (error || !lesson) setState("ERROR")
    else {
      setExerciseQueue(lesson.exercises)
      setState("ACTIVE")
    }
  }, [lesson, loading, error])

  const currentExercise = exerciseQueue[currentIndex]

  const handleCheck = async () => {
    if (!currentExercise || currentAnswer === null) return

    setState("CHECKING")
    try {
      const result = await checkAnswer(currentExercise.id, currentAnswer)
      setHearts(result.hearts_remaining)
      setFeedback(result)
      
      if (result.is_correct) {
        setState("CORRECT")
      } else {
        setState("INCORRECT")
        if (result.hearts_remaining <= 0) {
          setState("OUT_OF_HEARTS")
        }
      }
    } catch (e) {
      console.error(e)
      setState("ERROR")
    }
  }

  const handleContinue = async () => {
    if (state === "CORRECT") {
      if (currentIndex + 1 >= exerciseQueue.length) {
        setState("COMPLETED")
        await completeLesson()
      } else {
        setCurrentIndex((prev) => prev + 1)
        setCurrentAnswer(null)
        setFeedback(null)
        setState("ACTIVE")
      }
    } else if (state === "INCORRECT") {
      // Move current exercise to the end of the queue to repeat later
      setExerciseQueue((prev) => [...prev, currentExercise])
      setCurrentIndex((prev) => prev + 1)
      setCurrentAnswer(null)
      setFeedback(null)
      setState("ACTIVE")
    }
  }

  const handleExitClick = () => {
    setState("EXIT_CONFIRM")
  }

  if (state === "LOADING") return <div className="flex h-screen items-center justify-center">Loading...</div>
  if (state === "ERROR") return <div className="flex h-screen items-center justify-center">Error loading lesson.</div>

  if (state === "EXIT_CONFIRM") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Are you sure you want to quit?</h2>
          <p className="text-gray-500 mb-6">All progress in this lesson will be lost.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setState("ACTIVE")}
              className="flex-1 py-3 font-bold rounded-xl bg-blue-400 text-white border-b-4 border-blue-600 active:border-b-0 active:translate-y-1"
            >
              KEEP LEARNING
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 py-3 font-bold rounded-xl text-red-500 bg-gray-100 border-b-4 border-gray-300 active:border-b-0 active:translate-y-1"
            >
              QUIT
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (state === "OUT_OF_HEARTS") {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white p-6 text-center">
        <div className="text-red-500 text-6xl mb-6">💔</div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">You ran out of hearts!</h2>
        <p className="text-gray-500 mb-8">Take a break and try again later, or refill your hearts.</p>
        <button
          onClick={() => router.push("/")}
          className="w-full max-w-sm py-4 font-bold rounded-xl bg-blue-400 text-white border-b-4 border-blue-600 active:border-b-0 active:translate-y-1"
        >
          CONTINUE
        </button>
      </div>
    )
  }

  if (state === "COMPLETED") {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white p-6 text-center">
        <div className="text-yellow-400 text-6xl mb-6">🏆</div>
        <h2 className="text-3xl font-bold mb-4 text-yellow-500">Lesson Complete!</h2>
        <p className="text-gray-500 mb-8 font-bold">You earned some XP.</p>
        <button
          onClick={() => router.push("/")}
          className="w-full max-w-sm py-4 font-bold rounded-xl bg-green-500 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1 text-xl"
        >
          CONTINUE
        </button>
      </div>
    )
  }

  const progressPercent = Math.round((currentIndex / exerciseQueue.length) * 100)

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Top Bar */}
      <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto w-full">
        <button onClick={handleExitClick} className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2">
          ✕
        </button>
        <div className="flex-1 bg-gray-200 rounded-full h-4 overflow-hidden relative">
          <div
            className="bg-green-500 h-full transition-all duration-300 rounded-full relative"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/30 rounded-full" />
          </div>
        </div>
        <div className="flex items-center text-red-500 font-bold">
          <span className="text-xl mr-1">❤️</span> {hearts}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {currentExercise && (
          <ExerciseRenderer
            exercise={currentExercise}
            onSubmit={(answer) => setCurrentAnswer(answer)}
            disabled={state !== "ACTIVE"}
          />
        )}
      </div>

      {/* Bottom Bar / Feedback */}
      <div
        className={`border-t-2 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors ${
          state === "CORRECT" ? "bg-green-100 border-green-200" : state === "INCORRECT" ? "bg-red-100 border-red-200" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex-1 font-bold text-xl">
          {state === "CORRECT" && <span className="text-green-600">Correct!</span>}
          {state === "INCORRECT" && (
            <div className="text-red-500">
              <div className="mb-2">Incorrect</div>
              <div className="text-sm font-normal text-red-400">Correct answer:</div>
              <div className="text-lg">{JSON.stringify(feedback?.correct_answer)}</div>
            </div>
          )}
        </div>
        
        {state === "ACTIVE" || state === "CHECKING" ? (
          <button
            onClick={handleCheck}
            disabled={currentAnswer === null || state === "CHECKING"}
            className={`w-full md:w-48 py-3 rounded-xl font-bold uppercase ${
              currentAnswer !== null
                ? "bg-green-500 text-white border-b-4 border-green-700 active:border-b-0 active:translate-y-1"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {state === "CHECKING" ? "Checking..." : "Check"}
          </button>
        ) : (
          <button
            onClick={handleContinue}
            className={`w-full md:w-48 py-3 rounded-xl font-bold uppercase text-white border-b-4 active:border-b-0 active:translate-y-1 ${
              state === "CORRECT" ? "bg-green-500 border-green-700" : "bg-red-500 border-red-700"
            }`}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  )
}
