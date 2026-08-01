// Bell cue engine using the Web Audio API. No bundled audio assets, so it
// works fully offline. Each bell is a short additive-synth chime with a soft
// exponential decay, meant to be calm and non-jarring.

let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  if (!audioContext) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) {
      return null;
    }
    audioContext = new Ctor();
  }
  return audioContext;
}

// Browsers require a user gesture before audio can play. Call this from a
// click handler (e.g. the Start button) to unlock the context.
export async function unlockAudio(): Promise<void> {
  const ctx = getContext();
  if (ctx && ctx.state === "suspended") {
    await ctx.resume();
  }
}

export type BellType = "start" | "transition" | "end";

// Frequencies (in Hz) chosen to feel distinct: start is grounded, transition
// is a gentle mid nudge, end is a brighter resolving chime.
const BELL_PRESETS: Record<BellType, number[]> = {
  start: [196, 392, 587],
  transition: [261.63, 523.25],
  end: [329.63, 493.88, 659.25],
};

export function playBell(type: BellType, volume = 0.6): void {
  const ctx = getContext();
  if (!ctx) {
    return;
  }

  const now = ctx.currentTime;
  const master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  BELL_PRESETS[type].forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    // Stagger partials slightly and let each ring out with a soft decay.
    const start = now + index * 0.04;
    const peak = 0.9 / (index + 1);
    const duration = 2.2;

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peak, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  });
}
