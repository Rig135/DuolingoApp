import { Heart, Flame, Star, Gem } from "lucide-react"

export function TopBar() {
  return (
    <div className="sticky top-0 z-30 flex w-full items-center justify-between bg-white px-4 py-3 border-b-2 border-locked-border md:hidden">
      <div className="flex items-center gap-2 text-streak font-bold">
        <Flame className="h-6 w-6 fill-streak" />
        <span>3</span>
      </div>
      <div className="flex items-center gap-2 text-xp font-bold">
        <Star className="h-6 w-6 fill-xp text-xp" />
        <span>135</span>
      </div>
      <div className="flex items-center gap-2 text-heart font-bold">
        <Heart className="h-6 w-6 fill-heart" />
        <span>5</span>
      </div>
    </div>
  )
}

export function RightRail() {
  return (
    <aside className="hidden lg:flex w-80 flex-col gap-6 p-6 border-l-2 border-locked-border min-h-screen">
      <div className="flex w-full items-center justify-between font-bold">
        <div className="flex items-center gap-2 text-streak cursor-pointer hover:bg-bg-muted p-2 rounded-xl">
          <Flame className="h-6 w-6 fill-streak" />
          <span>3</span>
        </div>
        <div className="flex items-center gap-2 text-xp cursor-pointer hover:bg-bg-muted p-2 rounded-xl">
          <Star className="h-6 w-6 fill-xp text-xp" />
          <span>135</span>
        </div>
        <div className="flex items-center gap-2 text-heart cursor-pointer hover:bg-bg-muted p-2 rounded-xl">
          <Heart className="h-6 w-6 fill-heart" />
          <span>5</span>
        </div>
      </div>

      <div className="rounded-2xl border-2 border-locked-border p-4 mt-4">
        <h3 className="font-bold text-lg mb-2 text-text-main">Unlock Leaderboards!</h3>
        <p className="text-text-muted text-sm mb-4">Complete 10 more lessons to start competing.</p>
        <div className="w-full bg-locked h-2 rounded-full overflow-hidden">
          <div className="bg-streak h-full w-[10%]"></div>
        </div>
      </div>
    </aside>
  )
}
