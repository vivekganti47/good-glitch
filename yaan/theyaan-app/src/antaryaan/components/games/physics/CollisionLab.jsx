import { useState, useRef, useEffect, useCallback, useMemo } from 'react'

const G = 10 // m/s^2 (not used here but keeping consistent with platform)

// Physics helpers
function elasticCollision(m1, m2, u1, u2) {
  const v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2)
  const v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2)
  return { v1, v2 }
}

function inelasticCollision(m1, m2, u1, u2) {
  const v = (m1 * u1 + m2 * u2) / (m1 + m2)
  return { v1: v, v2: v }
}

function kineticEnergy(m, v) {
  return 0.5 * m * v * v
}

function ballRadius(mass) {
  // Scale radius proportional to mass^(1/3) for visual clarity
  const r = 15 + (mass ** (1 / 3)) * 10
  return Math.max(15, Math.min(50, r))
}

// Animation phases
const PHASE_IDLE = 'idle'
const PHASE_APPROACHING = 'approaching'
const PHASE_FLASH = 'flash'
const PHASE_SEPARATING = 'separating'
const PHASE_DONE = 'done'

function CollisionLab({
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
  const m1 = params.mass1 ?? 2
  const m2 = params.mass2 ?? 2
  const u1 = params.velocity1 ?? 5
  const u2 = params.velocity2 ?? -5
  const collisionType = params.collisionType ?? 'elastic'

  // Animation state
  const [phase, setPhase] = useState(PHASE_IDLE)
  const [animTime, setAnimTime] = useState(0)
  const [flashOpacity, setFlashOpacity] = useState(0)
  const [finalVelocities, setFinalVelocities] = useState(null)
  const [discoveredItems, setDiscoveredItems] = useState(new Set())
  const [challengeMode, setChallengeMode] = useState(false)
  const [trialCount, setTrialCount] = useState(0)

  const canvasRef = useRef(null)
  const animFrameRef = useRef(null)
  const lastTimeRef = useRef(null)
  const phaseRef = useRef(phase)
  const animTimeRef = useRef(0)

  // Keep refs in sync
  phaseRef.current = phase
  animTimeRef.current = animTime

  // Track dimensions
  const trackY = useMemo(() => containerHeight * 0.35, [containerHeight])
  const trackLeft = 60
  const trackRight = useMemo(() => containerWidth - 60, [containerWidth])
  const trackWidth = useMemo(() => trackRight - trackLeft, [trackRight, trackLeft])

  // Ball positions at start
  const r1 = useMemo(() => ballRadius(m1), [m1])
  const r2 = useMemo(() => ballRadius(m2), [m2])

  // Start positions: balls at 25% and 75% of track
  const startX1 = useMemo(() => trackLeft + trackWidth * 0.2, [trackLeft, trackWidth])
  const startX2 = useMemo(() => trackLeft + trackWidth * 0.8, [trackLeft, trackWidth])

  // Collision point - where balls meet
  const collisionX = useMemo(() => {
    // They meet when the gap closes: gap = startX2 - startX1 - r1 - r2
    // Relative velocity: u1 - u2 (approaching speed)
    const relVel = u1 - u2
    if (relVel <= 0) return (startX1 + startX2) / 2 // Won't collide, use midpoint
    // Time to collide: t = gap / relVel (in physics space)
    // But we animate in pixel space, so just use midpoint weighted by velocities
    const gap = startX2 - startX1 - r1 - r2
    const tCollide = gap / (relVel * 8) // scale factor for pixels
    const cx1 = startX1 + u1 * 8 * tCollide
    return cx1 + r1
  }, [startX1, startX2, r1, r2, u1, u2])

  // Compute final velocities
  const computed = useMemo(() => {
    const result =
      collisionType === 'elastic'
        ? elasticCollision(m1, m2, u1, u2)
        : inelasticCollision(m1, m2, u1, u2)

    const momentumBefore = m1 * u1 + m2 * u2
    const momentumAfter = m1 * result.v1 + m2 * result.v2

    const keBefore = kineticEnergy(m1, u1) + kineticEnergy(m2, u2)
    const keAfter = kineticEnergy(m1, result.v1) + kineticEnergy(m2, result.v2)

    return {
      v1: result.v1,
      v2: result.v2,
      momentumBefore,
      momentumAfter,
      keBefore,
      keAfter,
      keLost: keBefore - keAfter,
    }
  }, [m1, m2, u1, u2, collisionType])

  // Handle param changes
  const handleParam = useCallback(
    (key, value) => {
      if (onParamChange) {
        onParamChange(key, value)
      }
      // Reset animation when params change
      setPhase(PHASE_IDLE)
      setFinalVelocities(null)
      setAnimTime(0)
    },
    [onParamChange]
  )

  // Check for discoveries
  const checkDiscoveries = useCallback(
    (v1Final) => {
      // 'momentum-conserved' - always true after a collision
      if (!discoveredItems.has('momentum-conserved')) {
        setDiscoveredItems((prev) => new Set([...prev, 'momentum-conserved']))
        if (onDiscovery) onDiscovery('momentum-conserved')
      }

      // 'equal-mass-transfer' - Ball 1 stops when m1=m2 in elastic
      if (
        collisionType === 'elastic' &&
        Math.abs(m1 - m2) < 0.01 &&
        Math.abs(v1Final) < 0.01 &&
        !discoveredItems.has('equal-mass-transfer')
      ) {
        setDiscoveredItems((prev) => new Set([...prev, 'equal-mass-transfer']))
        if (onDiscovery) onDiscovery('equal-mass-transfer')
      }
    },
    [m1, m2, collisionType, discoveredItems, onDiscovery]
  )

  // Start collision animation
  const startCollision = useCallback(() => {
    // Check if balls will actually collide (need relative approach)
    const relVel = u1 - u2
    if (relVel <= 0) {
      // Balls moving apart or same direction with ball 2 faster - no collision
      return
    }

    setTrialCount((c) => c + 1)
    setFinalVelocities(computed)
    setAnimTime(0)
    setPhase(PHASE_APPROACHING)
    lastTimeRef.current = null
  }, [u1, u2, computed])

  // Reset animation
  const resetAnimation = useCallback(() => {
    setPhase(PHASE_IDLE)
    setFinalVelocities(null)
    setAnimTime(0)
    setFlashOpacity(0)
    lastTimeRef.current = null
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = null
    }
  }, [])

  // Animation loop
  useEffect(() => {
    if (phase === PHASE_IDLE || phase === PHASE_DONE) return

    const animate = (timestamp) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const dt = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      setAnimTime((prev) => {
        const newTime = prev + dt

        if (phaseRef.current === PHASE_APPROACHING && newTime >= 1.5) {
          setPhase(PHASE_FLASH)
          setFlashOpacity(1)
          return 0
        }

        if (phaseRef.current === PHASE_FLASH && newTime >= 0.2) {
          setPhase(PHASE_SEPARATING)
          setFlashOpacity(0)
          // Check discoveries
          if (finalVelocities) {
            checkDiscoveries(finalVelocities.v1)
          }
          // Challenge mode check
          if (challengeMode && finalVelocities && onComplete && !isComplete) {
            const score = Math.max(0, 100 - Math.abs(finalVelocities.v1) * 20)
            onComplete(Math.round(score))
          }
          return 0
        }

        if (phaseRef.current === PHASE_SEPARATING && newTime >= 2.0) {
          setPhase(PHASE_DONE)
          return newTime
        }

        return newTime
      })

      // Decay flash
      if (phaseRef.current === PHASE_FLASH) {
        setFlashOpacity((prev) => Math.max(0, prev - dt * 8))
      }

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [phase, finalVelocities, checkDiscoveries, challengeMode, onComplete, isComplete])

  // Ball positions during animation
  const getBallPositions = useCallback(() => {
    const t = animTimeRef.current
    const speedScale = 8 // pixels per m/s per second

    if (phase === PHASE_IDLE) {
      return { x1: startX1, x2: startX2 }
    }

    if (phase === PHASE_APPROACHING) {
      const progress = Math.min(t / 1.5, 1)
      // Ease in
      const ease = progress * progress * (3 - 2 * progress)
      const meetX1 = collisionX - r1
      const meetX2 = collisionX + r2
      return {
        x1: startX1 + (meetX1 - startX1) * ease,
        x2: startX2 + (meetX2 - startX2) * ease,
      }
    }

    if (phase === PHASE_FLASH) {
      return { x1: collisionX - r1, x2: collisionX + r2 }
    }

    if (phase === PHASE_SEPARATING || phase === PHASE_DONE) {
      if (!finalVelocities) return { x1: collisionX - r1, x2: collisionX + r2 }

      const isInelastic = collisionType !== 'elastic'
      const separateT = phase === PHASE_DONE ? 2.0 : t

      if (isInelastic) {
        // Stick together, move as one
        const cx = collisionX + finalVelocities.v1 * speedScale * separateT
        return { x1: cx - r1, x2: cx + r2 }
      }

      return {
        x1: collisionX - r1 + finalVelocities.v1 * speedScale * separateT,
        x2: collisionX + r2 + finalVelocities.v2 * speedScale * separateT,
      }
    }

    return { x1: startX1, x2: startX2 }
  }, [
    phase,
    startX1,
    startX2,
    collisionX,
    r1,
    r2,
    finalVelocities,
    collisionType,
  ])

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
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)'
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

    // Track line
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(trackLeft - 10, trackY)
    ctx.lineTo(trackRight + 10, trackY)
    ctx.stroke()

    // Track end markers
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(trackLeft - 10, trackY - 20)
    ctx.lineTo(trackLeft - 10, trackY + 5)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(trackRight + 10, trackY - 20)
    ctx.lineTo(trackRight + 10, trackY + 5)
    ctx.stroke()

    // Get ball positions
    const { x1, x2 } = getBallPositions()

    // Flash effect on collision
    if (flashOpacity > 0) {
      const grad = ctx.createRadialGradient(
        collisionX,
        trackY - r1,
        0,
        collisionX,
        trackY - r1,
        120
      )
      grad.addColorStop(0, `rgba(255, 255, 255, ${flashOpacity * 0.8})`)
      grad.addColorStop(0.3, `rgba(255, 200, 50, ${flashOpacity * 0.4})`)
      grad.addColorStop(1, `rgba(255, 200, 50, 0)`)
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, containerWidth, containerHeight)
    }

    // Draw velocity arrows (above balls)
    const drawVelocityArrow = (x, y, velocity, color) => {
      if (Math.abs(velocity) < 0.1) return
      const arrowLen = velocity * 4 // Scale arrow length
      const arrowY = y - 20
      const headLen = 8
      const dir = velocity > 0 ? 1 : -1

      ctx.strokeStyle = color
      ctx.fillStyle = color
      ctx.lineWidth = 2.5
      ctx.beginPath()
      ctx.moveTo(x, arrowY)
      ctx.lineTo(x + arrowLen, arrowY)
      ctx.stroke()

      // Arrowhead
      ctx.beginPath()
      ctx.moveTo(x + arrowLen, arrowY)
      ctx.lineTo(x + arrowLen - dir * headLen, arrowY - 5)
      ctx.lineTo(x + arrowLen - dir * headLen, arrowY + 5)
      ctx.closePath()
      ctx.fill()

      // Velocity label
      ctx.fillStyle = color
      ctx.font = 'bold 11px monospace'
      ctx.textAlign = 'center'
      ctx.fillText(`${velocity > 0 ? '+' : ''}${velocity.toFixed(1)} m/s`, x + arrowLen / 2, arrowY - 8)
    }

    // Determine which velocities to show on arrows
    const showV1 =
      phase === PHASE_SEPARATING || phase === PHASE_DONE
        ? finalVelocities?.v1 ?? u1
        : u1
    const showV2 =
      phase === PHASE_SEPARATING || phase === PHASE_DONE
        ? finalVelocities?.v2 ?? u2
        : u2

    // Draw Ball 1 (red)
    const by1 = trackY - r1
    ctx.beginPath()
    ctx.arc(x1, by1, r1, 0, Math.PI * 2)
    const grad1 = ctx.createRadialGradient(x1 - r1 * 0.3, by1 - r1 * 0.3, 0, x1, by1, r1)
    grad1.addColorStop(0, '#FCA5A5')
    grad1.addColorStop(0.7, '#EF4444')
    grad1.addColorStop(1, '#B91C1C')
    ctx.fillStyle = grad1
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Mass label Ball 1
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.max(10, r1 * 0.6)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${m1}kg`, x1, by1)

    // Velocity arrow Ball 1
    if (phase !== PHASE_FLASH) {
      drawVelocityArrow(x1, by1 - r1, showV1, '#FCA5A5')
    }

    // Draw Ball 2 (blue)
    const by2 = trackY - r2
    const drawX2 =
      collisionType !== 'elastic' && (phase === PHASE_SEPARATING || phase === PHASE_DONE)
        ? x2 // In inelastic, x2 = x1 + r1 + r2 essentially overlapping
        : x2
    ctx.beginPath()
    ctx.arc(drawX2, by2, r2, 0, Math.PI * 2)
    const grad2 = ctx.createRadialGradient(drawX2 - r2 * 0.3, by2 - r2 * 0.3, 0, drawX2, by2, r2)
    grad2.addColorStop(0, '#93C5FD')
    grad2.addColorStop(0.7, '#3B82F6')
    grad2.addColorStop(1, '#1D4ED8')
    ctx.fillStyle = grad2
    ctx.fill()
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)'
    ctx.lineWidth = 1.5
    ctx.stroke()

    // Mass label Ball 2
    ctx.fillStyle = '#FFFFFF'
    ctx.font = `bold ${Math.max(10, r2 * 0.6)}px sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(`${m2}kg`, drawX2, by2)

    // Velocity arrow Ball 2
    if (phase !== PHASE_FLASH) {
      drawVelocityArrow(drawX2, by2 - r2, showV2, '#93C5FD')
    }

    // Draw "stuck together" indicator for inelastic post-collision
    if (
      collisionType !== 'elastic' &&
      (phase === PHASE_SEPARATING || phase === PHASE_DONE)
    ) {
      ctx.strokeStyle = 'rgba(255, 200, 50, 0.6)'
      ctx.lineWidth = 2
      ctx.setLineDash([4, 3])
      ctx.beginPath()
      ctx.arc((x1 + drawX2) / 2, (by1 + by2) / 2, Math.max(r1, r2) + 8, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])
    }

    // Title
    ctx.fillStyle = 'rgba(148, 163, 184, 0.7)'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    ctx.fillText('1D COLLISION LAB', trackLeft - 10, 10)

    // Type indicator
    ctx.fillStyle =
      collisionType === 'elastic'
        ? 'rgba(52, 211, 153, 0.7)'
        : 'rgba(251, 191, 36, 0.7)'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText(
      collisionType === 'elastic' ? 'ELASTIC' : 'PERFECTLY INELASTIC',
      trackRight + 10,
      10
    )

    // Phase label
    if (phase !== PHASE_IDLE) {
      const phaseLabels = {
        [PHASE_APPROACHING]: 'APPROACHING...',
        [PHASE_FLASH]: 'COLLISION!',
        [PHASE_SEPARATING]: 'SEPARATING...',
        [PHASE_DONE]: 'COLLISION COMPLETE',
      }
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
      ctx.font = '11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(phaseLabels[phase] || '', containerWidth / 2, trackY + 20)
    }

    // ===== Bar Charts (below track) =====
    const barAreaTop = trackY + 40
    const barHeight = 80
    const barAreaBottom = barAreaTop + barHeight + 50

    // Only show bars after collision is done or during separation
    const showBars =
      phase === PHASE_SEPARATING || phase === PHASE_DONE || finalVelocities !== null

    if (showBars) {
      const momBefore = m1 * u1 + m2 * u2
      const momAfter = finalVelocities
        ? m1 * finalVelocities.v1 + m2 * finalVelocities.v2
        : momBefore

      const keBefore = kineticEnergy(m1, u1) + kineticEnergy(m2, u2)
      const keAfter = finalVelocities
        ? kineticEnergy(m1, finalVelocities.v1) +
          kineticEnergy(m2, finalVelocities.v2)
        : keBefore

      // Scale factors for bars
      const maxMom = Math.max(Math.abs(momBefore), Math.abs(momAfter), 1)
      const maxKE = Math.max(keBefore, keAfter, 1)

      const barMaxH = barHeight
      const barW = 30
      const gap = 16

      // Momentum section
      const momSectionX = containerWidth * 0.2
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('MOMENTUM (kg\u00B7m/s)', momSectionX + barW + gap / 2, barAreaTop)

      // Before bar
      const momBeforeH = (Math.abs(momBefore) / maxMom) * barMaxH
      const momBeforeColor = momBefore >= 0 ? '#34D399' : '#F87171'
      ctx.fillStyle = momBeforeColor
      ctx.fillRect(momSectionX, barAreaTop + 18 + barMaxH - momBeforeH, barW, momBeforeH)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.strokeRect(momSectionX, barAreaTop + 18 + barMaxH - momBeforeH, barW, momBeforeH)

      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '10px sans-serif'
      ctx.fillText('Before', momSectionX + barW / 2, barAreaTop + 18 + barMaxH + 14)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(
        momBefore.toFixed(1),
        momSectionX + barW / 2,
        barAreaTop + 18 + barMaxH - momBeforeH - 6
      )

      // After bar
      const momAfterH = (Math.abs(momAfter) / maxMom) * barMaxH
      const momAfterColor = momAfter >= 0 ? '#34D399' : '#F87171'
      ctx.fillStyle = momAfterColor
      ctx.fillRect(
        momSectionX + barW + gap,
        barAreaTop + 18 + barMaxH - momAfterH,
        barW,
        momAfterH
      )
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.strokeRect(
        momSectionX + barW + gap,
        barAreaTop + 18 + barMaxH - momAfterH,
        barW,
        momAfterH
      )

      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '10px sans-serif'
      ctx.fillText(
        'After',
        momSectionX + barW + gap + barW / 2,
        barAreaTop + 18 + barMaxH + 14
      )
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(
        momAfter.toFixed(1),
        momSectionX + barW + gap + barW / 2,
        barAreaTop + 18 + barMaxH - momAfterH - 6
      )

      // Conservation check mark for momentum
      ctx.fillStyle = '#34D399'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(
        '\u2713 Conserved',
        momSectionX + barW + gap / 2,
        barAreaTop + 18 + barMaxH + 30
      )

      // Kinetic Energy section
      const keSectionX = containerWidth * 0.6
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('KINETIC ENERGY (J)', keSectionX + barW + gap / 2, barAreaTop)

      // KE Before bar
      const keBeforeH = (keBefore / maxKE) * barMaxH
      ctx.fillStyle = '#34D399'
      ctx.fillRect(keSectionX, barAreaTop + 18 + barMaxH - keBeforeH, barW, keBeforeH)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.strokeRect(keSectionX, barAreaTop + 18 + barMaxH - keBeforeH, barW, keBeforeH)

      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '10px sans-serif'
      ctx.fillText('Before', keSectionX + barW / 2, barAreaTop + 18 + barMaxH + 14)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(
        keBefore.toFixed(1),
        keSectionX + barW / 2,
        barAreaTop + 18 + barMaxH - keBeforeH - 6
      )

      // KE After bar (with lost energy section for inelastic)
      const keAfterH = (keAfter / maxKE) * barMaxH
      const keLostH = ((keBefore - keAfter) / maxKE) * barMaxH

      // Lost section (red/orange)
      if (keLostH > 0.5) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'
        ctx.fillRect(
          keSectionX + barW + gap,
          barAreaTop + 18 + barMaxH - keAfterH - keLostH,
          barW,
          keLostH
        )
        // Dashed border for lost section
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)'
        ctx.setLineDash([3, 2])
        ctx.strokeRect(
          keSectionX + barW + gap,
          barAreaTop + 18 + barMaxH - keAfterH - keLostH,
          barW,
          keLostH
        )
        ctx.setLineDash([])
      }

      // Remaining KE after
      const afterColor = keLostH > 0.5 ? '#F59E0B' : '#34D399'
      ctx.fillStyle = afterColor
      ctx.fillRect(
        keSectionX + barW + gap,
        barAreaTop + 18 + barMaxH - keAfterH,
        barW,
        keAfterH
      )
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.strokeRect(
        keSectionX + barW + gap,
        barAreaTop + 18 + barMaxH - keAfterH,
        barW,
        keAfterH
      )

      ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
      ctx.font = '10px sans-serif'
      ctx.fillText(
        'After',
        keSectionX + barW + gap + barW / 2,
        barAreaTop + 18 + barMaxH + 14
      )
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 10px monospace'
      ctx.fillText(
        keAfter.toFixed(1),
        keSectionX + barW + gap + barW / 2,
        barAreaTop + 18 + barMaxH - keAfterH - 6
      )

      // KE conservation label
      const keConserved = Math.abs(keBefore - keAfter) < 0.01
      ctx.fillStyle = keConserved ? '#34D399' : '#F59E0B'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(
        keConserved
          ? '\u2713 Conserved'
          : `\u2717 Lost: ${(keBefore - keAfter).toFixed(1)} J`,
        keSectionX + barW + gap / 2,
        barAreaTop + 18 + barMaxH + 30
      )

      // Final velocities readout
      if (finalVelocities) {
        const readoutY = barAreaBottom + 10
        ctx.fillStyle = 'rgba(148, 163, 184, 0.5)'
        ctx.font = '11px sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('Results:', trackLeft, readoutY)

        ctx.fillStyle = '#FCA5A5'
        ctx.font = '11px monospace'
        ctx.fillText(
          `Ball 1: v = ${finalVelocities.v1.toFixed(2)} m/s`,
          trackLeft + 60,
          readoutY
        )

        ctx.fillStyle = '#93C5FD'
        ctx.fillText(
          `Ball 2: v = ${finalVelocities.v2.toFixed(2)} m/s`,
          trackLeft + 250,
          readoutY
        )
      }
    }

    // Challenge mode indicator
    if (challengeMode) {
      ctx.fillStyle = 'rgba(251, 191, 36, 0.8)'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(
        'CHALLENGE: Make Ball 1 stop completely after collision!',
        containerWidth / 2,
        containerHeight - 12
      )
    }
  }, [
    containerWidth,
    containerHeight,
    phase,
    animTime,
    flashOpacity,
    m1,
    m2,
    u1,
    u2,
    r1,
    r2,
    startX1,
    startX2,
    trackY,
    trackLeft,
    trackRight,
    collisionX,
    collisionType,
    finalVelocities,
    challengeMode,
    getBallPositions,
  ])

  // Will they collide?
  const willCollide = u1 - u2 > 0

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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Ball 1 controls */}
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 space-y-2">
          <h4 className="text-sm font-semibold text-red-300 flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: '#EF4444' }}
            />
            Ball 1
          </h4>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-xs text-slate-400">
              <span>Mass: {m1.toFixed(1)} kg</span>
              <span className="text-slate-600">0.5 - 10</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={m1}
              onChange={(e) => handleParam('mass1', parseFloat(e.target.value))}
              disabled={phase !== PHASE_IDLE}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-red-500 cursor-pointer disabled:opacity-40"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-xs text-slate-400">
              <span>Velocity: {u1.toFixed(1)} m/s</span>
              <span className="text-slate-600">-20 to 20</span>
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.5"
              value={u1}
              onChange={(e) => handleParam('velocity1', parseFloat(e.target.value))}
              disabled={phase !== PHASE_IDLE}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-red-500 cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Ball 2 controls */}
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 space-y-2">
          <h4 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: '#3B82F6' }}
            />
            Ball 2
          </h4>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-xs text-slate-400">
              <span>Mass: {m2.toFixed(1)} kg</span>
              <span className="text-slate-600">0.5 - 10</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.5"
              value={m2}
              onChange={(e) => handleParam('mass2', parseFloat(e.target.value))}
              disabled={phase !== PHASE_IDLE}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-red-500 cursor-pointer disabled:opacity-40"
            />
          </div>
          <div className="space-y-1">
            <label className="flex items-center justify-between text-xs text-slate-400">
              <span>Velocity: {u2.toFixed(1)} m/s</span>
              <span className="text-slate-600">-20 to 20</span>
            </label>
            <input
              type="range"
              min="-20"
              max="20"
              step="0.5"
              value={u2}
              onChange={(e) => handleParam('velocity2', parseFloat(e.target.value))}
              disabled={phase !== PHASE_IDLE}
              className="w-full h-1.5 rounded-full appearance-none bg-slate-700 accent-blue-500 cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>
      </div>

      {/* Collision type toggle + action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Collision type toggle */}
        <div className="flex items-center rounded-lg border border-slate-700/40 bg-slate-800/50 overflow-hidden">
          <button
            onClick={() => handleParam('collisionType', 'elastic')}
            disabled={phase !== PHASE_IDLE}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              collisionType === 'elastic'
                ? 'bg-emerald-600/80 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            } disabled:opacity-40`}
          >
            Elastic
          </button>
          <button
            onClick={() => handleParam('collisionType', 'inelastic')}
            disabled={phase !== PHASE_IDLE}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              collisionType !== 'elastic'
                ? 'bg-amber-600/80 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            } disabled:opacity-40`}
          >
            Perfectly Inelastic
          </button>
        </div>

        {/* Action buttons */}
        {phase === PHASE_IDLE ? (
          <button
            onClick={startCollision}
            disabled={!willCollide}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
              willCollide
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {willCollide ? 'Collide!' : 'Balls not approaching'}
          </button>
        ) : phase === PHASE_DONE ? (
          <button
            onClick={resetAnimation}
            className="px-6 py-2 rounded-lg text-sm font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors cursor-pointer"
          >
            Reset
          </button>
        ) : (
          <span className="text-sm text-slate-400 italic">Animating...</span>
        )}

        {/* Challenge mode toggle */}
        <button
          onClick={() => setChallengeMode((c) => !c)}
          className={`ml-auto px-4 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
            challengeMode
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
              : 'border-slate-700/40 bg-slate-800/50 text-slate-400 hover:text-slate-200'
          }`}
        >
          {challengeMode ? 'Challenge ON' : 'Challenge Mode'}
        </button>
      </div>

      {/* Computed readout panel */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Total Momentum
          </div>
          <div className="text-sm font-mono text-green-400 font-semibold">
            {computed.momentumBefore.toFixed(1)} kg{'\u00B7'}m/s
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            KE Before
          </div>
          <div className="text-sm font-mono text-green-400 font-semibold">
            {computed.keBefore.toFixed(1)} J
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            KE After
          </div>
          <div
            className={`text-sm font-mono font-semibold ${
              computed.keLost > 0.01 ? 'text-amber-400' : 'text-green-400'
            }`}
          >
            {computed.keAfter.toFixed(1)} J
          </div>
        </div>
        <div className="rounded-lg bg-slate-800/40 border border-slate-700/30 p-2">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">
            Energy Lost
          </div>
          <div
            className={`text-sm font-mono font-semibold ${
              computed.keLost > 0.01 ? 'text-red-400' : 'text-slate-500'
            }`}
          >
            {computed.keLost.toFixed(1)} J
          </div>
        </div>
      </div>

      {/* Challenge result */}
      {challengeMode && finalVelocities && (phase === PHASE_DONE || phase === PHASE_SEPARATING) && (
        <div
          className={`rounded-lg border p-3 text-sm ${
            Math.abs(finalVelocities.v1) < 0.05
              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-300'
              : 'border-amber-500/30 bg-amber-500/5 text-amber-300'
          }`}
        >
          {Math.abs(finalVelocities.v1) < 0.05 ? (
            <span>
              Ball 1 final velocity: {finalVelocities.v1.toFixed(3)} m/s.
              Perfect stop! Hint: equal masses in elastic collision transfer all momentum.
            </span>
          ) : (
            <span>
              Ball 1 final velocity: {finalVelocities.v1.toFixed(3)} m/s.
              Try adjusting masses and velocities to make Ball 1 stop (v1 = 0).
              Think about what happens when both masses are equal in an elastic collision.
            </span>
          )}
        </div>
      )}

      {/* Discoveries */}
      {discoveredItems.size > 0 && (
        <div className="flex flex-wrap gap-2">
          {[...discoveredItems].map((d) => (
            <span
              key={d}
              className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
            >
              {d === 'momentum-conserved'
                ? 'Momentum is Conserved!'
                : d === 'equal-mass-transfer'
                  ? 'Equal Mass Transfer!'
                  : d}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default CollisionLab
