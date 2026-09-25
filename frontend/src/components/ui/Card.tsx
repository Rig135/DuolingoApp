import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("rounded-2xl border-2 border-locked-border bg-white p-6 shadow-sm", className)} 
      {...props} 
    />
  )
}
