import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import { CheckCircle2, Star, Trophy, Sparkles, Zap } from 'lucide-react'
import useThemeStore from '../../stores/themeStore'

// Generate random particles for burst effect
function generateParticles(count, centerX, centerY) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: centerX,
    y: centerY,
    angle: (i / count) * Math.PI * 2,
    distance: 40 + Math.random() * 60,
    size: 4 + Math.random() * 6,
    delay: Math.random() * 0.1,
  }))
}

// Correct Answer Burst - shows when answer is correct
export function CorrectAnswerBurst({ show, onComplete }) {
  const containerRef = useRef(null)
  const [particles, setParticles] = useState([])

  useEffect(() => {
    if (show) {
      setParticles(generateParticles(12, 0, 0))
    }
  }, [show])

  useGSAP(() => {
    if (!show || particles.length === 0) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setParticles([])
          onComplete?.()
        }
      })

      // Checkmark entrance
      tl.from('.success-check', {
        scale: 0,
        rotation: -180,
        duration: 0.5,
        ease: 'back.out(2)'
      })

      // Particles burst outward
      particles.forEach((p, i) => {
        tl.to(`.particle-${i}`, {
          x: Math.cos(p.angle) * p.distance,
          y: Math.sin(p.angle) * p.distance,
          opacity: 0,
          scale: 0.5,
          duration: 0.6,
          ease: 'power2.out',
        }, 0.1 + p.delay)
      })

      // Fade out checkmark
      tl.to('.success-check', {
        scale: 1.2,
        opacity: 0,
        duration: 0.3,
      }, 0.8)

    }, containerRef)

    return () => ctx.revert()
  }, { dependencies: [show, particles], scope: containerRef })

  if (!show) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
    >
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`particle-${p.id} absolute rounded-full bg-emerald-400`}
          style={{
            width: p.size,
            height: p.size,
            left: '50%',
            top: '50%',
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
          }}
        />
      ))}

      {/* Checkmark */}
      <div className="success-check w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-12 h-12 text-emerald-400" />
      </div>
    </div>
  )
}

// Discovery Sparkle - shows when discovering something in a simulation
export function DiscoverySparkle({ show, text, onComplete }) {
  const containerRef = useRef(null)

  useGSAP(() => {
    if (!show) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => onComplete?.()
      })

      // Container entrance
      tl.from('.discovery-card', {
        scale: 0.8,
        y: 20,
        opacity: 0,
        duration: 0.4,
        ease: 'back.out(1.5)'
      })

      // Sparkle icons rotate
      .to('.sparkle-icon', {
        rotation: 360,
        duration: 1,
        ease: 'linear',
        stagger: 0.1
      }, 0)

      // Hold and fade
      .to('.discovery-card', {
        y: -10,
        opacity: 0,
        duration: 0.4,
        ease: 'power2.in'
      }, '+=1.5')

    }, containerRef)

    return () => ctx.revert()
  }, { dependencies: [show], scope: containerRef })

  if (!show) return null

  return (
    <div
      ref={containerRef}
      className="fixed top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
    >
      <div className="discovery-card flex items-center gap-3 px-5 py-3 rounded-xl bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm">
        <Sparkles className="sparkle-icon w-5 h-5 text-amber-400" />
        <span className="text-amber-200 font-medium text-sm">{text || 'Discovery!'}</span>
        <Zap className="sparkle-icon w-4 h-4 text-amber-400" />
      </div>
    </div>
  )
}

// Quiz Complete - shows trophy and score after quiz
export function QuizComplete({ show, score, total, onComplete }) {
  const containerRef = useRef(null)
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'

  const percentage = Math.round((score / total) * 100)
  const isGood = percentage >= 70

  useGSAP(() => {
    if (!show) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Trophy entrance
      tl.from('.trophy-icon', {
        scale: 0,
        rotation: -180,
        duration: 0.6,
        ease: 'back.out(2)'
      })

      // Score counter
      .from('.score-text', {
        textContent: 0,
        duration: 0.8,
        snap: { textContent: 1 },
        ease: 'power1.out'
      }, 0.3)

      // Message fade in
      .from('.quiz-message', {
        opacity: 0,
        y: 10,
        duration: 0.4
      }, 0.6)

    }, containerRef)

    return () => ctx.revert()
  }, { dependencies: [show], scope: containerRef })

  if (!show) return null

  return (
    <div
      ref={containerRef}
      className="text-center py-6 space-y-4"
    >
      <div
        className={`trophy-icon w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
          isGood ? 'bg-amber-500/20' : 'bg-slate-500/20'
        }`}
      >
        <Trophy className={`w-8 h-8 ${isGood ? 'text-amber-400' : 'text-slate-400'}`} />
      </div>

      <div className="space-y-1">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          Quiz Complete!
        </h3>
        <p className={isDark ? 'text-white/60' : 'text-slate-600'}>
          You got{' '}
          <span className={`score-text font-bold ${isGood ? 'text-amber-400' : 'text-slate-400'}`}>
            {score}
          </span>
          {' '}out of{' '}
          <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{total}</span>
          {' '}correct
        </p>
      </div>

      <p className={`quiz-message text-sm ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
        {isGood ? 'Great work! You\'re mastering this topic.' : 'Keep practicing to improve your mastery.'}
      </p>
    </div>
  )
}

// Lesson Complete Celebration - full screen celebration
export function LessonCompleteCelebration({ star, constellation, earnedXP, onContinue, onBack }) {
  const containerRef = useRef(null)
  const theme = useThemeStore((s) => s.theme)
  const isDark = theme === 'dark'
  const [particles, setParticles] = useState([])

  const starColor = constellation?.colors?.primary || '#F59E0B'

  useEffect(() => {
    // Generate confetti particles
    const confetti = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      color: ['#F59E0B', '#10B981', '#8B5CF6', '#3B82F6', '#EF4444'][Math.floor(Math.random() * 5)],
      delay: Math.random() * 0.5,
    }))
    setParticles(confetti)
  }, [])

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Confetti fall animation
      particles.forEach((p) => {
        gsap.to(`.confetti-${p.id}`, {
          y: window.innerHeight + 50,
          rotation: p.rotation + 720,
          duration: 2 + Math.random() * 2,
          delay: p.delay,
          ease: 'power1.in',
        })
      })

      // Star burst entrance
      tl.from('.star-burst', {
        scale: 0,
        rotation: -360,
        duration: 0.8,
        ease: 'back.out(1.7)'
      })

      // Glow pulse
      .to('.star-glow', {
        scale: 1.3,
        opacity: 0.5,
        duration: 1,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      }, 0.5)

      // Title entrance
      .from('.completion-title', {
        y: 30,
        opacity: 0,
        duration: 0.5
      }, 0.4)

      // XP counter
      .from('.xp-value', {
        textContent: 0,
        duration: 1,
        snap: { textContent: 1 },
        ease: 'power1.out'
      }, 0.6)

      // Concept badges
      .from('.concept-badge', {
        scale: 0,
        stagger: 0.1,
        duration: 0.4,
        ease: 'back.out(2)'
      }, 0.8)

      // Action buttons
      .from('.action-buttons button', {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.4
      }, 1.2)

    }, containerRef)

    return () => ctx.revert()
  }, { dependencies: [particles], scope: containerRef })

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
    >
      {/* Confetti particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className={`confetti-${p.id} fixed w-3 h-3 rounded-sm`}
          style={{
            left: `${p.x}%`,
            top: p.y,
            backgroundColor: p.color,
            transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
          }}
        />
      ))}

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        {/* Star burst animation */}
        <div className="star-burst relative mx-auto w-32 h-32">
          <div
            className="star-glow absolute inset-0 rounded-full"
            style={{
              background: `radial-gradient(circle, ${starColor}50 0%, transparent 70%)`,
              transform: 'scale(1.5)',
            }}
          />
          <div
            className="absolute inset-2 rounded-full flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, ${starColor}30 0%, ${starColor}10 70%)`,
              boxShadow: `0 0 60px ${starColor}40`,
            }}
          >
            <Star size={48} style={{ color: starColor }} fill={starColor} />
          </div>
        </div>

        {/* Title */}
        <div className="completion-title space-y-2">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Star Completed!
          </h1>
          <p className={isDark ? 'text-white/50' : 'text-slate-500'}>
            {star?.name || 'Lesson'}
          </p>
        </div>

        {/* XP Earned */}
        <div
          className="rounded-xl p-6 border"
          style={{
            backgroundColor: `${starColor}10`,
            borderColor: `${starColor}30`,
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Zap className="w-6 h-6" style={{ color: starColor }} />
            <span
              className="xp-value text-3xl font-bold"
              style={{ color: starColor }}
              data-value={earnedXP}
            >
              +{earnedXP}
            </span>
            <span className={`text-xl ${isDark ? 'text-white/60' : 'text-slate-600'}`}>XP</span>
          </div>
        </div>

        {/* Concepts mastered */}
        {star?.concepts && star.concepts.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-sm uppercase tracking-wide ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
              Concepts Covered
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {star.concepts.map((c) => (
                <span
                  key={c}
                  className={`concept-badge px-3 py-1 rounded-full text-xs ${
                    isDark
                      ? 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-300'
                      : 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                  }`}
                >
                  {c.replace(/-/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="action-buttons flex flex-col gap-3 pt-4">
          <button
            onClick={onContinue}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{
              background: `linear-gradient(135deg, ${starColor} 0%, ${starColor}CC 100%)`,
              boxShadow: `0 4px 20px ${starColor}40`,
            }}
          >
            Continue to Next Star
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={onBack}
            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors ${
              isDark
                ? 'bg-white/5 text-white/70 hover:bg-white/10'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Back to {constellation?.name || 'Constellation'}
          </button>
        </div>
      </div>
    </div>
  )
}
