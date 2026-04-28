const WORLD_WIDTH = 2800;
const WORLD_HEIGHT = 540;
const START_POINT = { x: 120, y: 430 };

class PreloadScene extends Phaser.Scene {
  constructor() {
    super('preload');
  }

  preload() {
    const player = this.make.graphics({ x: 0, y: 0, add: false });
    player.fillStyle(0x2a9d8f, 1);
    player.fillRoundedRect(0, 0, 32, 44, 6);
    player.fillStyle(0xffffff, 1);
    player.fillRect(8, 10, 6, 6);
    player.fillRect(18, 10, 6, 6);
    player.fillStyle(0x1d3557, 1);
    player.fillRect(10, 12, 2, 2);
    player.fillRect(20, 12, 2, 2);
    player.generateTexture('player', 32, 44);
    player.destroy();

    const collectible = this.make.graphics({ x: 0, y: 0, add: false });
    collectible.fillStyle(0xffc300, 1);
    collectible.fillCircle(10, 10, 10);
    collectible.fillStyle(0xffe066, 1);
    collectible.fillCircle(7, 7, 4);
    collectible.generateTexture('collectible', 20, 20);
    collectible.destroy();

    const enemy = this.make.graphics({ x: 0, y: 0, add: false });
    enemy.fillStyle(0xe63946, 1);
    enemy.fillRect(0, 0, 34, 24);
    enemy.fillStyle(0xffffff, 1);
    enemy.fillRect(6, 6, 6, 6);
    enemy.fillRect(22, 6, 6, 6);
    enemy.generateTexture('enemy', 34, 24);
    enemy.destroy();

    const goal = this.make.graphics({ x: 0, y: 0, add: false });
    goal.fillStyle(0xffffff, 1);
    goal.fillRect(0, 0, 8, 90);
    goal.fillStyle(0x00b894, 1);
    goal.fillTriangle(8, 12, 8, 44, 58, 28);
    goal.generateTexture('goal', 58, 90);
    goal.destroy();
  }

  create() {
    this.scene.start('menu');
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1b263b);
    this.add.text(width / 2, 130, 'PLATAFORMAS\nESTILO MARIO', {
      fontSize: '48px',
      color: '#ffffff',
      align: 'center',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(width / 2, 265, 'Mover: A/D o flechas\nSaltar: W, ↑ o ESPACIO\nRecolectá todos los objetos y llegá a la meta', {
      fontSize: '24px',
      color: '#dfe7fd',
      align: 'center'
    }).setOrigin(0.5);

    this.add.text(width / 2, 430, 'CLICK O ENTER PARA COMENZAR', {
      fontSize: '28px',
      color: '#ffd166',
      backgroundColor: '#33415c',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5);

    this.input.once('pointerdown', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-ENTER', () => this.scene.start('game'));
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  create() {
    this.score = 0;
    this.collected = 0;
    this.lives = 3;
    this.isPlayerDying = false;
    this.currentCheckpoint = { ...START_POINT };

    this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.physics.world.setBoundsCollision(true, true, true, false);
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
      [250, 500, 500, 40], [820, 500, 460, 40], [1390, 500, 460, 40], [1960, 500, 460, 40], [2530, 500, 460, 40]
    ];
    const elevatedPlatforms = [
      [430, 390, 170, 24], [640, 320, 170, 24], [890, 400, 170, 24], [1120, 330, 170, 24], [1360, 260, 170, 24],
      [1610, 340, 170, 24], [1830, 280, 170, 24], [2060, 360, 170, 24], [2280, 290, 170, 24], [2490, 230, 170, 24]
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
      [270, 455], [430, 350], [640, 280], [890, 360], [1120, 290], [1360, 220],
      [1610, 300], [1830, 240], [2060, 320], [2280, 250], [2490, 190], [2660, 455]
    ];

    collectiblePositions.forEach(([x, y]) => this.collectibles.create(x, y, 'collectible'));
    this.totalCollectibles = collectiblePositions.length;
  }

  createEnemies() {
    this.enemies = this.physics.add.group({ allowGravity: false, immovable: true });
    [[980, 468], [1710, 468], [2380, 468]].forEach(([x, y]) => {
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
    this.collectText = this.add.text(16, 45, `Objetos: 0/${this.totalCollectibles}`, { fontSize: '24px', color: '#ffffff' }).setScrollFactor(0);
    this.livesText = this.add.text(16, 76, `Vidas: ${this.lives}`, { fontSize: '24px', color: '#ffcad4' }).setScrollFactor(0);
    this.helpText = this.add.text(16, 110, 'Tip: Evitá enemigos y caídas. Llegá a la bandera.', {
      fontSize: '18px', color: '#1d3557', backgroundColor: '#f1faee', padding: { x: 6, y: 4 }
    }).setScrollFactor(0);
    this.time.delayedCall(5000, () => this.helpText.setVisible(false));
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
    this.handlePlayerDeath();
  }

  handlePlayerDeath() {
    if (this.isPlayerDying) return;

    this.isPlayerDying = true;
    this.lives -= 1;
    this.livesText.setText(`Vidas: ${this.lives}`);
    this.player.setVelocity(0, 0);
    this.player.body.enable = false;

    if (this.lives <= 0) {
      this.scene.start('gameover', {
        score: this.score,
        collected: this.collected,
        total: this.totalCollectibles
      });
      return;
    }

    this.time.delayedCall(450, () => {
      this.player.setPosition(this.currentCheckpoint.x, this.currentCheckpoint.y);
      this.player.body.enable = true;
      this.player.setVelocity(0, 0);
      this.isPlayerDying = false;
    });
  }

  updateCheckpoint() {
    if (this.player.x > 1100 && this.currentCheckpoint.x < 1100) this.currentCheckpoint = { x: 1160, y: 260 };
    if (this.player.x > 2100 && this.currentCheckpoint.x < 2100) this.currentCheckpoint = { x: 2140, y: 320 };
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
    if (this.scene.isActive('gameover') || this.scene.isActive('win')) return;

    if (this.player.y > this.physics.world.bounds.height + 100) {
      this.handlePlayerDeath();
      return;
    }

    if (this.isPlayerDying) return;

    const left = this.cursors.left.isDown || this.keys.left.isDown;
    const right = this.cursors.right.isDown || this.keys.right.isDown;
    const jumpPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up)
      || Phaser.Input.Keyboard.JustDown(this.keys.up)
      || Phaser.Input.Keyboard.JustDown(this.keys.jump);

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
    if (jumpPressed && canJump) this.player.setVelocityY(-560);

    this.updateCheckpoint();
  }
}

class GameOverScene extends Phaser.Scene {
  constructor() {
    super('gameover');
  }

  init(data) {
    this.score = data.score || 0;
    this.collected = data.collected || 0;
    this.total = data.total || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x4a0404);
    this.add.text(width / 2, 150, 'GAME OVER', { fontSize: '64px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width / 2, 250, `Puntaje: ${this.score}\nObjetos: ${this.collected}/${this.total}`, {
      fontSize: '30px', align: 'center', color: '#ffe5ec'
    }).setOrigin(0.5);
    this.add.text(width / 2, 380, 'R: Reintentar | M: Menú', { fontSize: '30px', color: '#ffd166' }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-M', () => this.scene.start('menu'));
    this.input.once('pointerdown', () => this.scene.start('game'));
  }
}

class WinScene extends Phaser.Scene {
  constructor() {
    super('win');
  }

  init(data) {
    this.score = data.score || 0;
    this.collected = data.collected || 0;
    this.total = data.total || 0;
    this.lives = data.lives || 0;
  }

  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x1b4332);
    this.add.text(width / 2, 140, '¡VICTORIA!', { fontSize: '64px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
    this.add.text(width / 2, 255,
      `Llegaste a la meta\nPuntaje: ${this.score}\nObjetos: ${this.collected}/${this.total}\nVidas restantes: ${this.lives}`,
      { fontSize: '30px', align: 'center', color: '#d8f3dc' }
    ).setOrigin(0.5);
    this.add.text(width / 2, 430, 'R: Jugar de nuevo | M: Menú', { fontSize: '30px', color: '#ffd166' }).setOrigin(0.5);

    this.input.keyboard.once('keydown-R', () => this.scene.start('game'));
    this.input.keyboard.once('keydown-M', () => this.scene.start('menu'));
    this.input.once('pointerdown', () => this.scene.start('menu'));
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 960,
  height: 540,
  backgroundColor: '#87ceeb',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [PreloadScene, MenuScene, GameScene, GameOverScene, WinScene]
};

new Phaser.Game(config);
