import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  init(data) {
    this.score = data.score ?? 0;
    this.collected = data.collected ?? 0;
    this.total = data.total ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x4a0404);

    this.add.text(width / 2, 150, 'GAME OVER', {
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(width / 2, 250, `Puntaje: ${this.score}\nObjetos: ${this.collected}/${this.total}`, {
      fontSize: '30px',
      align: 'center',
      color: '#ffe5ec'
    }).setOrigin(0.5);

    this.add.text(width / 2, 380, 'R: Reintentar | M: Menú', {
      fontSize: '30px',
      color: '#ffd166'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-M', () => this.scene.start('menu'));
    this.input.once('pointerdown', () => this.scene.start('game'));
  }
}
