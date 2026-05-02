import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const usePulseStore = create(
  persist(
    (set) => ({
      teacherName: 'Ms. Kavitha',
      teacherSubject: 'Mathematics',
      teacherAvatar: 'KV',

      selectedClassId: '10-A',
      groupingMode: 'peer-tutoring',
      notificationCount: 3,

      setSelectedClass: (classId) => set({ selectedClassId: classId }),
      setGroupingMode: (mode) => set({ groupingMode: mode }),
      clearNotifications: () => set({ notificationCount: 0 }),
    }),
    { name: 'pulse-teacher' }
  )
)

export default usePulseStore
