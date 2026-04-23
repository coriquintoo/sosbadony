export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('game-over');
  }

  init(data) {
    this.score = data.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    this.registry.get('soundManager')?.attachScene?.(this);

    this.add.rectangle(width / 2, height / 2, width, height, 0x6a040f);
    this.add
      .text(width / 2, 160, 'GAME OVER', {
        fontFamily: '"Press Start 2P"',
        fontSize: '32px',
        color: '#ffccd5'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 250, `PUNTAJE: ${this.score}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 340, 'REINTENTAR', {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#ffe066',
        backgroundColor: '#9d0208',
        padding: { x: 12, y: 10 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('game', { score: 0 });
      });

    this.add
      .text(width / 2, 395, 'MENU', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ffffff'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('start');
      });
  }
}
