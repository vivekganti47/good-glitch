import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, RotateCcw, Trophy, Zap, AlertTriangle } from 'lucide-react'

/**
 * VelocityRacer - Make two ships reach the finish line at the same time.
 *
 * Ship A has fixed parameters (u, a). The player sets Ship B's initial velocity
 * and acceleration. Both ships race using s = ut + 1/2 * a * t^2.
 * Success if both ships arrive within 0.5s of each other.
 */

const G = 10 // consistent gravity

// Solve s = ut + 0.5*a*t^2 for t (positive root)
function solveTimeForDistance(u, a, s) {
  if (a === 0) {
    if (u === 0) return Infinity
    return s / u
  }
  // 0.5*a*t^2 + u*t - s = 0
  const disc = u * u + 2 * a * s
  if (disc < 0) return Infinity
  const sqrtDisc = Math.sqrt(disc)
  const t1 = (-u + sqrtDisc) / a
  const t2 = (-u - sqrtDisc) / a
  // Return smallest positive root
  const roots = [t1, t2].filter(t => t > 0.001)
  return roots.length > 0 ? Math.min(...roots) : Infinity
}

function positionAt(u, a, t) {
  return u * t + 0.5 * a * t * t
}

function velocityAt(u, a, t) {
  return u + a * t
}

// --- Ship Canvas Renderer ---

function RaceCanvas({ shipA, shipB, distance, raceState, elapsed, containerWidth }) {
  const canvasRef = useRef(null)
  const canvasWidth = containerWidth || 600
  const canvasHeight = 260

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
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Background: deep space
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    bgGrad.addColorStop(0, '#020617')
    bgGrad.addColorStop(1, '#0f172a')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Stars
    ctx.fillStyle = 'rgba(148, 163, 184, 0.25)'
    for (let i = 0; i < 40; i++) {
      const sx = (i * 137.5 + 23) % canvasWidth
      const sy = (i * 73.7 + 11) % canvasHeight
      const r = ((i * 37) % 3 === 0) ? 1.2 : 0.7
      ctx.beginPath()
      ctx.arc(sx, sy, r, 0, Math.PI * 2)
      ctx.fill()
    }

    const trackMarginL = 70
    const trackMarginR = 40
    const trackLen = canvasWidth - trackMarginL - trackMarginR
    const trackAY = 90
    const trackBY = 170
    const shipSize = 12

    // --- Finish line ---
    ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)'
    ctx.lineWidth = 2
    ctx.setLineDash([4, 4])
    const finishX = trackMarginL + trackLen
    ctx.beginPath()
    ctx.moveTo(finishX, trackAY - 30)
    ctx.lineTo(finishX, trackBY + 30)
    ctx.stroke()
    ctx.setLineDash([])

    // Finish flag
    ctx.fillStyle = '#fbbf24'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('FINISH', finishX, trackAY - 36)
    ctx.fillStyle = '#94a3b8'
    ctx.font = '9px monospace'
    ctx.fillText(`${distance}m`, finishX, trackBY + 44)

    // --- Tracks ---
    const drawTrack = (y, label, color) => {
      // Track line
      ctx.strokeStyle = `${color}33`
      ctx.lineWidth = 1.5
      ctx.setLineDash([6, 4])
      ctx.beginPath()
      ctx.moveTo(trackMarginL, y)
      ctx.lineTo(finishX, y)
      ctx.stroke()
      ctx.setLineDash([])

      // Label
      ctx.fillStyle = color
      ctx.font = 'bold 10px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(label, trackMarginL - 10, y + 4)
    }

    drawTrack(trackAY, 'SHIP A', '#f87171')
    drawTrack(trackBY, 'SHIP B', '#60a5fa')

    // --- Position markers (every 20%) ---
    ctx.fillStyle = 'rgba(148,163,184,0.15)'
    for (let p = 0; p <= 1; p += 0.2) {
      const mx = trackMarginL + p * trackLen
      ctx.fillRect(mx, trackAY - 3, 1, 6)
      ctx.fillRect(mx, trackBY - 3, 1, 6)
    }

    // --- Calculate ship positions ---
    const posA = raceState === 'idle' ? 0 : Math.min(positionAt(shipA.u, shipA.a, elapsed), distance)
    const posB = raceState === 'idle' ? 0 : Math.min(positionAt(shipB.u, shipB.a, elapsed), distance)
    const fracA = Math.min(1, posA / distance)
    const fracB = Math.min(1, posB / distance)
    const shipAX = trackMarginL + fracA * trackLen
    const shipBX = trackMarginL + fracB * trackLen

    const velA = raceState === 'idle' ? shipA.u : velocityAt(shipA.u, shipA.a, elapsed)
    const velB = raceState === 'idle' ? shipB.u : velocityAt(shipB.u, shipB.a, elapsed)

    // --- Draw ships ---
    const drawShip = (x, y, color, glowColor, vel) => {
      const maxV = Math.max(velA, velB, 1)
      const vFrac = Math.abs(vel) / maxV

      // Engine flame
      if (raceState === 'racing' && vel > 0) {
        const flameLen = 6 + vFrac * 20
        const grad = ctx.createLinearGradient(x - shipSize - flameLen, y, x - shipSize, y)
        grad.addColorStop(0, 'rgba(251, 146, 60, 0)')
        grad.addColorStop(0.6, 'rgba(251, 146, 60, 0.5)')
        grad.addColorStop(1, 'rgba(234, 179, 8, 0.8)')
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.moveTo(x - shipSize, y - 3)
        ctx.lineTo(x - shipSize - flameLen, y)
        ctx.lineTo(x - shipSize, y + 3)
        ctx.closePath()
        ctx.fill()
      }

      // Ship body
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(x + shipSize, y)
      ctx.lineTo(x - shipSize, y - 7)
      ctx.lineTo(x - shipSize + 3, y)
      ctx.lineTo(x - shipSize, y + 7)
      ctx.closePath()
      ctx.fill()

      // Glow
      ctx.shadowColor = glowColor
      ctx.shadowBlur = 10
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(x + 2, y, 2, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0
    }

    drawShip(shipAX, trackAY, '#f87171', '#ef4444', velA)
    drawShip(shipBX, trackBY, '#60a5fa', '#3b82f6', velB)

    // --- HUD ---
    // Time
    ctx.fillStyle = '#94a3b8'
    ctx.font = 'bold 12px monospace'
    ctx.textAlign = 'left'
    ctx.fillText(`t = ${elapsed.toFixed(2)}s`, 12, 22)

    // Ship A info
    ctx.fillStyle = '#f87171'
    ctx.font = '10px monospace'
    ctx.fillText(`A: s=${posA.toFixed(1)}m  v=${velA.toFixed(1)}m/s`, 12, trackAY - 18)

    // Ship B info
    ctx.fillStyle = '#60a5fa'
    ctx.fillText(`B: s=${posB.toFixed(1)}m  v=${velB.toFixed(1)}m/s`, 12, trackBY - 18)

  }, [shipA, shipB, distance, raceState, elapsed, canvasWidth])

  return (
    <canvas
      ref={canvasRef}
      className="block w-full rounded-t-lg"
      style={{ height: canvasHeight }}
    />
  )
}

// --- Main Component ---

function VelocityRacer({
  config = {},
  params = {},
  onParamChange,
  onComplete,
  isComplete = false,
  containerWidth = 600,
  containerHeight = 500,
}) {
  const fixedShip = config.fixedShip || { u: 0, a: 5 }
  const distance = config.distance || 200

  const [playerU, setPlayerU] = useState(params.playerU ?? 10)
  const [playerA, setPlayerA] = useState(params.playerA ?? 2)
  const [raceState, setRaceState] = useState('idle') // 'idle' | 'racing' | 'finished'
  const [elapsed, setElapsed] = useState(0)
  const [resultData, setResultData] = useState(null)
  const [showXP, setShowXP] = useState(false)

  const rafRef = useRef(null)
  const startTimeRef = useRef(null)

  const shipA = useMemo(() => ({ u: fixedShip.u, a: fixedShip.a }), [fixedShip.u, fixedShip.a])
  const shipB = useMemo(() => ({ u: playerU, a: playerA }), [playerU, playerA])

  const timeA = useMemo(() => solveTimeForDistance(shipA.u, shipA.a, distance), [shipA, distance])
  const timeB = useMemo(() => solveTimeForDistance(shipB.u, shipB.a, distance), [shipB, distance])
  const maxRaceTime = useMemo(() => {
    const finite = [timeA, timeB].filter(t => isFinite(t))
    return finite.length > 0 ? Math.max(...finite) + 1 : 30
  }, [timeA, timeB])

  // Notify parent of param changes
  useEffect(() => {
    if (onParamChange) {
      onParamChange({ playerU, playerA })
    }
  }, [playerU, playerA, onParamChange])

  // Race animation loop
  useEffect(() => {
    if (raceState !== 'racing') return

    startTimeRef.current = performance.now()

    const tick = (now) => {
      const t = (now - startTimeRef.current) / 1000
      const posA = positionAt(shipA.u, shipA.a, t)
      const posB = positionAt(shipB.u, shipB.a, t)

      setElapsed(t)

      // Check if both have finished or if max time exceeded
      const aFinished = posA >= distance
      const bFinished = posB >= distance

      if ((aFinished && bFinished) || t >= maxRaceTime) {
        setElapsed(Math.min(t, maxRaceTime))
        setRaceState('finished')

        const tA = isFinite(timeA) ? timeA : Infinity
        const tB = isFinite(timeB) ? timeB : Infinity
        const diff = Math.abs(tA - tB)
        const success = diff <= 0.5 && isFinite(tA) && isFinite(tB)

        const xp = success ? (diff <= 0.1 ? 20 : 15) : 5

        setResultData({
          timeA: tA,
          timeB: tB,
          diff,
          success,
          xp,
        })

        if (success) {
          setShowXP(true)
          setTimeout(() => setShowXP(false), 3000)
        }

        if (onComplete && !isComplete && success) {
          onComplete({ xp, timeA: tA, timeB: tB, diff })
        }
        return
      }

      // If one has finished but not the other, keep going until max time
      if ((aFinished || bFinished) && t < maxRaceTime) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [raceState, shipA, shipB, distance, timeA, timeB, maxRaceTime, onComplete, isComplete])

  const handleRace = useCallback(() => {
    setElapsed(0)
    setResultData(null)
    setShowXP(false)
    setRaceState('racing')
  }, [])

  const handleReset = useCallback(() => {
    setRaceState('idle')
    setElapsed(0)
    setResultData(null)
    setShowXP(false)
  }, [])

  const isRacing = raceState === 'racing'

  // Compute predicted time for Ship B display
  const predictedTimeB = solveTimeForDistance(playerU, playerA, distance)
  const timeDiffPreview = isFinite(timeA) && isFinite(predictedTimeB)
    ? Math.abs(timeA - predictedTimeB)
    : null

  // Slider fill percent helper
  const fillPct = (val, min, max) => ((val - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Race canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/40">
        <RaceCanvas
          shipA={shipA}
          shipB={shipB}
          distance={distance}
          raceState={raceState}
          elapsed={elapsed}
          containerWidth={containerWidth}
        />
      </div>

      {/* Ship info panels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Ship A (fixed) */}
        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-sm font-semibold text-red-300">Ship A (Fixed)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/30">
              <span className="text-slate-500 text-xs">Initial velocity</span>
              <div className="font-mono text-red-300 font-medium">{shipA.u} m/s</div>
            </div>
            <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/30">
              <span className="text-slate-500 text-xs">Acceleration</span>
              <div className="font-mono text-red-300 font-medium">{shipA.a} m/s&sup2;</div>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Time to finish: {isFinite(timeA) ? `${timeA.toFixed(2)}s` : 'Never'}
          </div>
        </div>

        {/* Ship B (player) */}
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400" />
            <span className="text-sm font-semibold text-blue-300">Ship B (You)</span>
          </div>

          {/* Initial velocity slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">Initial velocity</label>
              <span className="font-mono text-sm font-medium text-blue-300 tabular-nums">
                {playerU.toFixed(1)}<span className="text-slate-500 ml-0.5">m/s</span>
              </span>
            </div>
            <input
              type="range"
              min={0} max={30} step={0.5}
              value={playerU}
              onChange={(e) => setPlayerU(parseFloat(e.target.value))}
              disabled={isRacing}
              className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #60a5fa ${fillPct(playerU, 0, 30)}%, #1e293b ${fillPct(playerU, 0, 30)}%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-0.5">
              <span>0</span><span>30 m/s</span>
            </div>
          </div>

          {/* Acceleration slider */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-400">Acceleration</label>
              <span className="font-mono text-sm font-medium text-blue-300 tabular-nums">
                {playerA.toFixed(1)}<span className="text-slate-500 ml-0.5">m/s&sup2;</span>
              </span>
            </div>
            <input
              type="range"
              min={0} max={10} step={0.5}
              value={playerA}
              onChange={(e) => setPlayerA(parseFloat(e.target.value))}
              disabled={isRacing}
              className="w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #60a5fa ${fillPct(playerA, 0, 10)}%, #1e293b ${fillPct(playerA, 0, 10)}%)`,
              }}
            />
            <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-0.5">
              <span>0</span><span>10 m/s&sup2;</span>
            </div>
          </div>

          {/* Predicted time */}
          {raceState === 'idle' && (
            <div className="text-xs text-slate-500 font-mono">
              Predicted time: {isFinite(predictedTimeB) ? `${predictedTimeB.toFixed(2)}s` : 'Never reaches'}
              {timeDiffPreview !== null && (
                <span className={timeDiffPreview <= 0.5 ? 'text-emerald-400 ml-2' : 'text-amber-400 ml-2'}>
                  ({'\u0394'}t = {timeDiffPreview.toFixed(2)}s)
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleRace}
          disabled={isRacing || (playerU === 0 && playerA === 0)}
          whileHover={isRacing ? {} : { scale: 1.03 }}
          whileTap={isRacing ? {} : { scale: 0.97 }}
        >
          <Rocket size={14} />
          {raceState === 'finished' ? 'Race Again!' : 'Race!'}
        </motion.button>

        {raceState === 'finished' && (
          <motion.button
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-500 hover:border-slate-400 text-slate-200 text-sm font-medium cursor-pointer"
            onClick={handleReset}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <RotateCcw size={14} />
            Reset
          </motion.button>
        )}

        {isRacing && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-400 font-medium">Racing...</span>
          </div>
        )}
      </div>

      {/* Equations display */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <p className="text-xs text-slate-500 font-mono">
          s = ut + {'\u00BD'}at{'\u00B2'} &nbsp;|&nbsp; Distance: {distance}m
        </p>
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {resultData && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
          >
            {resultData.success ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <Trophy size={20} className="text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-emerald-300">Both ships arrived together!</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Ship A: {resultData.timeA.toFixed(2)}s &nbsp;|&nbsp; Ship B: {resultData.timeB.toFixed(2)}s &nbsp;|&nbsp; {'\u0394'}t = {resultData.diff.toFixed(3)}s
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-lg font-bold text-amber-300">+{resultData.xp} XP</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-gradient-to-r from-red-500/15 to-orange-500/10 border-red-500/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle size={20} className="text-amber-400" />
                  <div>
                    <div className="text-sm font-bold text-amber-300">Ships arrived at different times</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      Ship A: {isFinite(resultData.timeA) ? `${resultData.timeA.toFixed(2)}s` : 'DNF'}
                      &nbsp;|&nbsp;
                      Ship B: {isFinite(resultData.timeB) ? `${resultData.timeB.toFixed(2)}s` : 'DNF'}
                      &nbsp;|&nbsp;
                      {'\u0394'}t = {isFinite(resultData.diff) ? `${resultData.diff.toFixed(2)}s` : '\u221E'}
                      &nbsp;(need {'\u2264'} 0.5s)
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">Adjust Ship B and try again</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP floating notification */}
      <AnimatePresence>
        {showXP && resultData?.success && (
          <motion.div
            className="fixed top-24 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Zap size={20} className="text-amber-400 fill-amber-400" />
            <span className="text-xl font-bold text-amber-300">+{resultData.xp} XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider thumb styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #60a5fa;
          border: 2px solid #1e3a5f;
          box-shadow: 0 0 6px rgba(96, 165, 250, 0.4);
          cursor: pointer;
        }
        input[type="range"]::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #60a5fa;
          border: 2px solid #1e3a5f;
          box-shadow: 0 0 6px rgba(96, 165, 250, 0.4);
          cursor: pointer;
        }
      `}</style>
    </div>
  )
}

export default VelocityRacer
