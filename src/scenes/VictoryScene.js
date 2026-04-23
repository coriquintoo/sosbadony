export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('victory');
  }

  init(data) {
    this.score = data.score ?? 0;
  }

  create() {
    const { width, height } = this.scale;
    this.registry.get('soundManager')?.attachScene?.(this);

    this.add.rectangle(width / 2, height / 2, width, height, 0x003049);
    this.add
      .text(width / 2, 120, '¡VICTORIA!', {
        fontFamily: '"Press Start 2P"',
        fontSize: '34px',
        color: '#fcbf49'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 190, 'PLANTA POTABILIZADORA\nASEGURADA', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#eae2b7',
        align: 'center'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 285, `PUNTAJE FINAL: ${this.score}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '17px',
        color: '#ffffff'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 360, 'VOLVER AL INICIO', {
        fontFamily: '"Press Start 2P"',
        fontSize: '16px',
        color: '#ffffff',
        backgroundColor: '#1d3557',
        padding: { x: 10, y: 8 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('start');
      });
  }
}
