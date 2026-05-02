import { useRef, useState, useEffect, useCallback, useMemo } from 'react'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TRAIL_COLORS = [
  { main: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },   // amber
  { main: '#06b6d4', glow: 'rgba(6,182,212,0.35)' },     // cyan
  { main: '#22c55e', glow: 'rgba(34,197,94,0.35)' },      // green
  { main: '#ec4899', glow: 'rgba(236,72,153,0.35)' },     // pink
  { main: '#a855f7', glow: 'rgba(168,85,247,0.35)' },     // purple
]

const BG_COLOR = '#0f172a'
const GRID_COLOR = 'rgba(100,116,139,0.12)'
const GRID_AXIS_COLOR = 'rgba(100,116,139,0.25)'
const GROUND_COLOR = 'rgba(100,116,139,0.4)'
const TEXT_COLOR = 'rgba(203,213,225,0.85)'
const DIM_TEXT = 'rgba(148,163,184,0.6)'
const CANNON_BODY = '#475569'
const CANNON_BORE = '#64748b'
const CANNON_ACCENT = '#f59e0b'

const PROJECTILE_RADIUS = 4
const TRAIL_DOT_RADIUS = 1.8
const SIMULATION_DT = 1 / 120 // physics sub-step
const TRAIL_SAMPLE_INTERVAL = 0.016 // record trail point every ~16ms of sim time
const PADDING_FACTOR = 1.2
const MIN_WORLD_SIZE = 30 // minimum visible range in meters
const CANNON_LENGTH = 18 // pixels
const CANNON_WIDTH = 7

// ---------------------------------------------------------------------------
// Helper: Physics calculations
// ---------------------------------------------------------------------------

function computeAnalytical(v0, angleDeg, g) {
  const rad = (angleDeg * Math.PI) / 180
  const sinA = Math.sin(rad)
  const cosA = Math.cos(rad)
  const sin2A = Math.sin(2 * rad)
  const range = (v0 * v0 * sin2A) / g
  const maxHeight = (v0 * v0 * sinA * sinA) / (2 * g)
  const timeOfFlight = (2 * v0 * sinA) / g
  return { range: Math.max(0, range), maxHeight, timeOfFlight, vx: v0 * cosA, vy0: v0 * sinA }
}

function positionAtTime(v0, angleDeg, g, t) {
  const rad = (angleDeg * Math.PI) / 180
  const vx = v0 * Math.cos(rad)
  const vy0 = v0 * Math.sin(rad)
  const x = vx * t
  const y = vy0 * t - 0.5 * g * t * t
  return { x, y, vx, vy: vy0 - g * t }
}

// ---------------------------------------------------------------------------
// Helper: Particle effects
// ---------------------------------------------------------------------------

function createBurstParticles(x, y, color, count = 12) {
  const particles = []
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
    const speed = 30 + Math.random() * 50
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
      decay: 1.5 + Math.random() * 1.5,
      size: 1.5 + Math.random() * 2,
      color,
    })
  }
  return particles
}

function createImpactParticles(x, y, color, count = 8) {
  const particles = []
  for (let i = 0; i < count; i++) {
    const angle = -Math.PI * Math.random() // upward hemisphere
    const speed = 20 + Math.random() * 40
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed * 0.7,
      life: 1.0,
      decay: 2.0 + Math.random() * 1.5,
      size: 1.2 + Math.random() * 1.8,
      color,
    })
  }
  return particles
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ProjectileLauncher({
  config = {},
  params = {},
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete = false,
  containerWidth = 800,
  containerHeight = 500,
}) {
  // Merge defaults
  const cfg = useMemo(() => ({
    gravity: 10,
    showTrail: true,
    showVectors: true,
    groundLevel: 0,
    maxProjectiles: 5,
    ...config,
  }), [config])

  const currentParams = useMemo(() => ({
    velocity: 20,
    angle: 45,
    gravity: cfg.gravity,
    ...params,
  }), [params, cfg.gravity])

  // ---- Refs ----
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)
  const particlesRef = useRef([])
  const discoveredRef = useRef(new Set())
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 })

  // ---- State ----
  const [projectiles, setProjectiles] = useState([]) // frozen completed trails
  const [activeProjectile, setActiveProjectile] = useState(null)
  const [showVectors, setShowVectors] = useState(cfg.showVectors)
  const [showAccel, setShowAccel] = useState(false)
  const [showComponents, setShowComponents] = useState(false)
  const [launchCount, setLaunchCount] = useState(0)
  const [liveReadout, setLiveReadout] = useState(null)

  // We store a mutable ref for the active projectile so the rAF loop can
  // read the latest value without depending on React state re-renders.
  const activeRef = useRef(null)
  const projectilesRef = useRef([])
  const showVectorsRef = useRef(showVectors)
  const showAccelRef = useRef(showAccel)
  const showComponentsRef = useRef(showComponents)

  useEffect(() => { activeRef.current = activeProjectile }, [activeProjectile])
  useEffect(() => { projectilesRef.current = projectiles }, [projectiles])
  useEffect(() => { showVectorsRef.current = showVectors }, [showVectors])
  useEffect(() => { showAccelRef.current = showAccel }, [showAccel])
  useEffect(() => { showComponentsRef.current = showComponents }, [showComponents])

  // ---- Coordinate system ----
  // Compute world bounds so the longest plausible trajectory fits
  const worldBounds = useMemo(() => {
    const v = currentParams.velocity
    const g = currentParams.gravity
    const maxRange = (v * v) / g // at 45 degrees
    const maxH = (v * v) / (2 * g)
    // Also consider frozen projectiles
    let maxX = maxRange
    let maxY = maxH
    for (const p of projectiles) {
      if (p.range > maxX) maxX = p.range
      if (p.maxHeight > maxY) maxY = p.maxHeight
    }
    if (activeProjectile) {
      if (activeProjectile.analytical.range > maxX) maxX = activeProjectile.analytical.range
      if (activeProjectile.analytical.maxHeight > maxY) maxY = activeProjectile.analytical.maxHeight
    }
    const worldW = Math.max(MIN_WORLD_SIZE, maxX * PADDING_FACTOR)
    const worldH = Math.max(MIN_WORLD_SIZE * 0.6, maxY * PADDING_FACTOR)
    return { xMax: worldW, yMax: worldH }
  }, [currentParams.velocity, currentParams.gravity, projectiles, activeProjectile])

  // ---- Canvas sizing via ResizeObserver ----
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width
        if (w === 0) continue
        const h = Math.max(280, Math.min(520, w * 0.55))
        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        canvas.style.width = `${w}px`
        canvas.style.height = `${h}px`
        sizeRef.current = { width: w, height: h, dpr }
      }
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  // ---- Coordinate transforms ----
  const marginLeft = 50
  const marginBottom = 36
  const marginTop = 16
  const marginRight = 20

  const toPixel = useCallback((physX, physY) => {
    const { width, height } = sizeRef.current
    const drawW = width - marginLeft - marginRight
    const drawH = height - marginTop - marginBottom
    const px = marginLeft + (physX / worldBounds.xMax) * drawW
    const py = (height - marginBottom) - (physY / worldBounds.yMax) * drawH
    return { x: px, y: py }
  }, [worldBounds])

  const toPixelScale = useCallback((physLen, axis = 'x') => {
    const { width, height } = sizeRef.current
    const drawW = width - marginLeft - marginRight
    const drawH = height - marginTop - marginBottom
    if (axis === 'x') return (physLen / worldBounds.xMax) * drawW
    return (physLen / worldBounds.yMax) * drawH
  }, [worldBounds])

  // ---- Discovery checking ----
  const checkDiscoveries = useCallback((allProjectiles) => {
    if (!onDiscovery) return
    const discovered = discoveredRef.current

    // 1. max-range-45: any launch at 43-47 degrees has the longest range
    if (!discovered.has('max-range-45') && allProjectiles.length >= 2) {
      const sorted = [...allProjectiles].sort((a, b) => b.range - a.range)
      const best = sorted[0]
      if (best.params.angle >= 43 && best.params.angle <= 47 && allProjectiles.length > 1) {
        discovered.add('max-range-45')
        onDiscovery('max-range-45')
      }
    }

    // 2. complementary-angles: two launches with angles summing to 88-92 and ranges within 5%
    if (!discovered.has('complementary-angles') && allProjectiles.length >= 2) {
      for (let i = 0; i < allProjectiles.length; i++) {
        for (let j = i + 1; j < allProjectiles.length; j++) {
          const a = allProjectiles[i]
          const b = allProjectiles[j]
          // Must share the same gravity to be a fair comparison
          if (Math.abs(a.params.gravity - b.params.gravity) > 0.5) continue
          const angleSum = a.params.angle + b.params.angle
          if (angleSum >= 88 && angleSum <= 92) {
            const avgRange = (a.range + b.range) / 2
            if (avgRange > 0 && Math.abs(a.range - b.range) / avgRange < 0.05) {
              discovered.add('complementary-angles')
              onDiscovery('complementary-angles')
            }
          }
        }
      }
    }

    // 3. gravity-effect: low gravity range > 2x high gravity range
    if (!discovered.has('gravity-effect') && allProjectiles.length >= 2) {
      const lowG = allProjectiles.filter((p) => p.params.gravity < 5)
      const highG = allProjectiles.filter((p) => p.params.gravity >= 10)
      for (const lo of lowG) {
        for (const hi of highG) {
          if (lo.range > 2 * hi.range) {
            discovered.add('gravity-effect')
            onDiscovery('gravity-effect')
          }
        }
      }
    }
  }, [onDiscovery])

  // ---- Launch ----
  const launch = useCallback(() => {
    const v0 = currentParams.velocity
    const angle = currentParams.angle
    const g = currentParams.gravity

    const analytical = computeAnalytical(v0, angle, g)
    const colorIdx = launchCount % TRAIL_COLORS.length
    const color = TRAIL_COLORS[colorIdx]

    // If there is an in-flight projectile, freeze it immediately
    if (activeRef.current) {
      const prev = activeRef.current
      setProjectiles((old) => {
        const updated = [...old, {
          trail: prev.trail,
          color: prev.color,
          range: prev.analytical.range,
          maxHeight: prev.analytical.maxHeight,
          timeOfFlight: prev.analytical.timeOfFlight,
          params: prev.params,
          analytical: prev.analytical,
        }]
        // Keep max projectiles
        if (updated.length > cfg.maxProjectiles) {
          return updated.slice(updated.length - cfg.maxProjectiles)
        }
        return updated
      })
    }

    const newProj = {
      v0,
      angle,
      g,
      t: 0,
      trail: [{ x: 0, y: 0 }],
      lastTrailTime: 0,
      color,
      colorIndex: colorIdx,
      analytical,
      params: { velocity: v0, angle, gravity: g },
      startTime: performance.now(),
      landed: false,
      currentPos: { x: 0, y: 0 },
      currentVel: { vx: analytical.vx, vy: analytical.vy0 },
    }

    // Create launch burst
    const cannonTip = toPixel(0, 0)
    particlesRef.current = [
      ...particlesRef.current,
      ...createBurstParticles(cannonTip.x, cannonTip.y, color.main, 10),
    ]

    setActiveProjectile(newProj)
    setLaunchCount((c) => c + 1)
    setLiveReadout({
      range: analytical.range,
      maxHeight: analytical.maxHeight,
      timeOfFlight: analytical.timeOfFlight,
      currentT: 0,
      params: { velocity: v0, angle, gravity: g },
    })
    lastTimeRef.current = null
  }, [currentParams, launchCount, cfg.maxProjectiles, toPixel])

  // ---- Finalize projectile ----
  const finalizeProjectile = useCallback((proj) => {
    const frozen = {
      trail: proj.trail,
      color: proj.color,
      range: proj.analytical.range,
      maxHeight: proj.analytical.maxHeight,
      timeOfFlight: proj.analytical.timeOfFlight,
      params: proj.params,
      analytical: proj.analytical,
    }

    // Impact particles
    const landingPx = toPixel(proj.analytical.range, 0)
    particlesRef.current = [
      ...particlesRef.current,
      ...createImpactParticles(landingPx.x, landingPx.y, proj.color.main, 8),
    ]

    setProjectiles((old) => {
      const updated = [...old, frozen]
      if (updated.length > cfg.maxProjectiles) {
        return updated.slice(updated.length - cfg.maxProjectiles)
      }
      // Check discoveries after adding
      setTimeout(() => checkDiscoveries(updated), 0)
      return updated
    })
    setActiveProjectile(null)
    setLiveReadout((prev) => prev ? { ...prev, currentT: proj.analytical.timeOfFlight, done: true } : null)
  }, [cfg.maxProjectiles, toPixel, checkDiscoveries])

  // ---- Animation / Render loop ----
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true

    const frame = (timestamp) => {
      if (!running) return

      const { width, height, dpr } = sizeRef.current
      if (width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(frame)
        return
      }

      // Delta time for particles
      const now = timestamp
      const rawDt = lastTimeRef.current != null ? (now - lastTimeRef.current) / 1000 : 0
      const dt = Math.min(rawDt, 0.05) // cap to prevent spiral of death
      lastTimeRef.current = now

      ctx.save()
      ctx.scale(dpr, dpr)

      // ----- Update active projectile -----
      const active = activeRef.current
      if (active && !active.landed) {
        active.t += dt
        const t = active.t
        const pos = positionAtTime(active.v0, active.angle, active.g, t)

        if (pos.y <= 0 && t > 0.01) {
          // Landed - snap to analytical landing point
          active.currentPos = { x: active.analytical.range, y: 0 }
          active.currentVel = { vx: pos.vx, vy: pos.vy }
          active.trail.push({ x: active.analytical.range, y: 0 })
          active.landed = true
          finalizeProjectile(active)
        } else {
          active.currentPos = { x: pos.x, y: Math.max(0, pos.y) }
          active.currentVel = { vx: pos.vx, vy: pos.vy }
          // Sample trail
          if (t - active.lastTrailTime >= TRAIL_SAMPLE_INTERVAL) {
            active.trail.push({ x: pos.x, y: Math.max(0, pos.y) })
            active.lastTrailTime = t
          }
          // Update live readout (throttled by rAF)
          setLiveReadout((prev) => prev && !prev.done ? {
            ...prev,
            currentT: t,
            currentX: pos.x,
            currentY: Math.max(0, pos.y),
            currentVx: pos.vx,
            currentVy: pos.vy,
          } : prev)
        }
      }

      // ----- Update particles -----
      const particles = particlesRef.current
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 60 * dt // gravity on particles (pixel space)
        p.life -= p.decay * dt
        if (p.life <= 0) {
          particles.splice(i, 1)
        }
      }

      // ----- Draw -----
      const drawW = width - marginLeft - marginRight
      const drawH = height - marginTop - marginBottom
      const worldW = worldBounds.xMax
      const worldH = worldBounds.yMax
      const originPx = { x: marginLeft, y: height - marginBottom }

      // Convert physics to pixel (local closure for perf)
      const px = (physX, physY) => ({
        x: marginLeft + (physX / worldW) * drawW,
        y: (height - marginBottom) - (physY / worldH) * drawH,
      })
      const pxScaleX = (v) => (v / worldW) * drawW
      const pxScaleY = (v) => (v / worldH) * drawH

      // Background
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, width, height)

      // Grid
      drawGrid(ctx, width, height, worldW, worldH, originPx, drawW, drawH)

      // Frozen trails
      const frozenProjs = projectilesRef.current
      for (const fp of frozenProjs) {
        drawTrail(ctx, fp.trail, fp.color, px, 0.55)
        // Range marker
        drawRangeMarker(ctx, fp.range, fp.color.main, px, fp.analytical)
        // Max height dashed line
        drawMaxHeightLine(ctx, fp.maxHeight, fp.color.main, px, drawW, marginLeft)
      }

      // Active projectile
      if (active && !active.landed) {
        // Trail
        drawTrail(ctx, active.trail, active.color, px, 1.0)

        // Projectile
        const projPx = px(active.currentPos.x, active.currentPos.y)
        drawProjectile(ctx, projPx, active.color)

        // Velocity vectors
        if (showVectorsRef.current) {
          drawVelocityVector(ctx, projPx, active.currentVel, active.color.main, pxScaleX, pxScaleY, showComponentsRef.current)
        }

        // Acceleration vector
        if (showAccelRef.current) {
          drawAccelVector(ctx, projPx, active.g, pxScaleY)
        }

        // Predicted landing + max height markers (light)
        drawRangeMarker(ctx, active.analytical.range, active.color.main, px, active.analytical, true)
        drawMaxHeightLine(ctx, active.analytical.maxHeight, active.color.main, px, drawW, marginLeft, true)
      }

      // Cannon
      drawCannon(ctx, originPx, currentParams.angle, active != null && !active?.landed)

      // Particles
      for (const p of particles) {
        ctx.globalAlpha = Math.max(0, p.life)
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Scale labels on axes
      drawAxisLabels(ctx, worldW, worldH, originPx, drawW, drawH, width, height)

      ctx.restore()

      rafRef.current = requestAnimationFrame(frame)
    }

    rafRef.current = requestAnimationFrame(frame)

    return () => {
      running = false
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [worldBounds, currentParams.angle, finalizeProjectile])

  // ---- Canvas tap to launch ----
  const handleCanvasTap = useCallback((e) => {
    // Prevent double-fire on touch devices
    if (e.type === 'touchend') e.preventDefault()
    launch()
  }, [launch])

  // ---- Clear trails ----
  const clearTrails = useCallback(() => {
    setProjectiles([])
    setActiveProjectile(null)
    setLiveReadout(null)
    setLaunchCount(0)
    particlesRef.current = []
    discoveredRef.current = new Set()
  }, [])

  // ---- Analytical preview for current params ----
  const preview = useMemo(() => {
    return computeAnalytical(currentParams.velocity, currentParams.angle, currentParams.gravity)
  }, [currentParams.velocity, currentParams.angle, currentParams.gravity])

  // ---- Render ----
  return (
    <div className="flex flex-col gap-3 w-full select-none">
      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-slate-700/40 bg-slate-900/80"
        style={{ minHeight: 280 }}
      >
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          onClick={handleCanvasTap}
          onTouchEnd={handleCanvasTap}
        />

        {/* Live readout overlay (top-right of canvas) */}
        <div className="absolute top-2.5 right-2.5 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-sm border border-slate-700/40 rounded-lg px-3 py-2 text-xs font-mono space-y-0.5 min-w-[150px]">
            {liveReadout ? (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Range</span>
                  <span className="text-amber-300">{liveReadout.range.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Max H</span>
                  <span className="text-cyan-300">{liveReadout.maxHeight.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">T flight</span>
                  <span className="text-green-300">{liveReadout.timeOfFlight.toFixed(2)} s</span>
                </div>
                {liveReadout.currentT != null && !liveReadout.done && (
                  <div className="flex justify-between gap-4 border-t border-slate-700/30 pt-0.5 mt-0.5">
                    <span className="text-slate-500">t</span>
                    <span className="text-slate-300">{liveReadout.currentT.toFixed(2)} s</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Range</span>
                  <span className="text-slate-500">{preview.range.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">Max H</span>
                  <span className="text-slate-500">{preview.maxHeight.toFixed(1)} m</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-slate-400">T flight</span>
                  <span className="text-slate-500">{preview.timeOfFlight.toFixed(2)} s</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Parameter display (top-left of canvas) */}
        <div className="absolute top-2.5 left-2.5 pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-sm border border-slate-700/40 rounded-lg px-3 py-2 text-xs font-mono space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">v₀</span>
              <span className="text-indigo-300">{currentParams.velocity} m/s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">{'\u03B8'}</span>
              <span className="text-indigo-300">{currentParams.angle}{'\u00B0'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">g</span>
              <span className="text-indigo-300">{currentParams.gravity} m/s{'\u00B2'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls row */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Launch button */}
        <button
          onClick={launch}
          className="px-5 py-2 rounded-lg font-semibold text-sm bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-600/25 transition-colors active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
        >
          Launch
        </button>

        {/* Clear button */}
        <button
          onClick={clearTrails}
          className="px-4 py-2 rounded-lg text-sm border border-slate-600 text-slate-300 hover:bg-slate-800/60 hover:border-slate-500 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500/50"
        >
          Clear
        </button>

        <div className="w-px h-6 bg-slate-700/50 mx-1" />

        {/* Toggle: Velocity vectors */}
        <ToggleButton
          active={showVectors}
          onClick={() => setShowVectors((v) => !v)}
          label="Velocity"
        />

        {/* Toggle: Acceleration */}
        <ToggleButton
          active={showAccel}
          onClick={() => setShowAccel((v) => !v)}
          label="Gravity"
        />

        {/* Toggle: Components */}
        <ToggleButton
          active={showComponents}
          onClick={() => setShowComponents((v) => !v)}
          label="H/V Split"
        />

        {/* Trail count */}
        <span className="ml-auto text-xs text-slate-500 font-mono">
          {projectiles.length}/{cfg.maxProjectiles} trails
        </span>
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SliderControl
          label="Launch Speed"
          unit="m/s"
          min={5}
          max={50}
          step={1}
          value={currentParams.velocity}
          onChange={(v) => onParamChange?.('velocity', v)}
          color="indigo"
        />
        <SliderControl
          label="Launch Angle"
          unit={'\u00B0'}
          min={0}
          max={90}
          step={1}
          value={currentParams.angle}
          onChange={(v) => onParamChange?.('angle', v)}
          color="purple"
        />
        <SliderControl
          label="Gravity"
          unit="m/s\u00B2"
          min={1}
          max={20}
          step={0.5}
          value={currentParams.gravity}
          onChange={(v) => onParamChange?.('gravity', v)}
          color="amber"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ToggleButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
        active
          ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
          : 'bg-slate-800/40 text-slate-500 border border-slate-700/40 hover:text-slate-400 hover:border-slate-600/40'
      }`}
    >
      {label}
    </button>
  )
}

function SliderControl({ label, unit, min, max, step, value, onChange, color = 'indigo' }) {
  const colorMap = {
    indigo: { track: 'accent-indigo-500', text: 'text-indigo-300' },
    purple: { track: 'accent-purple-500', text: 'text-purple-300' },
    amber: { track: 'accent-amber-500', text: 'text-amber-300' },
  }
  const c = colorMap[color] || colorMap.indigo

  return (
    <div className="flex flex-col gap-1 bg-slate-800/30 rounded-lg border border-slate-700/30 px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        <span className={`text-xs font-mono font-semibold ${c.text}`}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`w-full h-1.5 rounded-full appearance-none bg-slate-700/50 cursor-pointer ${c.track}`}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Canvas drawing functions
// ---------------------------------------------------------------------------

function drawGrid(ctx, width, height, worldW, worldH, origin, drawW, drawH) {
  // Compute a nice grid step
  const xStep = niceStep(worldW, 8)
  const yStep = niceStep(worldH, 6)

  ctx.strokeStyle = GRID_COLOR
  ctx.lineWidth = 0.5

  // Vertical grid lines
  for (let x = xStep; x < worldW; x += xStep) {
    const px = origin.x + (x / worldW) * drawW
    ctx.beginPath()
    ctx.moveTo(px, origin.y)
    ctx.lineTo(px, origin.y - drawH)
    ctx.stroke()
  }

  // Horizontal grid lines
  for (let y = yStep; y < worldH; y += yStep) {
    const py = origin.y - (y / worldH) * drawH
    ctx.beginPath()
    ctx.moveTo(origin.x, py)
    ctx.lineTo(origin.x + drawW, py)
    ctx.stroke()
  }

  // Ground line (x-axis)
  ctx.strokeStyle = GROUND_COLOR
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(origin.x, origin.y)
  ctx.lineTo(origin.x + drawW, origin.y)
  ctx.stroke()

  // Y-axis
  ctx.strokeStyle = GRID_AXIS_COLOR
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(origin.x, origin.y)
  ctx.lineTo(origin.x, origin.y - drawH)
  ctx.stroke()
}

function drawAxisLabels(ctx, worldW, worldH, origin, drawW, drawH, canvasW, canvasH) {
  const xStep = niceStep(worldW, 8)
  const yStep = niceStep(worldH, 6)

  ctx.fillStyle = DIM_TEXT
  ctx.font = '10px ui-monospace, SFMono-Regular, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'

  // X-axis labels
  for (let x = 0; x <= worldW; x += xStep) {
    const px = origin.x + (x / worldW) * drawW
    if (px > canvasW - 10) break
    ctx.fillText(`${Math.round(x)}`, px, origin.y + 4)
  }

  // Y-axis labels
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  for (let y = yStep; y <= worldH; y += yStep) {
    const py = origin.y - (y / worldH) * drawH
    if (py < 10) break
    ctx.fillText(`${Math.round(y)}`, origin.x - 6, py)
  }

  // Axis titles
  ctx.fillStyle = 'rgba(148,163,184,0.4)'
  ctx.font = '9px ui-monospace, SFMono-Regular, monospace'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText('x (m)', origin.x + drawW / 2, origin.y + 18)

  ctx.save()
  ctx.translate(12, origin.y - drawH / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  ctx.fillText('y (m)', 0, 0)
  ctx.restore()
}

function drawTrail(ctx, trail, color, px, opacity) {
  if (trail.length < 2) return
  for (let i = 1; i < trail.length; i++) {
    const pt = px(trail[i].x, trail[i].y)
    const age = 1 - (i / trail.length) * 0.4 // slight fade with age
    ctx.globalAlpha = opacity * age
    ctx.fillStyle = color.main
    ctx.beginPath()
    ctx.arc(pt.x, pt.y, TRAIL_DOT_RADIUS, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

function drawProjectile(ctx, pos, color) {
  // Glow
  ctx.shadowColor = color.glow
  ctx.shadowBlur = 12
  ctx.fillStyle = color.main
  ctx.beginPath()
  ctx.arc(pos.x, pos.y, PROJECTILE_RADIUS, 0, Math.PI * 2)
  ctx.fill()

  // Bright center
  ctx.shadowBlur = 0
  ctx.fillStyle = '#fff'
  ctx.globalAlpha = 0.6
  ctx.beginPath()
  ctx.arc(pos.x, pos.y - 1, PROJECTILE_RADIUS * 0.35, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1
  ctx.shadowColor = 'transparent'
}

function drawVelocityVector(ctx, pos, vel, color, pxScaleX, pxScaleY, showComponents) {
  // Scale velocity for display (1 m/s = some pixels)
  const scaleFactor = 1.5
  const arrowPxX = pxScaleX(vel.vx * scaleFactor * 0.06)
  const arrowPxY = pxScaleY(vel.vy * scaleFactor * 0.06)

  if (showComponents) {
    // Horizontal component (vx) - cyan
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 1.5
    ctx.setLineDash([])
    drawArrow(ctx, pos.x, pos.y, pos.x + arrowPxX, pos.y, 5)

    // Vertical component (vy) - pink
    ctx.strokeStyle = '#ec4899'
    drawArrow(ctx, pos.x, pos.y, pos.x, pos.y - arrowPxY, 5)

    // Labels
    ctx.font = '9px ui-monospace, SFMono-Regular, monospace'
    ctx.fillStyle = '#06b6d4'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    ctx.fillText(`vx=${Math.abs(vel.vx).toFixed(1)}`, pos.x + arrowPxX / 2, pos.y + 4)

    ctx.fillStyle = '#ec4899'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    ctx.fillText(`vy=${Math.abs(vel.vy).toFixed(1)}`, pos.x + 4, pos.y - arrowPxY / 2)
  }

  // Resultant velocity vector
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  ctx.setLineDash([])
  drawArrow(ctx, pos.x, pos.y, pos.x + arrowPxX, pos.y - arrowPxY, 7)
}

function drawAccelVector(ctx, pos, g, pxScaleY) {
  const len = pxScaleY(g * 0.08)
  ctx.strokeStyle = '#ef4444'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 3])
  drawArrow(ctx, pos.x, pos.y, pos.x, pos.y + len, 6)
  ctx.setLineDash([])

  // Label
  ctx.font = '9px ui-monospace, SFMono-Regular, monospace'
  ctx.fillStyle = '#ef4444'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  ctx.fillText(`g=${g}`, pos.x + 6, pos.y + len - 4)
}

function drawArrow(ctx, x1, y1, x2, y2, headLen) {
  const dx = x2 - x1
  const dy = y2 - y1
  const angle = Math.atan2(dy, dx)

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()

  // Arrowhead
  ctx.beginPath()
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - headLen * Math.cos(angle - Math.PI / 6),
    y2 - headLen * Math.sin(angle - Math.PI / 6)
  )
  ctx.moveTo(x2, y2)
  ctx.lineTo(
    x2 - headLen * Math.cos(angle + Math.PI / 6),
    y2 - headLen * Math.sin(angle + Math.PI / 6)
  )
  ctx.stroke()
}

function drawRangeMarker(ctx, range, color, px, analytical, isPreview = false) {
  if (range <= 0) return
  const landing = px(range, 0)
  const alpha = isPreview ? 0.35 : 0.8

  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.setLineDash(isPreview ? [3, 3] : [])

  // Tick mark
  ctx.beginPath()
  ctx.moveTo(landing.x, landing.y - 6)
  ctx.lineTo(landing.x, landing.y + 6)
  ctx.stroke()
  ctx.setLineDash([])

  // Label
  ctx.font = '9px ui-monospace, SFMono-Regular, monospace'
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.fillText(`${range.toFixed(1)}m`, landing.x, landing.y + 8)

  ctx.globalAlpha = 1
}

function drawMaxHeightLine(ctx, maxH, color, px, drawW, marginL, isPreview = false) {
  if (maxH <= 0) return
  const pt = px(0, maxH)
  const alpha = isPreview ? 0.2 : 0.35

  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 0.8
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(marginL, pt.y)
  ctx.lineTo(marginL + drawW, pt.y)
  ctx.stroke()
  ctx.setLineDash([])
  ctx.globalAlpha = 1
}

function drawCannon(ctx, origin, angleDeg, isFiring) {
  const rad = (angleDeg * Math.PI) / 180

  ctx.save()
  ctx.translate(origin.x, origin.y)

  // Base circle
  ctx.fillStyle = CANNON_BODY
  ctx.beginPath()
  ctx.arc(0, 0, 8, 0, Math.PI * 2)
  ctx.fill()

  // Bore (rotatable rectangle)
  ctx.rotate(-rad)
  ctx.fillStyle = CANNON_BORE
  ctx.fillRect(0, -CANNON_WIDTH / 2, CANNON_LENGTH, CANNON_WIDTH)

  // Bore outline
  ctx.strokeStyle = isFiring ? CANNON_ACCENT : 'rgba(100,116,139,0.5)'
  ctx.lineWidth = 1
  ctx.strokeRect(0, -CANNON_WIDTH / 2, CANNON_LENGTH, CANNON_WIDTH)

  // Muzzle highlight
  if (isFiring) {
    ctx.fillStyle = CANNON_ACCENT
    ctx.globalAlpha = 0.6
    ctx.beginPath()
    ctx.arc(CANNON_LENGTH, 0, 3, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  ctx.restore()

  // Base accent ring
  ctx.strokeStyle = CANNON_ACCENT
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.arc(origin.x, origin.y, 9.5, 0, Math.PI * 2)
  ctx.stroke()
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function niceStep(range, maxTicks) {
  const rough = range / maxTicks
  const mag = Math.pow(10, Math.floor(Math.log10(rough)))
  const residual = rough / mag
  let nice
  if (residual <= 1.5) nice = 1
  else if (residual <= 3) nice = 2
  else if (residual <= 7) nice = 5
  else nice = 10
  return nice * mag
}

export default ProjectileLauncher
