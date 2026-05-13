import { domains } from "../data/domains";
import { getReadinessState } from "../lib/progress";
import type { StudyProgress } from "../lib/storage";

const checklist = [
  "Reviewed all four exam domains.",
  "Completed at least two timed mock exams.",
  "Reviewed repeated mistakes.",
  "Understands shared responsibility, IAM basics, pricing, core services, and support plans.",
  "Knows the exam duration, question count, and passing score.",
];

export function Readiness({ progress }: { progress: StudyProgress }) {
  const readiness = getReadinessState(progress.mockExams);
  const latest = progress.mockExams.at(-1);

  return (
    <section className="section-panel">
      <p className="eyebrow">Exam readiness</p>
      <h2>{readiness.state.replace("-", " ")}</h2>
      <p className="lead">{readiness.message}</p>
      <div className="metric-grid compact">
        <article className="metric-card">
          <span>Mock exams completed</span>
          <strong>{progress.mockExams.length}</strong>
        </article>
        <article className="metric-card">
          <span>Latest score</span>
          <strong>{latest ? `${latest.scorePercent}%` : "No exam yet"}</strong>
        </article>
      </div>
      {latest ? (
        <div className="domain-grid">
          {domains.map((domain) => (
            <article key={domain.id} className="domain-card">
              <span>{domain.examWeight}% exam weight</span>
              <h4>{domain.title}</h4>
              <strong>{latest.domainScores[domain.id]}%</strong>
            </article>
          ))}
        </div>
      ) : null}
      <h3>Final checklist</h3>
      <ul className="checklist">
        {checklist.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
