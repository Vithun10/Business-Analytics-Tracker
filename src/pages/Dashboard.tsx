import React from 'react'
import { StatCard } from '../components/StatCard'
import { useAuth } from '../context/AuthContext'
import { useSkills } from '../hooks/useSkills'
import { useStudySessions } from '../hooks/useStudySessions'
import { WeeklyGoalWidget } from "../components/WeeklyGoalWidget";
<WeeklyGoalWidget />
import { 
  Play, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight,
  Target,
  Sparkles,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'

interface DashboardProps {
  skillsHook: ReturnType<typeof useSkills>
  studyHook: ReturnType<typeof useStudySessions>
  onLogSessionClick: () => void
  onWeeklyGoalClick: () => void
  setActiveTab: (tab: string) => void
}

export const Dashboard: React.FC<DashboardProps> = ({
  skillsHook,
  studyHook,
  onLogSessionClick,
  onWeeklyGoalClick,
  setActiveTab
}) => {
  const { profile } = useAuth()
  const { overallCompletion, completedTopicsCount, totalTopicsCount, progressList } = skillsHook
  const { dailyHours, weeklyHours, totalHours, learningStreak } = studyHook

  // Fetch weekly goal parameters
  const weeklyHoursGoal = profile?.weekly_hours_goal || 10
  const weeklyPriorities = profile?.weekly_priorities || []
  
  // Weekly hours completion percentage
  const weeklyGoalPct = Math.round((weeklyHours / weeklyHoursGoal) * 100)

  // Calculations for Today's Target
  const todayTargetHours = Number((weeklyHoursGoal / 5).toFixed(1)) // assume 5-day study week
  const todayRemainingHours = Math.max(0, Number((todayTargetHours - dailyHours).toFixed(1)))
  const todayGoalFinished = dailyHours >= todayTargetHours

  // Fetch Pending Topics (limit 3)
  const pendingTopics = React.useMemo(() => {
    // Priority 1: In Progress topics
    // Priority 2: Not Started topics
    const inProgress = progressList.filter(p => p.status === 'In Progress')
    const notStarted = progressList.filter(p => p.status === 'Not Started')
    
    const combined = [...inProgress, ...notStarted]
    return combined.slice(0, 3)
  }, [progressList])

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight my-0">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!
          </h1>
          <p className="text-slate-400 text-sm mt-1.5 font-medium">
            Track your Business Analyst study curriculum and build daily habits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onWeeklyGoalClick}
            className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Target className="w-4 h-4 text-indigo-400" />
            <span>Weekly Goals</span>
          </button>
          
          <button
            onClick={onLogSessionClick}
            className="glow-btn px-5 py-2 text-sm font-semibold text-white rounded-lg flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-white fill-white shrink-0" />
            <span>Log Study</span>
          </button>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <StatCard
          title="Overall Progress"
          value={`${overallCompletion}%`}
          iconName="GraduationCap"
          description={`${completedTopicsCount}/${totalTopicsCount} Completed`}
          color="indigo"
        />
        <StatCard
          title="Skills Completed"
          value={completedTopicsCount}
          iconName="CheckCircle2"
          description={`Target: ${totalTopicsCount} Topics`}
          color="emerald"
        />
        <StatCard
          title="Total Hours"
          value={`${totalHours}h`}
          iconName="BookOpen"
          description="Cumulative logged study"
          color="violet"
        />
        <StatCard
          title="Learning Streak"
          value={`${learningStreak} Days`}
          iconName="Flame"
          description={learningStreak > 0 ? "Keep the fire burning!" : "Log study to start streak"}
          color="rose"
        />
        <StatCard
          title="Weekly Target"
          value={`${weeklyHours} / ${weeklyHoursGoal}h`}
          iconName="Calendar"
          description={`${weeklyGoalPct}% Goal Met`}
          color="amber"
        />
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column (Notifications & Goals) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications Hub */}
          <div className="glass-panel p-6 rounded-xl space-y-5">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-0">
              <Sparkles className="w-5 h-5 text-indigo-400" /> Learning Assistant
            </h2>

            <div className="space-y-4">
              {/* Daily Target Progress */}
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg flex items-start gap-4">
                <div className={`p-2 rounded-lg border shrink-0
                  ${todayGoalFinished 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'}`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-200">Today's Study Target</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {todayGoalFinished ? (
                      <span className="text-emerald-400 font-semibold">Congratulations! You have completed your daily target of {todayTargetHours} hours.</span>
                    ) : (
                      <span>You have studied <strong className="text-slate-200">{dailyHours} hours</strong> today. Complete <strong className="text-indigo-400">{todayRemainingHours} more hours</strong> to hit your daily goal of {todayTargetHours}h.</span>
                    )}
                  </p>
                  
                  {/* Progress Bar inside notification */}
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-800/40">
                    <div 
                      className={`h-full transition-all duration-500 ease-out
                        ${todayGoalFinished ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                      style={{ width: `${Math.min(100, (dailyHours / todayTargetHours) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Weekly Goals & Priorities Notification */}
              <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-lg flex items-start gap-4">
                <div className="p-2 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-400 shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-slate-200">Weekly Target Progress</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    You have achieved <strong className="text-slate-200">{weeklyHours} hours</strong> out of your <strong className="text-indigo-400">{weeklyHoursGoal} hours</strong> weekly target.
                  </p>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mt-3 border border-slate-800/40">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-indigo-500 transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(100, weeklyGoalPct)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pending Topics to study */}
          <div className="glass-panel p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2 my-0">
                <BookOpen className="w-5 h-5 text-indigo-400" /> Pending Key Topics
              </h2>
              <button 
                onClick={() => setActiveTab('skills')}
                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingTopics.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-850 rounded-lg bg-slate-900/10">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-slate-300 font-bold">All topics completed!</p>
                <p className="text-xs text-slate-500 mt-1">You are fully caught up. Expand your knowledge boundaries!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTopics.map((topic, index) => (
                  <div 
                    key={index}
                    onClick={() => setActiveTab('skills')}
                    className="flex items-center justify-between p-3.5 bg-slate-950/40 hover:bg-slate-900/50 border border-slate-900 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-0.5">
                        {topic.category}
                      </span>
                      <span className="text-sm font-bold text-slate-200 truncate">
                        {topic.topic}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full border
                        ${topic.status === 'In Progress' 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                          : 'bg-slate-900 text-slate-400 border-slate-800'}`}
                      >
                        {topic.status}
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Weekly Priorities) */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-900 pb-3">
                <h2 className="text-lg font-bold text-white flex items-center gap-2 my-0">
                  <Target className="w-5 h-5 text-indigo-400" /> Focus Priorities
                </h2>
                <button
                  onClick={onWeeklyGoalClick}
                  className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>

              {weeklyPriorities.length === 0 ? (
                <div className="text-center py-10">
                  <AlertTriangle className="w-8 h-8 text-amber-500/60 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 italic">No priorities set for this week.</p>
                  <button
                    onClick={onWeeklyGoalClick}
                    className="mt-4 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Add Priorities
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {weeklyPriorities.map((priority, index) => (
                    <li 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-slate-950/30 border border-slate-900/60 rounded-lg text-sm text-slate-300 font-medium"
                    >
                      <span className="w-5 h-5 rounded bg-indigo-500/10 border border-indigo-500/25 text-[10px] font-bold text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-tight">{priority}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-900 bg-slate-950/20 rounded-lg p-3 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Priorities help you focus on specific key competencies each week.</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Slide-in styles keyframes */}
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
