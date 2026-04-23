export class BootScene extends Phaser.Scene {
  constructor() {
    super('boot');
  }

  preload() {
    this.createPlayerTextures();
    this.createItemTextures();
    this.createEnvironmentTextures();
  }

  create() {
    this.scene.start('start');
  }

  // Pixel-art inspired Dony frames: friendly lake-monster mascot with arms/legs.
  createPlayerTextures() {
    const frames = [
      {
        key: 'dony-idle-0',
        bodyW: 18,
        bodyH: 15,
        eyeOffset: 0,
        legOffset: 0
      },
      {
        key: 'dony-idle-1',
        bodyW: 18,
        bodyH: 14,
        eyeOffset: 1,
        legOffset: 1
      },
      {
        key: 'dony-run-0',
        bodyW: 18,
        bodyH: 15,
        eyeOffset: 0,
        legOffset: -2
      },
      {
        key: 'dony-run-1',
        bodyW: 18,
        bodyH: 15,
        eyeOffset: 0,
        legOffset: 2
      },
      {
        key: 'dony-run-2',
        bodyW: 18,
        bodyH: 15,
        eyeOffset: -1,
        legOffset: -1
      },
      {
        key: 'dony-jump-0',
        bodyW: 18,
        bodyH: 13,
        eyeOffset: 0,
        legOffset: 0
      }
    ];

    for (const frame of frames) {
      const g = this.make.graphics({ x: 0, y: 0, add: false });
      g.fillStyle(0x2ec4b6, 1);
      g.fillRect(6, 8, frame.bodyW, frame.bodyH);
      g.fillStyle(0x1ba098, 1);
      g.fillRect(8, 4, 14, 8);

      // Arms
      g.fillStyle(0x2ec4b6, 1);
      g.fillRect(3, 12, 3, 6);
      g.fillRect(24, 12, 3, 6);

      // Legs
      g.fillStyle(0x177e89, 1);
      g.fillRect(10 + frame.legOffset, 23, 3, 6);
      g.fillRect(18 - frame.legOffset, 23, 3, 6);

      // Eyes
      g.fillStyle(0xffffff, 1);
      g.fillRect(11 + frame.eyeOffset, 8, 3, 3);
      g.fillRect(18 + frame.eyeOffset, 8, 3, 3);
      g.fillStyle(0x0b132b, 1);
      g.fillRect(12 + frame.eyeOffset, 9, 1, 1);
      g.fillRect(19 + frame.eyeOffset, 9, 1, 1);

      g.generateTexture(frame.key, 32, 32);
      g.destroy();
    }
  }

  createItemTextures() {
    const drop = this.make.graphics({ x: 0, y: 0, add: false });
    drop.fillStyle(0x4cc9f0, 1);
    drop.fillCircle(8, 10, 6);
    drop.fillTriangle(8, 2, 4, 10, 12, 10);
    drop.generateTexture('item-drop', 16, 16);
    drop.destroy();

    const valve = this.make.graphics({ x: 0, y: 0, add: false });
    valve.fillStyle(0xff6b6b, 1);
    valve.fillRect(6, 2, 4, 12);
    valve.fillRect(2, 6, 12, 4);
    valve.generateTexture('item-valve', 16, 16);
    valve.destroy();

    const pipe = this.make.graphics({ x: 0, y: 0, add: false });
    pipe.fillStyle(0x9aa0a6, 1);
    pipe.fillRect(2, 4, 12, 8);
    pipe.fillStyle(0x7b8c98, 1);
    pipe.fillRect(0, 3, 2, 10);
    pipe.fillRect(14, 3, 2, 10);
    pipe.generateTexture('item-pipe', 16, 16);
    pipe.destroy();

    const joystick = this.make.graphics({ x: 0, y: 0, add: false });
    joystick.fillStyle(0x8d99ae, 1);
    joystick.fillRect(2, 10, 12, 4);
    joystick.fillStyle(0xe63946, 1);
    joystick.fillRect(7, 4, 2, 6);
    joystick.fillCircle(8, 3, 3);
    joystick.generateTexture('item-joystick', 16, 16);
    joystick.destroy();
  }

  createEnvironmentTextures() {
    const ground = this.make.graphics({ x: 0, y: 0, add: false });
    ground.fillStyle(0x7f8c8d, 1);
    ground.fillRect(0, 0, 64, 16);
    ground.fillStyle(0x95a5a6, 1);
    for (let i = 0; i < 64; i += 8) {
      ground.fillRect(i, 0, 4, 2);
    }
    ground.generateTexture('platform-metal', 64, 16);
    ground.destroy();

    const concrete = this.make.graphics({ x: 0, y: 0, add: false });
    concrete.fillStyle(0x606c76, 1);
    concrete.fillRect(0, 0, 64, 16);
    concrete.fillStyle(0x74828e, 1);
    concrete.fillRect(6, 4, 8, 3);
    concrete.fillRect(26, 8, 10, 3);
    concrete.fillRect(46, 5, 12, 3);
    concrete.generateTexture('platform-concrete', 64, 16);
    concrete.destroy();

    const box = this.make.graphics({ x: 0, y: 0, add: false });
    box.fillStyle(0xc08457, 1);
    box.fillRect(0, 0, 24, 24);
    box.lineStyle(2, 0x8b5e3c, 1);
    box.strokeRect(1, 1, 22, 22);
    box.generateTexture('obstacle-box', 24, 24);
    box.destroy();

    const hazard = this.make.graphics({ x: 0, y: 0, add: false });
    hazard.fillStyle(0x3a86ff, 1);
    hazard.fillRect(6, 0, 4, 14);
    hazard.fillStyle(0x90e0ef, 1);
    hazard.fillRect(5, 14, 6, 2);
    hazard.generateTexture('hazard-water', 16, 16);
    hazard.destroy();

    const valveShooter = this.make.graphics({ x: 0, y: 0, add: false });
    valveShooter.fillStyle(0xd62828, 1);
    valveShooter.fillRect(0, 0, 20, 20);
    valveShooter.fillStyle(0xf77f00, 1);
    valveShooter.fillRect(8, 8, 4, 12);
    valveShooter.generateTexture('hazard-valve-shooter', 20, 32);
    valveShooter.destroy();

    const flag = this.make.graphics({ x: 0, y: 0, add: false });
    flag.fillStyle(0xffffff, 1);
    flag.fillRect(1, 0, 3, 32);
    flag.fillStyle(0x06d6a0, 1);
    flag.fillRect(4, 2, 16, 10);
    flag.generateTexture('finish-flag', 24, 32);
    flag.destroy();
  }
}
