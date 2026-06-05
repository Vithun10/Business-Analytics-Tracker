import React, { useState } from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { profile, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

const navItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'skills',
    name: 'Skill Tracker',
    icon: CheckSquare,
  },
  {
    id: 'study',
    name: 'Study Tracker',
    icon: BookOpen,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    icon: BarChart3,
  },
  
  {
  id: "career",
  name: "Career Readiness",
  icon: BarChart3
}
]

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId)
    setIsOpen(false)
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'BA'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-900 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-6 h-6 text-indigo-500" />
          <span className="text-lg font-extrabold text-white tracking-tight">BA Tracker</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 bottom-0 z-40 w-64 border-r border-slate-900 bg-slate-950/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 md:translate-x-0 h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        <div className="flex flex-col flex-1 py-6 px-4">
          {/* Header */}
          <div className="flex items-center gap-3 px-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight">BA Tracker</span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">SaaS Dashboard</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/5 text-indigo-400 border-l-2 border-indigo-500 pl-[14px]' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-l-2 border-transparent'}`}
                >
                  <Icon className={`w-4.5 h-4.5 transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  {item.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* User Account / Profile Details */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 max-w-[70%]">
              {profile?.avatar_url ? (
                <img 
                  src={profile.avatar_url} 
                  alt={profile.full_name || 'User'} 
                  className="w-10 h-10 rounded-full border border-slate-800 object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-indigo-400 shrink-0">
                  {getInitials(profile?.full_name || '')}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-slate-200 truncate">
                  {profile?.full_name || 'Guest User'}
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate">
                  {profile?.email || ''}
                </span>
              </div>
            </div>
            
            <button 
              onClick={signOut}
              title="Sign Out"
              className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-lg border border-transparent hover:border-rose-500/10 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
        />
      )}
    </>
  )
}
