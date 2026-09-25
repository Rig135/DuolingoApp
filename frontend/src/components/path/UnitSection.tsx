import * as React from "react"
import { UnitSummary, SkillSummary } from "@/hooks/useDashboard"
import { SkillNode } from "./SkillNode"
import { BookOpen } from "lucide-react"

interface UnitSectionProps {
  unit: UnitSummary
  currentSkillId: number | null
}

const UNIT_THEMES: Record<number, { gradient: string; border: string; btnBg: string; btnBorder: string }> = {
  1: {
    gradient: "from-[#58cc02] to-[#46a302]",
    border: "border-[#3e8e02]",
    btnBg: "bg-[#46a302] hover:bg-[#3d8c02]",
    btnBorder: "border-[#337502]",
  },
  2: {
    gradient: "from-[#1cb0f6] to-[#1899d6]",
    border: "border-[#1479ab]",
    btnBg: "bg-[#1899d6] hover:bg-[#1585ba]",
    btnBorder: "border-[#106790]",
  },
  3: {
    gradient: "from-[#ce82ff] to-[#a855f7]",
    border: "border-[#9333ea]",
    btnBg: "bg-[#a855f7] hover:bg-[#9333ea]",
    btnBorder: "border-[#7e22ce]",
  },
  4: {
    gradient: "from-[#ff9600] to-[#e08500]",
    border: "border-[#c27300]",
    btnBg: "bg-[#e08500] hover:bg-[#c47400]",
    btnBorder: "border-[#a36100]",
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

        <button 
          className={`hidden sm:flex items-center gap-2 font-extrabold text-sm uppercase tracking-wider py-2.5 px-4 rounded-xl text-white ${theme.btnBg} border-b-4 ${theme.btnBorder} active:border-b-0 active:translate-y-1 transition-all cursor-pointer shadow-sm`}
        >
          <BookOpen className="h-5 w-5" />
          <span>Guidebook</span>
        </button>
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
