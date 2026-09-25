import { useState, useEffect } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function MatchPairs({ exercise, onSubmit, disabled }: ExerciseProps<any[]>) {
  const [leftSelected, setLeftSelected] = useState<string | null>(null)
  const [rightSelected, setRightSelected] = useState<string | null>(null)
  const [pairs, setPairs] = useState<{en: string, es: string}[]>([])
  
  const [leftWords] = useState<string[]>(() => {
    return [...(exercise.options || [])].map(o => o.en).sort(() => Math.random() - 0.5)
  })
  
  const [rightWords] = useState<string[]>(() => {
    return [...(exercise.options || [])].map(o => o.es).sort(() => Math.random() - 0.5)
  })

  const handleLeftClick = (word: string) => {
    if (disabled || pairs.some(p => p.en === word)) return
    const newLeft = word === leftSelected ? null : word
    setLeftSelected(newLeft)
    
    if (newLeft && rightSelected) {
      const newPairs = [...pairs, { en: newLeft, es: rightSelected }]
      setPairs(newPairs)
      setLeftSelected(null)
      setRightSelected(null)
      onSubmit(newPairs)
    }
  }

  const handleRightClick = (word: string) => {
    if (disabled || pairs.some(p => p.es === word)) return
    const newRight = word === rightSelected ? null : word
    setRightSelected(newRight)
    
    if (leftSelected && newRight) {
      const newPairs = [...pairs, { en: leftSelected, es: newRight }]
      setPairs(newPairs)
      setLeftSelected(null)
      setRightSelected(null)
      onSubmit(newPairs)
    }
  }



  const handleReset = () => {
    setPairs([])
    onSubmit([])
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{exercise.question}</h2>
      
      <div className="flex gap-8 w-full justify-center">
        {/* Left Column */}
        <div className="flex flex-col gap-3">
          {leftWords.map((word, idx) => {
            const isPaired = pairs.some(p => p.en === word)
            const isSelected = word === leftSelected
            return (
              <button
                key={`left-${idx}`}
                onClick={() => handleLeftClick(word)}
                disabled={disabled || isPaired}
                className={`w-32 p-4 border-2 rounded-xl text-lg font-bold transition-all ${
                  isPaired ? "opacity-30 border-gray-200 bg-gray-100" :
                  isSelected ? "border-blue-400 bg-blue-50 text-blue-500" :
                  "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 active:scale-95"
                }`}
              >
                {word}
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3">
          {rightWords.map((word, idx) => {
            const isPaired = pairs.some(p => p.es === word)
            const isSelected = word === rightSelected
            return (
              <button
                key={`right-${idx}`}
                onClick={() => handleRightClick(word)}
                disabled={disabled || isPaired}
                className={`w-32 p-4 border-2 rounded-xl text-lg font-bold transition-all ${
                  isPaired ? "opacity-30 border-gray-200 bg-gray-100" :
                  isSelected ? "border-blue-400 bg-blue-50 text-blue-500" :
                  "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 active:scale-95"
                }`}
              >
                {word}
              </button>
            )
          })}
        </div>
      </div>
      
      {pairs.length > 0 && !disabled && (
        <button onClick={handleReset} className="mt-6 text-red-400 font-bold hover:text-red-500">
          Reset Pairs
        </button>
      )}
    </div>
  )
}
