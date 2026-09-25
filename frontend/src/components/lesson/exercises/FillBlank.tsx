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
    <div className="flex flex-col items-center w-full">
      <div className="text-2xl font-bold mb-10 text-gray-800 text-center flex flex-wrap justify-center items-center gap-2">
        {parts.map((part, idx) => (
          <span key={idx} className="flex items-center">
            {part}
            {idx < parts.length - 1 && (
              <span className={`mx-2 inline-flex items-center justify-center min-w-[80px] h-10 border-b-4 px-4 ${
                selected ? "border-blue-400 text-blue-500" : "border-gray-300 bg-gray-100"
              }`}>
                {selected || ""}
              </span>
            )}
          </span>
        ))}
      </div>
      
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={`px-8 py-4 border-2 rounded-xl text-lg font-bold transition-all ${
              selected === option
                ? "border-blue-400 bg-blue-50 text-blue-500"
                : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 active:scale-95"
            } ${disabled && selected !== option ? "opacity-50" : ""}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
