import { useState, useRef, useCallback, useEffect } from 'react'

/**
 * requestAnimationFrame-based game loop for physics simulations.
 *
 * Provides a fixed-timestep physics loop with accumulation for deterministic,
 * smooth physics. All mutable state lives in refs to avoid re-render overhead;
 * React state is updated once per visual frame.
 *
 * @param {Object} config
 * @param {Object} config.initialState - Starting simulation state (e.g. { x, y, vx, vy })
 * @param {Function} config.physics - Pure function (state, dt, params) => nextState
 * @param {Object} config.params - Tunable parameters (e.g. { gravity: 10, angle: 45 })
 * @param {number} [config.fps=60] - Target frames per second for fixed timestep
 * @param {boolean} [config.autoStart=false] - Whether to start the loop immediately
 * @param {Function} [config.onFrame] - Callback invoked each visual frame with current state
 */
export default function useSimulationEngine({
  initialState,
  physics,
  params: initialParams = {},
  fps = 60,
  autoStart = false,
  onFrame,
} = {}) {
  // --- Fixed timestep ---
  const fixedDt = 1 / fps

  // --- React state (updated once per visual frame for rendering) ---
  const [state, setState] = useState(() => ({ ...initialState }))
  const [isRunning, setIsRunning] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [frameCount, setFrameCount] = useState(0)
  const [params, setParamsState] = useState(() => ({ ...initialParams }))

  // --- Refs for mutable loop state (no re-renders) ---
  const stateRef = useRef({ ...initialState })
  const paramsRef = useRef({ ...initialParams })
  const isRunningRef = useRef(false)
  const rafIdRef = useRef(null)
  const prevTimestampRef = useRef(null)
  const accumulatorRef = useRef(0)
  const elapsedRef = useRef(0)
  const frameCountRef = useRef(0)
  const physicsRef = useRef(physics)
  const onFrameRef = useRef(onFrame)
  const initialStateRef = useRef(initialState)

  // Keep callback refs up to date without re-triggering effects
  useEffect(() => {
    physicsRef.current = physics
  }, [physics])

  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  useEffect(() => {
    initialStateRef.current = initialState
  }, [initialState])

  // --- The core loop ---
  const loop = useCallback(
    (timestamp) => {
      if (!isRunningRef.current) return

      // First frame: seed the previous timestamp, no physics tick yet
      if (prevTimestampRef.current === null) {
        prevTimestampRef.current = timestamp
        rafIdRef.current = requestAnimationFrame(loop)
        return
      }

      // Wall-clock delta in seconds, clamped to avoid spiral of death
      const rawDt = (timestamp - prevTimestampRef.current) / 1000
      const frameDt = Math.min(rawDt, 0.1) // cap at 100ms (10fps minimum)
      prevTimestampRef.current = timestamp

      // Accumulate time and consume in fixed-size steps
      accumulatorRef.current += frameDt
      let stepped = false

      while (accumulatorRef.current >= fixedDt) {
        stateRef.current = physicsRef.current(
          stateRef.current,
          fixedDt,
          paramsRef.current
        )
        accumulatorRef.current -= fixedDt
        elapsedRef.current += fixedDt
        frameCountRef.current += 1
        stepped = true
      }

      // Sync React state once per visual frame (only if physics actually ticked)
      if (stepped) {
        const currentState = stateRef.current
        const currentElapsed = elapsedRef.current
        const currentFrame = frameCountRef.current

        setState({ ...currentState })
        setElapsedTime(currentElapsed)
        setFrameCount(currentFrame)

        if (onFrameRef.current) {
          onFrameRef.current(currentState)
        }
      }

      rafIdRef.current = requestAnimationFrame(loop)
    },
    [fixedDt]
  )

  // --- Controls ---

  const play = useCallback(() => {
    if (isRunningRef.current) return
    isRunningRef.current = true
    setIsRunning(true)
    prevTimestampRef.current = null // reset timestamp so first frame seeds properly
    accumulatorRef.current = 0
    rafIdRef.current = requestAnimationFrame(loop)
  }, [loop])

  const pause = useCallback(() => {
    isRunningRef.current = false
    setIsRunning(false)
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }
  }, [])

  const reset = useCallback(() => {
    // Stop the loop
    isRunningRef.current = false
    setIsRunning(false)
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
      rafIdRef.current = null
    }

    // Restore initial state
    const fresh = { ...initialStateRef.current }
    stateRef.current = fresh
    prevTimestampRef.current = null
    accumulatorRef.current = 0
    elapsedRef.current = 0
    frameCountRef.current = 0

    setState(fresh)
    setElapsedTime(0)
    setFrameCount(0)
  }, [])

  const step = useCallback(() => {
    // Advance exactly one physics tick without starting the loop
    stateRef.current = physicsRef.current(
      stateRef.current,
      fixedDt,
      paramsRef.current
    )
    elapsedRef.current += fixedDt
    frameCountRef.current += 1

    const currentState = stateRef.current
    setState({ ...currentState })
    setElapsedTime(elapsedRef.current)
    setFrameCount(frameCountRef.current)

    if (onFrameRef.current) {
      onFrameRef.current(currentState)
    }
  }, [fixedDt])

  const setParam = useCallback(
    (key, value) => {
      paramsRef.current = { ...paramsRef.current, [key]: value }
      setParamsState({ ...paramsRef.current })
    },
    []
  )

  const getParam = useCallback(
    (key) => paramsRef.current[key],
    []
  )

  // --- Auto-start ---
  useEffect(() => {
    if (autoStart) {
      play()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      isRunningRef.current = false
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [])

  return {
    state,
    isRunning,
    elapsedTime,
    frameCount,
    play,
    pause,
    reset,
    step,
    setParam,
    getParam,
    params,
  }
}
