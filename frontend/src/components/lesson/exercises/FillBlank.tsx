import { useState } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function FillBlank({ exercise, onSubmit, disabled }: ExerciseProps<string>) {
  const [selected, setSelected] = useState<string | null>(null)

  const options: string[] = exercise.options || []

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelected(option)
    onSubmit(option)
  }

  // Replace "___" with the selected option in the question, or an empty box
  const parts = exercise.question.split("___")

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Consistent Prompt Header */}
      <div className="w-full text-left mb-6 md:mb-8">
        <span className="text-xs md:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
          Complete the sentence
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">
          Fill in the blank
        </h2>
      </div>

      {/* Sentence with aligned inline blank */}
      <div className="w-full text-xl sm:text-2xl md:text-3xl font-black mb-10 text-gray-800 dark:text-white flex flex-wrap items-baseline gap-1.5 leading-loose">
        {parts.map((part, idx) => (
          <span key={idx} className="inline-flex items-baseline">
            <span>{part}</span>
            {idx < parts.length - 1 && (
              <span
                className={`mx-1.5 inline-flex items-center justify-center min-w-[90px] h-10 border-b-4 px-3 rounded-t-lg font-black text-lg sm:text-xl transition-all ${
                  selected
                    ? "border-[#1cb0f6] text-[#1cb0f6] bg-[#ddf4ff]/70 dark:bg-[#143242] dark:text-[#49c0f8]"
                    : "border-gray-300 dark:border-[#2b3d45] bg-gray-100 dark:bg-[#18282f]"
                }`}
              >
                {selected || ""}
              </span>
            )}
          </span>
        ))}
      </div>
      
      {/* Options bank */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 w-full">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={`px-7 py-3.5 border-2 border-b-4 rounded-2xl text-lg font-bold transition-all duration-100 select-none ${
              selected === option
                ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] dark:border-[#1cb0f6] dark:bg-[#143242] dark:text-[#49c0f8]"
                : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] hover:border-[#d4d4d4] text-[#4b4b4b] dark:bg-[#18282f] dark:border-[#2b3d45] dark:hover:bg-[#1f333c] dark:hover:border-[#384f5a] dark:text-gray-200"
            } ${
              disabled && selected !== option
                ? "opacity-50 cursor-not-allowed"
                : "active:border-b-2 active:translate-y-0.5 cursor-pointer"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
