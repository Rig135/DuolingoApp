import { useState, useEffect } from "react"

// Production API configuration verified
export type UserSummary = {
  id: number
  username: string
  xp: number
  streak: number
  hearts: number
}

export type SkillSummary = {
  id: number
  unit_id: number
  title: string
  order: number
  is_unlocked: boolean
  completed_lessons: number
  total_lessons: number
  next_lesson_id?: number
}

export type UnitSummary = {
  id: number
  title: string
  description: string
  order: number
  skills: SkillSummary[]
}

export type DashboardResponse = {
  user: UserSummary
  units: UnitSummary[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboard = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard`)

      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) setData(d)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  const refillHearts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me/refill-hearts`, { method: "POST" })
      if (res.ok) {
        fetchDashboard()
      }
    } catch (err) {
      console.error(err)
    }
  }

  return { data, loading, refetch: fetchDashboard, refillHearts }
}
