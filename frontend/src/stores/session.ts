import { defineStore } from 'pinia';

interface Preferences {
  theme: string;
  sound: boolean;
  vibration: boolean;
}

export const useSessionStore = defineStore('session', {
  state: () => ({
    user: null as null | { id: number; name: string },
    token: null as string | null,
    preferences: {
      theme: 'dark',
      sound: true,
      vibration: true
    } as Preferences
  }),
  actions: {
    // TODO: methods to update preferences and authentication
  }
});
