import { useRef, useEffect, useCallback, useMemo } from 'react'

/**
 * Reusable canvas rendering component for physics simulations.
 *
 * Handles ResizeObserver for responsive sizing, DPR-aware rendering,
 * requestAnimationFrame loop, and pointer event normalization with
 * coordinate system transforms.
 */

const DEFAULT_COORDINATE_SYSTEM = {
  xMin: 0,
  xMax: 1,
  yMin: 0,
  yMax: 1,
  yFlipped: true, // canvas Y is inverted vs physics Y
}

function SimulationCanvas({
  onRender,
  state,
  aspectRatio,
  minHeight = 280,
  maxHeight = 450,
  className = '',
  onPointerDown,
  onPointerMove,
  onPointerUp,
  coordinateSystem = DEFAULT_COORDINATE_SYSTEM,
}) {
  const canvasRef = useRef(null)
  const containerRef = useRef(null)
  const sizeRef = useRef({ width: 0, height: 0, scale: 1 })
  const rafRef = useRef(null)
  const stateRef = useRef(state)

  // Keep state ref current without triggering effect re-runs
  stateRef.current = state

  const coords = useMemo(() => ({
    ...DEFAULT_COORDINATE_SYSTEM,
    ...coordinateSystem,
  }), [
    coordinateSystem?.xMin,
    coordinateSystem?.xMax,
    coordinateSystem?.yMin,
    coordinateSystem?.yMax,
    coordinateSystem?.yFlipped,
  ])

  // Convert physics coordinates to pixel coordinates
  const toPixel = useCallback((physX, physY) => {
    const { width, height } = sizeRef.current
    const px = ((physX - coords.xMin) / (coords.xMax - coords.xMin)) * width
    const py = coords.yFlipped
      ? height - ((physY - coords.yMin) / (coords.yMax - coords.yMin)) * height
      : ((physY - coords.yMin) / (coords.yMax - coords.yMin)) * height
    return { x: px, y: py }
  }, [coords])

  // Convert pixel coordinates to physics coordinates
  const toPhysics = useCallback((pixelX, pixelY) => {
    const { width, height } = sizeRef.current
    const physX = coords.xMin + (pixelX / width) * (coords.xMax - coords.xMin)
    const physY = coords.yFlipped
      ? coords.yMin + ((height - pixelY) / height) * (coords.yMax - coords.yMin)
      : coords.yMin + (pixelY / height) * (coords.yMax - coords.yMin)
    return { x: physX, y: physY }
  }, [coords])

  // Normalize pointer event to physics coordinates
  const normalizePointer = useCallback((e) => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    const pixelX = clientX - rect.left
    const pixelY = clientY - rect.top
    const phys = toPhysics(pixelX, pixelY)
    return { ...phys, pixelX, pixelY }
  }, [toPhysics])

  // Pointer event handlers
  const handlePointerDown = useCallback((e) => {
    if (!onPointerDown) return
    const coord = normalizePointer(e)
    if (coord) onPointerDown(coord)
  }, [onPointerDown, normalizePointer])

  const handlePointerMove = useCallback((e) => {
    if (!onPointerMove) return
    const coord = normalizePointer(e)
    if (coord) onPointerMove(coord)
  }, [onPointerMove, normalizePointer])

  const handlePointerUp = useCallback((e) => {
    if (!onPointerUp) return
    const coord = normalizePointer(e)
    if (coord) onPointerUp(coord)
  }, [onPointerUp, normalizePointer])

  // Resize observer to track container dimensions
  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: containerWidth } = entry.contentRect
        if (containerWidth === 0) continue

        let width = containerWidth
        let height

        if (aspectRatio) {
          height = width / aspectRatio
        } else {
          height = Math.max(minHeight, Math.min(maxHeight, width * 0.5625))
        }

        height = Math.max(minHeight, Math.min(maxHeight, height))

        const dpr = window.devicePixelRatio || 1
        canvas.width = Math.round(width * dpr)
        canvas.height = Math.round(height * dpr)
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`

        sizeRef.current = { width, height, scale: dpr }
      }
    })

    observer.observe(container)
    return () => observer.disconnect()
  }, [aspectRatio, minHeight, maxHeight])

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let running = true

    const renderFrame = () => {
      if (!running) return

      const { width, height, scale } = sizeRef.current
      if (width === 0 || height === 0) {
        rafRef.current = requestAnimationFrame(renderFrame)
        return
      }

      ctx.save()
      ctx.scale(scale, scale)

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      if (onRender) {
        onRender(ctx, stateRef.current, {
          width,
          height,
          scale,
          toPixel,
          toPhysics,
          coords,
        })
      }

      ctx.restore()

      rafRef.current = requestAnimationFrame(renderFrame)
    }

    rafRef.current = requestAnimationFrame(renderFrame)

    return () => {
      running = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [onRender, toPixel, toPhysics, coords])

  // Re-trigger render when state changes (the rAF loop reads stateRef.current)
  // This effect intentionally depends on state to ensure fresh renders
  useEffect(() => {
    stateRef.current = state
  }, [state])

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-lg bg-slate-900/80 border border-slate-700/40 ${className}`}
      style={{ minHeight, maxHeight }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
    </div>
  )
}

export default SimulationCanvas
