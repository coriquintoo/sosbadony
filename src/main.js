import { gameConfig } from './config/gameConfig.js';

const game = new Phaser.Game(gameConfig);

// Keep input/layout stable after manual browser resize events.
window.addEventListener('resize', () => {
  game.scale.refresh();
});
