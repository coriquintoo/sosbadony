import Phaser from 'phaser';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    this.createTextures();
  }

  create() {
    this.scene.start('menu');
  }

  createTextures() {
    const player = this.make.graphics({ x: 0, y: 0, add: false });
    player.fillStyle(0x2a9d8f, 1);
    player.fillRoundedRect(0, 0, 32, 44, 6);
    player.fillStyle(0xffffff, 1);
    player.fillRect(8, 10, 6, 6);
    player.fillRect(18, 10, 6, 6);
    player.fillStyle(0x1d3557, 1);
    player.fillRect(10, 12, 2, 2);
    player.fillRect(20, 12, 2, 2);
    player.generateTexture('player', 32, 44);
    player.destroy();

    const collectible = this.make.graphics({ x: 0, y: 0, add: false });
    collectible.fillStyle(0xffc300, 1);
    collectible.fillCircle(10, 10, 10);
    collectible.fillStyle(0xffe066, 1);
    collectible.fillCircle(7, 7, 4);
    collectible.generateTexture('collectible', 20, 20);
    collectible.destroy();

    const enemy = this.make.graphics({ x: 0, y: 0, add: false });
    enemy.fillStyle(0xe63946, 1);
    enemy.fillRect(0, 0, 34, 24);
    enemy.fillStyle(0xffffff, 1);
    enemy.fillRect(6, 6, 6, 6);
    enemy.fillRect(22, 6, 6, 6);
    enemy.generateTexture('enemy', 34, 24);
    enemy.destroy();

    const goal = this.make.graphics({ x: 0, y: 0, add: false });
    goal.fillStyle(0xffffff, 1);
    goal.fillRect(0, 0, 8, 90);
    goal.fillStyle(0x00b894, 1);
    goal.fillTriangle(8, 12, 8, 44, 58, 28);
    goal.generateTexture('goal', 58, 90);
    goal.destroy();
  }
}
