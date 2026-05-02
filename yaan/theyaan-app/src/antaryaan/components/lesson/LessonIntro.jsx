import { useRef, useEffect, useMemo } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { Star, Clock, Gamepad2, Sparkles, ChevronRight, Target } from 'lucide-react'
import useThemeStore from '../../stores/themeStore'

// Floating particle component for background
function FloatingParticles({ count = 30, color }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 2,
    }))
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

// Word-by-word text reveal component
function AnimatedTitle({ text, className = '' }) {
  const words = text.split(' ')

  return (
    <div className={`flex flex-wrap justify-center gap-x-3 gap-y-1 ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className="title-word inline-block"
          style={{ opacity: 0, transform: 'translateY(20px) rotateX(-40deg)' }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}

// Concept badge component
function ConceptBadge({ concept, index, isDark }) {
  const formattedConcept = concept.replace(/-/g, ' ')

  return (
    <div
      className={`concept-badge px-4 py-2 rounded-xl border text-sm font-medium capitalize
        ${isDark
          ? 'bg-white/5 border-white/10 text-white/80'
          : 'bg-slate-100 border-slate-200 text-slate-700'
        }`}
      style={{ opacity: 0, transform: 'scale(0.8) translateY(10px)' }}
    >
      {formattedConcept}
    </div>
  )
}

// Stat item with counter animation
function StatItem({ icon: Icon, value, label, color, isDark }) {
  return (
    <div className="stat-item flex flex-col items-center gap-1" style={{ opacity: 0, transform: 'translateY(20px)' }}>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <span
        className={`stat-value text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}
        data-value={value}
      >
        {value}
      </span>
      <span className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  )
}

export default function LessonIntro({ star, constellation, onBegin }) {
  const containerRef = useRef(null)
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const starColor = constellation?.colors?.primary || '#F59E0B'
  const concepts = star?.concepts || []
  const duration = star?.duration || 8
  const xp = star?.xp || 15

  // Count simulations in blocks
  const simulationCount = useMemo(() => {
    const blocks = star?.blocks || []
    return blocks.filter(b => ['simulation', 'sandbox', 'challenge'].includes(b.type)).length
  }, [star])

  // Get star position in constellation
  const starPosition = useMemo(() => {
    if (!constellation?.starIds || !star?.id) return '1 of 1'
    const index = constellation.starIds.indexOf(star.id)
    return `${index + 1} of ${constellation.starIds.length}`
  }, [constellation, star])

  // GSAP animation timeline
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // 0. Particles fade in and float
      tl.to('.particle', {
        opacity: 0.6,
        duration: 1,
        stagger: {
          each: 0.02,
          from: 'random'
        }
      })

      // 0.2s - Star icon entrance
      .from('.star-icon-container', {
        scale: 0,
        rotation: -180,
        duration: 0.8,
        ease: 'back.out(1.7)'
      }, 0.2)

      // Continuous glow pulse on star
      .to('.star-glow', {
        scale: 1.2,
        opacity: 0.3,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }, 0.5)

      // 0.6s - Title words reveal
      .to('.title-word', {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: 'back.out(1.7)'
      }, 0.6)

      // 0.9s - Constellation label
      .from('.constellation-label', {
        opacity: 0,
        y: 10,
        duration: 0.4
      }, 0.9)

      // 1.0s - Concepts section header
      .from('.concepts-header', {
        opacity: 0,
        x: -20,
        duration: 0.4
      }, 1.0)

      // 1.1s - Concept badges stagger in
      .to('.concept-badge', {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.08,
        ease: 'back.out(1.5)'
      }, 1.1)

      // 1.4s - Stats row
      .to('.stat-item', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        stagger: 0.1,
        ease: 'power2.out'
      }, 1.4)

      // 1.6s - Begin button
      .from('.begin-button', {
        scale: 0.9,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
      }, 1.6)

      // Button glow pulse
      .to('.button-glow', {
        scale: 1.1,
        opacity: 0.4,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }, 1.8)

      // Continuous particle float animation
      gsap.to('.particle', {
        y: '-=30',
        x: '+=10',
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: {
          each: 0.1,
          from: 'random'
        }
      })

    }, containerRef)

    return () => ctx.revert()
  }, { scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-6 relative"
    >
      {/* Floating particles background */}
      <FloatingParticles count={40} color={starColor} />

      {/* Main content */}
      <div className="max-w-lg w-full text-center space-y-8 relative z-10">

        {/* Star icon with glow */}
        <div className="star-icon-container relative mx-auto w-24 h-24">
          {/* Glow effect */}
          <div
            className="star-glow absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${starColor}40 0%, transparent 70%)`,
              transform: 'scale(1.5)',
            }}
          />
          {/* Star icon */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${starColor}30 0%, ${starColor}10 100%)`,
              border: `2px solid ${starColor}50`,
              boxShadow: `0 0 30px ${starColor}30, inset 0 0 20px ${starColor}10`,
            }}
          >
            <Star
              className="w-10 h-10"
              style={{ color: starColor }}
              fill={starColor}
            />
          </div>
        </div>

        {/* Star name with word animation */}
        <div className="space-y-3">
          <AnimatedTitle
            text={star?.name || 'Lesson'}
            className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}
          />

          <p
            className={`constellation-label text-sm font-medium ${isDark ? 'text-white/50' : 'text-slate-500'}`}
            style={{ color: starColor }}
          >
            {constellation?.name || 'Constellation'} • Star {starPosition}
          </p>
        </div>

        {/* Concepts you'll master */}
        {concepts.length > 0 && (
          <div className={`rounded-2xl p-5 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
            <div className="concepts-header flex items-center justify-center gap-2 mb-4">
              <Target className={`w-4 h-4 ${isDark ? 'text-white/60' : 'text-slate-600'}`} />
              <span className={`text-sm font-semibold ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                You'll Master
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {concepts.slice(0, 6).map((concept, i) => (
                <ConceptBadge
                  key={concept}
                  concept={concept}
                  index={i}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="flex justify-center gap-8">
          <StatItem
            icon={Clock}
            value={`~${duration}`}
            label="minutes"
            color="#64748B"
            isDark={isDark}
          />
          <StatItem
            icon={Gamepad2}
            value={simulationCount}
            label={simulationCount === 1 ? 'game' : 'games'}
            color="#8B5CF6"
            isDark={isDark}
          />
          <StatItem
            icon={Sparkles}
            value={xp}
            label="XP"
            color="#F59E0B"
            isDark={isDark}
          />
        </div>

        {/* Begin Journey button */}
        <div className="pt-4">
          <button
            onClick={onBegin}
            className="begin-button relative group"
          >
            {/* Button glow */}
            <div
              className="button-glow absolute inset-0 rounded-2xl"
              style={{
                background: `linear-gradient(135deg, ${starColor}30 0%, ${starColor}10 100%)`,
                filter: 'blur(15px)',
              }}
            />
            {/* Button content */}
            <div
              className="relative flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg transition-transform duration-200 group-hover:scale-[1.02]"
              style={{
                background: `linear-gradient(135deg, ${starColor} 0%, ${starColor}CC 100%)`,
                color: '#FFFFFF',
                boxShadow: `0 4px 20px ${starColor}40`,
              }}
            >
              <Sparkles className="w-5 h-5" />
              Begin Your Journey
              <ChevronRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </button>
        </div>

        {/* Keyboard hint */}
        <p className={`text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          Press <kbd className={`px-1.5 py-0.5 rounded ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>Enter</kbd> to start
        </p>
      </div>
    </div>
  )
}
