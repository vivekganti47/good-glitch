import { useMemo, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Star, Lock, CheckCircle2, ChevronRight,
  Target, Zap, Clock, Globe, Swords, Sparkles, Rocket, Circle
} from 'lucide-react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import useProgressStore from '../stores/progressStore'
import useThemeStore from '../stores/themeStore'
import { galaxies } from '../data/galaxies'
import { constellations } from '../data/constellations'
import SpaceBackground from '../components/common/SpaceBackground'

// Mastery color constants
const MASTERY_COLORS = {
  mastered: '#10B981',    // emerald
  practicing: '#F59E0B',  // amber
  needsFocus: '#EF4444',  // red
  notStarted: '#6B7280',  // gray
}

// --- Helpers ---

function getStarStatus(starId, index, constellation, starProgress) {
  const progress = starProgress[starId]
  if (progress?.completed) return 'completed'
  // All stars are available for easy access
  return 'available'
}

function bezierMidpoint(x1, y1, x2, y2) {
  const dx = x2 - x1
  const dy = y2 - y1
  const perpX = -dy * 0.15
  const perpY = dx * 0.15
  return { x: (x1 + x2) / 2 + perpX, y: (y1 + y2) / 2 + perpY }
}

// --- Star Point (SVG) ---

function StarPoint({ x, y, starId, status, color, index, onSelect, isDark }) {
  const displayName = starId.replace(/-/g, ' ')
  const isClickable = status !== 'locked'

  const baseR = status === 'completed' ? 14 : status === 'available' ? 12 : 8
  const glowId = `star-glow-${starId}`

  return (
    <g
      className={isClickable ? 'cursor-pointer' : 'cursor-not-allowed'}
      onClick={() => isClickable && onSelect(starId)}
      style={{ cursor: isClickable ? 'pointer' : 'not-allowed' }}
    >
      <defs>
        <filter id={glowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id={`sg-${starId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={status === 'locked' ? '#374151' : color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={status === 'locked' ? '#374151' : color} stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* Soft glow background */}
      <circle cx={x} cy={y} r={baseR + 12} fill={`url(#sg-${starId})`} />

      {/* Pulsing ring for available */}
      {status === 'available' && (
        <>
          <circle cx={x} cy={y} r={baseR + 4} fill="none" stroke={color} strokeWidth={1}>
            <animate attributeName="r" from={baseR + 2} to={baseR + 16} dur="2s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx={x} cy={y} r={baseR + 4} fill="none" stroke={color} strokeWidth={0.5}>
            <animate attributeName="r" from={baseR + 2} to={baseR + 12} dur="2s" begin="0.5s" repeatCount="indefinite" />
            <animate attributeName="stroke-opacity" from="0.3" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
          </circle>
        </>
      )}

      {/* Main star circle */}
      <circle
        cx={x} cy={y} r={baseR}
        fill={status === 'locked' ? '#1f2937' : status === 'completed' ? color : `${color}30`}
        stroke={status === 'locked' ? '#374151' : color}
        strokeWidth={status === 'completed' ? 2 : 1.5}
        filter={status === 'completed' ? `url(#${glowId})` : undefined}
      />

      {/* Inner highlight */}
      {status !== 'locked' && (
        <circle
          cx={x - baseR * 0.2} cy={y - baseR * 0.2} r={baseR * 0.3}
          fill="white"
          opacity={status === 'completed' ? 0.3 : 0.15}
        />
      )}

      {/* Star number */}
      <text
        x={x} y={y + 4}
        textAnchor="middle"
        fill={status === 'locked' ? '#4b5563' : status === 'completed' ? '#fff' : color}
        fontSize={11}
        fontWeight="bold"
      >
        {index + 1}
      </text>

      {/* Completed badge */}
      {status === 'completed' && (
        <g transform={`translate(${x + baseR - 2}, ${y - baseR + 2})`}>
          <circle r={6} fill="#059669" stroke="#34d399" strokeWidth={1} />
          <text x={0} y={3.5} textAnchor="middle" fill="white" fontSize={8} fontWeight="bold">✓</text>
        </g>
      )}

      {/* Lock icon */}
      {status === 'locked' && (
        <g transform={`translate(${x + baseR - 1}, ${y - baseR + 1})`}>
          <circle r={5} fill="#374151" stroke="#4b5563" strokeWidth={0.5} />
          <text x={0} y={3} textAnchor="middle" fill="#6b7280" fontSize={6}>🔒</text>
        </g>
      )}

      {/* Star name label */}
      <text
        x={x} y={y + baseR + 16}
        textAnchor="middle"
        fill={status === 'locked' ? '#4b5563' : isDark ? '#d1d5db' : '#475569'}
        fontSize={10}
        fontWeight="500"
        className="capitalize"
      >
        {displayName.length > 18 ? displayName.slice(0, 16) + '...' : displayName}
      </text>
    </g>
  )
}

// --- Connection Path ---

function ConnectionPath({ x1, y1, x2, y2, status, color }) {
  const mid = bezierMidpoint(x1, y1, x2, y2)
  const pathD = `M ${x1} ${y1} Q ${mid.x} ${mid.y} ${x2} ${y2}`
  const isCompleted = status === 'completed'

  return (
    <g>
      <path
        d={pathD}
        fill="none"
        stroke={isCompleted ? color : '#1f293740'}
        strokeWidth={isCompleted ? 2 : 1}
        strokeDasharray={isCompleted ? 'none' : '5 4'}
        strokeOpacity={isCompleted ? 0.6 : 0.4}
      />
      {/* Traveling particle on completed paths */}
      {isCompleted && (
        <circle r={2.5} fill={color} opacity={0.8}>
          <animateMotion dur="3s" repeatCount="indefinite" path={pathD} />
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
          <animate attributeName="r" values="1.5;3;1.5" dur="3s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

// --- Background Stars ---

function MapStars({ count = 100, isDark }) {
  const stars = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      cx: Math.random() * 900,
      cy: Math.random() * 600,
      r: Math.random() * 1 + 0.2,
      opacity: Math.random() * 0.3 + 0.05,
    }))
  }, [count])

  return (
    <>
      {stars.map((s, i) => (
        <circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill={isDark ? '#fff' : '#64748B'}
          opacity={isDark ? s.opacity : s.opacity * 0.5}
        >
          <animate
            attributeName="opacity"
            values={`${s.opacity};${s.opacity * 2};${s.opacity}`}
            dur={`${3 + Math.random() * 4}s`}
            begin={`${Math.random() * 5}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </>
  )
}

// --- Practice Zone Node ---

function PracticeZoneCard({ planetId, constellation, galaxy, planetProgress, navigate, isDark }) {
  const progress = planetProgress[planetId]
  const completed = progress?.completed
  const displayName = planetId.replace(/-/g, ' ')

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/antaryaan/planet/${constellation.id}/${planetId}`)}
      className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all"
      style={{
        borderColor: completed
          ? 'rgba(96, 165, 250, 0.3)'
          : isDark ? 'rgba(96, 165, 250, 0.12)' : 'rgba(96, 165, 250, 0.25)',
        background: completed
          ? isDark
            ? 'linear-gradient(135deg, rgba(96, 165, 250, 0.06) 0%, transparent 100%)'
            : 'linear-gradient(135deg, rgba(96, 165, 250, 0.1) 0%, rgba(255,255,255,0.8) 100%)'
          : isDark
            ? 'rgba(255,255,255,0.02)'
            : 'rgba(255,255,255,0.8)',
      }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: completed ? 'rgba(96, 165, 250, 0.2)' : 'rgba(96, 165, 250, 0.08)' }}
      >
        <Globe className="w-4 h-4 text-blue-500" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] uppercase tracking-wider font-medium ${
          isDark ? 'text-blue-400/60' : 'text-blue-500/70'
        }`}>Practice Zone</span>
        <h4 className={`font-medium text-xs capitalize truncate ${
          isDark ? 'text-white' : 'text-slate-800'
        }`}>{displayName}</h4>
      </div>
      {completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-blue-400/30' : 'text-blue-500/40'}`} />
    </motion.div>
  )
}

// --- Quest Card ---

function QuestCard({ questId, constellation, questProgress, navigate, isDark }) {
  const progress = questProgress[questId]
  const completed = progress?.completed
  const displayName = questId.replace(/-/g, ' ')

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/antaryaan/quest/${constellation.id}/${questId}`)}
      className="flex items-center gap-3 rounded-xl border p-3 cursor-pointer"
      style={{
        borderColor: completed
          ? 'rgba(168, 85, 247, 0.3)'
          : isDark ? 'rgba(168, 85, 247, 0.15)' : 'rgba(168, 85, 247, 0.25)',
        background: isDark
          ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, transparent 100%)'
          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(255,255,255,0.8) 100%)',
      }}
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
        isDark ? 'bg-purple-500/12' : 'bg-purple-500/15'
      }`}>
        <Swords className="w-4 h-4 text-purple-500" />
      </div>
      <div className="flex-1 min-w-0">
        <span className={`text-[10px] uppercase tracking-wider font-bold ${
          isDark ? 'text-purple-400/70' : 'text-purple-500/80'
        }`}>Side Quest</span>
        <h4 className={`font-medium text-xs capitalize truncate ${
          isDark ? 'text-white' : 'text-slate-800'
        }`}>{displayName}</h4>
      </div>
      {completed && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-purple-400/30' : 'text-purple-500/40'}`} />
    </motion.div>
  )
}

// --- Main Component ---

export default function ConstellationView() {
  const { constellationId } = useParams()
  const navigate = useNavigate()
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'
  const { starProgress, planetProgress, questProgress, getConstellationProgress, getMasteryColor, getMasteryStatus } = useProgressStore()

  const constellation = constellations.find((c) => c.id === constellationId)
  const galaxy = constellation ? galaxies.find((g) => g.id === constellation.galaxyId) : null

  const progress = useMemo(() => {
    if (!constellation) return null
    return getConstellationProgress(constellation.id)
  }, [constellation, getConstellationProgress])

  // Calculate mastery breakdown for this constellation's concepts
  const masteryBreakdown = useMemo(() => {
    if (!constellation) return { mastered: 0, practicing: 0, needsFocus: 0, total: 0 }

    const concepts = constellation.concepts || []
    let mastered = 0
    let practicing = 0
    let needsFocus = 0

    concepts.forEach((conceptId) => {
      const status = getMasteryStatus(conceptId)
      if (status === 'mastered') mastered++
      else if (status === 'practicing') practicing++
      else needsFocus++
    })

    return {
      mastered,
      practicing,
      needsFocus,
      total: concepts.length,
    }
  }, [constellation, getMasteryStatus])

  if (!constellation || !galaxy) {
    return (
      <div className="relative min-h-screen">
        <SpaceBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
              Constellation Not Found
            </h1>
            <Link
              to="/antaryaan"
              className={`text-sm underline transition-colors ${
                isDark ? 'text-white/40 hover:text-white/60' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const mastery = constellation.totalStars > 0
    ? Math.round(((progress?.completedStars || 0) / constellation.totalStars) * 100)
    : 0

  // SVG layout
  const svgW = 900
  const svgH = 600
  const padding = 60
  const starPositions = constellation.starPositions || []
  const connections = constellation.connections || []

  // Map normalized positions to SVG coordinates
  const mappedStars = starPositions.map((sp) => ({
    x: padding + sp.x * (svgW - padding * 2),
    y: padding + sp.y * (svgH - padding * 2),
  }))

  const handleStarSelect = (starId) => {
    navigate(`/antaryaan/star/${constellation.id}/${starId}`)
  }

  return (
    <div className="relative min-h-screen">
      <SpaceBackground />

      {/* Constellation-themed ambient glow */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          opacity: isDark ? 0.2 : 0.1,
          background: `radial-gradient(ellipse 60% 45% at 50% 40%, ${constellation.colors.primary}20 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-20 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-5"
        >
          {/* --- Header --- */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <button
                onClick={() => navigate(`/antaryaan/galaxy/${galaxy.id}`)}
                className={`flex items-center gap-2 text-xs transition-colors mb-3 ${
                  isDark ? 'text-white/40 hover:text-white/70' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to {galaxy.name}
              </button>

              <div
                className="text-xs font-semibold uppercase tracking-wider mb-1"
                style={{ color: constellation.colors.primary }}
              >
                {galaxy.subject} &middot; Constellation {constellation.order}
              </div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold"
                style={{
                  background: `linear-gradient(135deg, ${constellation.colors.primary}, ${constellation.colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {constellation.name}
              </h1>
              <p className={`text-xs mt-1 max-w-lg ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                {constellation.description}
              </p>
            </div>

            {/* Mastery badges */}
            <div className="shrink-0 flex gap-2">
              {/* Mastery percentage */}
              <div
                className="rounded-xl border p-3 text-center min-w-[80px]"
                style={{
                  borderColor: `${constellation.colors.primary}25`,
                  background: isDark
                    ? `linear-gradient(135deg, ${constellation.colors.primary}08 0%, transparent 100%)`
                    : `linear-gradient(135deg, ${constellation.colors.primary}10 0%, rgba(255,255,255,0.8) 100%)`,
                }}
              >
                <div className="text-xl font-bold" style={{ color: constellation.colors.primary }}>
                  {mastery}%
                </div>
                <div className={`text-[10px] ${isDark ? 'text-white/35' : 'text-slate-500'}`}>Progress</div>
                <div className={`h-1 rounded-full overflow-hidden mt-2 ${isDark ? 'bg-white/8' : 'bg-slate-200'}`}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${constellation.colors.primary}, ${constellation.colors.secondary})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${mastery}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>

              {/* Concept mastery breakdown */}
              <div
                className="rounded-xl border p-3 min-w-[120px]"
                style={{
                  borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                  background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                }}
              >
                <div className={`text-[10px] mb-2 ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
                  Concept Mastery
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Circle className="w-3 h-3 fill-emerald-500 text-emerald-500" />
                    <span className="text-xs font-bold text-emerald-500">{masteryBreakdown.mastered}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="w-3 h-3 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold text-amber-500">{masteryBreakdown.practicing}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Circle className="w-3 h-3 fill-red-500 text-red-500" />
                    <span className="text-xs font-bold text-red-500">{masteryBreakdown.needsFocus}</span>
                  </div>
                </div>
                {/* Mini progress bar */}
                <div className={`h-1 rounded-full overflow-hidden mt-2 flex ${isDark ? 'bg-white/8' : 'bg-slate-200'}`}>
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${(masteryBreakdown.mastered / masteryBreakdown.total) * 100}%` }}
                  />
                  <div
                    className="h-full bg-amber-500"
                    style={{ width: `${(masteryBreakdown.practicing / masteryBreakdown.total) * 100}%` }}
                  />
                  <div
                    className="h-full bg-red-500"
                    style={{ width: `${(masteryBreakdown.needsFocus / masteryBreakdown.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- Star Map SVG --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative w-full rounded-2xl border overflow-hidden"
            style={{
              borderColor: `${constellation.colors.primary}15`,
              background: isDark
                ? 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%)'
                : 'linear-gradient(180deg, rgba(241,245,249,0.9) 0%, rgba(226,232,240,0.9) 100%)',
            }}
          >
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              preserveAspectRatio="xMidYMid meet"
              className="block w-full"
              style={{ minHeight: 320 }}
            >
              {/* Background stars */}
              <MapStars count={120} isDark={isDark} />

              {/* Nebula glow in center */}
              <defs>
                <radialGradient id="map-nebula" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={constellation.colors.primary} stopOpacity={isDark ? 0.06 : 0.1} />
                  <stop offset="100%" stopColor={constellation.colors.primary} stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx={svgW / 2} cy={svgH / 2} rx={300} ry={200} fill="url(#map-nebula)" />

              {/* Connection paths */}
              {connections.map(([a, b], i) => {
                if (!mappedStars[a] || !mappedStars[b]) return null
                const starAStatus = getStarStatus(constellation.starIds[a], a, constellation, starProgress)
                const starBStatus = getStarStatus(constellation.starIds[b], b, constellation, starProgress)
                const connectionStatus = (starAStatus === 'completed' && starBStatus === 'completed')
                  ? 'completed'
                  : (starAStatus === 'completed' || starBStatus === 'completed') ? 'partial' : 'locked'

                return (
                  <ConnectionPath
                    key={`conn-${i}`}
                    x1={mappedStars[a].x} y1={mappedStars[a].y}
                    x2={mappedStars[b].x} y2={mappedStars[b].y}
                    status={connectionStatus === 'completed' ? 'completed' : 'locked'}
                    color={constellation.colors.primary}
                  />
                )
              })}

              {/* Star nodes */}
              {constellation.starIds.map((starId, index) => {
                if (!mappedStars[index]) return null
                const status = getStarStatus(starId, index, constellation, starProgress)
                return (
                  <StarPoint
                    key={starId}
                    x={mappedStars[index].x}
                    y={mappedStars[index].y}
                    starId={starId}
                    status={status}
                    color={constellation.colors.primary}
                    index={index}
                    onSelect={(sid) => handleStarSelect(sid)}
                    isDark={isDark}
                  />
                )
              })}

              {/* Legend */}
              <g transform={`translate(${svgW - 180}, ${svgH - 80})`}>
                <rect
                  x={-8} y={-8} width={176} height={76} rx={8}
                  fill={isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.85)'}
                  stroke={isDark ? 'transparent' : 'rgba(0,0,0,0.08)'}
                  strokeWidth={1}
                />
                <text x={0} y={8} fill={isDark ? '#6b7280' : '#64748b'} fontSize={8} fontWeight="600">MASTERY</text>
                <circle cx={8} cy={24} r={5} fill="#10B981" />
                <text x={20} y={28} fill={isDark ? '#9ca3af' : '#64748b'} fontSize={9}>Mastered</text>
                <circle cx={80} cy={24} r={5} fill="#F59E0B" />
                <text x={92} y={28} fill={isDark ? '#9ca3af' : '#64748b'} fontSize={9}>Practicing</text>
                <circle cx={8} cy={44} r={5} fill="#EF4444" />
                <text x={20} y={48} fill={isDark ? '#9ca3af' : '#64748b'} fontSize={9}>Needs Focus</text>
                <circle cx={80} cy={44} r={4} fill={isDark ? '#1f2937' : '#e2e8f0'} stroke={isDark ? '#374151' : '#cbd5e1'} strokeWidth={1} />
                <text x={92} y={48} fill={isDark ? '#9ca3af' : '#64748b'} fontSize={9}>Not Started</text>
              </g>
            </svg>

            {/* Click to start overlay for first star */}
            {mastery === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm"
                style={{
                  background: isDark ? `${constellation.colors.primary}15` : `${constellation.colors.primary}20`,
                  border: `1px solid ${constellation.colors.primary}30`,
                }}
              >
                <Rocket className="w-4 h-4" style={{ color: constellation.colors.primary }} />
                <span className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-700'}`}>
                  Click the first star to begin your journey
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* --- Stats Row --- */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Stars', value: `${progress?.completedStars || 0}/${constellation.totalStars}`, icon: Star, color: constellation.colors.primary },
              { label: 'Practice', value: `${progress?.completedPlanets || 0}/${constellation.totalPlanets}`, icon: Target, color: '#60a5fa' },
              { label: 'XP', value: `${constellation.totalXP}`, icon: Zap, color: '#fbbf24' },
              { label: 'Time', value: constellation.estimatedDuration, icon: Clock, color: '#94a3b8' },
            ].map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border p-2.5 text-center"
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
                    background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: stat.color }} />
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {stat.value}
                  </div>
                  <div className={`text-[10px] ${isDark ? 'text-white/30' : 'text-slate-500'}`}>
                    {stat.label}
                  </div>
                </div>
              )
            })}
          </div>

          {/* --- Narrative --- */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-xl border p-4"
            style={{
              borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
              background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.8)',
            }}
          >
            <p className={`text-xs leading-relaxed italic ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              &ldquo;{constellation.narrative}&rdquo;
            </p>
          </motion.div>

          {/* --- Practice Zones --- */}
          <div>
            <h3 className={`text-sm font-bold mb-2 flex items-center gap-2 ${
              isDark ? 'text-white/60' : 'text-slate-600'
            }`}>
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              Practice Zones
            </h3>
            <div className="space-y-2">
              {constellation.planetIds.map((pid) => (
                <PracticeZoneCard
                  key={pid}
                  planetId={pid}
                  constellation={constellation}
                  galaxy={galaxy}
                  planetProgress={planetProgress}
                  navigate={navigate}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>

          {/* --- Side Quest --- */}
          {constellation.questId && (
            <div>
              <h3 className={`text-sm font-bold mb-2 flex items-center gap-2 ${
                isDark ? 'text-white/60' : 'text-slate-600'
              }`}>
                <Swords className="w-3.5 h-3.5 text-purple-500" />
                Side Quest
              </h3>
              <QuestCard
                questId={constellation.questId}
                constellation={constellation}
                questProgress={questProgress}
                navigate={navigate}
                isDark={isDark}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
