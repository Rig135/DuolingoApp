import * as React from "react"
import { UnitSummary, SkillSummary } from "@/hooks/useDashboard"
import { SkillNode } from "./SkillNode"
import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface UnitSectionProps {
  unit: UnitSummary
  currentSkillId: number | null
}

const UNIT_THEMES: Record<number, { gradient: string; border: string }> = {
  1: {
    gradient: "from-[#58cc02] to-[#46a302]",
    border: "border-[#3e8e02]",
  },
  2: {
    gradient: "from-[#1cb0f6] to-[#1899d6]",
    border: "border-[#1479ab]",
  },
  3: {
    gradient: "from-[#ce82ff] to-[#a855f7]",
    border: "border-[#9333ea]",
  },
  4: {
    gradient: "from-[#ff9600] to-[#e08500]",
    border: "border-[#c27300]",
  },
}

export function UnitSection({ unit, currentSkillId }: UnitSectionProps) {
  const theme = UNIT_THEMES[unit.order] || UNIT_THEMES[1]

  return (
    <div className="flex flex-col w-full mb-14">
      {/* Unit Header Banner */}
      <div 
        className={`w-full bg-gradient-to-r ${theme.gradient} border-b-[5px] ${theme.border} rounded-2xl p-5 text-white flex justify-between items-center shadow-md mb-12 z-20 sticky top-14 md:top-2`}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-wider uppercase opacity-85">
              Unit {unit.order}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold tracking-tight">{unit.title}</h2>
          <p className="text-sm font-semibold opacity-95 mt-0.5 max-w-md">{unit.description}</p>
        </div>

        {/* Duolingo UI/UX Guidebook Button: Iconic Secondary Blue with 3D bottom border */}
        <Button 
          variant="secondary"
          className="hidden sm:flex items-center gap-2 font-black tracking-wider text-sm py-3 px-5 border-b-4 shadow-sm"
        >
          <BookOpen className="h-5 w-5 stroke-[2.5]" />
          <span>Guidebook</span>
        </Button>
      </div>

      {/* Path with Curved Skill Nodes */}
      <div className="flex flex-col items-center gap-14 py-4 relative">
        {unit.skills.map((skill: SkillSummary, i: number) => {
          const isCurrent = currentSkillId === skill.id
          return (
            <SkillNode 
              key={skill.id} 
              skill={skill} 
              isCurrent={isCurrent} 
              index={i} 
            />
          )
        })}
      </div>
    </div>
  )
}
