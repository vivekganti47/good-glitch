import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCallback, useMemo } from 'react'

/**
 * Adaptive difficulty store (persisted).
 *
 * This is a small Zustand store used internally by the useAdaptiveDifficulty hook.
 * It tracks per-session and per-context difficulty state.
 */
const useAdaptiveDifficultyStore = create(
  persist(
    (set, get) => ({
      // Per-context difficulty tracking
      // { [contextId]: { difficulty, consecutiveCorrect, consecutiveWrong, responseTimes, totalAnswers, correctAnswers } }
      contexts: {},

      getOrCreateContext: (contextId) => {
        const state = get()
        if (state.contexts[contextId]) return state.contexts[contextId]

        const defaultContext = {
          difficulty: 3, // Start in the middle (1-5)
          consecutiveCorrect: 0,
          consecutiveWrong: 0,
          responseTimes: [], // Last N response times in ms
          totalAnswers: 0,
          correctAnswers: 0,
          lastUpdated: new Date().toISOString(),
        }

        set({
          contexts: {
            ...state.contexts,
            [contextId]: defaultContext,
          },
        })

        return defaultContext
      },

      recordAnswer: (contextId, correct, timeMs) => {
        const state = get()
        const ctx = state.contexts[contextId] || state.getOrCreateContext(contextId)

        // Keep last 10 response times
        const responseTimes = [...ctx.responseTimes, timeMs].slice(-10)
        const avgResponseTime =
          responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0

        let { difficulty, consecutiveCorrect, consecutiveWrong } = ctx

        if (correct) {
          consecutiveCorrect += 1
          consecutiveWrong = 0

          // Increase difficulty after 3+ consecutive correct AND fast responses
          // "Fast" = below 70% of the average, or under 10s absolute
          const isFast = timeMs < Math.min(avgResponseTime * 0.7, 10000) || timeMs < 5000

          if (consecutiveCorrect >= 3 && isFast) {
            difficulty = Math.min(5, difficulty + 1)
            consecutiveCorrect = 0 // Reset after adjustment
          } else if (consecutiveCorrect >= 5) {
            // Even without being fast, 5+ correct means we should bump up
            difficulty = Math.min(5, difficulty + 1)
            consecutiveCorrect = 0
          }
        } else {
          consecutiveWrong += 1
          consecutiveCorrect = 0

          // Decrease difficulty after 2+ consecutive wrong
          if (consecutiveWrong >= 2) {
            difficulty = Math.max(1, difficulty - 1)
            consecutiveWrong = 0 // Reset after adjustment
          }
        }

        set({
          contexts: {
            ...state.contexts,
            [contextId]: {
              difficulty,
              consecutiveCorrect,
              consecutiveWrong,
              responseTimes,
              totalAnswers: ctx.totalAnswers + 1,
              correctAnswers: ctx.correctAnswers + (correct ? 1 : 0),
              lastUpdated: new Date().toISOString(),
            },
          },
        })

        return { difficulty, adjusted: difficulty !== ctx.difficulty }
      },

      resetContext: (contextId) => {
        const state = get()
        const { [contextId]: _, ...rest } = state.contexts
        set({ contexts: rest })
      },
    }),
    { name: 'yaan-adaptive-difficulty' }
  )
)

// Difficulty labels and descriptions
const DIFFICULTY_CONFIG = {
  1: { label: 'Beginner', description: 'Foundational concepts and simple problems', color: '#22C55E' },
  2: { label: 'Easy', description: 'Straightforward application of concepts', color: '#84CC16' },
  3: { label: 'Medium', description: 'Standard difficulty, requires solid understanding', color: '#F59E0B' },
  4: { label: 'Hard', description: 'Challenging problems requiring deeper thinking', color: '#F97316' },
  5: { label: 'Expert', description: 'Advanced problems, competition-level difficulty', color: '#EF4444' },
}

/**
 * Hook implementing the Flow Zone Engine for adaptive difficulty.
 *
 * The Flow Zone Engine keeps learners in their optimal challenge zone:
 * - Too easy (3+ fast correct): increase difficulty
 * - Too hard (2+ consecutive wrong): decrease difficulty
 * - Just right: maintain current difficulty
 *
 * @param {string} contextId - Unique identifier for the learning context
 *   (e.g., 'constellation-kinesis-prime', 'planet-newton-1')
 *
 * Returns:
 * - currentDifficulty: number (1-5)
 * - getDifficultyLabel: label string for current difficulty
 * - getDifficultyConfig: full config for current difficulty
 * - recordAnswer(correct, timeMs): record an answer and potentially adjust difficulty
 * - shouldShowHint: whether the learner might need a hint
 * - accuracy: current accuracy percentage
 * - isInFlowZone: whether learner appears to be in optimal challenge range
 */
export default function useAdaptiveDifficulty(contextId = 'default') {
  const getOrCreateContext = useAdaptiveDifficultyStore((s) => s.getOrCreateContext)
  const recordAnswerStore = useAdaptiveDifficultyStore((s) => s.recordAnswer)
  const resetContext = useAdaptiveDifficultyStore((s) => s.resetContext)
  const contexts = useAdaptiveDifficultyStore((s) => s.contexts)

  // Ensure context exists
  const ctx = contexts[contextId] || getOrCreateContext(contextId)

  const currentDifficulty = ctx.difficulty
  const consecutiveCorrect = ctx.consecutiveCorrect
  const consecutiveWrong = ctx.consecutiveWrong
  const totalAnswers = ctx.totalAnswers
  const correctAnswers = ctx.correctAnswers

  // Accuracy as a percentage
  const accuracy = useMemo(() => {
    return totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0
  }, [correctAnswers, totalAnswers])

  // Whether the learner should see a hint
  // Show hint after 1+ consecutive wrong answers
  const shouldShowHint = consecutiveWrong >= 1

  // Whether the learner is in the "flow zone"
  // Flow zone: accuracy between 60-85% and no long streaks of wrong/correct
  const isInFlowZone = useMemo(() => {
    if (totalAnswers < 3) return true // Not enough data, assume flow
    return accuracy >= 60 && accuracy <= 85 && consecutiveWrong < 2 && consecutiveCorrect < 5
  }, [accuracy, totalAnswers, consecutiveWrong, consecutiveCorrect])

  // Difficulty label
  const getDifficultyLabel = useMemo(() => {
    return DIFFICULTY_CONFIG[currentDifficulty]?.label || 'Medium'
  }, [currentDifficulty])

  // Full difficulty config
  const getDifficultyConfig = useMemo(() => {
    return DIFFICULTY_CONFIG[currentDifficulty] || DIFFICULTY_CONFIG[3]
  }, [currentDifficulty])

  // Average response time from recent answers
  const avgResponseTime = useMemo(() => {
    const times = ctx.responseTimes || []
    if (times.length === 0) return 0
    return Math.round(times.reduce((a, b) => a + b, 0) / times.length)
  }, [ctx.responseTimes])

  /**
   * Record an answer and let the engine adjust difficulty.
   * @param {boolean} correct - Whether the answer was correct
   * @param {number} timeMs - Time taken to answer in milliseconds
   * @returns {{ difficulty, adjusted }} New difficulty and whether it changed
   */
  const recordAnswer = useCallback(
    (correct, timeMs) => {
      return recordAnswerStore(contextId, correct, timeMs)
    },
    [contextId, recordAnswerStore]
  )

  /**
   * Reset this context's difficulty tracking.
   */
  const reset = useCallback(() => {
    resetContext(contextId)
  }, [contextId, resetContext])

  /**
   * Get a recommendation for the next question type based on current state.
   */
  const getRecommendation = useMemo(() => {
    if (shouldShowHint) {
      return 'hint' // Show a hint or easier variant
    }
    if (consecutiveCorrect >= 2 && accuracy > 80) {
      return 'challenge' // Offer a bonus challenge question
    }
    if (accuracy < 50 && totalAnswers >= 3) {
      return 'review' // Suggest reviewing the concept
    }
    return 'continue' // Proceed normally
  }, [shouldShowHint, consecutiveCorrect, accuracy, totalAnswers])

  return {
    // Current state
    currentDifficulty,
    getDifficultyLabel,
    getDifficultyConfig,

    // Learner state
    accuracy,
    avgResponseTime,
    totalAnswers,
    consecutiveCorrect,
    consecutiveWrong,

    // Flow zone
    isInFlowZone,
    shouldShowHint,
    getRecommendation,

    // Actions
    recordAnswer,
    reset,
  }
}

export { DIFFICULTY_CONFIG }
