import { Player } from '../objects/Player.js';

const LEVEL_WIDTH = 2800;
const LEVEL_HEIGHT = 720;
const GROUND_Y = 640;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init(data) {
    this.score = data?.score ?? 0;
    this.gameEnded = false;
  }

  create() {
    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.setBackgroundColor('#8ecae6');

    this.createBackground();
    this.createPlatforms();
    this.createKillZones();
    this.createHazards();
    this.createCollectibles();
    this.createGoal();
    this.createPlayer();
    this.createHUD();
    this.setupCollisions();
    this.setupCamera();
    this.setupInput();
  }

  createBackground() {
    this.add.rectangle(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2, LEVEL_WIDTH, LEVEL_HEIGHT, 0x8ecae6);

    const clouds = [
      [220, 140], [650, 170], [1100, 130], [1550, 180], [2050, 150], [2480, 125]
    ];

    clouds.forEach(([x, y]) => {
      this.add.ellipse(x, y, 120, 50, 0xeaf6ff, 0.95);
    });

    const tanks = [180, 760, 1380, 1980, 2460];
    tanks.forEach((x) => {
      this.add.rectangle(x, 540, 90, 120, 0x5b7c99).setOrigin(0.5, 1);
      this.add.circle(x, 415, 45, 0x2a9d8f);
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    const groundSegments = [
      { x: 120, w: 240 },
      { x: 430, w: 220 },
      { x: 760, w: 230 },
      { x: 1080, w: 210 },
      { x: 1410, w: 230 },
      { x: 1730, w: 220 },
      { x: 2050, w: 220 },
      { x: 2360, w: 220 },
      { x: 2670, w: 180 }
    ];

    groundSegments.forEach(seg => {
      const r = this.add.rectangle(seg.x, GROUND_Y, seg.w, 24, 0x5f7487).setOrigin(0.5, 0.5);
      this.physics.add.existing(r, true);
      this.platforms.add(r);
    });

    // Plataformas jugables de verdad
    const platformData = [
      { x: 360, y: 565, w: 120 },
      { x: 560, y: 515, w: 120 },
      { x: 760, y: 465, w: 120 },
      { x: 980, y: 515, w: 130 },
      { x: 1180, y: 465, w: 120 },
      { x: 1380, y: 415, w: 120 },
      { x: 1600, y: 470, w: 130 },
      { x: 1820, y: 420, w: 120 },
      { x: 2040, y: 370, w: 120 },
      { x: 2260, y: 430, w: 120 },
      { x: 2460, y: 380, w: 120 }
    ];

    platformData.forEach(seg => {
      const r = this.add.rectangle(seg.x, seg.y, seg.w, 20, 0x7f8c8d).setOrigin(0.5, 0.5);
      this.physics.add.existing(r, true);
      this.platforms.add(r);
    });
  }

  createKillZones() {
    this.killZones = this.physics.add.staticGroup();

    const pits = [
      { x: 280, w: 70 },
      { x: 600, w: 80 },
      { x: 920, w: 80 },
      { x: 1240, w: 80 },
      { x: 1570, w: 80 },
      { x: 1890, w: 80 },
      { x: 2205, w: 80 },
      { x: 2520, w: 80 }
    ];

    pits.forEach(pit => {
      const zone = this.add.rectangle(pit.x, 690, pit.w, 120, 0x8ecae6, 0.01);
      this.physics.add.existing(zone, true);
      this.killZones.add(zone);
    });
  }

  createHazards() {
    this.hazards = this.physics.add.staticGroup();

    const hazardData = [
      { x: 1120, y: 622 },
      { x: 2110, y: 622 }
    ];

    hazardData.forEach(h => {
      const spike = this.add.rectangle(h.x, h.y, 26, 26, 0xe63946);
      this.physics.add.existing(spike, true);
      this.hazards.add(spike);
    });
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const items = [
      { x: 170, y: 595, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 360, y: 530, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 560, y: 480, type: 'valve', points: 20, color: 0xd64541 },
      { x: 760, y: 430, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 980, y: 480, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 1180, y: 430, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 1380, y: 380, type: 'valve', points: 20, color: 0xd64541 },
      { x: 1600, y: 435, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 1820, y: 385, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 2040, y: 335, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 2260, y: 395, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 2460, y: 345, type: 'joystick', points: 50, color: 0xf4a261 }
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
      this.collectibles.add(sprite);
    });
  }

  createGoal() {
    this.goal = this.add.rectangle(2720, 585, 20, 90, 0x2ecc71);
    this.physics.add.existing(this.goal);
    this.goal.body.setAllowGravity(false);
    this.goal.body.setImmovable(true);
    this.goal.body.setSize(20, 90);
  }

  createPlayer() {
    this.player = new Player(this, 90, 590);

    this.add.existing(this.player);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(28, 36);
    this.player.body.setOffset(0, 0);
    this.player.body.setGravityY(900);
    this.player.body.setMaxVelocity(320, 900);
    this.player.body.setBounce(0);
  }

  createHUD() {
    this.scoreText = this.add.text(20, 20, `PUNTAJE: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff'
    }).setScrollFactor(0);

    this.lifeText = this.add.text(20, 55, 'VIDA: 1', {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffb4a2'
    }).setScrollFactor(0);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setDeadzone(120, 80);
    this.cameras.main.setZoom(1);
  }

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
    this.physics.add.overlap(this.player, this.killZones, this.hitHazard, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
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
      this.player.body.setVelocityX(-250);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.body.setVelocityX(250);
      this.player.setFlipX(false);
    } else {
      this.player.body.setVelocityX(0);
    }

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-600);
    }

    if (this.player.y > LEVEL_HEIGHT + 40) {
      this.hitHazard();
    }
  }
}
