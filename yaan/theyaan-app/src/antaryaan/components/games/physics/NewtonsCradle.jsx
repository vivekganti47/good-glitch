import { useState, useCallback, useRef, useEffect, useMemo, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Zap } from 'lucide-react'

/* ================================================================
   NewtonsCradle
   ================================================================
   Interactive Newton's cradle simulation.  Pull 1-3 balls on either
   end and release to see momentum transfer.  Includes slow-motion
   toggle, momentum readouts, and discovery tracking.
   ================================================================ */

const DEG = Math.PI / 180
const RAD = 180 / Math.PI
const G = 9.81       // m/s^2 (gravity)
const DT = 1 / 60    // base timestep
const SUBSTEPS = 8   // integration substeps per frame

// rest threshold: if angular velocity and angle both below this, clamp to rest
const REST_THRESHOLD_ANGLE = 0.15 * DEG  // radians
const REST_THRESHOLD_VEL = 0.05 * DEG    // rad/s

/* ================================================================
   SVG dimensions
   ================================================================ */
const VB_W = 700
const VB_H = 450

// layout constants (in SVG coords)
const BAR_Y = 50
const BAR_H = 14
const BAR_RX = 4

/* ================================================================
   Physics helpers
   ================================================================ */

/** Verlet-style pendulum step: theta'' = -(g/L)*sin(theta) - damping*omega */
function pendulumStep(angle, omega, stringLen, damping, dt) {
  const alpha = -(G / stringLen) * Math.sin(angle) - damping * omega
  const newOmega = omega + alpha * dt
  const newAngle = angle + newOmega * dt
  return { angle: newAngle, omega: newOmega }
}

/** Elastic collision between two equal-mass balls (1D):
 *  ball A transfers all velocity to ball B. */
function elasticCollisionPair(vA, vB) {
  // For equal masses: velocities swap
  return { vA: vB, vB: vA }
}

/* ================================================================
   Component
   ================================================================ */
function NewtonsCradle({
  config = {},
  params = {},
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete = false,
  containerWidth = 700,
  containerHeight = 450,
}) {
  const gradientId = useId().replace(/:/g, '_')

  const ballCount = config.ballCount || 5
  const ballRadius = config.ballRadius || 22
  const stringLength = config.stringLength || 220   // SVG units
  const dampingFactor = config.dampingFactor || 0.003

  const slowMotion = params.slowMotion ?? false

  // State: array of { angle, omega } for each ball (angle in radians, 0 = hanging straight)
  const [balls, setBalls] = useState(() =>
    Array.from({ length: ballCount }, () => ({ angle: 0, omega: 0 }))
  )

  // Interaction
  const [dragBall, setDragBall] = useState(null)        // index of ball being dragged
  const [dragAngle, setDragAngle] = useState(0)          // current drag angle
  const [isRunning, setIsRunning] = useState(false)       // simulation active?
  const [discoveries, setDiscoveries] = useState(new Set())
  const [showPullGuide, setShowPullGuide] = useState(null) // ball index hovered

  const svgRef = useRef(null)
  const rafRef = useRef(null)
  const ballsRef = useRef(balls)
  ballsRef.current = balls

  // layout: evenly space balls horizontally
  const spacing = ballRadius * 2.05
  const totalW = spacing * (ballCount - 1)
  const startX = VB_W / 2 - totalW / 2
  const pivotY = BAR_Y + BAR_H

  const getAnchorX = useCallback(
    (i) => startX + i * spacing,
    [startX, spacing]
  )

  const getBallPos = useCallback(
    (i, angle) => {
      const ax = getAnchorX(i)
      return {
        x: ax + stringLength * Math.sin(angle),
        y: pivotY + stringLength * Math.cos(angle),
      }
    },
    [getAnchorX, stringLength, pivotY]
  )

  /* ---- pointer helpers ---- */
  const getSVGPoint = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const rect = svg.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: ((clientX - rect.left) / rect.width) * VB_W,
      y: ((clientY - rect.top) / rect.height) * VB_H,
    }
  }, [])

  /* ---- determine which balls can be dragged (only ends) ---- */
  const isDraggable = useCallback(
    (idx) => {
      // balls on the left end or right end (up to 3 from each end)
      return idx < 3 || idx >= ballCount - 3
    },
    [ballCount]
  )

  /* ---- pointer down on a ball ---- */
  const handleBallPointerDown = useCallback(
    (idx, e) => {
      if (isRunning) return
      if (!isDraggable(idx)) return
      e.stopPropagation()
      setDragBall(idx)
      const pt = getSVGPoint(e)
      const ax = getAnchorX(idx)
      const angle = Math.atan2(pt.x - ax, pt.y - pivotY)
      setDragAngle(angle)

      // Also set all linked balls (if pulling from left, balls to the left; right, balls to right)
      const currentBalls = [...ballsRef.current]
      currentBalls[idx] = { angle, omega: 0 }
      setBalls(currentBalls)
    },
    [isRunning, isDraggable, getSVGPoint, getAnchorX, pivotY]
  )

  /* ---- pointer move ---- */
  const handlePointerMove = useCallback(
    (e) => {
      if (dragBall === null) return
      e.preventDefault()
      const pt = getSVGPoint(e)
      const ax = getAnchorX(dragBall)
      let angle = Math.atan2(pt.x - ax, pt.y - pivotY)

      // clamp angle to reasonable range (-70 to 70 degrees)
      const maxAngle = 70 * DEG
      angle = Math.max(-maxAngle, Math.min(maxAngle, angle))

      setDragAngle(angle)

      // Update ball state: if dragging from left, also pull adjacent balls on left
      // If dragging from right, also pull adjacent balls on right
      const currentBalls = [...ballsRef.current]
      const isLeftSide = dragBall < ballCount / 2

      if (isLeftSide) {
        // pull all balls from 0..dragBall to same angle
        for (let i = 0; i <= dragBall; i++) {
          currentBalls[i] = { angle, omega: 0 }
        }
      } else {
        // pull all balls from dragBall..end to same angle
        for (let i = dragBall; i < ballCount; i++) {
          currentBalls[i] = { angle, omega: 0 }
        }
      }

      setBalls(currentBalls)
    },
    [dragBall, getSVGPoint, getAnchorX, pivotY, ballCount]
  )

  /* ---- pointer up: release balls ---- */
  const handlePointerUp = useCallback(() => {
    if (dragBall === null) return
    setDragBall(null)

    // Start the simulation only if at least one ball is displaced
    const anyDisplaced = ballsRef.current.some(
      (b) => Math.abs(b.angle) > 2 * DEG
    )
    if (anyDisplaced) {
      setIsRunning(true)
    }
  }, [dragBall])

  /* ---- physics simulation loop ---- */
  useEffect(() => {
    if (!isRunning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    let prev = performance.now()

    const step = () => {
      const now = performance.now()
      const rawDt = (now - prev) / 1000
      prev = now

      // cap dt to avoid spiral of death
      const frameDt = Math.min(rawDt, 0.05)
      const speedMul = slowMotion ? 0.2 : 1.0
      const dt = (frameDt * speedMul) / SUBSTEPS

      let current = [...ballsRef.current]

      for (let sub = 0; sub < SUBSTEPS; sub++) {
        // 1. Integrate pendulum physics for each ball
        let next = current.map((b) => {
          const result = pendulumStep(b.angle, b.omega, stringLength, dampingFactor, dt)
          return { ...result }
        })

        // 2. Collision detection: check if adjacent balls touch
        //    Two balls collide when they're at (approximately) the same angle
        //    and the left one is moving right or the right one is moving left.
        //    For Newton's Cradle, collisions happen near angle=0 (hanging straight).
        for (let i = 0; i < ballCount - 1; i++) {
          const posI = getBallPos(i, next[i].angle)
          const posJ = getBallPos(i + 1, next[i + 1].angle)
          const dist = Math.sqrt((posJ.x - posI.x) ** 2 + (posJ.y - posI.y) ** 2)

          if (dist <= ballRadius * 2.05) {
            // Convert angular velocities to linear velocities at the ball
            const vI = next[i].omega * stringLength
            const vJ = next[i + 1].omega * stringLength

            // Only collide if approaching each other
            const relVel = vI - vJ
            if (relVel > 0.001) {
              // Elastic collision between equal masses: swap velocities
              const { vA, vB } = elasticCollisionPair(vI, vJ)
              next[i] = { ...next[i], omega: vA / stringLength }
              next[i + 1] = { ...next[i + 1], omega: vB / stringLength }

              // Separate slightly to prevent sticking
              const overlap = ballRadius * 2.05 - dist
              if (overlap > 0) {
                const sep = overlap * 0.6 / stringLength
                next[i] = { ...next[i], angle: next[i].angle - sep }
                next[i + 1] = { ...next[i + 1], angle: next[i + 1].angle + sep }
              }
            }
          }
        }

        current = next
      }

      // Clamp to rest if all balls are nearly stopped
      const allResting = current.every(
        (b) =>
          Math.abs(b.angle) < REST_THRESHOLD_ANGLE &&
          Math.abs(b.omega) < REST_THRESHOLD_VEL
      )

      if (allResting) {
        current = current.map(() => ({ angle: 0, omega: 0 }))
        setBalls(current)
        setIsRunning(false)
        return // don't request next frame
      }

      setBalls(current)
      rafRef.current = requestAnimationFrame(step)
    }

    rafRef.current = requestAnimationFrame(step)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isRunning, slowMotion, ballCount, ballRadius, stringLength, dampingFactor, getBallPos])

  /* ---- discovery tracking ---- */
  // Track what the user has pulled and what happened
  const discoveryRef = useRef({ pullCounts: new Set() })

  useEffect(() => {
    if (!isRunning) return

    // Count how many balls were pulled (nonzero initial angle)
    const displaced = ballsRef.current.filter((b) => Math.abs(b.angle) > 5 * DEG)
    if (displaced.length > 0) {
      discoveryRef.current.pullCounts.add(displaced.length)
    }

    // If user has observed at least 2 different pull counts, trigger n-in-n-out discovery
    if (
      discoveryRef.current.pullCounts.size >= 2 &&
      !discoveries.has('n-in-n-out')
    ) {
      setDiscoveries((prev) => {
        const next = new Set(prev)
        next.add('n-in-n-out')
        return next
      })
      onDiscovery?.('n-in-n-out')
    }
  }, [isRunning, discoveries, onDiscovery])

  /* ---- reset ---- */
  const handleReset = useCallback(() => {
    setIsRunning(false)
    setBalls(Array.from({ length: ballCount }, () => ({ angle: 0, omega: 0 })))
    setDragBall(null)
    setDragAngle(0)
  }, [ballCount])

  /* ---- slow-motion toggle ---- */
  const handleToggleSlowMo = useCallback(() => {
    onParamChange?.('slowMotion', !slowMotion)
  }, [slowMotion, onParamChange])

  /* ---- momentum readouts ---- */
  const momenta = useMemo(
    () =>
      balls.map((b) => {
        // p = m*v, v = omega * L, assume m=1 for display
        const v = b.omega * stringLength
        return v
      }),
    [balls, stringLength]
  )

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* controls bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2 py-1 text-xs text-slate-400 hover:text-slate-200 rounded border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <RotateCcw size={12} /> Reset
          </button>
          <button
            onClick={handleToggleSlowMo}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors cursor-pointer ${
              slowMotion
                ? 'text-amber-300 border-amber-500/40 bg-amber-500/10'
                : 'text-slate-400 border-slate-700/50 hover:border-slate-600 hover:text-slate-200'
            }`}
          >
            <Zap size={12} />
            {slowMotion ? 'Slow-Mo ON' : 'Slow-Mo'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="text-[10px] uppercase tracking-wider text-emerald-400/70 font-medium">
              Simulating
            </span>
          )}
          {!isRunning && !dragBall && (
            <span className="text-[10px] text-slate-500">
              Pull balls on either end to start
            </span>
          )}
        </div>
      </div>

      {/* SVG canvas */}
      <div className="relative overflow-hidden rounded-lg bg-[#0f172a] border border-slate-700/40">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          className="block w-full touch-none select-none"
          style={{ minHeight: 300 }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <defs>
            {/* metallic ball gradient */}
            <radialGradient
              id={`ball-grad-${gradientId}`}
              cx="0.35"
              cy="0.30"
              r="0.65"
            >
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="80%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>

            {/* highlight for ball */}
            <radialGradient
              id={`ball-highlight-${gradientId}`}
              cx="0.30"
              cy="0.25"
              r="0.35"
            >
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>

            {/* subtle grid */}
            <pattern
              id={`nc-grid-${gradientId}`}
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="rgba(148,163,184,0.04)"
                strokeWidth="0.5"
              />
            </pattern>

            {/* shadow filter */}
            <filter id={`ball-shadow-${gradientId}`}>
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="4" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* background grid */}
          <rect width={VB_W} height={VB_H} fill={`url(#nc-grid-${gradientId})`} />

          {/* top bar (frame) */}
          <rect
            x={startX - ballRadius - 20}
            y={BAR_Y}
            width={totalW + ballRadius * 2 + 40}
            height={BAR_H}
            rx={BAR_RX}
            fill="#334155"
            stroke="#475569"
            strokeWidth="1.5"
          />

          {/* frame legs */}
          {[startX - ballRadius - 18, startX + totalW + ballRadius + 18].map(
            (x, i) => (
              <line
                key={i}
                x1={x}
                y1={BAR_Y + BAR_H}
                x2={x + (i === 0 ? -25 : 25)}
                y2={VB_H - 20}
                stroke="#334155"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )
          )}

          {/* pull guide arcs (when hovering a draggable ball) */}
          {showPullGuide !== null && !isRunning && dragBall === null && (
            <path
              d={(() => {
                const ax = getAnchorX(showPullGuide)
                const isLeft = showPullGuide < ballCount / 2
                const sweepAngle = 55 * DEG
                const r = stringLength
                const startAng = isLeft ? -sweepAngle : 0
                const endAng = isLeft ? 0 : sweepAngle

                const x1 = ax + r * Math.sin(startAng)
                const y1 = pivotY + r * Math.cos(startAng)
                const x2 = ax + r * Math.sin(endAng)
                const y2 = pivotY + r * Math.cos(endAng)

                return `M ${x1} ${y1} A ${r} ${r} 0 0 ${isLeft ? 1 : 1} ${x2} ${y2}`
              })()}
              fill="none"
              stroke="#818cf8"
              strokeWidth="1"
              strokeDasharray="6 4"
              opacity={0.25}
            />
          )}

          {/* strings + balls */}
          {balls.map((ball, i) => {
            const ax = getAnchorX(i)
            const pos = getBallPos(i, ball.angle)
            const draggable = isDraggable(i) && !isRunning
            const beingDragged = dragBall === i

            return (
              <g key={i}>
                {/* string */}
                <line
                  x1={ax}
                  y1={pivotY}
                  x2={pos.x}
                  y2={pos.y}
                  stroke="#64748b"
                  strokeWidth="1.5"
                />

                {/* ball shadow */}
                <circle
                  cx={pos.x + 2}
                  cy={pos.y + 3}
                  r={ballRadius}
                  fill="rgba(0,0,0,0.25)"
                />

                {/* ball body */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={ballRadius}
                  fill={`url(#ball-grad-${gradientId})`}
                  stroke={beingDragged ? '#818cf8' : '#475569'}
                  strokeWidth={beingDragged ? 2.5 : 1}
                  style={{ cursor: draggable ? 'grab' : 'default' }}
                  onPointerDown={(e) => handleBallPointerDown(i, e)}
                  onPointerEnter={() => {
                    if (draggable) setShowPullGuide(i)
                  }}
                  onPointerLeave={() => setShowPullGuide(null)}
                />

                {/* specular highlight */}
                <circle
                  cx={pos.x - ballRadius * 0.2}
                  cy={pos.y - ballRadius * 0.2}
                  r={ballRadius * 0.85}
                  fill={`url(#ball-highlight-${gradientId})`}
                  style={{ pointerEvents: 'none' }}
                />

                {/* pivot attachment dot */}
                <circle cx={ax} cy={pivotY} r={3} fill="#475569" />
              </g>
            )
          })}
        </svg>
      </div>

      {/* momentum readout */}
      <div className="px-1">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] uppercase tracking-wider text-slate-500">
            Momentum (p = mv)
          </span>
          {slowMotion && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              0.2x speed
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          {momenta.map((p, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/40"
            >
              <span className="text-[10px] text-slate-500 mb-0.5">Ball {i + 1}</span>
              <span
                className={`font-mono text-xs tabular-nums font-semibold ${
                  Math.abs(p) > 0.5
                    ? p > 0
                      ? 'text-cyan-300'
                      : 'text-orange-300'
                    : 'text-slate-400'
                }`}
              >
                {p >= 0 ? '+' : ''}{p.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* discoveries */}
      <AnimatePresence>
        {discoveries.has('n-in-n-out') && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20"
          >
            <Zap size={14} className="text-indigo-400" />
            <span className="text-xs text-indigo-300">
              Discovery: N balls pulled in = N balls swing out! (Conservation of momentum and energy)
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NewtonsCradle
