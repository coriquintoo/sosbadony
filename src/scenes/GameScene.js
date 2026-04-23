import { Player } from '../objects/Player.js';

const LEVEL_WIDTH = 2200;
const LEVEL_HEIGHT = 600;
const GROUND_Y = 452;
const FALL_GAME_OVER_Y = 560;

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
    this.createBackground();

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);

    Player.createAnimations(this);
    this.player = new Player(this, 96, 400);
    this.player.play('dony-idle');

    this.cursors = this.input.keyboard.createCursorKeys();

    this.platforms = this.physics.add.staticGroup();
    this.createLevelGeometry();

    this.collectibles = this.physics.add.group({ allowGravity: false, immovable: true });
    this.createCollectibles();

    // Goal at far right.
    this.finishFlag = this.physics.add.staticSprite(2080, 420, 'finish-flag');

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, undefined, this);
    this.physics.add.overlap(this.player, this.finishFlag, () => this.completeLevel(), undefined, this);

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(220, 120);
    this.cameras.main.setFollowOffset(0, -60);

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

  createBackground() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width * 6, height, 0x8ecae6).setScrollFactor(0);

    for (let i = 0; i < 10; i += 1) {
      this.add.ellipse(180 + i * 240, 70 + (i % 3) * 20, 90, 34, 0xdaf3ff).setScrollFactor(0.2);
    }

    for (let i = 0; i < 14; i += 1) {
      this.add.rectangle(150 + i * 170, 250, 50, 90, 0x457b9d).setScrollFactor(0.5);
      this.add.circle(150 + i * 170, 230, 28, 0x2a9d8f).setScrollFactor(0.5);
      this.add.rectangle(150 + i * 170, 320, 100, 16, 0x6c757d).setScrollFactor(0.45);
    }

    this.add.rectangle(LEVEL_WIDTH / 2, 520, LEVEL_WIDTH, 160, 0x264653);
  }

  createLevelGeometry() {
    // Stable ground with 3 short gaps.
    const groundSegments = [
      [0, 540],
      [700, 1160],
      [1320, 1760],
      [1920, 2140]
    ];

    groundSegments.forEach(([start, end], segmentIndex) => {
      for (let x = start; x <= end; x += 64) {
        const texture = (segmentIndex + Math.floor(x / 64)) % 2 === 0 ? 'platform-metal' : 'platform-concrete';
        this.createStaticBody(x, GROUND_Y, texture);
      }
    });

    // Few reachable platforms.
    const platforms = [
      { x: 360, y: 370, tiles: 2, texture: 'platform-metal' },
      { x: 920, y: 330, tiles: 2, texture: 'platform-concrete' },
      { x: 1460, y: 300, tiles: 2, texture: 'platform-metal' },
      { x: 1860, y: 330, tiles: 2, texture: 'platform-concrete' }
    ];

    platforms.forEach((platform) => {
      for (let i = 0; i < platform.tiles; i += 1) {
        this.createStaticBody(platform.x + i * 64, platform.y, platform.texture);
      }
    });
  }

  createCollectibles() {
    const itemData = [
      { x: 440, y: 332, key: 'item-drop', points: 10 },
      { x: 1000, y: 292, key: 'item-pipe', points: 15 },
      { x: 1540, y: 262, key: 'item-valve', points: 20 },
      { x: 1940, y: 292, key: 'item-joystick', points: 50 }
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

  createStaticBody(x, y, texture) {
    const body = this.platforms.create(x, y, texture).setOrigin(0, 0);
    body.refreshBody();
    return body;
  }

  collectItem(_, item) {
    if (!item?.active) return;

    this.score += item.points ?? 0;
    this.scoreText.setText(`PUNTAJE: ${this.score}`);

    this.tweens.killTweensOf(item);
    item.disableBody(true, true);

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

    const speed = 190;

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
      this.player.setVelocityY(-420);
      this.soundManager?.playJump();
    }

    if (!this.player.body.blocked.down) {
      this.player.play('dony-jump', true);
    } else if (this.player.body.velocity.x !== 0) {
      this.player.play('dony-run', true);
    } else {
      this.player.play('dony-idle', true);
    }

    // Reliable fall detection for gap falls.
    if (this.player.y > FALL_GAME_OVER_Y) {
      this.endGame();
    }
  }
}
