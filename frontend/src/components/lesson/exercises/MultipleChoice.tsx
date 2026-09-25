import { useState } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function MultipleChoice({ exercise, onSubmit, disabled }: ExerciseProps<string>) {
  const [selected, setSelected] = useState<string | null>(null)

  const options: string[] = exercise.options || []

  const handleSelect = (option: string) => {
    if (disabled) return
    setSelected(option)
    onSubmit(option)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8 text-gray-800 dark:text-white text-left w-full">
        {exercise.question}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full">
        {options.map((option, idx) => {
          const isSelected = selected === option
          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={disabled}
              className={`p-4 md:p-5 border-2 border-b-4 rounded-2xl text-lg font-bold transition-all duration-100 flex items-center justify-between text-left select-none ${
                isSelected
                  ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6] dark:border-[#1cb0f6] dark:bg-[#143242] dark:text-[#49c0f8]"
                  : "border-[#e5e5e5] bg-white hover:bg-[#f7f7f7] hover:border-[#d4d4d4] text-[#4b4b4b] dark:bg-[#18282f] dark:border-[#2b3d45] dark:hover:bg-[#1f333c] dark:hover:border-[#384f5a] dark:text-gray-200"
              } ${
                disabled
                  ? "opacity-75 cursor-not-allowed"
                  : "active:border-b-2 active:translate-y-0.5 cursor-pointer"
              }`}
            >
              <span>{option}</span>
              <span
                className={`text-xs font-black px-2 py-1 rounded-md border ${
                  isSelected
                    ? "border-[#84d8ff] text-[#1cb0f6] bg-white dark:border-[#1cb0f6] dark:text-[#49c0f8] dark:bg-[#18282f]"
                    : "border-gray-200 text-gray-400 bg-white dark:border-[#2b3d45] dark:text-gray-500 dark:bg-[#131f24]"
                }`}
              >
                {idx + 1}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
