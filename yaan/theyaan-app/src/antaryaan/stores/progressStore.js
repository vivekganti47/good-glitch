import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { galaxies } from '../data/galaxies'
import { constellations } from '../data/constellations'

// Mastery levels in order
const MASTERY_LEVELS = ['locked', 'learning', 'practicing', 'mastered', 'legendary']

// XP rewards per activity type
const XP_REWARDS = {
  starLesson: 25,
  planetPractice: 40,
  quest: 100,
  perfectScore: 15, // bonus
  masteryUp: 50,
  discovery: 5,       // per eureka discovery in simulation
  challengeComplete: 15,
  challengeGold: 10,  // bonus for gold tier
}

const useProgressStore = create(
  persist(
    (set, get) => ({
      // Star (lesson) progress: { [starId]: { completed, score, completedAt, attempts } }
      starProgress: {},

      // Planet (practice) progress: { [planetId]: { completed, bestScore, attempts, lastScore, lastAttemptAt } }
      planetProgress: {},

      // Quest progress: { [questId]: { completed, completedAt } }
      questProgress: {},

      // Simulation progress: { [simType]: { discoveries: Set-as-array, completions, bestScore } }
      simulationProgress: {},

      // Per-concept mastery with spaced repetition data
      conceptMastery: {},

      // --- Star (Lesson) Actions ---

      completeStarLesson: (starId, constellationId, score) => {
        const state = get()
        const existing = state.starProgress[starId]
        const attempts = existing ? existing.attempts + 1 : 1
        const now = new Date().toISOString()

        set({
          starProgress: {
            ...state.starProgress,
            [starId]: {
              completed: true,
              score: existing ? Math.max(existing.score, score) : score,
              completedAt: existing?.completedAt || now,
              lastAttemptAt: now,
              attempts,
              constellationId,
            },
          },
        })

        // Calculate XP earned
        let xpEarned = XP_REWARDS.starLesson
        if (score >= 95) xpEarned += XP_REWARDS.perfectScore

        return { xpEarned, isFirstCompletion: !existing?.completed }
      },

      // --- Planet (Practice) Actions ---

      completePlanetPractice: (planetId, constellationId, score, accuracy) => {
        const state = get()
        const existing = state.planetProgress[planetId]
        const attempts = existing ? existing.attempts + 1 : 1
        const now = new Date().toISOString()

        set({
          planetProgress: {
            ...state.planetProgress,
            [planetId]: {
              completed: true,
              bestScore: existing ? Math.max(existing.bestScore, score) : score,
              lastScore: score,
              accuracy,
              attempts,
              lastAttemptAt: now,
              completedAt: existing?.completedAt || now,
              constellationId,
            },
          },
        })

        let xpEarned = XP_REWARDS.planetPractice
        if (score >= 95) xpEarned += XP_REWARDS.perfectScore
        // Bonus XP for high accuracy
        if (accuracy >= 90) xpEarned += 10

        return { xpEarned, isFirstCompletion: !existing?.completed }
      },

      // --- Quest Actions ---

      completeQuest: (questId, constellationId) => {
        const state = get()
        const existing = state.questProgress[questId]
        if (existing?.completed) return { xpEarned: 0, isFirstCompletion: false }

        const now = new Date().toISOString()

        set({
          questProgress: {
            ...state.questProgress,
            [questId]: {
              completed: true,
              completedAt: now,
              constellationId,
            },
          },
        })

        return { xpEarned: XP_REWARDS.quest, isFirstCompletion: true }
      },

      // --- Simulation Progress ---

      recordSimulationProgress: (simType, data = {}) => {
        const state = get()
        const existing = state.simulationProgress[simType] || {
          discoveries: [],
          completions: 0,
          bestScore: 0,
        }

        const newDiscoveries = data.discoveries
          ? [...new Set([...existing.discoveries, ...data.discoveries])]
          : existing.discoveries

        set({
          simulationProgress: {
            ...state.simulationProgress,
            [simType]: {
              discoveries: newDiscoveries,
              completions: existing.completions + (data.completed ? 1 : 0),
              bestScore: Math.max(existing.bestScore, data.score || 0),
              lastPlayedAt: new Date().toISOString(),
            },
          },
        })

        // Calculate XP
        let xpEarned = 0
        const newDiscoveryCount = newDiscoveries.length - existing.discoveries.length
        xpEarned += newDiscoveryCount * XP_REWARDS.discovery

        if (data.completed && existing.completions === 0) {
          xpEarned += XP_REWARDS.challengeComplete
        }

        if (data.tier === 'gold' && existing.bestScore < 90) {
          xpEarned += XP_REWARDS.challengeGold
        }

        return { xpEarned, newDiscoveryCount }
      },

      // --- Concept Mastery ---

      initConcept: (conceptId) => {
        const state = get()
        if (state.conceptMastery[conceptId]) return

        set({
          conceptMastery: {
            ...state.conceptMastery,
            [conceptId]: {
              level: 'learning',
              lastReview: null,
              nextReview: new Date().toISOString(),
              interval: 1, // days
              easeFactor: 2.5,
              correctStreak: 0,
              totalReviews: 0,
              correctReviews: 0,
            },
          },
        })
      },

      updateConceptMastery: (conceptId, wasCorrect) => {
        const state = get()
        const concept = state.conceptMastery[conceptId]
        if (!concept) {
          // Auto-init if not found
          get().initConcept(conceptId)
          return get().updateConceptMastery(conceptId, wasCorrect)
        }

        const now = new Date()
        const totalReviews = concept.totalReviews + 1
        const correctReviews = concept.correctReviews + (wasCorrect ? 1 : 0)
        let { easeFactor, interval, correctStreak } = concept

        if (wasCorrect) {
          correctStreak += 1
          // SM-2 interval progression
          if (interval <= 1) interval = 1
          else if (interval <= 3) interval = 3
          else if (interval <= 7) interval = 7
          else if (interval <= 14) interval = 14
          else if (interval <= 30) interval = 30
          else if (interval <= 60) interval = 60
          else interval = Math.round(interval * easeFactor)

          // Increase interval after each step
          if (correctStreak === 1) interval = 1
          else if (correctStreak === 2) interval = 3
          else if (correctStreak === 3) interval = 7
          else if (correctStreak === 4) interval = 14
          else if (correctStreak === 5) interval = 30
          else if (correctStreak === 6) interval = 60
          else interval = Math.round(interval * easeFactor)

          // Adjust ease factor (min 1.3)
          easeFactor = Math.max(1.3, easeFactor + 0.1)
        } else {
          // Incorrect: reset
          correctStreak = 0
          interval = 1
          easeFactor = Math.max(1.3, easeFactor - 0.2)
        }

        // Determine mastery level based on stats
        let level = concept.level
        const accuracy = correctReviews / totalReviews

        if (correctStreak >= 8 && accuracy >= 0.95 && totalReviews >= 12) {
          level = 'legendary'
        } else if (correctStreak >= 4 && accuracy >= 0.8 && totalReviews >= 6) {
          level = 'mastered'
        } else if (correctStreak >= 2 && totalReviews >= 3) {
          level = 'practicing'
        } else if (totalReviews >= 1) {
          level = 'learning'
        }

        const nextReview = new Date(now.getTime() + interval * 86400000).toISOString()
        const previousLevel = concept.level

        set({
          conceptMastery: {
            ...state.conceptMastery,
            [conceptId]: {
              level,
              lastReview: now.toISOString(),
              nextReview,
              interval,
              easeFactor,
              correctStreak,
              totalReviews,
              correctReviews,
            },
          },
        })

        // Return whether level changed
        const leveledUp =
          MASTERY_LEVELS.indexOf(level) > MASTERY_LEVELS.indexOf(previousLevel)
        return {
          leveledUp,
          newLevel: level,
          previousLevel,
          xpEarned: leveledUp ? XP_REWARDS.masteryUp : 0,
        }
      },

      // --- Progress Queries ---

      getConstellationProgress: (constellationId) => {
        const state = get()

        // Count completed stars for this constellation
        const starEntries = Object.entries(state.starProgress).filter(
          ([, v]) => v.constellationId === constellationId
        )
        const completedStars = starEntries.filter(([, v]) => v.completed).length
        const totalStarScore = starEntries.reduce((sum, [, v]) => sum + (v.score || 0), 0)
        const avgStarScore = completedStars > 0 ? Math.round(totalStarScore / completedStars) : 0

        // Count completed planets for this constellation
        const planetEntries = Object.entries(state.planetProgress).filter(
          ([, v]) => v.constellationId === constellationId
        )
        const completedPlanets = planetEntries.filter(([, v]) => v.completed).length

        // Count completed quests for this constellation
        const questEntries = Object.entries(state.questProgress).filter(
          ([, v]) => v.constellationId === constellationId
        )
        const completedQuests = questEntries.filter(([, v]) => v.completed).length

        return {
          completedStars,
          completedPlanets,
          completedQuests,
          avgStarScore,
          totalItems: completedStars + completedPlanets + completedQuests,
        }
      },

      getGalaxyProgress: (galaxyId) => {
        const galaxy = galaxies.find((g) => g.id === galaxyId)
        if (!galaxy) return { totalProgress: 0, constellations: [] }

        const constellationIds = galaxy.constellationIds || []
        const constellationProgress = constellationIds.map((cId) => ({
          id: cId,
          ...get().getConstellationProgress(cId),
        }))

        const totalItems = constellationProgress.reduce((sum, c) => sum + c.totalItems, 0)

        return {
          totalItems,
          constellations: constellationProgress,
        }
      },

      isConstellationUnlocked: (constellationId, prerequisites) => {
        // All constellations are unlocked for easy access
        return true
      },

      // --- Utility ---

      getStarStatus: (starId) => {
        const progress = get().starProgress[starId]
        if (!progress) return 'locked'
        return progress.completed ? 'completed' : 'in-progress'
      },

      getPlanetStatus: (planetId) => {
        const progress = get().planetProgress[planetId]
        if (!progress) return 'locked'
        return progress.completed ? 'completed' : 'in-progress'
      },

      getConceptLevel: (conceptId) => {
        const concept = get().conceptMastery[conceptId]
        return concept ? concept.level : 'locked'
      },

      getDueReviewConcepts: () => {
        const state = get()
        const now = new Date().toISOString()
        return Object.entries(state.conceptMastery)
          .filter(([, data]) => data.nextReview && data.nextReview <= now)
          .map(([id, data]) => ({ id, ...data }))
      },

      // --- Mastery Color Helpers ---

      // Get mastery color for a concept (green/amber/red)
      getMasteryColor: (conceptId) => {
        const concept = get().conceptMastery[conceptId]
        if (!concept) return '#EF4444' // red for not started

        const level = concept.level
        if (['mastered', 'legendary'].includes(level)) return '#10B981' // emerald
        if (level === 'practicing') return '#F59E0B' // amber
        if (level === 'learning') {
          const accuracy = concept.totalReviews > 0
            ? concept.correctReviews / concept.totalReviews
            : 0
          return accuracy > 0.5 ? '#F59E0B' : '#EF4444'
        }
        return '#EF4444' // red for locked
      },

      // Get mastery status label
      getMasteryStatus: (conceptId) => {
        const concept = get().conceptMastery[conceptId]
        if (!concept) return 'not-started'

        const level = concept.level
        if (['mastered', 'legendary'].includes(level)) return 'mastered'
        if (level === 'practicing') return 'practicing'
        if (level === 'learning') {
          const accuracy = concept.totalReviews > 0
            ? concept.correctReviews / concept.totalReviews
            : 0
          return accuracy > 0.5 ? 'practicing' : 'needs-focus'
        }
        return 'not-started'
      },

      // Get all topics with their mastery status, grouped by subject
      getAllTopicsWithMastery: () => {
        const state = get()
        const subjectMap = {
          'newtonian-dominion': 'physics',
          'elemental-expanse': 'chemistry',
          'living-nexus': 'biology',
        }

        const topics = []

        constellations.forEach((constellation) => {
          const subject = subjectMap[constellation.galaxyId] || 'other'

          constellation.concepts.forEach((conceptId) => {
            const mastery = state.conceptMastery[conceptId]
            const color = get().getMasteryColor(conceptId)
            const status = get().getMasteryStatus(conceptId)

            topics.push({
              id: conceptId,
              name: conceptId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
              subject,
              galaxyId: constellation.galaxyId,
              constellationId: constellation.id,
              constellationName: constellation.name,
              color,
              status,
              level: mastery?.level || 'locked',
              totalReviews: mastery?.totalReviews || 0,
              correctReviews: mastery?.correctReviews || 0,
              accuracy: mastery?.totalReviews > 0
                ? Math.round((mastery.correctReviews / mastery.totalReviews) * 100)
                : 0,
            })
          })
        })

        return topics
      },

      // Get topics grouped by subject
      getTopicsBySubject: () => {
        const topics = get().getAllTopicsWithMastery()

        return {
          physics: topics.filter(t => t.subject === 'physics'),
          chemistry: topics.filter(t => t.subject === 'chemistry'),
          biology: topics.filter(t => t.subject === 'biology'),
        }
      },

      // Get mastery stats summary
      getMasteryStats: () => {
        const topics = get().getAllTopicsWithMastery()

        return {
          total: topics.length,
          mastered: topics.filter(t => t.status === 'mastered').length,
          practicing: topics.filter(t => t.status === 'practicing').length,
          needsFocus: topics.filter(t => t.status === 'needs-focus').length,
          notStarted: topics.filter(t => t.status === 'not-started').length,
        }
      },

      // Initialize demo mastery data for development
      initDemoMastery: () => {
        const state = get()
        if (Object.keys(state.conceptMastery).length > 0) return // Already has data

        const allTopics = []
        constellations.forEach((c) => {
          c.concepts.forEach((conceptId) => allTopics.push(conceptId))
        })

        // Distribute: ~20% mastered, ~30% practicing, ~50% not started
        const shuffled = [...allTopics].sort(() => Math.random() - 0.5)
        const masteredCount = Math.floor(shuffled.length * 0.2)
        const practicingCount = Math.floor(shuffled.length * 0.3)

        const newMastery = {}

        shuffled.forEach((conceptId, i) => {
          if (i < masteredCount) {
            // Mastered
            newMastery[conceptId] = {
              level: 'mastered',
              lastReview: new Date().toISOString(),
              nextReview: new Date(Date.now() + 30 * 86400000).toISOString(),
              interval: 30,
              easeFactor: 2.8,
              correctStreak: 5,
              totalReviews: 8,
              correctReviews: 7,
            }
          } else if (i < masteredCount + practicingCount) {
            // Practicing
            newMastery[conceptId] = {
              level: 'practicing',
              lastReview: new Date(Date.now() - 2 * 86400000).toISOString(),
              nextReview: new Date(Date.now() + 3 * 86400000).toISOString(),
              interval: 7,
              easeFactor: 2.5,
              correctStreak: 2,
              totalReviews: 4,
              correctReviews: 3,
            }
          }
          // Rest stay as not started (no entry)
        })

        set({ conceptMastery: newMastery })
      },

      // Reset all progress (for dev/testing)
      resetAllProgress: () =>
        set({
          starProgress: {},
          planetProgress: {},
          questProgress: {},
          simulationProgress: {},
          conceptMastery: {},
        }),
    }),
    { name: 'yaan-progress' }
  )
)

export default useProgressStore
