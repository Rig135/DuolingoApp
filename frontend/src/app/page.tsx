"use client"
import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { Modal } from "@/components/ui/Modal"
import { Star, Lock, CheckCircle } from "lucide-react"

export default function Home() {
  const [isModalOpen, setIsModalOpen] = React.useState(false)

  return (
    <div className="flex flex-col gap-12 w-full pb-20">
      {/* Unit Banner */}
      <div className="w-full bg-primary rounded-2xl p-6 text-white flex justify-between items-center shadow-sm">
        <div>
          <h2 className="text-2xl font-bold mb-1">Unit 1</h2>
          <p className="opacity-90">Form basic sentences, greet people</p>
        </div>
        <Button variant="secondary" className="hidden sm:flex">Guidebook</Button>
      </div>

      {/* Mock Learning Path */}
      <div className="flex flex-col items-center gap-10">
        
        {/* Completed State Node */}
        <div className="relative group cursor-pointer flex flex-col items-center">
          <div className="h-[72px] w-[72px] rounded-full bg-xp border-b-8 border-yellow-500 flex justify-center items-center transform hover:-translate-y-1 transition-transform relative z-10">
            <Star className="text-white fill-white h-10 w-10" />
          </div>
          <div className="absolute top-[-20px] bg-white border-2 border-locked-border px-3 py-1 rounded-xl shadow-sm text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
            Intro (3/3)
          </div>
        </div>

        {/* Active State Node */}
        <div className="relative cursor-pointer flex flex-col items-center ml-10">
          <div className="h-[80px] w-[80px] rounded-full bg-primary border-b-8 border-primary-border flex justify-center items-center active-press relative z-10 shadow-[0_0_0_8px_#e5e5e5]">
            <Star className="text-white fill-white h-10 w-10" />
          </div>
          {/* Mock floating tooltip */}
          <div className="absolute top-[-50px] bg-white border-2 border-locked-border p-3 rounded-xl shadow-sm flex flex-col items-center gap-2 z-20 animate-bounce">
            <span className="font-bold text-sm text-primary uppercase whitespace-nowrap">Start +15 XP</span>
            <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-locked-border transform rotate-45 absolute -bottom-[7px]"></div>
          </div>
        </div>

        {/* Locked State Node */}
        <div className="relative cursor-pointer flex flex-col items-center -ml-10 opacity-70">
          <div className="h-[72px] w-[72px] rounded-full bg-locked border-b-8 border-locked-border flex justify-center items-center">
            <Lock className="text-locked-text h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Component Library Showcase (For assignment validation) */}
      <Card className="mt-12 bg-bg-muted border-none">
        <h3 className="text-xl font-bold mb-6">Component Tokens Showcase</h3>
        
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-sm font-bold text-text-muted mb-2 uppercase tracking-wide">Buttons</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="locked">Locked</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-text-muted mb-2 uppercase tracking-wide">Progress Bar (60%)</p>
            <ProgressBar progress={60} />
          </div>

          <div>
             <p className="text-sm font-bold text-text-muted mb-2 uppercase tracking-wide">Interactive Modal</p>
             <Button variant="primary" onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          </div>
        </div>
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Keep it up!"
        description="You're doing great! Practice makes perfect."
        actionLabel="Continue"
        onAction={() => setIsModalOpen(false)}
      >
        <div className="flex justify-center py-4">
          <CheckCircle className="h-20 w-20 text-primary" />
        </div>
      </Modal>

    </div>
  )
}
