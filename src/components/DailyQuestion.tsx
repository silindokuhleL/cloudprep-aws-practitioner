import { useState } from "react";
import { createAttempt } from "../lib/scoring";
import { getDailyQuestion } from "../lib/studySession";
import type { StudyProgress } from "../lib/storage";
import type { Attempt, ConfidenceLevel } from "../types/study";
import { QuestionCard } from "./Practice";

export function DailyQuestion({ progress, onAddAttempt }: { progress: StudyProgress; onAddAttempt: (attempt: Attempt) => void }) {
  const question = getDailyQuestion(progress);
  const existing = progress.attempts.find((attempt) => attempt.questionId === question.id && attempt.createdAt.slice(0, 10) === new Date().toISOString().slice(0, 10));
  const [selected, setSelected] = useState<string[]>(existing?.selectedOptionIds ?? []);
  const [uncertain, setUncertain] = useState(existing?.uncertain ?? false);
  const [confidence, setConfidence] = useState<ConfidenceLevel>(existing?.confidence ?? "understood");
  const [submittedAttempt, setSubmittedAttempt] = useState<Attempt | null>(existing ?? null);

  function toggleOption(optionId: string) {
    if (submittedAttempt) return;
    if (question.type === "single") {
      setSelected([optionId]);
      return;
    }
    setSelected((current) => (current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId]));
  }

  function submit() {
    if (selected.length === 0) return;
    const attempt = createAttempt(question, selected, uncertain, "practice", confidence);
    onAddAttempt(attempt);
    setSubmittedAttempt(attempt);
  }

  return (
    <section className="section-panel">
      <p className="eyebrow">Daily question</p>
      <QuestionCard
        question={question}
        selected={selected}
        submittedAttempt={submittedAttempt}
        uncertain={uncertain}
        confidence={confidence}
        onToggle={(_, optionId) => toggleOption(optionId)}
        onSetUncertain={setUncertain}
        onSetConfidence={setConfidence}
        onSubmit={submit}
      />
    </section>
  );
}
