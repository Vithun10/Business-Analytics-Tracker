import React, { useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { useSkills } from './hooks/useSkills'
import { useStudySessions } from './hooks/useStudySessions'

import { Sidebar } from './components/Sidebar'

import { Dashboard } from './pages/Dashboard'
import { SkillTracker } from './pages/SkillTracker'
import { StudyTracker } from './pages/StudyTracker'
import { Analytics } from './pages/Analytics'
import { Login } from './pages/Login'

import { StudyLogModal } from './components/StudyLogModal'
import { WeeklyGoalModal } from './components/WeeklyGoalModal'
import { Toast } from './components/Toast'

import { GraduationCap } from 'lucide-react'
import { CareerReadiness } from "./pages/CareerReadiness";

const AppContent: React.FC = () => {
  const { user, profile, loading, updateProfile } = useAuth()

  const [activeTab, setActiveTab] = useState('dashboard')

  const [isStudyLogOpen, setIsStudyLogOpen] = useState(false)
  const [isWeeklyGoalOpen, setIsWeeklyGoalOpen] = useState(false)

  const [toast, setToast] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const skillsHook = useSkills()
  const studyHook = useStudySessions()

  const handleSaveStudySession = async (session: {
    date: string
    skill: string
    topic: string
    hours: number
    notes: string
  }) => {
    const { error } = await studyHook.logSession(session)

    if (error) {
      setToast({
        message:
          (error as any).message ||
          'Failed to log study session.',
        type: 'error',
      })

      throw error
    }

    setToast({
      message:
        'Study session logged successfully!',
      type: 'success',
    })

    const currentProgress =
      skillsHook.getTopicProgress(
        session.skill,
        session.topic
      )

    if (
      currentProgress &&
      currentProgress.status === 'Not Started'
    ) {
      await skillsHook.updateTopic(
        session.skill,
        session.topic,
        {
          status: 'In Progress',
        }
      )
    }
  }

  const handleSaveWeeklyGoal = async (
    hoursGoal: number,
    priorities: string[]
  ) => {
    const { error } =
      await updateProfile({
        weekly_hours_goal: hoursGoal,
        weekly_priorities: priorities,
      })

    if (error) {
      setToast({
        message:
          error.message ||
          'Failed to update goals.',
        type: 'error',
      })

      throw error
    }

    setToast({
      message:
        'Weekly goals updated successfully!',
      type: 'success',
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center animate-bounce shadow-xl shadow-indigo-500/10 mb-4">
          <GraduationCap className="w-7 h-7 text-white" />
        </div>

        <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    )
  }

  if (!user) {
    return <Login />
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 min-w-0 p-4 md:p-8 lg:p-10 space-y-6 max-h-screen overflow-y-auto">

        {activeTab === 'dashboard' && (
          <Dashboard
            skillsHook={skillsHook}
            studyHook={studyHook}
            onLogSessionClick={() =>
              setIsStudyLogOpen(true)
            }
            onWeeklyGoalClick={() =>
              setIsWeeklyGoalOpen(true)
            }
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'skills' && (
          <SkillTracker skillsHook={skillsHook} />
        )}

        {activeTab === 'study' && (
          <StudyTracker
            studyHook={studyHook}
            onLogSessionClick={() =>
              setIsStudyLogOpen(true)
            }
          />
        )}

        {activeTab === 'analytics' && (
          <Analytics
            skillsHook={skillsHook}
            studyHook={studyHook}
          />
        )}

        {activeTab === "career" && (
          <CareerReadiness />
        )}

      </main>

      <StudyLogModal
        isOpen={isStudyLogOpen}
        onClose={() =>
          setIsStudyLogOpen(false)
        }
        onSave={handleSaveStudySession}
      />

      <WeeklyGoalModal
        isOpen={isWeeklyGoalOpen}
        onClose={() =>
          setIsWeeklyGoalOpen(false)
        }
        currentHoursGoal={
          profile?.weekly_hours_goal ?? 10
        }
        currentPriorities={
          profile?.weekly_priorities ?? []
        }
        onSave={handleSaveWeeklyGoal}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast(null)
          }
        />
      )}
    </div>
  )
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App