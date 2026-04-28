# Juego de plataformas básico (Phaser 3)

Proyecto simple estilo Mario Bros, hecho con Phaser 3 + JavaScript, sin assets externos obligatorios.

## Requisitos

- Node.js 18+
- npm

## Instalar

```bash
npm install
```

## Ejecutar en desarrollo

```bash
npm run dev
```

Abrí la URL local que te muestra Vite (normalmente `http://localhost:5173`).

## Estructura recomendada

```text
.
├── index.html
├── package.json
└── src
    ├── main.js
    └── scenes
        ├── PreloadScene.js
        ├── MenuScene.js
        ├── GameScene.js
        ├── GameOverScene.js
        └── WinScene.js
```

## Mecánicas implementadas

- Movimiento: flechas o A/D.
- Salto: espacio, flecha arriba o W.
- Gravedad y colisiones con suelo/plataformas.
- Objetos recolectables con contador y puntaje.
- Enemigos simples.
- Vidas (3) con respawn por caída o contacto con enemigo.
- Checkpoints durante el nivel.
- Pantallas de Victoria y Game Over.
- Cámara que sigue al jugador y límites del mundo.
