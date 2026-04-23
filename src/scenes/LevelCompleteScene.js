export class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super('level-complete');
  }

  init(data) {
    this.score = data.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    this.registry.get('soundManager')?.attachScene?.(this);
    this.add.rectangle(width / 2, height / 2, width, height, 0x1b4332);

    this.add
      .text(width / 2, 170, 'NIVEL COMPLETADO', {
        fontFamily: '"Press Start 2P"',
        fontSize: '24px',
        color: '#d8f3dc'
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
      .text(width / 2, 340, 'CONTINUAR', {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#ffd166',
        backgroundColor: '#2d6a4f',
        padding: { x: 12, y: 10 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('victory', { score: this.score });
      });
  }
}
