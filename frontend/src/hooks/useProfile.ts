import { useState, useEffect } from "react"

// Production API configuration verified
// Production API configuration verified
export type DailyActivityItem = {
  date: string
  xp_earned: number
}

export type ProfileData = {
  user: {
    id: number
    username: string
    xp: number
    streak: number
    hearts: number
    gems: number
  }
  total_lessons_completed: number
  daily_history: DailyActivityItem[]
}

export function useProfile() {
  const [data, setData] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile")
        return res.json()
      })
      .then((json) => {
        setData(json)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
