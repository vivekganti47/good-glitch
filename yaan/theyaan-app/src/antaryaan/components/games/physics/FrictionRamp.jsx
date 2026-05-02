import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

const G = 10 // m/s^2

function FrictionRamp({
  config = {},
  params = {},
  onParamChange,
  onDiscovery,
  onComplete,
  isComplete = false,
  containerWidth = 800,
  containerHeight = 500,
}) {
  // Extract params with defaults
  const angle = params.angle ?? 30 // degrees
  const mass = params.mass ?? 5 // kg
  const mu = params.friction ?? 0.3 // coefficient of friction

  // Animation state
  const [isSliding, setIsSliding] = useState(false)
  const [blockPos, setBlockPos] = useState(0) // distance along ramp from initial position
  const [blockVel, setBlockVel] = useState(0)
  const [discoveredItems, setDiscoveredItems] = useState(new Set())
  const [observedAngles, setObservedAngles] = useState(new Set())
  const [prevSlidingState, setPrevSlidingState] = useState(false)

  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastTimeRef = useRef(null)
  const blockPosRef = useRef(0)
  const blockVelRef = useRef(0)

  // Physics computations
  const physics = useMemo(() => {
    const angleRad = (angle * Math.PI) / 180
    const sinA = Math.sin(angleRad)
    const cosA = Math.cos(angleRad)

    const weight = mass * G
    const normalForce = weight * cosA
    const gravComponent = weight * sinA // along ramp, down
    const frictionForce = mu * normalForce // up the ramp if sliding
    const netForce = gravComponent - frictionForce
    const acceleration = netForce > 0 ? G * (sinA - mu * cosA) : 0
    const sliding = netForce > 0

    // Weight components
    const weightParallel = weight * sinA // along ramp
    const weightPerpendicular = weight * cosA // perpendicular to ramp

    return {
      angleRad,
      sinA,
      cosA,
      weight,
      normalForce,
      gravComponent,
      frictionForce: sliding ? frictionForce : gravComponent, // static friction equals gravity component when stationary
      netForce: sliding ? netForce : 0,
      acceleration,
      sliding,
      weightParallel,
      weightPerpendicular,
    }
  }, [angle, mass, mu])

  // Handle param changes
  const handleParam = useCallback(
    (key, value) => {
      if (onParamChange) {
        onParamChange(key, value)
      }
      // Reset sliding animation on param change
      setBlockPos(0)
      setBlockVel(0)
      blockPosRef.current = 0
      blockVelRef.current = 0
      lastTimeRef.current = null
    },
    [onParamChange]
  )

  // Discovery checking
  useEffect(() => {
    // Track observed angles for normal-vs-angle discovery
    const roundedAngle = Math.round(angle)
    if (!observedAngles.has(roundedAngle)) {
      const newAngles = new Set([...observedAngles, roundedAngle])
      setObservedAngles(newAngles)

      // Check if we've observed 3+ distinct angles
      if (newAngles.size >= 3 && !discoveredItems.has('normal-vs-angle')) {
        setDiscoveredItems((prev) => new Set([...prev, 'normal-vs-angle']))
        if (onDiscovery) onDiscovery('normal-vs-angle')
      }
    }

    // Check for critical-angle discovery: transition from stationary to sliding
    if (physics.sliding && !prevSlidingState && !discoveredItems.has('critical-angle')) {
      setDiscoveredItems((prev) => new Set([...prev, 'critical-angle']))
      if (onDiscovery) onDiscovery('critical-angle')
    }
    setPrevSlidingState(physics.sliding)
  }, [angle, physics.sliding, prevSlidingState, observedAngles, discoveredItems, onDiscovery])

  // Animation loop for sliding block
  useEffect(() => {
    if (!physics.sliding) {
      setBlockPos(0)
      setBlockVel(0)
      blockPosRef.current = 0
      blockVelRef.current = 0
      setIsSliding(false)
      lastTimeRef.current = null
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
      return
    }

    setIsSliding(true)

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05) // Cap dt
      lastTimeRef.current = timestamp

      // Update velocity and position
      const a = physics.acceleration
      blockVelRef.current += a * dt
      blockPosRef.current += blockVelRef.current * dt

      // Reset if block goes too far
      if (blockPosRef.current > 400) {
        blockPosRef.current = 0
        blockVelRef.current = 0
      }

      setBlockPos(blockPosRef.current)
      setBlockVel(blockVelRef.current)

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [physics.sliding, physics.acceleration])

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = Math.round(containerWidth * dpr)
    canvas.height = Math.round(containerHeight * dpr)
    canvas.style.width = `${containerWidth}px`
    canvas.style.height = `${containerHeight}px`

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    // Clear
    ctx.fillStyle = '#0A0E1A'
    ctx.fillRect(0, 0, containerWidth, containerHeight)

    // Subtle grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.04)'
    ctx.lineWidth = 0.5
    for (let gx = 0; gx < containerWidth; gx += 40) {
      ctx.beginPath()
      ctx.moveTo(gx, 0)
      ctx.lineTo(gx, containerHeight)
      ctx.stroke()
    }
    for (let gy = 0; gy < containerHeight; gy += 40) {
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.lineTo(containerWidth, gy)
      ctx.stroke()
    }

    // Title
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('FRICTION RAMP', 15, 10)

    // Status
    ctx.fillStyle = physics.sliding
      ? 'rgba(239, 68, 68, 0.8)'
      : 'rgba(52, 211, 153, 0.8)'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(
      physics.sliding ? 'SLIDING' : 'STATIONARY',
      containerWidth - 15,
      10
    )

    // Ramp geometry
    const rampPadding = 80
    const groundY = containerHeight * 0.75
    const rampBaseX = rampPadding
    const rampBaseY = groundY
    const rampLength = Math.min(containerWidth - rampPadding * 2, 500)

    const angleRad = physics.angleRad
    const rampTopX = rampBaseX + rampLength * Math.cos(angleRad)
    const rampTopY = rampBaseY - rampLength * Math.sin(angleRad)

    // Ground line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, groundY + 2)
    ctx.lineTo(containerWidth, groundY + 2)
    ctx.stroke()

    // Ramp surface with gradient
    ctx.save()
    const rampGrad = ctx.createLinearGradient(rampBaseX, rampBaseY, rampTopX, rampTopY)
    rampGrad.addColorStop(0, 'rgba(100, 116, 139, 0.6)')
    rampGrad.addColorStop(1, 'rgba(100, 116, 139, 0.3)')
    ctx.strokeStyle = rampGrad
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(rampBaseX, rampBaseY)
    ctx.lineTo(rampTopX, rampTopY)
    ctx.stroke()

    // Ramp fill (triangle)
    ctx.fillStyle = 'rgba(51, 65, 85, 0.3)'
    ctx.beginPath()
    ctx.moveTo(rampBaseX, rampBaseY)
    ctx.lineTo(rampTopX, rampTopY)
    ctx.lineTo(rampTopX, rampBaseY)
    ctx.closePath()
    ctx.fill()

    // Ramp surface texture (hatching)
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.15)'
    ctx.lineWidth = 0.5
    const hatchSpacing = 12
    for (let i = 0; i < rampLength; i += hatchSpacing) {
      const frac = i / rampLength
      const hx = rampBaseX + frac * (rampTopX - rampBaseX)
      const hy = rampBaseY + frac * (rampTopY - rampBaseY)
      ctx.beginPath()
      ctx.moveTo(hx, hy)
      ctx.lineTo(hx + 6, hy + 6)
      ctx.stroke()
    }
    ctx.restore()

    // Angle arc
    const arcRadius = 50
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.5)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(rampBaseX, rampBaseY, arcRadius, -angleRad, 0)
    ctx.stroke()

    // Angle label
    const labelAngle = -angleRad / 2
    ctx.fillStyle = 'rgba(148, 163, 184, 0.8)'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(
      `${angle}\u00B0`,
      rampBaseX + (arcRadius + 16) * Math.cos(labelAngle),
      rampBaseY + (arcRadius + 16) * Math.sin(labelAngle)
    )

    // Block properties
    const blockW = 44
    const blockH = 32

    // Block position on ramp (slides down from a starting point)
    const startFrac = 0.65 // Start at 65% up the ramp
    const slidePixels = blockPos * 3 // Scale physics distance to pixels
    const blockFrac = Math.max(0.05, startFrac - slidePixels / rampLength)

    const blockCenterX =
      rampBaseX + blockFrac * (rampTopX - rampBaseX)
    const blockCenterY =
      rampBaseY + blockFrac * (rampTopY - rampBaseY)

    // Draw block (rotated to sit on ramp)
    ctx.save()
    ctx.translate(blockCenterX, blockCenterY)
    ctx.rotate(-angleRad)

    // Block body with gradient
    const blockGrad = ctx.createLinearGradient(0, -blockH, 0, 0)
    blockGrad.addColorStop(0, '#6366F1')
    blockGrad.addColorStop(1, '#4338CA')
    ctx.fillStyle = blockGrad
    ctx.fillRect(-blockW / 2, -blockH, blockW, blockH)

    // Block border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    ctx.strokeRect(-blockW / 2, -blockH, blockW, blockH)

    // Mass label on block
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${mass}kg`, 0, -blockH / 2)

    ctx.restore()

    // ===== Force Arrows =====
    // Force arrow helper
    const drawArrow = (
      fromX,
      fromY,
      toX,
      toY,
      color,
      label,
      dashed = false,
      labelOffset = 0
    ) => {
      const dx = toX - fromX
      const dy = toY - fromY
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 3) return // Don't draw tiny arrows

      ctx.save()
      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 2.5

      if (dashed) {
        ctx.setLineDash([6, 4])
        ctx.lineWidth = 2
      }

      // Line
      ctx.beginPath()
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)
      ctx.stroke()

      if (dashed) ctx.setLineDash([])

      // Arrowhead
      const headLen = 10
      const headAngle = Math.atan2(dy, dx)
      ctx.beginPath()
      ctx.moveTo(toX, toY)
      ctx.lineTo(
        toX - headLen * Math.cos(headAngle - 0.35),
        toY - headLen * Math.sin(headAngle - 0.35)
      )
      ctx.lineTo(
        toX - headLen * Math.cos(headAngle + 0.35),
        toY - headLen * Math.sin(headAngle + 0.35)
      )
      ctx.closePath()
      ctx.fill()

      // Label
      if (label) {
        ctx.font = 'bold 10px monospace'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const midX = (fromX + toX) / 2
        const midY = (fromY + toY) / 2

        // Offset label perpendicular to arrow direction
        const perpX = -dy / len
        const perpY = dx / len
        const offsetDist = 14 + labelOffset

        ctx.fillText(label, midX + perpX * offsetDist, midY + perpY * offsetDist)
      }

      ctx.restore()
    }

    // Force scale: pixels per Newton
    const maxForce = mass * G * 1.2
    const forceScale = Math.min(120, 200) / maxForce

    // Direction vectors
    const rampDirX = Math.cos(angleRad) // along ramp (up-right)
    const rampDirY = -Math.sin(angleRad)
    const normDirX = Math.sin(angleRad) // perpendicular to ramp (outward from surface)
    const normDirY = Math.cos(angleRad)

    // Block center in world coords (for force arrow origins)
    const forceCX = blockCenterX
    const forceCY = blockCenterY - blockH / 2 * Math.cos(angleRad) // Center of block

    // 1. Weight (mg) - straight down, white
    const weightLen = physics.weight * forceScale
    drawArrow(
      forceCX,
      forceCY,
      forceCX,
      forceCY + weightLen,
      '#FFFFFF',
      `mg = ${physics.weight.toFixed(0)} N`
    )

    // 2. Normal force (N) - perpendicular to surface, cyan
    const normalLen = physics.normalForce * forceScale
    drawArrow(
      forceCX,
      forceCY,
      forceCX - normDirX * normalLen,
      forceCY - normDirY * normalLen,
      '#22D3EE',
      `N = ${physics.normalForce.toFixed(1)} N`
    )

    // 3. Friction force - along ramp (up the ramp if sliding)
    const frictionLen = physics.frictionForce * forceScale
    if (frictionLen > 1) {
      // Friction acts up the ramp (opposing motion)
      drawArrow(
        forceCX,
        forceCY,
        forceCX + rampDirX * frictionLen,
        forceCY + rampDirY * frictionLen,
        '#FB923C',
        `f = ${physics.frictionForce.toFixed(1)} N`
      )
    }

    // 4. Weight component along ramp (mg*sin theta) - dashed red, down the ramp
    const wParLen = physics.weightParallel * forceScale
    if (wParLen > 2) {
      drawArrow(
        forceCX,
        forceCY,
        forceCX - rampDirX * wParLen,
        forceCY - rampDirY * wParLen,
        '#F87171',
        `mg sin\u03B8 = ${physics.weightParallel.toFixed(1)} N`,
        true,
        5
      )
    }

    // 5. Weight component perpendicular to ramp (mg*cos theta) - dashed blue, into surface
    const wPerpLen = physics.weightPerpendicular * forceScale
    if (wPerpLen > 2) {
      drawArrow(
        forceCX,
        forceCY,
        forceCX + normDirX * wPerpLen,
        forceCY + normDirY * wPerpLen,
        '#60A5FA',
        `mg cos\u03B8 = ${physics.weightPerpendicular.toFixed(1)} N`,
        true,
        5
      )
    }

    // Critical angle indicator
    const criticalAngle = Math.atan(mu) * (180 / Math.PI)
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText(
      `Critical angle: tan\u207B\u00B9(\u03BC) = ${criticalAngle.toFixed(1)}\u00B0`,
      15,
      28
    )

    // Force readouts panel (bottom right)
    const panelX = containerWidth - 220
    const panelY = 40
    const panelW = 205
    const panelH = 155

    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'
    ctx.fillRect(panelX, panelY, panelW, panelH)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'
    ctx.lineWidth = 1
    ctx.strokeRect(panelX, panelY, panelW, panelH)

    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
    ctx.font = 'bold 10px sans-serif'
    ctx.textAlign = 'left'
    ctx.fillText('FORCE READOUTS', panelX + 10, panelY + 14)

    const readouts = [
      { label: 'Weight (mg)', value: `${physics.weight.toFixed(1)} N`, color: '#FFFFFF' },
      {
        label: 'Normal (N)',
        value: `${physics.normalForce.toFixed(1)} N`,
        color: '#22D3EE',
      },
      {
        label: 'Friction (f)',
        value: `${physics.frictionForce.toFixed(1)} N`,
        color: '#FB923C',
      },
      {
        label: 'Net Force',
        value: `${physics.netForce.toFixed(1)} N`,
        color: physics.netForce > 0 ? '#F87171' : '#34D399',
      },
      {
        label: 'Acceleration',
        value: `${physics.acceleration.toFixed(2)} m/s\u00B2`,
        color: physics.acceleration > 0 ? '#F87171' : '#94A3B8',
      },
    ]

    readouts.forEach((r, i) => {
      const ry = panelY + 30 + i * 24

      // Color indicator dot
      ctx.fillStyle = r.color
      ctx.beginPath()
      ctx.arc(panelX + 16, ry + 3, 3, 0, Math.PI * 2)
      ctx.fill()

      // Label
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(r.label, panelX + 26, ry + 6)

      // Value
      ctx.fillStyle = r.color
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'right'
      ctx.fillText(r.value, panelX + panelW - 10, ry + 6)
    })

    // Velocity readout if sliding
    if (isSliding && blockVel > 0.01) {
      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(
        `Velocity: ${blockVel.toFixed(1)} m/s`,
        15,
        groundY + 20
      )
    }
  }, [
    containerWidth,
    containerHeight,
    angle,
    mass,
    mu,
    physics,
    blockPos,
    blockVel,
    isSliding,
  ])

  return (
    <div className="flex flex-col gap-3">
      {/* Canvas */}
      <div className="relative rounded-lg overflow-hidden border border-slate-700/40 bg-slate-900/80">
        <canvas
          ref={canvasRef}
          className="block"
          style={{ width: containerWidth, height: containerHeight }}
        />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Angle control */}
        <div className="rounded-lg border border-slate-700/30 bg-slate-800/40 p-3 space-y-2">
          <label className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Ramp Angle</span>
            <span className="font-mono text-indigo-300">{angle}\u00B0</span>
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={angle}
            onChange={(e) => handleParam('angle', parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0\u00B0</span>
            <span>60\u00B0</span>
          </div>
        </div>

        {/* Mass control */}
        <div className="rounded-lg border border-slate-700/30 bg-slate-800/40 p-3 space-y-2">
          <label className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Block Mass</span>
            <span className="font-mono text-indigo-300">{mass} kg</span>
          </label>
          <input
            type="range"
            min="1"
            max="20"
            step="1"
            value={mass}
            onChange={(e) => handleParam('mass', parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-indigo-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>1 kg</span>
            <span>20 kg</span>
          </div>
        </div>

        {/* Friction control */}
        <div className="rounded-lg border border-slate-700/30 bg-slate-800/40 p-3 space-y-2">
          <label className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">Friction (\u03BC)</span>
            <span className="font-mono text-indigo-300">{mu.toFixed(2)}</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={mu}
            onChange={(e) => handleParam('friction', parseFloat(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-amber-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-600">
            <span>0.00</span>
            <span>1.00</span>
          </div>
        </div>
      </div>

      {/* Status panel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Normal</div>
          <div className="text-sm font-mono text-cyan-400 font-semibold">
            {physics.normalForce.toFixed(1)} N
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Friction</div>
          <div className="text-sm font-mono text-orange-400 font-semibold">
            {physics.frictionForce.toFixed(1)} N
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Net Force</div>
          <div
            className={`text-sm font-mono font-semibold ${
              physics.netForce > 0 ? 'text-red-400' : 'text-green-400'
            }`}
          >
            {physics.netForce.toFixed(1)} N
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Acceleration
          </div>
          <div
            className={`text-sm font-mono font-semibold ${
              physics.acceleration > 0 ? 'text-red-400' : 'text-slate-500'
            }`}
          >
            {physics.acceleration.toFixed(2)} m/s{'\u00B2'}
          </div>
        </div>
        <div
          className={`rounded-lg border p-2 ${
            physics.sliding
              ? 'bg-red-500/5 border-red-500/20'
              : 'bg-emerald-500/5 border-emerald-500/20'
          }`}
        >
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Status</div>
          <div
            className={`text-sm font-semibold ${
              physics.sliding ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {physics.sliding ? 'SLIDING' : 'STATIONARY'}
          </div>
        </div>
      </div>

      {/* Physics explanation */}
      <div className="rounded-lg border border-indigo-500/15 bg-indigo-500/5 p-3">
        <div className="text-xs text-slate-400 space-y-1">
          <p>
            <span className="text-slate-300 font-medium">Condition to slide: </span>
            mg{'\u00B7'}sin{'\u03B8'} {'>'} {'\u03BC'}{'\u00B7'}mg{'\u00B7'}cos{'\u03B8'}
            {' \u2192 '}tan{'\u03B8'} {'>'} {'\u03BC'}
            {' \u2192 '}{'\u03B8'} {'>'} {(Math.atan(mu) * 180 / Math.PI).toFixed(1)}{'\u00B0'}
          </p>
          <p>
            <span className="text-slate-300 font-medium">Currently: </span>
            {physics.gravComponent.toFixed(1)} N (gravity along ramp)
            {physics.sliding ? ' > ' : ' \u2264 '}
            {(mu * physics.normalForce).toFixed(1)} N (max static friction)
            {' \u2192 '}
            <span className={physics.sliding ? 'text-red-300' : 'text-emerald-300'}>
              {physics.sliding
                ? `Block slides with a = ${physics.acceleration.toFixed(2)} m/s\u00B2`
                : 'Block stays still (friction balances gravity)'}
            </span>
          </p>
        </div>
      </div>

      {/* Discoveries */}
      {discoveredItems.size > 0 && (
        <div className="flex flex-wrap gap-2">
          {[...discoveredItems].map((d) => (
            <span
              key={d}
              className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
            >
              {d === 'critical-angle'
                ? 'Critical Angle Found!'
                : d === 'normal-vs-angle'
                  ? 'Normal Force vs Angle!'
                  : d}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default FrictionRamp
