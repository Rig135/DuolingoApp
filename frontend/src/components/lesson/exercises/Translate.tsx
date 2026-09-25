import { useState, useEffect } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function Translate({ exercise, onSubmit, disabled }: ExerciseProps<string[]>) {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>(exercise.options || [])

  const handleSelect = (word: string, index: number) => {
    if (disabled) return
    const newAvailable = [...availableWords]
    newAvailable.splice(index, 1)
    setAvailableWords(newAvailable)
    
    const newSelected = [...selectedWords, word]
    setSelectedWords(newSelected)
    onSubmit(newSelected)
  }

  const handleDeselect = (word: string, index: number) => {
    if (disabled) return
    const newSelected = [...selectedWords]
    newSelected.splice(index, 1)
    setSelectedWords(newSelected)
    
    const newAvailable = [...availableWords, word]
    setAvailableWords(newAvailable)
    
    onSubmit(newSelected)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{exercise.question}</h2>
      
      {/* Target area */}
      <div className="w-full min-h-[60px] border-b-2 border-gray-200 mb-8 flex flex-wrap gap-2 pb-2">
        {selectedWords.map((word, idx) => (
          <button
            key={`selected-${idx}`}
            onClick={() => handleDeselect(word, idx)}
            disabled={disabled}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-lg font-bold text-gray-700 shadow-sm active:translate-y-1"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap justify-center gap-2">
        {availableWords.map((word, idx) => (
          <button
            key={`available-${idx}`}
            onClick={() => handleSelect(word, idx)}
            disabled={disabled}
            className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-lg font-bold text-gray-700 shadow-sm active:translate-y-1 hover:bg-gray-50"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  )
}
