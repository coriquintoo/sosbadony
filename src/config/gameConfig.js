import { BootScene } from '../scenes/BootScene.js';
import { StartScene } from '../scenes/StartScene.js';
import { GameScene } from '../scenes/GameScene.js';
import { LevelCompleteScene } from '../scenes/LevelCompleteScene.js';
import { GameOverScene } from '../scenes/GameOverScene.js';
import { VictoryScene } from '../scenes/VictoryScene.js';

/**
 * Core Phaser 3 configuration.
 * - FIT keeps the game responsive.
 * - PixelArt preserves the 8-bit aesthetic.
 */
export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#8ecae6',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 700 },
      debug: false
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, StartScene, GameScene, LevelCompleteScene, GameOverScene, VictoryScene]
};
