import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "locked" | "ghost"
  size?: "default" | "sm" | "lg"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "default", disabled, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-wide transition-all select-none disabled:pointer-events-none disabled:opacity-50 button-base"
    
    const variants = {
      primary: "bg-primary text-white border-b-4 border-primary-border hover:bg-primary-hover hover:border-b-4",
      secondary: "bg-secondary text-white border-b-4 border-secondary-border hover:bg-secondary-hover hover:border-b-4",
      danger: "bg-danger text-white border-b-4 border-danger-border hover:bg-danger-hover hover:border-b-4",
      locked: "bg-locked text-locked-text border-b-4 border-locked-border",
      ghost: "bg-transparent text-text-muted hover:bg-bg-muted"
    }

    const sizes = {
      default: "h-12 px-6 py-3 text-sm",
      sm: "h-10 px-4 py-2 text-xs",
      lg: "h-14 px-8 py-4 text-base w-full",
    }

    return (
      <button
        ref={ref}
        disabled={disabled || variant === "locked"}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"
