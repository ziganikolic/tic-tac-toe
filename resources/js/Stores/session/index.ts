import { defineStore } from 'pinia'

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as any | null,
    token: null as string | null,
    preferences: {
      theme: 'light' as 'light' | 'dark',
      sound: true,
    },
  }),
  actions: {
    setUser(user: any) {
      this.user = user
    },
    setToken(token: string | null) {
      this.token = token
    },
    setPreferences(prefs: Partial<{ theme: 'light' | 'dark'; sound: boolean }>) {
      this.preferences = { ...this.preferences, ...prefs }
    },
  },
})
