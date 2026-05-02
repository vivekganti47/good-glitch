import { useMemo, useCallback } from 'react'
import useProgressStore from '../stores/progressStore'
import useUserStore from '../stores/userStore'

/**
 * Hook for checking progress, unlocks, and mastery.
 *
 * Provides:
 * - Star, planet, quest completion status
 * - Constellation and galaxy progress summaries
 * - Unlock checking with prerequisites
 * - Concept mastery level queries
 * - Overall stats
 */
export default function useProgress() {
  const starProgress = useProgressStore((s) => s.starProgress)
  const planetProgress = useProgressStore((s) => s.planetProgress)
  const questProgress = useProgressStore((s) => s.questProgress)
  const conceptMastery = useProgressStore((s) => s.conceptMastery)

  const completeStarLesson = useProgressStore((s) => s.completeStarLesson)
  const completePlanetPractice = useProgressStore((s) => s.completePlanetPractice)
  const completeQuest = useProgressStore((s) => s.completeQuest)
  const getConstellationProgress = useProgressStore((s) => s.getConstellationProgress)
  const getGalaxyProgress = useProgressStore((s) => s.getGalaxyProgress)
  const isConstellationUnlocked = useProgressStore((s) => s.isConstellationUnlocked)
  const getStarStatus = useProgressStore((s) => s.getStarStatus)
  const getPlanetStatus = useProgressStore((s) => s.getPlanetStatus)
  const getConceptLevel = useProgressStore((s) => s.getConceptLevel)
  const getDueReviewConcepts = useProgressStore((s) => s.getDueReviewConcepts)
  const updateConceptMastery = useProgressStore((s) => s.updateConceptMastery)
  const initConcept = useProgressStore((s) => s.initConcept)

  // --- Overall Stats ---

  const overallStats = useMemo(() => {
    const completedStarCount = Object.values(starProgress).filter((s) => s.completed).length
    const completedPlanetCount = Object.values(planetProgress).filter((p) => p.completed).length
    const completedQuestCount = Object.values(questProgress).filter((q) => q.completed).length

    const totalScore = Object.values(starProgress).reduce(
      (sum, s) => sum + (s.completed ? s.score : 0),
      0
    )
    const avgScore = completedStarCount > 0 ? Math.round(totalScore / completedStarCount) : 0

    const masteryLevels = Object.values(conceptMastery)
    const masteredCount = masteryLevels.filter(
      (c) => c.level === 'mastered' || c.level === 'legendary'
    ).length
    const legendaryCount = masteryLevels.filter((c) => c.level === 'legendary').length

    return {
      completedStarCount,
      completedPlanetCount,
      completedQuestCount,
      avgScore,
      totalConcepts: masteryLevels.length,
      masteredCount,
      legendaryCount,
    }
  }, [starProgress, planetProgress, questProgress, conceptMastery])

  // --- Due Reviews ---

  const dueReviews = useMemo(() => {
    return getDueReviewConcepts()
  }, [getDueReviewConcepts, conceptMastery])

  // --- Helpers ---

  /**
   * Check if a star lesson has been completed.
   */
  const isStarCompleted = useCallback(
    (starId) => {
      return starProgress[starId]?.completed === true
    },
    [starProgress]
  )

  /**
   * Check if a planet practice has been completed.
   */
  const isPlanetCompleted = useCallback(
    (planetId) => {
      return planetProgress[planetId]?.completed === true
    },
    [planetProgress]
  )

  /**
   * Check if a quest has been completed.
   */
  const isQuestCompleted = useCallback(
    (questId) => {
      return questProgress[questId]?.completed === true
    },
    [questProgress]
  )

  /**
   * Get the best score for a star lesson.
   */
  const getStarBestScore = useCallback(
    (starId) => {
      return starProgress[starId]?.score || 0
    },
    [starProgress]
  )

  /**
   * Get the best score for a planet practice.
   */
  const getPlanetBestScore = useCallback(
    (planetId) => {
      return planetProgress[planetId]?.bestScore || 0
    },
    [planetProgress]
  )

  /**
   * Get a summary of mastery distribution.
   */
  const masteryDistribution = useMemo(() => {
    const dist = { locked: 0, learning: 0, practicing: 0, mastered: 0, legendary: 0 }
    Object.values(conceptMastery).forEach((c) => {
      if (dist[c.level] !== undefined) {
        dist[c.level] += 1
      }
    })
    return dist
  }, [conceptMastery])

  /**
   * Check whether all stars in a constellation are completed.
   */
  const isConstellationComplete = useCallback(
    (constellationId, totalStars) => {
      const progress = getConstellationProgress(constellationId)
      return totalStars > 0 && progress.completedStars >= totalStars
    },
    [getConstellationProgress]
  )

  /**
   * Get concept mastery data for a specific concept.
   */
  const getConceptMastery = useCallback(
    (conceptId) => {
      return conceptMastery[conceptId] || null
    },
    [conceptMastery]
  )

  return {
    // Raw progress data
    starProgress,
    planetProgress,
    questProgress,
    conceptMastery,

    // Overall stats
    overallStats,

    // Due reviews
    dueReviews,
    dueReviewCount: dueReviews.length,

    // Status checkers
    isStarCompleted,
    isPlanetCompleted,
    isQuestCompleted,
    getStarStatus,
    getPlanetStatus,
    getStarBestScore,
    getPlanetBestScore,

    // Progress queries
    getConstellationProgress,
    getGalaxyProgress,
    isConstellationUnlocked,
    isConstellationComplete,

    // Mastery
    getConceptLevel,
    getConceptMastery,
    masteryDistribution,

    // Actions
    completeStarLesson,
    completePlanetPractice,
    completeQuest,
    updateConceptMastery,
    initConcept,
  }
}
