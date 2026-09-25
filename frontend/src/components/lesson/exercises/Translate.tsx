import { useState } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

interface SelectedWordToken {
  index: number
  text: string
}

export function Translate({ exercise, onSubmit, disabled }: ExerciseProps<string[]>) {
  const options: string[] = exercise.options || []
  const [selectedTokens, setSelectedTokens] = useState<SelectedWordToken[]>([])
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set())

  const handleSelect = (word: string, index: number) => {
    if (disabled || usedIndices.has(index)) return
    
    const newUsed = new Set(usedIndices)
    newUsed.add(index)
    setUsedIndices(newUsed)
    
    const newSelected = [...selectedTokens, { index, text: word }]
    setSelectedTokens(newSelected)
    onSubmit(newSelected.map(t => t.text))
  }

  const handleDeselect = (token: SelectedWordToken, listIndex: number) => {
    if (disabled) return
    
    const newUsed = new Set(usedIndices)
    newUsed.delete(token.index)
    setUsedIndices(newUsed)
    
    const newSelected = [...selectedTokens]
    newSelected.splice(listIndex, 1)
    setSelectedTokens(newSelected)
    onSubmit(newSelected.map(t => t.text))
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Consistent Prompt Header */}
      <div className="w-full text-left mb-6 md:mb-8">
        <span className="text-xs md:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
          Translate this sentence
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">
          {exercise.question}
        </h2>
      </div>
      
      {/* Target area with stable baseline */}
      <div className="w-full min-h-[76px] border-b-2 border-gray-200 dark:border-[#2b3d45] mb-8 flex flex-wrap gap-2.5 items-center pb-3">
        {selectedTokens.length === 0 ? (
          <div className="text-gray-400 dark:text-gray-500 font-bold text-sm select-none py-2 px-1">
            Tap the words below to construct your translation
          </div>
        ) : (
          selectedTokens.map((token, idx) => (
            <button
              key={`selected-${idx}-${token.index}`}
              onClick={() => handleDeselect(token, idx)}
              disabled={disabled}
              className="px-4 py-2.5 bg-white dark:bg-[#18282f] border-2 border-b-4 border-[#e5e5e5] dark:border-[#2b3d45] rounded-xl text-lg font-bold text-[#4b4b4b] dark:text-white shadow-xs active:border-b-2 active:translate-y-0.5 cursor-pointer transition-all select-none hover:border-[#d4d4d4]"
            >
              {token.text}
            </button>
          ))
        )}
      </div>

      {/* Word bank with ghost placeholders to eliminate layout shift */}
      <div className="flex flex-wrap justify-center gap-2.5 w-full">
        {options.map((word, idx) => {
          const isUsed = usedIndices.has(idx)
          if (isUsed) {
            return (
              <div
                key={`slot-${idx}`}
                className="px-4 py-2.5 rounded-xl bg-[#e5e5e5] dark:bg-[#2b383f]/60 min-h-[48px] border-2 border-transparent select-none opacity-50 flex items-center justify-center"
              >
                <span className="invisible text-lg font-bold">{word}</span>
              </div>
            )
          }

          return (
            <button
              key={`available-${idx}`}
              onClick={() => handleSelect(word, idx)}
              disabled={disabled}
              className="px-4 py-2.5 bg-white dark:bg-[#18282f] border-2 border-b-4 border-[#e5e5e5] dark:border-[#2b3d45] rounded-xl text-lg font-bold text-[#4b4b4b] dark:text-white shadow-xs active:border-b-2 active:translate-y-0.5 hover:bg-[#f7f7f7] dark:hover:bg-[#1f333c] hover:border-[#d4d4d4] cursor-pointer transition-all select-none"
            >
              {word}
            </button>
          )
        })}
      </div>
    </div>
  )
}
