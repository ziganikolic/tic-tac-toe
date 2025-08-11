import { useGameStore } from '@/Stores/game';
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    private store = useGameStore();
    private boardSize = 0;
    private marks!: Phaser.GameObjects.Graphics;
    private activeMini: { row: number; col: number } | null = null;
    private activeHighlight!: Phaser.GameObjects.Graphics;
    private grid!: Phaser.GameObjects.Graphics;

    constructor() {
        super({ key: 'game' });
    }

    create() {
        this.boardSize = Math.min(this.scale.width, this.scale.height);
        this.grid = this.add.graphics();
        this.marks = this.add.graphics();
        this.activeHighlight = this.add.graphics();
        this.drawGrid();
        this.drawMarks();

        this.store.$subscribe(() => {
            this.drawMarks();
        });

        this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
            this.boardSize = Math.min(gameSize.width, gameSize.height);
            this.cameras.main.setViewport(0, 0, this.boardSize, this.boardSize);
            this.drawGrid();
            this.drawMarks();
            this.highlightActiveMini();
        });

        this.input.on('pointerdown', this.handlePointer, this);
    }

    private drawGrid() {
        this.cameras.main.setBackgroundColor('#ffffff');
        const g = this.grid;
        g.clear();
        const cell = this.boardSize / 9;
        for (let i = 1; i < 9; i++) {
            const thick = i % 3 === 0 ? 4 : 1;
            g.lineStyle(thick, 0x000000, 1);
            g.moveTo(i * cell, 0);
            g.lineTo(i * cell, this.boardSize);
            g.moveTo(0, i * cell);
            g.lineTo(this.boardSize, i * cell);
        }
        g.strokePath();
    }

    private handlePointer(pointer: Phaser.Input.Pointer) {
        const cell = this.boardSize / 9;
        const miniRow = Math.floor(pointer.y / (cell * 3));
        const miniCol = Math.floor(pointer.x / (cell * 3));
        const cellRow = Math.floor((pointer.y % (cell * 3)) / cell);
        const cellCol = Math.floor((pointer.x % (cell * 3)) / cell);
        if (this.activeMini && (miniRow !== this.activeMini.row || miniCol !== this.activeMini.col)) {
            return;
        }

        this.store.playLocalMove({
            mini: { row: miniRow, col: miniCol },
            cell: { row: cellRow, col: cellCol },
        });

        this.activeMini = { row: cellRow, col: cellCol };
        this.highlightActiveMini();
        this.drawMarks();
    }

    private drawMarks() {
        this.marks.clear();
        const cell = this.boardSize / 9;
        const moves = this.store.state?.moves || [];
        moves.forEach((move: any) => {
            const x = (move.mini.col * 3 + move.cell.col) * cell;
            const y = (move.mini.row * 3 + move.cell.row) * cell;
            if (move.player === 'X') {
                this.marks.lineStyle(4, 0xe11d48, 1);
                this.marks.beginPath();
                this.marks.moveTo(x + cell * 0.2, y + cell * 0.2);
                this.marks.lineTo(x + cell * 0.8, y + cell * 0.8);
                this.marks.moveTo(x + cell * 0.8, y + cell * 0.2);
                this.marks.lineTo(x + cell * 0.2, y + cell * 0.8);
                this.marks.strokePath();
            } else if (move.player === 'O') {
                this.marks.lineStyle(4, 0x2563eb, 1);
                this.marks.strokeCircle(x + cell / 2, y + cell / 2, cell * 0.3);
            }
        });
    }

    private highlightActiveMini() {
        this.activeHighlight.clear();
        if (!this.activeMini) return;
        const cell = this.boardSize / 9;
        const x = this.activeMini.col * cell * 3;
        const y = this.activeMini.row * cell * 3;
        this.activeHighlight.fillStyle(0x2563eb, 0.1);
        this.activeHighlight.fillRect(x, y, cell * 3, cell * 3);
    }
}
