export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d3557);

    this.add
      .text(width / 2, 130, 'PLATAFORMAS BÁSICO', {
        fontSize: '52px',
        color: '#f1faee',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        280,
        'Mover: ← → o A/D\nSaltar: ↑, W o ESPACIO\nJuntá todos los objetos que puedas\ny llegá a la bandera final',
        {
          fontSize: '28px',
          color: '#a8dadc',
          align: 'center',
          lineSpacing: 10
        }
      )
      .setOrigin(0.5);

    const playText = this.add
      .text(width / 2, 520, 'JUGAR', {
        fontSize: '42px',
        color: '#1d3557',
        backgroundColor: '#ffd166',
        padding: { x: 24, y: 12 },
        fontStyle: 'bold'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playText.on('pointerdown', () => this.scene.start('game'));

    this.input.keyboard.once('keydown-SPACE', () => this.scene.start('game'));
  }
}
