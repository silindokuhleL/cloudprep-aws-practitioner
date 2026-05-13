import { questions } from "../data/questions";
import { getDueReviewAttempts, getMistakeAttempts } from "../lib/progress";
import type { StudyProgress } from "../lib/storage";

export function MistakeReview({ progress, onNavigatePractice }: { progress: StudyProgress; onNavigatePractice: () => void }) {
  const mistakes = getMistakeAttempts(progress.attempts).slice().reverse();
  const due = getDueReviewAttempts(progress.attempts);

  if (mistakes.length === 0) {
    return (
      <section className="empty-state">
        <p className="eyebrow">Mistake review</p>
        <h2>No mistakes saved yet</h2>
        <p>Answer practice questions and mark uncertain topics. Anything missed or uncertain will appear here for review.</p>
        <button className="primary-action" onClick={onNavigatePractice}>
          Start Practice
        </button>
      </section>
    );
  }

  return (
    <section className="section-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Spaced review</p>
          <h2>{due.length} {due.length === 1 ? "question" : "questions"} due now</h2>
          <p className="lead">Wrong, guessed, uncertain, and needs-relearning answers come back for spaced review.</p>
        </div>
        <button className="secondary-action" onClick={onNavigatePractice}>
          Retry in Practice
        </button>
      </div>
      <div className="review-list">
        {mistakes.map((attempt) => {
          const question = questions.find((item) => item.id === attempt.questionId);
          if (!question) return null;
          const selectedText = question.options.filter((option) => attempt.selectedOptionIds.includes(option.id)).map((option) => option.text).join(", ");
          const correctText = question.options.filter((option) => question.correctOptionIds.includes(option.id)).map((option) => option.text).join(", ");
          const isDue = due.some((dueAttempt) => dueAttempt.id === attempt.id);
          return (
            <article key={attempt.id} className={isDue ? "review-card due" : "review-card"}>
              <p className="eyebrow">{isDue ? "Due now" : attempt.uncertain ? "Marked uncertain" : "Saved review"}</p>
              <h3>{question.prompt}</h3>
              <p><strong>Your answer:</strong> {selectedText || "No answer selected"}</p>
              <p><strong>Correct answer:</strong> {correctText}</p>
              <p><strong>Confidence:</strong> {attempt.confidence.replace("-", " ")}</p>
              <p><strong>Review due:</strong> {new Date(attempt.reviewDueAt).toLocaleDateString()}</p>
              <p><strong>Remember:</strong> {question.remember}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
