import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { constellations } from '../data/constellations'
import { galaxies } from '../data/galaxies'

const usePlannerStore = create(
  persist(
    (set, get) => ({
      // View state
      viewMode: 'day', // 'day' | 'week' | 'month'
      selectedDate: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      sidebarOpen: true,
      expandedSubjects: ['physics', 'chemistry', 'biology'],

      // Goals
      dailyGoalMinutes: 90,
      dailyGoalStars: 3,
      weeklyTargetTopics: 15,

      // Milestones
      monthlyMilestones: [], // [{ constellationId, targetDate, completed }]

      // --- Actions ---

      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSubjectExpanded: (subjectId) =>
        set((s) => ({
          expandedSubjects: s.expandedSubjects.includes(subjectId)
            ? s.expandedSubjects.filter((id) => id !== subjectId)
            : [...s.expandedSubjects, subjectId],
        })),

      setDailyGoal: (minutes) => set({ dailyGoalMinutes: minutes }),
      setWeeklyTarget: (topics) => set({ weeklyTargetTopics: topics }),

      addMilestone: (constellationId, targetDate) =>
        set((s) => ({
          monthlyMilestones: [
            ...s.monthlyMilestones,
            { constellationId, targetDate, completed: false },
          ],
        })),

      completeMilestone: (constellationId) =>
        set((s) => ({
          monthlyMilestones: s.monthlyMilestones.map((m) =>
            m.constellationId === constellationId ? { ...m, completed: true } : m
          ),
        })),

      // --- Plan Generation ---

      // Generate daily plan based on progress store data
      generateDailyPlan: (progressStore) => {
        const dueReviews = progressStore.getDueReviewConcepts()
        const starProgress = progressStore.starProgress
        const dailyGoal = get().dailyGoalStars

        const plan = {
          date: get().selectedDate,
          reviews: [],
          newLessons: [],
          estimatedMinutes: 0,
        }

        // 1. Add due reviews (highest priority)
        dueReviews.slice(0, 3).forEach((concept) => {
          plan.reviews.push({
            type: 'review',
            conceptId: concept.id,
            name: concept.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            priority: 1,
            estimatedMinutes: 10,
          })
          plan.estimatedMinutes += 10
        })

        // 2. Find next incomplete stars across constellations
        let lessonsAdded = 0
        const maxLessons = dailyGoal - plan.reviews.length

        for (const galaxy of galaxies) {
          if (lessonsAdded >= maxLessons) break

          for (const constellationId of galaxy.constellationIds) {
            if (lessonsAdded >= maxLessons) break

            const constellation = constellations.find((c) => c.id === constellationId)
            if (!constellation) continue

            for (const starId of constellation.starIds) {
              if (lessonsAdded >= maxLessons) break

              const progress = starProgress[starId]
              if (!progress || !progress.completed) {
                plan.newLessons.push({
                  type: 'lesson',
                  starId,
                  name: starId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                  constellationId,
                  constellationName: constellation.name,
                  galaxyId: galaxy.id,
                  subject: galaxy.subject,
                  color: constellation.colors.primary,
                  priority: 2,
                  estimatedMinutes: 30,
                })
                plan.estimatedMinutes += 30
                lessonsAdded++
              }
            }
          }
        }

        return plan
      },

      // Generate weekly plan
      generateWeeklyPlan: (progressStore) => {
        const today = new Date(get().selectedDate)
        const weekPlan = []

        for (let i = 0; i < 7; i++) {
          const date = new Date(today)
          date.setDate(today.getDate() + i)
          const dateStr = date.toISOString().split('T')[0]

          // Simple distribution: 3 subjects across the week
          const subjects = ['physics', 'chemistry', 'biology']
          const primarySubject = subjects[i % 3]

          weekPlan.push({
            date: dateStr,
            dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
            dayNumber: date.getDate(),
            primarySubject,
            plannedTopics: get().dailyGoalStars,
            isToday: i === 0,
            isPast: false,
          })
        }

        return weekPlan
      },

      // Generate monthly milestones
      generateMonthlyMilestones: (progressStore) => {
        const starProgress = progressStore.starProgress
        const today = new Date()
        const milestones = []

        // Calculate pace: how many stars per day on average
        const pacePerDay = get().dailyGoalStars

        constellations.forEach((constellation, index) => {
          // Count completed stars
          const completedStars = constellation.starIds.filter(
            (starId) => starProgress[starId]?.completed
          ).length
          const remainingStars = constellation.totalStars - completedStars

          if (remainingStars > 0) {
            // Estimate days to complete
            const daysToComplete = Math.ceil(remainingStars / pacePerDay)
            const targetDate = new Date(today)
            targetDate.setDate(today.getDate() + daysToComplete + index * 2)

            milestones.push({
              constellationId: constellation.id,
              constellationName: constellation.name,
              galaxyId: constellation.galaxyId,
              color: constellation.colors.primary,
              targetDate: targetDate.toISOString().split('T')[0],
              completedStars,
              totalStars: constellation.totalStars,
              progress: Math.round((completedStars / constellation.totalStars) * 100),
            })
          }
        })

        return milestones.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate))
      },

      // Get current month calendar data
      getMonthCalendar: () => {
        const selected = new Date(get().selectedDate)
        const year = selected.getFullYear()
        const month = selected.getMonth()

        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDayOfWeek = firstDay.getDay()

        const days = []

        // Pad with empty days from previous month
        for (let i = 0; i < startDayOfWeek; i++) {
          days.push({ empty: true })
        }

        // Add days of current month
        for (let d = 1; d <= lastDay.getDate(); d++) {
          const date = new Date(year, month, d)
          const dateStr = date.toISOString().split('T')[0]
          const today = new Date().toISOString().split('T')[0]

          days.push({
            date: dateStr,
            dayNumber: d,
            isToday: dateStr === today,
            isSelected: dateStr === get().selectedDate,
            isPast: dateStr < today,
          })
        }

        return {
          year,
          month,
          monthName: firstDay.toLocaleDateString('en-US', { month: 'long' }),
          days,
        }
      },

      // Navigate month
      prevMonth: () => {
        const current = new Date(get().selectedDate)
        current.setMonth(current.getMonth() - 1)
        set({ selectedDate: current.toISOString().split('T')[0] })
      },

      nextMonth: () => {
        const current = new Date(get().selectedDate)
        current.setMonth(current.getMonth() + 1)
        set({ selectedDate: current.toISOString().split('T')[0] })
      },
    }),
    { name: 'yaan-planner' }
  )
)

export default usePlannerStore
