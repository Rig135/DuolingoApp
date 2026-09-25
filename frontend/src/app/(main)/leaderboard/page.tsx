"use client"
import * as React from "react"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { Shield } from "lucide-react"

export default function LeaderboardPage() {
  const { data, loading, error } = useLeaderboard()

  if (loading) {
    return (
      <div className="flex w-full items-center justify-center p-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex w-full items-center justify-center p-20 text-text-muted font-bold">
        Failed to load leaderboard.
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full gap-8 px-2 md:px-0">
      
      {/* Header */}
      <div className="flex flex-col items-center gap-4 border-b-2 border-locked-border pb-8 pt-4">
        <Shield className="w-24 h-24 text-yellow-500 fill-yellow-400" />
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">Bronze League</h1>
        <p className="text-gray-500 dark:text-gray-400 font-bold text-lg text-center max-w-sm">
          Top 10 advance to the next league. Compete by doing lessons and earning XP!
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="flex flex-col">
        {data.entries.map((entry) => {
          const isCurrentUser = entry.is_current_user
          return (
            <div 
              key={entry.rank} 
              className={`flex items-center justify-between p-4 rounded-2xl mb-2 ${
                isCurrentUser ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-900" : "hover:bg-gray-50 dark:hover:bg-[#202f36]"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 font-black text-lg text-center ${
                  entry.rank <= 3 ? "text-yellow-500" : "text-gray-400"
                }`}>
                  {entry.rank}
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-500 text-xl border-2 border-blue-200 overflow-hidden">
                  {entry.username.charAt(0).toUpperCase()}
                </div>
                <span className={`font-bold text-lg ${isCurrentUser ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}>
                  {entry.username}
                </span>
              </div>
              <div className="font-black text-gray-600 dark:text-gray-300">
                {entry.xp} XP
              </div>
            </div>
          )
        })}
      </div>
      
    </div>
  )
}
