import { useEffect, useMemo, useState } from "react";
import { questions } from "../data/questions";
import { buildMockExamResult } from "../lib/progress";
import { createAttempt } from "../lib/scoring";
import type { Attempt, ConfidenceLevel, DomainId, MockExamAttempt, Question } from "../types/study";
import { QuestionCard } from "./Practice";

interface MockExamProps {
  onComplete: (attempts: Attempt[], mockExam: MockExamAttempt) => void;
}

export function MockExam({ onComplete }: MockExamProps) {
  const examQuestions = useMemo(() => selectWeightedExamQuestions(), []);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [uncertain, setUncertain] = useState<Record<string, boolean>>({});
  const [confidence, setConfidence] = useState<Record<string, ConfidenceLevel>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(90 * 60);
  const [submitted, setSubmitted] = useState<MockExamAttempt | null>(null);
  const question = examQuestions[index];
  const isMini = examQuestions.length < 65;

  useEffect(() => {
    if (submitted) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [submitted]);

  useEffect(() => {
    if (secondsLeft === 0 && !submitted) submitExam();
  });

  function toggleOption(questionToUpdate: Question, optionId: string) {
    setAnswers((current) => {
      const selected = current[questionToUpdate.id] ?? [];
      const next =
        questionToUpdate.type === "single"
          ? [optionId]
          : selected.includes(optionId)
            ? selected.filter((id) => id !== optionId)
            : [...selected, optionId];
      return { ...current, [questionToUpdate.id]: next };
    });
  }

  function submitExam() {
    const attempts = examQuestions.map((item) =>
      createAttempt(item, answers[item.id] ?? [], Boolean(uncertain[item.id]), "mock", confidence[item.id] ?? "understood"),
    );
    const result = buildMockExamResult(attempts);
    const mockExam: MockExamAttempt = {
      ...result,
      id: `mock-${Date.now()}`,
      completedAt: new Date().toISOString(),
    };
    onComplete(attempts, mockExam);
    setSubmitted(mockExam);
  }

  if (submitted) {
    return (
      <section className="section-panel">
        <p className="eyebrow">Mock exam submitted</p>
        <h2>{submitted.scorePercent}% score</h2>
        <p className="lead">Review your weak domains before trusting readiness. This is practice evidence, not a pass guarantee.</p>
        <div className="domain-grid">
          {Object.entries(submitted.domainScores).map(([domainId, score]) => (
            <article key={domainId} className="domain-card">
              <span>{domainId}</span>
              <strong>{score}%</strong>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="section-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{isMini ? "Mini mock exam" : "65-question mock exam"}</p>
          <h2>Question {index + 1} of {examQuestions.length}</h2>
        </div>
        <div className="timer-box">{formatTime(secondsLeft)}</div>
      </div>
      <div className="exam-status">
        <span>{Object.keys(answers).length} answered</span>
        <span>{Object.values(flagged).filter(Boolean).length} flagged</span>
        <span>{examQuestions.length - Object.keys(answers).length} unanswered</span>
      </div>
      <div className="question-navigator" aria-label="Question navigator">
        {examQuestions.map((item, itemIndex) => (
          <button
            key={item.id}
            className={[
              itemIndex === index ? "active" : "",
              answers[item.id]?.length ? "answered" : "",
              flagged[item.id] ? "flagged" : "",
            ].join(" ")}
            onClick={() => setIndex(itemIndex)}
          >
            {itemIndex + 1}
          </button>
        ))}
      </div>
      <QuestionCard
        question={question}
        selected={answers[question.id] ?? []}
        submittedAttempt={null}
        uncertain={Boolean(uncertain[question.id])}
        confidence={confidence[question.id] ?? "understood"}
        onToggle={toggleOption}
        onSetUncertain={(value) => setUncertain((current) => ({ ...current, [question.id]: value }))}
        onSetConfidence={(value) => setConfidence((current) => ({ ...current, [question.id]: value }))}
        onSubmit={() => undefined}
        showSubmit={false}
      />
      <div className="button-row">
        <button className="secondary-action" onClick={() => setFlagged((current) => ({ ...current, [question.id]: !current[question.id] }))}>
          {flagged[question.id] ? "Unflag" : "Flag"} for review
        </button>
        <button className="secondary-action" disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}>
          Previous
        </button>
        <button className="secondary-action" disabled={index === examQuestions.length - 1} onClick={() => setIndex((current) => Math.min(examQuestions.length - 1, current + 1))}>
          Next
        </button>
        <button className="primary-action" onClick={submitExam}>
          Submit Exam{examQuestions.length - Object.keys(answers).length > 0 ? ` (${examQuestions.length - Object.keys(answers).length} unanswered)` : ""}
        </button>
      </div>
    </section>
  );
}

function selectWeightedExamQuestions() {
  if (questions.length <= 65) return questions;
  const targets: Record<DomainId, number> = {
    "cloud-concepts": 16,
    "security-compliance": 20,
    "technology-services": 22,
    "billing-support": 7,
  };
  const selected = Object.entries(targets).flatMap(([domainId, count]) =>
    questions.filter((question) => question.domainId === domainId).slice(0, count),
  );
  return selected.length >= 65 ? selected.slice(0, 65) : questions.slice(0, 65);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
