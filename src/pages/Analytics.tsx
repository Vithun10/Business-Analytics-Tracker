import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import { BarChart3, LineChart as LineIcon, Calendar, Clock, Sparkles } from 'lucide-react'
import { SKILL_CATEGORIES } from '../utils/skillData'
import { useSkills } from '../hooks/useSkills'
import { useStudySessions } from '../hooks/useStudySessions'

interface AnalyticsProps {
  skillsHook: ReturnType<typeof useSkills>
  studyHook: ReturnType<typeof useStudySessions>
}

export const Analytics: React.FC<AnalyticsProps> = ({ skillsHook, studyHook }) => {
  const { categoryCompletion, progressList, totalTopicsCount } = skillsHook
  const { sessions } = studyHook

  // 1. Skill Completion Chart Data (Category vs Completion %)
  const skillCompletionData = React.useMemo(() => {
    return SKILL_CATEGORIES.map((cat) => ({
      name: cat.name,
      'Completion %': categoryCompletion[cat.name] || 0
    }))
  }, [categoryCompletion])

  // 2. Learning Progress Trend Data (Cumulative completions over time)
  const learningProgressData = React.useMemo(() => {
    const completedItems = progressList
      .filter((p) => p.status === 'Completed' && p.completed_at)
      .map((p) => ({
        date: p.completed_at!.split('T')[0],
        weight: 1
      }))

    // Sort by date ascending
    completedItems.sort((a, b) => a.date.localeCompare(b.date))

    // Group counts by date
    const dateGroups: Record<string, number> = {}
    completedItems.forEach((item) => {
      dateGroups[item.date] = (dateGroups[item.date] || 0) + 1
    })

    const uniqueDates = Object.keys(dateGroups).sort()
    let cumulativeCount = 0

    const trend = uniqueDates.map((date) => {
      cumulativeCount += dateGroups[date]
      const percentage = Math.round((cumulativeCount / totalTopicsCount) * 100)
      
      const [year, month, day] = date.split('-').map(Number)
      const formattedDate = new Date(year, month - 1, day).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })

      return {
        dateStr: formattedDate,
        'Overall Completion %': percentage
      }
    })

    // If no progress yet, add default start points
    if (trend.length === 0) {
      return [
        { dateStr: 'Start', 'Overall Completion %': 0 },
        { dateStr: 'Today', 'Overall Completion %': 0 }
      ]
    }
    
    // Prefix a zero baseline
    return [{ dateStr: 'Curriculum Start', 'Overall Completion %': 0 }, ...trend]
  }, [progressList, totalTopicsCount])

  // 3. Study Hours Trend Data (Daily study hours over the last 14 days)
  const studyHoursTrendData = React.useMemo(() => {
    // Generate last 14 days dates
    const data = []
    const today = new Date()
    
    for (let i = 13; i >= 0; i--) {
      const d = new Date()
      d.setDate(today.getDate() - i)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`
      
      const formattedLabel = d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })

      // Sum hours for this date
      const dayHours = sessions
        .filter((s) => s.date === dateKey)
        .reduce((sum, s) => sum + Number(s.hours), 0)

      data.push({
        dateStr: formattedLabel,
        'Study Hours': Number(dayHours.toFixed(1))
      })
    }
    
    return data
  }, [sessions])

  // 4. Weekly Activity Chart Data (Study hours per weekday for the current calendar week)
  const weeklyActivityData = React.useMemo(() => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    
    // Get start of the current week (Monday)
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // distance to Monday
    
    const monday = new Date(today)
    monday.setDate(today.getDate() + distanceToMon)
    monday.setHours(0, 0, 0, 0)

    const data = weekdays.map((dayName, index) => {
      const targetDate = new Date(monday)
      targetDate.setDate(monday.getDate() + index)
      
      const year = targetDate.getFullYear()
      const month = String(targetDate.getMonth() + 1).padStart(2, '0')
      const day = String(targetDate.getDate()).padStart(2, '0')
      const dateKey = `${year}-${month}-${day}`

      // Sum hours
      const hours = sessions
        .filter((s) => s.date === dateKey)
        .reduce((sum, s) => sum + Number(s.hours), 0)

      return {
        day: dayName,
        Hours: Number(hours.toFixed(1))
      }
    })

    return data
  }, [sessions])

  // Custom tooltips to match glassmorphic dark design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-800 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="text-xs font-bold text-slate-400 mb-1">{label}</p>
          <p className="text-sm font-black text-indigo-400">
            {payload[0].name}: {payload[0].value}
            {payload[0].name.includes('%') ? '%' : ' hrs'}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight my-0">
          Analytics Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1.5 font-medium">
          Visualize your syllabus completions, study timelines, and weekly study frequencies.
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. Skill Completion Chart */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-slate-200 my-0">Skill Completion Breakdown</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillCompletionData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  angle={-25} 
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Completion %" fill="url(#indigoViolet)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="indigoViolet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.95}/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Learning Progress Trend */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <LineIcon className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-200 my-0">Learning Progress Trend</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={learningProgressData} margin={{ top: 10, right: 15, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="dateStr" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="Overall Completion %" 
                  stroke="#34d399" 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 1 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Study Hours Trend */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <Clock className="w-5 h-5 text-violet-400" />
            <h2 className="text-base font-bold text-slate-200 my-0">Study Hours Trend (Last 14 Days)</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={studyHoursTrendData} margin={{ top: 10, right: 15, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="dateStr" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="Study Hours" 
                  stroke="#a78bfa" 
                  fill="url(#violetGlow)" 
                  strokeWidth={2.5}
                />
                <defs>
                  <linearGradient id="violetGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Weekly Activity Chart */}
        <div className="glass-panel p-5 rounded-xl flex flex-col justify-between shadow-lg">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-900 pb-3">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-slate-200 my-0">Weekly Activity (Current Week)</h2>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.3} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Hours" fill="url(#amberGlow)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="amberGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.95}/>
                    <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.5}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Helper Suggestion */}
      <div className="glass-panel p-4 rounded-xl flex items-center gap-3 bg-slate-900/10">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
        <p className="text-xs text-slate-400 leading-normal font-medium">
          Your learning analytics update automatically whenever you log a study session or mark a syllabus topic as completed. Use these visualizations to optimize your study patterns and stay consistent.
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
