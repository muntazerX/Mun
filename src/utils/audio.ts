class GameAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private isDronePlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
    } else {
      if (this.droneGain && this.ctx) {
        this.droneGain.gain.setTargetAtTime(0.04, this.ctx.currentTime, 0.5);
      }
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public startAmbientDrone() {
    if (this.isDronePlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneGain = this.ctx.createGain();

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 180;

      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.value = 55; // A1 deep drone

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.value = 54.5; // Slight detune for slow beating

      this.droneGain.gain.value = this.isMuted ? 0 : 0.035;

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.ctx.destination);

      this.droneOsc1.start();
      this.droneOsc2.start();
      this.isDronePlaying = true;
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {}
  }

  public playDiceRoll() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Series of quick mechanical rattle clicks then a final resonant strike
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 300 + Math.random() * 200;

        const startTime = now + i * 0.06;
        gain.gain.setValueAtTime(0.04, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.04);
      }

      // Final gong/bell hit
      const strikeOsc = this.ctx.createOscillator();
      const strikeGain = this.ctx.createGain();
      strikeOsc.type = 'triangle';
      strikeOsc.frequency.setValueAtTime(220, now + 0.28);
      strikeGain.gain.setValueAtTime(0.08, now + 0.28);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      strikeOsc.connect(strikeGain);
      strikeGain.connect(this.ctx.destination);

      strikeOsc.start(now + 0.28);
      strikeOsc.stop(now + 0.7);
    } catch {}
  }

  public playImpact(heavy: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(heavy ? 90 : 130, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + (heavy ? 0.25 : 0.12));

      gain.gain.setValueAtTime(heavy ? 0.18 : 0.09, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (heavy ? 0.25 : 0.12));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (heavy ? 0.25 : 0.12));
    } catch {}
  }

  public playVictoryChime() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    try {
      const chord = [330, 440, 554, 660];
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        const startTime = this.ctx!.currentTime + idx * 0.08;
        osc.type = 'sine';
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0.05, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    } catch {}
  }
}

export const soundEngine = new GameAudioEngine();
