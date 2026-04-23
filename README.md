# Dony y la Planta Potabilizadora

Juego 2D de plataformas hecho con **Phaser 3**, con estética retro pixel-art.

## Ejecutar

Como es un proyecto web estático, solo necesitás servirlo con cualquier servidor local:

```bash
python3 -m http.server 8000
```

Luego abrir:

- http://localhost:8000

## Estructura

- `index.html`: punto de entrada y carga de Phaser.
- `src/config/gameConfig.js`: configuración global del juego.
- `src/scenes/*`: escenas (inicio, juego, fin de nivel, game over y victoria).
- `src/objects/Player.js`: personaje principal Dony y animaciones.
- `src/systems/SoundManager.js`: música y efectos simples con WebAudio.
