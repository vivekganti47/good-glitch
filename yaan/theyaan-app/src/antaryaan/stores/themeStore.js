import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useThemeStore = create(
  persist(
    (set, get) => ({
      // 'light' is the default theme
      theme: 'light',

      // Toggle between light and dark
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // Set specific theme
      setTheme: (theme) => set({ theme }),

      // Helper to check if dark mode
      isDark: () => get().theme === 'dark',

      // Helper to check if light mode
      isLight: () => get().theme === 'light',
    }),
    {
      name: 'yaan-theme',
    }
  )
)

export default useThemeStore
