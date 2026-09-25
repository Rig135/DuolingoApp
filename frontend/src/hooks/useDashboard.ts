import { useState, useEffect } from "react"

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

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then((res) => res.json())
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  return { data, loading }
}
