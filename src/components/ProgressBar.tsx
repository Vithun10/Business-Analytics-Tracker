import React from 'react'

interface ProgressBarProps {
  value: number // 0 to 100
  type?: 'linear' | 'circle'
  size?: number // used for circle
  strokeWidth?: number // used for circle
  className?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  type = 'linear',
  size = 60,
  strokeWidth = 6,
  className = ''
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value))

  if (type === 'circle') {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (normalizedValue / 100) * circumference

    return (
      <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
        <svg className="w-full h-full transform -rotate-90">
          {/* Background circle */}
          <circle
            className="text-slate-800"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
          {/* Progress circle */}
          <circle
            className="text-indigo-500 transition-all duration-500 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx={size / 2}
            cy={size / 2}
          />
        </svg>
        <span className="absolute text-xs font-bold text-slate-200">
          {Math.round(normalizedValue)}%
        </span>
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-slate-400">Progress</span>
        <span className="text-xs font-bold text-slate-200">{Math.round(normalizedValue)}%</span>
      </div>
      <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
    </div>
  )
}
