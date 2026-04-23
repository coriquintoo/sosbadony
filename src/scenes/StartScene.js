import { SoundManager } from '../systems/SoundManager.js';

export class StartScene extends Phaser.Scene {
  constructor() {
    super('start');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1d3557);
    this.add.rectangle(width / 2, height - 70, width, 140, 0x457b9d);

    this.add
      .text(width / 2, 80, 'DONY Y LA PLANTA\nPOTABILIZADORA', {
        fontFamily: '"Press Start 2P"',
        fontSize: '22px',
        color: '#f1faee',
        align: 'center'
      })
      .setOrigin(0.5);

    // SOSBA placeholder logo.
    this.add.rectangle(width / 2, 210, 260, 86, 0xf1faee).setStrokeStyle(4, 0x1d3557);
    this.add
      .text(width / 2, 210, 'SOSBA\nLOGO', {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#1d3557',
        align: 'center'
      })
      .setOrigin(0.5);

    const playButton = this.add
      .text(width / 2, 330, 'JUGAR', {
        fontFamily: '"Press Start 2P"',
        fontSize: '28px',
        color: '#ffb703',
        backgroundColor: '#023047',
        padding: { x: 16, y: 12 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const soundManager = this.registry.get('soundManager') || new SoundManager(this);
    if (soundManager.attachScene) {
      soundManager.attachScene(this);
    }
    this.registry.set('soundManager', soundManager);

    const musicToggle = this.add
      .text(width / 2, 410, 'MUSICA: ON', {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#f1faee',
        backgroundColor: '#1d3557',
        padding: { x: 12, y: 8 }
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    musicToggle.on('pointerdown', () => {
      const enabled = soundManager.toggle();
      musicToggle.setText(`MUSICA: ${enabled ? 'ON' : 'OFF'}`);
    });

    playButton.on('pointerdown', () => {
      soundManager.playCollect();
      this.scene.start('game', { score: 0 });
    });
  }
}
