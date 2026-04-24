# Juego básico de plataformas con Phaser 3

## Estructura recomendada

```txt
.
├── index.html
├── package.json
└── src
    ├── main.js
    └── scenes
        ├── BootScene.js
        ├── MenuScene.js
        ├── GameScene.js
        ├── GameOverScene.js
        └── WinScene.js
```

## Instalar y correr

```bash
npm install
npm run dev
```

Abrí el navegador en la URL que imprime Vite (por defecto `http://localhost:5173`).

## Controles

- Mover: flechas izquierda/derecha o A/D.
- Saltar: flecha arriba, W o espacio.

## Notas

- Sin assets externos obligatorios: todo se genera con gráficos simples de Phaser.
- Escena de Game Over al perder todas las vidas.
- Escena de Victoria al llegar a la meta.
