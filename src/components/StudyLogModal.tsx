import React, { useState, useEffect } from 'react'
import { X, Calendar, BookOpen, Clock, AlignLeft } from 'lucide-react'
import { SKILL_CATEGORIES } from '../utils/skillData'

interface StudyLogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (session: {
    date: string
    skill: string
    topic: string
    hours: number
    notes: string
  }) => Promise<void>
}

export const StudyLogModal: React.FC<StudyLogModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedCategory, setSelectedCategory] = useState(SKILL_CATEGORIES[0]?.name || '')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [hours, setHours] = useState('1')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Find topics for the selected category
  const topics = SKILL_CATEGORIES.find((cat) => cat.name === selectedCategory)?.topics || []

  // Reset selected topic when category changes
  useEffect(() => {
    if (topics.length > 0) {
      setSelectedTopic(topics[0])
    } else {
      setSelectedTopic('')
    }
  }, [selectedCategory])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const hoursNum = parseFloat(hours)
    if (isNaN(hoursNum) || hoursNum <= 0) {
      setError('Please enter a valid study time (greater than 0 hours).')
      return
    }

    if (!selectedCategory || !selectedTopic) {
      setError('Please select a skill and topic.')
      return
    }

    try {
      setIsSubmitting(true)
      await onSave({
        date,
        skill: selectedCategory,
        topic: selectedTopic,
        hours: hoursNum,
        notes: notes.trim()
      })
      
      // Reset form
      setNotes('')
      setHours('1')
      onClose()
    } catch (err: any) {
      setError(err?.message || 'Failed to save study session.')
    } finally {
      setIsSubmitting(false)
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
      <div className="relative glass-panel w-full max-w-lg rounded-xl overflow-hidden shadow-2xl z-10 animate-scale-up"
        style={{
          animation: 'scaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" /> Log Study Session
          </h2>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full glass-input px-3.5 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Skill Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Skill Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-lg text-sm text-slate-200"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name} className="bg-slate-900 text-slate-200">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Topic Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Topic
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-lg text-sm text-slate-200"
              >
                {topics.map((topic) => (
                  <option key={topic} value={topic} className="bg-slate-900 text-slate-200">
                    {topic}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Study Hours */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Duration (Hours)
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="24"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              required
              placeholder="E.g. 1.5"
              className="w-full glass-input px-3.5 py-2 rounded-lg text-sm"
            />
          </div>

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <AlignLeft className="w-3.5 h-3.5 text-indigo-400" /> Study Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn? Document resources, code, or takeaways..."
              rows={3}
              className="w-full glass-input px-3.5 py-2 rounded-lg text-sm resize-none"
            />
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
              disabled={isSubmitting}
              className="glow-btn px-5 py-2 text-sm font-semibold text-white rounded-lg disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSubmitting ? 'Logging...' : 'Save Session'}
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
