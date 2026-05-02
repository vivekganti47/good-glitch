import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useLocation } from 'react-router-dom'

/**
 * WarpTransition - Starfield warp speed effect overlay.
 *
 * Renders a full-screen Canvas overlay that plays a brief (800ms)
 * "warp to lightspeed" animation when the route changes.
 * Stars streak outward from the center, then fade to reveal the new page.
 *
 * Attach to AntarYaan layout; triggers on every location.pathname change.
 */

const STAR_COUNT = 160
const DURATION = 750 // ms

function createWarpStar(w, h) {
  const angle = Math.random() * Math.PI * 2
  const dist = Math.random() * 40 + 5
  return {
    x: w / 2 + Math.cos(angle) * dist,
    y: h / 2 + Math.sin(angle) * dist,
    angle,
    speed: Math.random() * 8 + 4,
    length: Math.random() * 3 + 1,
    brightness: Math.random() * 0.6 + 0.4,
  }
}

export default function WarpTransition() {
  const location = useLocation()
  const [isActive, setIsActive] = useState(false)
  const canvasRef = useRef(null)
  const rafRef = useRef(null)
  const prevPath = useRef(location.pathname)
  const startTimeRef = useRef(0)

  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = window.innerWidth
    const h = window.innerHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.scale(dpr, dpr)

    const stars = Array.from({ length: STAR_COUNT }, () => createWarpStar(w, h))
    startTimeRef.current = performance.now()

    const render = (now) => {
      const elapsed = now - startTimeRef.current
      const progress = Math.min(elapsed / DURATION, 1)

      // Easing: ease-in for first half, ease-out for second
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2

      ctx.clearRect(0, 0, w, h)

      // Background fade
      const bgAlpha = progress < 0.4 ? eased * 0.6 : 0.6 * (1 - (progress - 0.4) / 0.6)
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.max(0, bgAlpha)})`
      ctx.fillRect(0, 0, w, h)

      // Central flash at peak
      if (progress > 0.3 && progress < 0.7) {
        const flashIntensity = 1 - Math.abs(progress - 0.5) / 0.2
        const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.4)
        grad.addColorStop(0, `rgba(200, 220, 255, ${flashIntensity * 0.15})`)
        grad.addColorStop(1, 'transparent')
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      // Draw streaking stars
      const streakMultiplier = 1 + eased * 25

      for (const star of stars) {
        const dx = Math.cos(star.angle)
        const dy = Math.sin(star.angle)
        const currentDist = star.speed * streakMultiplier
        const endX = w / 2 + dx * currentDist
        const endY = h / 2 + dy * currentDist
        const startX = w / 2 + dx * (currentDist - star.length * streakMultiplier * 0.5)
        const startY = h / 2 + dy * (currentDist - star.length * streakMultiplier * 0.5)

        const alpha = star.brightness * (progress < 0.6 ? eased : (1 - progress) / 0.4)

        ctx.beginPath()
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = `rgba(200, 220, 255, ${Math.max(0, alpha)})`
        ctx.lineWidth = star.length * (0.5 + eased * 0.5)
        ctx.stroke()
      }

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(render)
      } else {
        setIsActive(false)
      }
    }

    rafRef.current = requestAnimationFrame(render)
  }, [])

  // Trigger on route change
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      prevPath.current = location.pathname

      // Only trigger for major navigation (not hash/search changes)
      setIsActive(true)
    }
  }, [location.pathname])

  // Run animation when active
  useEffect(() => {
    if (isActive) {
      runAnimation()
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [isActive, runAnimation])

  if (!isActive) return null

  return createPortal(
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{ width: '100vw', height: '100vh' }}
    />,
    document.body
  )
}
