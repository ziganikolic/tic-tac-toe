import { defineStore } from 'pinia'
import { useRoomStore } from '@/Stores/room'

export interface MovePayload {
  mini: { row: number; col: number }
  cell: { row: number; col: number }
}

export const useGameStore = defineStore('game', {
  state: () => ({
    state: null as any,
    pending: false,
    error: null as string | null,
  }),
  actions: {
    async fetchState(roomId: string) {
      this.pending = true
      this.error = null
      try {
        const res = await fetch(`/api/rooms/${roomId}`)
        this.state = await res.json()
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.pending = false
      }
    },
    async submitMove(payload: MovePayload) {
      const room = useRoomStore()
      if (!room.roomId) return
      this.pending = true
      this.error = null
      try {
        const res = await fetch(`/api/rooms/${room.roomId}/move`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) {
          this.error = data.message || 'Invalid move'
          return
        }
        this.state = data
      } catch (e: any) {
        this.error = e.message
      } finally {
        this.pending = false
      }
    },
    applyStateSync(state: any) {
      this.state = state
    },
    playLocalMove(payload: MovePayload & { player?: 'X' | 'O' }) {
      // For hot-seat play without server
      this.state = this.state || {}
      if (!this.state.moves) this.state.moves = []
      this.state.moves.push(payload)
    },
  },
})
