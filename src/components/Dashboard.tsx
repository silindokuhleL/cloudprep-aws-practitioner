import { ArrowRight, BookOpen, ClipboardCheck, Lightbulb, Target, TimerReset } from "lucide-react";
import { domains, getDomainTitle } from "../data/domains";
import { buildDomainMetrics, getDueReviewAttempts, getMistakeAttempts, getReadinessState, getWeakestDomain, recommendNextAction } from "../lib/progress";
import { formatDuration, getCurrentPlanDay, getDailyTip, getRemainingSeconds } from "../lib/studySession";
import type { StudyProgress } from "../lib/storage";
import type { Attempt } from "../types/study";
import { DailyQuestion } from "./DailyQuestion";

interface DashboardProps {
  progress: StudyProgress;
  elapsedSeconds: number;
  onStartStudy: () => void;
  onAddAttempt: (attempt: Attempt) => void;
  onNavigate: (view: string) => void;
}

export function Dashboard({ progress, elapsedSeconds, onStartStudy, onAddAttempt, onNavigate }: DashboardProps) {
  const metrics = buildDomainMetrics(progress.attempts);
  const mistakes = getMistakeAttempts(progress.attempts);
  const dueReviews = getDueReviewAttempts(progress.attempts);
  const weakestDomainId = getWeakestDomain(metrics);
  const readiness = getReadinessState(progress.mockExams);
  const recommendation = recommendNextAction({
    hasMistakes: dueReviews.length > 0 || mistakes.length > 0,
    weakestDomainId,
    allLessonsComplete: false,
  });
  const weakestDomain = getDomainTitle(weakestDomainId);
  const planDay = getCurrentPlanDay(progress);
  const remainingSeconds = getRemainingSeconds(planDay.estimatedMinutes, elapsedSeconds);
  const dailyTip = getDailyTip(progress);
  const actionText =
    recommendation.kind === "review-mistakes"
      ? "Review mistakes before learning new content"
      : recommendation.kind === "mixed-practice"
        ? "Practise mixed questions across weak areas"
        : `Learn a topic in ${weakestDomain}`;

  return (
    <div className="stack">
      <section className="hero-band">
        <div>
          <p className="eyebrow">Today's plan</p>
          <h2>{actionText}</h2>
          <p>
            Study in order: learn the idea, see the AWS example, answer questions, then review why each answer is right or wrong.
          </p>
        </div>
        <button className="primary-action" onClick={() => onNavigate(recommendation.kind === "review-mistakes" ? "Review" : "Learn")}>
          Continue Study <ArrowRight size={18} />
        </button>
      </section>

      <section className="metric-grid compact">
        <article className="metric-card">
          <TimerReset size={22} />
          <span>Day {planDay.day} of 14</span>
          <strong>{planDay.estimatedMinutes} min target</strong>
          <p>{remainingSeconds > 0 ? `${formatDuration(remainingSeconds)} left today` : "Target complete for today."}</p>
          <button className="secondary-action" onClick={onStartStudy}>Start Study</button>
        </article>
        <article className="metric-card">
          <Lightbulb size={22} />
          <span>Daily tip</span>
          <strong>AWS exam focus</strong>
          <p>{dailyTip}</p>
        </article>
      </section>

      <DailyQuestion progress={progress} onAddAttempt={onAddAttempt} />

      <section className="section-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Study history</p>
            <h3>Minutes studied by day</h3>
          </div>
          <button className="secondary-action" onClick={onStartStudy}>Start another session</button>
        </div>
        {progress.studyHistory.length ? (
          <div className="history-grid">
            {progress.studyHistory.slice(-7).map((entry) => (
              <article key={entry.date} className="history-card">
                <span>{entry.date}</span>
                <strong>{Math.round(entry.studiedSeconds / 60)} min</strong>
              </article>
            ))}
          </div>
        ) : (
          <p className="lead">Start and stop a study session to record your first study day.</p>
        )}
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <Target size={22} />
          <span>Readiness</span>
          <strong>{readiness.state.replace("-", " ")}</strong>
          <p>{readiness.message}</p>
        </article>
        <article className="metric-card">
          <BookOpen size={22} />
          <span>Weakest domain</span>
          <strong>{weakestDomain}</strong>
          <p>Focus here until your score and confidence improve.</p>
        </article>
        <article className="metric-card">
          <ClipboardCheck size={22} />
          <span>Mistakes saved</span>
          <strong>{dueReviews.length}</strong>
          <p>Due now from wrong, guessed, uncertain, or low-confidence answers.</p>
        </article>
        <article className="metric-card">
          <TimerReset size={22} />
          <span>Mock exams</span>
          <strong>{progress.mockExams.length}</strong>
          <p>Take at least two timed mocks before trusting readiness.</p>
        </article>
      </section>

      <section className="section-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Exam domains</p>
            <h3>Track understanding by CLF-C02 weight</h3>
          </div>
          <button className="secondary-action" onClick={() => onNavigate("Mock Exam")}>
            Start Mini Mock
          </button>
        </div>
        <div className="domain-grid">
          {domains.map((domain) => {
            const metric = metrics.find((item) => item.domainId === domain.id);
            return (
              <article key={domain.id} className="domain-card">
                <span>{domain.examWeight}% exam weight</span>
                <h4>{domain.title}</h4>
                <p>{domain.description}</p>
                <div className="progress-line">
                  <div style={{ width: `${metric?.correctPercent ?? 0}%` }} />
                </div>
                <strong>{metric?.state ?? "new"} · {metric?.correctPercent ?? 0}%</strong>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
