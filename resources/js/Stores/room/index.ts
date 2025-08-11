import { defineStore } from 'pinia'

export type Role = 'X' | 'O' | 'Spectator'

export const useRoomStore = defineStore('room', {
  state: () => ({
    roomId: null as string | null,
    role: 'Spectator' as Role,
    users: [] as any[],
  }),
  actions: {
    async joinRoom(id: string) {
      this.roomId = id
      await fetch(`/api/rooms/${id}/join`, { method: 'POST' })
    },
    async leaveRoom() {
      if (!this.roomId) return
      await fetch(`/api/rooms/${this.roomId}/leave`, { method: 'POST' })
      this.roomId = null
      this.role = 'Spectator'
      this.users = []
    },
  },
})
