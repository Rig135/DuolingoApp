"use client"
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface ModalProps {
  isOpen: boolean
  onClose?: () => void
  title: string
  description?: string
  children?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
}

export function Modal({ isOpen, onClose, title, description, children, actionLabel, onAction }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95">
        <h2 className="text-2xl font-bold text-text-main text-center">{title}</h2>
        {description && <p className="text-text-muted text-center">{description}</p>}
        {children && <div className="py-4">{children}</div>}
        <div className="flex flex-col gap-2 mt-4">
          {actionLabel && (
            <Button variant="primary" size="lg" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {onClose && (
            <Button variant="ghost" size="lg" onClick={onClose}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
