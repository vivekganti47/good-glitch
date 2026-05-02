import { useState, useCallback, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Check } from 'lucide-react'
import SimulationShell from './SimulationShell'
import { sandboxRegistry, simulationRegistry } from '../../data/simulations/registry'

/**
 * Block dispatcher for type: 'sandbox'.
 *
 * Similar to SimulationBlock but tracks goals instead of discoveries.
 * Goals are objective-based milestones the student should reach by
 * experimenting freely with the sandbox controls.
 */

// ---- Goal Tracker Hook ----
function useGoalTracker(goalDefs = []) {
  const [completedGoals, setCompletedGoals] = useState(new Set())

  const completeGoal = useCallback((goalId) => {
    setCompletedGoals((prev) => {
      if (prev.has(goalId)) return prev
      const next = new Set(prev)
      next.add(goalId)
      return next
    })
  }, [])

  const goals = useMemo(() =>
    goalDefs.map((g) => ({
      ...g,
      completed: completedGoals.has(g.id),
    })),
    [goalDefs, completedGoals]
  )

  const allComplete = goalDefs.length > 0 && completedGoals.size >= goalDefs.length
  const completedCount = completedGoals.size

  return {
    goals,
    completedGoals,
    completeGoal,
    allComplete,
    completedCount,
    totalCount: goalDefs.length,
  }
}

// ---- Goal List Component ----
function GoalList({ goals = [] }) {
  if (goals.length === 0) return null

  const completedCount = goals.filter((g) => g.completed).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Target size={12} />
          Goals
        </h4>
        <span className="text-xs text-slate-500 font-mono tabular-nums">
          {completedCount}/{goals.length}
        </span>
      </div>

      <div className="space-y-1.5">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.id}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              goal.completed
                ? 'bg-emerald-500/5 border border-emerald-500/15'
                : 'bg-slate-800/30 border border-slate-700/30'
            }`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <motion.div
              className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 ${
                goal.completed
                  ? 'bg-emerald-500/20 border-emerald-500/40'
                  : 'bg-slate-800/60 border-slate-600/40'
              }`}
              animate={goal.completed ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <AnimatePresence>
                {goal.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                  >
                    <Check size={13} className="text-emerald-400" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <span
              className={`text-sm ${
                goal.completed ? 'text-emerald-200' : 'text-slate-400'
              }`}
            >
              {goal.label}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ---- Loading Fallback ----
function SandboxLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="space-y-3 text-center">
        <motion.div
          className="w-10 h-10 mx-auto border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-slate-500">Loading sandbox...</p>
      </div>
    </div>
  )
}

// ---- Error Fallback ----
function SandboxError({ simType }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-lg">!</span>
        </div>
        <p className="text-sm text-slate-400">
          Sandbox <span className="font-mono text-red-300">{simType}</span> not found
        </p>
      </div>
    </div>
  )
}

// ---- Main Component ----
function SandboxBlock({ block, onComplete, onGoalComplete }) {
  const {
    simType,
    title,
    description,
    controls: controlDefs = [],
    goals: goalDefs = [],
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

  // Play/pause
  const [isPlaying, setIsPlaying] = useState(true)

  // Goal tracking
  const {
    goals,
    completedGoals,
    completeGoal,
    allComplete,
    completedCount,
    totalCount,
  } = useGoalTracker(goalDefs)

  // Control handlers
  const handleControlChange = useCallback((param, value) => {
    setControlValues((prev) => ({ ...prev, [param]: value }))
  }, [])

  const handleControlReset = useCallback(() => {
    const defaults = {}
    controlDefs.forEach((c) => {
      defaults[c.param] = c.default ?? c.min ?? 0
    })
    setControlValues(defaults)
  }, [controlDefs])

  const handlePlayPause = useCallback(() => {
    setIsPlaying((prev) => !prev)
  }, [])

  const handleReset = useCallback(() => {
    handleControlReset()
  }, [handleControlReset])

  // Goal completion with callback
  const handleGoalComplete = useCallback((goalId) => {
    completeGoal(goalId)
    if (onGoalComplete) {
      const def = goalDefs.find((g) => g.id === goalId)
      onGoalComplete(def || { id: goalId })
    }
  }, [completeGoal, onGoalComplete, goalDefs])

  // Handle sandbox completion
  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete({
        simType,
        completedCount,
        totalCount,
      })
    }
  }, [onComplete, simType, completedCount, totalCount])

  // Resolve component from sandbox registry, fallback to simulation registry
  const SimComponent = sandboxRegistry[simType] || simulationRegistry[simType] || null

  return (
    <SimulationShell
      title={title}
      description={description}
      controls={controlDefs}
      controlValues={controlValues}
      onControlChange={handleControlChange}
      onControlReset={handleControlReset}
      readouts={[]}
      discoveries={[]}
      isComplete={allComplete}
      onComplete={handleComplete}
      isPlaying={isPlaying}
      onPlayPause={handlePlayPause}
      onReset={handleReset}
      badge="Sandbox"
      completionLabel="Sandbox Complete"
    >
      <div className="space-y-4">
        {SimComponent ? (
          <Suspense fallback={<SandboxLoading />}>
            <SimComponent
              params={controlValues}
              onParamChange={handleControlChange}
              isPlaying={isPlaying}
              onGoalComplete={handleGoalComplete}
              completedGoals={completedGoals}
              config={config}
              mode="sandbox"
            />
          </Suspense>
        ) : (
          <SandboxError simType={simType} />
        )}

        {/* Goals list rendered below the simulation */}
        <GoalList goals={goals} />
      </div>
    </SimulationShell>
  )
}

export { useGoalTracker }
export default SandboxBlock
