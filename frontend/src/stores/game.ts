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
    startLocalGame() {
      const size = 3;
      const cells = Array.from({ length: size * size }).map((_, i) => ({
        row: Math.floor(i / size),
        col: i % size,
        value: null
      }));
      const board: MiniBoard = {
        size,
        cells,
        winner: null,
        isClosed: false
      };
      this.state = {
        rules: { megaSize: 1, miniSize: size, kMini: 3, kMega: 3 },
        mega: { size: 1, boards: [board], winner: null, activeMini: null },
        boards: [board],
        current: 'X',
        moveIndex: 0,
        startedAt: Date.now(),
        lastMoveAt: null,
        over: false
      };
    },
    async submitMove(move: Move) {
      if (!this.state) return;
      const board = this.state.boards[0];
      const idx = move.cell.row * board.size + move.cell.col;
      const cell = board.cells[idx];
      if (cell.value || this.state.over) return;

      cell.value = this.state.current;
      this.state.current = this.state.current === 'X' ? 'O' : 'X';
      this.state.moveIndex++;

      const winner = checkWinner(board);
      if (winner) {
        board.winner = winner;
        this.state.mega.winner = winner;
        this.state.over = true;
      } else if (board.cells.every(c => c.value)) {
        board.winner = 'DRAW';
        this.state.over = true;
      }
    }
  }
});

function checkWinner(board: MiniBoard): 'X' | 'O' | null {
  const lines: string[][] = [];
  const size = board.size;
  const getVal = (r: number, c: number) => board.cells[r * size + c].value;

  for (let r = 0; r < size; r++) {
    lines.push(Array.from({ length: size }, (_, c) => getVal(r, c)) as string[]);
  }
  for (let c = 0; c < size; c++) {
    lines.push(Array.from({ length: size }, (_, r) => getVal(r, c)) as string[]);
  }
  lines.push(Array.from({ length: size }, (_, i) => getVal(i, i)) as string[]);
  lines.push(Array.from({ length: size }, (_, i) => getVal(i, size - 1 - i)) as string[]);

  for (const line of lines) {
    if (line.every(v => v === 'X')) return 'X';
    if (line.every(v => v === 'O')) return 'O';
  }
  return null;
}
