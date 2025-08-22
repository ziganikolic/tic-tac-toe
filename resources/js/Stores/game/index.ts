import { useRoomStore } from '@/Stores/room';
import { defineStore } from 'pinia';

export interface MovePayload {
    mini: { row: number; col: number };
    cell: { row: number; col: number };
}

export const useGameStore = defineStore('game', {
    state: () => ({
        state: null as any,
        pending: false,
        error: null as string | null,
    }),
    actions: {
        async fetchState(roomId: string) {
            this.pending = true;
            this.error = null;
            try {
                const res = await fetch(`/api/rooms/${roomId}`);
                this.state = await res.json();
            } catch (e: any) {
                this.error = e.message;
            } finally {
                this.pending = false;
            }
        },
        async submitMove(payload: MovePayload) {
            const room = useRoomStore();
            if (!room.roomId) return;
            this.pending = true;
            this.error = null;
            try {
                const res = await fetch(`/api/rooms/${room.roomId}/move`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                const data = await res.json();
                if (!res.ok) {
                    this.error = data.message || 'Invalid move';
                    return;
                }
                this.state = data;
            } catch (e: any) {
                this.error = e.message;
            } finally {
                this.pending = false;
            }
        },
        applyStateSync(state: any) {
            this.state = state;
        },
        playLocalMove(payload: MovePayload & { player?: 'X' | 'O' }) {
            // For hot-seat play without server
            if (!this.state) {
                this.state = this.createInitialState();
            }

            const player = payload.player || this.state.current;
            const move = { ...payload, player };

            // Validate move
            if (!this.isValidMove(move)) {
                return;
            }

            // Apply move
            this.applyMoveToState(move);
        },

        createInitialState() {
            const size = 3;
            const boards = [];
            for (let r = 0; r < size; r++) {
                boards[r] = [];
                for (let c = 0; c < size; c++) {
                    const cells = [];
                    for (let i = 0; i < size; i++) {
                        for (let j = 0; j < size; j++) {
                            cells.push({ row: i, col: j, value: null });
                        }
                    }
                    boards[r][c] = {
                        size: size,
                        cells: cells,
                        winner: null,
                        isClosed: false,
                    };
                }
            }

            return {
                rules: {
                    megaSize: size,
                    miniSize: size,
                    kMini: 3,
                    kMega: 3,
                },
                mega: {
                    size: size,
                    boards: boards,
                    winner: null,
                    activeMini: null,
                },
                current: 'X',
                moveIndex: 0,
                over: false,
                moves: [],
            };
        },

        isValidMove(move: any): boolean {
            if (this.state.over) return false;

            const { mini, cell } = move;
            const targetMini = this.state.mega.boards[mini.row]?.[mini.col];
            if (!targetMini || targetMini.isClosed) return false;

            const targetCell = targetMini.cells.find(
                c => c.row === cell.row && c.col === cell.col
            );
            if (!targetCell || targetCell.value) return false;

            // Check active mini constraint
            const activeMini = this.state.mega.activeMini;
            if (activeMini && (activeMini.row !== mini.row || activeMini.col !== mini.col)) {
                return false;
            }

            return true;
        },

        applyMoveToState(move: any) {
            const { mini, cell, player } = move;
            
            // Update cell
            const targetMini = this.state.mega.boards[mini.row][mini.col];
            const targetCell = targetMini.cells.find(
                c => c.row === cell.row && c.col === cell.col
            );
            targetCell.value = player;

            // Check mini winner
            targetMini.winner = this.checkWinner(targetMini.cells);
            if (targetMini.winner || this.isBoardFull(targetMini.cells)) {
                targetMini.isClosed = true;
            }

            // Check mega winner
            const megaMatrix = this.state.mega.boards.map(row => 
                row.map(mini => mini.winner)
            );
            this.state.mega.winner = this.checkWinnerFromMatrix(megaMatrix);
            if (this.state.mega.winner) {
                this.state.over = true;
            }

            // Update active mini
            const nextMini = this.state.mega.boards[cell.row][cell.col];
            this.state.mega.activeMini = nextMini.isClosed ? null : { row: cell.row, col: cell.col };

            // Update turn
            if (!this.state.over) {
                this.state.current = this.state.current === 'X' ? 'O' : 'X';
            }

            this.state.moveIndex++;
            this.state.moves.push(move);
        },

        checkWinner(cells: any[]): string | null {
            const size = 3;
            const matrix = Array(size).fill(null).map(() => Array(size).fill(null));
            
            cells.forEach(cell => {
                matrix[cell.row][cell.col] = cell.value;
            });

            return this.checkWinnerFromMatrix(matrix);
        },

        checkWinnerFromMatrix(matrix: any[][]): string | null {
            const size = matrix.length;

            // Check rows
            for (let r = 0; r < size; r++) {
                if (matrix[r][0] && matrix[r].every(cell => cell === matrix[r][0])) {
                    return matrix[r][0];
                }
            }

            // Check columns
            for (let c = 0; c < size; c++) {
                if (matrix[0][c] && matrix.every(row => row[c] === matrix[0][c])) {
                    return matrix[0][c];
                }
            }

            // Check diagonals
            if (matrix[0][0] && matrix.every((row, i) => row[i] === matrix[0][0])) {
                return matrix[0][0];
            }

            if (matrix[0][size-1] && matrix.every((row, i) => row[size-1-i] === matrix[0][size-1])) {
                return matrix[0][size-1];
            }

            return null;
        },

        isBoardFull(cells: any[]): boolean {
            return cells.every(cell => cell.value !== null);
        },
    },
});
