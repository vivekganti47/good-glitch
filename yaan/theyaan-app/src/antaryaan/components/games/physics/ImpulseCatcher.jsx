import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, RotateCcw, Zap, ShieldCheck, ShieldAlert } from 'lucide-react'

/**
 * ImpulseCatcher - Catch a falling ball without breaking the catcher.
 *
 * A ball falls from configurable height under gravity (g=10).
 * Player adjusts platform "softness" (deceleration time).
 * Physics: v_impact = sqrt(2*g*h), impulse = m*v_impact, F_avg = impulse/dt
 * If F_avg > threshold: catcher breaks (red). If <= threshold: safe catch (green).
 */

const G = 10 // m/s^2

function ImpulseCatcher({
  config = {},
  params = {},
  onParamChange,
  onComplete,
  isComplete = false,
  containerWidth = 600,
  containerHeight = 500,
}) {
  const height = config.height || 40 // meters (scaled for display)
  const mass = config.mass || 5 // kg
  const threshold = config.threshold || 500 // Newtons

  const [decelTime, setDecelTime] = useState(params.decelTime ?? 0.5)
  const [simState, setSimState] = useState('idle') // 'idle' | 'falling' | 'catching' | 'done'
  const [result, setResult] = useState(null) // { safe, force, impulse, vImpact }
  const [showXP, setShowXP] = useState(false)

  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const simRef = useRef({
    ballY: 0, // 0 = top, height = bottom (in meters)
    ballVy: 0,
    catchProgress: 0, // 0 to 1 during deceleration
    platformCompress: 0,
    elapsedFall: 0,
    elapsedCatch: 0,
    impactV: 0,
  })

  const canvasW = containerWidth || 600
  const canvasH = Math.min(containerHeight || 420, 420)

  // Pre-computed physics
  const vImpact = useMemo(() => Math.sqrt(2 * G * height), [height])
  const impulse = useMemo(() => mass * vImpact, [mass, vImpact])
  const avgForce = useMemo(() => impulse / Math.max(decelTime, 0.001), [impulse, decelTime])
  const isSafe = avgForce <= threshold
  const forceRatio = avgForce / threshold

  // Fall time: t = sqrt(2h/g)
  const fallTime = useMemo(() => Math.sqrt(2 * height / G), [height])

  // Notify parent
  useEffect(() => {
    if (onParamChange) onParamChange({ decelTime })
  }, [decelTime, onParamChange])

  // Reset sim state when decelTime changes
  useEffect(() => {
    if (simState !== 'idle') {
      setSimState('idle')
      setResult(null)
    }
    simRef.current = {
      ballY: 0,
      ballVy: 0,
      catchProgress: 0,
      platformCompress: 0,
      elapsedFall: 0,
      elapsedCatch: 0,
      impactV: 0,
    }
  }, [decelTime, height, mass])

  const handleDrop = useCallback(() => {
    simRef.current = {
      ballY: 0,
      ballVy: 0,
      catchProgress: 0,
      platformCompress: 0,
      elapsedFall: 0,
      elapsedCatch: 0,
      impactV: 0,
    }
    setResult(null)
    setShowXP(false)
    setSimState('falling')
  }, [])

  const handleReset = useCallback(() => {
    setSimState('idle')
    setResult(null)
    setShowXP(false)
    simRef.current = {
      ballY: 0,
      ballVy: 0,
      catchProgress: 0,
      platformCompress: 0,
      elapsedFall: 0,
      elapsedCatch: 0,
      impactV: 0,
    }
  }, [])

  // Animation and rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(canvasW * dpr)
    canvas.height = Math.round(canvasH * dpr)
    canvas.style.width = `${canvasW}px`
    canvas.style.height = `${canvasH}px`

    const ctx = canvas.getContext('2d')
    let running = true
    let lastTime = performance.now()

    // Scene layout
    const sceneMarginTop = 40
    const sceneMarginBot = 60
    const sceneH = canvasH - sceneMarginTop - sceneMarginBot
    const ballRadius = 14
    const platformY = sceneMarginTop + sceneH // bottom of scene
    const platformH = 16
    const platformW = 80
    const platformX = canvasW / 2

    // Convert meters to pixels
    const mToPixY = (meters) => sceneMarginTop + (meters / height) * sceneH

    const render = (now) => {
      if (!running) return

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const sim = simRef.current

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, canvasW, canvasH)

      // -- Background --
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvasH)
      bgGrad.addColorStop(0, '#020617')
      bgGrad.addColorStop(1, '#0f172a')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvasW, canvasH)

      // Subtle stars
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)'
      for (let i = 0; i < 30; i++) {
        const sx = (i * 137.5 + 19) % canvasW
        const sy = (i * 73.7 + 3) % canvasH
        ctx.beginPath()
        ctx.arc(sx, sy, 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      // -- Physics update --
      if (simState === 'falling') {
        sim.elapsedFall += dt
        sim.ballVy = G * sim.elapsedFall // v = g*t
        sim.ballY = 0.5 * G * sim.elapsedFall * sim.elapsedFall // s = 0.5*g*t^2

        if (sim.ballY >= height) {
          sim.ballY = height
          sim.impactV = Math.sqrt(2 * G * height)
          sim.ballVy = 0
          setSimState('catching')
        }
      } else if (simState === 'catching') {
        sim.elapsedCatch += dt
        sim.catchProgress = Math.min(1, sim.elapsedCatch / decelTime)

        // Ball decelerates: v goes from impactV to 0
        const currentV = sim.impactV * (1 - sim.catchProgress)
        sim.ballVy = currentV

        // Platform compression proportional to force and progress
        const maxCompress = Math.min(platformH * 2.5, decelTime * 25)
        sim.platformCompress = maxCompress * Math.sin(sim.catchProgress * Math.PI) // compress then release

        if (sim.catchProgress >= 1) {
          setSimState('done')
          const safe = avgForce <= threshold
          const resultData = {
            safe,
            force: avgForce,
            impulse,
            vImpact: sim.impactV,
            xp: safe ? 15 : 5,
          }
          setResult(resultData)
          if (safe && onComplete && !isComplete) {
            onComplete({ xp: 15 })
            setShowXP(true)
            setTimeout(() => setShowXP(false), 3000)
          }
        }
      }

      // -- Height scale markers --
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)'
      ctx.lineWidth = 0.5
      ctx.fillStyle = 'rgba(148, 163, 184, 0.25)'
      ctx.font = '9px monospace'
      ctx.textAlign = 'right'
      const hStep = height <= 20 ? 5 : 10
      for (let h = 0; h <= height; h += hStep) {
        const py = mToPixY(h)
        ctx.beginPath()
        ctx.moveTo(canvasW * 0.15, py)
        ctx.lineTo(canvasW * 0.85, py)
        ctx.stroke()
        ctx.fillText(`${height - h}m`, canvasW * 0.14, py + 3)
      }

      // -- Platform --
      const pCompressOffset = simState === 'catching' ? sim.platformCompress : 0
      const pY = platformY - platformH + pCompressOffset * 0.5
      const pActualH = platformH - pCompressOffset * 0.3

      // Platform shadow/base
      ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'
      ctx.fillRect(platformX - platformW / 2 - 3, platformY + 2, platformW + 6, 6)

      // Platform body
      const isBreaking = result && !result.safe
      const catchingSafe = simState === 'catching' && isSafe
      const catchingDanger = simState === 'catching' && !isSafe

      let platformColor
      if (isBreaking) {
        platformColor = '#ef4444'
      } else if (result?.safe) {
        platformColor = '#22c55e'
      } else if (catchingSafe) {
        platformColor = '#34d399'
      } else if (catchingDanger) {
        platformColor = '#f87171'
      } else {
        platformColor = '#64748b'
      }

      // Platform springs (compression visualization)
      const springBaseY = platformY + 4
      const springTopY = pY
      const springCount = 5
      for (let i = 0; i < springCount; i++) {
        const sx = platformX - platformW / 2 + 10 + i * ((platformW - 20) / (springCount - 1))
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)'
        ctx.lineWidth = 1
        ctx.beginPath()
        const segments = 6
        for (let s = 0; s <= segments; s++) {
          const frac = s / segments
          const sy = springTopY + (springBaseY - springTopY) * frac
          const sxOffset = (s % 2 === 0 ? -3 : 3) * (1 - pCompressOffset / 20)
          if (s === 0 || s === segments) {
            ctx.lineTo(sx, sy)
          } else {
            ctx.lineTo(sx + sxOffset, sy)
          }
        }
        ctx.stroke()
      }

      // Platform surface
      const platGrad = ctx.createLinearGradient(0, pY - pActualH, 0, pY)
      platGrad.addColorStop(0, platformColor)
      platGrad.addColorStop(1, `${platformColor}88`)
      ctx.fillStyle = platGrad
      ctx.beginPath()
      ctx.roundRect(
        platformX - platformW / 2, pY - pActualH,
        platformW, Math.max(pActualH, 4),
        3
      )
      ctx.fill()

      // Platform border
      ctx.strokeStyle = `${platformColor}88`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.roundRect(
        platformX - platformW / 2, pY - pActualH,
        platformW, Math.max(pActualH, 4),
        3
      )
      ctx.stroke()

      // Safe catch glow
      if (result?.safe) {
        ctx.shadowColor = '#22c55e'
        ctx.shadowBlur = 20
        ctx.fillStyle = 'rgba(34, 197, 94, 0.1)'
        ctx.beginPath()
        ctx.roundRect(
          platformX - platformW / 2 - 5, pY - pActualH - 5,
          platformW + 10, pActualH + 10,
          5
        )
        ctx.fill()
        ctx.shadowBlur = 0
      }

      // Cracks animation for breaking
      if (isBreaking) {
        ctx.strokeStyle = '#fca5a5'
        ctx.lineWidth = 1.5
        const crackCx = platformX
        const crackCy = pY - pActualH / 2
        for (let c = 0; c < 6; c++) {
          const angle = (c / 6) * Math.PI * 2 + 0.3
          const len = 8 + Math.random() * 12
          ctx.beginPath()
          ctx.moveTo(crackCx, crackCy)
          ctx.lineTo(
            crackCx + Math.cos(angle) * len,
            crackCy + Math.sin(angle) * len
          )
          ctx.stroke()
        }

        // Red flash
        ctx.fillStyle = 'rgba(239, 68, 68, 0.15)'
        ctx.fillRect(0, 0, canvasW, canvasH)
      }

      // -- Ball --
      const ballPixelY = simState === 'idle'
        ? mToPixY(0)
        : simState === 'done'
          ? mToPixY(height) - ballRadius - (result?.safe ? 0 : -5)
          : mToPixY(Math.min(sim.ballY, height)) - (simState === 'catching' ? pCompressOffset * 0.3 : 0)

      // Ball shadow
      const shadowAlpha = Math.min(0.3, 0.05 + (sim.ballY / height) * 0.25)
      ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`
      ctx.beginPath()
      ctx.ellipse(platformX, platformY + 6, ballRadius * 0.8, 3, 0, 0, Math.PI * 2)
      ctx.fill()

      // Ball body
      const ballGrad = ctx.createRadialGradient(
        platformX - 3, ballPixelY - 3, 0,
        platformX, ballPixelY, ballRadius
      )
      ballGrad.addColorStop(0, '#fbbf24')
      ballGrad.addColorStop(0.7, '#f59e0b')
      ballGrad.addColorStop(1, '#b45309')
      ctx.fillStyle = ballGrad
      ctx.beginPath()
      ctx.arc(platformX, ballPixelY, ballRadius, 0, Math.PI * 2)
      ctx.fill()

      // Ball highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.beginPath()
      ctx.arc(platformX - 4, ballPixelY - 4, ballRadius * 0.3, 0, Math.PI * 2)
      ctx.fill()

      // Motion blur for falling
      if (simState === 'falling' && sim.ballVy > 5) {
        const blurLen = Math.min(30, sim.ballVy * 1.5)
        const blurGrad = ctx.createLinearGradient(0, ballPixelY - blurLen, 0, ballPixelY)
        blurGrad.addColorStop(0, 'rgba(251, 191, 36, 0)')
        blurGrad.addColorStop(1, 'rgba(251, 191, 36, 0.3)')
        ctx.fillStyle = blurGrad
        ctx.beginPath()
        ctx.arc(platformX, ballPixelY - blurLen / 2, ballRadius * 0.7, 0, Math.PI * 2)
        ctx.fill()
      }

      // -- Ball info --
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      if (simState === 'falling') {
        ctx.fillText(`v = ${sim.ballVy.toFixed(1)} m/s`, platformX + ballRadius + 10, ballPixelY + 3)
      } else if (simState === 'catching') {
        ctx.fillStyle = isSafe ? '#34d399' : '#f87171'
        ctx.fillText(`F = ${avgForce.toFixed(0)} N`, platformX + ballRadius + 10, ballPixelY + 3)
      }

      // -- HUD --
      ctx.fillStyle = '#94a3b8'
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`h = ${height}m`, 12, 18)
      ctx.fillText(`m = ${mass}kg`, 12, 32)
      ctx.fillText(`g = ${G} m/s\u00B2`, 12, 46)

      // Impact velocity display
      if (simState !== 'idle') {
        ctx.fillStyle = '#fbbf24'
        ctx.fillText(`v_impact = ${vImpact.toFixed(1)} m/s`, canvasW - 160, 18)
      }

      ctx.restore()
      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)
    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [canvasW, canvasH, simState, decelTime, height, mass, threshold, vImpact, impulse, avgForce, isSafe, result, onComplete, isComplete])

  const fillPct = (val, min, max) => ((val - min) / (max - min)) * 100

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/40">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ height: canvasH }}
        />
      </div>

      {/* Force meter bar */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-slate-400">Average Force</span>
          <span className={`font-mono text-sm font-bold tabular-nums ${
            avgForce <= threshold ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {avgForce.toFixed(0)} N
          </span>
        </div>

        {/* Force bar */}
        <div className="relative h-5 rounded-full overflow-hidden bg-slate-900/80 border border-slate-700/30">
          {/* Fill */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 rounded-full"
            animate={{
              width: `${Math.min(100, forceRatio * 100)}%`,
              backgroundColor: forceRatio <= 0.6 ? '#22c55e' : forceRatio <= 1 ? '#eab308' : '#ef4444',
            }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: forceRatio > 1
                ? '0 0 12px rgba(239, 68, 68, 0.5)'
                : '0 0 8px rgba(34, 197, 94, 0.3)',
            }}
          />

          {/* Threshold line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white/50"
            style={{ left: '100%', transform: 'translateX(-1px)' }}
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] text-white/60 whitespace-nowrap font-mono">
              {threshold}N
            </div>
          </div>
        </div>

        {/* Scale labels */}
        <div className="flex justify-between text-[9px] text-slate-600 mt-0.5 font-mono">
          <span>0 N</span>
          <span>Threshold: {threshold} N</span>
          <span>{Math.max(threshold * 2, Math.round(avgForce * 1.2))} N</span>
        </div>
      </div>

      {/* Physics values display */}
      <div className="grid grid-cols-3 gap-2">
        <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/30 text-center">
          <span className="text-[10px] text-slate-500 block">Impact velocity</span>
          <span className="font-mono text-sm text-amber-300 font-medium">{vImpact.toFixed(1)} m/s</span>
        </div>
        <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/30 text-center">
          <span className="text-[10px] text-slate-500 block">Impulse (const)</span>
          <span className="font-mono text-sm text-indigo-300 font-medium">{impulse.toFixed(1)} N{'\u00B7'}s</span>
        </div>
        <div className="px-2 py-1.5 rounded-lg bg-slate-900/60 border border-slate-700/30 text-center">
          <span className="text-[10px] text-slate-500 block">Avg Force</span>
          <span className={`font-mono text-sm font-medium ${isSafe ? 'text-emerald-300' : 'text-red-300'}`}>
            {avgForce.toFixed(0)} N
          </span>
        </div>
      </div>

      {/* Deceleration time slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm text-slate-300">Platform Softness (deceleration time)</label>
          <span className="font-mono text-sm font-medium text-indigo-300 tabular-nums">
            {decelTime.toFixed(2)}<span className="text-slate-500 ml-0.5">s</span>
          </span>
        </div>
        <input
          type="range"
          min={0.01} max={2.0} step={0.01}
          value={decelTime}
          onChange={(e) => setDecelTime(parseFloat(e.target.value))}
          disabled={simState === 'falling' || simState === 'catching'}
          className="sim-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${fillPct(decelTime, 0.01, 2.0)}%, #1e293b ${fillPct(decelTime, 0.01, 2.0)}%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-600 font-mono">
          <span>0.01s (Hard)</span>
          <span>2.00s (Soft)</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          onClick={handleDrop}
          disabled={simState === 'falling' || simState === 'catching'}
          whileHover={simState === 'falling' || simState === 'catching' ? {} : { scale: 1.03 }}
          whileTap={simState === 'falling' || simState === 'catching' ? {} : { scale: 0.97 }}
        >
          <Play size={14} />
          {simState === 'done' ? 'Drop Again' : 'Drop Ball'}
        </motion.button>

        <motion.button
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-500 hover:border-slate-400 text-slate-200 text-sm font-medium cursor-pointer"
          onClick={handleReset}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <RotateCcw size={14} />
          Reset
        </motion.button>

        {simState === 'falling' && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs text-amber-400 font-medium">Falling...</span>
          </div>
        )}
        {simState === 'catching' && (
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs text-blue-400 font-medium">Catching...</span>
          </div>
        )}
      </div>

      {/* Result banner */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
          >
            {result.safe ? (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-gradient-to-r from-emerald-500/20 to-emerald-600/10 border-emerald-500/40">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <div>
                    <div className="text-sm font-bold text-emerald-300">Safe Catch!</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      F = {result.force.toFixed(0)}N {'\u2264'} {threshold}N threshold
                      &nbsp;|&nbsp; Impulse = {result.impulse.toFixed(1)} N{'\u00B7'}s
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={16} className="text-amber-400 fill-amber-400" />
                  <span className="text-lg font-bold text-amber-300">+{result.xp} XP</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between px-4 py-3 rounded-xl border bg-gradient-to-r from-red-500/15 to-orange-500/10 border-red-500/30">
                <div className="flex items-center gap-3">
                  <ShieldAlert size={20} className="text-red-400" />
                  <div>
                    <div className="text-sm font-bold text-red-300">Catcher Broke!</div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      F = {result.force.toFixed(0)}N {'>'} {threshold}N threshold
                      &nbsp;|&nbsp; Increase softness to reduce force
                    </div>
                  </div>
                </div>
                <span className="text-xs text-slate-500">Try a softer platform</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Formula reference */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30 space-y-1">
        <p className="text-xs text-slate-500 font-mono">
          v_impact = {'\u221A'}(2{'\u00B7'}g{'\u00B7'}h) = {'\u221A'}(2{'\u00B7'}{G}{'\u00B7'}{height}) = {vImpact.toFixed(1)} m/s
        </p>
        <p className="text-xs text-slate-500 font-mono">
          Impulse = m{'\u00B7'}v = {mass}{'\u00B7'}{vImpact.toFixed(1)} = {impulse.toFixed(1)} N{'\u00B7'}s (constant)
        </p>
        <p className="text-xs text-slate-500 font-mono">
          F_avg = Impulse / {'\u0394'}t = {impulse.toFixed(1)} / {decelTime.toFixed(2)} = {avgForce.toFixed(0)} N
        </p>
        <p className="text-xs text-slate-600 mt-1">
          Longer deceleration time = lower force. Same impulse, spread over more time.
        </p>
      </div>

      {/* XP notification */}
      <AnimatePresence>
        {showXP && result?.safe && (
          <motion.div
            className="fixed top-24 right-8 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/15 border border-amber-500/30 backdrop-blur-md pointer-events-none"
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <Zap size={20} className="text-amber-400 fill-amber-400" />
            <span className="text-xl font-bold text-amber-300">+15 XP</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slider styles */}
      <style>{`
        .sim-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #818cf8;
          border: 2px solid #312e81;
          box-shadow: 0 0 6px rgba(129, 140, 248, 0.4);
          cursor: pointer;
          transition: box-shadow 0.15s ease;
        }
        .sim-slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 12px rgba(129, 140, 248, 0.6);
        }
        .sim-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #818cf8;
          border: 2px solid #312e81;
          box-shadow: 0 0 6px rgba(129, 140, 248, 0.4);
          cursor: pointer;
        }
        .sim-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
        }
      `}</style>
    </div>
  )
}

export default ImpulseCatcher
