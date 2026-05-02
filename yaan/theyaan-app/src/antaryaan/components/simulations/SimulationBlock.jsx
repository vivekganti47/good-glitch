import { useState, useCallback, useMemo, Suspense, Component } from 'react'
import { motion } from 'framer-motion'
import SimulationShell from './SimulationShell'
import DiscoveryToast from './DiscoveryToast'
import { simulationRegistry } from '../../data/simulations/registry'

/**
 * Block dispatcher for type: 'simulation'.
 *
 * Reads block.simType to pick the lazy-loaded game component from the registry,
 * wraps it in SimulationShell, manages control values, tracks discoveries
 * and completion.
 */

// ---- Error Boundary for Lazy Components ----
class SimulationErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Simulation loading error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <span className="text-red-400 text-lg">!</span>
            </div>
            <p className="text-sm text-slate-400">
              Failed to load simulation
            </p>
            <p className="text-xs text-slate-500 max-w-xs">
              {this.state.error?.message || 'An error occurred while loading the game component.'}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="mt-3 px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// ---- Discovery Tracker Hook ----
function useDiscoveryTracker(discoveryDefs = []) {
  const [discoveredSet, setDiscoveredSet] = useState(new Set())
  const [latestDiscovery, setLatestDiscovery] = useState(null)

  const discover = useCallback((discoveryId) => {
    setDiscoveredSet((prev) => {
      if (prev.has(discoveryId)) return prev
      const next = new Set(prev)
      next.add(discoveryId)
      return next
    })

    const def = discoveryDefs.find((d) => d.id === discoveryId)
    if (def) {
      setLatestDiscovery(def)
    }
  }, [discoveryDefs])

  const dismissToast = useCallback(() => {
    setLatestDiscovery(null)
  }, [])

  const discoveries = useMemo(() =>
    discoveryDefs.map((d) => ({
      ...d,
      discovered: discoveredSet.has(d.id),
    })),
    [discoveryDefs, discoveredSet]
  )

  const allDiscovered = discoveryDefs.length > 0 && discoveredSet.size >= discoveryDefs.length

  return {
    discoveries,
    discoveredSet,
    discover,
    latestDiscovery,
    dismissToast,
    allDiscovered,
    discoveredCount: discoveredSet.size,
    totalCount: discoveryDefs.length,
  }
}

// ---- Simulation Completion Hook ----
function useSimulationCompletion(completionCriteria = {}, state = {}) {
  const [manuallyCompleted, setManuallyCompleted] = useState(false)

  const isComplete = useMemo(() => {
    if (manuallyCompleted) return true

    const {
      requiredDiscoveries = 0,
      requiredTime = 0,
      requiredLaunches = 0,
      customCheck,
    } = completionCriteria

    // Check required discoveries
    if (requiredDiscoveries > 0) {
      const discoveredCount = state.discoveredCount || 0
      if (discoveredCount < requiredDiscoveries) return false
    }

    // Check required time spent
    if (requiredTime > 0) {
      const elapsedTime = state.elapsedTime || 0
      if (elapsedTime < requiredTime) return false
    }

    // Check required launches
    if (requiredLaunches > 0) {
      const launchCount = state.launchCount || 0
      if (launchCount < requiredLaunches) return false
    }

    // Custom completion check function
    if (customCheck && typeof customCheck === 'function') {
      if (!customCheck(state)) return false
    }

    // If criteria are defined, all checks must pass to reach here
    const hasCriteria = requiredDiscoveries > 0 || requiredTime > 0 || requiredLaunches > 0 || customCheck
    return hasCriteria
  }, [completionCriteria, state, manuallyCompleted])

  const markComplete = useCallback(() => {
    setManuallyCompleted(true)
  }, [])

  return { isComplete, markComplete }
}

// ---- Loading Fallback ----
function SimulationLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="space-y-3 text-center">
        <motion.div
          className="w-10 h-10 mx-auto border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-slate-500">Loading simulation...</p>
      </div>
    </div>
  )
}

// ---- Error Fallback ----
function SimulationError({ simType }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-lg">!</span>
        </div>
        <p className="text-sm text-slate-400">
          Simulation <span className="font-mono text-red-300">{simType}</span> not found
        </p>
        <p className="text-xs text-slate-500">
          Check that the simulation module is registered and exported correctly.
        </p>
      </div>
    </div>
  )
}

// ---- Main Component ----
function SimulationBlock({ block, onComplete, onDiscovery }) {
  const {
    simType,
    title,
    description,
    controls: controlDefs = [],
    discoveries: discoveryDefs = [],
    completionCriteria = {},
    config = {},
  } = block

  // Control values state
  const [controlValues, setControlValues] = useState(() => {
    const initial = {}
    controlDefs.forEach((c) => {
      initial[c.param] = c.default ?? c.min ?? 0
    })
    return initial
  })

  // Play/pause state
  const [isPlaying, setIsPlaying] = useState(false)

  // Elapsed time tracking
  const [elapsedTime, setElapsedTime] = useState(0)

  // Launch count tracking
  const [launchCount, setLaunchCount] = useState(0)

  // Discovery tracking
  const {
    discoveries,
    discoveredSet,
    discover,
    latestDiscovery,
    dismissToast,
    allDiscovered,
    discoveredCount,
    totalCount,
  } = useDiscoveryTracker(discoveryDefs)

  // Completion tracking
  const { isComplete, markComplete } = useSimulationCompletion(
    completionCriteria,
    { discoveredCount, totalCount, elapsedTime, allDiscovered, launchCount }
  )

  // Handle control changes
  const handleControlChange = useCallback((param, value) => {
    setControlValues((prev) => ({ ...prev, [param]: value }))
  }, [])

  // Reset controls to defaults
  const handleControlReset = useCallback(() => {
    const defaults = {}
    controlDefs.forEach((c) => {
      defaults[c.param] = c.default ?? c.min ?? 0
    })
    setControlValues(defaults)
  }, [controlDefs])

  // Play/pause toggle
  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  // Reset everything
  const handleReset = useCallback(() => {
    setIsPlaying(false)
    handleControlReset()
    setElapsedTime(0)
    setLaunchCount(0)
  }, [handleControlReset])

  // Handle discovery with callback to parent
  const handleDiscover = useCallback((discoveryId) => {
    discover(discoveryId)
    if (onDiscovery) {
      const def = discoveryDefs.find((d) => d.id === discoveryId)
      onDiscovery(def || { id: discoveryId })
    }
  }, [discover, onDiscovery, discoveryDefs])

  // Handle completion
  const handleComplete = useCallback(() => {
    markComplete()
    if (onComplete) {
      onComplete({
        simType,
        discoveredCount,
        totalCount,
        elapsedTime,
      })
    }
  }, [markComplete, onComplete, simType, discoveredCount, totalCount, elapsedTime])

  // Resolve the simulation component from the registry
  const SimComponent = simulationRegistry[simType] || null

  // Debug log
  console.log('SimulationBlock render:', { simType, SimComponent: !!SimComponent, title })

  return (
    <div className="relative">
      {/* Discovery Toast */}
      <DiscoveryToast
        discovery={latestDiscovery}
        xpAmount={5}
        onDismiss={dismissToast}
        show={!!latestDiscovery}
      />

      <SimulationShell
        title={title}
        description={description}
        controls={controlDefs}
        controlValues={controlValues}
        onControlChange={handleControlChange}
        onControlReset={handleControlReset}
        readouts={[]}
        discoveries={discoveries}
        isComplete={isComplete}
        onComplete={handleComplete}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onReset={handleReset}
        badge="Simulation"
      >
        {SimComponent ? (
          <SimulationErrorBoundary>
            <Suspense fallback={<SimulationLoading />}>
              <SimComponent
                params={controlValues}
                onParamChange={handleControlChange}
                isPlaying={isPlaying}
                onDiscovery={handleDiscover}
                discoveredSet={discoveredSet}
                config={config}
                isComplete={isComplete}
                onComplete={handleComplete}
                onElapsedTime={(t) => setElapsedTime(t)}
                onLaunch={() => setLaunchCount((c) => c + 1)}
              />
            </Suspense>
          </SimulationErrorBoundary>
        ) : (
          <SimulationError simType={simType} />
        )}
      </SimulationShell>
    </div>
  )
}

// Export hooks for external use
export { useDiscoveryTracker, useSimulationCompletion }
export default SimulationBlock
