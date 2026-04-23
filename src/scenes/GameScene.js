import { Player } from '../objects/Player.js';

const LEVEL_WIDTH = 3400;
const LEVEL_HEIGHT = 600;
const GROUND_Y = 452;

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  init(data) {
    this.score = data.score ?? 0;
    this.life = 1;
    this.gameEnded = false;
  }

  create() {
    this.createParallaxBackground();

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);

    Player.createAnimations(this);
    // Spawn clearly above the main floor so the player is fully visible and settles onto ground.
    this.player = new Player(this, 80, 390);
    this.player.play('dony-idle');

    this.cursors = this.input.keyboard.createCursorKeys();

    this.platforms = this.physics.add.staticGroup();
    this.boxes = this.physics.add.staticGroup();
    this.createPlatformsAndHoles();

    this.collectibles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.createCollectibles();

    this.hazards = this.physics.add.group({ allowGravity: false, immovable: true });
    this.createHazards();

    this.finishFlag = this.physics.add.staticSprite(LEVEL_WIDTH - 120, 390, 'finish-flag');

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.player, this.boxes);

    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, undefined, this);
    this.physics.add.overlap(this.player, this.hazards, () => this.endGame(), undefined, this);
    this.physics.add.overlap(this.player, this.finishFlag, () => this.completeLevel(), undefined, this);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(220, 120);
    this.cameras.main.setFollowOffset(0, -70);

    this.hudPanel = this.add.rectangle(148, 38, 280, 52, 0x102a43, 0.75).setScrollFactor(0).setDepth(998);
    this.scoreText = this.add
      .text(16, 16, `PUNTAJE: ${this.score}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ffffff'
      })
      .setScrollFactor(0)
      .setDepth(999);

    this.lifeText = this.add
      .text(16, 40, `VIDA: ${this.life}`, {
        fontFamily: '"Press Start 2P"',
        fontSize: '14px',
        color: '#ffadad'
      })
      .setScrollFactor(0)
      .setDepth(999);

    this.soundManager = this.registry.get('soundManager');
    this.soundManager?.attachScene?.(this);
  }

  createParallaxBackground() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width * 6, height, 0x8ecae6).setScrollFactor(0);

    const cloudColor = 0xdaf3ff;
    for (let i = 0; i < 12; i += 1) {
      this.add.ellipse(180 + i * 300, 70 + (i % 3) * 25, 90, 34, cloudColor).setScrollFactor(0.2);
    }

    for (let i = 0; i < 20; i += 1) {
      this.add.rectangle(120 + i * 170, 230 + (i % 2) * 20, 50, 90, 0x457b9d).setScrollFactor(0.5);
      this.add.circle(120 + i * 170, 210 + (i % 2) * 20, 30, 0x2a9d8f).setScrollFactor(0.5);
      this.add.rectangle(120 + i * 170, 310 + (i % 2) * 20, 100, 16, 0x6c757d).setScrollFactor(0.45);
    }

    this.add.rectangle(LEVEL_WIDTH / 2, 540 - 20, LEVEL_WIDTH, 40, 0x264653);
  }

  createPlatformsAndHoles() {
    const segments = [
      [0, 400],
      [460, 700],
      [760, 1000],
      [1100, 1420],
      [1540, 1820],
      [1940, 2260],
      [2380, 2660],
      [2780, 3100],
      [3220, 3400]
    ];

    for (const [start, end] of segments) {
      for (let x = start; x <= end; x += 64) {
        const texture = x % 128 === 0 ? 'platform-metal' : 'platform-concrete';
        this.platforms.create(x, GROUND_Y, texture).setOrigin(0, 0);
      }
    }

    // Elevated industrial routes.
    for (let x = 580; x <= 960; x += 64) {
      this.platforms.create(x, 320, 'platform-metal').setOrigin(0, 0);
    }

    for (let x = 1720; x <= 2060; x += 64) {
      this.platforms.create(x, 270, 'platform-concrete').setOrigin(0, 0);
    }

    for (let x = 2500; x <= 2900; x += 64) {
      this.platforms.create(x, 340, 'platform-metal').setOrigin(0, 0);
    }

    // Static box obstacles.
    const boxPositions = [
      [660, 428],
      [720, 428],
      [1880, 246],
      [2610, 316]
    ];

    boxPositions.forEach(([x, y]) => this.boxes.create(x, y, 'obstacle-box').setOrigin(0, 0));
  }

  createCollectibles() {
    const itemData = [
      { x: 220, y: 360, key: 'item-drop', points: 10 },
      { x: 340, y: 360, key: 'item-pipe', points: 15 },
      { x: 620, y: 280, key: 'item-valve', points: 20 },
      { x: 760, y: 280, key: 'item-drop', points: 10 },
      { x: 900, y: 280, key: 'item-pipe', points: 15 },
      { x: 1220, y: 360, key: 'item-valve', points: 20 },
      { x: 1600, y: 360, key: 'item-drop', points: 10 },
      { x: 1760, y: 230, key: 'item-pipe', points: 15 },
      { x: 1940, y: 230, key: 'item-valve', points: 20 },
      { x: 2520, y: 300, key: 'item-drop', points: 10 },
      { x: 2790, y: 300, key: 'item-pipe', points: 15 },
      { x: 3050, y: 360, key: 'item-valve', points: 20 },
      { x: 3300, y: 360, key: 'item-joystick', points: 50 }
    ];

    itemData.forEach((item) => {
      const sprite = this.collectibles.create(item.x, item.y, item.key);
      sprite.points = item.points;
      this.tweens.add({
        targets: sprite,
        y: sprite.y - 5,
        duration: 700,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.inOut'
      });
    });
  }

  createHazards() {
    // Timed water jets from valve shooters.
    const shooters = [850, 1470, 2140, 2940];

    shooters.forEach((x) => {
      this.add.sprite(x, 420, 'hazard-valve-shooter').setOrigin(0.5, 1);

      const jet = this.hazards.create(x, 380, 'hazard-water');
      jet.setVisible(false).setActive(false);

      this.time.addEvent({
        delay: 1400 + Phaser.Math.Between(0, 600),
        loop: true,
        callback: () => {
          jet.setPosition(x, 380);
          jet.setVisible(true).setActive(true);
          this.tweens.add({
            targets: jet,
            y: 300,
            duration: 260,
            yoyo: true,
            onComplete: () => jet.setVisible(false).setActive(false)
          });
        }
      });
    });
  }

  collectItem(_, item) {
    this.score += item.points;
    this.scoreText.setText(`PUNTAJE: ${this.score}`);
    item.destroy();
    this.soundManager?.playCollect();
  }

  completeLevel() {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.soundManager?.playCollect();
    this.scene.start('level-complete', { score: this.score });
  }

  endGame() {
    if (this.gameEnded) return;
    this.gameEnded = true;
    this.life = 0;
    this.lifeText.setText(`VIDA: ${this.life}`);
    this.soundManager?.playHit();
    this.scene.start('game-over', { score: this.score });
  }

  update() {
    if (this.gameEnded) return;

    const speed = 150;
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && this.player.body.blocked.down) {
      this.player.setVelocityY(-290);
      this.soundManager?.playJump();
    }

    if (!this.player.body.blocked.down) {
      this.player.play('dony-jump', true);
    } else if (this.player.body.velocity.x !== 0) {
      this.player.play('dony-run', true);
    } else {
      this.player.play('dony-idle', true);
    }

    // One life rule: falling into holes instantly ends the game.
    if (this.player.y > LEVEL_HEIGHT - 20) {
      this.endGame();
    }
  }
}
