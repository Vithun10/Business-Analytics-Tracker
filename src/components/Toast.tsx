import React, { useEffect } from 'react'
import { X, CheckCircle2, AlertCircle } from 'lucide-react'

interface ToastProps {
  message: string
  type: 'success' | 'error'
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 4000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-lg shadow-2xl transition-all duration-300 transform translate-y-0 scale-100 animate-slide-in
      bg-slate-900/90 border-slate-800"
      style={{
        animation: 'slideIn 0.3s ease-out forwards'
      }}
    >
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
      )}
      
      <span className="text-sm font-medium text-slate-100">{message}</span>
      
      <button 
        onClick={onClose}
        className="ml-2 text-slate-400 hover:text-slate-200 transition-colors p-0.5 rounded hover:bg-slate-800"
      >
        <X className="w-4 h-4" />
      </button>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateY(1rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
