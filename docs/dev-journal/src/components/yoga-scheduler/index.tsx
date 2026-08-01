import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { playBell, unlockAudio } from "./bell";
import {
  formatDuration,
  PRESETS,
  totalSeconds,
  type Preset,
  type Stage,
} from "./presets";
import styles from "./styles.module.css";

// Yoga Scheduler — a practice companion with bell-based audio guidance.
// Fully offline: Web Audio API for bells, localStorage for history/settings.

// ─────────────────────────────────────────────────────────────────────────────
// Storage helpers
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEY = "yoga-scheduler:v1";

type HistoryEntry = {
  date: string; // YYYY-MM-DD
  presetId: string;
  completed: boolean;
};

type StoredData = {
  history: HistoryEntry[];
  preferredPreset: string;
  volume: number;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function loadData(): StoredData {
  if (typeof window === "undefined") {
    return { history: [], preferredPreset: "short", volume: 0.7 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoredData;
    }
  } catch {
    // ignore
  }
  return { history: [], preferredPreset: "short", volume: 0.7 };
}

function saveData(data: StoredData): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─────────────────────────────────────────────────────────────────────────────
// Streak calculation
// ─────────────────────────────────────────────────────────────────────────────

function calcStreak(history: HistoryEntry[]): number {
  const completed = new Set(
    history.filter((h) => h.completed).map((h) => h.date),
  );
  let streak = 0;
  const d = new Date();
  // If today is not completed, start from yesterday
  if (!completed.has(todayKey())) {
    d.setDate(d.getDate() - 1);
  }
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (completed.has(key)) {
      streak += 1;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// ─────────────────────────────────────────────────────────────────────────────
// Views
// ─────────────────────────────────────────────────────────────────────────────

type View = "home" | "player" | "history" | "settings";

export default function YogaScheduler() {
  const [view, setView] = useState<View>("home");
  const [data, setData] = useState<StoredData>(loadData);
  const [selectedPreset, setSelectedPreset] = useState<Preset>(
    () => PRESETS.find((p) => p.id === data.preferredPreset) || PRESETS[0],
  );

  // Persist on change
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Client-side load
  useEffect(() => {
    setData(loadData());
  }, []);

  const streak = useMemo(() => calcStreak(data.history), [data.history]);
  const todayDone = useMemo(
    () => data.history.some((h) => h.date === todayKey() && h.completed),
    [data.history],
  );

  const markComplete = useCallback((presetId: string) => {
    setData((prev) => {
      const existing = prev.history.find((h) => h.date === todayKey());
      if (existing) {
        return {
          ...prev,
          history: prev.history.map((h) =>
            h.date === todayKey() ? { ...h, completed: true, presetId } : h,
          ),
        };
      }
      return {
        ...prev,
        history: [
          ...prev.history,
          { date: todayKey(), presetId, completed: true },
        ],
      };
    });
  }, []);

  const setVolume = useCallback((v: number) => {
    setData((prev) => ({ ...prev, volume: v }));
  }, []);

  const setPreferredPreset = useCallback((id: string) => {
    setData((prev) => ({ ...prev, preferredPreset: id }));
    setSelectedPreset(PRESETS.find((p) => p.id === id) || PRESETS[0]);
  }, []);

  return (
    <div className={styles.shell}>
      <div className={styles.header}>
        <span className={styles.badge}>Offline · Web Audio</span>
        <h2>Yoga Practice Scheduler</h2>
      </div>

      {view === "home" && (
        <HomeView
          preset={selectedPreset}
          streak={streak}
          todayDone={todayDone}
          onStart={() => setView("player")}
          onHistory={() => setView("history")}
          onSettings={() => setView("settings")}
        />
      )}

      {view === "player" && (
        <PlayerView
          preset={selectedPreset}
          volume={data.volume}
          onComplete={() => {
            markComplete(selectedPreset.id);
            setView("home");
          }}
          onCancel={() => setView("home")}
        />
      )}

      {view === "history" && (
        <HistoryView history={data.history} onBack={() => setView("home")} />
      )}

      {view === "settings" && (
        <SettingsView
          volume={data.volume}
          setVolume={setVolume}
          preferredPreset={data.preferredPreset}
          setPreferredPreset={setPreferredPreset}
          onBack={() => setView("home")}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Home
// ─────────────────────────────────────────────────────────────────────────────

function HomeView({
  preset,
  streak,
  todayDone,
  onStart,
  onHistory,
  onSettings,
}: {
  preset: Preset;
  streak: number;
  todayDone: boolean;
  onStart: () => void;
  onHistory: () => void;
  onSettings: () => void;
}) {
  return (
    <div className={styles.view}>
      <div className={styles.streakCard}>
        <span className={styles.streakNum}>{streak}</span>
        <span className={styles.streakLabel}>day streak</span>
      </div>

      <div className={styles.todayCard}>
        <h3>Today's Session</h3>
        <p>
          <strong>{preset.name}</strong> —{" "}
          {formatDuration(totalSeconds(preset))}
        </p>
        {todayDone ? (
          <p className={styles.done}>✓ Completed</p>
        ) : (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={onStart}
          >
            Start Session
          </button>
        )}
      </div>

      <div className={styles.nav}>
        <button type="button" onClick={onHistory}>
          History
        </button>
        <button type="button" onClick={onSettings}>
          Settings
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Player
// ─────────────────────────────────────────────────────────────────────────────

function PlayerView({
  preset,
  volume,
  onComplete,
  onCancel,
}: {
  preset: Preset;
  volume: number;
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stage: Stage | undefined = preset.stages[stageIndex];
  const isLast = stageIndex === preset.stages.length - 1;

  // Ring bell on stage start
  useEffect(() => {
    if (stage) {
      playBell(stage.cue, volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIndex]);

  // Timer
  useEffect(() => {
    if (paused || !stage) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((e) => {
        const next = e + 1;
        if (next >= stage.seconds) {
          // Move to next stage or finish
          if (isLast) {
            playBell("end", volume);
            clearInterval(intervalRef.current!);
            onComplete();
          } else {
            setStageIndex((i) => i + 1);
            return 0;
          }
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [paused, stage, isLast, volume, onComplete]);

  // Unlock audio on first interaction
  const handleStart = async () => {
    await unlockAudio();
    setPaused(false);
  };

  if (!stage) {
    return null;
  }

  const remaining = stage.seconds - elapsed;

  return (
    <div className={styles.view}>
      <div className={styles.playerCard}>
        <p className={styles.stageName}>{stage.name}</p>
        <p className={styles.timer}>{formatDuration(remaining)}</p>
        <p className={styles.stageProgress}>
          Stage {stageIndex + 1} / {preset.stages.length}
        </p>
      </div>

      <div className={styles.playerControls}>
        {paused ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={handleStart}
          >
            Resume
          </button>
        ) : (
          <button type="button" onClick={() => setPaused(true)}>
            Pause
          </button>
        )}
        <button type="button" className={styles.linkButton} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// History
// ─────────────────────────────────────────────────────────────────────────────

function HistoryView({
  history,
  onBack,
}: {
  history: HistoryEntry[];
  onBack: () => void;
}) {
  const recent = useMemo(
    () =>
      history
        .filter((h) => h.completed)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 14),
    [history],
  );

  return (
    <div className={styles.view}>
      <h3>Recent Sessions</h3>
      {recent.length === 0 ? (
        <p className={styles.muted}>No sessions yet. Start your first one!</p>
      ) : (
        <ul className={styles.historyList}>
          {recent.map((h) => (
            <li key={h.date}>
              <span>{h.date}</span>
              <span className={styles.historyPreset}>
                {PRESETS.find((p) => p.id === h.presetId)?.name || h.presetId}
              </span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Settings
// ─────────────────────────────────────────────────────────────────────────────

function SettingsView({
  volume,
  setVolume,
  preferredPreset,
  setPreferredPreset,
  onBack,
}: {
  volume: number;
  setVolume: (v: number) => void;
  preferredPreset: string;
  setPreferredPreset: (id: string) => void;
  onBack: () => void;
}) {
  return (
    <div className={styles.view}>
      <h3>Settings</h3>

      <div className={styles.field}>
        <label htmlFor="ys-preset">Default Routine</label>
        <select
          id="ys-preset"
          value={preferredPreset}
          onChange={(e) => setPreferredPreset(e.target.value)}
        >
          {PRESETS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="ys-volume">
          Bell Volume ({Math.round(volume * 100)}%)
        </label>
        <input
          id="ys-volume"
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <button
          type="button"
          className={styles.linkButton}
          onClick={() => playBell("transition", volume)}
        >
          Test bell
        </button>
      </div>

      <button type="button" onClick={onBack}>
        Back
      </button>
    </div>
  );
}
