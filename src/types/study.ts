export type DomainId = "cloud-concepts" | "security-compliance" | "technology-services" | "billing-support";

export type SkillState = "new" | "weak" | "improving" | "strong";

export type QuestionType = "single" | "multiple";

export type ReadinessState = "not-ready" | "getting-close" | "likely-ready";

export type ConfidenceLevel = "guessed" | "understood" | "needs-relearning";

export interface Topic {
  id: string;
  domainId: DomainId;
  title: string;
  summary: string;
  lesson: {
    explanation: string;
    whyItMatters: string;
    example: string;
    commonConfusion: string;
    howAwsTestsIt: string;
  };
}

export interface Domain {
  id: DomainId;
  title: string;
  examWeight: number;
  description: string;
  topics: Topic[];
}

export interface AnswerOption {
  id: string;
  text: string;
  explanation: string;
}

export interface Question {
  id: string;
  domainId: DomainId;
  topicId: string;
  type: QuestionType;
  difficulty: "foundation" | "exam-style";
  prompt: string;
  options: AnswerOption[];
  correctOptionIds: string[];
  remember: string;
}

export interface Attempt {
  id: string;
  questionId: string;
  selectedOptionIds: string[];
  correct: boolean;
  uncertain: boolean;
  confidence: ConfidenceLevel;
  createdAt: string;
  reviewDueAt: string;
  source: "practice" | "mock";
}

export interface MockExamAttempt {
  id: string;
  scorePercent: number;
  completedAt: string;
  domainScores: Record<DomainId, number>;
  totalQuestions: number;
}

export interface DomainMetric {
  domainId: DomainId;
  attempts: number;
  correctPercent: number;
  repeatedMistakes: number;
  recentTrend: number;
  state: SkillState;
  lastPracticed?: string;
}

export interface StudyPlanDay {
  day: number;
  title: string;
  domainId: DomainId;
  estimatedMinutes: number;
  focus: string;
  lessonTask: string;
  practiceTask: string;
  reviewTask: string;
  checkpoint: string;
}

export interface StudySession {
  running: boolean;
  startedAt?: string;
  accumulatedSeconds: number;
  activeDate: string;
}

export interface StudyHistoryEntry {
  date: string;
  studiedSeconds: number;
}

export interface ServiceComparison {
  id: string;
  title: string;
  domainId: DomainId;
  summary: string;
  left: {
    name: string;
    useWhen: string;
    notFor: string;
  };
  right: {
    name: string;
    useWhen: string;
    notFor: string;
  };
  examTip: string;
}
