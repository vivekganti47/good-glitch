import { useEffect, useRef, useCallback } from 'react'
import useThemeStore from '../../stores/themeStore'
import LightBackground from './LightBackground'

const STAR_COUNT = 200
const TWINKLE_SPEED = 0.02
const PARALLAX_FACTOR = 0.015

function DarkSpaceBackground() {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef(null)

  const initStars = useCallback((width, height) => {
    const stars = []
    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.2,
        baseAlpha: Math.random() * 0.6 + 0.4,
        alpha: Math.random(),
        twinkleOffset: Math.random() * Math.PI * 2,
        twinkleSpeed: TWINKLE_SPEED + Math.random() * 0.02,
        depth: Math.random() * 3 + 1, // 1 = far, 4 = near (parallax layer)
        color: getStarColor(),
      })
    }
    starsRef.current = stars
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let width = window.innerWidth
    let height = window.innerHeight

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initStars(width, height)
    }

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / width - 0.5) * 2,
        y: (e.clientY / height - 0.5) * 2,
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    let time = 0

    const animate = () => {
      time += 1
      ctx.clearRect(0, 0, width, height)

      // Draw stars
      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      starsRef.current.forEach((star) => {
        // Twinkle effect
        const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset)
        star.alpha = star.baseAlpha + twinkle * 0.3

        // Parallax offset based on mouse position and star depth
        const parallaxX = mx * PARALLAX_FACTOR * star.depth * 20
        const parallaxY = my * PARALLAX_FACTOR * star.depth * 20

        const drawX = star.x + parallaxX
        const drawY = star.y + parallaxY

        ctx.beginPath()
        ctx.arc(drawX, drawY, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color.replace('ALPHA', Math.max(0, Math.min(1, star.alpha)).toFixed(2))
        ctx.fill()

        // Add a soft glow for brighter stars
        if (star.radius > 1.2) {
          ctx.beginPath()
          ctx.arc(drawX, drawY, star.radius * 3, 0, Math.PI * 2)
          ctx.fillStyle = star.color.replace('ALPHA', (star.alpha * 0.1).toFixed(2))
          ctx.fill()
        }
      })

      animFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
      }
    }
  }, [initStars])

  return (
    <div className="fixed inset-0 z-0 overflow-hidden no-transition" style={{ background: '#0A0E1A' }}>
      {/* Nebula gradient overlays */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background:
            'radial-gradient(ellipse 60% 80% at 80% 30%, rgba(139, 92, 246, 0.12) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at 60% 80%, rgba(14, 165, 233, 0.1) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 10% 90%, rgba(244, 114, 182, 0.08) 0%, transparent 40%)',
        }}
      />

      {/* Star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Subtle vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(10, 14, 26, 0.4) 100%)',
        }}
      />
    </div>
  )
}

function getStarColor() {
  const colors = [
    'rgba(255, 255, 255, ALPHA)',  // White
    'rgba(255, 255, 255, ALPHA)',  // White (more common)
    'rgba(200, 220, 255, ALPHA)',  // Blue-white
    'rgba(255, 240, 220, ALPHA)',  // Warm white
    'rgba(180, 200, 255, ALPHA)',  // Cool blue
    'rgba(255, 220, 180, ALPHA)',  // Amber
    'rgba(220, 200, 255, ALPHA)',  // Lavender
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

// Main component that switches between light and dark backgrounds
function SpaceBackground() {
  const theme = useThemeStore((s) => s.theme)

  if (theme === 'light') {
    return <LightBackground />
  }

  return <DarkSpaceBackground />
}

export default SpaceBackground
