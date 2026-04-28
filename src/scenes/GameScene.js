import Phaser from 'phaser';

const WORLD_WIDTH = 2800;
const WORLD_HEIGHT = 540;
const FALL_LIMIT = WORLD_HEIGHT + 120;
const START_POINT = { x: 120, y: 430 };

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.score = 0;
    this.collected = 0;
    this.lives = 3;
    this.isRespawning = false;
    this.currentCheckpoint = { ...START_POINT };

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 0x87ceeb);
    this.add.rectangle(WORLD_WIDTH / 2, WORLD_HEIGHT - 30, WORLD_WIDTH, 60, 0x7fb069);

    this.createPlatforms();
    this.createPlayer();
    this.createCollectibles();
    this.createEnemies();
    this.createGoal();
    this.createHUD();
    this.createInputs();
    this.createColliders();

    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    const groundSegments = [
      [250, 500, 500, 40],
      [820, 500, 460, 40],
      [1390, 500, 460, 40],
      [1960, 500, 460, 40],
      [2530, 500, 460, 40]
    ];

    const elevatedPlatforms = [
      [430, 390, 170, 24],
      [640, 320, 170, 24],
      [890, 400, 170, 24],
      [1120, 330, 170, 24],
      [1360, 260, 170, 24],
      [1610, 340, 170, 24],
      [1830, 280, 170, 24],
      [2060, 360, 170, 24],
      [2280, 290, 170, 24],
      [2490, 230, 170, 24]
    ];

    [...groundSegments, ...elevatedPlatforms].forEach(([x, y, w, h]) => {
      const platform = this.add.rectangle(x, y, w, h, 0x5e548e).setOrigin(0.5);
      this.physics.add.existing(platform, true);
      this.platforms.add(platform);
    });
  }

  createPlayer() {
    this.player = this.physics.add.sprite(START_POINT.x, START_POINT.y, 'player');
    this.player.setCollideWorldBounds(true);
    this.player.setBounce(0);
    this.player.body.setSize(26, 40);
    this.player.body.setOffset(3, 2);
    this.player.setDepth(2);
  }

  createCollectibles() {
    this.collectibles = this.physics.add.staticGroup();

    const collectiblePositions = [
      [270, 455], [430, 350], [640, 280], [890, 360], [1120, 290],
      [1360, 220], [1610, 300], [1830, 240], [2060, 320], [2280, 250],
      [2490, 190], [2660, 455]
    ];

    collectiblePositions.forEach(([x, y]) => {
      this.collectibles.create(x, y, 'collectible');
    });

    this.totalCollectibles = collectiblePositions.length;
  }

  createEnemies() {
    this.enemies = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const enemyPositions = [
      [980, 468],
      [1710, 468],
      [2380, 468]
    ];

    enemyPositions.forEach(([x, y]) => {
      const enemy = this.enemies.create(x, y, 'enemy');
      enemy.body.setSize(34, 24);
    });
  }

  createGoal() {
    this.goal = this.physics.add.staticSprite(2725, 430, 'goal');
    this.goal.body.setSize(58, 90);
  }

  createHUD() {
    this.scoreText = this.add.text(16, 14, 'Puntaje: 0', { fontSize: '24px', color: '#ffffff' }).setScrollFactor(0);
    this.collectText = this.add
      .text(16, 45, `Objetos: 0/${this.totalCollectibles}`, { fontSize: '24px', color: '#ffffff' })
      .setScrollFactor(0);
    this.livesText = this.add.text(16, 76, `Vidas: ${this.lives}`, { fontSize: '24px', color: '#ffcad4' }).setScrollFactor(0);

    this.helpText = this.add
      .text(16, 110, 'Tip: Evitá enemigos y caídas. Llegá a la bandera.', {
        fontSize: '18px',
        color: '#1d3557',
        backgroundColor: '#f1faee',
        padding: { x: 6, y: 4 }
      })
      .setScrollFactor(0);

    this.time.delayedCall(5000, () => {
      this.helpText.setVisible(false);
    });
  }

  createInputs() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      up: Phaser.Input.Keyboard.KeyCodes.W,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  createColliders() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitDanger, null, this);
    this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
  }

  collectItem(_, item) {
    item.destroy();
    this.collected += 1;
    this.score += 100;
    this.scoreText.setText(`Puntaje: ${this.score}`);
    this.collectText.setText(`Objetos: ${this.collected}/${this.totalCollectibles}`);
  }

  hitDanger() {
    this.loseLife();
  }

  loseLife() {
    if (this.isRespawning) {
      return;
    }

    this.isRespawning = true;
    this.lives -= 1;
    this.livesText.setText(`Vidas: ${this.lives}`);

    if (this.lives <= 0) {
      this.scene.start('gameover', {
        score: this.score,
        collected: this.collected,
        total: this.totalCollectibles
      });
      return;
    }

    this.player.setVelocity(0, 0);
    this.player.setPosition(this.currentCheckpoint.x, this.currentCheckpoint.y);

    this.time.delayedCall(700, () => {
      this.isRespawning = false;
    });
  }

  updateCheckpoint() {
    if (this.player.x > 1100 && this.currentCheckpoint.x < 1100) {
      this.currentCheckpoint = { x: 1160, y: 260 };
    }

    if (this.player.x > 2100 && this.currentCheckpoint.x < 2100) {
      this.currentCheckpoint = { x: 2140, y: 320 };
    }
  }

  reachGoal() {
    this.scene.start('win', {
      score: this.score,
      collected: this.collected,
      total: this.totalCollectibles,
      lives: this.lives
    });
  }

  update() {
    if (this.scene.isActive('gameover') || this.scene.isActive('win')) {
      return;
    }

    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.jump);

    if (left) {
      this.player.setVelocityX(-230);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(230);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    const canJump = this.player.body.blocked.down || this.player.body.touching.down;
    if (jumpPressed && canJump && !this.isRespawning) {
      this.player.setVelocityY(-560);
    }

    this.updateCheckpoint();

    if (this.player.y > FALL_LIMIT) {
      this.loseLife();
    }
  }
}
