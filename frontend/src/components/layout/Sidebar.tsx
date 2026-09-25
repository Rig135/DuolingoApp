import Link from "next/link"
import { Home, User, Shield, Trophy } from "lucide-react"

export function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 right-0 z-40 flex h-20 items-center justify-around border-t-2 border-locked-border bg-white md:top-0 md:bottom-auto md:h-screen md:w-64 md:flex-col md:justify-start md:border-r-2 md:border-t-0 md:p-4">
      {/* Logo only visible on desktop */}
      <div className="hidden w-full p-4 pb-8 md:block">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight">duolingo</h1>
      </div>

      <nav className="flex w-full justify-around md:flex-col md:gap-2">
        <Link href="/" className="flex flex-col items-center gap-2 rounded-xl p-2 text-text-muted hover:bg-bg-muted md:flex-row md:p-3">
          <Home className="h-7 w-7 text-primary" />
          <span className="hidden font-bold uppercase tracking-wider text-primary md:block text-sm">Learn</span>
        </Link>
        <Link href="/leaderboard" className="flex flex-col items-center gap-2 rounded-xl p-2 text-text-muted hover:bg-bg-muted md:flex-row md:p-3">
          <Trophy className="h-7 w-7" />
          <span className="hidden font-bold uppercase tracking-wider md:block text-sm">Leaderboard</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-2 rounded-xl p-2 text-text-muted hover:bg-bg-muted md:flex-row md:p-3">
          <User className="h-7 w-7" />
          <span className="hidden font-bold uppercase tracking-wider md:block text-sm">Profile</span>
        </Link>
      </nav>
    </aside>
  )
}
