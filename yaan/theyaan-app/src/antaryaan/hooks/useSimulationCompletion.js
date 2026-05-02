import { useMemo } from 'react'

/**
 * Evaluates completion criteria for simulation, sandbox, and challenge blocks.
 *
 * Supports composite criteria via AND/OR grouping. Each leaf condition is one of:
 *   - { type: 'time', seconds } - elapsed time threshold
 *   - { type: 'discoveries', count } - number of eureka discoveries
 *   - { type: 'launches', count } - number of experiment launches
 *   - { type: 'goals', count } - number of goals achieved
 *   - { type: 'score', min } - minimum score reached
 *   - { type: 'custom', key, value } - arbitrary stat >= value
 *
 * Composite nodes:
 *   - { type: 'AND', conditions: [...] } - all must be met
 *   - { type: 'OR', conditions: [...] } - any must be met
 *
 * @param {Object} config
 * @param {Object} config.criteria - Root criteria node
 * @param {Object} config.stats - Current stats object, expected keys:
 *   { timeSpent, discoveryCount, launchCount, goalCount, score, ...custom }
 *
 * @returns {{ isComplete: boolean, progress: number }}
 *   `progress` is a 0-1 value representing how close the learner is to completion.
 */
export default function useSimulationCompletion({ criteria, stats = {} } = {}) {
  const result = useMemo(() => {
    if (!criteria) {
      return { isComplete: false, progress: 0 }
    }

    return evaluateNode(criteria, stats)
  }, [criteria, stats])

  return result
}

// --- Internal evaluation helpers ---

/**
 * Map a leaf condition type to the relevant stat key and threshold.
 */
function getLeafProgress(condition, stats) {
  const { type } = condition

  switch (type) {
    case 'time': {
      const current = stats.timeSpent || 0
      const target = condition.seconds || 1
      return {
        complete: current >= target,
        progress: Math.min(1, current / target),
      }
    }

    case 'discoveries': {
      const current = stats.discoveryCount || 0
      const target = condition.count || 1
      return {
        complete: current >= target,
        progress: Math.min(1, current / target),
      }
    }

    case 'launches': {
      const current = stats.launchCount || 0
      const target = condition.count || 1
      return {
        complete: current >= target,
        progress: Math.min(1, current / target),
      }
    }

    case 'goals': {
      const current = stats.goalCount || 0
      const target = condition.count || 1
      return {
        complete: current >= target,
        progress: Math.min(1, current / target),
      }
    }

    case 'score': {
      const current = stats.score || 0
      const target = condition.min || 1
      return {
        complete: current >= target,
        progress: Math.min(1, current / target),
      }
    }

    case 'custom': {
      const key = condition.key
      const current = (key && stats[key]) || 0
      const target = condition.value || 1
      return {
        complete: current >= target,
        progress: Math.min(1, current / target),
      }
    }

    default:
      return { complete: false, progress: 0 }
  }
}

/**
 * Recursively evaluate a criteria node tree.
 *
 * - AND: all children must be complete; progress = average of children
 * - OR: any child complete; progress = max of children
 * - Leaf: evaluated via getLeafProgress
 */
function evaluateNode(node, stats) {
  if (!node || !node.type) {
    return { isComplete: false, progress: 0 }
  }

  // --- Composite nodes ---
  if (node.type === 'AND') {
    const conditions = node.conditions || []
    if (conditions.length === 0) {
      return { isComplete: true, progress: 1 }
    }

    const results = conditions.map((child) => evaluateNode(child, stats))
    const allComplete = results.every((r) => r.isComplete)
    const avgProgress =
      results.reduce((sum, r) => sum + r.progress, 0) / results.length

    return {
      isComplete: allComplete,
      progress: avgProgress,
    }
  }

  if (node.type === 'OR') {
    const conditions = node.conditions || []
    if (conditions.length === 0) {
      return { isComplete: false, progress: 0 }
    }

    const results = conditions.map((child) => evaluateNode(child, stats))
    const anyComplete = results.some((r) => r.isComplete)
    const maxProgress = Math.max(...results.map((r) => r.progress))

    return {
      isComplete: anyComplete,
      progress: anyComplete ? 1 : maxProgress,
    }
  }

  // --- Leaf node ---
  const leaf = getLeafProgress(node, stats)
  return {
    isComplete: leaf.complete,
    progress: leaf.progress,
  }
}

export { evaluateNode }
