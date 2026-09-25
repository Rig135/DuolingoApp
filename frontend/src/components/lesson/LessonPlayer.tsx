"use client"

import { useState, useEffect } from "react"
import { useLesson, ExercisePublic } from "@/hooks/useLesson"
import { ExerciseRenderer } from "./ExerciseRenderer"
import { useRouter } from "next/navigation"
import { X, Heart, Trophy, CheckCircle2, XCircle } from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

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
  const { lesson, loading, error, checkAnswer, completeLesson, refillHearts } = useLesson(lessonId)
  
  const [state, setState] = useState<LessonState>("LOADING")
  const [exerciseQueue, setExerciseQueue] = useState<ExercisePublic[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hearts, setHearts] = useState(5)
  const [currentAnswer, setCurrentAnswer] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { width, height } = useWindowSize()
  const [feedback, setFeedback] = useState<{ is_correct?: boolean; correct_answer?: any; message?: string } | null>(null)
  
  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.hearts !== undefined) {
          setHearts(data.user.hearts)
          if (data.user.hearts <= 0) {
            setState("OUT_OF_HEARTS")
          }
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (loading) {
      setState("LOADING")
    } else if (error || !lesson) {
      setState("ERROR")
    } else {
      setExerciseQueue(lesson.exercises)
      if (lesson.exercises.length === 0) {
        setState("COMPLETED")
        completeLesson().catch(console.error)
      } else {
        setState("ACTIVE")
      }
    }
  }, [lesson, loading, error, completeLesson])

  const currentExercise = exerciseQueue[currentIndex]

  const formatCorrectAnswer = (ans: any): string => {
    if (typeof ans === "string") return ans
    if (Array.isArray(ans)) {
      if (typeof ans[0] === "string") return ans.join(" ")
      if (typeof ans[0] === "object" && ans[0]?.en) {
        return ans.map((p: any) => `${p.en} = ${p.es}`).join(", ")
      }
    }
    return JSON.stringify(ans)
  }

  const handleCheck = async () => {
    if (!currentExercise || currentAnswer === null) return

    setState("CHECKING")
    try {
      const result = await checkAnswer(currentExercise.id, currentAnswer)
      setHearts(result.hearts_remaining)
      setFeedback(result)
      
      if (result.out_of_hearts || result.hearts_remaining <= 0) {
        setState("OUT_OF_HEARTS")
        return
      }

      if (result.is_correct) {
        setState("CORRECT")
      } else {
        setState("INCORRECT")
      }
    } catch {
      setState("ERROR")
    }
  }

  const handleContinue = async () => {
    if (isSubmitting) return
    if (state === "CORRECT") {
      if (currentIndex + 1 >= exerciseQueue.length) {
        setIsSubmitting(true)
        setState("COMPLETED")
        try {
          await completeLesson()
        } finally {
          setIsSubmitting(false)
        }
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

  // Keyboard accessibility for Enter key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (state === "ACTIVE" && currentAnswer !== null) {
          handleCheck()
        } else if (state === "CORRECT" || state === "INCORRECT" || state === "OUT_OF_HEARTS" || state === "COMPLETED") {
          // If we are in a feedback state, simulate continue
          if (state === "OUT_OF_HEARTS" || state === "COMPLETED") {
            router.push("/")
          } else {
            handleContinue()
          }
        }
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state, currentAnswer, handleCheck, handleContinue, router])

  if (state === "LOADING") {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#131f24] flex-col gap-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#58cc02]"></div>
        <h2 className="text-xl font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider animate-pulse">Loading Lesson...</h2>
      </div>
    )
  }
  if (state === "ERROR") {
    return (
      <div className="flex h-screen items-center justify-center bg-white dark:bg-[#131f24] flex-col gap-4 text-center p-6">
        <XCircle className="w-16 h-16 text-[#ff4b4b] mb-2" />
        <h2 className="text-2xl font-black text-gray-800 dark:text-white">Error loading lesson.</h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold mb-6">Please check your connection and try again.</p>
        <button
          onClick={() => router.push("/")}
          className="w-full max-w-xs py-3.5 rounded-2xl font-black uppercase tracking-wider text-white bg-[#58cc02] border-b-4 border-[#46a302] hover:bg-[#61e002] active:border-b-0 active:translate-y-1 cursor-pointer"
        >
          Go Back
        </button>
      </div>
    )
  }

  if (state === "EXIT_CONFIRM") {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-[#18282f] border-2 border-gray-100 dark:border-[#2b3d45] rounded-3xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-4xl mb-3">🥺</div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-2">Are you sure you want to quit?</h2>
          <p className="text-gray-500 dark:text-gray-400 font-bold mb-6 text-sm md:text-base">All progress in this lesson will be lost.</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setState("ACTIVE")}
              className="w-full py-3.5 font-black uppercase tracking-wider rounded-2xl bg-[#1cb0f6] hover:bg-[#20b8ff] text-white border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 cursor-pointer transition-all"
            >
              KEEP LEARNING
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3.5 font-black uppercase tracking-wider rounded-2xl text-[#ff4b4b] bg-white dark:bg-[#18282f] border-2 border-b-4 border-gray-200 dark:border-[#2b3d45] hover:bg-gray-50 dark:hover:bg-[#1f333c] active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all"
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
      <div className="flex flex-col h-screen items-center justify-center bg-white dark:bg-[#131f24] p-6 text-center">
        <div className="text-red-500 text-6xl mb-6 animate-pulse select-none">💔</div>
        <h2 className="text-3xl font-black mb-3 text-gray-800 dark:text-white">You ran out of hearts!</h2>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg mb-8 max-w-sm">
          Refill your hearts now to keep learning, or return to the dashboard.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={async () => {
              const success = await refillHearts()
              if (success) {
                setHearts(5)
                setState("ACTIVE")
              }
            }}
            className="w-full py-4 font-black uppercase tracking-wider rounded-2xl bg-[#58cc02] hover:bg-[#61e002] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 cursor-pointer shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>REFILL HEARTS (5 ❤️)</span>
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3.5 font-black uppercase tracking-wider rounded-2xl text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#18282f] border-2 border-b-4 border-gray-200 dark:border-[#2b3d45] hover:bg-gray-200 dark:hover:bg-[#1f333c] active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all"
          >
            BACK TO DASHBOARD
          </button>
        </div>
      </div>
    )
  }

  if (state === "COMPLETED") {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-white dark:bg-[#131f24] p-6 text-center relative overflow-hidden">
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={400}
          gravity={0.15}
        />
        <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-950/40 border-2 border-yellow-200 dark:border-yellow-800/40 flex items-center justify-center mb-6 shadow-sm z-10 animate-bounce">
          <Trophy className="w-14 h-14 text-yellow-500 fill-yellow-400" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black mb-3 text-gray-800 dark:text-white z-10">Lesson Complete!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 font-bold z-10">You earned XP and made progress on your path!</p>
        <button
          onClick={() => router.push("/")}
          className="w-full max-w-xs h-12 font-black rounded-2xl bg-[#58cc02] hover:bg-[#61e002] text-white border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 text-lg uppercase tracking-wider transition-all z-10 shadow-lg cursor-pointer"
        >
          Continue
        </button>
      </div>
    )
  }

  const progressPercent = Math.round((currentIndex / exerciseQueue.length) * 100)

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#131f24] justify-between">
      {/* Top Bar */}
      <div className="flex items-center gap-4 px-6 py-6 max-w-4xl mx-auto w-full">
        <button
          onClick={handleExitClick}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors p-1 rounded-lg cursor-pointer"
          aria-label="Exit lesson"
        >
          <X className="w-6 h-6 stroke-[2.5]" />
        </button>
        <div className="flex-1 bg-gray-200 dark:bg-[#2b3d45] rounded-full h-4 overflow-hidden relative">
          <div
            className="bg-[#58cc02] h-full transition-all duration-500 rounded-full relative"
            style={{ width: `${Math.max(5, progressPercent)}%` }}
          >
            <div className="absolute top-1 left-2 right-2 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
        <div className="flex items-center text-red-500 font-black gap-1.5 text-lg select-none">
          <Heart className="w-7 h-7 fill-[#ff4b4b] text-[#ff4b4b]" />
          <span>{hearts}</span>
        </div>
      </div>

      {/* Main Content - Consistent top alignment prevents vertical jumping */}
      <div className="flex-1 overflow-y-auto px-6 pt-6 md:pt-10 pb-8 flex flex-col items-center max-w-2xl mx-auto w-full">
        {currentExercise && (
          <ExerciseRenderer
            key={`${currentExercise.id}-${currentIndex}`}
            exercise={currentExercise}
            onSubmit={(answer) => setCurrentAnswer(answer)}
            disabled={state !== "ACTIVE"}
          />
        )}
      </div>

      {/* Bottom Bar / Feedback with consistent min-height to prevent jitter */}
      <div
        className={`w-full border-t-2 py-4 px-6 md:py-6 md:px-10 transition-colors duration-200 min-h-[96px] md:min-h-[108px] flex items-center ${
          state === "CORRECT"
            ? "bg-[#d7ffb8] dark:bg-[#19321f] border-[#a5ed6e] dark:border-[#2d5924]"
            : state === "INCORRECT"
            ? "bg-[#ffdfe0] dark:bg-[#341819] border-[#ffb3b4] dark:border-[#5c2426]"
            : "bg-white dark:bg-[#18282f] border-gray-200 dark:border-[#2b3d45]"
        }`}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {state === "CORRECT" && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#203a1b] flex items-center justify-center text-[#58a700] shadow-sm">
                  <CheckCircle2 className="w-8 h-8 fill-[#58cc02] text-white" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-[#58a700] dark:text-[#58cc02]">Nicely done!</h3>
                </div>
              </div>
            )}
            {state === "INCORRECT" && (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-[#3d1a1b] flex items-center justify-center text-[#ea2b2b] shadow-sm">
                  <XCircle className="w-8 h-8 fill-[#ff4b4b] text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#ea2b2b] dark:text-[#ff4b4b]">Correct solution:</h3>
                  <p className="text-base md:text-lg font-bold text-[#ea2b2b] dark:text-[#ff7878]">
                    {feedback?.correct_answer ? formatCorrectAnswer(feedback.correct_answer) : ""}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-auto flex justify-end">
            {state === "ACTIVE" || state === "CHECKING" ? (
              <button
                onClick={handleCheck}
                disabled={currentAnswer === null || state === "CHECKING"}
                className={`w-full md:w-44 h-12 rounded-2xl font-black uppercase tracking-wider text-base border-b-4 transition-all duration-100 select-none ${
                  currentAnswer !== null
                    ? "bg-[#58cc02] hover:bg-[#61e002] border-[#46a302] text-white active:translate-y-1 active:border-b-0 cursor-pointer"
                    : "bg-[#e5e5e5] dark:bg-[#2b383f] border-[#d4d4d4] dark:border-[#202b33] text-[#afafaf] dark:text-[#52656d] cursor-not-allowed"
                }`}
              >
                {state === "CHECKING" ? "Checking..." : "Check"}
              </button>
            ) : (
              <button
                onClick={handleContinue}
                className={`w-full md:w-44 h-12 rounded-2xl font-black uppercase tracking-wider text-base border-b-4 text-white transition-all duration-100 select-none active:translate-y-1 active:border-b-0 cursor-pointer ${
                  state === "CORRECT"
                    ? "bg-[#58cc02] hover:bg-[#61e002] border-[#46a302]"
                    : "bg-[#ff4b4b] hover:bg-[#ff5f5f] border-[#ea2b2b]"
                }`}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
