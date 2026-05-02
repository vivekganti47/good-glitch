import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useUserStore = create(
  persist(
    (set, get) => ({
      // User profile
      name: 'Explorer',
      avatarFrame: 'default',
      title: 'Novice Explorer',

      // Streak
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null, // ISO string
      streakFreezes: 1,

      // XP
      totalXP: 0,
      weeklyXP: 0,
      todayXP: 0,
      lastXPDate: null,

      // Leagues
      currentLeague: 'bronze', // bronze, silver, gold, platinum, diamond, champion
      leaguePosition: 15,

      // Badges/Achievements
      badges: [],
      titles: ['Novice Explorer'],
      gems: 50,

      // Actions
      addXP: (amount) => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        const streakMultiplier = getStreakMultiplier(state.currentStreak)
        const finalXP = Math.round(amount * streakMultiplier)

        set({
          totalXP: state.totalXP + finalXP,
          weeklyXP: state.weeklyXP + finalXP,
          todayXP: (state.lastXPDate === today ? state.todayXP : 0) + finalXP,
          lastXPDate: today,
        })

        // Check streak
        get().checkStreak()
        // Check league position
        get().updateLeaguePosition()

        return finalXP
      },

      checkStreak: () => {
        const state = get()
        const today = new Date().toISOString().split('T')[0]
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

        if (state.lastActivityDate === today) return // Already active today

        if (state.lastActivityDate === yesterday) {
          // Continue streak
          const newStreak = state.currentStreak + 1
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastActivityDate: today,
          })
          // Check milestone rewards
          get().checkStreakMilestones(newStreak)
        } else if (state.lastActivityDate && state.lastActivityDate !== today) {
          // Check if streak freeze available
          if (state.streakFreezes > 0) {
            set({
              streakFreezes: state.streakFreezes - 1,
              lastActivityDate: today,
            })
          } else {
            // Reset streak
            set({
              currentStreak: 1,
              lastActivityDate: today,
            })
          }
        } else {
          // First day
          set({ currentStreak: 1, lastActivityDate: today })
        }
      },

      checkStreakMilestones: (streak) => {
        const milestones = {
          3: { xp: 50, badge: 'getting-started' },
          7: { xp: 100, badge: 'week-warrior', freezes: 1 },
          14: { xp: 200, badge: 'fortnight-fighter' },
          30: { xp: 500, badge: 'monthly-master', freezes: 2 },
          60: { xp: 1000, badge: 'dedicated-explorer' },
          100: { xp: 2000, badge: 'century-club' },
        }
        const milestone = milestones[streak]
        if (milestone) {
          const state = get()
          const updates = { totalXP: state.totalXP + milestone.xp }
          if (milestone.badge && !state.badges.includes(milestone.badge)) {
            updates.badges = [...state.badges, milestone.badge]
          }
          if (milestone.freezes) {
            updates.streakFreezes = Math.min(2, state.streakFreezes + milestone.freezes)
          }
          set(updates)
        }
      },

      updateLeaguePosition: () => {
        // Simulate league position based on weekly XP
        const state = get()
        const weeklyXP = state.weeklyXP
        // Simple simulation: position based on XP thresholds
        let position = 30
        if (weeklyXP > 50) position = 25
        if (weeklyXP > 100) position = 20
        if (weeklyXP > 200) position = 15
        if (weeklyXP > 350) position = 10
        if (weeklyXP > 500) position = 5
        if (weeklyXP > 750) position = 3
        if (weeklyXP > 1000) position = 1
        set({ leaguePosition: position })
      },

      addBadge: (badgeId) => {
        const state = get()
        if (!state.badges.includes(badgeId)) {
          set({ badges: [...state.badges, badgeId] })
        }
      },

      addGems: (amount) => set((s) => ({ gems: s.gems + amount })),

      resetWeeklyXP: () => set({ weeklyXP: 0 }),
    }),
    { name: 'yaan-user' }
  )
)

function getStreakMultiplier(streak) {
  if (streak >= 100) return 2.0
  if (streak >= 60) return 1.5
  if (streak >= 30) return 1.3
  if (streak >= 14) return 1.2
  if (streak >= 7) return 1.1
  return 1.0
}

export default useUserStore
