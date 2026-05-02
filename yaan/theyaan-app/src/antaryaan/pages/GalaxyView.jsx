import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Lock, CheckCircle2, Sparkles,
  Atom, FlaskConical, Dna, Zap, Target
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import useProgressStore from '../stores/progressStore'
import useThemeStore from '../stores/themeStore'
import { galaxies } from '../data/galaxies'
import { constellations } from '../data/constellations'
import SpaceBackground from '../components/common/SpaceBackground'

// --- SVG Helpers ---

function polarToCartesian(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
  const start = polarToCartesian(cx, cy, r, endAngle)
  const end = polarToCartesian(cx, cy, r, startAngle)
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

// --- Galaxy Icon ---

function GalaxyIcon({ icon, size = 20 }) {
  const iconMap = { atom: Atom, flask: FlaskConical, dna: Dna }
  const Icon = iconMap[icon] || Sparkles
  return <Icon className={`w-${size / 4} h-${size / 4}`} style={{ width: size, height: size }} />
}

// --- Mini Constellation Cluster (SVG) ---

function ConstellationCluster({
  constellation, progress, isUnlocked, galaxy,
  cx, cy, clusterRadius, onSelect, isHovered, onHover, isDark
}) {
  const { completedStars } = progress
  const totalStars = constellation.totalStars || constellation.starIds.length
  const mastery = totalStars > 0 ? completedStars / totalStars : 0

  let status = 'locked'
  if (isUnlocked) {
    if (completedStars >= totalStars) status = 'completed'
    else if (completedStars > 0) status = 'in-progress'
    else status = 'available'
  }

  const color = status === 'locked' ? '#374151' : constellation.colors.primary
  const starPositions = constellation.starPositions || []
  const connections = constellation.connections || []

  // Scale star positions to cluster area
  const r = clusterRadius
  const stars = starPositions.map((sp) => ({
    x: cx + (sp.x - 0.5) * r * 2,
    y: cy + (sp.y - 0.5) * r * 1.6,
  }))

  const starRadius = status === 'locked' ? 2.5 : 3.5
  const glowId = `glow-${constellation.id}`
  const arcAngle = mastery * 360

  return (
    <g
      className="cursor-pointer"
      onClick={() => status !== 'locked' && onSelect(constellation.id)}
      onMouseEnter={() => onHover(constellation.id)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: status === 'locked' ? 'not-allowed' : 'pointer' }}
    >
      {/* Glow filter */}
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`bg-${constellation.id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity={status === 'locked' ? 0.02 : 0.08} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Background glow circle */}
      <circle
        cx={cx} cy={cy} r={r + 15}
        fill={`url(#bg-${constellation.id})`}
      />

      {/* Hover expand effect */}
      {isHovered && status !== 'locked' && (
        <circle
          cx={cx} cy={cy} r={r + 20}
          fill="none"
          stroke={color}
          strokeWidth={0.5}
          strokeOpacity={0.2}
        >
          <animate attributeName="r" from={r + 15} to={r + 30} dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Connection lines */}
      {connections.map(([a, b], i) => {
        if (!stars[a] || !stars[b]) return null
        const isCompleted = status === 'completed' || (status === 'in-progress' && a < completedStars && b < completedStars)
        return (
          <line
            key={`c-${i}`}
            x1={stars[a].x} y1={stars[a].y}
            x2={stars[b].x} y2={stars[b].y}
            stroke={isCompleted ? color : status === 'locked' ? '#1f2937' : `${color}40`}
            strokeWidth={isCompleted ? 1.5 : 0.8}
            strokeOpacity={status === 'locked' ? 0.3 : 0.7}
          />
        )
      })}

      {/* Star dots */}
      {stars.map((s, i) => {
        const isStarCompleted = i < completedStars
        return (
          <circle
            key={`s-${i}`}
            cx={s.x} cy={s.y}
            r={isStarCompleted ? starRadius + 1 : starRadius}
            fill={isStarCompleted ? color : status === 'locked' ? '#1f2937' : `${color}80`}
            stroke={isStarCompleted ? color : 'none'}
            strokeWidth={0.5}
            filter={isStarCompleted && status !== 'locked' ? `url(#${glowId})` : undefined}
          />
        )
      })}

      {/* Progress arc */}
      {status !== 'locked' && mastery > 0 && (
        <path
          d={describeArc(cx, cy, r + 8, 0, arcAngle)}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
          strokeLinecap="round"
          opacity={0.8}
        />
      )}

      {/* Background arc track */}
      {status !== 'locked' && (
        <circle
          cx={cx} cy={cy} r={r + 8}
          fill="none"
          stroke={status === 'locked' ? '#1f2937' : `${color}15`}
          strokeWidth={1}
        />
      )}

      {/* Status icon */}
      {status === 'locked' && (
        <g transform={`translate(${cx - 5}, ${cy - r - 18})`}>
          <rect x={0} y={0} width={10} height={10} rx={2} fill="#1f2937" stroke="#374151" strokeWidth={0.5} />
          <text x={5} y={8} textAnchor="middle" fill="#4b5563" fontSize={7}>🔒</text>
        </g>
      )}
      {status === 'completed' && (
        <circle cx={cx + r + 2} cy={cy - r - 2} r={6} fill="#059669" stroke="#34d399" strokeWidth={1}>
          <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      )}

      {/* Constellation name */}
      <text
        x={cx} y={cy + r + 26}
        textAnchor="middle"
        fill={status === 'locked'
          ? (isDark ? '#4b5563' : '#9ca3af')
          : (isDark ? '#e5e7eb' : '#1f2937')
        }
        fontSize={12}
        fontWeight="600"
        letterSpacing="0.5"
      >
        {constellation.name}
      </text>

      {/* Mastery % */}
      <text
        x={cx} y={cy + r + 40}
        textAnchor="middle"
        fill={status === 'locked'
          ? (isDark ? '#374151' : '#9ca3af')
          : color
        }
        fontSize={10}
        fontWeight="500"
      >
        {status === 'locked' ? 'Locked' : `${Math.round(mastery * 100)}% Mastery`}
      </text>

      {/* Star count */}
      {status !== 'locked' && (
        <text
          x={cx} y={cy + r + 52}
          textAnchor="middle"
          fill={isDark ? '#6b7280' : '#64748b'}
          fontSize={9}
        >
          {completedStars}/{totalStars} stars
        </text>
      )}

      {/* Pulsing ring for available */}
      {status === 'available' && (
        <circle cx={cx} cy={cy} r={r + 14} fill="none" stroke={color} strokeWidth={1}>
          <animate attributeName="r" from={r + 10} to={r + 22} dur="2s" repeatCount="indefinite" />
          <animate attributeName="stroke-opacity" from="0.4" to="0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

// --- Floating Stats Panel ---

function GalaxyStatsPanel({ galaxy, galaxyConstellations, getConstellationProgress, isDark }) {
  const totalStars = galaxyConstellations.reduce((s, c) => s + c.totalStars, 0)
  const completedStars = galaxyConstellations.reduce((s, c) => {
    return s + getConstellationProgress(c.id).completedStars
  }, 0)
  const mastery = totalStars > 0 ? Math.round((completedStars / totalStars) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className={`absolute top-20 right-4 sm:right-8 z-20 rounded-2xl border p-4 backdrop-blur-md ${
        isDark ? '' : 'shadow-lg'
      }`}
      style={{
        borderColor: `${galaxy.colors.primary}25`,
        background: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.9)',
        minWidth: 180,
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <GalaxyIcon icon={galaxy.icon} size={16} />
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: galaxy.colors.primary }}>
          {galaxy.subject}
        </span>
      </div>

      <div className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-800'}`}>{mastery}%</div>
      <div className={`text-xs mb-3 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>Overall Mastery</div>

      <div className={`h-1.5 rounded-full overflow-hidden mb-3 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${galaxy.colors.primary}, ${galaxy.colors.accent || galaxy.colors.secondary})` }}
          initial={{ width: 0 }}
          animate={{ width: `${mastery}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.8 }}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
          <Star className="w-3 h-3" style={{ color: galaxy.colors.primary }} />
          <span>{completedStars}/{totalStars}</span>
        </div>
        <div className={`flex items-center gap-1.5 ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
          <Target className="w-3 h-3 text-blue-400" />
          <span>{galaxyConstellations.length} regions</span>
        </div>
      </div>
    </motion.div>
  )
}

// --- Background Stars (random decorative) ---

function BackgroundStars({ count = 120, color = '#fff' }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      cx: Math.random() * 1000,
      cy: Math.random() * 700,
      r: Math.random() * 1.2 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      delay: Math.random() * 5,
    }))
  }, [count])

  return (
    <>
      {stars.map((s, i) => (
        <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={color} opacity={s.opacity}>
          <animate
            attributeName="opacity"
            values={`${s.opacity};${s.opacity * 2.5};${s.opacity}`}
            dur={`${3 + Math.random() * 4}s`}
            begin={`${s.delay}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </>
  )
}

// --- Main Component ---

export default function GalaxyView() {
  const { galaxyId } = useParams()
  const navigate = useNavigate()
  const { getConstellationProgress, isConstellationUnlocked } = useProgressStore()
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'
  const [hoveredId, setHoveredId] = useState(null)

  const galaxy = galaxies.find((g) => g.id === galaxyId)

  const galaxyConstellations = useMemo(() => {
    if (!galaxy) return []
    return galaxy.constellationIds
      .map((cId) => constellations.find((c) => c.id === cId))
      .filter(Boolean)
      .sort((a, b) => a.order - b.order)
  }, [galaxy])

  if (!galaxy) {
    return (
      <div className="relative min-h-screen">
        <SpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white/60 mb-4">Galaxy Not Found</h1>
            <button
              onClick={() => navigate('/antaryaan')}
              className="text-sm text-white/40 hover:text-white/60 underline transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // SVG dimensions
  const svgW = 1000
  const svgH = 700
  const clusterR = 55

  const handleSelectConstellation = (id) => {
    navigate(`/antaryaan/constellation/${id}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <SpaceBackground />

      {/* Galaxy-specific nebula glow */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 30% 35%, ${galaxy.colors.primary}12 0%, transparent 70%),
            radial-gradient(ellipse 50% 35% at 70% 60%, ${galaxy.colors.secondary}08 0%, transparent 70%)
          `,
        }}
      />

      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-5 left-4 sm:left-8 z-20"
      >
        <button
          onClick={() => navigate('/antaryaan')}
          className={`flex items-center gap-2 text-sm transition-colors backdrop-blur-sm rounded-lg px-3 py-2 ${
            isDark
              ? 'text-white/40 hover:text-white/70 bg-black/30'
              : 'text-slate-600 hover:text-slate-800 bg-white/70 shadow-sm'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </button>
      </motion.div>

      {/* Galaxy title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-center"
      >
        <h1
          className="text-xl sm:text-2xl font-extrabold"
          style={{
            background: `linear-gradient(135deg, ${galaxy.colors.primary}, ${galaxy.colors.accent || galaxy.colors.secondary})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {galaxy.name}
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/35' : 'text-slate-500'}`}>{galaxy.weightage}</p>
      </motion.div>

      {/* Stats panel */}
      <GalaxyStatsPanel
        galaxy={galaxy}
        galaxyConstellations={galaxyConstellations}
        getConstellationProgress={getConstellationProgress}
        isDark={isDark}
      />

      {/* Main SVG Constellation Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full h-screen flex items-center justify-center pt-16"
      >
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-w-5xl"
          style={{ maxHeight: 'calc(100vh - 80px)' }}
        >
          {/* Background stars */}
          <BackgroundStars count={150} color={galaxy.colors.primary + '40'} />
          <BackgroundStars count={80} />

          {/* Inter-constellation connection paths */}
          {galaxyConstellations.map((c, i) => {
            if (i === 0) return null
            const prev = galaxyConstellations[i - 1]
            if (!prev.galaxyPosition || !c.galaxyPosition) return null
            const x1 = prev.galaxyPosition.x * svgW
            const y1 = prev.galaxyPosition.y * svgH
            const x2 = c.galaxyPosition.x * svgW
            const y2 = c.galaxyPosition.y * svgH
            const midX = (x1 + x2) / 2
            const midY = (y1 + y2) / 2 - 30

            const prevProgress = getConstellationProgress(prev.id)
            const isPathCompleted = prevProgress.completedStars >= prev.totalStars

            return (
              <g key={`path-${i}`}>
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={isPathCompleted ? `${galaxy.colors.primary}50` : '#1f293720'}
                  strokeWidth={isPathCompleted ? 1.5 : 1}
                  strokeDasharray={isPathCompleted ? 'none' : '6 4'}
                />
                {/* Traveling particle on completed paths */}
                {isPathCompleted && (
                  <circle r={2} fill={galaxy.colors.primary} opacity={0.7}>
                    <animateMotion
                      dur="4s"
                      repeatCount="indefinite"
                      path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    />
                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" />
                  </circle>
                )}
              </g>
            )
          })}

          {/* Constellation clusters */}
          {galaxyConstellations.map((c) => {
            if (!c.galaxyPosition) return null
            const progress = getConstellationProgress(c.id)
            const unlocked = isConstellationUnlocked(c.id, c.prerequisites)

            return (
              <ConstellationCluster
                key={c.id}
                constellation={c}
                progress={progress}
                isUnlocked={unlocked}
                galaxy={galaxy}
                cx={c.galaxyPosition.x * svgW}
                cy={c.galaxyPosition.y * svgH}
                clusterRadius={clusterR}
                onSelect={handleSelectConstellation}
                isHovered={hoveredId === c.id}
                onHover={setHoveredId}
                isDark={isDark}
              />
            )
          })}
        </svg>
      </motion.div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredId && (() => {
          const c = galaxyConstellations.find((x) => x.id === hoveredId)
          if (!c) return null
          const progress = getConstellationProgress(c.id)
          return (
            <motion.div
              key="tooltip"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 rounded-xl border p-4 backdrop-blur-md ${
                isDark ? '' : 'shadow-lg'
              }`}
              style={{
                borderColor: `${c.colors.primary}30`,
                background: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.95)',
                minWidth: 280,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${c.colors.primary}20` }}
                >
                  <Sparkles className="w-5 h-5" style={{ color: c.colors.primary }} />
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{c.name}</h3>
                  <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-500'}`}>{c.description}</p>
                </div>
              </div>
              <div className={`flex items-center gap-4 mt-3 text-xs ${isDark ? 'text-white/50' : 'text-slate-600'}`}>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" style={{ color: c.colors.primary }} />
                  {progress.completedStars}/{c.totalStars} stars
                </span>
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  {c.totalXP} XP
                </span>
                <span>{c.estimatedDuration}</span>
              </div>
            </motion.div>
          )
        })()}
      </AnimatePresence>
    </div>
  )
}
