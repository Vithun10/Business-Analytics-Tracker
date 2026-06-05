import React from 'react'
import * as Icons from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  iconName: keyof typeof Icons
  description?: string
  color?: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose'
  className?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  iconName,
  description,
  color = 'indigo',
  className = ''
}) => {
  const IconComponent = Icons[iconName] as React.ComponentType<{ className?: string }>

  const colorMap = {
    indigo: {
      text: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      glow: 'shadow-indigo-500/5'
    },
    emerald: {
      text: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'shadow-emerald-500/5'
    },
    violet: {
      text: 'text-violet-400',
      bg: 'bg-violet-500/10 border-violet-500/20',
      glow: 'shadow-violet-500/5'
    },
    amber: {
      text: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      glow: 'shadow-amber-500/5'
    },
    rose: {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      glow: 'shadow-rose-500/5'
    }
  }

  const styles = colorMap[color]

  return (
    <div className={`glass-panel glass-panel-hover p-6 rounded-xl flex flex-col justify-between shadow-lg ${styles.glow} ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">{title}</span>
        <div className={`p-2 rounded-lg border ${styles.bg}`}>
          {IconComponent && <IconComponent className={`w-5 h-5 ${styles.text}`} />}
        </div>
      </div>
      
      <div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-2">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
