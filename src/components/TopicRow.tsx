import React, { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Save, Star, Calendar } from 'lucide-react'
import type { SkillProgress } from '../hooks/useSkills'

interface TopicRowProps {
  topicName: string
  categoryName: string
  progress: SkillProgress
  onUpdate: (category: string, topic: string, updates: Partial<SkillProgress>) => Promise<void>
  isExpanded: boolean
  onToggleExpand: () => void
}

export const TopicRow: React.FC<TopicRowProps> = ({
  topicName,
  categoryName,
  progress,
  onUpdate,
  isExpanded,
  onToggleExpand
}) => {
  const [localConfidence, setLocalConfidence] = useState(progress.confidence)
  const [localNotes, setLocalNotes] = useState(progress.notes || '')
  const [isSaving, setIsSaving] = useState(false)

  // Keep local state in sync when database changes or row collapses/expands
  useEffect(() => {
    setLocalConfidence(progress.confidence)
    setLocalNotes(progress.notes || '')
  }, [progress, isExpanded])

  const handleStatusChange = async (newStatus: 'Not Started' | 'In Progress' | 'Completed') => {
    setIsSaving(true)
    await onUpdate(categoryName, topicName, { status: newStatus })
    setIsSaving(false)
  }

  const handleSaveDetails = async () => {
    setIsSaving(true)
    await onUpdate(categoryName, topicName, {
      confidence: localConfidence,
      notes: localNotes.trim()
    })
    setIsSaving(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      case 'In Progress':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700'
    }
  }

  const getConfidenceLevelText = (val: number) => {
    if (val <= 3) return 'Novice 😕'
    if (val <= 6) return 'Intermediate 🙂'
    if (val <= 8) return 'Proficient 🚀'
    return 'Expert 🏆'
  }

  return (
    <div className={`border-b border-slate-900/60 last:border-0 transition-colors duration-200
      ${isExpanded ? 'bg-slate-900/20' : 'hover:bg-slate-900/10'}`}
    >
      {/* Summary Row */}
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-3 cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-200 truncate">{topicName}</h4>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Status Quick selector */}
          <select
            value={progress.status}
            onChange={(e) => handleStatusChange(e.target.value as any)}
            disabled={isSaving}
            className={`px-2.5 py-1 text-xs font-bold rounded-full border cursor-pointer focus:outline-none transition-colors
              ${getStatusColor(progress.status)} bg-slate-950`}
          >
            <option value="Not Started" className="bg-slate-950 text-slate-400">Not Started</option>
            <option value="In Progress" className="bg-slate-950 text-amber-400">In Progress</option>
            <option value="Completed" className="bg-slate-950 text-emerald-400">Completed</option>
          </select>

          {/* Confidence Indicator */}
          <div className="flex items-center gap-1 text-xs font-medium text-slate-300 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-800/80">
            <Star className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400/20" />
            <span>{progress.confidence}/10</span>
          </div>

          {/* Expand/Collapse arrow */}
          <button 
            onClick={onToggleExpand}
            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Panel */}
      {isExpanded && (
        <div className="px-6 pb-5 pt-1 space-y-4 bg-slate-950/30 border-t border-slate-900/40 animate-slide-down"
          style={{
            animation: 'slideDown 0.2s ease-out forwards'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confidence Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Confidence Level
                </label>
                <span className="text-xs font-bold text-indigo-400">
                  {getConfidenceLevelText(localConfidence)}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={localConfidence}
                  onChange={(e) => setLocalConfidence(parseInt(e.target.value))}
                  disabled={isSaving}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-sm font-bold text-slate-200 min-w-[20px] text-right">
                  {localConfidence}
                </span>
              </div>
            </div>

            {/* Completion Date (if completed) */}
            {progress.status === 'Completed' && progress.completed_at && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Completion Date
                </label>
                <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-900/40 border border-slate-850 px-3 py-1.5 rounded-lg">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span>{new Date(progress.completed_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Topic Study Notes
            </label>
            <textarea
              placeholder="Record definitions, cheatsheets, syntax, or key concepts you learned..."
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              disabled={isSaving}
              rows={2}
              className="w-full glass-input px-3 py-2 rounded-lg text-sm resize-none"
            />
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={handleSaveDetails}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 hover:text-white text-xs font-bold rounded-lg transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              {isSaving ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-0.5rem);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
