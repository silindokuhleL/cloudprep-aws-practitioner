import type { Attempt, MockExamAttempt, StudyHistoryEntry, StudySession } from "../types/study";
import { questions } from "../data/questions";
import { calculateDomainScores, createAttempt } from "./scoring";

const STORAGE_KEY = "cloudprep-progress-v1";

export interface StudyProgress {
  attempts: Attempt[];
  mockExams: MockExamAttempt[];
  studySession: StudySession;
  studyHistory: StudyHistoryEntry[];
}

export const emptyProgress: StudyProgress = {
  attempts: [],
  mockExams: [],
  studySession: {
    running: false,
    accumulatedSeconds: 0,
    activeDate: getDateKey(),
  },
  studyHistory: [],
};

export function getDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function normalizeSession(session: Partial<StudySession> | undefined): StudySession {
  return {
    running: Boolean(session?.running),
    startedAt: session?.startedAt,
    accumulatedSeconds: Number.isFinite(session?.accumulatedSeconds) ? Number(session?.accumulatedSeconds) : 0,
    activeDate: session?.activeDate ?? getDateKey(),
  };
}

function normalizeHistory(history: unknown): StudyHistoryEntry[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((entry): entry is Partial<StudyHistoryEntry> => typeof entry === "object" && entry !== null)
    .map((entry) => ({
      date: typeof entry.date === "string" ? entry.date : getDateKey(),
      studiedSeconds: Number.isFinite(entry.studiedSeconds) ? Number(entry.studiedSeconds) : 0,
    }));
}

function normalizeAttempt(attempt: Partial<Attempt>): Attempt | null {
  if (!attempt.id || !attempt.questionId || !Array.isArray(attempt.selectedOptionIds) || typeof attempt.correct !== "boolean") return null;
  const confidence = attempt.confidence ?? (attempt.correct ? "understood" : "needs-relearning");
  const createdAt = attempt.createdAt ?? new Date().toISOString();
  const dueDate = new Date(createdAt);
  dueDate.setDate(dueDate.getDate() + (attempt.correct ? 7 : 1));
  return {
    id: attempt.id,
    questionId: attempt.questionId,
    selectedOptionIds: attempt.selectedOptionIds,
    correct: attempt.correct,
    uncertain: Boolean(attempt.uncertain),
    confidence,
    createdAt,
    reviewDueAt: attempt.reviewDueAt ?? dueDate.toISOString(),
    source: attempt.source ?? "practice",
  };
}

export function loadProgress(): StudyProgress {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return emptyProgress;
  try {
    const parsed = JSON.parse(raw) as Partial<StudyProgress>;
    return {
      attempts: Array.isArray(parsed.attempts) ? parsed.attempts.map(normalizeAttempt).filter((attempt): attempt is Attempt => Boolean(attempt)) : [],
      mockExams: Array.isArray(parsed.mockExams) ? parsed.mockExams : [],
      studySession: normalizeSession(parsed.studySession),
      studyHistory: normalizeHistory(parsed.studyHistory),
    };
  } catch {
    return emptyProgress;
  }
}

export function saveProgress(progress: StudyProgress) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function clearProgress() {
  window.localStorage.removeItem(STORAGE_KEY);
}

export function createDemoProgress(): StudyProgress {
  const demoQuestions = questions.slice(0, 34);
  const attempts = demoQuestions.map((question, index) => {
    const correct = index % 5 !== 0;
    const selected = correct ? question.correctOptionIds : [question.options.find((option) => !question.correctOptionIds.includes(option.id))?.id ?? question.options[0].id];
    const attempt = createAttempt(question, selected, index % 7 === 0, index % 4 === 0 ? "mock" : "practice", correct ? "understood" : "needs-relearning");
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - (34 - index));
    return {
      ...attempt,
      createdAt: createdAt.toISOString(),
      reviewDueAt: index % 5 === 0 ? new Date().toISOString() : attempt.reviewDueAt,
    };
  });
  const mockAttempts = attempts.filter((attempt) => attempt.source === "mock");
  return {
    attempts,
    studySession: {
      running: false,
      accumulatedSeconds: 42 * 60,
      activeDate: getDateKey(),
    },
    studyHistory: [
      { date: getDateKey(new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)), studiedSeconds: 48 * 60 },
      { date: getDateKey(new Date(Date.now() - 1000 * 60 * 60 * 24 * 2)), studiedSeconds: 61 * 60 },
      { date: getDateKey(new Date(Date.now() - 1000 * 60 * 60 * 24)), studiedSeconds: 55 * 60 },
      { date: getDateKey(), studiedSeconds: 42 * 60 },
    ],
    mockExams: [
      {
        id: "demo-mock-1",
        scorePercent: 76,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        totalQuestions: mockAttempts.length,
        domainScores: calculateDomainScores(mockAttempts),
      },
      {
        id: "demo-mock-2",
        scorePercent: 82,
        completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        totalQuestions: mockAttempts.length,
        domainScores: {
          "cloud-concepts": 84,
          "security-compliance": 78,
          "technology-services": 83,
          "billing-support": 81,
        },
      },
    ],
  };
}
