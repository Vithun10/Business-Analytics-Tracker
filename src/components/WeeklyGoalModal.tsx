import React, { useState, useEffect } from 'react'
import { X, Target, Plus, Trash2 } from 'lucide-react'

interface WeeklyGoalModalProps {
  isOpen: boolean
  onClose: () => void
  currentHoursGoal: number
  currentPriorities: string[]
  onSave: (hoursGoal: number, priorities: string[]) => Promise<void>
}

export const WeeklyGoalModal: React.FC<WeeklyGoalModalProps> = ({
  isOpen,
  onClose,
  currentHoursGoal,
  currentPriorities,
  onSave
}) => {
  const [hoursGoal, setHoursGoal] = useState(currentHoursGoal)
  const [priorities, setPriorities] = useState<string[]>([])
  const [newPriority, setNewPriority] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // Sync state with props when modal opens
  useEffect(() => {
    if (isOpen) {
      setHoursGoal(currentHoursGoal)
      setPriorities([...currentPriorities])
      setNewPriority('')
      setError('')
    }
  }, [isOpen, currentHoursGoal, currentPriorities])

  if (!isOpen) return null

  const handleAddPriority = () => {
    const trimmed = newPriority.trim()
    if (!trimmed) return
    if (priorities.includes(trimmed)) {
      setError('Priority already exists.')
      return
    }
    if (priorities.length >= 5) {
      setError('You can set up to 5 priorities for a week.')
      return
    }
    setPriorities([...priorities, trimmed])
    setNewPriority('')
    setError('')
  }

  const handleRemovePriority = (indexToRemove: number) => {
    setPriorities(priorities.filter((_, idx) => idx !== indexToRemove))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (hoursGoal <= 0 || isNaN(hoursGoal)) {
      setError('Please set a valid weekly target greater than 0 hours.')
      return
    }

    try {
      setIsSaving(true)
      await onSave(hoursGoal, priorities)
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to update weekly settings.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative glass-panel w-full max-w-md rounded-xl overflow-hidden shadow-2xl z-10 animate-scale-up"
        style={{
          animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" /> Weekly Goals & Priorities
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Weekly Hours Goal */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Weekly Study Goal (Hours)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="168"
              value={hoursGoal}
              onChange={(e) => setHoursGoal(parseFloat(e.target.value) || 0)}
              required
              className="w-full glass-input px-3.5 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Weekly Priorities */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Weekly Focus Priorities ({priorities.length}/5)
            </label>

            {/* Input field */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="E.g. Complete SQL Joins, Build Power BI Dashboard..."
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddPriority()
                  }
                }}
                className="flex-1 glass-input px-3.5 py-2 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={handleAddPriority}
                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Priorities List */}
            {priorities.length === 0 ? (
              <p className="text-xs text-slate-500 italic mt-2">No priorities set for this week.</p>
            ) : (
              <ul className="space-y-2 mt-2">
                {priorities.map((priority, index) => (
                  <li 
                    key={index}
                    className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border border-slate-800/80 rounded-lg text-sm text-slate-200"
                  >
                    <span className="truncate max-w-[85%]">{priority}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePriority(index)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded hover:bg-slate-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="glow-btn px-5 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes scaleUp {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
