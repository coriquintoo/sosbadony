export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'dony-idle-0');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(true);
    // Slightly narrower/taller body centered in the sprite for more reliable platform landing.
    this.setSize(18, 24);
    this.setOffset(7, 8);
    this.setBounce(0.02);
  }

  static createAnimations(scene) {
    if (scene.anims.exists('dony-idle')) return;

    scene.anims.create({
      key: 'dony-idle',
      frames: [{ key: 'dony-idle-0' }, { key: 'dony-idle-1' }],
      frameRate: 3,
      repeat: -1
    });

    scene.anims.create({
      key: 'dony-run',
      frames: [
        { key: 'dony-run-0' },
        { key: 'dony-run-1' },
        { key: 'dony-run-2' },
        { key: 'dony-run-1' }
      ],
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: 'dony-jump',
      frames: [{ key: 'dony-jump-0' }],
      frameRate: 1,
      repeat: -1
    });
  }
}
