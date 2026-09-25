"use client"
import { Heart, Flame, Star, Gem, Trophy, Target } from "lucide-react"
import { useDashboard } from "@/hooks/useDashboard"

export function TopBar() {
  const { data } = useDashboard()
  const user = data?.user

  return (
    <div className="sticky top-0 z-30 flex w-full items-center justify-between bg-white px-4 py-3 border-b-2 border-locked-border md:hidden">
      <div className="flex items-center gap-1.5 text-streak font-black text-sm">
        <Flame className="h-6 w-6 fill-streak text-streak" />
        <span>{user?.streak ?? 0}</span>
      </div>
      <div className="flex items-center gap-1.5 text-gem font-black text-sm">
        <Gem className="h-6 w-6 fill-gem text-gem" />
        <span>480</span>
      </div>
      <div className="flex items-center gap-1.5 text-heart font-black text-sm">
        <Heart className="h-6 w-6 fill-heart text-heart" />
        <span>{user?.hearts ?? 5}</span>
      </div>
      <div className="flex items-center gap-1.5 text-xp font-black text-sm">
        <Star className="h-6 w-6 fill-xp text-xp" />
        <span>{user?.xp ?? 0}</span>
      </div>
    </div>
  )
}

export function RightRail() {
  const { data } = useDashboard()
  const user = data?.user

  // Example daily goal math based on user xp
  const dailyTargetXP = 50
  const currentDailyXP = Math.min(dailyTargetXP, user?.xp ? (user.xp % 50 || 20) : 20)
  const dailyPercent = Math.round((currentDailyXP / dailyTargetXP) * 100)

  return (
    <aside className="hidden lg:flex w-88 flex-col gap-6 p-6 border-l-2 border-locked-border min-h-screen">
      {/* Top Gamification Status Bar */}
      <div className="flex w-full items-center justify-between font-black text-sm">
        <div className="flex items-center gap-2 text-streak cursor-pointer hover:bg-orange-50 p-2 rounded-xl transition-colors">
          <Flame className="h-6 w-6 fill-streak text-streak" />
          <span>{user?.streak ?? 0}</span>
        </div>
        <div className="flex items-center gap-2 text-gem cursor-pointer hover:bg-cyan-50 p-2 rounded-xl transition-colors">
          <Gem className="h-6 w-6 fill-gem text-gem" />
          <span>480</span>
        </div>
        <div className="flex items-center gap-2 text-heart cursor-pointer hover:bg-red-50 p-2 rounded-xl transition-colors">
          <Heart className="h-6 w-6 fill-heart text-heart" />
          <span>{user?.hearts ?? 5}</span>
        </div>
        <div className="flex items-center gap-2 text-xp cursor-pointer hover:bg-yellow-50 p-2 rounded-xl transition-colors">
          <Star className="h-6 w-6 fill-xp text-xp" />
          <span>{user?.xp ?? 0}</span>
        </div>
      </div>

      {/* Daily Quest / Daily Goal Card */}
      <div className="rounded-2xl border-2 border-locked-border p-5 bg-white shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary stroke-[2.5]" />
            <h3 className="font-extrabold text-base text-text-main">Daily Quest</h3>
          </div>
          <span className="text-xs font-black text-text-muted">{currentDailyXP}/{dailyTargetXP} XP</span>
        </div>
        
        <p className="text-text-muted text-xs font-semibold">Earn {dailyTargetXP} XP today to keep your streak blazing!</p>
        
        <div className="w-full bg-[#e5e5e5] h-3.5 rounded-full overflow-hidden p-0.5">
          <div 
            className="bg-gradient-to-r from-xp to-streak h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${dailyPercent}%` }}
          />
        </div>
      </div>

      {/* Unlock Leaderboards Card */}
      <div className="rounded-2xl border-2 border-locked-border p-5 bg-white shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-xp stroke-[2.5]" />
          <h3 className="font-extrabold text-base text-text-main">Bronze League</h3>
        </div>
        <p className="text-text-muted text-xs font-semibold">Complete active lessons to rank up against other language learners this week!</p>
        <div className="w-full bg-[#e5e5e5] h-3 rounded-full overflow-hidden">
          <div className="bg-[#1cb0f6] h-full w-[45%] rounded-full"></div>
        </div>
      </div>
    </aside>
  )
}
