import { domains, getDomainTitle } from "../data/domains";
import { buildDomainMetrics } from "../lib/progress";
import type { StudyProgress } from "../lib/storage";

export function SkillTracker({ progress }: { progress: StudyProgress }) {
  const metrics = buildDomainMetrics(progress.attempts);

  return (
    <section className="section-panel">
      <p className="eyebrow">Skill tracker</p>
      <h2>Know what is strong and what needs work</h2>
      <div className="skill-table">
        {metrics.map((metric) => {
          const domain = domains.find((item) => item.id === metric.domainId);
          return (
            <article key={metric.domainId} className={`skill-row state-${metric.state}`}>
              <div>
                <h3>{getDomainTitle(metric.domainId)}</h3>
                <p>{domain?.description}</p>
              </div>
              <div>
                <span>State</span>
                <strong>{metric.state}</strong>
              </div>
              <div>
                <span>Score</span>
                <strong>{metric.correctPercent}%</strong>
              </div>
              <div>
                <span>Attempts</span>
                <strong>{metric.attempts}</strong>
              </div>
              <div>
                <span>Repeated mistakes</span>
                <strong>{metric.repeatedMistakes}</strong>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
