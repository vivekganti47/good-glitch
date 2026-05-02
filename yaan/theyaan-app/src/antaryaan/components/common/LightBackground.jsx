import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * Beautiful light theme background with:
 * - Soft gradient mesh (peach, lavender, mint, rose tints)
 * - Subtle floating constellation patterns as watermarks
 * - Paper-like texture overlay
 * - Gentle animated gradient shifts
 */

// Constellation pattern SVG for watermark effect
function ConstellationWatermark({ className, opacity = 0.03 }) {
  return (
    <svg
      className={className}
      viewBox="0 0 400 300"
      fill="none"
      style={{ opacity }}
    >
      {/* Kinesis Prime pattern */}
      <g stroke="#D97706" strokeWidth="0.5" opacity="0.6">
        <circle cx="40" cy="240" r="3" fill="#D97706" />
        <circle cx="100" cy="180" r="2.5" fill="#D97706" />
        <circle cx="180" cy="135" r="3" fill="#D97706" />
        <circle cx="260" cy="180" r="2.5" fill="#D97706" />
        <circle cx="160" cy="75" r="2.5" fill="#D97706" />
        <circle cx="280" cy="45" r="3" fill="#D97706" />
        <circle cx="352" cy="105" r="3.5" fill="#D97706" />
        <line x1="40" y1="240" x2="100" y2="180" />
        <line x1="100" y1="180" x2="180" y2="135" />
        <line x1="180" y1="135" x2="260" y2="180" />
        <line x1="180" y1="135" x2="160" y2="75" />
        <line x1="160" y1="75" x2="280" y2="45" />
        <line x1="280" y1="45" x2="352" y2="105" />
        <line x1="260" y1="180" x2="352" y2="105" />
      </g>

      {/* Periodic Sanctum pattern */}
      <g stroke="#059669" strokeWidth="0.5" opacity="0.5" transform="translate(50, 20)">
        <circle cx="20" cy="132" r="2" fill="#059669" />
        <circle cx="56" cy="84" r="2" fill="#059669" />
        <circle cx="96" cy="132" r="2" fill="#059669" />
        <circle cx="136" cy="84" r="2.5" fill="#059669" />
        <circle cx="136" cy="168" r="2" fill="#059669" />
        <circle cx="180" cy="120" r="2.5" fill="#059669" />
        <line x1="20" y1="132" x2="56" y2="84" />
        <line x1="56" y1="84" x2="96" y2="132" />
        <line x1="96" y1="132" x2="136" y2="84" />
        <line x1="96" y1="132" x2="136" y2="168" />
        <line x1="136" y1="84" x2="180" y2="120" />
        <line x1="136" y1="168" x2="180" y2="120" />
      </g>
    </svg>
  )
}

// Floating geometric shapes
function FloatingShapes() {
  const shapes = useMemo(() => [
    { type: 'circle', size: 300, x: '10%', y: '20%', color: 'rgba(251,191,36,0.04)', delay: 0 },
    { type: 'circle', size: 200, x: '80%', y: '15%', color: 'rgba(167,139,250,0.035)', delay: 1 },
    { type: 'circle', size: 250, x: '70%', y: '70%', color: 'rgba(52,211,153,0.03)', delay: 2 },
    { type: 'circle', size: 180, x: '15%', y: '75%', color: 'rgba(251,113,133,0.025)', delay: 0.5 },
    { type: 'circle', size: 120, x: '50%', y: '40%', color: 'rgba(96,165,250,0.025)', delay: 1.5 },
  ], [])

  return (
    <>
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            background: `radial-gradient(circle, ${shape.color} 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}
    </>
  )
}

// Subtle grid pattern
function GridPattern() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(148, 163, 184, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(148, 163, 184, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      }}
    />
  )
}

export default function LightBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden no-transition" style={{ background: '#FAFBFD' }}>
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #FAFBFD 0%, #F8FAFC 50%, #F1F5F9 100%)',
        }}
      />

      {/* Soft gradient mesh overlays */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 20% 30%, rgba(251,191,36,0.08) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 85% 20%, rgba(167,139,250,0.06) 0%, transparent 45%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 65% 85%, rgba(52,211,153,0.05) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 60% at 10% 75%, rgba(251,113,133,0.04) 0%, transparent 40%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 50% 50%, rgba(96,165,250,0.03) 0%, transparent 35%)',
        }}
      />

      {/* Floating shapes */}
      <FloatingShapes />

      {/* Subtle grid pattern */}
      <GridPattern />

      {/* Constellation watermarks */}
      <ConstellationWatermark
        className="absolute top-10 right-10 w-96 h-72"
        opacity={0.025}
      />
      <ConstellationWatermark
        className="absolute bottom-20 left-10 w-80 h-60 transform -scale-x-100"
        opacity={0.02}
      />

      {/* Paper texture noise overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.015,
        }}
      />

      {/* Subtle vignette for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 60%, rgba(241, 245, 249, 0.5) 100%)',
        }}
      />
    </div>
  )
}
