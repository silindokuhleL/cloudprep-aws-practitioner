import { domains } from "../data/domains";
import { questions } from "../data/questions";
import type { Attempt, ConfidenceLevel, DomainId, Question } from "../types/study";

export function checkAnswer(selectedOptionIds: string[], correctOptionIds: string[]) {
  const selected = [...selectedOptionIds].sort().join("|");
  const correct = [...correctOptionIds].sort().join("|");
  return selected === correct;
}

export function scoreQuiz(results: Array<{ correct: boolean }>) {
  if (results.length === 0) return 0;
  return Math.round((results.filter((result) => result.correct).length / results.length) * 100);
}

export function getQuestionById(questionId: string) {
  return questions.find((question) => question.id === questionId);
}

export function getQuestionsForDomain(domainId: DomainId) {
  return questions.filter((question) => question.domainId === domainId);
}

export function getQuestionsForTopic(topicId: string) {
  return questions.filter((question) => question.topicId === topicId);
}

export function getReviewDueDate(input: { correct: boolean; uncertain: boolean; confidence: ConfidenceLevel; createdAt?: Date }) {
  const createdAt = input.createdAt ?? new Date();
  const due = new Date(createdAt);
  if (!input.correct || input.confidence === "needs-relearning") {
    return due.toISOString();
  } else if (input.uncertain || input.confidence === "guessed") {
    due.setDate(due.getDate() + 1);
  } else {
    due.setDate(due.getDate() + 7);
  }
  return due.toISOString();
}

export function createAttempt(
  question: Question,
  selectedOptionIds: string[],
  uncertain: boolean,
  source: Attempt["source"],
  confidence: ConfidenceLevel = "understood",
): Attempt {
  const correct = checkAnswer(selectedOptionIds, question.correctOptionIds);
  const createdAt = new Date();
  return {
    id: `${question.id}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    questionId: question.id,
    selectedOptionIds,
    correct,
    uncertain,
    confidence,
    createdAt: createdAt.toISOString(),
    reviewDueAt: getReviewDueDate({ correct, uncertain, confidence, createdAt }),
    source,
  };
}

export function calculateDomainScores(attempts: Attempt[]): Record<DomainId, number> {
  return domains.reduce(
    (scores, domain) => {
      const domainQuestionIds = new Set(questions.filter((question) => question.domainId === domain.id).map((question) => question.id));
      const domainAttempts = attempts.filter((attempt) => domainQuestionIds.has(attempt.questionId));
      scores[domain.id] = scoreQuiz(domainAttempts);
      return scores;
    },
    {} as Record<DomainId, number>,
  );
}
