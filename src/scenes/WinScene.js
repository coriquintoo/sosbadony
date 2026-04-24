export class WinScene extends Phaser.Scene {
  constructor() {
    super('win');
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.collected = data?.collected ?? 0;
    this.totalCollectibles = data?.totalCollectibles ?? 0;
    this.lives = data?.lives ?? 0;
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1b4332);

    this.add
      .text(width / 2, 170, '¡VICTORIA!', {
        fontSize: '86px',
        color: '#ffffff',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(
        width / 2,
        330,
        `Llegaste a la meta\nPuntaje: ${this.score}\nObjetos: ${this.collected}/${this.totalCollectibles}\nVidas restantes: ${this.lives}`,
        {
          fontSize: '34px',
          color: '#d8f3dc',
          align: 'center',
          lineSpacing: 10
        }
      )
      .setOrigin(0.5);

    this.add
      .text(width / 2, 560, 'Jugar otra vez', {
        fontSize: '42px',
        color: '#1d3557',
        backgroundColor: '#ffd166',
        padding: { x: 24, y: 12 },
        fontStyle: 'bold'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('game'));

    this.add
      .text(width / 2, 625, 'Menú principal', {
        fontSize: '28px',
        color: '#ffffff'
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('menu'));
  }
}
