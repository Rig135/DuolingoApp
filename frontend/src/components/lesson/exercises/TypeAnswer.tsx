import { useState, useEffect } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function TypeAnswer({ exercise, onSubmit, disabled }: ExerciseProps<string>) {
  const [value, setValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setValue(text)
    onSubmit(text)
  }

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">{exercise.question}</h2>
      
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder="Type your answer here..."
        className="w-full p-4 text-xl border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 disabled:opacity-70 disabled:cursor-not-allowed"
        autoFocus
      />
    </div>
  )
}
