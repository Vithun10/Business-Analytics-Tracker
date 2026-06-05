import React, { useState } from 'react'
import { Search, SlidersHorizontal, CheckSquare, Sparkles, GraduationCap } from 'lucide-react'
import { SKILL_CATEGORIES } from '../utils/skillData'
import { SkillAccordion } from '../components/SkillAccordion'
import { useSkills } from '../hooks/useSkills'

interface SkillTrackerProps {
  skillsHook: ReturnType<typeof useSkills>
}

export const SkillTracker: React.FC<SkillTrackerProps> = ({ skillsHook }) => {
  const { 
    getTopicProgress, 
    updateTopic, 
    overallCompletion, 
    categoryCompletion, 
    completedTopicsCount, 
    totalTopicsCount 
  } = skillsHook

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Not Started' | 'In Progress' | 'Completed'>('All')

  // Filter Categories and Topics based on search and status selects
  const filteredCategories = React.useMemo(() => {
    return SKILL_CATEGORIES.map((cat) => {
      const filteredTopics = cat.topics.filter((topic) => {
        const prog = getTopicProgress(cat.name, topic)
        
        // Filter by Search Query
        const matchesSearch = topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
          cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        
        // Filter by Status
        const matchesStatus = statusFilter === 'All' || prog.status === statusFilter

        return matchesSearch && matchesStatus
      })

      return {
        ...cat,
        topics: filteredTopics
      }
    }).filter((cat) => cat.topics.length > 0)
  }, [searchQuery, statusFilter, getTopicProgress])

  const filterOptions: Array<'All' | 'Not Started' | 'In Progress' | 'Completed'> = [
    'All',
    'Not Started',
    'In Progress',
    'Completed'
  ]

  const getStatusButtonClass = (opt: typeof statusFilter) => {
    const base = "px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer"
    if (statusFilter === opt) {
      switch (opt) {
        case 'Completed':
          return `${base} bg-emerald-500/15 border-emerald-500/30 text-emerald-400`
        case 'In Progress':
          return `${base} bg-amber-500/15 border-amber-500/30 text-amber-400`
        case 'Not Started':
          return `${base} bg-slate-800 border-slate-700 text-slate-300`
        default:
          return `${base} bg-indigo-500/15 border-indigo-500/30 text-indigo-400`
      }
    }
    return `${base} bg-slate-900 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-800`
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight my-0">
            Syllabus Skill Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Monitor and check off topics across the 9 core Business Analyst modules.
          </p>
        </div>

        {/* Global Progress Badge */}
        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center gap-3 shrink-0">
          <GraduationCap className="w-5 h-5 text-indigo-400" />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest leading-none">Overall completion</span>
            <span className="text-lg font-black text-white mt-1 leading-none">{overallCompletion}%</span>
          </div>
          <div className="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-indigo-400">{completedTopicsCount}/{totalTopicsCount}</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search categories or topics (e.g. JOIN, Pivot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-lg text-sm"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 mr-1 shrink-0" />
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setStatusFilter(opt)}
              className={getStatusButtonClass(opt)}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Syllabus Categories List */}
      <div className="space-y-4">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-xl border border-dashed border-slate-800">
            <CheckSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-300 font-bold">No matching topics found</p>
            <p className="text-slate-500 text-xs mt-1.5">
              Try adjusting your query or filter criteria.
            </p>
          </div>
        ) : (
          filteredCategories.map((category) => (
            <SkillAccordion
              key={category.name}
              category={category}
              categoryCompletionPercentage={categoryCompletion[category.name] || 0}
              getTopicProgress={getTopicProgress}
              updateTopic={updateTopic}
            />
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="glass-panel p-4 rounded-xl flex items-center gap-3 bg-slate-900/10">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-xs text-slate-400 leading-normal font-medium">
          <strong>Tip:</strong> Click on any topic name to expand it. You can rate your confidence level (1-10) and document key study notes that will be saved in your database profile.
        </p>
      </div>

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
