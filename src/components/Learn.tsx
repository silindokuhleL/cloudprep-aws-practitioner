import { useMemo, useState } from "react";
import { domains } from "../data/domains";

export function Learn() {
  const [domainId, setDomainId] = useState(domains[0].id);
  const domain = useMemo(() => domains.find((item) => item.id === domainId) ?? domains[0], [domainId]);
  const [topicId, setTopicId] = useState(domain.topics[0].id);
  const topic = domain.topics.find((item) => item.id === topicId) ?? domain.topics[0];

  function selectDomain(nextDomainId: typeof domainId) {
    const nextDomain = domains.find((item) => item.id === nextDomainId) ?? domains[0];
    setDomainId(nextDomain.id);
    setTopicId(nextDomain.topics[0].id);
  }

  return (
    <div className="two-column">
      <aside className="study-list">
        <p className="eyebrow">Learn by domain</p>
        {domains.map((item) => (
          <button key={item.id} className={item.id === domain.id ? "list-button active" : "list-button"} onClick={() => selectDomain(item.id)}>
            <strong>{item.title}</strong>
            <span>{item.examWeight}% of exam</span>
          </button>
        ))}
      </aside>
      <section className="section-panel">
        <p className="eyebrow">{domain.title}</p>
        <h2>{topic.title}</h2>
        <p className="lead">{topic.summary}</p>
        <div className="topic-tabs">
          {domain.topics.map((item) => (
            <button key={item.id} className={item.id === topic.id ? "chip active" : "chip"} onClick={() => setTopicId(item.id)}>
              {item.title}
            </button>
          ))}
        </div>
        <div className="lesson-grid">
          <LessonBlock title="What it means" text={topic.lesson.explanation} />
          <LessonBlock title="Why it matters" text={topic.lesson.whyItMatters} />
          <LessonBlock title="AWS example" text={topic.lesson.example} />
          <LessonBlock title="Common confusion" text={topic.lesson.commonConfusion} />
          <LessonBlock title="How AWS tests it" text={topic.lesson.howAwsTestsIt} />
        </div>
      </section>
    </div>
  );
}

function LessonBlock({ title, text }: { title: string; text: string }) {
  return (
    <article className="lesson-block">
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}
