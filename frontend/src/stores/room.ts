import { defineStore } from 'pinia';

export type Role = 'X' | 'O' | 'Spectator';

export const useRoomStore = defineStore('room', {
  state: () => ({
    roomId: '' as string,
    role: 'Spectator' as Role,
    users: [] as Array<{ id: number; name: string; role: Role }>
  }),
  actions: {
    // TODO: join/leave room, manage presence
  }
});
