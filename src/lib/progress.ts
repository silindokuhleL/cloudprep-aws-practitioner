import { domains } from "../data/domains";
import { questions } from "../data/questions";
import type { Attempt, DomainId, DomainMetric, MockExamAttempt, ReadinessState, SkillState } from "../types/study";

export function getSkillState(metric: { attempts: number; correctPercent: number; repeatedMistakes: number; recentTrend: number }): SkillState {
  if (metric.attempts < 3) return "new";
  if (metric.repeatedMistakes > 0 || metric.correctPercent < 60) return "weak";
  if (metric.correctPercent >= 80 && metric.repeatedMistakes === 0 && metric.recentTrend >= 0) return "strong";
  return "improving";
}

export function recommendNextAction(input: { hasMistakes: boolean; weakestDomainId: DomainId; allLessonsComplete: boolean }) {
  if (input.hasMistakes) return { kind: "review-mistakes" as const, domainId: input.weakestDomainId };
  if (input.allLessonsComplete) return { kind: "mixed-practice" as const, domainId: input.weakestDomainId };
  return { kind: "learn-topic" as const, domainId: input.weakestDomainId };
}

export function getReadinessState(mockExams: Array<{ scorePercent: number; domainScores: Record<DomainId, number> }>): {
  state: ReadinessState;
  message: string;
} {
  if (mockExams.length < 2) {
    return { state: "not-ready", message: "Complete at least two timed mock exams before relying on readiness." };
  }
  const recent = mockExams.slice(-2);
  const strongScores = recent.every((exam) => exam.scorePercent >= 80);
  const noWeakDomain = recent.every((exam) => Object.values(exam.domainScores).every((score) => score >= 70));
  if (strongScores && noWeakDomain) return { state: "likely-ready", message: "Recent mock exams are above target with no weak domain." };
  return { state: "getting-close", message: "Keep improving weak domains before booking the exam." };
}

export function getMistakeAttempts(attempts: Attempt[]) {
  return attempts.filter((attempt) => !attempt.correct || attempt.uncertain || attempt.confidence === "guessed" || attempt.confidence === "needs-relearning");
}

export function getDueReviewAttempts(attempts: Attempt[], now = new Date()) {
  return getMistakeAttempts(attempts)
    .filter((attempt) => new Date(attempt.reviewDueAt).getTime() <= now.getTime())
    .sort((a, b) => new Date(a.reviewDueAt).getTime() - new Date(b.reviewDueAt).getTime());
}

export function buildDomainMetrics(attempts: Attempt[]): DomainMetric[] {
  return domains.map((domain) => {
    const domainQuestionIds = new Set(questions.filter((question) => question.domainId === domain.id).map((question) => question.id));
    const domainAttempts = attempts.filter((attempt) => domainQuestionIds.has(attempt.questionId));
    const correctCount = domainAttempts.filter((attempt) => attempt.correct).length;
    const correctPercent = domainAttempts.length ? Math.round((correctCount / domainAttempts.length) * 100) : 0;
    const recent = domainAttempts.slice(-5);
    const previous = domainAttempts.slice(-10, -5);
    const recentScore = recent.length ? Math.round((recent.filter((attempt) => attempt.correct).length / recent.length) * 100) : 0;
    const previousScore = previous.length ? Math.round((previous.filter((attempt) => attempt.correct).length / previous.length) * 100) : recentScore;
    const mistakeCounts = domainAttempts.reduce<Record<string, number>>((counts, attempt) => {
      if (!attempt.correct || attempt.confidence === "needs-relearning") counts[attempt.questionId] = (counts[attempt.questionId] ?? 0) + 1;
      return counts;
    }, {});
    const repeatedMistakes = Object.values(mistakeCounts).filter((count) => count > 1).length;
    const lastPracticed = domainAttempts.at(-1)?.createdAt;
    const recentTrend = recentScore - previousScore;

    return {
      domainId: domain.id,
      attempts: domainAttempts.length,
      correctPercent,
      repeatedMistakes,
      recentTrend,
      state: getSkillState({ attempts: domainAttempts.length, correctPercent, repeatedMistakes, recentTrend }),
      lastPracticed,
    };
  });
}

export function getWeakestDomain(metrics: DomainMetric[]): DomainId {
  const sorted = [...metrics].sort((a, b) => {
    const stateWeight: Record<SkillState, number> = { weak: 0, new: 1, improving: 2, strong: 3 };
    return stateWeight[a.state] - stateWeight[b.state] || a.correctPercent - b.correctPercent;
  });
  return sorted[0]?.domainId ?? "cloud-concepts";
}

export function buildMockExamResult(attempts: Attempt[]): Omit<MockExamAttempt, "id" | "completedAt"> {
  const domainMetrics = buildDomainMetrics(attempts);
  const totalCorrect = attempts.filter((attempt) => attempt.correct).length;
  return {
    scorePercent: attempts.length ? Math.round((totalCorrect / attempts.length) * 100) : 0,
    totalQuestions: attempts.length,
    domainScores: domainMetrics.reduce(
      (scores, metric) => {
        scores[metric.domainId] = metric.correctPercent;
        return scores;
      },
      {} as Record<DomainId, number>,
    ),
  };
}
