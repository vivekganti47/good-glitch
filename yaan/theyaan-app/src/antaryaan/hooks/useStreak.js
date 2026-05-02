import { useMemo, useCallback } from 'react'
import useUserStore from '../stores/userStore'

/**
 * Hook that returns streak info and streak fire animation state.
 *
 * Provides:
 * - Current streak count and longest streak
 * - Whether the streak is active today
 * - Whether the streak is in danger (no activity yet today, but still recoverable)
 * - Fire animation intensity level (0-4) based on streak length
 * - Streak freeze count
 * - Streak milestone info
 */
export default function useStreak() {
  const currentStreak = useUserStore((s) => s.currentStreak)
  const longestStreak = useUserStore((s) => s.longestStreak)
  const lastActivityDate = useUserStore((s) => s.lastActivityDate)
  const streakFreezes = useUserStore((s) => s.streakFreezes)
  const checkStreak = useUserStore((s) => s.checkStreak)

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  // Whether the user has been active today
  const isActiveToday = lastActivityDate === today

  // Whether the streak is in danger (last activity was yesterday, but nothing yet today)
  const isStreakInDanger = !isActiveToday && lastActivityDate === yesterday

  // Whether the streak has already been lost (last activity was more than 1 day ago and no freezes)
  const isStreakLost =
    !isActiveToday &&
    lastActivityDate !== yesterday &&
    lastActivityDate !== null &&
    streakFreezes === 0

  // Fire animation intensity: 0 = no fire, 1-4 = increasing intensity
  const fireIntensity = useMemo(() => {
    if (!isActiveToday && currentStreak === 0) return 0
    if (currentStreak < 3) return 1
    if (currentStreak < 7) return 2
    if (currentStreak < 30) return 3
    return 4
  }, [currentStreak, isActiveToday])

  // Fire color based on intensity
  const fireColor = useMemo(() => {
    const colors = {
      0: 'transparent',
      1: '#F59E0B', // amber
      2: '#F97316', // orange
      3: '#EF4444', // red
      4: '#8B5CF6', // purple (legendary)
    }
    return colors[fireIntensity]
  }, [fireIntensity])

  // Streak milestone info
  const nextMilestone = useMemo(() => {
    const milestones = [3, 7, 14, 30, 60, 100]
    const next = milestones.find((m) => m > currentStreak)
    if (!next) return null
    return {
      target: next,
      remaining: next - currentStreak,
      progress: currentStreak / next,
    }
  }, [currentStreak])

  // Streak multiplier display
  const multiplier = useMemo(() => {
    if (currentStreak >= 100) return 2.0
    if (currentStreak >= 60) return 1.5
    if (currentStreak >= 30) return 1.3
    if (currentStreak >= 14) return 1.2
    if (currentStreak >= 7) return 1.1
    return 1.0
  }, [currentStreak])

  const hasMultiplier = multiplier > 1.0

  // Hours remaining in today (for urgency display)
  const hoursRemainingToday = useMemo(() => {
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    return Math.max(0, Math.round((endOfDay - now) / 3600000))
  }, [])

  const recordActivity = useCallback(() => {
    checkStreak()
  }, [checkStreak])

  return {
    // Data
    currentStreak,
    longestStreak,
    streakFreezes,
    lastActivityDate,

    // Status
    isActiveToday,
    isStreakInDanger,
    isStreakLost,

    // Animation
    fireIntensity,
    fireColor,

    // Milestone
    nextMilestone,

    // Multiplier
    multiplier,
    hasMultiplier,

    // Urgency
    hoursRemainingToday,

    // Actions
    recordActivity,
  }
}
