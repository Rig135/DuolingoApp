"use client"
import * as React from "react"
import { useProfile } from "@/hooks/useProfile"
import { Flame, Star, Zap, User } from "lucide-react"

export default function ProfilePage() {
  const { data, loading, error } = useProfile()

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
        Failed to load profile.
      </div>
    )
  }

  const { user, total_lessons_completed } = data

  return (
    <div className="flex flex-col w-full gap-8 px-2 md:px-0">
      
      {/* Header Profile Section */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b-2 border-locked-border pb-8">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
           {/* Placeholder Avatar */}
           <User className="w-20 h-20 text-blue-300 fill-blue-200" />
        </div>
        <div className="flex flex-col items-center md:items-start gap-2 pt-2">
          <h1 className="text-3xl font-black text-gray-800 dark:text-white">{user.username}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">Learner since 2026</p>
        </div>
      </div>

      {/* Statistics Section */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-4 border-2 border-locked-border rounded-2xl bg-white dark:bg-[#131f24]">
            <Flame className="w-8 h-8 text-streak fill-streak" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-800 dark:text-white">{user.streak}</span>
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">Day Streak</span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-2 border-locked-border rounded-2xl bg-white dark:bg-[#131f24]">
            <Star className="w-8 h-8 text-xp fill-xp" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-800 dark:text-white">{user.xp}</span>
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">Total XP</span>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 border-2 border-locked-border rounded-2xl bg-white dark:bg-[#131f24]">
            <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <div className="flex flex-col">
              <span className="text-xl font-black text-gray-800 dark:text-white">{total_lessons_completed}</span>
              <span className="text-gray-500 dark:text-gray-400 font-bold text-sm">Lessons Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity visualization (Simple placeholder) */}
      <div>
        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-4">Recent Activity</h2>
        <div className="p-6 border-2 border-locked-border rounded-2xl bg-white dark:bg-[#131f24] flex flex-col gap-2">
           {data.daily_history && data.daily_history.length > 0 ? (
             data.daily_history.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b-2 border-gray-100 dark:border-locked-border last:border-0">
                  <span className="font-bold text-gray-600 dark:text-gray-300">{new Date(item.date).toLocaleDateString()}</span>
                  <span className="font-black text-xp">+{item.xp_earned} XP</span>
                </div>
             ))
           ) : (
             <p className="text-gray-500 dark:text-gray-400 font-bold text-center py-4">No recent activity yet. Do a lesson!</p>
           )}
        </div>
      </div>

    </div>
  )
}
