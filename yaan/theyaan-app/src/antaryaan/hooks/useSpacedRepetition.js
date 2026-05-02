import { useMemo, useCallback } from 'react'
import useProgressStore from '../stores/progressStore'

/**
 * SM-2 spaced repetition algorithm implementation.
 *
 * The SM-2 algorithm works as follows:
 * - Each concept has an ease factor (starting at 2.5), an interval, and a correct streak.
 * - After a correct answer: increase interval following the progression
 *   1d -> 3d -> 7d -> 14d -> 30d -> 60d -> then multiply by ease factor
 * - After a wrong answer: reset interval to 1 day and decrease ease factor.
 * - Ease factor adjusts: +0.1 on correct, -0.2 on wrong (min 1.3).
 *
 * Returns:
 * - dueReviews: concepts due for review (nextReview <= now)
 * - reviewConcept(conceptId, wasCorrect): process a review answer
 * - getNextReviewDate(conceptId): get the next review date for a concept
 * - stats: summary of review queue
 */
export default function useSpacedRepetition() {
  const conceptMastery = useProgressStore((s) => s.conceptMastery)
  const updateConceptMastery = useProgressStore((s) => s.updateConceptMastery)
  const initConcept = useProgressStore((s) => s.initConcept)
  const getDueReviewConcepts = useProgressStore((s) => s.getDueReviewConcepts)

  // --- Due Reviews ---

  const dueReviews = useMemo(() => {
    return getDueReviewConcepts()
  }, [getDueReviewConcepts, conceptMastery])

  // --- Upcoming reviews (within next 7 days) ---

  const upcomingReviews = useMemo(() => {
    const now = new Date()
    const weekFromNow = new Date(now.getTime() + 7 * 86400000).toISOString()

    return Object.entries(conceptMastery)
      .filter(([, data]) => data.nextReview && data.nextReview > now.toISOString() && data.nextReview <= weekFromNow)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
  }, [conceptMastery])

  // --- Stats ---

  const stats = useMemo(() => {
    const concepts = Object.values(conceptMastery)
    const total = concepts.length
    const dueCount = dueReviews.length
    const avgEaseFactor =
      total > 0
        ? Math.round((concepts.reduce((sum, c) => sum + c.easeFactor, 0) / total) * 100) / 100
        : 2.5
    const avgInterval =
      total > 0
        ? Math.round(concepts.reduce((sum, c) => sum + c.interval, 0) / total)
        : 0
    const totalReviews = concepts.reduce((sum, c) => sum + c.totalReviews, 0)
    const totalCorrect = concepts.reduce((sum, c) => sum + c.correctReviews, 0)
    const overallAccuracy = totalReviews > 0 ? Math.round((totalCorrect / totalReviews) * 100) : 0

    return {
      totalConcepts: total,
      dueCount,
      upcomingCount: upcomingReviews.length,
      avgEaseFactor,
      avgInterval,
      totalReviews,
      overallAccuracy,
    }
  }, [conceptMastery, dueReviews, upcomingReviews])

  // --- Actions ---

  /**
   * Process a review answer for a concept.
   * @param {string} conceptId - The concept being reviewed
   * @param {boolean} wasCorrect - Whether the answer was correct
   * @returns {{ leveledUp, newLevel, previousLevel, xpEarned }}
   */
  const reviewConcept = useCallback(
    (conceptId, wasCorrect) => {
      return updateConceptMastery(conceptId, wasCorrect)
    },
    [updateConceptMastery]
  )

  /**
   * Start tracking a new concept for spaced repetition.
   * @param {string} conceptId - The concept to begin tracking
   */
  const startTracking = useCallback(
    (conceptId) => {
      initConcept(conceptId)
    },
    [initConcept]
  )

  /**
   * Get the next scheduled review date for a concept.
   * @param {string} conceptId
   * @returns {string|null} ISO date string or null
   */
  const getNextReviewDate = useCallback(
    (conceptId) => {
      const concept = conceptMastery[conceptId]
      return concept?.nextReview || null
    },
    [conceptMastery]
  )

  /**
   * Get the interval in days for a concept.
   * @param {string} conceptId
   * @returns {number}
   */
  const getReviewInterval = useCallback(
    (conceptId) => {
      const concept = conceptMastery[conceptId]
      return concept?.interval || 0
    },
    [conceptMastery]
  )

  /**
   * Check if a concept is due for review right now.
   * @param {string} conceptId
   * @returns {boolean}
   */
  const isDue = useCallback(
    (conceptId) => {
      const concept = conceptMastery[conceptId]
      if (!concept?.nextReview) return false
      return concept.nextReview <= new Date().toISOString()
    },
    [conceptMastery]
  )

  /**
   * Get a human-readable description of when the next review is.
   * @param {string} conceptId
   * @returns {string}
   */
  const getReviewTimeLabel = useCallback(
    (conceptId) => {
      const concept = conceptMastery[conceptId]
      if (!concept?.nextReview) return 'Not scheduled'

      const now = new Date()
      const next = new Date(concept.nextReview)
      const diffMs = next - now

      if (diffMs <= 0) return 'Due now'

      const diffHours = Math.round(diffMs / 3600000)
      if (diffHours < 1) return 'Due in less than 1 hour'
      if (diffHours < 24) return `Due in ${diffHours} hour${diffHours === 1 ? '' : 's'}`

      const diffDays = Math.round(diffMs / 86400000)
      if (diffDays === 1) return 'Due tomorrow'
      return `Due in ${diffDays} days`
    },
    [conceptMastery]
  )

  return {
    // Review queue
    dueReviews,
    dueCount: dueReviews.length,
    upcomingReviews,

    // Stats
    stats,

    // Queries
    getNextReviewDate,
    getReviewInterval,
    getReviewTimeLabel,
    isDue,

    // Actions
    reviewConcept,
    startTracking,
  }
}
