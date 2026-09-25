import { useState } from "react"
import { ExerciseProps } from "../ExerciseRenderer"

export function TypeAnswer({ exercise, onSubmit, disabled }: ExerciseProps<string>) {
  const [value, setValue] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setValue(text)
    onSubmit(text)
  }

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Consistent Prompt Header */}
      <div className="w-full text-left mb-6 md:mb-8">
        <span className="text-xs md:text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-1">
          Write this in Spanish
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-white">
          {exercise.question}
        </h2>
      </div>
      
      {/* Tactile input container with full dark mode support */}
      <div className="w-full">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          disabled={disabled}
          placeholder="Type your answer here..."
          className="w-full p-4 sm:p-5 text-xl font-bold border-2 border-b-4 border-[#e5e5e5] dark:border-[#2b3d45] rounded-2xl focus:border-[#1cb0f6] focus:border-b-4 dark:focus:border-[#1cb0f6] focus:outline-none transition-all bg-white dark:bg-[#18282f] text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-60 disabled:cursor-not-allowed shadow-xs"
          autoFocus
        />
      </div>
    </div>
  )
}
