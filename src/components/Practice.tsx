import { useMemo, useState } from "react";
import { domains } from "../data/domains";
import { questions } from "../data/questions";
import { createAttempt } from "../lib/scoring";
import type { Attempt, ConfidenceLevel, DomainId, Question } from "../types/study";

interface PracticeProps {
  onAddAttempt: (attempt: Attempt) => void;
}

export function Practice({ onAddAttempt }: PracticeProps) {
  const [domainId, setDomainId] = useState<DomainId>("cloud-concepts");
  const domainQuestions = useMemo(() => questions.filter((question) => question.domainId === domainId), [domainId]);
  const [index, setIndex] = useState(0);
  const question = domainQuestions[index] ?? domainQuestions[0];
  const [selected, setSelected] = useState<string[]>([]);
  const [uncertain, setUncertain] = useState(false);
  const [confidence, setConfidence] = useState<ConfidenceLevel>("understood");
  const [submittedAttempt, setSubmittedAttempt] = useState<Attempt | null>(null);

  function resetForQuestion(nextIndex: number) {
    setIndex(nextIndex);
    setSelected([]);
    setUncertain(false);
    setConfidence("understood");
    setSubmittedAttempt(null);
  }

  function toggleOption(question: Question, optionId: string) {
    if (submittedAttempt) return;
    if (question.type === "single") {
      setSelected([optionId]);
      return;
    }
    setSelected((current) => (current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]));
  }

  function submit() {
    if (!question || selected.length === 0) return;
    const attempt = createAttempt(question, selected, uncertain, "practice", confidence);
    onAddAttempt(attempt);
    setSubmittedAttempt(attempt);
  }

  return (
    <div className="stack">
      <section className="section-panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Practice questions</p>
            <h2>Answer, then understand every option</h2>
          </div>
          <select
            className="select"
            value={domainId}
            onChange={(event) => {
              setDomainId(event.target.value as DomainId);
              resetForQuestion(0);
            }}
          >
            {domains.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.title}
              </option>
            ))}
          </select>
        </div>
        {question ? (
          <QuestionCard
            question={question}
            selected={selected}
            submittedAttempt={submittedAttempt}
            uncertain={uncertain}
            confidence={confidence}
            onToggle={toggleOption}
            onSetUncertain={setUncertain}
            onSetConfidence={setConfidence}
            onSubmit={submit}
          />
        ) : (
          <p>No questions exist for this domain yet. Choose another domain.</p>
        )}
        <div className="button-row">
          <button className="secondary-action" disabled={index === 0} onClick={() => resetForQuestion(Math.max(0, index - 1))}>
            Previous
          </button>
          <span>
            Question {index + 1} of {domainQuestions.length}
          </span>
          <button className="secondary-action" onClick={() => resetForQuestion((index + 1) % domainQuestions.length)}>
            Next
          </button>
        </div>
      </section>
    </div>
  );
}

export function QuestionCard({
  question,
  selected,
  submittedAttempt,
  uncertain,
  confidence,
  onToggle,
  onSetUncertain,
  onSetConfidence,
  onSubmit,
  showSubmit = true,
}: {
  question: Question;
  selected: string[];
  submittedAttempt: Attempt | null;
  uncertain: boolean;
  confidence: ConfidenceLevel;
  onToggle: (question: Question, optionId: string) => void;
  onSetUncertain: (value: boolean) => void;
  onSetConfidence: (value: ConfidenceLevel) => void;
  onSubmit: () => void;
  showSubmit?: boolean;
}) {
  return (
    <article className="question-card">
      <p className="eyebrow">{question.type === "multiple" ? "Select all that apply" : "Choose one answer"}</p>
      <h3>{question.prompt}</h3>
      <div className="answer-list">
        {question.options.map((option) => {
          const isSelected = selected.includes(option.id);
          const isCorrect = question.correctOptionIds.includes(option.id);
          const revealClass = submittedAttempt ? (isCorrect ? " correct" : isSelected ? " incorrect" : "") : "";
          return (
            <label key={option.id} className={`answer-option${isSelected ? " selected" : ""}${revealClass}`}>
              <input
                type={question.type === "single" ? "radio" : "checkbox"}
                name={question.id}
                checked={isSelected}
                onChange={() => onToggle(question, option.id)}
              />
              <span>{option.text}</span>
              {submittedAttempt ? <small>{option.explanation}</small> : null}
            </label>
          );
        })}
      </div>
      <label className="uncertain-toggle">
        <input type="checkbox" checked={uncertain} onChange={(event) => onSetUncertain(event.target.checked)} disabled={Boolean(submittedAttempt)} />
        Mark this as uncertain so it appears in review
      </label>
      <div className="confidence-group" role="group" aria-label="Confidence level">
        {[
          ["understood", "I understood"],
          ["guessed", "I guessed"],
          ["needs-relearning", "Need to relearn"],
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={confidence === value ? "confidence-button active" : "confidence-button"}
            onClick={() => onSetConfidence(value as ConfidenceLevel)}
            disabled={Boolean(submittedAttempt)}
          >
            {label}
          </button>
        ))}
      </div>
      {submittedAttempt ? (
        <div className={submittedAttempt.correct ? "result-box correct" : "result-box incorrect"}>
          <strong>{submittedAttempt.correct ? "Correct" : "Needs review"}</strong>
          <p>{question.remember}</p>
          <p>Confidence: {submittedAttempt.confidence.replace("-", " ")} · Review due {new Date(submittedAttempt.reviewDueAt).toLocaleDateString()}</p>
        </div>
      ) : showSubmit ? (
        <button className="primary-action" disabled={selected.length === 0} onClick={onSubmit}>
          Check answer
        </button>
      ) : null}
    </article>
  );
}
