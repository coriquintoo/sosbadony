import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('menu');
  }

  create() {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x1b263b);

    this.add
      .text(width / 2, 130, 'PLATAFORMAS\nESTILO MARIO', {
        fontSize: '48px',
        color: '#ffffff',
        align: 'center',
        fontStyle: 'bold'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 265, 'Mover: A/D o flechas\nSaltar: W, ↑ o ESPACIO\nRecolectá todos los objetos y llegá a la meta', {
        fontSize: '24px',
        color: '#dfe7fd',
        align: 'center'
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, 430, 'CLICK O ENTER PARA COMENZAR', {
        fontSize: '28px',
        color: '#ffd166',
        backgroundColor: '#33415c',
        padding: { x: 12, y: 8 }
      })
      .setOrigin(0.5);

    this.input.once('pointerdown', () => {
      this.scene.start('game');
    });

    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('game');
    });
  }
}
