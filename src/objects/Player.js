export class Player extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y) {
    super(scene, x, y, 28, 36, 0x2dd4bf);
    this.scene = scene;
  }
}
