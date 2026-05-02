import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Check, Zap } from 'lucide-react'

/**
 * MotionGrapher - Watch a spaceship move, then draw the matching velocity-time graph.
 *
 * Top panel: Canvas showing a spaceship moving along a horizontal track.
 * Bottom panel: SVG graph grid where the player clicks to place waypoints
 * forming a piecewise-linear v-t function, then checks against the correct answer.
 */

const G = 10 // m/s^2 gravity constant (unused here but consistent across games)
const SAMPLE_INTERVAL = 0.5 // seconds between validation sample points
const PERFECT_THRESHOLD = 0.05
const GOOD_THRESHOLD = 0.15
const PERFECT_XP = 20
const GOOD_XP = 15
const PARTIAL_XP = 10

// --- Helpers ---

function buildMotionProfile(motionSegments) {
  // Build arrays of (time, velocity) keypoints from the motion config
  const keypoints = [{ t: 0, v: motionSegments[0]?.type === 'constant' ? motionSegments[0].v : 0 }]
  let t = 0
  let v = keypoints[0].v

  for (const seg of motionSegments) {
    if (seg.type === 'constant') {
      v = seg.v
      t += seg.duration
      keypoints.push({ t, v })
    } else if (seg.type === 'accelerate') {
      const vEnd = v + seg.a * seg.duration
      t += seg.duration
      v = vEnd
      keypoints.push({ t, v })
    } else if (seg.type === 'decelerate') {
      const a = seg.a !== undefined ? -Math.abs(seg.a) : -Math.abs(seg.decel || 2)
      const vEnd = Math.max(0, v + a * seg.duration)
      t += seg.duration
      v = vEnd
      keypoints.push({ t, v })
    }
  }

  return keypoints
}

function sampleVelocityAt(keypoints, time) {
  if (time <= keypoints[0].t) return keypoints[0].v
  if (time >= keypoints[keypoints.length - 1].t) return keypoints[keypoints.length - 1].v

  for (let i = 0; i < keypoints.length - 1; i++) {
    const a = keypoints[i]
    const b = keypoints[i + 1]
    if (time >= a.t && time <= b.t) {
      const frac = (time - a.t) / (b.t - a.t)
      return a.v + frac * (b.v - a.v)
    }
  }
  return 0
}

function computePositionAt(keypoints, time) {
  let pos = 0
  let prevT = keypoints[0].t
  let prevV = keypoints[0].v

  for (let i = 1; i < keypoints.length; i++) {
    const currT = keypoints[i].t
    const currV = keypoints[i].v
    if (time <= currT) {
      const dt = time - prevT
      const avgV = prevV + (currV - prevV) * (dt / (currT - prevT)) * 0.5
      pos += ((prevV + (prevV + (currV - prevV) * (dt / (currT - prevT)))) / 2) * dt
      return pos
    }
    const segDt = currT - prevT
    pos += ((prevV + currV) / 2) * segDt
    prevT = currT
    prevV = currV
  }
  // Past the end: constant velocity
  const lastV = keypoints[keypoints.length - 1].v
  const lastT = keypoints[keypoints.length - 1].t
  pos += lastV * (time - lastT)
  return pos
}

// --- Ship Canvas ---

function ShipCanvas({ motionKeypoints, totalDuration, isPlaying, elapsedTime, containerWidth }) {
  const canvasRef = useRef(null)
  const rafRef = useRef(null)

  const canvasWidth = containerWidth || 600
  const canvasHeight = 120

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(canvasWidth * dpr)
    canvas.height = Math.round(canvasHeight * dpr)
    canvas.style.width = `${canvasWidth}px`
    canvas.style.height = `${canvasHeight}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const maxPos = computePositionAt(motionKeypoints, totalDuration)
    const trackMargin = 60
    const trackLen = canvasWidth - trackMargin * 2

    // Clear
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Background
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Stars
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)'
    for (let i = 0; i < 30; i++) {
      const sx = (i * 137.5) % canvasWidth
      const sy = (i * 73.7) % canvasHeight
      ctx.beginPath()
      ctx.arc(sx, sy, 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // Track line
    const trackY = canvasHeight * 0.65
    ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)'
    ctx.lineWidth = 2
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(trackMargin, trackY)
    ctx.lineTo(canvasWidth - trackMargin, trackY)
    ctx.stroke()
    ctx.setLineDash([])

    // Track start/end markers
    ctx.fillStyle = 'rgba(99, 102, 241, 0.5)'
    ctx.fillRect(trackMargin - 2, trackY - 12, 4, 24)
    ctx.fillRect(canvasWidth - trackMargin - 2, trackY - 12, 4, 24)

    // Distance markers
    ctx.fillStyle = 'rgba(148, 163, 184, 0.2)'
    ctx.font = '9px monospace'
    ctx.textAlign = 'center'
    for (let i = 0; i <= 10; i++) {
      const mx = trackMargin + (i / 10) * trackLen
      ctx.fillRect(mx, trackY + 8, 1, 4)
    }

    // Ship position
    const currentPos = computePositionAt(motionKeypoints, elapsedTime)
    const shipFrac = maxPos > 0 ? Math.min(1, currentPos / maxPos) : 0
    const shipX = trackMargin + shipFrac * trackLen

    // Velocity for flame size
    const currentV = sampleVelocityAt(motionKeypoints, elapsedTime)
    const maxV = Math.max(...motionKeypoints.map(k => k.v), 1)
    const vFrac = currentV / maxV

    // Engine flame
    if (isPlaying && currentV > 0) {
      const flameLen = 8 + vFrac * 18
      const gradient = ctx.createLinearGradient(shipX - 14 - flameLen, trackY, shipX - 14, trackY)
      gradient.addColorStop(0, 'rgba(251, 146, 60, 0)')
      gradient.addColorStop(0.5, 'rgba(251, 146, 60, 0.6)')
      gradient.addColorStop(1, 'rgba(234, 179, 8, 0.9)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(shipX - 14, trackY - 4)
      ctx.lineTo(shipX - 14 - flameLen, trackY)
      ctx.lineTo(shipX - 14, trackY + 4)
      ctx.closePath()
      ctx.fill()
    }

    // Ship (triangle pointing right)
    ctx.fillStyle = '#818cf8'
    ctx.beginPath()
    ctx.moveTo(shipX + 14, trackY)
    ctx.lineTo(shipX - 10, trackY - 8)
    ctx.lineTo(shipX - 10, trackY + 8)
    ctx.closePath()
    ctx.fill()

    // Ship glow
    ctx.shadowColor = '#6366f1'
    ctx.shadowBlur = 12
    ctx.fillStyle = '#a5b4fc'
    ctx.beginPath()
    ctx.arc(shipX + 2, trackY, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0

    // Time display
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`t = ${elapsedTime.toFixed(1)}s`, 12, 18)

    // Velocity display
    ctx.fillStyle = '#a5b4fc'
    ctx.fillText(`v = ${currentV.toFixed(1)} m/s`, 12, 32)
  }, [motionKeypoints, totalDuration, isPlaying, elapsedTime, canvasWidth])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full rounded-t-lg"
      style={{ height: canvasHeight }}
    />
  )
}

// --- Graph SVG ---

const GRAPH_PADDING = { top: 20, right: 20, bottom: 35, left: 45 }

function GraphSVG({
  totalDuration,
  maxVelocity,
  waypoints,
  setWaypoints,
  correctKeypoints,
  showCorrect,
  checked,
  svgWidth,
  svgHeight,
  disabled,
}) {
  const [draggingIdx, setDraggingIdx] = useState(null)
  const svgRef = useRef(null)

  const plotW = svgWidth - GRAPH_PADDING.left - GRAPH_PADDING.right
  const plotH = svgHeight - GRAPH_PADDING.top - GRAPH_PADDING.bottom

  const tToX = useCallback((t) => GRAPH_PADDING.left + (t / totalDuration) * plotW, [totalDuration, plotW])
  const vToY = useCallback((v) => GRAPH_PADDING.top + plotH - (v / maxVelocity) * plotH, [maxVelocity, plotH])
  const xToT = useCallback((x) => Math.max(0, Math.min(totalDuration, ((x - GRAPH_PADDING.left) / plotW) * totalDuration)), [totalDuration, plotW])
  const yToV = useCallback((y) => Math.max(0, Math.min(maxVelocity, ((GRAPH_PADDING.top + plotH - y) / plotH) * maxVelocity)), [maxVelocity, plotH])

  // Grid lines
  const tGridLines = useMemo(() => {
    const lines = []
    const step = totalDuration <= 8 ? 1 : 2
    for (let t = 0; t <= totalDuration; t += step) {
      lines.push(t)
    }
    return lines
  }, [totalDuration])

  const vGridLines = useMemo(() => {
    const lines = []
    const step = maxVelocity <= 10 ? 2 : maxVelocity <= 20 ? 5 : 10
    for (let v = 0; v <= maxVelocity; v += step) {
      lines.push(v)
    }
    return lines
  }, [maxVelocity])

  const getSVGCoords = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { t: 0, v: 0 }
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const scaleX = svgWidth / rect.width
    const scaleY = svgHeight / rect.height
    const x = (clientX - rect.left) * scaleX
    const y = (clientY - rect.top) * scaleY
    return { t: xToT(x), v: yToV(y) }
  }, [svgWidth, svgHeight, xToT, yToV])

  const handleClick = useCallback((e) => {
    if (disabled || checked) return
    if (draggingIdx !== null) return

    const { t, v } = getSVGCoords(e)

    // Check if clicking near an existing waypoint (to avoid accidental duplicates)
    const nearExisting = waypoints.some(wp =>
      Math.abs(wp.t - t) < totalDuration * 0.03 && Math.abs(wp.v - v) < maxVelocity * 0.06
    )
    if (nearExisting) return

    const newWaypoints = [...waypoints, { t, v }].sort((a, b) => a.t - b.t)
    setWaypoints(newWaypoints)
  }, [disabled, checked, draggingIdx, getSVGCoords, waypoints, setWaypoints, totalDuration, maxVelocity])

  const handlePointerDown = useCallback((e, idx) => {
    if (disabled || checked) return
    e.stopPropagation()
    setDraggingIdx(idx)
  }, [disabled, checked])

  const handlePointerMove = useCallback((e) => {
    if (draggingIdx === null) return
    e.preventDefault()
    const { t, v } = getSVGCoords(e)
    setWaypoints(prev => {
      const updated = [...prev]
      updated[draggingIdx] = { t, v }
      return updated.sort((a, b) => a.t - b.t)
    })
  }, [draggingIdx, getSVGCoords, setWaypoints])

  const handlePointerUp = useCallback(() => {
    setDraggingIdx(null)
  }, [])

  const handleRightClick = useCallback((e, idx) => {
    if (disabled || checked) return
    e.preventDefault()
    e.stopPropagation()
    setWaypoints(prev => prev.filter((_, i) => i !== idx))
  }, [disabled, checked, setWaypoints])

  // Build waypoint path
  const waypointPath = useMemo(() => {
    if (waypoints.length === 0) return ''
    return waypoints.map((wp, i) => {
      const x = tToX(wp.t)
      const y = vToY(wp.v)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    }).join(' ')
  }, [waypoints, tToX, vToY])

  // Build correct path
  const correctPath = useMemo(() => {
    if (!correctKeypoints || correctKeypoints.length === 0) return ''
    return correctKeypoints.map((kp, i) => {
      const x = tToX(kp.t)
      const y = vToY(kp.v)
      return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    }).join(' ')
  }, [correctKeypoints, tToX, vToY])

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      className="block w-full select-none"
      style={{ cursor: disabled || checked ? 'default' : 'crosshair' }}
      onClick={handleClick}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
    >
      {/* Background */}
      <rect width={svgWidth} height={svgHeight} fill="#0A0E1A" rx="0" />

      {/* Grid */}
      {tGridLines.map(t => (
        <line
          key={`tg-${t}`}
          x1={tToX(t)} y1={GRAPH_PADDING.top}
          x2={tToX(t)} y2={GRAPH_PADDING.top + plotH}
          stroke="rgba(148,163,184,0.08)" strokeWidth="1"
        />
      ))}
      {vGridLines.map(v => (
        <line
          key={`vg-${v}`}
          x1={GRAPH_PADDING.left} y1={vToY(v)}
          x2={GRAPH_PADDING.left + plotW} y2={vToY(v)}
          stroke="rgba(148,163,184,0.08)" strokeWidth="1"
        />
      ))}

      {/* Axes */}
      <line
        x1={GRAPH_PADDING.left} y1={GRAPH_PADDING.top}
        x2={GRAPH_PADDING.left} y2={GRAPH_PADDING.top + plotH}
        stroke="rgba(148,163,184,0.4)" strokeWidth="1.5"
      />
      <line
        x1={GRAPH_PADDING.left} y1={GRAPH_PADDING.top + plotH}
        x2={GRAPH_PADDING.left + plotW} y2={GRAPH_PADDING.top + plotH}
        stroke="rgba(148,163,184,0.4)" strokeWidth="1.5"
      />

      {/* Axis labels */}
      {tGridLines.map(t => (
        <text
          key={`tl-${t}`}
          x={tToX(t)} y={GRAPH_PADDING.top + plotH + 16}
          textAnchor="middle" fill="#64748b" fontSize="10" fontFamily="monospace"
        >
          {t}s
        </text>
      ))}
      {vGridLines.map(v => (
        <text
          key={`vl-${v}`}
          x={GRAPH_PADDING.left - 8} y={vToY(v) + 3}
          textAnchor="end" fill="#64748b" fontSize="10" fontFamily="monospace"
        >
          {v}
        </text>
      ))}

      {/* Axis titles */}
      <text
        x={GRAPH_PADDING.left + plotW / 2} y={svgHeight - 2}
        textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif"
      >
        Time (s)
      </text>
      <text
        x={12} y={GRAPH_PADDING.top + plotH / 2}
        textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="sans-serif"
        transform={`rotate(-90, 12, ${GRAPH_PADDING.top + plotH / 2})`}
      >
        v (m/s)
      </text>

      {/* Correct graph (shown after check) */}
      {showCorrect && correctPath && (
        <path
          d={correctPath}
          fill="none"
          stroke="#22c55e"
          strokeWidth="2.5"
          strokeDasharray="6 3"
          opacity="0.85"
        />
      )}

      {/* Player waypoint lines */}
      {waypointPath && (
        <path
          d={waypointPath}
          fill="none"
          stroke={checked ? (showCorrect ? '#f59e0b' : '#6366f1') : '#818cf8'}
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {/* Waypoint circles */}
      {waypoints.map((wp, i) => (
        <g key={i}>
          {/* Hit area for easier touch */}
          <circle
            cx={tToX(wp.t)} cy={vToY(wp.v)} r="12"
            fill="transparent"
            style={{ cursor: disabled || checked ? 'default' : 'grab' }}
            onPointerDown={(e) => handlePointerDown(e, i)}
            onContextMenu={(e) => handleRightClick(e, i)}
            onTouchStart={(e) => handlePointerDown(e, i)}
          />
          {/* Visible dot */}
          <circle
            cx={tToX(wp.t)} cy={vToY(wp.v)} r="5"
            fill={checked ? '#f59e0b' : '#818cf8'}
            stroke={checked ? '#d97706' : '#4f46e5'}
            strokeWidth="2"
            style={{ pointerEvents: 'none' }}
          />
          {/* Value tooltip on hover - show for dragging */}
          {draggingIdx === i && (
            <text
              x={tToX(wp.t)} y={vToY(wp.v) - 12}
              textAnchor="middle" fill="#e2e8f0" fontSize="9" fontFamily="monospace"
            >
              ({wp.t.toFixed(1)}, {wp.v.toFixed(1)})
            </text>
          )}
        </g>
      ))}

      {/* Correct graph keypoint dots */}
      {showCorrect && correctKeypoints && correctKeypoints.map((kp, i) => (
        <circle
          key={`ck-${i}`}
          cx={tToX(kp.t)} cy={vToY(kp.v)} r="3.5"
          fill="#22c55e" opacity="0.85"
        />
      ))}

      {/* Instructions overlay when no waypoints */}
      {waypoints.length === 0 && !checked && !disabled && (
        <text
          x={GRAPH_PADDING.left + plotW / 2}
          y={GRAPH_PADDING.top + plotH / 2}
          textAnchor="middle" fill="rgba(148,163,184,0.4)" fontSize="13" fontFamily="sans-serif"
        >
          Click to place waypoints on the v-t graph
        </text>
      )}
    </svg>
  )
}

// --- Main Component ---

function MotionGrapher({
  config = {},
  params = {},
  onParamChange,
  onComplete,
  isComplete = false,
  containerWidth = 600,
  containerHeight = 600,
}) {
  const motionSegments = config.motion || [
    { type: 'constant', v: 5, duration: 2 },
    { type: 'accelerate', a: 3, duration: 3 },
    { type: 'constant', v: 14, duration: 2 },
  ]

  const motionKeypoints = useMemo(() => buildMotionProfile(motionSegments), [motionSegments])
  const totalDuration = useMemo(
    () => motionKeypoints[motionKeypoints.length - 1].t,
    [motionKeypoints]
  )
  const maxVelocity = useMemo(
    () => Math.ceil(Math.max(...motionKeypoints.map(k => k.v)) * 1.25),
    [motionKeypoints]
  )

  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [waypoints, setWaypoints] = useState([])
  const [checked, setChecked] = useState(false)
  const [showCorrect, setShowCorrect] = useState(false)
  const [result, setResult] = useState(null) // { score, xp, avgError }
  const [showXP, setShowXP] = useState(false)

  const animStartRef = useRef(null)
  const rafRef = useRef(null)

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return

    animStartRef.current = performance.now() - elapsedTime * 1000

    const tick = (now) => {
      const elapsed = (now - animStartRef.current) / 1000
      if (elapsed >= totalDuration) {
        setElapsedTime(totalDuration)
        setIsPlaying(false)
        setHasPlayed(true)
        return
      }
      setElapsedTime(elapsed)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isPlaying, totalDuration])

  const handlePlay = useCallback(() => {
    setElapsedTime(0)
    setIsPlaying(true)
    setChecked(false)
    setShowCorrect(false)
    setResult(null)
    setShowXP(false)
  }, [])

  const handleReset = useCallback(() => {
    setWaypoints([])
    setChecked(false)
    setShowCorrect(false)
    setResult(null)
    setShowXP(false)
  }, [])

  const handleCheck = useCallback(() => {
    if (waypoints.length < 2) return

    // Sample at SAMPLE_INTERVAL intervals
    const sampleCount = Math.floor(totalDuration / SAMPLE_INTERVAL) + 1
    let totalError = 0
    let maxError = 0

    // Build learner function from waypoints
    const learnerV = (t) => {
      if (waypoints.length === 0) return 0
      if (t <= waypoints[0].t) return waypoints[0].v
      if (t >= waypoints[waypoints.length - 1].t) return waypoints[waypoints.length - 1].v
      for (let i = 0; i < waypoints.length - 1; i++) {
        if (t >= waypoints[i].t && t <= waypoints[i + 1].t) {
          const frac = (t - waypoints[i].t) / (waypoints[i + 1].t - waypoints[i].t)
          return waypoints[i].v + frac * (waypoints[i + 1].v - waypoints[i].v)
        }
      }
      return 0
    }

    for (let i = 0; i < sampleCount; i++) {
      const t = i * SAMPLE_INTERVAL
      const correctV = sampleVelocityAt(motionKeypoints, t)
      const playerV = learnerV(t)
      const range = maxVelocity || 1
      const error = Math.abs(correctV - playerV) / range
      totalError += error
      maxError = Math.max(maxError, error)
    }

    const avgError = totalError / sampleCount

    let score, xp
    if (avgError < PERFECT_THRESHOLD) {
      score = 'perfect'
      xp = PERFECT_XP
    } else if (avgError < GOOD_THRESHOLD) {
      score = 'good'
      xp = GOOD_XP
    } else {
      score = 'partial'
      xp = PARTIAL_XP
    }

    setResult({ score, xp, avgError })
    setChecked(true)
    setShowCorrect(true)
    setShowXP(true)

    if (onComplete && !isComplete) {
      onComplete({ score, xp, avgError })
    }

    // Hide XP notification after 3 seconds
    setTimeout(() => setShowXP(false), 3000)
  }, [waypoints, motionKeypoints, totalDuration, maxVelocity, onComplete, isComplete])

  const svgWidth = 600
  const svgHeight = 250

  const scoreColors = {
    perfect: { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/40', text: 'text-emerald-300', label: 'Perfect!' },
    good: { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/40', text: 'text-amber-300', label: 'Good!' },
    partial: { bg: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/40', text: 'text-blue-300', label: 'Keep Practicing' },
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Ship animation panel */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/40">
        <ShipCanvas
          motionKeypoints={motionKeypoints}
          totalDuration={totalDuration}
          isPlaying={isPlaying}
          elapsedTime={elapsedTime}
          containerWidth={containerWidth}
        />

        {/* Play/replay overlay */}
        {!isPlaying && !hasPlayed && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px]">
            <motion.button
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 cursor-pointer"
              onClick={handlePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play size={16} />
              Watch the Ship
            </motion.button>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-2 flex-wrap">
        <motion.button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          onClick={handlePlay}
          disabled={isPlaying}
          whileHover={isPlaying ? {} : { scale: 1.03 }}
          whileTap={isPlaying ? {} : { scale: 0.97 }}
        >
          <Play size={14} />
          {hasPlayed ? 'Replay' : 'Play'}
        </motion.button>

        {hasPlayed && (
          <>
            <motion.button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-500 hover:border-slate-400 text-slate-200 hover:bg-slate-800/50 text-sm font-medium cursor-pointer"
              onClick={handleReset}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <RotateCcw size={14} />
              Clear Graph
            </motion.button>

            <motion.button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium shadow-lg shadow-emerald-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              onClick={handleCheck}
              disabled={waypoints.length < 2 || checked}
              whileHover={waypoints.length < 2 || checked ? {} : { scale: 1.03 }}
              whileTap={waypoints.length < 2 || checked ? {} : { scale: 0.97 }}
            >
              <Check size={14} />
              Check
            </motion.button>
          </>
        )}

        {waypoints.length > 0 && !checked && (
          <span className="text-xs text-slate-500 ml-auto">
            {waypoints.length} waypoint{waypoints.length !== 1 ? 's' : ''} placed
            {' \u2022 '}Right-click to remove
          </span>
        )}
      </div>

      {/* Graph panel */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/40 bg-slate-900/80">
        <GraphSVG
          totalDuration={totalDuration}
          maxVelocity={maxVelocity}
          waypoints={waypoints}
          setWaypoints={setWaypoints}
          correctKeypoints={motionKeypoints}
          showCorrect={showCorrect}
          checked={checked}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          disabled={isPlaying || !hasPlayed}
        />
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border bg-gradient-to-r ${scoreColors[result.score].bg} ${scoreColors[result.score].border}`}
          >
            <div className="flex items-center gap-3">
              <div className={`text-lg font-bold ${scoreColors[result.score].text}`}>
                {scoreColors[result.score].label}
              </div>
              <span className="text-xs text-slate-400">
                Avg error: {(result.avgError * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap size={16} className="text-amber-400 fill-amber-400" />
              <span className="text-lg font-bold text-amber-300">+{result.xp} XP</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP floating notification */}
      <AnimatePresence>
        {showXP && result && (
          <motion.div
            className="fixed top-24 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Zap size={20} className="text-amber-400 fill-amber-400" />
            <span className="text-xl font-bold text-amber-300">+{result.xp} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend when showing correct */}
      {showCorrect && (
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-amber-500 rounded" />
            Your graph
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-4 h-0.5 bg-emerald-500 rounded" style={{ borderBottom: '2px dashed #22c55e' }} />
            Correct v-t graph
          </span>
        </div>
      )}
    </div>
  )
}

export default MotionGrapher
