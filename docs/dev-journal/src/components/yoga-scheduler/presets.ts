// Session presets. Each session is a sequence of timed stages. The player
// rings the appropriate bell as each stage starts and when the session ends.

export type StageCue = "start" | "transition" | "end";

export type Stage = {
  id: string;
  name: string;
  seconds: number;
  cue: StageCue; // bell to ring when this stage begins
};

export type Preset = {
  id: string;
  name: string;
  description: string;
  beginner?: boolean;
  stages: Stage[];
};

// Durations are illustrative and easy to tweak. Times are approximate and
// meant as a practice companion, not a prescriptive routine.
export const PRESETS: Preset[] = [
  {
    id: "short",
    name: "Short (5 min)",
    description: "A quick centering session for busy days.",
    beginner: true,
    stages: [
      { id: "settle", name: "Settle in", seconds: 60, cue: "start" },
      {
        id: "breath",
        name: "Breath awareness",
        seconds: 120,
        cue: "transition",
      },
      { id: "stillness", name: "Stillness", seconds: 120, cue: "transition" },
    ],
  },
  {
    id: "standard",
    name: "Standard (12 min)",
    description: "A balanced daily practice with warm-up and stillness.",
    beginner: true,
    stages: [
      { id: "settle", name: "Settle in", seconds: 90, cue: "start" },
      { id: "warmup", name: "Gentle warm-up", seconds: 180, cue: "transition" },
      {
        id: "breath",
        name: "Breath practice",
        seconds: 240,
        cue: "transition",
      },
      { id: "stillness", name: "Stillness", seconds: 210, cue: "transition" },
    ],
  },
  {
    id: "deep",
    name: "Deep (21 min)",
    description: "A longer session with extended stillness.",
    stages: [
      { id: "settle", name: "Settle in", seconds: 120, cue: "start" },
      { id: "warmup", name: "Warm-up", seconds: 240, cue: "transition" },
      {
        id: "breath",
        name: "Breath practice",
        seconds: 360,
        cue: "transition",
      },
      { id: "kriya", name: "Core practice", seconds: 360, cue: "transition" },
      {
        id: "stillness",
        name: "Deep stillness",
        seconds: 180,
        cue: "transition",
      },
    ],
  },
];

export function totalSeconds(preset: Preset): number {
  return preset.stages.reduce((sum, s) => sum + s.seconds, 0);
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
