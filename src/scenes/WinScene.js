import Phaser from 'phaser';

export class WinScene extends Phaser.Scene {
  constructor() {
    super('win');
  }

  init(data) {
    this.score = data.score ?? 0;
    this.collected = data.collected ?? 0;
    this.total = data.total ?? 0;
    this.lives = data.lives ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x1b4332);

    this.add.text(width / 2, 140, '¡VICTORIA!', {
      fontSize: '64px',
      fontStyle: 'bold',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.add.text(
      width / 2,
      255,
      `Llegaste a la meta\nPuntaje: ${this.score}\nObjetos: ${this.collected}/${this.total}\nVidas restantes: ${this.lives}`,
      {
        fontSize: '30px',
        align: 'center',
        color: '#d8f3dc'
      }
    ).setOrigin(0.5);

    this.add.text(width / 2, 430, 'R: Jugar de nuevo | M: Menú', {
      fontSize: '30px',
      color: '#ffd166'
    }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-M', () => this.scene.start('menu'));
    this.input.once('pointerdown', () => this.scene.start('menu'));
  }
}
