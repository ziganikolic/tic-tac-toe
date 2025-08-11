// Specification for Ultimate Tic-Tac-Toe game state and rules.
//
// GameState {
//   rules: {
//     megaSize: number,
//     miniSize: number,
//     kMini: number,
//     kMega: number
//   },
//   mega: {
//     size: number,
//     boards: MiniBoard[],
//     winner: string | null,
//     activeMini: { row: number, col: number } | null
//   },
//   current: 'X' | 'O',
//   moveIndex: number,
//   startedAt: string,
//   lastMoveAt: string | null,
//   xUserId?: number,
//   oUserId?: number,
//   over?: boolean
// }
//
// MiniBoard {
//   size: number,
//   cells: { row: number, col: number, value: 'X' | 'O' | null }[],
//   winner: 'X' | 'O' | 'DRAW' | null,
//   isClosed: boolean
// }
//
// Move {
//   mini: { row: number, col: number },
//   cell: { row: number, col: number },
//   moveIndex: state.moveIndex + 1
// }
//
// Rules:
// - 3x3 mega board composed of 3x3 mini boards.
// - "Send-to" mechanic directs next move to cell position (r, c).
// - Free-move allowed when target mini board is closed.
// - kMini = 3 (three in a row wins mini board).
// - kMega = 3 (three mini wins take the mega board).
//
// Edge cases:
// - If active mini becomes closed, next player gets a free move.
// - Handle draws on mini and mega boards.
// - State may be restored on reconnect from Redis.
