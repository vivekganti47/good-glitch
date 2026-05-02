import { useRef, useState, useEffect } from 'react'

/**
 * Thin SVG wrapper for vector-based simulations.
 *
 * Handles responsive sizing with a dark background, supports
 * custom viewBox and preserveAspectRatio props.
 */
function SimulationSVG({
  viewBox = '0 0 800 450',
  className = '',
  preserveAspectRatio = 'xMidYMid meet',
  children,
  minHeight = 280,
  maxHeight = 450,
  style = {},
}) {
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 450 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect
        if (width === 0) continue

        // Parse viewBox to derive aspect ratio
        const parts = viewBox.split(/\s+/).map(Number)
        const vbWidth = parts[2] || 800
        const vbHeight = parts[3] || 450
        const ratio = vbWidth / vbHeight

        let height = width / ratio
        height = Math.max(minHeight, Math.min(maxHeight, height))

        setDimensions({ width, height })
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [viewBox, minHeight, maxHeight])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40 ${className}`}
      style={{ minHeight, maxHeight, ...style }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio={preserveAspectRatio}
        width={dimensions.width}
        height={dimensions.height}
        className="block w-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dark background fill */}
        <rect width="100%" height="100%" fill="#0A0E1A" opacity="0.6" />

        {/* Grid lines for reference (subtle) */}
        <defs>
          <pattern
            id="sim-svg-grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="rgba(148, 163, 184, 0.06)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#sim-svg-grid)" />

        {children}
      </svg>
    </div>
  )
}

export default SimulationSVG
