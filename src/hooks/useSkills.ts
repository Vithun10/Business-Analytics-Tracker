import { useEffect, useState, useMemo } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { SKILL_CATEGORIES } from '../utils/skillData'

export interface SkillProgress {
  id?: string
  user_id?: string
  category: string
  topic: string
  status: 'Not Started' | 'In Progress' | 'Completed'
  confidence: number
  notes: string
  completed_at: string | null
}

export const useSkills = () => {
  const { user } = useAuth()
  const [progressList, setProgressList] = useState<SkillProgress[]>([])
  const [loading, setLoading] = useState(true)

  // Map progress list for quick O(1) lookup
  const progressMap = useMemo(() => {
    const map: Record<string, SkillProgress> = {}
    progressList.forEach((item) => {
      map[`${item.category}:${item.topic}`] = item
    })
    return map
  }, [progressList])

  // Fetch skill progress from Supabase
  const fetchProgress = async () => {
    if (!user) {
      setProgressList([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('skills_progress')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching skill progress:', error)
      } else if (data) {
        setProgressList(data as SkillProgress[])
      }
    } catch (err) {
      console.error('Failed to fetch progress:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProgress()
  }, [user])

  // Helper to get status of a topic (defaults to 'Not Started')
  const getTopicProgress = (category: string, topic: string): SkillProgress => {
    return progressMap[`${category}:${topic}`] || {
      category,
      topic,
      status: 'Not Started',
      confidence: 1,
      notes: '',
      completed_at: null
    }
  }

  // Update or Insert topic progress
  const updateTopic = async (category: string, topic: string, updates: Partial<SkillProgress>) => {
    if (!user) return { error: 'User not signed in' }

    const current = getTopicProgress(category, topic)
    const newStatus = updates.status !== undefined ? updates.status : current.status
    
    // Automatically set completed_at based on status change
    let completedAt = current.completed_at
    if (updates.status !== undefined) {
      if (updates.status === 'Completed') {
        completedAt = new Date().toISOString()
      } else {
        completedAt = null
      }
    }

    const payload: Omit<SkillProgress, 'id'> & { user_id: string } = {
      user_id: user.id,
      category,
      topic,
      status: newStatus,
      confidence: updates.confidence !== undefined ? updates.confidence : current.confidence,
      notes: updates.notes !== undefined ? updates.notes : current.notes,
      completed_at: completedAt
    }

    // Optimistic UI update
    const previousList = [...progressList]
    const listWithoutCurrent = progressList.filter(
      (item) => !(item.category === category && item.topic === topic)
    )
    const updatedItem = { ...current, ...updates, completed_at: completedAt } as SkillProgress
    setProgressList([...listWithoutCurrent, updatedItem])

    try {
      const { error } = await supabase
        .from('skills_progress')
        .upsert(payload, { onConflict: 'user_id,category,topic' })

      if (error) {
        console.error('Error saving skill progress:', error)
        setProgressList(previousList) // rollback
        return { error }
      }
      return { error: null }
    } catch (err) {
      console.error('Failed to save progress:', err)
      setProgressList(previousList) // rollback
      return { error: err }
    }
  }

  // CALCULATIONS FOR PROGRESS
  const stats = useMemo(() => {
    let completedCount = 0
    let totalCount = 0
    const categoryPercentages: Record<string, number> = {}

    SKILL_CATEGORIES.forEach((cat) => {
      let catWeightSum = 0
      cat.topics.forEach((topic) => {
        totalCount++
        const prog = getTopicProgress(cat.name, topic)
        let weight = 0
        if (prog.status === 'Completed') {
          weight = 100
          completedCount++
        } else if (prog.status === 'In Progress') {
          weight = 50
        }
        catWeightSum += weight
      })
      categoryPercentages[cat.name] = cat.topics.length > 0
        ? Math.round(catWeightSum / cat.topics.length)
        : 0
    })

    const categoriesList = Object.values(categoryPercentages)
    const overallPercentage = categoriesList.length > 0
      ? Math.round(categoriesList.reduce((a, b) => a + b, 0) / categoriesList.length)
      : 0

    return {
      overallCompletion: overallPercentage,
      categoryCompletion: categoryPercentages,
      completedTopicsCount: completedCount,
      totalTopicsCount: totalCount
    }
  }, [progressList])

  return {
    progressList,
    loading,
    getTopicProgress,
    updateTopic,
    ...stats,
    refreshProgress: fetchProgress
  }
}
