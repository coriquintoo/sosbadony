export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.collected = data?.collected ?? 0;
    this.totalCollectibles = data?.totalCollectibles ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x4a0d1b);

    this.add
      .text(width / 2, 180, 'GAME OVER', {
        fontSize: '88px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 320, `Puntaje: ${this.score}\nObjetos: ${this.collected}/${this.totalCollectibles}`, {
        fontSize: '34px',
        color: '#ffd6a5',
        align: 'center',
        lineSpacing: 10
      })
      .setOrigin(0.5);

    const restart = this.add
      .text(width / 2, 520, 'Reintentar', {
        fontSize: '42px',
        color: '#1d3557',
        backgroundColor: '#ffd166',
        padding: { x: 22, y: 10 },
        fontStyle: 'bold'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    restart.on('pointerdown', () => this.scene.start('game'));

    this.add
      .text(width / 2, 590, 'Volver al menú', {
        fontSize: '28px',
        color: '#ffffff'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('menu'));
  }
}
