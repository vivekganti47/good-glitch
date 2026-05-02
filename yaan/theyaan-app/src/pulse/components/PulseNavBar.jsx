import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Bell, LayoutDashboard, Users, BookOpen, BarChart3, ChevronDown } from 'lucide-react'
import usePulseStore from '../stores/pulseStore'
import { classes } from '../data/mockClasses'

const navLinks = [
  { label: 'Dashboard', to: '/pulse', icon: LayoutDashboard },
  { label: 'Lesson Planner', to: '/pulse/planner', icon: BookOpen },
]

export default function PulseNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [classDropdown, setClassDropdown] = useState(false)
  const location = useLocation()
  const { teacherAvatar, notificationCount, clearNotifications, selectedClassId } = usePulseStore()

  const isActive = (path) => {
    if (path === '/pulse') return location.pathname === '/pulse'
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/40">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo + nav links */}
        <div className="flex items-center gap-6">
          <Link to="/pulse" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              PULSE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive(link.to) ? 'bg-emerald-500/15 text-emerald-300' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  {link.label}
                </Link>
              )
            })}

            {/* Classes dropdown */}
            <div className="relative">
              <button
                onClick={() => setClassDropdown(!classDropdown)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  location.pathname.includes('/classroom') || location.pathname.includes('/groups') || location.pathname.includes('/reteach')
                    ? 'bg-emerald-500/15 text-emerald-300'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                <Users size={14} />
                Classes
                <ChevronDown size={12} className={`transition-transform ${classDropdown ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {classDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 mt-1 w-52 bg-slate-800/95 backdrop-blur-md border border-slate-700/60 rounded-xl shadow-xl overflow-hidden z-50"
                    onMouseLeave={() => setClassDropdown(false)}
                  >
                    {classes.map((cls) => (
                      <div key={cls.id} className="border-b border-slate-700/30 last:border-0">
                        <Link
                          to={`/pulse/classroom/${cls.id}`}
                          onClick={() => setClassDropdown(false)}
                          className="block px-4 py-2.5 hover:bg-white/5 transition-colors"
                        >
                          <div className="text-xs font-semibold text-white/80">{cls.name}</div>
                          <div className="text-[10px] text-white/30 mt-0.5">{cls.subject} -- {cls.studentIds.length} students</div>
                        </Link>
                        <div className="flex gap-1 px-4 pb-2">
                          <Link to={`/pulse/groups/${cls.id}`} onClick={() => setClassDropdown(false)} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 hover:text-emerald-300 transition-colors">Groups</Link>
                          <Link to={`/pulse/reteach/${cls.id}`} onClick={() => setClassDropdown(false)} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 hover:text-emerald-300 transition-colors">Reteach</Link>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Analytics link */}
            <Link
              to={`/pulse/reteach/${selectedClassId}`}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                location.pathname.includes('/reteach') ? 'bg-emerald-500/15 text-emerald-300' : 'text-white/40 hover:text-white/70 hover:bg-white/5'
              }`}
            >
              <BarChart3 size={14} />
              Analytics
            </Link>
          </div>
        </div>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={clearNotifications}
            className="relative p-2 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/5 transition-colors"
          >
            <Bell size={16} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center text-white">
                {notificationCount}
              </span>
            )}
          </button>

          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300 text-xs font-bold">
            {teacherAvatar}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900/95 backdrop-blur-md border-b border-slate-700/40 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      isActive(link.to) ? 'bg-emerald-500/15 text-emerald-300' : 'text-white/50'
                    }`}
                  >
                    <Icon size={16} />
                    {link.label}
                  </Link>
                )
              })}
              <div className="border-t border-slate-700/30 pt-2 mt-2">
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-wider px-3 mb-1">Classes</div>
                {classes.map((cls) => (
                  <Link
                    key={cls.id}
                    to={`/pulse/classroom/${cls.id}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-1.5 text-sm text-white/50 hover:text-emerald-300"
                  >
                    {cls.name} -- {cls.subject}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
