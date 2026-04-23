import { Player } from '../objects/Player.js';

const LEVEL_WIDTH = 2600;
const LEVEL_HEIGHT = 720;
const GROUND_Y = 620;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.life = 1;
    this.gameEnded = false;
  }

  create() {
    this.createBackground();

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.setBackgroundColor('#8ecae6');

    this.createPlatforms();
    this.createPlayer();
    this.createCollectibles();
    this.createHazards();
    this.createKillZones();
    this.createGoal();
    this.createHUD();
    this.setupCamera();
    this.setupCollisions();
  }

  createBackground() {
    const sky = this.add.rectangle(
      LEVEL_WIDTH / 2,
      LEVEL_HEIGHT / 2,
      LEVEL_WIDTH,
      LEVEL_HEIGHT,
      0x8ecae6
    );
    sky.setScrollFactor(0.2);

    const cloudColor = 0xeaf6ff;
    const cloudPositions = [
      [250, 130],
      [700, 170],
      [1200, 120],
      [1700, 180],
      [2200, 140]
    ];

    cloudPositions.forEach(([x, y]) => {
      const cloud = this.add.ellipse(x, y, 120, 55, cloudColor, 0.9);
      cloud.setScrollFactor(0.25);
    });

    const tankData = [
      [220, 560],
      [820, 560],
      [1460, 560],
      [2050, 560]
    ];

    tankData.forEach(([x, y]) => {
      const tank = this.add.rectangle(x, y, 110, 170, 0x5b7c99);
      tank.setOrigin(0.5, 1);
      tank.setScrollFactor(0.45);

      const top = this.add.rectangle(x, y - 170, 110, 18, 0x7f9bb3);
      top.setOrigin(0.5, 1);
      top.setScrollFactor(0.45);
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // suelo principal con pozos
    const groundSegments = [
      { x: 130, y: GROUND_Y, w: 260, h: 26 },
      { x: 460, y: GROUND_Y, w: 240, h: 26 },
      { x: 800, y: GROUND_Y, w: 250, h: 26 },
      { x: 1130, y: GROUND_Y, w: 220, h: 26 },
      { x: 1470, y: GROUND_Y, w: 260, h: 26 },
      { x: 1820, y: GROUND_Y, w: 230, h: 26 },
      { x: 2150, y: GROUND_Y, w: 240, h: 26 },
      { x: 2470, y: GROUND_Y, w: 180, h: 26 }
    ];

    groundSegments.forEach(seg => {
      const tile = this.add.rectangle(seg.x, seg.y, seg.w, seg.h, 0x5f7487);
      this.physics.add.existing(tile, true);
      this.platforms.add(tile);
    });

    // plataformas rebalanceadas, más bajas y cercanas
    const platformData = [
      { x: 420, y: 535, w: 150, h: 22 },
      { x: 650, y: 485, w: 150, h: 22 },
      { x: 880, y: 440, w: 150, h: 22 },
      { x: 1120, y: 500, w: 160, h: 22 },
      { x: 1360, y: 455, w: 160, h: 22 },
      { x: 1600, y: 410, w: 160, h: 22 },
      { x: 1840, y: 470, w: 160, h: 22 },
      { x: 2070, y: 425, w: 160, h: 22 },
      { x: 2290, y: 380, w: 150, h: 22 }
    ];

    platformData.forEach(seg => {
      const tile = this.add.rectangle(seg.x, seg.y, seg.w, seg.h, 0x7f8c8d);
      this.physics.add.existing(tile, true);
      this.platforms.add(tile);
    });
  }

  createPlayer() {
    this.player = new Player(this, 90, 560);

    this.add.existing(this.player);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(24, 30);
    this.player.body.setOffset(4, 2);
    this.player.body.setGravityY(860);
    this.player.body.setMaxVelocity(320, 760);
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const items = [
      { x: 180, y: 580, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 420, y: 500, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 650, y: 450, type: 'valve', points: 20, color: 0xd64541 },
      { x: 880, y: 405, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 1120, y: 465, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 1360, y: 420, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 1600, y: 375, type: 'valve', points: 20, color: 0xd64541 },
      { x: 1840, y: 435, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 2070, y: 390, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 2290, y: 345, type: 'joystick', points: 50, color: 0xf4a261 }
    ];

    items.forEach(item => {
      let sprite;

      if (item.type === 'drop') {
        sprite = this.add.circle(item.x, item.y, 10, item.color);
      } else if (item.type === 'valve') {
        sprite = this.add.rectangle(item.x, item.y, 18, 18, item.color);
      } else if (item.type === 'pipe') {
        sprite = this.add.rectangle(item.x, item.y, 24, 12, item.color);
      } else {
        sprite = this.add.rectangle(item.x, item.y, 20, 20, item.color);
      }

      this.physics.add.existing(sprite);
      sprite.body.setAllowGravity(false);
      sprite.body.setImmovable(true);
      sprite.points = item.points;
      sprite.itemType = item.type;

      this.collectibles.add(sprite);
    });
  }

  createHazards() {
    this.hazards = this.physics.add.staticGroup();

    const hazardData = [
      { x: 1010, y: 604, w: 28, h: 28 },
      { x: 1720, y: 604, w: 28, h: 28 }
    ];

    hazardData.forEach(h => {
      const spike = this.add.rectangle(h.x, h.y, h.w, h.h, 0xe63946);
      this.physics.add.existing(spike, true);
      this.hazards.add(spike);
    });
  }

  createKillZones() {
    this.killZones = this.physics.add.staticGroup();

    const pitData = [
      { x: 300, y: 690, w: 70, h: 120 },
      { x: 640, y: 690, w: 90, h: 120 },
      { x: 975, y: 690, w: 85, h: 120 },
      { x: 1285, y: 690, w: 105, h: 120 },
      { x: 1645, y: 690, w: 90, h: 120 },
      { x: 1985, y: 690, w: 100, h: 120 },
      { x: 2310, y: 690, w: 90, h: 120 }
    ];

    pitData.forEach(pit => {
      const zone = this.add.rectangle(pit.x, pit.y, pit.w, pit.h, 0x8ecae6, 0.01);
      this.physics.add.existing(zone, true);
      this.killZones.add(zone);
    });
  }

  createGoal() {
    this.goal = this.add.rectangle(2500, 560, 20, 80, 0x2ecc71);
    this.physics.add.existing(this.goal);
    this.goal.body.setAllowGravity(false);
    this.goal.body.setImmovable(true);
    this.goal.body.setSize(20, 80);
  }

  createHUD() {
    this.scoreText = this.add
      .text(20, 20, `PUNTAJE: ${this.score}`, {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffffff'
      })
      .setScrollFactor(0);

    this.lifeText = this.add
      .text(20, 55, `VIDA: ${this.life}`, {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#ffb4a2'
      })
      .setScrollFactor(0);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(120, 80);
    this.cameras.main.setZoom(1);
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
    this.physics.add.overlap(this.player, this.killZones, this.hitHazard, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  collectItem(player, item) {
    if (!item.active || this.gameEnded) return;

    this.score += item.points || 10;
    this.scoreText.setText(`PUNTAJE: ${this.score}`);
    item.destroy();
  }

  hitHazard() {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.scene.start('game-over', { score: this.score });
  }

  reachGoal() {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.scene.start('victory', { score: this.score });
  }

  update() {
    if (!this.player || this.gameEnded) return;

    const left = this.cursors.left.isDown || this.keys.a.isDown;
    const right = this.cursors.right.isDown || this.keys.d.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w) ||
      Phaser.Input.Keyboard.JustDown(this.keys.space);

    if (left) {
      this.player.body.setVelocityX(-245);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.body.setVelocityX(245);
      this.player.setFlipX(false);
    } else {
      this.player.body.setVelocityX(0);
    }

    // salto más fuerte
    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-560);
    }

    if (this.player.y > LEVEL_HEIGHT + 40) {
      this.hitHazard();
    }
  }
}
