import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RotateCcw, Zap, AlertTriangle, CheckCircle } from 'lucide-react'

/**
 * CircularOrbit - Satellite orbiting a planet simulation.
 *
 * Adjust orbital radius, satellite velocity, and planet mass to achieve
 * a stable circular orbit. v_req = sqrt(G * M / r) (scaled).
 *
 * - If v matches v_req (within 10%): smooth circular orbit
 * - If v too low: satellite spirals inward (crash)
 * - If v too high: satellite escapes (flies off screen)
 *
 * Discoveries: 'larger-orbit-slower', 'more-mass-faster'
 */

const TWO_PI = Math.PI * 2

function CircularOrbit({
  config = {},
  params = {},
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete = false,
  containerWidth = 600,
  containerHeight = 500,
}) {
  const scaleFactor = config.scale || 500
  const planetBaseRadius = config.planetRadius || 30
  const G_SCALED = config.G || 1000 // Scaled gravitational constant for visual clarity

  // Parameter defaults
  const defaultRadius = params.radius ?? 150
  const defaultVelocity = params.velocity ?? 50
  const defaultPlanetMass = params.planetMass ?? 500

  const [radius, setRadius] = useState(defaultRadius)
  const [velocity, setVelocity] = useState(defaultVelocity)
  const [planetMass, setPlanetMass] = useState(defaultPlanetMass)
  const [isRunning, setIsRunning] = useState(false)
  const [orbitState, setOrbitState] = useState('idle') // 'idle' | 'stable' | 'spiraling-in' | 'escaping' | 'crashed' | 'escaped'
  const [discovered, setDiscovered] = useState(new Set())
  const [showXP, setShowXP] = useState(false)

  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const stateRef = useRef({
    angle: 0,
    currentR: radius,
    currentV: velocity,
    satX: 0,
    satY: 0,
    trail: [],
    crashed: false,
    escaped: false,
    stableTime: 0,
  })

  const canvasW = containerWidth || 600
  const canvasH = Math.min(containerHeight || 450, 450)
  const centerX = canvasW / 2
  const centerY = canvasH / 2

  // Required orbital velocity
  const vRequired = useMemo(
    () => Math.sqrt(G_SCALED * planetMass / radius),
    [G_SCALED, planetMass, radius]
  )

  // Velocity ratio for gauge
  const vRatio = velocity / vRequired

  // Orbit status label
  const statusLabel = useMemo(() => {
    if (vRatio < 0.9) return { text: 'Too Slow', color: '#f87171', icon: 'down' }
    if (vRatio > 1.1) return { text: 'Too Fast', color: '#fb923c', icon: 'up' }
    return { text: 'Just Right', color: '#34d399', icon: 'check' }
  }, [vRatio])

  // Notify parent of param changes
  useEffect(() => {
    if (onParamChange) {
      onParamChange({ radius, velocity, planetMass })
    }
  }, [radius, velocity, planetMass, onParamChange])

  // Discovery tracking
  const prevParamsRef = useRef({ radius: defaultRadius, velocity: defaultVelocity, planetMass: defaultPlanetMass })
  useEffect(() => {
    const prev = prevParamsRef.current
    // Larger orbit -> slower required velocity
    if (radius > prev.radius + 30 && vRequired < Math.sqrt(G_SCALED * planetMass / prev.radius) - 5) {
      if (!discovered.has('larger-orbit-slower')) {
        const newDiscovered = new Set(discovered)
        newDiscovered.add('larger-orbit-slower')
        setDiscovered(newDiscovered)
        if (onDiscovery) onDiscovery('larger-orbit-slower')
      }
    }
    // More mass -> faster required velocity
    if (planetMass > prev.planetMass + 100 && vRequired > Math.sqrt(G_SCALED * prev.planetMass / radius) + 5) {
      if (!discovered.has('more-mass-faster')) {
        const newDiscovered = new Set(discovered)
        newDiscovered.add('more-mass-faster')
        setDiscovered(newDiscovered)
        if (onDiscovery) onDiscovery('more-mass-faster')
      }
    }
    prevParamsRef.current = { radius, velocity, planetMass }
  }, [radius, velocity, planetMass, vRequired, G_SCALED, discovered, onDiscovery])

  // Reset simulation state when params change
  useEffect(() => {
    stateRef.current = {
      angle: 0,
      currentR: radius,
      currentV: velocity,
      satX: radius,
      satY: 0,
      trail: [],
      crashed: false,
      escaped: false,
      stableTime: 0,
    }
    setOrbitState('idle')
  }, [radius, velocity, planetMass])

  // Start/stop simulation
  const handleToggle = useCallback(() => {
    if (isRunning) {
      setIsRunning(false)
      return
    }
    // Reset state for new run
    stateRef.current = {
      angle: 0,
      currentR: radius,
      currentV: velocity,
      satX: radius,
      satY: 0,
      trail: [],
      crashed: false,
      escaped: false,
      stableTime: 0,
    }
    setOrbitState('stable')
    setIsRunning(true)
  }, [isRunning, radius, velocity])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    setOrbitState('idle')
    stateRef.current = {
      angle: 0,
      currentR: radius,
      currentV: velocity,
      satX: radius,
      satY: 0,
      trail: [],
      crashed: false,
      escaped: false,
      stableTime: 0,
    }
  }, [radius, velocity])

  // Main animation and rendering loop
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

    const render = (now) => {
      if (!running) return

      const dt = Math.min((now - lastTime) / 1000, 0.05) // cap dt
      lastTime = now

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, canvasW, canvasH)

      // -- Background --
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, canvasW * 0.7)
      bgGrad.addColorStop(0, '#0c1222')
      bgGrad.addColorStop(1, '#020617')
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvasW, canvasH)

      // Stars
      ctx.fillStyle = 'rgba(148, 163, 184, 0.2)'
      for (let i = 0; i < 50; i++) {
        const sx = (i * 137.5 + 13) % canvasW
        const sy = (i * 73.7 + 7) % canvasH
        ctx.beginPath()
        ctx.arc(sx, sy, ((i * 37) % 3 === 0) ? 1 : 0.6, 0, TWO_PI)
        ctx.fill()
      }

      const st = stateRef.current

      // -- Update physics --
      if (isRunning && !st.crashed && !st.escaped) {
        const vReq = Math.sqrt(G_SCALED * planetMass / st.currentR)
        const ratio = st.currentV / vReq

        if (ratio >= 0.9 && ratio <= 1.1) {
          // Stable orbit: move in circle at current radius
          const omega = st.currentV / st.currentR
          st.angle += omega * dt
          st.satX = st.currentR * Math.cos(st.angle)
          st.satY = st.currentR * Math.sin(st.angle)
          st.stableTime += dt

          // Complete after 2 full orbits
          if (st.stableTime > (TWO_PI / omega) * 2 && !isComplete) {
            if (onComplete) {
              onComplete({ xp: 15 })
              setShowXP(true)
              setTimeout(() => setShowXP(false), 3000)
            }
          }
        } else if (ratio < 0.9) {
          // Too slow -> spiral inward
          setOrbitState('spiraling-in')
          const omega = st.currentV / st.currentR
          st.angle += omega * dt
          st.currentR -= (1 - ratio) * 80 * dt // spiral rate
          st.currentV = Math.sqrt(G_SCALED * planetMass / Math.max(st.currentR, 5)) * ratio

          if (st.currentR <= planetBaseRadius + 5) {
            st.crashed = true
            st.currentR = planetBaseRadius + 3
            setOrbitState('crashed')
            setIsRunning(false)
          }

          st.satX = st.currentR * Math.cos(st.angle)
          st.satY = st.currentR * Math.sin(st.angle)
        } else {
          // Too fast -> escape outward
          setOrbitState('escaping')
          const omega = st.currentV / st.currentR
          st.angle += omega * dt
          st.currentR += (ratio - 1) * 100 * dt // escape rate
          st.currentV += (ratio - 1) * 30 * dt

          const maxR = Math.max(canvasW, canvasH) * 0.6
          if (st.currentR > maxR) {
            st.escaped = true
            setOrbitState('escaped')
            setIsRunning(false)
          }

          st.satX = st.currentR * Math.cos(st.angle)
          st.satY = st.currentR * Math.sin(st.angle)
        }

        // Update trail
        st.trail.push({ x: st.satX, y: st.satY })
        if (st.trail.length > 300) st.trail.shift()
      }

      // -- Draw orbital path (dashed circle at set radius) --
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, TWO_PI)
      ctx.stroke()
      ctx.setLineDash([])

      // -- Draw planet --
      // Atmosphere glow
      const atmosGrad = ctx.createRadialGradient(
        centerX, centerY, planetBaseRadius * 0.8,
        centerX, centerY, planetBaseRadius * 2.5
      )
      atmosGrad.addColorStop(0, 'rgba(99, 102, 241, 0.15)')
      atmosGrad.addColorStop(1, 'rgba(99, 102, 241, 0)')
      ctx.fillStyle = atmosGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, planetBaseRadius * 2.5, 0, TWO_PI)
      ctx.fill()

      // Planet body
      const planetGrad = ctx.createRadialGradient(
        centerX - planetBaseRadius * 0.3, centerY - planetBaseRadius * 0.3, 0,
        centerX, centerY, planetBaseRadius
      )
      planetGrad.addColorStop(0, '#6366f1')
      planetGrad.addColorStop(0.6, '#4338ca')
      planetGrad.addColorStop(1, '#1e1b4b')
      ctx.fillStyle = planetGrad
      ctx.beginPath()
      ctx.arc(centerX, centerY, planetBaseRadius, 0, TWO_PI)
      ctx.fill()

      // Planet surface detail
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.2)'
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.ellipse(centerX, centerY, planetBaseRadius * 0.9, planetBaseRadius * 0.3, 0.2, 0, TWO_PI)
      ctx.stroke()

      // Planet label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '9px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`M = ${planetMass}`, centerX, centerY + planetBaseRadius + 14)

      // -- Draw trail --
      if (st.trail.length > 1) {
        ctx.strokeStyle = orbitState === 'crashed' ? 'rgba(248, 113, 113, 0.4)'
          : orbitState === 'escaped' || orbitState === 'escaping' ? 'rgba(251, 146, 60, 0.4)'
          : 'rgba(52, 211, 153, 0.3)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        for (let i = 0; i < st.trail.length; i++) {
          const px = centerX + st.trail[i].x
          const py = centerY - st.trail[i].y
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }

      // -- Draw satellite --
      const satScreenX = centerX + st.satX
      const satScreenY = centerY - st.satY
      const satRadius = 6

      if (!st.escaped) {
        // Gravity/centripetal force arrow (toward planet)
        if (isRunning && !st.crashed) {
          const dx = centerX - satScreenX
          const dy = centerY - satScreenY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > planetBaseRadius + 15) {
            const arrowLen = Math.min(40, dist * 0.3)
            const nx = dx / dist
            const ny = dy / dist
            const ax = satScreenX + nx * 12
            const ay = satScreenY + ny * 12
            const bx = satScreenX + nx * (12 + arrowLen)
            const by = satScreenY + ny * (12 + arrowLen)

            ctx.strokeStyle = 'rgba(248, 113, 113, 0.7)'
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(ax, ay)
            ctx.lineTo(bx, by)
            ctx.stroke()

            // Arrowhead
            const headLen = 6
            const angle = Math.atan2(by - ay, bx - ax)
            ctx.fillStyle = 'rgba(248, 113, 113, 0.7)'
            ctx.beginPath()
            ctx.moveTo(bx, by)
            ctx.lineTo(bx - headLen * Math.cos(angle - 0.4), by - headLen * Math.sin(angle - 0.4))
            ctx.lineTo(bx - headLen * Math.cos(angle + 0.4), by - headLen * Math.sin(angle + 0.4))
            ctx.closePath()
            ctx.fill()

            // Force label
            ctx.fillStyle = 'rgba(248, 113, 113, 0.6)'
            ctx.font = '9px sans-serif'
            ctx.textAlign = 'center'
            ctx.fillText('F_g', (ax + bx) / 2 + 10, (ay + by) / 2)
          }
        }

        // Velocity vector (tangent to orbit)
        if (isRunning && !st.crashed) {
          const angle = st.angle
          // Tangent direction (perpendicular to radius, counterclockwise)
          const tx = -Math.sin(angle)
          const ty = Math.cos(angle) // Note: screen y is inverted
          const vLen = Math.min(35, st.currentV * 0.5)
          const vx = satScreenX + tx * vLen
          const vy = satScreenY - ty * vLen // screen y inversion

          ctx.strokeStyle = 'rgba(52, 211, 153, 0.7)'
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(satScreenX, satScreenY)
          ctx.lineTo(vx, vy)
          ctx.stroke()

          // Arrowhead
          const headLen = 5
          const vAngle = Math.atan2(vy - satScreenY, vx - satScreenX)
          ctx.fillStyle = 'rgba(52, 211, 153, 0.7)'
          ctx.beginPath()
          ctx.moveTo(vx, vy)
          ctx.lineTo(vx - headLen * Math.cos(vAngle - 0.4), vy - headLen * Math.sin(vAngle - 0.4))
          ctx.lineTo(vx - headLen * Math.cos(vAngle + 0.4), vy - headLen * Math.sin(vAngle + 0.4))
          ctx.closePath()
          ctx.fill()

          ctx.fillStyle = 'rgba(52, 211, 153, 0.6)'
          ctx.font = '9px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText('v', vx + 8, vy)
        }

        // Satellite glow
        ctx.shadowColor = st.crashed ? '#ef4444' : '#34d399'
        ctx.shadowBlur = 15
        ctx.fillStyle = st.crashed ? '#f87171' : '#34d399'
        ctx.beginPath()
        ctx.arc(satScreenX, satScreenY, satRadius, 0, TWO_PI)
        ctx.fill()
        ctx.shadowBlur = 0

        // Satellite inner
        ctx.fillStyle = st.crashed ? '#fca5a5' : '#6ee7b7'
        ctx.beginPath()
        ctx.arc(satScreenX, satScreenY, satRadius * 0.5, 0, TWO_PI)
        ctx.fill()

        // Crash effect
        if (st.crashed) {
          for (let i = 0; i < 8; i++) {
            const eAngle = (i / 8) * TWO_PI
            const eR = 10 + Math.random() * 15
            ctx.strokeStyle = `rgba(248, 113, 113, ${0.3 + Math.random() * 0.4})`
            ctx.lineWidth = 1.5
            ctx.beginPath()
            ctx.moveTo(satScreenX, satScreenY)
            ctx.lineTo(
              satScreenX + Math.cos(eAngle) * eR,
              satScreenY + Math.sin(eAngle) * eR
            )
            ctx.stroke()
          }

          ctx.fillStyle = 'rgba(239, 68, 68, 0.3)'
          ctx.beginPath()
          ctx.arc(satScreenX, satScreenY, 20, 0, TWO_PI)
          ctx.fill()
        }
      }

      // -- HUD Text --
      ctx.fillStyle = '#94a3b8'
      ctx.font = '10px monospace'
      ctx.textAlign = 'left'
      ctx.fillText(`v = ${st.currentV.toFixed(1)} m/s`, 10, 16)
      ctx.fillText(`v_req = ${vRequired.toFixed(1)} m/s`, 10, 30)
      ctx.fillText(`r = ${st.currentR.toFixed(0)}`, 10, 44)

      ctx.restore()

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [canvasW, canvasH, centerX, centerY, radius, velocity, planetMass, planetBaseRadius, isRunning, orbitState, vRequired, G_SCALED, isComplete, onComplete])

  // Fill percent helper
  const fillPct = (val, min, max) => ((val - min) / (max - min)) * 100

  // Gauge bar segments
  const gaugeSegments = useMemo(() => {
    const clamped = Math.max(0, Math.min(2, vRatio))
    return clamped
  }, [vRatio])

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/40">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ height: canvasH }}
        />

        {/* Status overlay */}
        <AnimatePresence>
          {(orbitState === 'crashed' || orbitState === 'escaped') && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className={`px-5 py-3 rounded-xl backdrop-blur-md border ${
                orbitState === 'crashed'
                  ? 'bg-red-500/15 border-red-500/30'
                  : 'bg-orange-500/15 border-orange-500/30'
              }`}>
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className={orbitState === 'crashed' ? 'text-red-400' : 'text-orange-400'} />
                  <span className={`text-sm font-bold ${orbitState === 'crashed' ? 'text-red-300' : 'text-orange-300'}`}>
                    {orbitState === 'crashed' ? 'Satellite Crashed!' : 'Satellite Escaped!'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {orbitState === 'crashed'
                    ? 'Velocity too low -- increase it to maintain orbit'
                    : 'Velocity too high -- decrease it to maintain orbit'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Velocity gauge bar */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-500">Orbital Velocity Match</span>
          <span className={`text-xs font-bold ${statusLabel.color === '#34d399' ? 'text-emerald-400' : statusLabel.color === '#f87171' ? 'text-red-400' : 'text-orange-400'}`}>
            {statusLabel.text}
          </span>
        </div>
        <div className="relative h-4 rounded-full overflow-hidden bg-slate-900/80 border border-slate-700/30">
          {/* Segments: red -> yellow -> green -> yellow -> red */}
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-gradient-to-r from-red-600/40 to-red-500/30" />
            <div className="flex-1 bg-gradient-to-r from-amber-500/30 to-amber-400/20" />
            <div className="flex-1 bg-gradient-to-r from-emerald-500/40 to-emerald-400/40" />
            <div className="flex-1 bg-gradient-to-r from-amber-400/20 to-amber-500/30" />
            <div className="flex-1 bg-gradient-to-r from-red-500/30 to-red-600/40" />
          </div>
          {/* Marker for "just right" zone */}
          <div
            className="absolute top-0 bottom-0 border-l border-r border-emerald-400/40"
            style={{ left: '40%', width: '20%' }}
          />
          {/* Current position indicator */}
          <div
            className="absolute top-0 bottom-0 w-1 rounded-full transition-all duration-300"
            style={{
              left: `${Math.max(0, Math.min(100, (gaugeSegments / 2) * 100))}%`,
              backgroundColor: statusLabel.color,
              boxShadow: `0 0 8px ${statusLabel.color}`,
            }}
          />
        </div>
        <div className="flex justify-between text-[9px] text-slate-600 mt-0.5 font-mono">
          <span>Too Slow</span>
          <span>Just Right</span>
          <span>Too Fast</span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-3">
        {/* Orbital radius */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-slate-300">Orbital Radius</label>
            <span className="font-mono text-sm font-medium text-indigo-300 tabular-nums">
              {radius}<span className="text-slate-500 ml-0.5">px</span>
            </span>
          </div>
          <input
            type="range" min={50} max={220} step={5}
            value={radius}
            onChange={(e) => setRadius(parseFloat(e.target.value))}
            disabled={isRunning}
            className="sim-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${fillPct(radius, 50, 220)}%, #1e293b ${fillPct(radius, 50, 220)}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-0.5">
            <span>50</span><span>220</span>
          </div>
        </div>

        {/* Satellite velocity */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-slate-300">Satellite Velocity</label>
            <span className="font-mono text-sm font-medium text-indigo-300 tabular-nums">
              {velocity.toFixed(1)}<span className="text-slate-500 ml-0.5">m/s</span>
            </span>
          </div>
          <input
            type="range" min={10} max={200} step={1}
            value={velocity}
            onChange={(e) => setVelocity(parseFloat(e.target.value))}
            disabled={isRunning}
            className="sim-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${fillPct(velocity, 10, 200)}%, #1e293b ${fillPct(velocity, 10, 200)}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-0.5">
            <span>10</span><span>200 m/s</span>
          </div>
        </div>

        {/* Planet mass */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm text-slate-300">Planet Mass</label>
            <span className="font-mono text-sm font-medium text-indigo-300 tabular-nums">
              {planetMass}<span className="text-slate-500 ml-0.5">units</span>
            </span>
          </div>
          <input
            type="range" min={100} max={2000} step={50}
            value={planetMass}
            onChange={(e) => setPlanetMass(parseFloat(e.target.value))}
            disabled={isRunning}
            className="sim-slider w-full h-2 rounded-full appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: `linear-gradient(to right, #6366f1 0%, #818cf8 ${fillPct(planetMass, 100, 2000)}%, #1e293b ${fillPct(planetMass, 100, 2000)}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-0.5">
            <span>100</span><span>2000</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <motion.button
          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium shadow-lg cursor-pointer ${
            isRunning
              ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-500/25'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25'
          }`}
          onClick={handleToggle}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {isRunning ? 'Stop' : (orbitState !== 'idle' ? 'Restart' : 'Launch')}
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

        {isRunning && orbitState === 'stable' && (
          <div className="flex items-center gap-2 ml-auto">
            <CheckCircle size={14} className="text-emerald-400" />
            <span className="text-xs text-emerald-400 font-medium">Stable orbit</span>
          </div>
        )}
      </div>

      {/* Formula reference */}
      <div className="px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/30 space-y-1">
        <p className="text-xs text-slate-500 font-mono">
          v_required = {'\u221A'}(G{'\u00B7'}M / r) = {'\u221A'}({G_SCALED}{'\u00B7'}{planetMass} / {radius}) = {vRequired.toFixed(1)} m/s
        </p>
        <p className="text-xs text-slate-600">
          For a circular orbit, gravitational force provides the centripetal acceleration.
        </p>
      </div>

      {/* Discoveries */}
      <AnimatePresence>
        {discovered.size > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-1"
          >
            {discovered.has('larger-orbit-slower') && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                <Zap size={12} className="text-purple-400" />
                Discovery: Larger orbits require slower velocities
              </div>
            )}
            {discovered.has('more-mass-faster') && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                <Zap size={12} className="text-purple-400" />
                Discovery: More massive planets require faster orbital velocities
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* XP notification */}
      <AnimatePresence>
        {showXP && (
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

export default CircularOrbit
