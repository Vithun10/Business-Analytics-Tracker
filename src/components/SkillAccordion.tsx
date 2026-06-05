import React, { useState } from 'react'
import * as Icons from 'lucide-react'
import { TopicRow } from './TopicRow'
import type { SkillProgress } from '../hooks/useSkills'

interface SkillCategoryData {
  name: string
  icon: string
  topics: string[]
}

interface SkillAccordionProps {
  category: SkillCategoryData
  categoryCompletionPercentage: number
  getTopicProgress: (category: string, topic: string) => SkillProgress
  updateTopic: (category: string, topic: string, updates: Partial<SkillProgress>) => Promise<any>
}

export const SkillAccordion: React.FC<SkillAccordionProps> = ({
  category,
  categoryCompletionPercentage,
  getTopicProgress,
  updateTopic
}) => {
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(false)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)

  // Dynamically resolve Icon
  const IconComponent = (Icons[category.icon as keyof typeof Icons] || Icons.GraduationCap) as React.ComponentType<{ className?: string }>

  // Count completions
  const completedTopicsCount = category.topics.reduce((count, topic) => {
    const prog = getTopicProgress(category.name, topic)
    return prog.status === 'Completed' ? count + 1 : count
  }, 0)

  const handleTopicToggle = (topic: string) => {
    if (expandedTopic === topic) {
      setExpandedTopic(null)
    } else {
      setExpandedTopic(topic)
    }
  }

  return (
    <div className="glass-panel rounded-xl overflow-hidden shadow-md border-slate-800/80 mb-4 transition-all">
      {/* Category Accordion Header */}
      <div
        onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
        className="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 cursor-pointer hover:bg-slate-900/30 transition-colors select-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400 shrink-0">
            {IconComponent && <IconComponent className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">{category.name}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {completedTopicsCount} of {category.topics.length} completed
            </p>
          </div>
        </div>

        {/* Completion Progress Indicator */}
        <div className="flex items-center gap-5 md:w-1/2 justify-between" onClick={(e) => e.stopPropagation()}>
          {/* Progress Bar */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completion</span>
              <span className="text-xs font-bold text-indigo-400">{categoryCompletionPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/30">
              <div 
                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${categoryCompletionPercentage}%` }}
              />
            </div>
          </div>

          {/* Collapse/Expand Arrow */}
          <button 
            onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
            className="text-slate-400 hover:text-slate-200 p-1 rounded hover:bg-slate-800/50 transition-colors"
          >
            {isCategoryExpanded ? (
              <Icons.ChevronUp className="w-5 h-5 text-slate-400" />
            ) : (
              <Icons.ChevronDown className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>

      {/* Category Topics List */}
      {isCategoryExpanded && (
        <div className="border-t border-slate-900 bg-slate-950/20">
          {category.topics.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500 italic">No topics found.</div>
          ) : (
            category.topics.map((topic) => {
              const prog = getTopicProgress(category.name, topic)
              return (
                <TopicRow
                  key={topic}
                  topicName={topic}
                  categoryName={category.name}
                  progress={prog}
                  onUpdate={updateTopic}
                  isExpanded={expandedTopic === topic}
                  onToggleExpand={() => handleTopicToggle(topic)}
                />
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
