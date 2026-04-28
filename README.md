# Juego de plataformas básico (Phaser 3)

Proyecto estilo Mario hecho en **HTML + JavaScript simple**, cargando Phaser por CDN (sin Vite, sin bundlers).

## Cómo correrlo

1. Serví la carpeta del proyecto:

```bash
npx serve
```

2. Abrí:

- http://localhost:3000

## Estructura actual

```text
.
├── index.html
└── src
    └── main.js
```

## Mecánicas incluidas

- Movimiento lateral con flechas o A/D.
- Salto con espacio, W o flecha arriba.
- Colisiones con plataformas.
- Monedas/objetos coleccionables con HUD.
- Enemigos simples.
- Vidas y respawn al tocar enemigo o caer fuera del mapa.
- Game Over al quedarse sin vidas.
- Victoria al llegar a la meta.
