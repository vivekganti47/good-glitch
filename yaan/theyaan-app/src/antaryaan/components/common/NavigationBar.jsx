import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Gem, Zap, ChevronRight, Sun, Moon } from 'lucide-react'
import useUserStore from '../../stores/userStore'
import useThemeStore from '../../stores/themeStore'
import StreakFire from './StreakFire'

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-xl transition-colors ${
        isDark
          ? 'hover:bg-slate-800/50 text-slate-400 hover:text-white'
          : 'hover:bg-slate-200/70 text-slate-500 hover:text-slate-700'
      }`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="w-5 h-5" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

function NavigationBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const location = useLocation()
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const currentStreak = useUserStore((s) => s.currentStreak)
  const totalXP = useUserStore((s) => s.totalXP)
  const gems = useUserStore((s) => s.gems)

  // Build breadcrumb from current path
  const breadcrumbs = buildBreadcrumbs(location.pathname)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 h-14 backdrop-blur-md border-b transition-colors ${
        isDark
          ? 'bg-slate-900/80 border-slate-700/40'
          : 'bg-white/80 border-slate-200'
      }`}
    >
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        {/* Left: Logo + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <Link
            to="/antaryaan"
            className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
          >
            <span
              className={`text-lg font-bold bg-clip-text text-transparent ${
                isDark
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500'
              }`}
            >
              antarYaan
            </span>
          </Link>

          {/* Breadcrumb - hidden on mobile */}
          {breadcrumbs.length > 0 && (
            <div className="hidden md:flex items-center gap-1 text-sm min-w-0">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-1 min-w-0">
                  <ChevronRight
                    size={14}
                    className={`flex-shrink-0 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}
                  />
                  {crumb.to ? (
                    <Link
                      to={crumb.to}
                      className={`transition-colors truncate ${
                        isDark
                          ? 'text-slate-400 hover:text-slate-200'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className={`truncate ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
                    >
                      {crumb.label}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Stats + Theme Toggle (desktop) */}
        <div className="hidden sm:flex items-center gap-4">
          {/* Streak */}
          <StreakFire streak={currentStreak} size="sm" />

          {/* XP */}
          <div className="flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400 fill-amber-400" />
            <span
              className={`text-sm font-semibold ${
                isDark ? 'text-amber-300' : 'text-amber-600'
              }`}
            >
              {formatNumber(totalXP)}
            </span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5">
            <Gem size={14} className={isDark ? 'text-sky-400' : 'text-cyan-600'} />
            <span
              className={`text-sm font-semibold ${
                isDark ? 'text-sky-300' : 'text-cyan-700'
              }`}
            >
              {gems}
            </span>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>

        {/* Mobile: Theme toggle + menu toggle */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className={`p-2 rounded-lg transition-colors ${
              isDark
                ? 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/70'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`sm:hidden backdrop-blur-md border-b overflow-hidden ${
              isDark
                ? 'bg-slate-900/95 border-slate-700/40'
                : 'bg-white/95 border-slate-200'
            }`}
          >
            <div className="px-4 py-3 space-y-3">
              {/* Breadcrumb for mobile */}
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-1 text-sm flex-wrap">
                  <Link
                    to="/antaryaan"
                    className={isDark ? 'text-indigo-400' : 'text-amber-600'}
                  >
                    Home
                  </Link>
                  {breadcrumbs.map((crumb, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <ChevronRight
                        size={12}
                        className={isDark ? 'text-slate-600' : 'text-slate-400'}
                      />
                      {crumb.to ? (
                        <Link
                          to={crumb.to}
                          className={isDark ? 'text-slate-400' : 'text-slate-500'}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {crumb.label}
                        </Link>
                      ) : (
                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                          {crumb.label}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Stats row */}
              <div className="flex items-center gap-5 pt-1">
                <StreakFire streak={currentStreak} size="sm" />
                <div className="flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-400 fill-amber-400" />
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? 'text-amber-300' : 'text-amber-600'
                    }`}
                  >
                    {formatNumber(totalXP)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gem size={14} className={isDark ? 'text-sky-400' : 'text-cyan-600'} />
                  <span
                    className={`text-sm font-semibold ${
                      isDark ? 'text-sky-300' : 'text-cyan-700'
                    }`}
                  >
                    {gems}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

function buildBreadcrumbs(pathname) {
  const parts = pathname
    .replace(/^\/antaryaan\/?/, '')
    .split('/')
    .filter(Boolean)

  if (parts.length === 0) return []

  const crumbs = []
  const labelMap = {
    galaxy: 'Galaxy',
    practice: 'Practice',
    quest: 'Quest',
    star: 'Star',
    planet: 'Planet',
    dashboard: 'Dashboard',
    profile: 'Profile',
    leaderboard: 'Leaderboard',
    settings: 'Settings',
  }

  let path = '/antaryaan'
  for (let i = 0; i < parts.length; i++) {
    path += '/' + parts[i]
    const label =
      labelMap[parts[i]] || decodeURIComponent(parts[i]).replace(/-/g, ' ')
    const isLast = i === parts.length - 1

    crumbs.push({
      label: capitalize(label),
      to: isLast ? null : path,
    })
  }

  return crumbs
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function formatNumber(num) {
  if (num >= 10000) return (num / 1000).toFixed(1) + 'k'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return String(num)
}

export default NavigationBar
