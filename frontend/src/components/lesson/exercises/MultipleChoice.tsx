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
    <div className="flex flex-col items-center text-center w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">{exercise.question}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => handleSelect(option)}
            disabled={disabled}
            className={`p-4 border-2 rounded-xl text-lg font-bold transition-all ${
              selected === option
                ? "border-blue-400 bg-blue-50 text-blue-500"
                : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
            } ${disabled ? "opacity-75 cursor-not-allowed" : "active:scale-95"}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
