import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Flame, Star, Trophy, Gem, ChevronRight,
  Zap, TrendingUp, Clock, Award, Rocket
} from 'lucide-react'
import { Link } from 'react-router-dom'
import useUserStore from '../stores/userStore'
import useProgressStore from '../stores/progressStore'
import usePlannerStore from '../stores/plannerStore'
import useThemeStore from '../stores/themeStore'
import { galaxies } from '../data/galaxies'
import { constellations } from '../data/constellations'
import SpaceBackground from '../components/common/SpaceBackground'
import TopicSidebar from '../components/dashboard/TopicSidebar'
import PlanOfAction from '../components/dashboard/PlanOfAction'

// --- Animation Variants ---

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

// --- Sub-components ---

function StreakFire({ streak }) {
  return (
    <motion.div
      className="flex items-center gap-2"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="relative">
        <Flame className="w-5 h-5 text-orange-400" />
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <Flame className="w-5 h-5 text-yellow-300 blur-[1px]" />
        </motion.div>
      </div>
      <span className="text-base font-bold text-orange-500">{streak}</span>
    </motion.div>
  )
}

function XPProgressBar({ current, goal, isDark }) {
  const pct = Math.min((current / goal) * 100, 100)
  return (
    <div className="flex items-center gap-3">
      <Zap className="w-4 h-4 text-yellow-500" />
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className={isDark ? 'text-white/70' : 'text-slate-600'}>Today's XP</span>
          <span className={`font-medium ${isDark ? 'text-yellow-300' : 'text-amber-600'}`}>
            {current} / {goal}
          </span>
        </div>
        <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #FDE68A)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  )
}

function MiniConstellationPreview({ constellationData, galaxy }) {
  const svgW = 120
  const svgH = 50
  return (
    <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full opacity-40 group-hover:opacity-70 transition-opacity">
      {constellationData.map((c, ci) => {
        if (!c.starPositions || !c.connections) return null
        const offsetX = ci * 40 + 10
        const offsetY = 10
        const scale = 0.5
        return (
          <g key={c.id}>
            {c.connections.map(([a, b], li) => {
              const sa = c.starPositions[a]
              const sb = c.starPositions[b]
              if (!sa || !sb) return null
              return (
                <line
                  key={`l-${li}`}
                  x1={offsetX + sa.x * 30 * scale}
                  y1={offsetY + sa.y * 50 * scale}
                  x2={offsetX + sb.x * 30 * scale}
                  y2={offsetY + sb.y * 50 * scale}
                  stroke={c.colors?.primary || galaxy.colors.primary}
                  strokeWidth={0.5}
                  strokeOpacity={0.5}
                />
              )
            })}
            {c.starPositions.map((sp, si) => (
              <circle
                key={`s-${si}`}
                cx={offsetX + sp.x * 30 * scale}
                cy={offsetY + sp.y * 50 * scale}
                r={1.2}
                fill={c.colors?.primary || galaxy.colors.primary}
              />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

function GalaxyCard({ galaxy, progress, isDark }) {
  const constellationData = galaxy.constellationIds.map((cId) => {
    const c = constellations.find((con) => con.id === cId)
    return c
  }).filter(Boolean)

  const totalStars = constellationData.reduce((sum, c) => sum + c.totalStars, 0)
  const completedStars = progress?.constellations?.reduce((sum, c) => sum + c.completedStars, 0) || 0
  const mastery = totalStars > 0 ? Math.round((completedStars / totalStars) * 100) : 0

  const iconMap = {
    atom: '⚛',
    flask: '🧪',
    dna: '🧬',
  }

  return (
    <Link to={`/antaryaan/galaxy/${galaxy.id}`}>
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className={`relative overflow-hidden rounded-xl border p-4 cursor-pointer group h-full transition-shadow ${
          isDark ? '' : 'shadow-sm hover:shadow-md'
        }`}
        style={{
          borderColor: isDark ? `${galaxy.colors.primary}30` : `${galaxy.colors.primary}40`,
          background: isDark
            ? `linear-gradient(160deg, ${galaxy.colors.primary}08 0%, ${galaxy.colors.secondary}05 100%)`
            : `linear-gradient(160deg, ${galaxy.colors.primary}10 0%, white 100%)`,
        }}
      >
        {/* Glow effect on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at center, ${galaxy.colors.primary}15 0%, transparent 70%)`,
          }}
        />

        {/* Mini constellation preview */}
        <div className="absolute top-2 right-2 w-24 h-12 pointer-events-none">
          <MiniConstellationPreview constellationData={constellationData} galaxy={galaxy} />
        </div>

        <div className="relative z-10">
          {/* Icon and subject */}
          <div className="flex items-start justify-between mb-2">
            <div
              className="text-2xl w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: `${galaxy.colors.primary}15` }}
            >
              {iconMap[galaxy.icon] || '🌟'}
            </div>
            <div
              className="px-2 py-0.5 rounded-md text-xs font-medium"
              style={{
                background: `${galaxy.colors.primary}15`,
                color: galaxy.colors.primary,
              }}
            >
              {galaxy.subject}
            </div>
          </div>

          {/* Name */}
          <h3
            className="font-bold text-base mb-2"
            style={{
              background: `linear-gradient(135deg, ${galaxy.colors.primary}, ${galaxy.colors.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {galaxy.name}
          </h3>

          {/* Mastery bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs mb-1">
              <span className={isDark ? 'text-white/50' : 'text-slate-500'}>Mastery</span>
              <span style={{ color: galaxy.colors.primary }} className="font-medium">
                {mastery}%
              </span>
            </div>
            <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${galaxy.colors.primary}, ${galaxy.colors.accent})`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${mastery}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className={`flex items-center justify-between text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            <span>
              <Star className="w-3 h-3 inline mr-1" style={{ color: galaxy.colors.primary }} />
              {completedStars} / {totalStars}
            </span>
            <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}

function QuickStatsRow({ totalXP, weeklyXP, currentLeague, dueReviewCount, isDark }) {
  const leagueColors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
    champion: '#FF6B6B',
  }

  const cardStyle = isDark
    ? 'bg-white/[0.03] border-white/10'
    : 'bg-white border-slate-200 shadow-sm'

  const labelStyle = isDark ? 'text-white/50' : 'text-slate-500'
  const valueStyle = isDark ? 'text-white/90' : 'text-slate-800'

  return (
    <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <div className={`p-3 rounded-xl border ${cardStyle}`}>
        <div className="flex items-center gap-2 mb-1">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className={`text-xs ${labelStyle}`}>Total XP</span>
        </div>
        <p className={`text-lg font-bold ${valueStyle}`}>{totalXP.toLocaleString()}</p>
      </div>

      <div className={`p-3 rounded-xl border ${cardStyle}`}>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className={`text-xs ${labelStyle}`}>This Week</span>
        </div>
        <p className={`text-lg font-bold ${valueStyle}`}>{weeklyXP} XP</p>
      </div>

      <div className={`p-3 rounded-xl border ${cardStyle}`}>
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-4 h-4" style={{ color: leagueColors[currentLeague] }} />
          <span className={`text-xs ${labelStyle}`}>League</span>
        </div>
        <p className="text-lg font-bold capitalize" style={{ color: leagueColors[currentLeague] }}>
          {currentLeague}
        </p>
      </div>

      <Link to="/antaryaan/review">
        <div className={`p-3 rounded-xl border transition-colors h-full ${
          dueReviewCount > 0
            ? isDark
              ? 'bg-violet-500/10 border-violet-500/30 hover:bg-violet-500/15'
              : 'bg-violet-50 border-violet-200 hover:bg-violet-100'
            : cardStyle
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-violet-500" />
            <span className={`text-xs ${labelStyle}`}>Due Review</span>
          </div>
          <p className={`text-lg font-bold ${
            dueReviewCount > 0
              ? isDark ? 'text-violet-300' : 'text-violet-600'
              : valueStyle
          }`}>
            {dueReviewCount} topics
          </p>
        </div>
      </Link>
    </motion.div>
  )
}

function RecentActivity({ starProgress, planetProgress, questProgress, isDark }) {
  const activities = []

  Object.entries(starProgress).forEach(([id, data]) => {
    if (data.completed) {
      activities.push({
        type: 'star',
        id,
        label: id.replace(/-/g, ' '),
        date: data.completedAt,
        icon: Star,
        color: '#FBBF24',
      })
    }
  })

  Object.entries(planetProgress).forEach(([id, data]) => {
    if (data.completed) {
      activities.push({
        type: 'planet',
        id,
        label: id.replace(/-/g, ' '),
        date: data.completedAt,
        icon: Rocket,
        color: '#60A5FA',
      })
    }
  })

  Object.entries(questProgress).forEach(([id, data]) => {
    if (data.completed) {
      activities.push({
        type: 'quest',
        id,
        label: id.replace(/-/g, ' '),
        date: data.completedAt,
        icon: Award,
        color: '#A78BFA',
      })
    }
  })

  activities.sort((a, b) => new Date(b.date) - new Date(a.date))
  const recent = activities.slice(0, 4)

  const cardStyle = isDark
    ? 'bg-white/[0.02] border-white/10'
    : 'bg-white border-slate-200 shadow-sm'

  const titleStyle = isDark ? 'text-white/80' : 'text-slate-700'
  const iconStyle = isDark ? 'text-white/40' : 'text-slate-400'

  if (recent.length === 0) {
    return (
      <motion.div
        variants={itemVariants}
        className={`rounded-xl border p-4 ${cardStyle}`}
      >
        <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${titleStyle}`}>
          <Clock className={`w-4 h-4 ${iconStyle}`} />
          Recent Activity
        </h3>
        <p className={`text-sm text-center py-3 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          No activity yet. Start learning!
        </p>
      </motion.div>
    )
  }

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return ''
    const now = new Date()
    const date = new Date(dateStr)
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <motion.div
      variants={itemVariants}
      className={`rounded-xl border p-4 ${cardStyle}`}
    >
      <h3 className={`font-semibold text-sm mb-3 flex items-center gap-2 ${titleStyle}`}>
        <Clock className={`w-4 h-4 ${iconStyle}`} />
        Recent Activity
      </h3>
      <div className="space-y-2">
        {recent.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${activity.color}15` }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: activity.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs capitalize truncate ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  {activity.label}
                </p>
                <p className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                  {getTimeAgo(activity.date)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// --- Main Dashboard ---

export default function Dashboard() {
  const { currentStreak, totalXP, todayXP, weeklyXP, currentLeague, gems, name } = useUserStore()
  const { starProgress, planetProgress, questProgress, getGalaxyProgress, getDueReviewConcepts } = useProgressStore()
  const { sidebarOpen } = usePlannerStore()
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const dailyGoal = 50

  const dueReviews = useMemo(() => getDueReviewConcepts(), [getDueReviewConcepts])

  const galaxyProgressData = useMemo(() => {
    return galaxies.map((g) => ({
      galaxy: g,
      progress: getGalaxyProgress(g.id),
    }))
  }, [getGalaxyProgress])

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      {/* Topic Sidebar */}
      <TopicSidebar />

      {/* Main Content */}
      <div
        className="relative z-10 transition-all duration-300"
        style={{
          marginLeft: sidebarOpen ? '320px' : '0px',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-24">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* --- Compact Header --- */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <motion.h1
                  className="text-2xl sm:text-3xl font-extrabold mb-0.5"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #94A3B8 100%)'
                      : 'linear-gradient(135deg, #1E293B 0%, #475569 50%, #64748B 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Welcome back, {name}
                </motion.h1>
                <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                  Your learning journey continues
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StreakFire streak={currentStreak} />
                <div className="flex items-center gap-1.5">
                  <Gem className={isDark ? 'text-cyan-400' : 'text-cyan-600'} size={16} />
                  <span className={`text-base font-bold ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                    {gems}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* --- XP Progress --- */}
            <motion.div
              variants={itemVariants}
              className={`rounded-xl border p-3 ${
                isDark
                  ? 'bg-white/[0.02] border-white/10'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <XPProgressBar current={todayXP} goal={dailyGoal} isDark={isDark} />
            </motion.div>

            {/* --- Plan of Action (Main Focus) --- */}
            <motion.div variants={itemVariants}>
              <PlanOfAction />
            </motion.div>

            {/* --- Quick Stats --- */}
            <QuickStatsRow
              totalXP={totalXP}
              weeklyXP={weeklyXP}
              currentLeague={currentLeague}
              dueReviewCount={dueReviews.length}
              isDark={isDark}
            />

            {/* --- Galaxy Cards + Recent Activity --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Galaxies */}
              <div className="lg:col-span-2">
                <motion.div variants={itemVariants}>
                  <h2 className={`text-base font-bold mb-3 flex items-center gap-2 ${
                    isDark ? 'text-white/80' : 'text-slate-700'
                  }`}>
                    <TrendingUp className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
                    Your Galaxies
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {galaxyProgressData.map(({ galaxy, progress }) => (
                      <GalaxyCard key={galaxy.id} galaxy={galaxy} progress={progress} isDark={isDark} />
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Recent Activity */}
              <div>
                <RecentActivity
                  starProgress={starProgress}
                  planetProgress={planetProgress}
                  questProgress={questProgress}
                  isDark={isDark}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
