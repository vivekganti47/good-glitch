import { useState, useCallback, useRef } from 'react'
import useUserStore from '../stores/userStore'
import useGamificationStore from '../stores/gamificationStore'

/**
 * Hook for XP operations with animation triggers.
 *
 * Provides:
 * - Current XP values (total, weekly, today)
 * - Award XP with animation state
 * - League info
 * - XP animation state for UI components to subscribe to
 */
export default function useXP() {
  const totalXP = useUserStore((s) => s.totalXP)
  const weeklyXP = useUserStore((s) => s.weeklyXP)
  const todayXP = useUserStore((s) => s.todayXP)
  const currentLeague = useUserStore((s) => s.currentLeague)
  const leaguePosition = useUserStore((s) => s.leaguePosition)
  const addXP = useUserStore((s) => s.addXP)
  const addGems = useUserStore((s) => s.addGems)
  const addBadge = useUserStore((s) => s.addBadge)

  const updateDailyGoalProgress = useGamificationStore((s) => s.updateDailyGoalProgress)
  const checkAndAwardAchievements = useGamificationStore((s) => s.checkAndAwardAchievements)
  const queueAchievement = useGamificationStore((s) => s.queueAchievement)

  // Animation state
  const [xpAnimation, setXPAnimation] = useState(null)
  // { amount, multiplied, source, timestamp }

  const [pendingAnimations, setPendingAnimations] = useState([])
  const animationIdRef = useRef(0)

  /**
   * Award XP with animation trigger and side effects (daily goals, achievements).
   * @param {number} amount - Base XP amount before multiplier
   * @param {string} source - Source label for display (e.g., 'Lesson Complete', 'Perfect Score')
   * @returns {number} The final XP amount after multiplier
   */
  const awardXP = useCallback(
    (amount, source = 'Activity') => {
      const finalXP = addXP(amount)

      // Trigger animation
      const animId = ++animationIdRef.current
      const anim = {
        id: animId,
        amount: finalXP,
        baseAmount: amount,
        wasMultiplied: finalXP !== amount,
        source,
        timestamp: Date.now(),
      }

      setXPAnimation(anim)
      setPendingAnimations((prev) => [...prev, anim])

      // Auto-clear animation after 2 seconds
      setTimeout(() => {
        setXPAnimation((current) => (current?.id === animId ? null : current))
        setPendingAnimations((prev) => prev.filter((a) => a.id !== animId))
      }, 2000)

      // Update daily goal progress for XP
      updateDailyGoalProgress('xp', finalXP)

      return finalXP
    },
    [addXP, updateDailyGoalProgress]
  )

  /**
   * Award XP for completing a star lesson.
   */
  const awardLessonXP = useCallback(
    (xpEarned, hadPerfectScore = false) => {
      const finalXP = awardXP(xpEarned, hadPerfectScore ? 'Perfect Lesson!' : 'Lesson Complete')
      updateDailyGoalProgress('lessons', 1)
      if (hadPerfectScore) {
        updateDailyGoalProgress('perfect', 1)
      }
      return finalXP
    },
    [awardXP, updateDailyGoalProgress]
  )

  /**
   * Award XP for completing a planet practice.
   */
  const awardPracticeXP = useCallback(
    (xpEarned, hadPerfectScore = false) => {
      const finalXP = awardXP(xpEarned, hadPerfectScore ? 'Perfect Practice!' : 'Practice Complete')
      updateDailyGoalProgress('practice', 1)
      if (hadPerfectScore) {
        updateDailyGoalProgress('perfect', 1)
      }
      return finalXP
    },
    [awardXP, updateDailyGoalProgress]
  )

  /**
   * Award XP for completing a quest.
   */
  const awardQuestXP = useCallback(
    (xpEarned) => {
      return awardXP(xpEarned, 'Quest Complete!')
    },
    [awardXP]
  )

  /**
   * Award XP for making a discovery in a simulation.
   */
  const awardDiscoveryXP = useCallback(
    (xpEarned = 5, discoveryName = '') => {
      const source = discoveryName ? `Discovery: ${discoveryName}` : 'Discovery!'
      return awardXP(xpEarned, source)
    },
    [awardXP]
  )

  /**
   * Award XP for completing a challenge.
   */
  const awardChallengeXP = useCallback(
    (xpEarned, tier = null) => {
      const source = tier ? `Challenge ${tier}!` : 'Challenge Complete!'
      const finalXP = awardXP(xpEarned, source)
      updateDailyGoalProgress('challenges', 1)
      return finalXP
    },
    [awardXP, updateDailyGoalProgress]
  )

  /**
   * Check and award any newly earned achievements based on current state.
   * Call this after major state changes.
   */
  const checkAchievements = useCallback(
    (context) => {
      const earned = checkAndAwardAchievements(context)
      const userBadges = useUserStore.getState().badges
      const newAchievements = earned.filter((id) => !userBadges.includes(id))

      newAchievements.forEach((id) => {
        addBadge(id)
        queueAchievement(id)
      })

      return newAchievements
    },
    [checkAndAwardAchievements, addBadge, queueAchievement]
  )

  /**
   * Dismiss the current XP animation.
   */
  const dismissAnimation = useCallback(() => {
    setXPAnimation(null)
  }, [])

  // XP needed for next league tier approximation
  const leagueInfo = {
    league: currentLeague,
    position: leaguePosition,
    weeklyXP,
  }

  // Today's XP goal progress (default daily target: 50 XP)
  const dailyTarget = 50
  const dailyProgress = Math.min(1, todayXP / dailyTarget)

  return {
    // XP data
    totalXP,
    weeklyXP,
    todayXP,

    // League
    leagueInfo,

    // Daily target
    dailyTarget,
    dailyProgress,

    // Animation state
    xpAnimation,
    pendingAnimations,

    // Actions
    awardXP,
    awardLessonXP,
    awardPracticeXP,
    awardQuestXP,
    awardDiscoveryXP,
    awardChallengeXP,
    addGems,
    checkAchievements,
    dismissAnimation,
  }
}
