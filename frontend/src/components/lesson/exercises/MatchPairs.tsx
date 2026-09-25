import { useState } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function MatchPairs({ exercise, onSubmit, disabled }: ExerciseProps<any[]>) {
  const [leftSelected, setLeftSelected] = useState<string | null>(null)
  const [rightSelected, setRightSelected] = useState<string | null>(null)
  const [pairs, setPairs] = useState<{ en: string; es: string }[]>([])
  
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
    setLeftSelected(null)
    setRightSelected(null)
    onSubmit([])
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Consistent Prompt Header */}
      <div className="w-full text-left mb-6 md:mb-8">
        <span className="text-xs md:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
          Vocabulary
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">
          {exercise.question || "Tap the matching pairs"}
        </h2>
      </div>
      
      <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full">
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
                className={`w-full p-3.5 sm:p-4 min-h-[58px] border-2 border-b-4 rounded-2xl text-base sm:text-lg font-bold transition-all duration-100 select-none flex items-center justify-center text-center ${
                  isPaired
                    ? "opacity-35 border-[#e5e5e5] bg-[#f7f7f7] dark:bg-[#18282f]/40 dark:border-[#2b3d45] text-gray-400 border-b-2 cursor-not-allowed"
                    : isSelected
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] dark:border-[#1cb0f6] dark:bg-[#143242] dark:text-[#49c0f8] shadow-xs active:translate-y-0.5 active:border-b-2"
                    : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] hover:border-[#d4d4d4] text-[#4b4b4b] dark:bg-[#18282f] dark:border-[#2b3d45] dark:hover:bg-[#1f333c] dark:hover:border-[#384f5a] dark:text-gray-200 active:translate-y-0.5 active:border-b-2 cursor-pointer"
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
                className={`w-full p-3.5 sm:p-4 min-h-[58px] border-2 border-b-4 rounded-2xl text-base sm:text-lg font-bold transition-all duration-100 select-none flex items-center justify-center text-center ${
                  isPaired
                    ? "opacity-35 border-[#e5e5e5] bg-[#f7f7f7] dark:bg-[#18282f]/40 dark:border-[#2b3d45] text-gray-400 border-b-2 cursor-not-allowed"
                    : isSelected
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] dark:border-[#1cb0f6] dark:bg-[#143242] dark:text-[#49c0f8] shadow-xs active:translate-y-0.5 active:border-b-2"
                    : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] hover:border-[#d4d4d4] text-[#4b4b4b] dark:bg-[#18282f] dark:border-[#2b3d45] dark:hover:bg-[#1f333c] dark:hover:border-[#384f5a] dark:text-gray-200 active:translate-y-0.5 active:border-b-2 cursor-pointer"
                }`}
              >
                {word}
              </button>
            )
          })}
        </div>
      </div>
      
      {pairs.length > 0 && !disabled && (
        <button
          onClick={handleReset}
          className="mt-6 text-xs font-black uppercase tracking-wider text-gray-400 hover:text-[#ff4b4b] dark:text-gray-500 dark:hover:text-[#ff4b4b] transition-colors cursor-pointer py-1.5 px-3 rounded-lg"
        >
          Reset Selections
        </button>
      )}
    </div>
  )
}
