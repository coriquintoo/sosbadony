const LEVEL_WIDTH = 3200;
const LEVEL_HEIGHT = 720;
const GROUND_Y = 680;
const FALL_LIMIT = 760;
const START_POSITION = { x: 120, y: 560 };

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.score = 0;
    this.collected = 0;
    this.totalCollectibles = 0;
    this.lives = 3;
    this.isRespawning = false;
    this.currentCheckpoint = { ...START_POSITION };

    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT + 200);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, LEVEL_HEIGHT);

    this.createBackground();
    this.createPlatforms();
    this.createCollectibles();
    this.createHazards();
    this.createEnemy();
    this.createGoal();
    this.createPlayer();
    this.createHud();
    this.createInstructions();
    this.createColliders();
    this.createInput();
    this.setupCamera();
  }

  createBackground() {
    this.add.rectangle(LEVEL_WIDTH / 2, LEVEL_HEIGHT / 2, LEVEL_WIDTH, LEVEL_HEIGHT, 0x87ceeb);
    this.add.rectangle(LEVEL_WIDTH / 2, 700, LEVEL_WIDTH, 140, 0x3a5a40);

    for (let i = 0; i < LEVEL_WIDTH; i += 400) {
      this.add.ellipse(i + 100, 120, 150, 50, 0xffffff, 0.8);
      this.add.ellipse(i + 180, 140, 130, 45, 0xffffff, 0.7);
    }
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    for (let x = 64; x < LEVEL_WIDTH; x += 128) {
      this.platforms.create(x, GROUND_Y, 'ground').refreshBody();
    }

    const platformLayout = [
      { x: 340, y: 585 },
      { x: 560, y: 530 },
      { x: 760, y: 470 },
      { x: 980, y: 520 },
      { x: 1220, y: 460 },
      { x: 1470, y: 410 },
      { x: 1710, y: 470 },
      { x: 1950, y: 420 },
      { x: 2180, y: 370 },
      { x: 2430, y: 430 },
      { x: 2680, y: 380 }
    ];

    platformLayout.forEach((p) => {
      this.platforms.create(p.x, p.y, 'platform').refreshBody();
    });
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const collectiblePositions = [
      [180, 630],
      [340, 545],
      [560, 490],
      [760, 430],
      [980, 480],
      [1220, 420],
      [1470, 370],
      [1710, 430],
      [1950, 380],
      [2180, 330],
      [2430, 390],
      [2680, 340],
      [2940, 630]
    ];

    collectiblePositions.forEach(([x, y]) => {
      this.collectibles.create(x, y, 'coin');
    });

    this.totalCollectibles = this.collectibles.countActive(true);
  }

  createHazards() {
    this.hazards = this.physics.add.staticGroup();
    [
      { x: 880, y: 656 },
      { x: 1600, y: 656 },
      { x: 2310, y: 656 }
    ].forEach((trap) => {
      this.hazards.create(trap.x, trap.y, 'spike').refreshBody();
    });
  }

  createEnemy() {
    this.enemies = this.physics.add.group();

    const enemy = this.enemies.create(2050, 640, 'enemy');
    enemy.setBounce(0);
    enemy.setCollideWorldBounds(false);
    enemy.setVelocityX(-90);
    enemy.body.setAllowGravity(true);
    enemy.minX = 1940;
    enemy.maxX = 2220;
  }

  createGoal() {
    this.goal = this.physics.add.staticImage(3070, 620, 'goal');
    this.goal.body.setSize(56, 100);
  }

  createPlayer() {
    this.player = this.physics.add.sprite(START_POSITION.x, START_POSITION.y, 'player');
    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0);
    this.player.setMaxVelocity(300, 900);
    this.player.body.setSize(28, 44);
    this.player.body.setOffset(2, 2);
  }

  createHud() {
    const textStyle = { fontSize: '26px', color: '#ffffff', fontStyle: 'bold' };
    this.scoreText = this.add.text(20, 16, 'Puntaje: 0', textStyle).setScrollFactor(0);
    this.collectText = this.add.text(20, 48, `Objetos: 0/${this.totalCollectibles}`, textStyle).setScrollFactor(0);
    this.livesText = this.add.text(20, 80, `Vidas: ${this.lives}`, textStyle).setScrollFactor(0);
  }

  createInstructions() {
    this.instructionsText = this.add
      .text(640, 120, 'Recolectá objetos y llegá a la bandera', {
        fontSize: '30px',
        color: '#1d3557',
        backgroundColor: '#ffffffcc',
        padding: { x: 14, y: 8 }
      })
      .setOrigin(0.5)
      .setScrollFactor(0);

    this.time.delayedCall(3000, () => {
      this.tweens.add({
        targets: this.instructionsText,
        alpha: 0,
        duration: 500,
        onComplete: () => this.instructionsText.destroy()
      });
    });
  }

  createColliders() {
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);

    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, null, this);
    this.physics.add.overlap(this.player, this.hazards, () => this.loseLife('trap'), null, this);
    this.physics.add.overlap(this.player, this.enemies, () => this.loseLife('enemy'), null, this);
    this.physics.add.overlap(this.player, this.goal, this.winGame, null, this);
  }

  createInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE
    });
  }

  setupCamera() {
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setDeadzone(160, 100);
  }

  collectItem(_, item) {
    if (!item.active) {
      return;
    }

    item.disableBody(true, true);
    this.score += 10;
    this.collected += 1;

    this.scoreText.setText(`Puntaje: ${this.score}`);
    this.collectText.setText(`Objetos: ${this.collected}/${this.totalCollectibles}`);
  }

  loseLife(reason) {
    if (this.isRespawning) {
      return;
    }

    this.isRespawning = true;
    this.lives -= 1;
    this.livesText.setText(`Vidas: ${this.lives}`);

    if (this.lives <= 0) {
      this.scene.start('game-over', {
        score: this.score,
        collected: this.collected,
        totalCollectibles: this.totalCollectibles
      });
      return;
    }

    this.player.setVelocity(0, 0);
    this.player.setPosition(this.currentCheckpoint.x, this.currentCheckpoint.y);
    this.cameras.main.flash(180, 255, 120, 120);

    this.time.delayedCall(500, () => {
      this.isRespawning = false;
    });

    if (reason === 'fall') {
      this.player.y = this.currentCheckpoint.y;
    }
  }

  winGame() {
    this.scene.start('win', {
      score: this.score,
      collected: this.collected,
      totalCollectibles: this.totalCollectibles,
      lives: this.lives
    });
  }

  update() {
    this.updateEnemyPatrol();

    if (!this.player || this.isRespawning) {
      return;
    }

    const left = this.cursors.left.isDown || this.keys.a.isDown;
    const right = this.cursors.right.isDown || this.keys.d.isDown;
    const jumpPressed =
      Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.keys.w) ||
      Phaser.Input.Keyboard.JustDown(this.keys.space);

    if (left) {
      this.player.setVelocityX(-240);
      this.player.setFlipX(true);
    } else if (right) {
      this.player.setVelocityX(240);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }

    if (jumpPressed && this.player.body.blocked.down) {
      this.player.setVelocityY(-560);
    }

    this.updateCheckpoint();

    if (this.player.y > FALL_LIMIT) {
      this.loseLife('fall');
    }
  }

  updateEnemyPatrol() {
    this.enemies.children.iterate((enemy) => {
      if (!enemy || !enemy.body) {
        return;
      }

      if (enemy.x <= enemy.minX) {
        enemy.setVelocityX(90);
      } else if (enemy.x >= enemy.maxX) {
        enemy.setVelocityX(-90);
      }
    });
  }

  updateCheckpoint() {
    const checkpoints = [
      { x: 120, y: 560 },
      { x: 1000, y: 440 },
      { x: 2000, y: 340 },
      { x: 2800, y: 340 }
    ];

    checkpoints.forEach((checkpoint) => {
      if (this.player.x >= checkpoint.x) {
        this.currentCheckpoint = checkpoint;
      }
    });
  }
}
