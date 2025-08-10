import { defineStore } from 'pinia';

// These interfaces mirror backend data models
export interface Cell {
  row: number;
  col: number;
  value: 'X' | 'O' | null;
}

export interface MiniBoard {
  size: number;
  cells: Cell[];
  winner: 'X' | 'O' | 'DRAW' | null;
  isClosed: boolean;
}

export interface GameState {
  rules: { megaSize: number; miniSize: number; kMini: number; kMega: number };
  mega: { size: number; boards: MiniBoard[]; winner: 'X' | 'O' | null; activeMini: { row: number; col: number } | null };
  boards: MiniBoard[];
  current: 'X' | 'O';
  moveIndex: number;
  startedAt: number;
  lastMoveAt: number | null;
  xUserId?: number;
  oUserId?: number;
  over?: boolean;
}

export interface Move {
  mini: { row: number; col: number };
  cell: { row: number; col: number };
  moveIndex: number;
}

export const useGameStore = defineStore('game', {
  state: () => ({
    state: null as GameState | null,
    pending: false,
    error: '' as string | null
  }),
  actions: {
    // TODO: implement local and online move submission, handle state_sync
    async submitMove(move: Move) {
      // placeholder
    }
  }
});
