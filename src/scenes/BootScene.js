export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    this.createTextures();
  }

  create() {
    this.scene.start('menu');
  }

  createTextures() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x2d6a4f, 1);
    g.fillRect(0, 0, 128, 32);
    g.fillStyle(0x40916c, 1);
    g.fillRect(0, 0, 128, 8);
    g.generateTexture('ground', 128, 32);
    g.clear();

    g.fillStyle(0x5e60ce, 1);
    g.fillRect(0, 0, 120, 20);
    g.fillStyle(0x6930c3, 1);
    g.fillRect(0, 0, 120, 4);
    g.generateTexture('platform', 120, 20);
    g.clear();

    g.fillStyle(0xffd166, 1);
    g.fillCircle(10, 10, 10);
    g.fillStyle(0xffb703, 1);
    g.fillCircle(10, 10, 5);
    g.generateTexture('coin', 20, 20);
    g.clear();

    g.fillStyle(0x2a9d8f, 1);
    g.fillRoundedRect(0, 0, 32, 48, 8);
    g.fillStyle(0xffffff, 1);
    g.fillRect(7, 12, 7, 7);
    g.fillRect(18, 12, 7, 7);
    g.fillStyle(0x1d3557, 1);
    g.fillRect(9, 14, 3, 3);
    g.fillRect(20, 14, 3, 3);
    g.generateTexture('player', 32, 48);
    g.clear();

    g.fillStyle(0xe63946, 1);
    g.fillTriangle(0, 28, 14, 0, 28, 28);
    g.generateTexture('spike', 28, 28);
    g.clear();

    g.fillStyle(0x6c757d, 1);
    g.fillRect(0, 0, 40, 40);
    g.fillStyle(0xadb5bd, 1);
    g.fillRect(4, 4, 32, 32);
    g.generateTexture('enemy', 40, 40);
    g.clear();

    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 8, 100);
    g.fillStyle(0xf94144, 1);
    g.fillRect(8, 0, 48, 28);
    g.generateTexture('goal', 56, 100);

    g.destroy();
  }
}
