/**
 * Small synth-like helper that uses WebAudio oscillators.
 * It avoids external audio files while still giving retro feedback.
 */
export class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.enabled = true;
    this.musicEvent = null;
    this.noteIndex = 0;
    this.musicNotes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63];
  }

  /**
   * Rebind the manager to the currently active scene.
   * If music was playing, it is restarted in the new scene's timer system.
   */
  attachScene(scene) {
    const wasPlaying = Boolean(this.musicEvent);
    this.stopMusic();
    this.scene = scene;
    if (this.enabled && wasPlaying) {
      this.startMusic();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.enabled;
  }

  playTone(freq = 440, duration = 0.08, type = 'square', volume = 0.03) {
    if (!this.enabled) return;

    const audioContext = this.scene.sound?.context;
    if (!audioContext) return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(volume, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration + 0.01);
  }

  playJump() {
    this.playTone(523.25, 0.08, 'square', 0.04);
  }

  playCollect() {
    this.playTone(783.99, 0.06, 'triangle', 0.04);
  }

  playHit() {
    this.playTone(130.81, 0.2, 'sawtooth', 0.05);
  }

  startMusic() {
    if (!this.enabled || this.musicEvent) return;
    if (!this.scene || !this.scene.time) return;

    this.musicEvent = this.scene.time.addEvent({
      delay: 220,
      loop: true,
      callback: () => {
        const note = this.musicNotes[this.noteIndex % this.musicNotes.length];
        this.playTone(note, 0.15, 'square', 0.02);
        this.noteIndex += 1;
      }
    });
  }

  stopMusic() {
    if (!this.musicEvent) return;
    this.musicEvent.remove(false);
    this.musicEvent = null;
  }
}
