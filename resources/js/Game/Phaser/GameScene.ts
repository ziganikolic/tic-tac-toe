import Phaser from 'phaser'
import { useGameStore } from '@/Stores/game'

export default class GameScene extends Phaser.Scene {
  private store = useGameStore()
  private boardSize = 0

  constructor() {
    super({ key: 'game' })
  }

  create() {
    this.boardSize = Math.min(this.scale.width, this.scale.height)
    this.drawGrid()

    this.scale.on('resize', (gameSize: Phaser.Structs.Size) => {
      this.boardSize = Math.min(gameSize.width, gameSize.height)
      this.cameras.main.setViewport(0, 0, this.boardSize, this.boardSize)
      this.drawGrid()
    })

    this.input.on('pointerdown', this.handlePointer, this)
  }

  private drawGrid() {
    this.cameras.main.setBackgroundColor('#ffffff')
    const g = this.add.graphics()
    g.clear()
    const cell = this.boardSize / 9
    for (let i = 1; i < 9; i++) {
      const thick = i % 3 === 0 ? 4 : 1
      g.lineStyle(thick, 0x000000, 1)
      g.moveTo(i * cell, 0)
      g.lineTo(i * cell, this.boardSize)
      g.moveTo(0, i * cell)
      g.lineTo(this.boardSize, i * cell)
    }
    g.strokePath()
  }

  private handlePointer(pointer: Phaser.Input.Pointer) {
    const cell = this.boardSize / 9
    const miniRow = Math.floor(pointer.y / (cell * 3))
    const miniCol = Math.floor(pointer.x / (cell * 3))
    const cellRow = Math.floor((pointer.y % (cell * 3)) / cell)
    const cellCol = Math.floor((pointer.x % (cell * 3)) / cell)
    this.store.submitMove({
      mini: { row: miniRow, col: miniCol },
      cell: { row: cellRow, col: cellCol },
    })
  }
}
