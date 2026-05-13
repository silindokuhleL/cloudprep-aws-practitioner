import { questions } from "../data/questions";
import { studyPlan } from "../data/studyPlan";
import type { StudySession } from "../types/study";
import { getDateKey, type StudyProgress } from "./storage";

export const dailyTips = [
  "Shared responsibility is the exam's favorite security idea: AWS secures the cloud, you secure what you put in it.",
  "If a question says object storage, think S3 before anything else.",
  "IAM roles are the clean answer for temporary service-to-service permissions.",
  "Budgets alerts you. Cost Explorer helps you investigate spend.",
  "CloudFront is for content delivery. Route 53 is for DNS routing.",
  "A Region contains Availability Zones; edge locations support low-latency delivery.",
  "CloudWatch monitors metrics and logs. CloudTrail records API activity.",
  "Elasticity follows demand. Agility is how fast the business can move.",
  "Free Tier has limits. It does not make all AWS services free forever.",
  "A good mock exam score means less if one domain is still weak.",
  "Least privilege means giving only the permissions required for the task.",
  "S3, EBS, and EFS are different storage patterns: object, block, and file.",
  "Trusted Advisor gives recommendations; AWS Artifact gives compliance reports.",
  "Read every wrong option. AWS often teaches through the distractors.",
];

export function getPlanDay(progress: Pick<StudyProgress, "attempts">) {
  return Math.min(14, Math.max(1, Math.floor(progress.attempts.length / 8) + 1));
}

export function getCurrentPlanDay(progress: Pick<StudyProgress, "attempts">) {
  return studyPlan[getPlanDay(progress) - 1];
}

export function getDailyTip(progress: Pick<StudyProgress, "attempts">, date = new Date()) {
  const day = getPlanDay(progress);
  const dateSeed = Number(getDateKey(date).replaceAll("-", ""));
  return dailyTips[(day + dateSeed) % dailyTips.length];
}

export function getDailyQuestion(progress: Pick<StudyProgress, "attempts">, date = new Date()) {
  const day = getPlanDay(progress);
  const dateSeed = Number(getDateKey(date).slice(-2));
  return questions[(day * 7 + dateSeed) % questions.length];
}

export function getElapsedSeconds(session: StudySession, now = new Date()) {
  const base = session.accumulatedSeconds;
  if (!session.running || !session.startedAt) return base;
  const elapsed = Math.max(0, Math.floor((now.getTime() - new Date(session.startedAt).getTime()) / 1000));
  return base + elapsed;
}

export function formatDuration(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function getRemainingSeconds(targetMinutes: number, studiedSeconds: number) {
  return Math.max(0, targetMinutes * 60 - studiedSeconds);
}
