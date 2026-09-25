"use client"
import * as React from "react"
import { useDashboard } from "@/hooks/useDashboard"
import { UnitSection } from "@/components/path/UnitSection"

export default function Home() {
  const { data, loading } = useDashboard()

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    )
  }

  if (!data || !data.units) {
    return (
      <div className="flex w-full items-center justify-center p-20 text-text-muted font-bold">
        Failed to load learning path.
      </div>
    )
  }

  // Find the first available skill (unlocked but not completed) to mark as current
  let currentSkillId: number | null = null
  for (const unit of data.units) {
    const current = unit.skills.find(s => s.is_unlocked && s.completed_lessons < s.total_lessons)
    if (current) {
      currentSkillId = current.id
      break
    }
  }

  return (
    <div className="flex flex-col w-full">
      {data.units.map(unit => (
        <UnitSection 
          key={unit.id} 
          unit={unit} 
          currentSkillId={currentSkillId} 
        />
      ))}
    </div>
  )
}
