"use client"
import * as React from "react"
import { Settings, Volume2, Bell, User, PaintBucket } from "lucide-react"
import { useTheme } from "next-themes"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col w-full gap-8 px-2 md:px-0">
      
      <div className="flex flex-col items-center gap-4 border-b-2 border-locked-border pb-8 pt-4">
        <Settings className="w-20 h-20 text-gray-400" />
        <h1 className="text-3xl font-black text-gray-800 dark:text-white">Settings</h1>
      </div>

      <div className="flex flex-col gap-6">
        
        {/* Account Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-gray-700 dark:text-gray-200">Account</h2>
          <div className="flex flex-col border-2 border-locked-border rounded-2xl bg-white dark:bg-[#131f24] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-locked-border cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202f36] transition-colors">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold">
                <User className="w-6 h-6 text-gray-400" />
                <span>Profile Details</span>
              </div>
              <span className="text-gray-400 font-black">&gt;</span>
            </div>
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-[#202f36] transition-colors">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold">
                <span className="w-6 h-6 flex items-center justify-center font-bold text-gray-400 text-lg">@</span>
                <span>Change Username</span>
              </div>
              <span className="text-gray-400 font-black">&gt;</span>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black text-gray-700 dark:text-gray-200">Preferences</h2>
          <div className="flex flex-col border-2 border-locked-border rounded-2xl bg-white dark:bg-[#131f24] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b-2 border-locked-border">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold">
                <Volume2 className="w-6 h-6 text-gray-400" />
                <span>Sound Effects</span>
              </div>
              <div className="w-12 h-6 rounded-full bg-green-500 relative cursor-pointer">
                 <div className="absolute right-1 top-1 bottom-1 w-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border-b-2 border-locked-border">
              <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold">
                <Bell className="w-6 h-6 text-gray-400" />
                <span>Practice Reminders</span>
              </div>
              <div className="w-12 h-6 rounded-full bg-green-500 relative cursor-pointer">
                 <div className="absolute right-1 top-1 bottom-1 w-4 rounded-full bg-white shadow-sm"></div>
              </div>
            </div>
            <div 
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <div className="flex items-center gap-3 text-gray-700 font-bold dark:text-gray-200">
                <PaintBucket className="w-6 h-6 text-gray-400" />
                <span>Dark Mode</span>
              </div>
              <div className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-[#58cc02]' : 'bg-gray-200'}`}>
                 <div className={`absolute top-1 bottom-1 w-4 rounded-full bg-white shadow-sm transition-all ${theme === 'dark' ? 'right-1' : 'left-1'}`}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
