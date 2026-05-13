import { CalendarDays, CheckCircle2 } from "lucide-react";
import { getDomainTitle } from "../data/domains";
import { studyPlan } from "../data/studyPlan";
import { buildDomainMetrics, getDueReviewAttempts } from "../lib/progress";
import type { StudyProgress } from "../lib/storage";

export function StudyPlan({ progress, onNavigate }: { progress: StudyProgress; onNavigate: (view: string) => void }) {
  const metrics = buildDomainMetrics(progress.attempts);
  const totalAttempts = progress.attempts.length;
  const currentDay = Math.min(14, Math.max(1, Math.floor(totalAttempts / 8) + 1));
  const dueReviews = getDueReviewAttempts(progress.attempts);

  return (
    <div className="stack">
      <section className="hero-band">
        <div>
          <p className="eyebrow">14-day plan</p>
          <h2>Day {currentDay}: {studyPlan[currentDay - 1].title}</h2>
          <p>{studyPlan[currentDay - 1].focus}</p>
        </div>
        <button className="primary-action" onClick={() => onNavigate(dueReviews.length ? "Review" : "Learn")}>
          {dueReviews.length ? "Review due questions" : "Start today's lesson"}
        </button>
      </section>

      <section className="metric-grid compact">
        <article className="metric-card">
          <CalendarDays size={22} />
          <span>Due review</span>
          <strong>{dueReviews.length}</strong>
          <p>Wrong, guessed, uncertain, or needs-relearning answers due now.</p>
        </article>
        <article className="metric-card">
          <CheckCircle2 size={22} />
          <span>Best domain</span>
          <strong>{getDomainTitle([...metrics].sort((a, b) => b.correctPercent - a.correctPercent)[0]?.domainId ?? "cloud-concepts")}</strong>
          <p>Keep strong areas warm while fixing weak areas.</p>
        </article>
      </section>

      <section className="plan-grid">
        {studyPlan.map((day) => (
          <article key={day.day} className={day.day === currentDay ? "plan-card active" : "plan-card"}>
            <span>Day {day.day} · {getDomainTitle(day.domainId)} · {day.estimatedMinutes} min</span>
            <h3>{day.title}</h3>
            <p>{day.focus}</p>
            <ul>
              <li>{day.lessonTask}</li>
              <li>{day.practiceTask}</li>
              <li>{day.reviewTask}</li>
            </ul>
            <strong>{day.checkpoint}</strong>
          </article>
        ))}
      </section>
    </div>
  );
}
