import { useState, useEffect } from "react"

// Production API configuration verified
// Production API configuration verified
export type LeaderboardEntry = {
  rank: number
  username: string
  xp: number
  streak: number
  is_current_user: boolean
}

export type LeaderboardData = {
  entries: LeaderboardEntry[]
}

export function useLeaderboard() {
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leaderboard")
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
