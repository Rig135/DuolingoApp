import * as React from "react"
import { Star, Lock, Crown, Sparkles, MessageSquare, Compass } from "lucide-react"
import { SkillSummary } from "@/hooks/useDashboard"
import { useRouter } from "next/navigation"

interface SkillNodeProps {
  skill: SkillSummary
  isCurrent: boolean
  index: number
}

// Map the index to a horizontal offset to create the curved path effect
const getOffset = (index: number) => {
  const cycle = index % 8
  switch (cycle) {
    case 0: return 0
    case 1: return 38
    case 2: return 72
    case 3: return 38
    case 4: return 0
    case 5: return -38
    case 6: return -72
    case 7: return -38
    default: return 0
  }
}

// Get lesson icon based on skill content
const getSkillIcon = (title: string, isCompleted: boolean, isLocked: boolean) => {
  if (isCompleted) {
    return <Crown className="text-white fill-white h-9 w-9 drop-shadow-sm" />
  }
  
  if (isLocked) {
    // Duolingo locked state: Solid two-tone muted lock icon with high contrast
    return <Lock className="text-[#8e8e93] fill-[#9ca3af] h-8 w-8 stroke-[2.2] drop-shadow-xs" />
  }

  // Active / unlocked skill icons based on topic
  const lowerTitle = title.toLowerCase()
  if (lowerTitle.includes("phrase")) {
    return <MessageSquare className="text-white fill-white h-9 w-9 drop-shadow-sm" />
  }
  if (lowerTitle.includes("travel")) {
    return <Compass className="text-white fill-white h-9 w-9 drop-shadow-sm" />
  }
  return <Star className="text-white fill-white h-10 w-10 drop-shadow-sm" />
}

export function SkillNode({ skill, isCurrent, index }: SkillNodeProps) {
  const router = useRouter()
  const offset = getOffset(index)
  const isCompleted = skill.total_lessons > 0 && skill.completed_lessons >= skill.total_lessons
  const isLocked = !skill.is_unlocked

  const handleStart = () => {
    if (!skill.next_lesson_id) return
    router.push(`/lesson/${skill.next_lesson_id}`)
  }

  // Calculate SVG progress arc
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const progressPercent = isCompleted 
    ? 100 
    : skill.total_lessons > 0 
      ? (skill.completed_lessons / skill.total_lessons) * 100 
      : 0
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  return (
    <div 
      className="relative flex flex-col items-center select-none"
      style={{ transform: `translateX(${offset}px)` }}
    >
      {/* Current Recommended Skill Float Tooltip with centered speech pointer */}
      {isCurrent && (
        <div 
          onClick={handleStart}
          className="absolute -top-13 z-30 flex flex-col items-center cursor-pointer animate-bounce"
        >
          <div className="bg-white border-2 border-primary/40 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-4 h-4 text-primary fill-primary" />
            <span className="font-black text-xs text-primary uppercase tracking-wider">Start +15 XP</span>
          </div>
          {/* Centered triangle pointing down */}
          <div className="w-3.5 h-3.5 bg-white border-b-2 border-r-2 border-primary/40 transform rotate-45 -mt-2 shadow-sm"></div>
        </div>
      )}

      {/* Hover Tooltip for non-current skills */}
      {!isCurrent && (
        <div className="absolute -top-10 bg-white border-2 border-locked-border px-3 py-1 rounded-xl shadow-md text-xs font-black opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity whitespace-nowrap z-30 pointer-events-none text-text-main flex items-center gap-1">
          {isCompleted ? (
            <span className="text-yellow-600 flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
              {skill.title} (Mastered)
            </span>
          ) : isLocked ? (
            <span className="text-text-muted flex items-center gap-1">
              <Lock className="w-3 h-3 text-[#8e8e93] fill-[#9ca3af]" />
              {skill.title} (Locked)
            </span>
          ) : (
            <span>
              {skill.title} ({skill.completed_lessons}/{skill.total_lessons})
            </span>
          )}
        </div>
      )}

      {/* Node Interactive Wrapper */}
      <div 
        className="relative group flex items-center justify-center cursor-pointer"
        onClick={handleStart}
      >
        {/* Ground Drop-Shadow: Gives the 3D 'sitting on the path' effect */}
        <div 
          className={`rounded-full absolute -bottom-2 z-0 blur-[1px] transition-all
            ${isCurrent 
              ? 'w-20 h-4 bg-black/20' 
              : isCompleted 
                ? 'w-18 h-3.5 bg-black/15' 
                : 'w-16 h-3 bg-black/10'
            }`} 
        />

        {/* Pulsing Aura Ring around Current Starting Node */}
        {isCurrent && (
          <div className="absolute -inset-2.5 rounded-full border-4 border-primary/35 animate-pulse pointer-events-none" />
        )}

        {/* SVG Progress Ring */}
        <div className="absolute inset-0 flex items-center justify-center -m-3 pointer-events-none z-10">
          <svg className="w-[102px] h-[102px] transform -rotate-90">
            {/* Background ring track */}
            {!isLocked && (
              <circle
                cx="51"
                cy="51"
                r={radius}
                stroke="#e5e5e5"
                strokeWidth="7"
                fill="none"
              />
            )}
            {/* Progress arc */}
            {!isLocked && progressPercent > 0 && (
              <circle
                cx="51"
                cy="51"
                r={radius}
                stroke={isCompleted ? "#ffc800" : "#58cc02"}
                strokeWidth="7"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            )}
          </svg>
        </div>

        {/* Tactile 3D Button */}
        <div 
          className={`rounded-full flex justify-center items-center relative z-20 transition-all select-none
            ${isLocked 
              ? 'w-[74px] h-[74px] bg-[#e5e5e5] border-b-[8px] border-[#cecece] cursor-not-allowed' 
              : isCompleted 
                ? 'w-[76px] h-[76px] bg-[#ffc800] border-b-[9px] border-[#e5a500] hover:-translate-y-1 active:translate-y-[5px] active:border-b-[4px]' 
                : isCurrent
                  ? 'w-[80px] h-[80px] bg-[#58cc02] border-b-[10px] border-[#46a302] hover:-translate-y-1 active:translate-y-[6px] active:border-b-[4px]'
                  : 'w-[76px] h-[76px] bg-[#58cc02] border-b-[9px] border-[#46a302] hover:-translate-y-1 active:translate-y-[5px] active:border-b-[4px]'
            }`}
        >
          {getSkillIcon(skill.title, isCompleted, isLocked)}
        </div>
      </div>
    </div>
  )
}
