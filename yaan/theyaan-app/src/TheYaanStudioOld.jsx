import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ============================================================
// CUSTOM CURSOR - Real implementation, not AI template garbage
// ============================================================
function CustomCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [cursorText, setCursorText] = useState('')

  useEffect(() => {
    const cursor = cursorRef.current
    const dot = cursorDotRef.current

    let mouseX = 0, mouseY = 0
    let cursorX = 0, cursorY = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    const animate = () => {
      // Smooth follow with lag
      cursorX += (mouseX - cursorX) * 0.15
      cursorY += (mouseY - cursorY) * 0.15

      if (cursor) {
        cursor.style.transform = `translate3d(${cursorX - 40}px, ${cursorY - 40}px, 0)`
      }
      if (dot) {
        dot.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`
      }

      requestAnimationFrame(animate)
    }

    // Detect hoverable elements
    const onMouseOver = (e) => {
      const target = e.target
      if (target.closest('[data-cursor="pointer"]') || target.closest('a') || target.closest('button')) {
        setIsHovering(true)
        const text = target.closest('[data-cursor-text]')?.dataset.cursorText
        if (text) setCursorText(text)
      }
      if (target.closest('[data-cursor="hidden"]')) {
        setIsHidden(true)
      }
    }

    const onMouseOut = (e) => {
      const target = e.target
      if (target.closest('[data-cursor="pointer"]') || target.closest('a') || target.closest('button')) {
        setIsHovering(false)
        setCursorText('')
      }
      if (target.closest('[data-cursor="hidden"]')) {
        setIsHidden(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)
    animate()

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className={`fixed top-0 left-0 w-20 h-20 pointer-events-none z-[9999] mix-blend-difference transition-all duration-300 hidden lg:flex items-center justify-center ${
          isHovering ? 'scale-150' : 'scale-100'
        } ${isHidden ? 'opacity-0' : 'opacity-100'}`}
      >
        <div className={`w-full h-full rounded-full border border-[#F59E0B] flex items-center justify-center transition-all duration-300 ${
          isHovering ? 'bg-[#F59E0B]' : 'bg-transparent'
        }`}>
          {cursorText && (
            <span className="text-xs font-mono uppercase tracking-widest text-black">{cursorText}</span>
          )}
        </div>
      </div>
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-[#F59E0B] pointer-events-none z-[9999] hidden lg:block"
      />
    </>
  )
}

// ============================================================
// MAGNETIC ELEMENT - Pulls toward cursor
// ============================================================
function Magnetic({ children, className, strength = 0.3 }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY

      gsap.to(el, {
        x: deltaX * strength,
        y: deltaY * strength,
        duration: 0.4,
        ease: 'power3.out'
      })
    }

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1, 0.4)'
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// ============================================================
// SPLIT TEXT - Character by character animation
// ============================================================
function SplitText({ children, className, delay = 0, stagger = 0.02, trigger }) {
  const containerRef = useRef(null)
  const text = typeof children === 'string' ? children : ''

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const chars = containerRef.current.querySelectorAll('.char')

    const ctx = gsap.context(() => {
      gsap.fromTo(chars,
        {
          yPercent: 100,
          opacity: 0,
        },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power4.out',
          stagger: stagger,
          delay,
          scrollTrigger: trigger ? {
            trigger: containerRef.current,
            start: 'top 85%',
          } : undefined
        }
      )
    })

    return () => ctx.revert()
  }, [delay, stagger, trigger])

  return (
    <span ref={containerRef} className={`inline-block ${className || ''}`}>
      {text.split('').map((char, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <span className="char inline-block" style={{ willChange: 'transform' }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  )
}

// ============================================================
// SCRAMBLE TEXT - Glitchy text reveal
// ============================================================
function ScrambleText({ children, className }) {
  const [displayText, setDisplayText] = useState('')
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)
  const text = typeof children === 'string' ? children : ''
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let iteration = 0
    const maxIterations = text.length

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (index < iteration) return char
            if (char === ' ') return ' '
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )

      iteration += 0.5

      if (iteration > maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [isVisible, text])

  return (
    <span ref={ref} className={className}>
      {displayText || text.split('').map(() => '_').join('')}
    </span>
  )
}

// ============================================================
// SCROLL VELOCITY TEXT - Speed-based distortion
// ============================================================
function VelocityText({ children, baseVelocity = 3 }) {
  const containerRef = useRef(null)
  const textRef = useRef(null)
  const [velocity, setVelocity] = useState(0)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateVelocity = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY
      setVelocity(Math.min(Math.abs(diff) * 0.5, 50))
      lastScrollY = currentScrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateVelocity)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useLayoutEffect(() => {
    const container = containerRef.current
    const text = textRef.current
    if (!container || !text) return

    const ctx = gsap.context(() => {
      // Clone text for seamless loop
      const clone = text.cloneNode(true)
      container.appendChild(clone)

      gsap.to(container.children, {
        xPercent: -100,
        repeat: -1,
        duration: 20 / baseVelocity,
        ease: 'none',
      })
    })

    return () => ctx.revert()
  }, [baseVelocity])

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <div
        ref={containerRef}
        className="inline-flex"
        style={{ transform: `skewX(${-velocity * 0.3}deg)` }}
      >
        <div ref={textRef} className="inline-flex shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// HORIZONTAL SCROLL SECTION
// ============================================================
function HorizontalScroll({ children, className }) {
  const containerRef = useRef(null)
  const scrollRef = useRef(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    const scroll = scrollRef.current
    if (!container || !scroll) return

    const ctx = gsap.context(() => {
      const scrollWidth = scroll.scrollWidth - container.offsetWidth

      gsap.to(scroll, {
        x: -scrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${scrollWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className={`overflow-hidden ${className || ''}`}>
      <div ref={scrollRef} className="flex">
        {children}
      </div>
    </div>
  )
}

// ============================================================
// STAGGERED REVEAL
// ============================================================
function StaggerReveal({ children, className, stagger = 0.1 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (!ref.current) return

    const items = ref.current.children

    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          ease: 'power4.out',
          stagger,
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 80%',
          }
        }
      )
    })

    return () => ctx.revert()
  }, [stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

// ============================================================
// PARALLAX IMAGE
// ============================================================
function ParallaxImage({ src, alt, className, speed = 0.5 }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current,
        { yPercent: -20 * speed },
        {
          yPercent: 20 * speed,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          }
        }
      )
    })

    return () => ctx.revert()
  }, [speed])

  return <img ref={ref} src={src} alt={alt} className={className} />
}

// ============================================================
// PRODUCT CARD - Expandable with rich details
// ============================================================
function ProductCard({ product, index, onExpand }) {
  const cardRef = useRef(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  useLayoutEffect(() => {
    if (!cardRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        {
          yPercent: 30,
          opacity: 0,
          rotateX: -15,
        },
        {
          yPercent: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 90%',
          },
          delay: index * 0.15
        }
      )
    })

    return () => ctx.revert()
  }, [index])

  const sectorColors = {
    'Healthcare': 'border-[#EC4899]',
    'Education': 'border-[#10B981]',
    'Government': 'border-[#F59E0B]',
  }

  const sectorBg = {
    'Healthcare': 'rgba(236,72,153,0.08)',
    'Education': 'rgba(16,185,129,0.08)',
    'Government': 'rgba(245,158,11,0.08)',
  }

  return (
    <div
      ref={cardRef}
      data-cursor="pointer"
      data-cursor-text="EXPLORE"
      onMouseMove={handleMouseMove}
      onClick={() => onExpand(product)}
      className={`group relative bg-[#0F172A] border-l-4 ${sectorColors[product.sector] || 'border-[#F59E0B]'} p-8 md:p-12 min-h-[400px] flex flex-col justify-between cursor-pointer transition-colors duration-500 hover:bg-[#111]`}
      style={{ perspective: '1000px' }}
    >
      {/* Spotlight effect */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, ${sectorBg[product.sector] || 'rgba(232,255,0,0.06)'}, transparent 40%)`
        }}
      />

      {/* Index number - brutalist */}
      <div className="absolute top-4 right-4 font-mono text-[120px] font-black text-white/[0.03] leading-none select-none">
        {String(index + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10">
        {/* Sector tag */}
        <div className="inline-flex items-center gap-2 mb-8">
          <span className={`w-2 h-2 ${sectorColors[product.sector]?.replace('border-', 'bg-') || 'bg-[#F59E0B]'}`} />
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40">
            {product.sector}
          </span>
        </div>

        {/* Product name */}
        <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight group-hover:text-[#F59E0B] transition-colors duration-300">
          {product.name}
        </h3>

        {/* Tagline */}
        <p className="text-white/50 text-lg leading-relaxed max-w-lg">
          {product.tagline}
        </p>
      </div>

      {/* Bottom section */}
      <div className="relative z-10 flex items-end justify-between pt-8 border-t border-white/10 mt-8">
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature, i) => (
            <span key={i} className="font-mono text-xs px-3 py-1 bg-white/5 text-white/40 uppercase tracking-wider">
              {feature}
            </span>
          ))}
          {product.features.length > 3 && (
            <span className="font-mono text-xs px-3 py-1 text-white/30">
              +{product.features.length - 3}
            </span>
          )}
        </div>

        {/* Arrow */}
        <div className="w-12 h-12 border border-white/20 flex items-center justify-center group-hover:border-[#F59E0B] group-hover:bg-[#F59E0B] transition-all duration-300">
          <svg className="w-5 h-5 text-white/40 group-hover:text-black transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" />
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// EXPANDED PRODUCT MODAL
// ============================================================
function ProductModal({ product, onClose }) {
  const modalRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useLayoutEffect(() => {
    if (!modalRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(modalRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      )
      gsap.fromTo(contentRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.1 }
      )
    })

    return () => ctx.revert()
  }, [])

  const handleClose = () => {
    gsap.to(contentRef.current, {
      yPercent: 100,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    })
    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      delay: 0.1,
      onComplete: onClose
    })
  }

  const sectorColors = {
    'Healthcare': '#EC4899',
    'Education': '#10B981',
    'Government': '#F59E0B',
  }

  const accentColor = sectorColors[product.sector] || '#F59E0B'

  return (
    <div
      ref={modalRef}
      className="fixed inset-0 z-[100] bg-[#0B1120]/98 backdrop-blur-sm overflow-y-auto"
      onClick={(e) => e.target === modalRef.current && handleClose()}
    >
      <div ref={contentRef} className="min-h-screen py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="fixed top-8 right-8 w-12 h-12 border border-white/20 flex items-center justify-center hover:border-white hover:bg-white hover:text-black transition-all z-10"
            data-cursor="pointer"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 mb-6">
              <span className="w-3 h-3" style={{ backgroundColor: accentColor }} />
              <span className="font-mono text-sm uppercase tracking-[0.2em] text-white/40">
                {product.sector}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-6">
              {product.name}
            </h1>

            <p className="text-2xl md:text-3xl text-white/60 max-w-3xl leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Vision Section */}
          {product.vision && (
            <div className="mb-16 p-8 md:p-12 border-l-4" style={{ borderColor: accentColor, backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <h2 className="font-mono text-sm uppercase tracking-widest text-white/40 mb-6">The Vision</h2>
              <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
                {product.vision}
              </p>
            </div>
          )}

          {/* What It Does */}
          {product.capabilities && (
            <div className="mb-16">
              <h2 className="font-mono text-sm uppercase tracking-widest text-white/40 mb-8">What It Does</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {product.capabilities.map((cap, i) => (
                  <div key={i} className="p-6 bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-3" style={{ color: accentColor }}>
                      {cap.title}
                    </h3>
                    <p className="text-white/50 leading-relaxed">
                      {cap.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Features Grid */}
          <div className="mb-16">
            <h2 className="font-mono text-sm uppercase tracking-widest text-white/40 mb-8">Features</h2>
            <div className="flex flex-wrap gap-3">
              {product.features.map((feature, i) => (
                <span
                  key={i}
                  className="font-mono text-sm px-4 py-2 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Why It Matters */}
          {product.impact && (
            <div className="mb-16">
              <h2 className="font-mono text-sm uppercase tracking-widest text-white/40 mb-8">Why It Matters</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {product.impact.map((item, i) => (
                  <div key={i}>
                    <div className="text-5xl font-black mb-2" style={{ color: accentColor }}>
                      {item.stat}
                    </div>
                    <p className="text-white/50">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-3 font-mono text-sm text-white/40 hover:text-white transition-colors"
            data-cursor="pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to products
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// NAVIGATION - Minimal, brutalist
// ============================================================
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [time, setTime] = useState('')
  const navRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)

    // Live clock
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Kolkata'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(interval)
    }
  }, [])

  useLayoutEffect(() => {
    if (!navRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#0B1120]/95 backdrop-blur-sm' : ''
      }`}
    >
      <div className="max-w-[2000px] mx-auto px-6 md:px-12 py-6">
        <div className="flex items-center justify-between">
          {/* Logo - The Orbital Y */}
          <Magnetic strength={0.2}>
            <a href="#" className="flex items-center gap-3 group" data-cursor="pointer">
              <div className="w-10 h-10 relative flex items-center justify-center">
                {/* Orbital Y Logo */}
                <svg viewBox="0 0 40 40" className="w-10 h-10 transition-transform duration-700 group-hover:rotate-180">
                  {/* Orbital ring */}
                  <circle cx="20" cy="20" r="16" fill="none" stroke="#F59E0B" strokeWidth="1.5" opacity="0.3" />
                  {/* Trajectory path - the Y */}
                  <path
                    d="M12 10 L20 22 L28 10 M20 22 L20 32"
                    fill="none"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Guiding star at the apex */}
                  <circle cx="20" cy="22" r="2.5" fill="#F59E0B" />
                </svg>
              </div>
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">
                theYaan
              </span>
            </a>
          </Magnetic>

          {/* Center - Status */}
          <div className="hidden md:flex items-center gap-8 font-mono text-xs text-white/40 uppercase tracking-widest">
            <span>IST {time}</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
              Building
            </span>
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-8">
              {['Work', 'Studio', 'Contact'].map((item) => (
                <Magnetic key={item} strength={0.15}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="font-mono text-sm text-white/60 hover:text-[#F59E0B] transition-colors uppercase tracking-wider"
                    data-cursor="pointer"
                  >
                    {item}
                  </a>
                </Magnetic>
              ))}
            </div>

            <Magnetic strength={0.3}>
              <a
                href="#contact"
                className="px-6 py-3 bg-[#F59E0B] text-black font-bold text-sm uppercase tracking-wider hover:bg-white transition-colors"
                data-cursor="pointer"
              >
                Let's Talk
              </a>
            </Magnetic>
          </div>
        </div>
      </div>
    </nav>
  )
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function TheYaanStudioOld() {
  const heroRef = useRef(null)
  const counterRef = useRef({ value: 0 })

  // Products data - rich details for expandable view
  const products = [
    {
      name: 'SENTRA',
      sector: 'Healthcare',
      tagline: 'Always-on AI monitoring for seniors, chronic illness patients, and neurodivergent individuals. Edge hardware that sees, understands, and alerts—without the cloud.',
      vision: 'Healthcare monitoring shouldn\'t require an internet connection or a monthly subscription to a server farm. SENTRA processes everything locally—on-device AI that understands context, detects anomalies, and alerts caregivers in under a second. For seniors living alone, patients managing diabetes or heart conditions, or families supporting someone on the autism spectrum.',
      features: ['Edge AI processing', 'Sub-second alerts', 'Fall detection', 'Vitals monitoring', 'Behavior pattern recognition', 'Sleep analysis', 'Medication reminders', 'Caregiver dashboard', 'Works offline', 'DPDP compliant', 'Autism-friendly modes', 'Chronic condition tracking', 'Emergency response', 'Family notifications', 'Activity monitoring'],
      capabilities: [
        { title: 'Pattern Recognition', description: 'Learns individual baselines and detects subtle changes—a diabetic\'s glucose patterns, an elderly person\'s gait changes, or shifts in routine that might signal a problem.' },
        { title: 'Sensory-Friendly Design', description: 'Configurable alerts and interfaces designed with neurodivergent users in mind. Non-intrusive monitoring that respects sensory sensitivities.' },
        { title: 'Chronic Condition Intelligence', description: 'Specialized modules for diabetes, hypertension, COPD, and cardiac conditions. Correlates vitals with activity, sleep, and medication adherence.' },
        { title: 'Family Circle', description: 'Secure dashboard for family members and caregivers. Real-time status, trend reports, and instant alerts without compromising privacy.' },
      ],
      impact: [
        { stat: '< 1s', label: 'Alert latency for critical events' },
        { stat: '100%', label: 'Offline capability' },
        { stat: '24/7', label: 'Continuous monitoring without fatigue' },
      ],
    },
    {
      name: 'DRISHTI',
      sector: 'Healthcare',
      tagline: 'The doctor\'s AI companion. Visual AI, ambient sensors, voice interface—a system doctors genuinely love using. Like having a brilliant colleague who never forgets.',
      vision: 'Imagine walking into a consultation room where your AI companion has already reviewed the patient\'s history, is watching the examination through intelligent cameras, listening to every word, and displaying exactly what you need on a large screen—before you ask. DRISHTI (दृष्टि - "vision") isn\'t a scribe. It\'s a partner that sees what you see, hears what you hear, and surfaces insights at the speed of thought.',
      features: ['Visual AI cameras', 'Ambient room sensors', 'Large display interface', 'Voice-first navigation', 'Real-time vitals overlay', 'Drug interaction alerts', 'Differential diagnosis hints', 'Patient history synthesis', 'Custom voice commands', 'Indian accent optimized', 'Noisy environment handling', 'EHR auto-documentation', 'Image analysis', 'Lab result interpretation', 'Multilingual support'],
      capabilities: [
        { title: 'See Everything', description: 'Intelligent cameras analyze skin conditions, track patient movement, read body language, and capture examination findings—automatically adding relevant observations to the record.' },
        { title: 'Hear Everything', description: 'Custom audio hardware built for Indian accents and hospital noise. Understands medical terminology, patient complaints, and doctor instructions without "repeat that."' },
        { title: 'Know Everything', description: 'Synthesizes patient history, recent labs, imaging, and medications into a coherent picture. Surfaces relevant information exactly when needed during the consultation.' },
        { title: 'Your Interface, Your Way', description: 'Every doctor works differently. AXIOM learns your preferred commands, display layouts, and workflow patterns. Navigate with voice, gesture, or touch.' },
      ],
      impact: [
        { stat: '50%', label: 'Reduction in documentation time' },
        { stat: '0', label: 'Keyboard touches during consultation' },
        { stat: '100%', label: 'Patient face-time, not screen-time' },
      ],
    },
    {
      name: 'PRAXIS',
      sector: 'Healthcare',
      tagline: 'Medical education reimagined. From anatomy to rare conditions to surgical techniques—learn anything in healthcare through immersive VR and AR. Practice without patients.',
      vision: 'A medical student in Tier-2 India should have the same learning opportunities as one at AIIMS. PRAXIS makes that possible. Walk through a 3D heart. Practice a lumbar puncture a hundred times. Encounter a rare tropical disease case without waiting years for one to appear. Healthcare education shouldn\'t be limited by geography, cadaver availability, or case luck.',
      features: ['3D anatomy exploration', 'Surgical simulation', 'Haptic feedback', 'Rare case library', 'Emergency scenarios', 'Patient communication training', 'Diagnostic reasoning', 'Procedure practice', 'Performance analytics', 'Multiplayer collaboration', 'Certification aligned', 'AR overlay for real procedures', 'Clinical reasoning modules', 'Pharmacology visualization', 'Pathology walkthroughs'],
      capabilities: [
        { title: 'Beyond Surgery', description: 'Yes, surgical simulation—but also diagnostic reasoning, patient communication, emergency response, and clinical decision-making. The full spectrum of medical education.' },
        { title: 'Rare Case Library', description: 'A medical student might see one case of tetanus in their career. In PRAXIS, they can see hundreds. Build pattern recognition for conditions that textbooks can\'t teach.' },
        { title: 'Haptic Realism', description: 'Feel the resistance of tissue, the give of an injection, the feedback of an instrument. Our haptic systems make muscle memory possible without a patient.' },
        { title: 'Learn Together', description: 'Collaborative scenarios where teams practice together. Perfect for emergency medicine, surgery teams, and cross-functional training.' },
      ],
      impact: [
        { stat: '42%', label: 'Improvement in procedural accuracy (VR-trained)' },
        { stat: '38%', label: 'Reduction in training time' },
        { stat: '∞', label: 'Practice attempts without risk' },
      ],
    },
    {
      name: 'antarYaan',
      sector: 'Education',
      tagline: 'The AI mentor that solves Bloom\'s 2-sigma problem. Personalized tutoring through a gamified universe of constellations, planets, and mastery-based progression.',
      vision: 'In 1984, Benjamin Bloom proved that one-on-one tutoring makes average students perform two standard deviations better—turning C students into A students. The problem? You can\'t give every child a personal tutor. antarYaan (अंतर्यान - "inner journey") is that tutor. An AI companion that knows exactly where each child is, what they\'re ready to learn, and how to make the journey feel like an adventure across a universe of knowledge.',
      features: ['AI mentor companion', 'Mastery constellations', 'Planet exploration', 'Star collection', 'Experience-based learning', 'Adaptive difficulty', 'Regional languages', 'Doubt resolution', 'Parent dashboard', 'Progress journeys', 'Concept connections', 'JEE/NEET pathways', 'Creative challenges', 'Collaborative quests', 'Offline capable'],
      capabilities: [
        { title: 'Mastery Constellations', description: 'Each subject is a constellation. Each concept is a star. Master concepts to light up stars, connect them to reveal constellations, and unlock new regions of the learning universe.' },
        { title: 'Planet Expeditions', description: 'Major topics are planets to explore. Land on the Algebra planet, complete missions to understand concepts, collect artifacts that represent knowledge, and earn the right to travel further.' },
        { title: 'Your AI Mentor', description: 'Not a chatbot. A companion that remembers every interaction, understands your learning style, celebrates your wins, and guides you through struggles with infinite patience.' },
        { title: 'Real-World Quests', description: 'Learning isn\'t just screens. COSMOS sends you on real-world missions—measure shadows to understand trigonometry, interview a shopkeeper to learn economics, observe plants for biology.' },
      ],
      impact: [
        { stat: '2σ', label: 'The improvement we\'re chasing' },
        { stat: '1:1', label: 'Tutor ratio for every student' },
        { stat: '12', label: 'Regional languages supported' },
      ],
    },
    {
      name: 'PULSE',
      sector: 'Education',
      tagline: 'The teacher\'s sixth sense. See what each student needs, feels, and understands—in real time. AI-powered classroom intelligence that makes great teaching possible.',
      vision: 'A teacher with 40 students can\'t know where each one is struggling. PULSE changes that. Real-time insight into comprehension, engagement, and emotional state for every student. Not surveillance—intelligence. The kind that lets a teacher know exactly who needs attention, what the class didn\'t understand, and how to adjust the lesson on the fly.',
      features: ['Real-time comprehension mapping', 'Emotional state indicators', 'Learning gap detection', 'Personalized intervention suggestions', 'Lesson effectiveness analytics', 'Student grouping recommendations', 'Parent communication tools', 'Progress trajectories', 'Attention patterns', 'Concept mastery tracking', 'Class-wide insights', 'Individual deep-dives', 'Predictive alerts', 'Resource recommendations', 'Collaborative planning'],
      capabilities: [
        { title: 'Comprehension Radar', description: 'Real-time visualization of who\'s following and who\'s lost. Based on responses, engagement patterns, and micro-assessments woven naturally into lessons.' },
        { title: 'Emotional Intelligence', description: 'Subtle indicators of student emotional state—frustration, boredom, anxiety, excitement. Helps teachers respond to the humans in the room, not just the curriculum.' },
        { title: 'Smart Grouping', description: 'Automatically suggests student groupings for activities—pair struggling students with those who\'ve mastered concepts, create balanced project teams, identify peer tutoring opportunities.' },
        { title: 'Lesson Autopsy', description: 'After each class, understand what worked and what didn\'t. Which explanations clicked, where attention dropped, what needs revisiting tomorrow.' },
      ],
      impact: [
        { stat: '40→1', label: 'Class size feels like individual attention' },
        { stat: '3x', label: 'Faster identification of struggling students' },
        { stat: '↑17%', label: 'Learning outcomes in early pilots' },
      ],
    },
    {
      name: 'SETU',
      sector: 'Government',
      tagline: 'The integration layer India\'s government systems need. Connecting siloed databases, legacy systems, and new platforms—so services can actually talk to each other.',
      vision: 'India has built incredible digital infrastructure—Aadhaar, UPI, DigiLocker. But most government departments still run on disconnected systems built decades apart. SETU is the bridge. A modern integration platform that lets legacy systems speak to new ones, enables data sharing with proper consent, and makes "single window clearance" actually mean something.',
      features: ['Legacy system adapters', 'API gateway', 'Consent management', 'Data translation', 'Real-time sync', 'Audit logging', 'Secure by design', 'Multi-department orchestration', 'GIGW 3.0 compliant', 'Cloud-native', 'High availability', 'Regional deployment', 'Rollback capability', 'Performance monitoring', 'Citizen consent flows'],
      capabilities: [
        { title: 'Legacy Bridge', description: 'Connect systems from the 1990s to modern APIs. SETU speaks COBOL, reads flat files, and translates everything into clean, documented interfaces.' },
        { title: 'Consent-First Data', description: 'Citizens own their data. SETU enables secure data sharing between departments only with explicit, auditable consent. Built on India\'s DEPA principles.' },
        { title: 'Service Orchestration', description: 'A business license needs clearances from 6 departments? SETU orchestrates the entire flow—parallel where possible, sequential where required, transparent throughout.' },
        { title: 'Never Down', description: 'Government services can\'t afford downtime. Multi-region deployment, automatic failover, and graceful degradation built into the core.' },
      ],
      impact: [
        { stat: '6→1', label: 'Windows for multi-department services' },
        { stat: '10B+', label: 'Transactions India\'s DPI handles monthly' },
        { stat: '100%', label: 'Audit trail for every data access' },
      ],
    },
    {
      name: 'NAGRIK',
      sector: 'Government',
      tagline: 'Government services that work like the apps you actually use. Mobile-first, vernacular, accessible—a citizen portal that doesn\'t need an agent to navigate.',
      vision: 'Government websites in India are built for desktops, written in English, and designed by people who\'ve never tried to use them on a ₹7,000 smartphone over 3G. NAGRIK flips this. Mobile-first. Vernacular-first. Designed for the citizen who\'s never filled an online form but somehow navigates WhatsApp and YouTube just fine. No agents, no cyber cafes, no frustration.',
      features: ['Mobile-first design', '12 regional languages', 'Voice navigation', 'Offline forms', 'Document scanner', 'Status tracking', 'Smart form filling', 'Video guides', 'Accessibility compliant', 'Low-bandwidth optimized', 'WhatsApp integration', 'SMS fallback', 'Appointment booking', 'Payment integration', 'Grievance tracking'],
      capabilities: [
        { title: 'Actually Mobile', description: 'Not "responsive"—mobile-first. Designed for one-handed use on a crowded bus. Works on low-end Android phones. Doesn\'t assume unlimited data.' },
        { title: 'Your Language', description: 'Complete interface and content in 12 Indian languages. Not machine-translated—written by native speakers who understand local context and terminology.' },
        { title: 'Voice-First Option', description: 'Don\'t want to type? Speak. Navigate services, fill forms, and check status entirely through voice—in your language, with your accent.' },
        { title: 'Intelligent Assistance', description: 'AI that knows government procedures like someone who works there. Guides you through processes, catches errors before submission, suggests required documents.' },
      ],
      impact: [
        { stat: '750M', label: 'Smartphone users in India' },
        { stat: '34%', label: 'Rural internet access (the gap we\'re closing)' },
        { stat: '0', label: 'Agents needed to file applications' },
      ],
    },
  ]

  const [expandedProduct, setExpandedProduct] = useState(null)

  // Hero animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.5 })

      // Reveal lines
      tl.fromTo('.hero-line',
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          stagger: 0.15
        }
      )
      .fromTo('.hero-sub',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo('.hero-cta',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
        '-=0.5'
      )
      .fromTo('.hero-meta',
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        '-=0.3'
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Stats counter
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { value: 0 }

      gsap.to(counter, {
        value: 7,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.stats-section',
          start: 'top 80%',
        },
        onUpdate: () => {
          const el = document.querySelector('.product-counter')
          if (el) el.textContent = Math.floor(counter.value)
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Styles - Cosmic Dawn Design System */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

        :root {
          /* Primary */
          --deep-space: #0B1120;
          --stellar: #F8FAFC;

          /* Accent - The Guiding Light */
          --horizon: #F59E0B;
          --horizon-glow: rgba(245, 158, 11, 0.15);

          /* Secondary */
          --aurora: #14B8A6;
          --nebula: #8B5CF6;
          --twilight: #3B82F6;

          /* Sectors */
          --nova-pink: #EC4899;
          --emerald: #10B981;

          /* Neutrals */
          --cosmic-gray: #1E293B;
          --stardust: #64748B;
          --mist: #94A3B8;
        }

        * {
          cursor: none;
          font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
        }

        @media (pointer: coarse) {
          * { cursor: auto; }
        }

        h1, h2, h3, .font-display {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
        }

        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }

        html {
          scroll-behavior: smooth;
        }

        /* Subtle grain texture */
        .grain::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          opacity: 0.02;
          pointer-events: none;
          z-index: 9000;
        }

        /* Refined grid pattern */
        .grid-pattern {
          background-image:
            linear-gradient(rgba(248,250,252,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248,250,252,0.02) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        /* Horizon glow effect */
        .horizon-glow {
          box-shadow: 0 0 60px rgba(245, 158, 11, 0.15);
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: var(--deep-space);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--horizon);
          border-radius: 3px;
        }

        /* Selection */
        ::selection {
          background: var(--horizon);
          color: var(--deep-space);
        }
      `}</style>

      <div className="grain" />
      <CustomCursor />
      <Navigation />

      {/* ============================================================ */}
      {/* HERO SECTION */}
      {/* ============================================================ */}
      <section ref={heroRef} className="min-h-screen flex flex-col justify-center px-6 md:px-12 pt-32 pb-20 relative overflow-hidden grid-pattern">
        {/* Decorative elements - intentionally asymmetric */}
        <div className="absolute top-32 right-12 w-px h-40 bg-gradient-to-b from-[#F59E0B] to-transparent" />
        <div className="absolute bottom-40 left-12 w-32 h-px bg-gradient-to-r from-[#F59E0B] to-transparent" />
        <div className="absolute top-1/2 right-1/4 font-mono text-[200px] font-bold text-white/[0.02] select-none">AI</div>

        <div className="max-w-[1600px] mx-auto w-full relative z-10">
          {/* Main headline */}
          <div className="mb-16">
            <div className="overflow-hidden">
              <h1 className="hero-line text-[clamp(2.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tighter text-white">
                AI that actually
              </h1>
            </div>
            <div className="overflow-hidden">
              <h1 className="hero-line text-[clamp(2.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tighter text-white/30">
                works in India.
              </h1>
            </div>
            <div className="overflow-hidden mt-4">
              <h1 className="hero-line text-[clamp(2.5rem,10vw,9rem)] font-black leading-[0.85] tracking-tighter">
                <span className="text-[#F59E0B]">We build it.</span>
              </h1>
            </div>
          </div>

          {/* Sub content */}
          <div className="hero-sub flex flex-col lg:flex-row lg:items-end justify-between gap-12 max-w-5xl">
            <p className="text-xl md:text-2xl text-white/50 max-w-xl leading-relaxed">
              A product studio making AI work in healthcare, education, and government.
              <span className="text-white font-medium"> Seven products. Three sectors. All India.</span>
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Magnetic strength={0.2}>
              <a
                href="#work"
                className="hero-cta group inline-flex items-center gap-4 px-8 py-5 bg-[#F59E0B] text-black font-bold text-lg hover:bg-white transition-colors duration-300"
                data-cursor="pointer"
              >
                See the work
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:-translate-y-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </Magnetic>

            <Magnetic strength={0.2}>
              <a
                href="#studio"
                className="hero-cta inline-flex items-center gap-4 px-8 py-5 border border-white/20 text-white font-bold text-lg hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all duration-300"
                data-cursor="pointer"
              >
                How we work
              </a>
            </Magnetic>
          </div>

          {/* Bottom meta */}
          <div className="hero-meta absolute bottom-12 left-0 right-0 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 px-6 md:px-12 font-mono text-xs text-white/30 uppercase tracking-widest">
            <div className="flex items-center gap-8">
              <span>Bengaluru, India</span>
              <span>Est. 2024</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Scroll to explore</span>
              <div className="w-px h-8 bg-white/20 ml-4 animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* MARQUEE - Velocity based */}
      {/* ============================================================ */}
      <div className="border-y border-white/10 py-8 bg-[#0F172A] overflow-hidden">
        <VelocityText baseVelocity={2}>
          {['Healthcare', 'Education', 'Government', 'Edge AI', 'Voice', 'AR/VR', 'Adaptive'].map((item, i) => (
            <span key={i} className="text-5xl md:text-7xl font-black text-white/10 mx-8 tracking-tighter whitespace-nowrap">
              {item}
              <span className="text-[#F59E0B] mx-8">×</span>
            </span>
          ))}
        </VelocityText>
      </div>

      {/* ============================================================ */}
      {/* STATS SECTION */}
      {/* ============================================================ */}
      <section className="stats-section py-24 px-6 md:px-12 border-b border-white/10">
        <div className="max-w-[1600px] mx-auto">
          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-black text-[#F59E0B]">
                <span className="product-counter">0</span>
              </div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mt-2">Products in Pipeline</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-black text-white/20">3</div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mt-2">Sectors</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-black text-white/20">70<span className="text-[#EC4899]">%</span></div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mt-2">AI Project Failure Rate</div>
            </div>
            <div className="text-center md:text-left">
              <div className="text-6xl md:text-8xl font-black text-white/20">1</div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mt-2">Studio fixing it</div>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* PRODUCTS SECTION */}
      {/* ============================================================ */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          {/* Section header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
            <div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-6">
                [ 01 / Portfolio ]
              </div>
              <div className="overflow-hidden">
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white">
                  <SplitText trigger>The products</SplitText>
                </h2>
              </div>
            </div>

            <p className="text-lg text-white/40 max-w-md leading-relaxed font-mono">
              Each product fills a gap where AI should work but doesn't. Yet.
            </p>
          </div>

          {/* Products grid - intentionally asymmetric */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {products.slice(0, 2).map((product, i) => (
              <ProductCard key={product.name} product={product} index={i} onExpand={setExpandedProduct} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {products.slice(2, 5).map((product, i) => (
              <ProductCard key={product.name} product={product} index={i + 2} onExpand={setExpandedProduct} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {products.slice(5).map((product, i) => (
              <ProductCard key={product.name} product={product} index={i + 5} onExpand={setExpandedProduct} />
            ))}
          </div>
        </div>
      </section>

      {/* Product Modal */}
      {expandedProduct && (
        <ProductModal product={expandedProduct} onClose={() => setExpandedProduct(null)} />
      )}

      {/* ============================================================ */}
      {/* WHY SECTION - Big statement */}
      {/* ============================================================ */}
      <section className="py-32 px-6 md:px-12 bg-[#0F172A] border-y border-white/10 relative overflow-hidden">
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-black text-[30vw] text-white/[0.02] select-none">WHY</span>
        </div>

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-8">
                [ 02 / The Problem ]
              </div>

              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-12">
                <span className="text-[#EC4899]">70%+</span>
                <br />
                <span className="text-white/30">fail rate.</span>
              </h2>

              <div className="space-y-6 max-w-lg">
                <p className="text-xl text-white/50 leading-relaxed">
                  AI projects in Indian institutions don't fail because of technology.
                </p>
                <p className="text-xl text-white leading-relaxed font-medium">
                  They die in procurement cycles, regulatory gaps, and misaligned stakeholders. We build around that.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {[
                { num: '70%+', label: 'AI project failure in institutions', color: 'text-[#EC4899]' },
                { num: '2-3yr', label: 'Average procurement cycle', color: 'text-white/60' },
                { num: '56%', label: 'Learning poverty rate', color: 'text-[#10B981]' },
                { num: '0.7', label: 'Physicians per 1,000', color: 'text-[#F59E0B]' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex items-baseline gap-6 py-6 border-b border-white/10 group hover:border-white/30 transition-colors"
                  data-cursor="pointer"
                >
                  <span className={`text-5xl md:text-6xl font-black ${stat.color} font-mono transition-transform duration-300 group-hover:translate-x-4`}>
                    {stat.num}
                  </span>
                  <span className="text-white/40 text-lg">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* STUDIO MODEL */}
      {/* ============================================================ */}
      <section id="studio" className="py-32 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-6">
                [ 03 / The Model ]
              </div>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-6">
                Not consultants.
              </h2>
              <h2 className="text-5xl md:text-6xl font-black tracking-tighter text-white/30 mb-8">
                Builders.
              </h2>
              <p className="text-white/50 text-lg leading-relaxed">
                We find massive problems. We build complete solutions—hardware and software. We ship, partner, or scale independently.
              </p>
            </div>

            <div className="lg:col-span-2">
              <StaggerReveal className="grid sm:grid-cols-2 gap-4" stagger={0.15}>
                {[
                  {
                    num: '01',
                    title: 'Problem First',
                    desc: 'We find gaps where AI can make a real difference. Not features for the sake of AI.'
                  },
                  {
                    num: '02',
                    title: 'Full Stack',
                    desc: 'Hardware + software when the problem needs it. Complete solutions.'
                  },
                  {
                    num: '03',
                    title: 'India Native',
                    desc: 'Built for Indian context from day one. Not localization as afterthought.'
                  },
                  {
                    num: '04',
                    title: 'Regulatory IQ',
                    desc: 'We navigate DPDP, healthcare regulations, government procurement.'
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="bg-[#0F172A] border border-white/10 p-8 group hover:border-[#F59E0B]/50 transition-all duration-500"
                    data-cursor="pointer"
                  >
                    <span className="font-mono text-[#F59E0B] text-sm">{item.num}</span>
                    <h3 className="text-2xl font-bold text-white mt-4 mb-3 group-hover:text-[#F59E0B] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-white/40 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </StaggerReveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TEAM - Minimal */}
      {/* ============================================================ */}
      <section className="py-32 px-6 md:px-12 bg-[#0F172A] border-y border-white/10">
        <div className="max-w-[1600px] mx-auto text-center">
          <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-8">
            [ 04 / Who ]
          </div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white mb-8">
            <ScrambleText>We've done this before.</ScrambleText>
          </h2>

          <p className="text-xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed">
            Healthcare deployments. Government digitization. EdTech that students actually use. Our team has built and shipped in these sectors.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {['Healthcare Systems', 'Government Tech', 'EdTech', 'AI/ML', 'Regulatory', 'Product', 'Hardware'].map((tag, i) => (
              <span
                key={i}
                className="font-mono text-sm px-6 py-3 border border-white/10 text-white/40 hover:text-[#F59E0B] hover:border-[#F59E0B]/50 transition-all cursor-default uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* CONTACT */}
      {/* ============================================================ */}
      <section id="contact" className="py-32 px-6 md:px-12 relative">
        {/* Background accent */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-[#F59E0B]/5 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <div className="font-mono text-xs text-white/40 uppercase tracking-widest mb-8">
                [ 05 / Contact ]
              </div>

              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] mb-4">
                Get in
              </h2>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter text-[#F59E0B] leading-[0.9]">
                touch.
              </h2>

              <div className="mt-16">
                <Magnetic strength={0.3}>
                  <a
                    href="mailto:hello@theyaan.studio"
                    className="text-3xl md:text-5xl text-white/60 hover:text-[#F59E0B] transition-colors duration-300 font-mono"
                    data-cursor="pointer"
                    data-cursor-text="EMAIL"
                  >
                    hello@theyaan.studio
                  </a>
                </Magnetic>
              </div>
            </div>

            <div className="space-y-0">
              {[
                {
                  title: 'For Institutions',
                  desc: 'Healthcare, education, government—let\'s see if our products solve your problems.'
                },
                {
                  title: 'For Investors',
                  desc: 'Products in healthcare, education, government. Long-term plays in sectors that matter.'
                },
                {
                  title: 'Join Us',
                  desc: 'Hiring engineers, designers, and domain experts. Interesting problems guaranteed.'
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-l-2 border-white/10 hover:border-[#F59E0B] pl-8 py-8 transition-all duration-300 group cursor-pointer"
                  data-cursor="pointer"
                >
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#F59E0B] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="border-t border-white/10 py-8 px-6 md:px-12">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              {/* Footer Logo */}
              <svg viewBox="0 0 32 32" className="w-8 h-8">
                <circle cx="16" cy="16" r="13" fill="none" stroke="#F59E0B" strokeWidth="1" opacity="0.3" />
                <path
                  d="M10 8 L16 18 L22 8 M16 18 L16 26"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="16" cy="18" r="2" fill="#F59E0B" />
              </svg>
              <span className="text-white/40 font-mono text-sm">theYaan Studio</span>
            </div>

            <div className="flex items-center gap-8 font-mono text-xs text-white/30 uppercase tracking-widest">
              <span>© {new Date().getFullYear()}</span>
              <Link to="/privacy" className="hover:text-[#F59E0B] transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-[#F59E0B] transition-colors">Terms</Link>
            </div>

            <div className="flex items-center gap-4">
              {[
                { icon: 'X', href: '#' },
                { icon: 'Li', href: '#' },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="w-10 h-10 border border-white/10 flex items-center justify-center hover:border-[#F59E0B] hover:text-[#F59E0B] transition-all font-mono text-sm text-white/40"
                  data-cursor="pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
