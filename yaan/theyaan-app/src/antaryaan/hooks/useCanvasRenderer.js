import { useRef, useState, useEffect, useCallback } from 'react'

/**
 * Hook that sets up a responsive Canvas with proper devicePixelRatio handling.
 *
 * Returns a ref to attach to a <canvas> element. The canvas automatically
 * resizes to fit its parent container while respecting an optional aspect ratio
 * and min/max height constraints. Drawing is DPR-aware so everything is crisp
 * on retina displays.
 *
 * @param {Object} config
 * @param {Function} config.onRender - Drawing callback: (ctx, { width, height, scale }) => void
 *   Called on every animation frame. `width` and `height` are CSS pixels;
 *   the canvas backing store is already scaled by DPR.
 * @param {number} [config.aspectRatio] - Optional forced aspect ratio (e.g. 16/9)
 * @param {number} [config.minHeight=300] - Minimum CSS height in pixels
 * @param {number} [config.maxHeight=500] - Maximum CSS height in pixels
 */
export default function useCanvasRenderer({
  onRender,
  aspectRatio,
  minHeight = 300,
  maxHeight = 500,
} = {}) {
  const canvasRef = useRef(null)
  const rafIdRef = useRef(null)
  const onRenderRef = useRef(onRender)

  // CSS dimensions exposed to the consumer for layout calculations
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const [scale, setScale] = useState(1)

  // Keep render callback ref current without re-triggering effects
  useEffect(() => {
    onRenderRef.current = onRender
  }, [onRender])

  /**
   * Compute the constrained CSS height given a container width.
   */
  const computeHeight = useCallback(
    (containerWidth) => {
      if (aspectRatio) {
        const idealHeight = containerWidth / aspectRatio
        return Math.min(maxHeight, Math.max(minHeight, idealHeight))
      }
      // Without an aspect ratio, try to use as much vertical space as
      // the constraints allow. Default to minHeight if we can't decide.
      return Math.min(maxHeight, Math.max(minHeight, minHeight))
    },
    [aspectRatio, minHeight, maxHeight]
  )

  /**
   * Size the canvas backing store and kick off the render loop.
   */
  const setupCanvas = useCallback(
    (cssWidth, cssHeight) => {
      const canvas = canvasRef.current
      if (!canvas) return

      const dpr = window.devicePixelRatio || 1

      // CSS size
      canvas.style.width = `${cssWidth}px`
      canvas.style.height = `${cssHeight}px`

      // Backing store size (crisp on retina)
      canvas.width = Math.round(cssWidth * dpr)
      canvas.height = Math.round(cssHeight * dpr)

      setWidth(cssWidth)
      setHeight(cssHeight)
      setScale(dpr)
    },
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // The parent element is the sizing reference
    const container = canvas.parentElement
    if (!container) return

    // --- ResizeObserver tracks the container ---
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth = entry.contentRect.width
        if (containerWidth === 0) continue

        const cssHeight = computeHeight(containerWidth)
        setupCanvas(containerWidth, cssHeight)
      }
    })

    observer.observe(container)

    // Initial sizing (ResizeObserver fires asynchronously, so seed eagerly)
    const initialWidth = container.clientWidth
    if (initialWidth > 0) {
      const cssHeight = computeHeight(initialWidth)
      setupCanvas(initialWidth, cssHeight)
    }

    // --- Render loop ---
    const renderLoop = () => {
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        rafIdRef.current = requestAnimationFrame(renderLoop)
        return
      }

      const dpr = window.devicePixelRatio || 1
      const cssW = canvas.width / dpr
      const cssH = canvas.height / dpr

      // Reset transform and clear
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Scale so callers can draw in CSS pixel coordinates
      ctx.scale(dpr, dpr)

      if (onRenderRef.current) {
        onRenderRef.current(ctx, {
          width: cssW,
          height: cssH,
          scale: dpr,
        })
      }

      rafIdRef.current = requestAnimationFrame(renderLoop)
    }

    rafIdRef.current = requestAnimationFrame(renderLoop)

    // --- Cleanup ---
    return () => {
      observer.disconnect()
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [computeHeight, setupCanvas])

  return { canvasRef, width, height, scale }
}
