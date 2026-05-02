import { useState, useCallback, useMemo, useRef, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, RotateCcw, X, Check, ChevronRight } from 'lucide-react'
import SimulationShell from './SimulationShell'
import Button from '../common/Button'
import { challengeRegistry, simulationRegistry } from '../../data/simulations/registry'

/**
 * Block dispatcher for type: 'challenge'.
 *
 * Unlike simulation/sandbox, challenges have:
 * - Success/failure states with explicit pass/fail criteria
 * - Retry mechanism with attempt tracking
 * - Scoring tiers (gold, silver, bronze) based on performance
 * - Time limits (optional)
 */

// ---- Scoring Tier Definitions ----
const SCORING_TIERS = {
  gold: {
    key: 'gold',
    label: 'Gold',
    color: 'amber',
    bgClass: 'bg-amber-500/10 border-amber-500/30',
    textClass: 'text-amber-300',
    iconColor: '#fbbf24',
    xpMultiplier: 1.5,
  },
  silver: {
    key: 'silver',
    label: 'Silver',
    color: 'slate',
    bgClass: 'bg-slate-300/10 border-slate-300/30',
    textClass: 'text-slate-200',
    iconColor: '#cbd5e1',
    xpMultiplier: 1.0,
  },
  bronze: {
    key: 'bronze',
    label: 'Bronze',
    color: 'orange',
    bgClass: 'bg-orange-500/10 border-orange-500/30',
    textClass: 'text-orange-300',
    iconColor: '#fb923c',
    xpMultiplier: 0.75,
  },
}

function determineTier(score, thresholds = {}) {
  const { gold = 90, silver = 70, bronze = 50 } = thresholds
  if (score >= gold) return SCORING_TIERS.gold
  if (score >= silver) return SCORING_TIERS.silver
  if (score >= bronze) return SCORING_TIERS.bronze
  return null // Below bronze = fail
}

// ---- Challenge State Constants ----
const CHALLENGE_STATES = {
  READY: 'ready',
  RUNNING: 'running',
  SUCCESS: 'success',
  FAILURE: 'failure',
}

// ---- Result Overlay ----
function ResultOverlay({ state, tier, score, attempts, maxAttempts, onRetry, onComplete }) {
  const isSuccess = state === CHALLENGE_STATES.SUCCESS
  const canRetry = maxAttempts === 0 || attempts < maxAttempts

  return (
    <AnimatePresence>
      {(state === CHALLENGE_STATES.SUCCESS || state === CHALLENGE_STATES.FAILURE) && (
        <motion.div
          className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="text-center space-y-4 max-w-sm px-6"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isSuccess ? (
              <>
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center"
                  style={{
                    background: tier
                      ? `radial-gradient(circle, ${tier.iconColor}22, transparent)`
                      : 'radial-gradient(circle, rgba(16, 185, 129, 0.15), transparent)',
                    border: `2px solid ${tier ? tier.iconColor + '40' : 'rgba(16, 185, 129, 0.3)'}`,
                  }}
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <Trophy
                    size={28}
                    style={{ color: tier ? tier.iconColor : '#10b981' }}
                  />
                </motion.div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Challenge Passed!
                  </h3>
                  {tier && (
                    <p className={`text-sm font-semibold mt-1 ${tier.textClass}`}>
                      {tier.label} Tier
                    </p>
                  )}
                  {score !== undefined && (
                    <p className="text-sm text-slate-400 mt-1 font-mono">
                      Score: {Math.round(score)}%
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3">
                  {canRetry && (
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={RotateCcw}
                      onClick={onRetry}
                    >
                      Try for better
                    </Button>
                  )}
                  <Button
                    variant="success"
                    size="sm"
                    icon={Check}
                    onClick={onComplete}
                  >
                    Claim Reward
                  </Button>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  className="w-16 h-16 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                >
                  <X size={28} className="text-red-400" />
                </motion.div>

                <div>
                  <h3 className="text-lg font-bold text-slate-100">
                    Challenge Failed
                  </h3>
                  {score !== undefined && (
                    <p className="text-sm text-slate-400 mt-1 font-mono">
                      Score: {Math.round(score)}%
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-2">
                    {canRetry
                      ? `Attempt ${attempts}${maxAttempts > 0 ? ` of ${maxAttempts}` : ''} - Try again!`
                      : 'No more attempts remaining.'
                    }
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                  {canRetry && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={RotateCcw}
                      onClick={onRetry}
                    >
                      Retry
                    </Button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ---- Timer Bar ----
function TimerBar({ timeLimit, timeRemaining }) {
  if (!timeLimit || timeLimit <= 0) return null

  const progress = Math.max(0, Math.min(1, timeRemaining / timeLimit))
  const isLow = progress < 0.25
  const isCritical = progress < 0.1

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500">Time</span>
        <span
          className={`text-xs font-mono tabular-nums ${
            isCritical
              ? 'text-red-400'
              : isLow
                ? 'text-amber-400'
                : 'text-slate-400'
          }`}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${
            isCritical
              ? 'bg-red-500'
              : isLow
                ? 'bg-amber-500'
                : 'bg-indigo-500'
          }`}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5, ease: 'linear' }}
        />
      </div>
    </div>
  )
}

function formatTime(seconds) {
  if (seconds <= 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// ---- Loading & Error Fallbacks ----
function ChallengeLoading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="space-y-3 text-center">
        <motion.div
          className="w-10 h-10 mx-auto border-2 border-indigo-500/30 border-t-indigo-500 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-sm text-slate-500">Loading challenge...</p>
      </div>
    </div>
  )
}

function ChallengeError({ simType }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-red-400 text-lg">!</span>
        </div>
        <p className="text-sm text-slate-400">
          Challenge <span className="font-mono text-red-300">{simType}</span> not found
        </p>
      </div>
    </div>
  )
}

// ---- Main Component ----
function ChallengeBlock({ block, onComplete }) {
  const {
    simType,
    title,
    description,
    controls: controlDefs = [],
    config = {},
    timeLimit = 0,
    maxAttempts = 0,
    scoringThresholds = {},
    objective = '',
  } = block

  // Challenge state machine
  const [challengeState, setChallengeState] = useState(CHALLENGE_STATES.READY)
  const [attempts, setAttempts] = useState(0)
  const [score, setScore] = useState(null)
  const [tier, setTier] = useState(null)
  const [bestScore, setBestScore] = useState(0)
  const [bestTier, setBestTier] = useState(null)

  // Timer
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const timerRef = useRef(null)

  // Control values
  const [controlValues, setControlValues] = useState(() => {
    const initial = {}
    controlDefs.forEach((c) => {
      initial[c.param] = c.default ?? c.min ?? 0
    })
    return initial
  })

  // Handle challenge result from simulation
  const handleResult = useCallback((resultScore, passed) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    const numericScore = typeof resultScore === 'number' ? resultScore : 0
    const resultTier = passed ? determineTier(numericScore, scoringThresholds) : null

    setScore(numericScore)
    setTier(resultTier)

    if (numericScore > bestScore) {
      setBestScore(numericScore)
      setBestTier(resultTier)
    }

    if (passed && resultTier) {
      setChallengeState(CHALLENGE_STATES.SUCCESS)
    } else {
      setChallengeState(CHALLENGE_STATES.FAILURE)
    }
  }, [scoringThresholds, bestScore])

  // Start the challenge
  const startChallenge = useCallback(() => {
    setChallengeState(CHALLENGE_STATES.RUNNING)
    setAttempts((prev) => prev + 1)
    setScore(null)
    setTier(null)
    setTimeRemaining(timeLimit)

    if (timeLimit > 0) {
      const startTime = Date.now()
      timerRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        const remaining = Math.max(0, timeLimit - elapsed)
        setTimeRemaining(remaining)

        if (remaining <= 0) {
          clearInterval(timerRef.current)
          handleResult(0, false)
        }
      }, 100)
    }
  }, [timeLimit, handleResult])

  // Retry the challenge
  const handleRetry = useCallback(() => {
    setChallengeState(CHALLENGE_STATES.READY)
    setScore(null)
    setTier(null)
    setTimeRemaining(timeLimit)

    const defaults = {}
    controlDefs.forEach((c) => {
      defaults[c.param] = c.default ?? c.min ?? 0
    })
    setControlValues(defaults)
  }, [timeLimit, controlDefs])

  // Complete and claim reward
  const handleComplete = useCallback(() => {
    if (onComplete) {
      onComplete({
        simType,
        score: bestScore,
        tier: bestTier?.key || tier?.key || null,
        attempts,
        xpMultiplier: (bestTier || tier)?.xpMultiplier || 1,
      })
    }
  }, [onComplete, simType, bestScore, bestTier, tier, attempts])

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

  const isRunning = challengeState === CHALLENGE_STATES.RUNNING
  const canStart = challengeState === CHALLENGE_STATES.READY &&
    (maxAttempts === 0 || attempts < maxAttempts)

  // Resolve from challenge registry, fallback to simulation registry
  const SimComponent = challengeRegistry[simType] || simulationRegistry[simType] || null

  return (
    <SimulationShell
      title={title}
      description={description}
      controls={controlDefs}
      controlValues={controlValues}
      onControlChange={handleControlChange}
      onControlReset={handleControlReset}
      isPlaying={isRunning}
      badge="Challenge"
      completionLabel="Complete Challenge"
    >
      <div className="space-y-3">
        {/* Objective display */}
        {objective && (
          <div className="px-3 py-2 rounded-lg bg-indigo-500/5 border border-indigo-500/15">
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-wider mb-0.5">
              Objective
            </p>
            <p className="text-sm text-slate-300">{objective}</p>
          </div>
        )}

        {/* Timer bar */}
        <TimerBar
          timeLimit={timeLimit}
          timeRemaining={timeRemaining}
        />

        {/* Attempt info */}
        {maxAttempts > 0 && (
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Attempts: {attempts}/{maxAttempts}</span>
            {bestScore > 0 && (
              <span className="font-mono tabular-nums">
                Best: {Math.round(bestScore)}%
                {bestTier && (
                  <span className={`ml-1 ${bestTier.textClass}`}>
                    ({bestTier.label})
                  </span>
                )}
              </span>
            )}
          </div>
        )}

        {/* Simulation canvas area */}
        <div className="relative">
          {SimComponent ? (
            <Suspense fallback={<ChallengeLoading />}>
              <SimComponent
                params={controlValues}
                onParamChange={handleControlChange}
                isPlaying={isRunning}
                config={config}
                mode="challenge"
                onResult={handleResult}
                onScore={(s) => setScore(s)}
                onComplete={handleComplete}
                isComplete={challengeState === CHALLENGE_STATES.SUCCESS}
                timeRemaining={timeRemaining}
              />
            </Suspense>
          ) : (
            <ChallengeError simType={simType} />
          )}

          {/* Result overlay */}
          <ResultOverlay
            state={challengeState}
            tier={tier}
            score={score}
            attempts={attempts}
            maxAttempts={maxAttempts}
            onRetry={handleRetry}
            onComplete={handleComplete}
          />

          {/* Start button overlay */}
          <AnimatePresence>
            {challengeState === CHALLENGE_STATES.READY && (
              <motion.div
                className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-center space-y-4"
                  initial={{ scale: 0.9, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/10 border-2 border-indigo-500/30 flex items-center justify-center">
                    <Trophy size={28} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">
                      Ready to Start?
                    </h3>
                    {timeLimit > 0 && (
                      <p className="text-sm text-slate-400 mt-1">
                        Time limit: {formatTime(timeLimit)}
                      </p>
                    )}
                  </div>
                  {canStart ? (
                    <Button
                      variant="primary"
                      size="lg"
                      icon={ChevronRight}
                      onClick={startChallenge}
                    >
                      Start Challenge
                    </Button>
                  ) : (
                    <p className="text-sm text-red-400">
                      No attempts remaining
                    </p>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scoring tiers info */}
        <div className="flex items-center gap-3 px-2">
          <span className="text-xs text-slate-600">Scoring:</span>
          {['gold', 'silver', 'bronze'].map((tierKey) => {
            const t = SCORING_TIERS[tierKey]
            const threshold = scoringThresholds[tierKey] || (tierKey === 'gold' ? 90 : tierKey === 'silver' ? 70 : 50)
            return (
              <span
                key={tierKey}
                className={`text-xs font-mono ${t.textClass} opacity-60`}
              >
                {t.label} {threshold}%+
              </span>
            )
          })}
        </div>
      </div>
    </SimulationShell>
  )
}

export { SCORING_TIERS, CHALLENGE_STATES, determineTier }
export default ChallengeBlock
