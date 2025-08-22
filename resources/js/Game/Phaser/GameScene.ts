import { useGameStore } from '@/Stores/game';
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    private store = useGameStore();
    private boardSize = 0;
    private cellSize = 0;
    private padding = 20;
    
    // Game objects
    private backgroundGrid!: Phaser.GameObjects.Graphics;
    private miniGrids!: Phaser.GameObjects.Graphics;
    private marks!: Phaser.GameObjects.Graphics;
    private highlights!: Phaser.GameObjects.Graphics;
    private miniWinners!: Phaser.GameObjects.Graphics;
    private hoverHighlight!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'game' });
    }

    create() {
        this.setupCanvas();
        this.createGameObjects();
        this.setupEventListeners();
        this.render();
    }

    private setupCanvas() {
        const availableWidth = this.scale.width - this.padding * 2;
        const availableHeight = this.scale.height - this.padding * 2;
        this.boardSize = Math.min(availableWidth, availableHeight);
        this.cellSize = this.boardSize / 9;
        
        // Set up the camera
        this.cameras.main.centerOn(this.boardSize / 2 + this.padding, this.boardSize / 2 + this.padding);
    }

    private createGameObjects() {
        this.backgroundGrid = this.add.graphics();
        this.miniGrids = this.add.graphics();
        this.highlights = this.add.graphics();
        this.marks = this.add.graphics();
        this.miniWinners = this.add.graphics();
        this.hoverHighlight = this.add.graphics();
    }

    private setupEventListeners() {
        // Store subscription
        this.store.$subscribe(() => {
            this.render();
        });

        // Resize handling
        this.scale.on('resize', () => {
            this.setupCanvas();
            this.render();
        });

        // Click handling
        this.input.on('pointerdown', this.handleClick, this);
        this.input.on('pointermove', this.handleHover, this);
    }

    private render() {
        this.drawBackground();
        this.drawMiniBoards();
        this.drawHighlights();
        this.drawMarks();
        this.drawMiniWinners();
        this.drawHoverHighlight();
    }

    private drawBackground() {
        this.backgroundGrid.clear();
        
        // Detect dark mode from document
        const isDarkMode = document.documentElement.classList.contains('dark');
        
        // Set background color based on theme
        this.cameras.main.setBackgroundColor(isDarkMode ? '#0f172a' : '#f8fafc');
        
        // Draw main board outline
        this.backgroundGrid.lineStyle(6, isDarkMode ? 0xf1f5f9 : 0x1e293b, 1);
        this.backgroundGrid.strokeRect(
            this.padding, 
            this.padding, 
            this.boardSize, 
            this.boardSize
        );
        
        // Draw mega-board grid lines (thick lines separating the 3x3 mini-boards)
        this.backgroundGrid.lineStyle(4, isDarkMode ? 0xe2e8f0 : 0x334155, 1);
        for (let i = 1; i < 3; i++) {
            const pos = this.padding + i * (this.boardSize / 3);
            // Vertical lines
            this.backgroundGrid.moveTo(pos, this.padding);
            this.backgroundGrid.lineTo(pos, this.padding + this.boardSize);
            // Horizontal lines
            this.backgroundGrid.moveTo(this.padding, pos);
            this.backgroundGrid.lineTo(this.padding + this.boardSize, pos);
        }
        this.backgroundGrid.strokePath();
    }

    private drawMiniBoards() {
        this.miniGrids.clear();
        
        const isDarkMode = document.documentElement.classList.contains('dark');
        this.miniGrids.lineStyle(1, isDarkMode ? 0x94a3b8 : 0x64748b, 0.6);
        
        // Draw thin grid lines for individual cells within mini-boards
        for (let miniRow = 0; miniRow < 3; miniRow++) {
            for (let miniCol = 0; miniCol < 3; miniCol++) {
                const miniX = this.padding + miniCol * (this.boardSize / 3);
                const miniY = this.padding + miniRow * (this.boardSize / 3);
                const miniSize = this.boardSize / 3;
                
                // Draw mini-board cell lines
                for (let i = 1; i < 3; i++) {
                    const cellPos = i * (miniSize / 3);
                    // Vertical lines within mini-board
                    this.miniGrids.moveTo(miniX + cellPos, miniY);
                    this.miniGrids.lineTo(miniX + cellPos, miniY + miniSize);
                    // Horizontal lines within mini-board
                    this.miniGrids.moveTo(miniX, miniY + cellPos);
                    this.miniGrids.lineTo(miniX + miniSize, miniY + cellPos);
                }
            }
        }
        this.miniGrids.strokePath();
    }

    private drawHighlights() {
        this.highlights.clear();
        
        if (!this.store.state?.mega?.activeMini) return;
        
        const activeMini = this.store.state.mega.activeMini;
        const miniX = this.padding + activeMini.col * (this.boardSize / 3);
        const miniY = this.padding + activeMini.row * (this.boardSize / 3);
        const miniSize = this.boardSize / 3;
        
        // Highlight active mini-board with a subtle glow
        this.highlights.fillStyle(0x3b82f6, 0.15);
        this.highlights.fillRect(miniX, miniY, miniSize, miniSize);
        
        // Add border to active mini-board
        this.highlights.lineStyle(3, 0x3b82f6, 0.7);
        this.highlights.strokeRect(miniX, miniY, miniSize, miniSize);
    }

    private drawMarks() {
        this.marks.clear();
        
        if (!this.store.state?.mega?.boards) return;
        
        const boards = this.store.state.mega.boards;
        
        for (let miniRow = 0; miniRow < 3; miniRow++) {
            for (let miniCol = 0; miniCol < 3; miniCol++) {
                const miniBoard = boards[miniRow][miniCol];
                if (!miniBoard) continue;
                
                const miniX = this.padding + miniCol * (this.boardSize / 3);
                const miniY = this.padding + miniRow * (this.boardSize / 3);
                
                // Draw marks in this mini-board
                for (const cell of miniBoard.cells) {
                    if (!cell.value) continue;
                    
                    const cellX = miniX + cell.col * this.cellSize;
                    const cellY = miniY + cell.row * this.cellSize;
                    
                    this.drawMark(cell.value, cellX, cellY, this.cellSize);
                }
            }
        }
    }

    private drawMark(player: string, x: number, y: number, size: number) {
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const markSize = size * 0.6;
        
        if (player === 'X') {
            this.marks.lineStyle(4, 0xdc2626, 1);
            const offset = markSize / 2;
            this.marks.moveTo(centerX - offset, centerY - offset);
            this.marks.lineTo(centerX + offset, centerY + offset);
            this.marks.moveTo(centerX + offset, centerY - offset);
            this.marks.lineTo(centerX - offset, centerY + offset);
            this.marks.strokePath();
        } else if (player === 'O') {
            this.marks.lineStyle(4, 0x2563eb, 1);
            this.marks.strokeCircle(centerX, centerY, markSize / 2);
        }
    }

    private drawMiniWinners() {
        this.miniWinners.clear();
        
        if (!this.store.state?.mega?.boards) return;
        
        const boards = this.store.state.mega.boards;
        
        for (let miniRow = 0; miniRow < 3; miniRow++) {
            for (let miniCol = 0; miniCol < 3; miniCol++) {
                const miniBoard = boards[miniRow][miniCol];
                if (!miniBoard?.winner) continue;
                
                const miniX = this.padding + miniCol * (this.boardSize / 3);
                const miniY = this.padding + miniRow * (this.boardSize / 3);
                const miniSize = this.boardSize / 3;
                const centerX = miniX + miniSize / 2;
                const centerY = miniY + miniSize / 2;
                
                // Draw semi-transparent background
                this.miniWinners.fillStyle(miniBoard.winner === 'X' ? 0xdc2626 : 0x2563eb, 0.2);
                this.miniWinners.fillRect(miniX, miniY, miniSize, miniSize);
                
                // Draw large winner symbol
                const winnerSize = miniSize * 0.7;
                if (miniBoard.winner === 'X') {
                    this.miniWinners.lineStyle(12, 0xdc2626, 0.9);
                    const offset = winnerSize / 2;
                    this.miniWinners.moveTo(centerX - offset, centerY - offset);
                    this.miniWinners.lineTo(centerX + offset, centerY + offset);
                    this.miniWinners.moveTo(centerX + offset, centerY - offset);
                    this.miniWinners.lineTo(centerX - offset, centerY + offset);
                    this.miniWinners.strokePath();
                } else if (miniBoard.winner === 'O') {
                    this.miniWinners.lineStyle(12, 0x2563eb, 0.9);
                    this.miniWinners.strokeCircle(centerX, centerY, winnerSize / 2);
                }
            }
        }
    }

    private handleClick(pointer: Phaser.Input.Pointer) {
        if (this.store.state?.over) return;
        
        // Convert screen coordinates to grid coordinates
        const clickX = pointer.x - this.padding;
        const clickY = pointer.y - this.padding;
        
        if (clickX < 0 || clickY < 0 || clickX > this.boardSize || clickY > this.boardSize) {
            return;
        }
        
        const miniCol = Math.floor(clickX / (this.boardSize / 3));
        const miniRow = Math.floor(clickY / (this.boardSize / 3));
        
        const cellCol = Math.floor((clickX % (this.boardSize / 3)) / this.cellSize);
        const cellRow = Math.floor((clickY % (this.boardSize / 3)) / this.cellSize);
        
        // Validate the move
        if (!this.isValidMove(miniRow, miniCol, cellRow, cellCol)) {
            return;
        }
        
        // Make the move
        this.store.playLocalMove({
            mini: { row: miniRow, col: miniCol },
            cell: { row: cellRow, col: cellCol },
        });
    }

    private isValidMove(miniRow: number, miniCol: number, cellRow: number, cellCol: number): boolean {
        // Check if game is over
        if (this.store.state?.over) return false;
        
        // Check active mini constraint
        const activeMini = this.store.state?.mega?.activeMini;
        if (activeMini && (activeMini.row !== miniRow || activeMini.col !== miniCol)) {
            return false;
        }
        
        // Check if mini-board exists and is not closed
        const targetMini = this.store.state?.mega?.boards?.[miniRow]?.[miniCol];
        if (!targetMini || targetMini.isClosed) return false;
        
        // Check if cell is empty
        const targetCell = targetMini.cells?.find(c => c.row === cellRow && c.col === cellCol);
        return targetCell && !targetCell.value;
    }

    private hoverCell: { miniRow: number; miniCol: number; cellRow: number; cellCol: number } | null = null;

    private handleHover(pointer: Phaser.Input.Pointer) {
        if (this.store.state?.over) {
            this.hoverCell = null;
            return;
        }
        
        const clickX = pointer.x - this.padding;
        const clickY = pointer.y - this.padding;
        
        if (clickX < 0 || clickY < 0 || clickX > this.boardSize || clickY > this.boardSize) {
            this.hoverCell = null;
            return;
        }
        
        const miniCol = Math.floor(clickX / (this.boardSize / 3));
        const miniRow = Math.floor(clickY / (this.boardSize / 3));
        const cellCol = Math.floor((clickX % (this.boardSize / 3)) / this.cellSize);
        const cellRow = Math.floor((clickY % (this.boardSize / 3)) / this.cellSize);
        
        if (this.isValidMove(miniRow, miniCol, cellRow, cellCol)) {
            this.hoverCell = { miniRow, miniCol, cellRow, cellCol };
        } else {
            this.hoverCell = null;
        }
    }

    private drawHoverHighlight() {
        this.hoverHighlight.clear();
        
        if (!this.hoverCell) return;
        
        const { miniRow, miniCol, cellRow, cellCol } = this.hoverCell;
        const miniX = this.padding + miniCol * (this.boardSize / 3);
        const miniY = this.padding + miniRow * (this.boardSize / 3);
        const cellX = miniX + cellCol * this.cellSize;
        const cellY = miniY + cellRow * this.cellSize;
        
        // Draw subtle hover highlight
        const isDarkMode = document.documentElement.classList.contains('dark');
        this.hoverHighlight.fillStyle(isDarkMode ? 0x64748b : 0x94a3b8, 0.3);
        this.hoverHighlight.fillRect(cellX, cellY, this.cellSize, this.cellSize);
        
        // Draw preview of next player's mark
        const nextPlayer = this.store.state?.current || 'X';
        const centerX = cellX + this.cellSize / 2;
        const centerY = cellY + this.cellSize / 2;
        const markSize = this.cellSize * 0.4;
        
        if (nextPlayer === 'X') {
            this.hoverHighlight.lineStyle(2, 0xdc2626, 0.5);
            const offset = markSize / 2;
            this.hoverHighlight.moveTo(centerX - offset, centerY - offset);
            this.hoverHighlight.lineTo(centerX + offset, centerY + offset);
            this.hoverHighlight.moveTo(centerX + offset, centerY - offset);
            this.hoverHighlight.lineTo(centerX - offset, centerY + offset);
            this.hoverHighlight.strokePath();
        } else {
            this.hoverHighlight.lineStyle(2, 0x2563eb, 0.5);
            this.hoverHighlight.strokeCircle(centerX, centerY, markSize / 2);
        }
    }
}
