import { Pause, Play, Square } from "lucide-react";
import { formatDuration, getElapsedSeconds, getRemainingSeconds } from "../lib/studySession";
import type { StudyProgress } from "../lib/storage";

interface StudyTimerBarProps {
  progress: StudyProgress;
  targetMinutes: number;
  elapsedSeconds: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function StudyTimerBar({ progress, targetMinutes, elapsedSeconds, onStart, onPause, onResume, onStop }: StudyTimerBarProps) {
  const session = progress.studySession;
  const remaining = getRemainingSeconds(targetMinutes, elapsedSeconds);
  const isStarted = elapsedSeconds > 0 || session.running;
  const progressPercent = Math.min(100, Math.round((elapsedSeconds / (targetMinutes * 60)) * 100));

  return (
    <section className={session.running ? "timer-bar running" : "timer-bar"}>
      <div>
        <p className="eyebrow">Study timer</p>
        <strong>{formatDuration(elapsedSeconds)}</strong>
        <span>{remaining > 0 ? `${formatDuration(remaining)} left today` : "Daily target complete"}</span>
      </div>
      <div className="timer-progress" aria-label="Daily study progress">
        <div style={{ width: `${progressPercent}%` }} />
      </div>
      <div className="timer-actions">
        {!isStarted ? (
          <button className="primary-action" onClick={onStart}>
            <Play size={16} /> Start Study
          </button>
        ) : session.running ? (
          <button className="secondary-action" onClick={onPause}>
            <Pause size={16} /> Pause
          </button>
        ) : (
          <button className="primary-action" onClick={onResume}>
            <Play size={16} /> Resume
          </button>
        )}
        {isStarted ? (
          <button className="secondary-action" onClick={onStop}>
            <Square size={16} /> Stop
          </button>
        ) : null}
      </div>
    </section>
  );
}

export function getDisplayElapsed(progress: StudyProgress, now = new Date()) {
  return getElapsedSeconds(progress.studySession, now);
}
