import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export interface StudySession {
  id?: string
  user_id?: string
  date: string // YYYY-MM-DD
  skill: string
  topic: string
  hours: number
  notes: string
  created_at?: string
}

export const useStudySessions = () => {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch sessions from Supabase
  const fetchSessions = async () => {
    if (!user) {
      setSessions([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) {
        console.error('Error fetching study sessions:', error)
      } else if (data) {
        setSessions(data as StudySession[])
      }
    } catch (err) {
      console.error('Failed to fetch study sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessions()
  }, [user])

  // Log a new study session
  const logSession = async (session: Omit<StudySession, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) return { error: 'User not signed in' }

    const payload = {
      ...session,
      user_id: user.id
    }

    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .insert(payload)
        .select()

      if (error) {
        console.error('Error logging study session:', error)
        return { error }
      }

      if (data) {
        setSessions((prev) => [data[0] as StudySession, ...prev])
      }
      return { error: null }
    } catch (err) {
      console.error('Failed to log session:', err)
      return { error: err }
    }
  }

  // Delete a study session
  const deleteSession = async (id: string) => {
    if (!user) return { error: 'User not signed in' }

    try {
      const { error } = await supabase
        .from('study_sessions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting study session:', error)
        return { error }
      }

      setSessions((prev) => prev.filter((s) => s.id !== id))
      return { error: null }
    } catch (err) {
      console.error('Failed to delete session:', err)
      return { error: err }
    }
  }

  // Calculate local date string in YYYY-MM-DD
  const getLocalDateString = (d: Date) => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Analytics calculations
  const analytics = useMemo(() => {
    const todayStr = getLocalDateString(new Date())
    
    // Parse helper
    const getWeekNumber = (d: Date) => {
      const date = new Date(d.getTime())
      date.setHours(0, 0, 0, 0)
      // Thursday in current week decides the year.
      date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7)
      // January 4 is always in week 1.
      const week1 = new Date(date.getFullYear(), 0, 4)
      // Adjust to Thursday in week 1
      week1.setDate(week1.getDate() + 3 - (week1.getDay() + 6) % 7)
      return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3) / 7)
    }

    const todayDate = new Date()
    const currentWeekNum = getWeekNumber(todayDate)
    const currentYearNum = todayDate.getFullYear()
    const currentMonthNum = todayDate.getMonth() // 0-11

    let dailyHours = 0
    let weeklyHours = 0
    let monthlyHours = 0
    let totalHours = 0

    sessions.forEach((s) => {
      const sessionHours = Number(s.hours)
      totalHours += sessionHours

      if (s.date === todayStr) {
        dailyHours += sessionHours
      }

      const sDate = new Date(s.date)
      if (sDate.getFullYear() === currentYearNum && sDate.getMonth() === currentMonthNum) {
        monthlyHours += sessionHours
      }

      if (sDate.getFullYear() === currentYearNum && getWeekNumber(sDate) === currentWeekNum) {
        weeklyHours += sessionHours
      }
    })

    // Learning Streak Calculation
    // Find all unique dates in YYYY-MM-DD from session logs
    const uniqueDates = Array.from(new Set(sessions.map((s) => s.date)))
    let streak = 0

    if (uniqueDates.length > 0) {
      const dateSet = new Set(uniqueDates)
      let checkDate = new Date()
      let checkStr = getLocalDateString(checkDate)

      // If no session today, check if yesterday had one to maintain streak
      if (!dateSet.has(checkStr)) {
        checkDate.setDate(checkDate.getDate() - 1)
        checkStr = getLocalDateString(checkDate)
      }

      // Check backwards for consecutive days in the set
      while (dateSet.has(checkStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
        checkStr = getLocalDateString(checkDate)
      }
    }

    return {
      dailyHours: Number(dailyHours.toFixed(1)),
      weeklyHours: Number(weeklyHours.toFixed(1)),
      monthlyHours: Number(monthlyHours.toFixed(1)),
      totalHours: Number(totalHours.toFixed(1)),
      learningStreak: streak
    }
  }, [sessions])

  return {
    sessions,
    loading,
    logSession,
    deleteSession,
    ...analytics,
    refreshSessions: fetchSessions
  }
}
