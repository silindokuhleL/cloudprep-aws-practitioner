import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, CalendarDays, ClipboardList, GitCompareArrows, Gauge, GraduationCap, LayoutDashboard, RotateCcw, Sparkles, TimerReset } from "lucide-react";
import { Compare } from "./components/Compare";
import { Dashboard } from "./components/Dashboard";
import { Learn } from "./components/Learn";
import { MistakeReview } from "./components/MistakeReview";
import { MockExam } from "./components/MockExam";
import { Practice } from "./components/Practice";
import { Readiness } from "./components/Readiness";
import { SkillTracker } from "./components/SkillTracker";
import { StudyPlan } from "./components/StudyPlan";
import { StudyTimerBar } from "./components/StudyTimerBar";
import { clearProgress, createDemoProgress, emptyProgress, loadProgress, saveProgress, type StudyProgress } from "./lib/storage";
import { getCurrentPlanDay, getElapsedSeconds } from "./lib/studySession";
import type { Attempt, MockExamAttempt } from "./types/study";

const tabs = [
  { key: "Dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "Plan", label: "Plan", icon: CalendarDays },
  { key: "Learn", label: "Learn", icon: BookOpen },
  { key: "Compare", label: "Compare", icon: GitCompareArrows },
  { key: "Practice", label: "Practice", icon: ClipboardList },
  { key: "Review", label: "Review", icon: RotateCcw },
  { key: "Skills", label: "Skills", icon: BarChart3 },
  { key: "Mock Exam", label: "Mock Exam", icon: TimerReset },
  { key: "Readiness", label: "Readiness", icon: Gauge },
] as const;

type View = (typeof tabs)[number]["key"];

export default function App() {
  const [activeTab, setActiveTab] = useState<View>("Dashboard");
  const [progress, setProgress] = useState<StudyProgress>(() => loadProgress());
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  const elapsedSeconds = getElapsedSeconds(progress.studySession, now);
  const planDay = getCurrentPlanDay(progress);

  const subtitle = useMemo(() => {
    if (activeTab === "Dashboard") return "Know what to study next";
    if (activeTab === "Plan") return "Fourteen days, one clear path";
    if (activeTab === "Learn") return "Understand first, then practise";
    if (activeTab === "Compare") return "Separate similar AWS services";
    if (activeTab === "Practice") return "Every option teaches you something";
    if (activeTab === "Review") return "Repeat what your brain resisted";
    if (activeTab === "Skills") return "Track domains, confidence, and mistakes";
    if (activeTab === "Mock Exam") return "Simulate pressure without panic";
    return "Use evidence, not vibes";
  }, [activeTab]);

  function addAttempt(attempt: Attempt) {
    setProgress((current) => ({ ...current, attempts: [...current.attempts, attempt] }));
  }

  function completeMockExam(attempts: Attempt[], mockExam: MockExamAttempt) {
    setProgress((current) => ({
      ...current,
      attempts: [...current.attempts, ...attempts],
      mockExams: [...current.mockExams, mockExam],
    }));
  }

  function resetProgress() {
    clearProgress();
    setProgress({
      ...emptyProgress,
      studySession: {
        running: false,
        accumulatedSeconds: 0,
        activeDate: new Date().toISOString().slice(0, 10),
      },
    });
  }

  function seedDemoProgress() {
    setProgress(createDemoProgress());
  }

  function startStudy() {
    const today = new Date().toISOString().slice(0, 10);
    setProgress((current) => ({
      ...current,
      studySession: {
        running: true,
        startedAt: new Date().toISOString(),
        accumulatedSeconds: current.studySession.activeDate === today ? current.studySession.accumulatedSeconds : 0,
        activeDate: today,
      },
    }));
  }

  function pauseStudy() {
    setProgress((current) => {
      const studiedSeconds = getElapsedSeconds(current.studySession);
      return {
        ...current,
        studySession: {
          running: false,
          accumulatedSeconds: studiedSeconds,
          activeDate: current.studySession.activeDate,
        },
      };
    });
  }

  function resumeStudy() {
    setProgress((current) => ({
      ...current,
      studySession: {
        ...current.studySession,
        running: true,
        startedAt: new Date().toISOString(),
      },
    }));
  }

  function stopStudy() {
    setProgress((current) => {
      const studiedSeconds = getElapsedSeconds(current.studySession);
      const activeDate = current.studySession.activeDate;
      const existingHistory = current.studyHistory.filter((entry) => entry.date !== activeDate);
      return {
        ...current,
        studySession: {
          running: false,
          accumulatedSeconds: studiedSeconds,
          activeDate,
        },
        studyHistory: [...existingHistory, { date: activeDate, studiedSeconds }].sort((a, b) => a.date.localeCompare(b.date)),
      };
    });
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">
          <GraduationCap size={28} />
          <div>
            <p className="eyebrow">AWS CLF-C02</p>
            <h1>CloudPrep</h1>
          </div>
        </div>
        <nav aria-label="Study sections">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} className={activeTab === tab.key ? "nav-item active" : "nav-item"} onClick={() => setActiveTab(tab.key)}>
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
        <button className="reset-button" onClick={resetProgress}>
          Reset progress
        </button>
        <button className="reset-button demo" onClick={seedDemoProgress}>
          <Sparkles size={16} />
          Demo mode
        </button>
      </aside>
      <section className="content-panel">
        {(elapsedSeconds > 0 || progress.studySession.running) ? (
          <StudyTimerBar
            progress={progress}
            targetMinutes={planDay.estimatedMinutes}
            elapsedSeconds={elapsedSeconds}
            onStart={startStudy}
            onPause={pauseStudy}
            onResume={resumeStudy}
            onStop={stopStudy}
          />
        ) : null}
        <header className="page-header">
          <div>
            <p className="eyebrow">Guided study system</p>
            <h2>{activeTab}</h2>
          </div>
          <p>{subtitle}</p>
        </header>

        {activeTab === "Dashboard" ? (
          <Dashboard
            progress={progress}
            elapsedSeconds={elapsedSeconds}
            onStartStudy={startStudy}
            onAddAttempt={addAttempt}
            onNavigate={(view) => setActiveTab(view as View)}
          />
        ) : null}
        {activeTab === "Plan" ? <StudyPlan progress={progress} onNavigate={(view) => setActiveTab(view as View)} /> : null}
        {activeTab === "Learn" ? <Learn /> : null}
        {activeTab === "Compare" ? <Compare /> : null}
        {activeTab === "Practice" ? <Practice onAddAttempt={addAttempt} /> : null}
        {activeTab === "Review" ? <MistakeReview progress={progress} onNavigatePractice={() => setActiveTab("Practice")} /> : null}
        {activeTab === "Skills" ? <SkillTracker progress={progress} /> : null}
        {activeTab === "Mock Exam" ? <MockExam onComplete={completeMockExam} /> : null}
        {activeTab === "Readiness" ? <Readiness progress={progress} /> : null}
      </section>
    </main>
  );
}
