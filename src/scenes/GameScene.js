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
      [250, 130], [700, 170], [1200, 120], [1700, 180], [2200, 140]
    ];

    cloudPositions.forEach(([x, y]) => {
      const cloud = this.add.ellipse(x, y, 120, 55, cloudColor, 0.9);
      cloud.setScrollFactor(0.25);
    });

    const treeData = [
      [200, 520], [520, 520], [880, 520], [1250, 520], [1600, 520], [1980, 520], [2320, 520]
    ];

    treeData.forEach(([x, y]) => {
      const trunk = this.add.rectangle(x, y, 90, 120, 0x4f7ea3);
      trunk.setOrigin(0.5, 1);
      trunk.setScrollFactor(0.45);

      const top = this.add.circle(x, y - 85, 48, 0x2a9d8f);
      top.setScrollFactor(0.45);
    });
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // suelo continuo recuperable
    const groundSegments = [
      { x: 160, y: GROUND_Y, w: 320, h: 26 },
      { x: 520, y: GROUND_Y, w: 320, h: 26 },
      { x: 900, y: GROUND_Y, w: 360, h: 26 },
      { x: 1300, y: GROUND_Y, w: 360, h: 26 },
      { x: 1710, y: GROUND_Y, w: 320, h: 26 },
      { x: 2070, y: GROUND_Y, w: 320, h: 26 },
      { x: 2430, y: GROUND_Y, w: 320, h: 26 }
    ];

    groundSegments.forEach(seg => {
      const tile = this.add.rectangle(seg.x, seg.y, seg.w, seg.h, 0x5f7487);
      this.physics.add.existing(tile, true);
      this.platforms.add(tile);
    });

    // plataformas simples y alcanzables
    const platformData = [
      { x: 420, y: 520, w: 170, h: 22 },
      { x: 700, y: 470, w: 170, h: 22 },
      { x: 980, y: 420, w: 170, h: 22 },
      { x: 1310, y: 470, w: 190, h: 22 },
      { x: 1600, y: 400, w: 170, h: 22 },
      { x: 1890, y: 470, w: 190, h: 22 },
      { x: 2200, y: 360, w: 180, h: 22 }
    ];

    platformData.forEach(seg => {
      const tile = this.add.rectangle(seg.x, seg.y, seg.w, seg.h, 0x7f8c8d);
      this.physics.add.existing(tile, true);
      this.platforms.add(tile);
    });
  }

  createPlayer() {
    // spawn claro y jugable
    this.player = new Player(this, 120, 560);

    this.add.existing(this.player);
    this.physics.add.existing(this.player);

    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(24, 30);
    this.player.body.setOffset(4, 2);
    this.player.body.setGravityY(900);
    this.player.body.setMaxVelocity(260, 700);

    // por si la clase Player no trae controles propios sólidos
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const items = [
      // suelo
      { x: 240, y: 580, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 560, y: 580, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 860, y: 580, type: 'drop', points: 10, color: 0x3dbbff },

      // ruta de plataformas
      { x: 420, y: 485, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 700, y: 435, type: 'valve', points: 20, color: 0xd64541 },
      { x: 980, y: 385, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 1310, y: 435, type: 'pipe', points: 15, color: 0x9aa0a6 },
      { x: 1600, y: 365, type: 'drop', points: 10, color: 0x3dbbff },
      { x: 1890, y: 435, type: 'valve', points: 20, color: 0xd64541 },

      // premio final alto pero alcanzable
      { x: 2200, y: 325, type: 'joystick', points: 50, color: 0xf4a261 }
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

    // pocos hazards, claros y evitables
    const hazardData = [
      { x: 1120, y: 604, w: 28, h: 28 },
      { x: 1750, y: 604, w: 28, h: 28 }
    ];

    hazardData.forEach(h => {
      const spike = this.add.rectangle(h.x, h.y, h.w, h.h, 0xe63946);
      this.physics.add.existing(spike, true);
      this.hazards.add(spike);
    });
  }

  createGoal() {
    this.goal = this.add.rectangle(2450, 565, 22, 90, 0x2ecc71);
    this.physics.add.existing(this.goal);
    this.goal.body.setAllowGravity(false);
    this.goal.body.setImmovable(true);
  }

  createHUD() {
    this.scoreText = this.add.text(20, 20, `PUNTAJE: ${this.score}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffffff'
    }).setScrollFactor(0);

    this.lifeText = this.add.text(20, 55, `VIDA: ${this.life}`, {
      fontFamily: 'monospace',
      fontSize: '28px',
      color: '#ffb4a2'
    }).setScrollFactor(0);
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(120, 80);
    this.cameras.main.setZoom(1);
  }

  setupCollisions() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.hazards, this.hitHazard, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
  }

  collectItem(player, item) {
    if (!item.active) return;

    this.score += item.points || 10;
    this.scoreText.setText(`PUNTAJE: ${this.score}`);

    item.destroy();
  }

  hitHazard() {
    if (this.gameEnded) return;

    this.gameEnded = true;
    this.scene.start('gameOver', { score: this.score });
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

    // movimiento más ágil
    if (left) {
      this.player.body.setVelocityX(-220);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.body.setVelocityX(220);
      this.player.setFlipX(false);
    } else {
      this.player.body.setVelocityX(0);
    }

    // salto arcade usable
    if (jumpPressed && this.player.body.blocked.down) {
      this.player.body.setVelocityY(-470);
    }

    // si por alguna razón cae fuera del mundo, revive en suelo
    if (this.player.y > LEVEL_HEIGHT + 100) {
      this.player.setPosition(120, 560);
      this.player.body.setVelocity(0, 0);
    }
  }
}
