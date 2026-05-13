import { comparisons } from "../data/comparisons";
import { getDomainTitle } from "../data/domains";

export function Compare() {
  return (
    <section className="section-panel">
      <p className="eyebrow">Service comparisons</p>
      <h2>Fix the questions AWS likes to blur together</h2>
      <p className="lead">Use these cards when two services sound similar. The exam often tests the small difference.</p>
      <div className="comparison-grid">
        {comparisons.map((comparison) => (
          <article key={comparison.id} className="comparison-card">
            <span>{getDomainTitle(comparison.domainId)}</span>
            <h3>{comparison.title}</h3>
            <p>{comparison.summary}</p>
            <div className="comparison-split">
              <div>
                <h4>{comparison.left.name}</h4>
                <p><strong>Use when:</strong> {comparison.left.useWhen}</p>
                <p><strong>Not for:</strong> {comparison.left.notFor}</p>
              </div>
              <div>
                <h4>{comparison.right.name}</h4>
                <p><strong>Use when:</strong> {comparison.right.useWhen}</p>
                <p><strong>Not for:</strong> {comparison.right.notFor}</p>
              </div>
            </div>
            <div className="tip-box">{comparison.examTip}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
