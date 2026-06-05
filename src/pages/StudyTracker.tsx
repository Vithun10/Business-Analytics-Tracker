import React, { useState } from 'react'
import { Plus, Clock, Calendar, Trash2, MessageSquareCode } from 'lucide-react'
import { useStudySessions } from '../hooks/useStudySessions'
import { StatCard } from '../components/StatCard'
import { Toast } from '../components/Toast'

interface StudyTrackerProps {
  studyHook: ReturnType<typeof useStudySessions>
  onLogSessionClick: () => void
}

export const StudyTracker: React.FC<StudyTrackerProps> = ({ studyHook, onLogSessionClick }) => {
  const { 
    sessions, 
    loading, 
    deleteSession, 
    dailyHours, 
    weeklyHours, 
    monthlyHours, 
    totalHours, 
    learningStreak 
  } = studyHook

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this study session?')) return
    
    try {
      setDeletingId(id)
      const { error } = await deleteSession(id)
      if (error) {
        setToast({ message: (error as any).message || 'Failed to delete session.', type: 'error' })
      } else {
        setToast({ message: 'Study session deleted.', type: 'success' })
      }
    } catch (err: any) {
      setToast({ message: err?.message || 'Failed to delete session.', type: 'error' })
    } finally {
      setDeletingId(null)
    }
  }

  const formatLocalDate = (dateStr: string) => {
    // Prevent timezone offsets shifting dates by splitting
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight my-0">
            Study Session Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Log study duration and review your core learning metrics.
          </p>
        </div>

        <button
          onClick={onLogSessionClick}
          className="glow-btn px-5 py-2.5 text-sm font-semibold text-white rounded-lg flex items-center gap-2 cursor-pointer shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4.5 h-4.5 text-white stroke-[2.5px]" />
          <span>Log Hours</span>
        </button>
      </div>

      {/* Grid of Study Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Daily Study"
          value={`${dailyHours}h`}
          iconName="Clock"
          description="Hours logged today"
          color="indigo"
        />
        <StatCard
          title="Weekly Study"
          value={`${weeklyHours}h`}
          iconName="Calendar"
          description="Current week total"
          color="amber"
        />
        <StatCard
          title="Monthly Study"
          value={`${monthlyHours}h`}
          iconName="BookOpen"
          description="Current month total"
          color="violet"
        />
        <StatCard
          title="Total Study"
          value={`${totalHours}h`}
          iconName="CheckSquare"
          description="Cumulative hours logged"
          color="emerald"
        />
        <StatCard
          title="Active Streak"
          value={`${learningStreak} Days`}
          iconName="Flame"
          description={learningStreak > 0 ? "Fantastic habit streak!" : "Study daily to grow"}
          color="rose"
        />
      </div>

      {/* Timeline Section */}
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-b border-slate-900 pb-3.5 mb-5">
          <Calendar className="w-5 h-5 text-indigo-400" /> Study History & Logs
        </h2>

        {loading && sessions.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm font-medium">
            Loading study logs...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-850 rounded-xl bg-slate-900/10">
            <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-bold">No sessions logged yet</p>
            <p className="text-slate-500 text-xs mt-1.5 mb-4">
              Keep track of your training hours. Log your first study session now!
            </p>
            <button
              onClick={onLogSessionClick}
              className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors cursor-pointer"
            >
              Log First Session
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div 
                key={session.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-slate-950/40 border border-slate-900 rounded-xl gap-4 hover:border-slate-800 transition-colors"
              >
                {/* Details Section */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Date Badge */}
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-indigo-400 bg-indigo-500/10 rounded-md border border-indigo-500/15">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatLocalDate(session.date)}
                    </span>
                    {/* Category/Topic Badge */}
                    <span className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
                      {session.skill} &rsaquo; {session.topic}
                    </span>
                    {/* Hours Badge */}
                    <span className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-extrabold text-emerald-400 bg-emerald-500/10 rounded-md border border-emerald-500/15">
                      <Clock className="w-3.5 h-3.5" />
                      {session.hours} {session.hours === 1 ? 'hour' : 'hours'}
                    </span>
                  </div>

                  {/* Notes Description */}
                  {session.notes ? (
                    <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/20 border border-slate-900 p-2.5 rounded-lg flex items-start gap-1.5">
                      <MessageSquareCode className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="whitespace-pre-wrap">{session.notes}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-600 italic">No notes provided for this session.</p>
                  )}
                </div>

                {/* Actions Section */}
                <div className="flex items-center justify-end shrink-0" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => handleDelete(session.id!)}
                    disabled={deletingId === session.id}
                    title="Delete session"
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(0.5rem); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
