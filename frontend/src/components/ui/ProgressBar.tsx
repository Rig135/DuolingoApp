import * as React from "react"
import { cn } from "@/lib/utils"

interface ProgressBarProps {
  progress: number // 0 to 100
  className?: string
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  const safeProgress = Math.max(0, Math.min(100, progress))
  
  return (
    <div className={cn("h-4 w-full rounded-full bg-locked overflow-hidden", className)}>
      <div 
        className="h-full bg-primary transition-all duration-500 ease-out"
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  )
}
