import {
  ArrowRight,
  Boxes,
  BookOpen,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Code2,
  Gauge,
  Database,
  FolderOpen,
  Globe2,
  LayoutDashboard,
  ListChecks,
  Lock,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  Target,
  TerminalSquare,
  Trophy,
  UserRoundCog,
  Users
} from "lucide-react";
import { type ReactElement, useEffect, useMemo, useState } from "react";
import {
  allLessons,
  labs,
  quizQuestions,
  roadmapSections,
  zeroStartSteps,
  type InteractiveScenario,
  type Lesson,
  type QuizQuestion,
  type SkillArea,
  type StageKey
} from "./data";

type View = "dashboard" | "roadmap" | "lesson" | "scenario" | "lab" | "quiz" | "progress" | "glossary" | "records";

type UserAccount = {
  id: string;
  name: string;
  email?: string;
  createdAt?: string;
  tenantId?: string;
};

type MentorProgress = {
  stepByLesson: Record<number, number>;
  completedStepsByLesson: Record<number, string[]>;
  dismissedIntroByLesson: Record<number, boolean>;
  outputChecklistByLesson: Record<number, string[]>;
};

type MentorProgressUpdate = MentorProgress | ((current: MentorProgress) => MentorProgress);
type LessonTab = "overview" | "lab" | "deliverables" | "references";
type AssessmentLevel = "not-started" | "aware" | "practiced" | "production-ready" | "defense-ready";
type RubricScore = 0 | 1 | 2 | 3 | 4;

type LessonAssessment = {
  day: number;
  concept: RubricScore;
  implementation: RubricScore;
  verification: RubricScore;
  troubleshooting: RubricScore;
  communication: RubricScore;
  evidenceNotes: string;
  artifactRefs: string[];
  reviewedAt?: string;
  reviewer?: "self" | "mentor" | "system";
};

type StageAssessment = {
  stageKey: string;
  capstoneScore?: number;
  capstoneNotes?: string;
  levelOverride?: AssessmentLevel;
};

type ProgressState = {
  completedDays: number[];
  quizScores: number[];
  currentDay: number;
  onboardingDone: string[];
  mentor: MentorProgress;
  assessmentsByDay: Record<number, LessonAssessment>;
  stageAssessments: Record<string, StageAssessment>;
};

type StoredProgressState = Partial<Omit<ProgressState, "mentor">> & {
  mentor?: Partial<MentorProgress>;
};

type GlossaryItem = {
  term: string;
  zh: string;
  category: string;
  descZh: string;
  descEn: string;
};

const APP_RELEASE_TAG = "Release v2.3";

type Store = {
  users: UserAccount[];
  activeUserId: string | null;
  progressByUser: Record<string, ProgressState>;
};

const storageKey = "aws-lab-platform-store-v2";
const uiStateKey = "aws-lab-platform-ui-state-v1";
const restorableViews: View[] = ["dashboard", "roadmap", "lesson", "scenario", "lab", "quiz", "progress", "glossary", "records"];

type UiState = {
  view: View;
  selectedDay: number;
};

const normalizeDay = (day: unknown) => {
  const parsedDay = Number(day);
  if (!Number.isFinite(parsedDay)) return 1;
  return Math.min(30, Math.max(1, Math.round(parsedDay)));
};

const isRestorableView = (view: unknown): view is View => (
  typeof view === "string" && restorableViews.includes(view as View)
);

const parseHashUiState = (): Partial<UiState> => {
  const hash = window.location.hash.replace(/^#/, "");
  const lessonMatch = hash.match(/^\/lesson\/(\d+)$/);
  if (lessonMatch) {
    return { view: "lesson", selectedDay: normalizeDay(lessonMatch[1]) };
  }

  const viewMatch = hash.match(/^\/([a-z-]+)$/);
  if (viewMatch?.[1] === "admin") {
    return { view: "records" };
  }
  if (viewMatch && isRestorableView(viewMatch[1])) {
    return { view: viewMatch[1] };
  }

  return {};
};

const loadUiState = (): UiState => {
  const hashState = parseHashUiState();
  const raw = localStorage.getItem(uiStateKey);
  const storedState = raw ? JSON.parse(raw) as { view?: string; selectedDay?: unknown } : {};
  const legacyStoredView = storedState.view === "admin" ? "records" : storedState.view;
  const storedView = isRestorableView(legacyStoredView) ? legacyStoredView : "dashboard";
  return {
    view: hashState.view ?? storedView,
    selectedDay: normalizeDay(hashState.selectedDay ?? storedState.selectedDay ?? 1)
  };
};

const getUiHash = (view: View, selectedDay: number) => {
  if (view === "lesson") return `#/lesson/${normalizeDay(selectedDay)}`;
  return `#/${view}`;
};

const createEmptyMentorProgress = (): MentorProgress => ({
  stepByLesson: {},
  completedStepsByLesson: {},
  dismissedIntroByLesson: {},
  outputChecklistByLesson: {}
});

const createEmptyProgress = (): ProgressState => ({
  completedDays: [],
  quizScores: [],
  currentDay: 1,
  onboardingDone: [],
  mentor: createEmptyMentorProgress(),
  assessmentsByDay: {},
  stageAssessments: {}
});

const emptyProgress = createEmptyProgress();
const createLocalProfile = (name: string): UserAccount => ({
  id: `profile-${Date.now()}`,
  name: name.trim(),
  createdAt: new Date().toISOString()
});

const normalizeUserAccount = (user: Partial<UserAccount> & Record<string, unknown>): UserAccount => {
  const fallbackName = user.email === "admin@example.com" ? "AWS Demo Profile" : "Local Learner";
  return {
    id: user.id ?? `profile-${Date.now()}`,
    name: user.email === "admin@example.com" && /^admin/i.test(user.name ?? "") ? "AWS Demo Profile" : (user.name?.trim() || fallbackName),
    email: user.email,
    createdAt: user.createdAt,
    tenantId: user.tenantId
  };
};

const createInitialStore = (): Store => ({
  users: [],
  activeUserId: null,
  progressByUser: {}
});

const normalizeMentorProgress = (mentor?: Partial<MentorProgress>): MentorProgress => ({
  stepByLesson: mentor?.stepByLesson ?? {},
  completedStepsByLesson: mentor?.completedStepsByLesson ?? {},
  dismissedIntroByLesson: mentor?.dismissedIntroByLesson ?? {},
  outputChecklistByLesson: mentor?.outputChecklistByLesson ?? {}
});

const normalizeProgress = (progress?: StoredProgressState): ProgressState => ({
  completedDays: progress?.completedDays ?? [],
  quizScores: progress?.quizScores ?? [],
  currentDay: progress?.currentDay ?? 1,
  onboardingDone: progress?.onboardingDone ?? [],
  mentor: normalizeMentorProgress(progress?.mentor),
  assessmentsByDay: progress?.assessmentsByDay ?? {},
  stageAssessments: progress?.stageAssessments ?? {}
});

type ReadinessScore = {
  score: number;
  level: AssessmentLevel;
  label: string;
  labelEn: string;
  awsLevel: string;
  summary: string;
  gaps: string[];
  rubric: Record<"concept" | "implementation" | "verification" | "troubleshooting" | "communication", RubricScore>;
};

type StageReadiness = ReadinessScore & {
  key: string;
  title: string;
  titleEn: string;
  range: string;
  completedDays: number;
  totalDays: number;
  nextDay?: number;
};

type EvidenceDay = {
  day: number;
  title: string;
  stageKey: StageKey;
  implementation: boolean;
  verification: boolean;
  troubleshooting: boolean;
  score: number;
  status: AssessmentLevel;
  gaps: string[];
};

type SkillRadarDimension = {
  key: string;
  title: string;
  days: number[];
  score: number;
  level: AssessmentLevel;
  evidenceCount: number;
  total: number;
  nextDay?: number;
};

type ExamMappingSummary = {
  title: string;
  days: number[];
  coverage: number;
  note: string;
};

const assessmentLevelMeta: Record<AssessmentLevel, { label: string; labelEn: string; awsLevel: string; summary: string }> = {
  "not-started": {
    label: "尚無有效證據",
    labelEn: "Not Started",
    awsLevel: "Pre-Foundational",
    summary: "還沒有足夠 artifact 證明能力。"
  },
  aware: {
    label: "理解概念",
    labelEn: "Aware",
    awsLevel: "Foundational",
    summary: "看懂主題，但 implementation 或 verification 證據不足。"
  },
  practiced: {
    label: "已實作練習",
    labelEn: "Practiced",
    awsLevel: "Associate entry",
    summary: "有實作痕跡，但還需要更完整的驗證與排錯證據。"
  },
  "production-ready": {
    label: "可上線交付",
    labelEn: "Production Ready",
    awsLevel: "Associate ready",
    summary: "能交付 artifact、驗證結果，並保留 rollback/recovery 思路。"
  },
  "defense-ready": {
    label: "可答辯",
    labelEn: "Defense Ready",
    awsLevel: "Professional prep",
    summary: "能以架構審查語言說明 trade-off、風險與替代方案。"
  }
};

const levelForScore = (score: number): AssessmentLevel => {
  if (score >= 90) return "defense-ready";
  if (score >= 75) return "production-ready";
  if (score >= 60) return "practiced";
  if (score >= 40) return "aware";
  return "not-started";
};

const ratioScore = (value: number): RubricScore => {
  if (value >= 0.9) return 4;
  if (value >= 0.65) return 3;
  if (value >= 0.35) return 2;
  if (value > 0) return 1;
  return 0;
};

const weightedRubricScore = (rubric: ReadinessScore["rubric"]) => Math.round(
  (rubric.concept / 4) * 20
  + (rubric.implementation / 4) * 25
  + (rubric.verification / 4) * 25
  + (rubric.troubleshooting / 4) * 15
  + (rubric.communication / 4) * 15
);

const buildReadinessScore = (rubric: ReadinessScore["rubric"], gaps: string[]): ReadinessScore => {
  const score = weightedRubricScore(rubric);
  const level = levelForScore(score);
  const meta = assessmentLevelMeta[level];
  return {
    score,
    level,
    gaps,
    rubric,
    ...meta
  };
};

const estimateLessonReadiness = (lesson: Lesson, progress: ProgressState): ReadinessScore => {
  const completed = progress.completedDays.includes(lesson.day);
  const stepIds = progress.mentor.completedStepsByLesson[lesson.day] ?? [];
  const outputIds = progress.mentor.outputChecklistByLesson[lesson.day] ?? [];
  const stepRatio = lesson.mentorScript.guidedSteps.length ? stepIds.length / lesson.mentorScript.guidedSteps.length : 0;
  const outputRatio = lesson.mentorScript.deliverables.length ? outputIds.length / lesson.mentorScript.deliverables.length : 0;
  const hasQuizSignal = progress.quizScores.length > 0 && Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length) >= 75;

  const rubric = {
    concept: (completed ? 3 : ratioScore(stepRatio)) as RubricScore,
    implementation: ratioScore(Math.max(outputRatio, stepRatio * 0.75)),
    verification: ratioScore(completed && outputRatio > 0 ? outputRatio : outputRatio * 0.65),
    troubleshooting: ratioScore(stepRatio),
    communication: ratioScore((outputRatio + (hasQuizSignal ? 0.2 : 0)) / 1.2)
  };

  const gaps = [
    rubric.implementation < 3 ? "缺少可保存的實作 artifact，例如 diagram、runbook、config checklist。" : "",
    rubric.verification < 3 ? "缺少 verification evidence，例如 health check、CLI output、log 或 screenshot。" : "",
    rubric.troubleshooting < 3 ? "缺少 troubleshooting 證據：錯誤偵測、修復方式、rollback/recovery note。" : "",
    rubric.communication < 3 ? "缺少能向主管或面試官說明取捨的 architecture note。" : ""
  ].filter(Boolean);

  return buildReadinessScore(rubric, gaps);
};

const estimateStageReadiness = (progress: ProgressState): StageReadiness[] => roadmapSections.map((section) => {
  const lessons = allLessons.filter((lesson) => lesson.day >= section.startDay && lesson.day <= section.endDay);
  const completedDays = lessons.filter((lesson) => progress.completedDays.includes(lesson.day)).length;
  const lessonReadiness = lessons.map((lesson) => estimateLessonReadiness(lesson, progress));
  const avgLessonScore = lessonReadiness.length
    ? Math.round(lessonReadiness.reduce((sum, item) => sum + item.score, 0) / lessonReadiness.length)
    : 0;
  const quizAverage = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length)
    : 0;
  const evidenceCoverage = lessons.length
    ? Math.round((lessons.filter((lesson) => (progress.mentor.outputChecklistByLesson[lesson.day] ?? []).length > 0).length / lessons.length) * 100)
    : 0;
  const capstoneScore = progress.stageAssessments[section.key]?.capstoneScore ?? 0;
  const score = Math.round((avgLessonScore * 0.6) + (capstoneScore * 0.25) + (quizAverage * 0.1) + (evidenceCoverage * 0.05));
  const weakRubric = lessonReadiness.flatMap((item) => item.gaps);
  const uniqueGaps = Array.from(new Set(weakRubric)).slice(0, 3);
  const nextDay = lessons.find((lesson) => !progress.completedDays.includes(lesson.day))?.day;
  const level = progress.stageAssessments[section.key]?.levelOverride ?? levelForScore(score);
  const meta = assessmentLevelMeta[level];

  return {
    key: section.key,
    title: section.title,
    titleEn: section.titleEn,
    range: `Day ${section.startDay}-${section.endDay}`,
    completedDays,
    totalDays: lessons.length,
    nextDay,
    score,
    level,
    gaps: uniqueGaps.length ? uniqueGaps : ["目前階段已有基本證據，下一步補 capstone review。"],
    rubric: {
      concept: ratioScore(completedDays / Math.max(1, lessons.length)),
      implementation: ratioScore(evidenceCoverage / 100),
      verification: ratioScore(avgLessonScore / 100),
      troubleshooting: ratioScore(avgLessonScore >= 60 ? 0.6 : 0.25),
      communication: ratioScore(Math.max(capstoneScore, quizAverage) / 100)
    },
    ...meta
  };
});

const buildDailyEvidenceHeatmap = (progress: ProgressState): EvidenceDay[] => allLessons.map((lesson) => {
  const readiness = estimateLessonReadiness(lesson, progress);
  const outputCount = (progress.mentor.outputChecklistByLesson[lesson.day] ?? []).length;
  const completedStepCount = (progress.mentor.completedStepsByLesson[lesson.day] ?? []).length;
  const implementation = outputCount > 0 || readiness.rubric.implementation >= 3;
  const verification = progress.completedDays.includes(lesson.day) && readiness.rubric.verification >= 2;
  const troubleshooting = completedStepCount >= Math.ceil(lesson.mentorScript.guidedSteps.length * 0.6) || readiness.rubric.troubleshooting >= 3;

  return {
    day: lesson.day,
    title: lesson.title,
    stageKey: lesson.day <= 5 ? "deployment" : lesson.day <= 15 ? "advanced" : "deep-dive",
    implementation,
    verification,
    troubleshooting,
    score: readiness.score,
    status: readiness.level,
    gaps: readiness.gaps
  };
});

const skillRadarDefinitions = [
  { key: "docker", title: "Docker / Image Packaging", days: [1, 2, 3] },
  { key: "compute", title: "AWS Compute: EC2/ECS", days: [4, 8, 10] },
  { key: "networking", title: "Networking / ALB / Security Group", days: [6, 9, 16] },
  { key: "data", title: "Data Layer: RDS/S3/Redis", days: [5, 18, 19] },
  { key: "cicd", title: "CI/CD & Rollback", days: [7, 13, 14] },
  { key: "observability", title: "Observability", days: [15] },
  { key: "security", title: "Security & Governance", days: [11, 16, 26] },
  { key: "cost-dr", title: "Cost / DR / Architecture Defense", days: [23, 24, 28, 29, 30] }
];

const buildSkillRadar = (progress: ProgressState): SkillRadarDimension[] => skillRadarDefinitions.map((dimension) => {
  const readiness = dimension.days.map((day) => estimateLessonReadiness(allLessons[day - 1], progress));
  const score = readiness.length ? Math.round(readiness.reduce((sum, item) => sum + item.score, 0) / readiness.length) : 0;
  const evidenceCount = dimension.days.filter((day) => {
    const outputCount = (progress.mentor.outputChecklistByLesson[day] ?? []).length;
    return outputCount > 0 || progress.completedDays.includes(day);
  }).length;

  return {
    ...dimension,
    score,
    level: levelForScore(score),
    evidenceCount,
    total: dimension.days.length,
    nextDay: dimension.days.find((day) => !progress.completedDays.includes(day))
  };
});

const buildExamMappingSummary = (progress: ProgressState): ExamMappingSummary[] => {
  const evidenceDays = new Set(progress.completedDays);
  return [
    {
      title: "CloudOps Engineer Associate (SOA-C03)",
      days: [6, 8, 9, 10, 14, 15, 22, 24, 25],
      coverage: 0,
      note: "運維、監控、部署、擴展與故障排除。"
    },
    {
      title: "Solutions Architect Associate / SA Pro prep",
      days: [6, 8, 9, 12, 16, 23, 24, 28, 30],
      coverage: 0,
      note: "安全、可靠性、效能、成本與架構取捨。"
    },
    {
      title: "Developer Associate / DevOps Pro prep",
      days: [7, 10, 11, 13, 14, 18, 25, 26],
      coverage: 0,
      note: "部署、CI/CD、secret、migration、release governance。"
    },
    {
      title: "Security / SaaS / Portfolio Defense",
      days: [16, 17, 19, 21, 27, 29, 30],
      coverage: 0,
      note: "安全審查、租戶隔離、資料一致性、作品集答辯。"
    }
  ].map((item) => ({
    ...item,
    coverage: Math.round((item.days.filter((day) => evidenceDays.has(day)).length / item.days.length) * 100)
  }));
};

const loadStore = (): Store => {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return createInitialStore();

  const parsed = JSON.parse(raw) as Partial<Store> & {
    activeTenantId?: string | null;
    progressByTenant?: Record<string, StoredProgressState>;
    progressByUser?: Record<string, StoredProgressState>;
  };
  const users = ((parsed.users?.length ? parsed.users : []) as UserAccount[]).map(normalizeUserAccount);
  const legacyProgressByTenant = parsed.progressByTenant ?? {};
  const normalizedProgressByUser = Object.fromEntries(
    Object.entries(parsed.progressByUser ?? {}).map(([userId, progress]) => [userId, normalizeProgress(progress)])
  );
  const fallbackLegacyProgress = Object.values(legacyProgressByTenant)[0];
  if (!users.length && fallbackLegacyProgress) {
    users.push({ id: "profile-migrated", name: "Local Learner", createdAt: new Date().toISOString() });
  }
  users.forEach((user) => {
    if (normalizedProgressByUser[user.id]) return;
    const legacyTenantProgress = user.tenantId ? legacyProgressByTenant[user.tenantId] : undefined;
    const activeTenantProgress = parsed.activeTenantId ? legacyProgressByTenant[parsed.activeTenantId] : undefined;
    normalizedProgressByUser[user.id] = normalizeProgress(legacyTenantProgress ?? activeTenantProgress ?? fallbackLegacyProgress);
  });
  const activeUserId = users.some((user) => user.id === parsed.activeUserId)
    ? parsed.activeUserId ?? null
    : users[0]?.id ?? null;
  const activeUsers = activeUserId ? users.filter((user) => user.id === activeUserId) : [];

  return {
    users: activeUsers,
    activeUserId,
    progressByUser: activeUserId
      ? { [activeUserId]: normalizedProgressByUser[activeUserId] ?? createEmptyProgress() }
      : {}
  };
};

function App() {
  const [store, setStore] = useState<Store>(loadStore);
  const [initialUiState] = useState<UiState>(loadUiState);
  const [view, setView] = useState<View>(initialUiState.view);
  const [selectedDay, setSelectedDay] = useState(initialUiState.selectedDay);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);

  useEffect(() => {
    if (store.activeUserId || store.users.length) {
      localStorage.setItem(storageKey, JSON.stringify(store));
    } else {
      localStorage.removeItem(storageKey);
    }
  }, [store]);

  const activeUser = store.users.find((user) => user.id === store.activeUserId) ?? null;
  const progress = activeUser ? store.progressByUser[activeUser.id] ?? emptyProgress : emptyProgress;
  const lesson = allLessons.find((item) => item.day === selectedDay) ?? allLessons[0];
  const completion = Math.round((progress.completedDays.length / 30) * 100);
  const avgScore = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length)
    : 0;

  useEffect(() => {
    if (!activeUser) {
      localStorage.removeItem(uiStateKey);
      if (window.location.hash) {
        window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
      }
      return;
    }

    const nextUiState: UiState = { view, selectedDay };
    localStorage.setItem(uiStateKey, JSON.stringify(nextUiState));
    const nextHash = getUiHash(view, selectedDay);
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${nextHash}`);
    }
  }, [activeUser, selectedDay, view]);

  useEffect(() => {
    if (!activeUser) return;

    const syncUiStateFromHash = () => {
      const hashState = parseHashUiState();
      if (hashState.selectedDay) {
        setSelectedDay(hashState.selectedDay);
      }
      if (hashState.view) {
        setView(hashState.view);
      }
    };

    window.addEventListener("hashchange", syncUiStateFromHash);
    return () => window.removeEventListener("hashchange", syncUiStateFromHash);
  }, [activeUser]);

  const updateUserProgress = (nextProgress: ProgressState) => {
    if (!activeUser) return;
    setStore((prev) => ({
      ...prev,
      progressByUser: {
        ...prev.progressByUser,
        [activeUser.id]: nextProgress
      }
    }));
  };

  const updateMentorProgress = (mentorUpdate: MentorProgressUpdate) => {
    if (!activeUser) return;
    setStore((prev) => {
      const currentProgress = prev.progressByUser[activeUser.id] ?? createEmptyProgress();
      const nextMentor = typeof mentorUpdate === "function" ? mentorUpdate(currentProgress.mentor) : mentorUpdate;
      return {
        ...prev,
        progressByUser: {
          ...prev.progressByUser,
          [activeUser.id]: {
            ...currentProgress,
            mentor: nextMentor
          }
        }
      };
    });
  };

  const openLesson = (day: number) => {
    setSelectedDay(day);
    setView("lesson");
  };

  const markComplete = () => {
    const completedDays = progress.completedDays.includes(selectedDay)
      ? progress.completedDays
      : [...progress.completedDays, selectedDay].sort((a, b) => a - b);
    updateUserProgress({
      ...progress,
      completedDays,
      currentDay: Math.min(30, Math.max(progress.currentDay, selectedDay + 1))
    });
  };

  const toggleOnboarding = (id: string) => {
    const onboardingDone = progress.onboardingDone.includes(id)
      ? progress.onboardingDone.filter((item) => item !== id)
      : [...progress.onboardingDone, id];
    updateUserProgress({ ...progress, onboardingDone });
  };

  const submitQuiz = (questionIds?: string[]) => {
    const scopedQuestions = questionIds?.length
      ? quizQuestions.filter((question) => questionIds.includes(question.id))
      : quizQuestions;
    const correct = scopedQuestions.filter((question) => quizAnswers[question.id] === question.answer).length;
    const score = scopedQuestions.length ? Math.round((correct / scopedQuestions.length) * 100) : 0;
    setQuizResult(score);
    updateUserProgress({ ...progress, quizScores: [...progress.quizScores, score] });
  };

  const startLocalProfile = (name: string) => {
    const nextUser = createLocalProfile(name);
    setStore((prev) => ({
      users: [nextUser],
      activeUserId: nextUser.id,
      progressByUser: { [nextUser.id]: createEmptyProgress() }
    }));
    setSelectedDay(1);
    setView("dashboard");
  };

  const updateProfileName = (name: string) => {
    if (!activeUser) return;
    const nextName = name.trim();
    if (!nextName) return;
    setStore((prev) => ({
      ...prev,
      users: prev.users.map((user) => user.id === activeUser.id ? { ...user, name: nextName } : user)
    }));
  };

  const resetLocalProfile = () => {
    localStorage.removeItem(storageKey);
    localStorage.removeItem(uiStateKey);
    setStore(createInitialStore());
    setSelectedDay(1);
    setView("dashboard");
  };

  if (!activeUser) {
    return <ProfileSetup onStart={startLocalProfile} />;
  }

  const navItems = [
    ["dashboard", LayoutDashboard, "從0開始", "Start from Zero"],
    ["roadmap", CalendarDays, "30天路線圖", "30-Day Roadmap"],
    ["scenario", Cloud, "情境落地", "Scenario Onboarding"],
    ["lab", TerminalSquare, "互動模式", "Interactive Lab"],
    ["quiz", ClipboardCheck, "測驗模式", "Quiz Mode"],
    ["progress", Gauge, "學習歷程", "Learning Progress"],
    ["glossary", BookOpen, "名詞表", "Glossary"],
    ["records", UserRoundCog, "本機紀錄", "Local Records"]
  ] as const;
  const activeNavView = view === "lesson" ? "roadmap" : view;

  return (
    <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark"><Cloud size={22} /></div>
            <div>
              <strong>CloudLearn</strong>
              <span>AWS Docker Lab</span>
            </div>
            <span className="app-release-tag">{APP_RELEASE_TAG}</span>
          </div>
        <div className="mobile-shell-actions account-only" aria-label="Mobile account controls">
          <div className="mobile-account-chip">
            <span className="mobile-avatar">{activeUser.name.slice(0, 2).toUpperCase()}</span>
            <strong>{activeUser.name}</strong>
          </div>
        </div>
        <div className="local-record-card">
          <span>Local record</span>
          <strong>{activeUser.name}</strong>
          <small>Progress saved in this browser</small>
        </div>
        <nav className="app-nav" aria-label="Primary navigation">
          {navItems.map(([id, Icon, zh, en]) => (
            <button key={id} className={activeNavView === id ? "active" : ""} onClick={() => setView(id)}>
              <Icon size={18} />
              <span>{zh}<small>{en}</small></span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h1>AWS Docker Compose 30-Day Lab</h1>
            <p>{activeUser.name} · 使用 localStorage 保存學習歷程</p>
          </div>
          <div className="top-actions">
            <div className="user-chip">{activeUser.name.slice(0, 2).toUpperCase()}<span>{activeUser.name}</span></div>
          </div>
        </header>

        {view === "dashboard" && <Dashboard completion={completion} avgScore={avgScore} progress={progress} openLesson={openLesson} toggleOnboarding={toggleOnboarding} />}
        {view === "roadmap" && <Roadmap progress={progress} openLesson={openLesson} />}
        {view === "lesson" && <LessonView lesson={lesson} progress={progress} completed={progress.completedDays.includes(selectedDay)} markComplete={markComplete} setView={setView} openLesson={openLesson} mentorProgress={progress.mentor} updateMentorProgress={updateMentorProgress} />}
        {view === "scenario" && <ScenarioBuilder user={activeUser} />}
        {view === "lab" && <InteractiveLab openLesson={openLesson} />}
        {view === "quiz" && <QuizView currentDay={progress.currentDay} answers={quizAnswers} setAnswers={setQuizAnswers} result={quizResult} setQuizResult={setQuizResult} submitQuiz={submitQuiz} openLesson={openLesson} />}
        {view === "progress" && <ProgressView completion={completion} avgScore={avgScore} progress={progress} user={activeUser} openLesson={openLesson} />}
        {view === "glossary" && <Glossary />}
        {view === "records" && <LocalRecordsView store={store} activeUser={activeUser} progress={progress} updateProfileName={updateProfileName} resetLocalProfile={resetLocalProfile} />}
      </main>
    </div>
  );
}

function ProfileSetup({ onStart }: { onStart: (name: string) => void }) {
  const [name, setName] = useState("Cerry Learner");
  const [message, setMessage] = useState("");

  const submit = () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      setMessage("請先輸入顯示名稱 / Please enter a display name");
      return;
    }
    onStart(trimmedName);
  };

  return (
    <section className="profile-setup-shell">
      <div className="profile-setup-intro">
        <div className="brand-mark"><Cloud size={26} /></div>
        <h1>從 0 建立你的 AWS Docker Compose 學習環境</h1>
        <p>第一次使用只需要建立本機學習者。沒有註冊、沒有密碼、沒有後端，學習進度只保存在這台瀏覽器的 localStorage。</p>
        <div className="profile-setup-steps">
          {zeroStartSteps.slice(0, 3).map((step) => <div key={step.id}><CheckCircle2 size={18} /><span>{step.title}</span></div>)}
        </div>
      </div>
      <div className="profile-setup-card">
        <div className="profile-setup-heading">
          <UserRoundCog size={20} />
          <div>
            <strong>建立本機學習者 / Local Learner</strong>
            <span>這個名稱只用來顯示在學習紀錄與頁首。</span>
          </div>
        </div>
        <label>Name / 顯示名稱<input value={name} onChange={(event) => setName(event.target.value)} /></label>
        {message && <div className="error">{message}</div>}
        <button className="primary wide" onClick={submit}>開始學習 / Start Learning</button>
        <div className="notice">之後重新整理或回到本站時，系統會讀取 localStorage 並直接回到你的學習進度。</div>
      </div>
    </section>
  );
}

function Dashboard({ completion, avgScore, progress, openLesson, toggleOnboarding }: { completion: number; avgScore: number; progress: ProgressState; openLesson: (day: number) => void; toggleOnboarding: (id: string) => void }) {
  const currentLesson = allLessons[progress.currentDay - 1] ?? allLessons[0];

  return (
    <section className="zero-start-page">
      <div className="zero-hero">
        <div>
          <span className="zero-kicker">Start From Zero</span>
          <h2>從0開始部署準備</h2>
          <p>這一頁不是一般 dashboard，而是正式上 AWS 前的 5 步準備流程。先完成盤點、啟動、image、目標架構，再進入第一次部署。</p>
        </div>
        <div className="zero-status-card">
          <strong>{progress.onboardingDone.length}/5</strong>
          <span>準備步驟完成</span>
          <button className="primary" onClick={() => openLesson(progress.currentDay)}>進入 Day {progress.currentDay}</button>
        </div>
      </div>

      <div className="zero-layout">
        <div className="zero-flow-panel">
          <div className="zero-flow-header">
            <div>
              <strong>正式部署前，你要先完成哪 5 件事？</strong>
              <span>每一步都會產出一份 artifact，後面 30 天課程會重複使用。</span>
            </div>
            <div className="mini-progress"><span style={{ width: `${Math.round((progress.onboardingDone.length / 5) * 100)}%` }} /></div>
          </div>
          <div className="zero-flow">
            {zeroStartSteps.map((step, index) => {
              const done = progress.onboardingDone.includes(step.id);
              return (
                <button key={step.id} className={`zero-flow-step ${done ? "done" : ""}`} onClick={() => toggleOnboarding(step.id)}>
                  <span>{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.body}</p>
                    <small>{step.output}</small>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="zero-next-panel">
          <strong>目前推薦</strong>
          <div className="day-pill">Day {progress.currentDay}</div>
          <h3>{currentLesson.title}</h3>
          <p>{currentLesson.summary}</p>
          <div className="zero-output-box">
            <span>本日產出</span>
            <strong>{currentLesson.titleEn} artifact</strong>
          </div>
          <button className="primary wide" onClick={() => openLesson(progress.currentDay)}>開始 Day {progress.currentDay}</button>
        </aside>
      </div>

      <div className="artifact-strip">
        <div><ListChecks size={18} /><strong>Deployment Inventory</strong><span>知道本機服務有哪些</span></div>
        <div><TerminalSquare size={18} /><strong>Local Readiness</strong><span>確認本機可穩定啟動</span></div>
        <div><Boxes size={18} /><strong>Production Image</strong><span>準備可部署 image</span></div>
        <div><Cloud size={18} /><strong>AWS Target</strong><span>初步服務映射</span></div>
        <div><BookOpen size={18} /><strong>Runbook</strong><span>第一次部署流程</span></div>
      </div>

    </section>
  );
}

function Roadmap({ progress, openLesson }: { progress: ProgressState; openLesson: (day: number) => void }) {
  const isStageDone = (stage: { startDay: number; endDay: number }) => {
    return allLessons
      .filter((lesson) => lesson.day >= stage.startDay && lesson.day <= stage.endDay)
      .every((lesson) => progress.completedDays.includes(lesson.day));
  };

  const isStageCurrent = (stage: { startDay: number; endDay: number }) => {
    return progress.currentDay >= stage.startDay && progress.currentDay <= stage.endDay;
  };

  const jumpToStage = (stageKey: string) => {
    const target = document.getElementById(`roadmap-stage-${stageKey}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => target?.focus({ preventScroll: true }), 320);
  };

  return (
    <section className="stack">
      <SectionHeader title="30天課程路線圖 / 30-Day Roadmap" desc="Day 1-5 部署落地，Day 6-15 進階 production 化，Day 16-30 深入架構與營運。" />
      <section className="roadmap-overview" aria-labelledby="roadmap-overview-title">
        <div className="roadmap-section-title">
          <span>01</span>
          <div>
            <h3 id="roadmap-overview-title">階段總覽 / Learning Stages</h3>
            <p>先看 30 天被切成哪幾個能力階段。</p>
          </div>
        </div>
        <div className="stage-band">
          {roadmapSections.map((stage) => {
            const done = isStageDone(stage);
            const current = isStageCurrent(stage);
            return (
              <button
                type="button"
                key={stage.key}
                className={`stage-summary-card ${current ? "stage-current" : ""}`}
                onClick={() => jumpToStage(stage.key)}
                aria-label={`跳到 ${stage.title} Day ${stage.startDay} 到 Day ${stage.endDay} 每日進度`}
              >
                <strong>{stage.title}</strong>
                <span>{stage.titleEn}</span>
                <small>{stage.objective}</small>
                <strong className="stage-range">Day {stage.startDay} - Day {stage.endDay}</strong>
                <small>{done ? "已完成 / Completed" : current ? "目前進行中" : "尚未開始"}</small>
                <span className="stage-jump-hint">查看 Day {stage.startDay}-{stage.endDay} ↓</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="roadmap-daily" aria-labelledby="roadmap-daily-title">
        <div className="roadmap-section-title">
          <span>02</span>
          <div>
            <h3 id="roadmap-daily-title">每日進度 / Daily Lessons</h3>
            <p>每張 Day 卡片都可以進入當天教學與 mentor 引導。</p>
          </div>
        </div>
        <div className="roadmap-stages">
        {roadmapSections.map((stage) => {
          const lessons = allLessons.filter((lesson) => lesson.day >= stage.startDay && lesson.day <= stage.endDay);
          return (
            <section key={stage.key} id={`roadmap-stage-${stage.key}`} className="roadmap-stage" tabIndex={-1}>
              <div className="roadmap-stage-head">
                <div>
                  <h3>
                    Day {stage.startDay} - Day {stage.endDay} {stage.title}
                  </h3>
                  <p>{stage.objective}</p>
                </div>
              </div>
              <div className="roadmap-timeline">
                {lessons.map((lessonItem) => {
                  const done = progress.completedDays.includes(lessonItem.day);
                  const current = lessonItem.day === progress.currentDay;
                  return (
                    <button
                      key={lessonItem.day}
                      className={`lesson-card ${done ? "done" : ""} ${current ? "current" : ""}`}
                      onClick={() => openLesson(lessonItem.day)}
                    >
                      <span>Day {lessonItem.day}</span>
                      <strong>{lessonItem.title}</strong>
                      <small>{lessonItem.titleEn}</small>
                      <small>{lessonItem.duration} · {lessonItem.intensity}</small>
                      <small>今日目標：{lessonItem.mentorScript.todayGoal}</small>
                      <small>今日連結：{lessonItem.mentorScript.previousContext}</small>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        </div>
      </section>
    </section>
  );
}

type CompletionReviewCardId = "artifact" | "acceptance" | "pitfalls" | "readiness" | "finish";

const completionReviewCards: Array<{
  id: CompletionReviewCardId;
  step: string;
  label: string;
  purpose: string;
}> = [
  {
    id: "artifact",
    step: "1",
    label: "交付物",
    purpose: "先確認今天做出的 artifact 能不能被保存與延續。"
  },
  {
    id: "acceptance",
    step: "2",
    label: "驗收",
    purpose: "再對照完成標準，確認不是只看完文字。"
  },
  {
    id: "pitfalls",
    step: "3",
    label: "風險",
    purpose: "補上踩雷點與 recovery note，避免明天重踩。"
  },
  {
    id: "readiness",
    step: "4",
    label: "能力",
    purpose: "最後估算今天能力落點與缺少的證據。"
  },
  {
    id: "finish",
    step: "5",
    label: "完成",
    purpose: "全部確認後再標記本日完成或前往下一天。"
  }
];

function LessonView({
  lesson,
  progress,
  completed,
  markComplete,
  setView,
  openLesson,
  mentorProgress,
  updateMentorProgress
}: {
  lesson: Lesson;
  progress: ProgressState;
  completed: boolean;
  markComplete: () => void;
  setView: (view: View) => void;
  openLesson: (day: number) => void;
  mentorProgress: MentorProgress;
  updateMentorProgress: (mentorUpdate: MentorProgressUpdate) => void;
}) {
  const mentorScript = lesson.mentorScript;
  const steps = mentorScript.guidedSteps;
  const maxStepIndex = Math.max(0, steps.length - 1);
  const savedStepIndex = mentorProgress.stepByLesson[lesson.day] ?? 0;
  const stepIndex = Math.min(Math.max(savedStepIndex, 0), maxStepIndex);
  const currentStep = steps[stepIndex] ?? steps[0];
  const completedStepIds = mentorProgress.completedStepsByLesson[lesson.day] ?? [];
  const currentStepCompleted = currentStep ? completedStepIds.includes(currentStep.id) : false;
  const allStepsCompleted = steps.every((step) => completedStepIds.includes(step.id));
  const commandLines = lesson.command.split("\n").filter(Boolean);
  const readiness = estimateLessonReadiness(lesson, progress);
  const deliverableAnchorId = `lesson-deliverables-${lesson.day}`;
  const activeStepAnchorId = `lesson-active-step-${lesson.day}`;
  const flowAnchorId = `lesson-flow-${lesson.day}`;
  const nextStep = stepIndex < maxStepIndex ? steps[stepIndex + 1] : null;
  const [activeReviewCard, setActiveReviewCard] = useState<CompletionReviewCardId>("artifact");

  useEffect(() => {
    setActiveReviewCard("artifact");
  }, [lesson.day, allStepsCompleted]);

  const setStepIndex = (nextIndex: number) => {
    const boundedStepIndex = Math.min(Math.max(nextIndex, 0), maxStepIndex);
    updateMentorProgress((currentMentor) => ({
      ...currentMentor,
      stepByLesson: {
        ...currentMentor.stepByLesson,
        [lesson.day]: boundedStepIndex
      }
    }));
  };

  const scrollToFlow = () => {
    window.setTimeout(() => {
      const flowSection = document.getElementById(flowAnchorId);
      flowSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const selectStep = (nextIndex: number) => {
    setStepIndex(nextIndex);
  };

  const toggleCurrentStepComplete = () => {
    if (!currentStep) return;
    updateMentorProgress((currentMentor) => {
      const currentCompletedIds = currentMentor.completedStepsByLesson[lesson.day] ?? [];
      const isCompleted = currentCompletedIds.includes(currentStep.id);
      return {
        ...currentMentor,
        completedStepsByLesson: {
          ...currentMentor.completedStepsByLesson,
          [lesson.day]: isCompleted
            ? currentCompletedIds.filter((id) => id !== currentStep.id)
            : [...currentCompletedIds, currentStep.id]
        }
      };
    });
  };

  const outputProgress = mentorProgress.outputChecklistByLesson[lesson.day] ?? [];
  const isOutputDone = (item: string) => outputProgress.includes(item);

  const toggleOutput = (item: string) => {
    updateMentorProgress((currentMentor) => {
      const currentOutputs = currentMentor.outputChecklistByLesson[lesson.day] ?? [];
      const nextOutputs = currentOutputs.includes(item)
        ? currentOutputs.filter((entry) => entry !== item)
        : [...currentOutputs, item];

      return {
        ...currentMentor,
        outputChecklistByLesson: {
          ...currentMentor.outputChecklistByLesson,
          [lesson.day]: nextOutputs
        }
      };
    });
  };

  const scrollToDeliverables = () => {
    const deliverablesSection = document.getElementById(deliverableAnchorId);
    deliverablesSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const advanceFromCurrentStep = () => {
    if (stepIndex >= maxStepIndex) {
      scrollToDeliverables();
      return;
    }

    scrollToFlow();
    selectStep(stepIndex + 1);
  };

  const goToNextDay = () => {
    if (!completed) {
      markComplete();
    }
    if (lesson.day < 30) {
      openLesson(lesson.day + 1);
      return;
    }
    setView("progress");
  };

  return (
    <section className="lesson-workspace lesson-linear">
      <div className="lesson-main-flow">
        <SectionHeader title={`Day ${lesson.day}: ${lesson.title}`} desc={lesson.titleEn} />
        <div className="lesson-meta">
          <span>{lesson.phase}</span>
          <span>{lesson.intensity}</span>
          <span>{lesson.duration}</span>
        </div>

        <Panel title="今日主線 / Today's Path">
          <div className="lesson-story-grid">
            <article className="lesson-story-card">
              <span>情境</span>
              <strong>{mentorScript.scenario}</strong>
            </article>
            <article className="lesson-story-card">
              <span>今天目標</span>
              <strong>{mentorScript.todayGoal}</strong>
            </article>
            <article className="lesson-story-card">
              <span>下一步接續</span>
              <strong>{mentorScript.nextContext}</strong>
            </article>
          </div>
          <div className="mentor-callout lesson-why-callout">{mentorScript.whyItMatters}</div>
        </Panel>

        <ArchitectureMappingDiagram lesson={lesson} />
        <Panel title="今日實作流程">
          <div id={flowAnchorId} />
          <p className="lesson-flow-intro">先看完整步驟，再進入目前這一步。每個步驟都對應一個明確用途，不是測驗題，也不是只看完就算完成。</p>
          <LessonStepper steps={steps} activeIndex={stepIndex} completedStepIds={completedStepIds} setStepIndex={selectStep} />
          <p className="lesson-step-hint">點上方任一步驟卡，下面只會顯示該步驟對應的工作區與操作內容。</p>
        </Panel>

        {currentStep && (
          <div id={activeStepAnchorId}>
            <ActiveStepPanel
            lesson={lesson}
            step={currentStep}
            stepIndex={stepIndex}
            commandLines={commandLines}
            completed={currentStepCompleted}
            completeStep={toggleCurrentStepComplete}
            advanceStep={advanceFromCurrentStep}
            isLastStep={stepIndex >= maxStepIndex}
            nextStep={nextStep}
          />
          </div>
        )}

        {currentStep && <StepContextWorkspace lesson={lesson} step={currentStep} />}

        <section id={deliverableAnchorId} className="lesson-deliverable-stack">
          {allStepsCompleted ? (
            <>
              <Panel title="本日收尾整理 / Daily Wrap-up">
                <p className="lesson-flow-intro">流程步驟完成後，再用下方卡片逐格整理。這裡不一次攤開全部資訊，避免你在手機上被交付、驗收、風險與能力回顧同時打斷。</p>
                <div className="review-card-tabs" role="tablist" aria-label="Completion review cards">
                  {completionReviewCards.map((card) => (
                    <button
                      key={card.id}
                      className={activeReviewCard === card.id ? "active" : ""}
                      type="button"
                      role="tab"
                      aria-selected={activeReviewCard === card.id}
                      onClick={() => setActiveReviewCard(card.id)}
                    >
                      <span>{card.step}</span>
                      <strong>{card.label}</strong>
                    </button>
                  ))}
                </div>

                <div className="review-card-purpose">
                  {completionReviewCards.find((card) => card.id === activeReviewCard)?.purpose}
                </div>

                <div className="review-card-panel" role="tabpanel">
                  {activeReviewCard === "artifact" && (
                    <div className="review-card-content">
                      <h4>整理今日交付物</h4>
                      <p>先把今天做出的東西收好。這一步不是評分，而是確認你有留下能被回看、驗證、延續到下一天的 artifact。</p>
                      <div className="output-checklist output-checklist-main">
                        {mentorScript.deliverables.map((item, index) => {
                          const done = isOutputDone(item);
                          return (
                            <label key={`${item}-${index}`} className={`output-item ${done ? "done" : ""}`}>
                              <input type="checkbox" checked={done} onChange={() => toggleOutput(item)} />
                              <span>{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {activeReviewCard === "acceptance" && (
                    <div className="review-card-content">
                      <h4>對照驗收條件</h4>
                      <p>交付物整理完後，再檢查它是否真的符合今天的完成標準。這裡決定能不能標記本日完成。</p>
                      <Checklist items={lesson.acceptance} />
                    </div>
                  )}

                  {activeReviewCard === "pitfalls" && (
                    <div className="review-card-content">
                      <h4>回顧常見失誤與回復方式</h4>
                      <p>最後回頭看每一步最容易犯的錯，補上偵測方式或 recovery note，避免明天帶著今天的盲點繼續走。</p>
                      <div className="lesson-pitfall-list">
                        {mentorScript.guidedSteps.map((step) => (
                          <article key={step.id} className="lesson-pitfall-card">
                            <strong>{step.title}</strong>
                            <p>{step.commonMistake}</p>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeReviewCard === "readiness" && (
                    <div className="review-card-content">
                      <h4>最後能力回顧</h4>
                      <p>能力預估放在最後，是因為它應該根據你完成的交付、驗收與風險紀錄來判斷，而不是一開始就出現。</p>
                      <ReadinessEstimateBody readiness={readiness} />
                    </div>
                  )}

                  {activeReviewCard === "finish" && (
                    <div className="review-card-content">
                      <h4>完成這一天</h4>
                      <div className="checkline">
                        {completed ? <CheckCircle2 /> : <ListChecks />}
                        <span>{completed ? "這一天已標記完成，現在可以前往下一天或改做測驗。" : "交付、驗收、風險與能力回顧都看完後，再標記這一天完成。"}</span>
                      </div>
                      <div className="active-step-actions">
                        {completed ? (
                          <>
                            <button className="primary" onClick={goToNextDay}>{lesson.day < 30 ? `前往 Day ${lesson.day + 1}` : "前往學習歷程"}</button>
                            <button className="secondary" onClick={() => setView("quiz")}>開啟測驗 / Quiz</button>
                          </>
                        ) : (
                          <button className="primary" onClick={markComplete}>標記 Day 完成</button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Panel>

              {lesson.day === 30 && <CapstoneDefensePanel progress={progress} />}

              <details className="tab-accordion">
                <summary>需要查證時再看：參考資料</summary>
                <div className="lesson-support-grid">
                  <Panel title="Current AWS References / 當前 AWS 版本與來源提醒"><Checklist items={lesson.sourceNotes} /></Panel>
                  <Panel title="Exam Mapping / AWS 認證能力對照"><Checklist items={lesson.examMapping} /></Panel>
                  <Panel title="Project Spec Checklist / 專案規格核對"><Checklist items={lesson.documentSpec} /></Panel>
                </div>
              </details>
            </>
          ) : (
            <Panel title="完成上方流程後才展開">
              <div className="checkline">
                <ListChecks />
                <span>先完成上方流程卡的步驟，這裡才會展開交付、自我檢查、完成按鈕與參考資料。</span>
              </div>
            </Panel>
          )}
        </section>
      </div>
    </section>
  );
}

function LessonStepper({
  steps,
  activeIndex,
  completedStepIds,
  setStepIndex
}: {
  steps: Lesson["mentorScript"]["guidedSteps"];
  activeIndex: number;
  completedStepIds: string[];
  setStepIndex: (index: number) => void;
}) {
  const stepLabels = steps.map((step) => step.title);

  return (
    <div className="lesson-stepper" aria-label="Lesson steps">
      {steps.map((step, index) => {
        const isActive = index === activeIndex;
        const isDone = completedStepIds.includes(step.id);
        const statusLabel = isActive ? "目前查看" : isDone ? "已完成" : index === activeIndex + 1 ? "下一步" : "步驟";

        return (
          <button key={step.id} className={`${isActive ? "active" : ""} ${isDone ? "done" : ""}`} onClick={() => setStepIndex(index)}>
            <span>{index + 1}</span>
          <div>
            <strong>{stepLabels[index] ?? step.title}</strong>
            <small>{step.expectedResult}</small>
            <em>{statusLabel}</em>
          </div>
        </button>
        );
      })}
    </div>
  );
}

function ArchitectureMappingDiagram({ lesson }: { lesson: Lesson }) {
  type MappingRow = {
    local: string;
    detail: string;
    awsServices: { name: string; type: string }[];
    awsDetail: string;
    flow: string;
    icon: ReactElement;
    tone: string;
    badge?: string;
    emphasis?: "core" | "edge" | "data" | "ops" | "support";
  };
  type VisualSpec = {
    title: string;
    caption: string;
    className?: string;
    arrows: string[];
    nodes: {
      icon: ReactElement;
      label: string;
      title: string;
      detail: string;
      featured?: boolean;
    }[];
  };

  const deploymentDayIdentity = {
    day1: {
      versionTag: "DAY-01 / DEPLOYMENT INVENTORY",
      title: "從盤點到 mapping baseline",
      subtitle: "先把服務、port、volume、env 對齊，產生第一版 AWS 對應責任邊界。",
      rowLabels: ["服務盤點", "Port 邏輯", "Stateful 分析", "持久化責任", "交付清單"],
      rowNotes: ["你現在只要知道誰是程式、誰是資料", "暴露端口和內網端口先分開想", "確定要保留哪些 state", "先判斷本機可遺棄資料", "將輸出對應到交付文件"],
      className: "diagram-day-1"
    },
    day2: {
      versionTag: "DAY-02 / LOCAL VERIFICATION",
      title: "本機可驗證性先行",
      subtitle: "建立可重現的 production-like 本機證據，讓 diagram 有實際驗證依據。",
      rowLabels: ["啟動盤點", "跨服務互通", "防火牆邊界", "資料分級", "artifact 交付"],
      rowNotes: ["先做基本可跑，避免盲目上雲", "先確認每條連線是否必要", "把 ingress 與 SG 邏輯先對齊", "判斷可重建與可持久分離", "留住輸出可作為 Day2 驗收"],
      className: "diagram-day-2"
    },
    day3: {
      versionTag: "DAY-03 / IMAGE PACKAGING",
      title: "從開發環境到可交付鏡像",
      subtitle: "Dev bind mount 轉為可版本化 image，讓你能做回滾與重建。",
      rowLabels: ["Mount 盤點", "Image 建置", "Runtime 拆解", "前端輸出", "交付清單"],
      rowNotes: ["確認哪些檔案能被 package", "鏡像要可追溯且可回推", "運行時與建置時分開規劃", "dist 必須能被前端託管", "artifact 要可供後續 Day4 直接接軌"],
      className: "diagram-day-3"
    },
    day4: {
      versionTag: "DAY-04 / EC2 FIRST DEPLOY",
      title: "EC2 單體起跑，先確保上線可回滾",
      subtitle: "先把整條主線放到 EC2 運行，建立最小可用路徑，接著再拆 service。",
      rowLabels: ["整包遷移", "流量進入", "Runtime 佈署", "資料與快取", "SOP 操作"],
      rowNotes: ["今天核心是「能上線與能回退」", "先處理 domain 與 443/80", "避免一次做太多，先保留可運行閉環", "資料層先標註後續抽離點", "每次部署都要能用 rollback 撤回"],
      className: "diagram-day-4"
    },
    day5: {
      versionTag: "DAY-05 / SERVICE SEPARATION",
      title: "stateful service 開始抽離",
      subtitle: "將 DB、檔案、快取從 EC2 逐步轉到 managed service，避免單體依賴。",
      rowLabels: ["DB 外掛", "檔案外掛", "Queue 外掛", "機敏設定", "可維運基礎"],
      rowNotes: ["抽離後要能保留既有資料路徑", "檔案權限與生命週期先規劃", "非同步任務要可獨立伸縮", "機敏設定不再打在 image", "可維運不是 Day5 結尾才想起來的"],
      className: "diagram-day-5"
    }
  };

  const advancedIdentity = {
    versionTag: "ADVANCED PRODUCTION",
    title: "進階 Production 模式分層",
    subtitle: "從單一架構轉成可維運邊界（web / worker / data / observability）。",
    rowLabels: ["前端交付", "API 分流", "Worker 分離", "資料分層", "觀測落地"],
    rowNotes: ["Front-end 用 CDN 進行快取策略", "API 與 worker 明確分工", "排程與工作負載分離", "資料、安全與快取隔離", "部署與監控同時設計"],
    className: "diagram-day-advanced"
  };

  const deepIdentity = {
    versionTag: "DEEP DIVE",
    title: "深度營運與治理觀點",
    subtitle: "把架構敘事從部署執行，改為可被審查、可被回答的防守型能力。",
    rowLabels: ["邊界", "進入口", "服務分工", "資料治理", "觀測與 DR"],
    rowNotes: ["先定義誰能進去、什麼能做", "TLS、WAF 與授權先行", "明確 service boundary", "追蹤資料與快取責任", "事件與回復流程可稽核"],
    className: "diagram-day-deep"
  };

  const identity = lesson.phase === "Deployment"
    ? deploymentDayIdentity[`day${lesson.day}` as keyof typeof deploymentDayIdentity] ?? deploymentDayIdentity.day1
    : lesson.phase === "Advanced"
      ? advancedIdentity
      : deepIdentity;

  const deploymentDayMeta = {
    day1: {
      focusTag: "Deployment Inventory",
      focus: "盤點 services / ports / volumes / env，建立第一份 AWS mapping 基礎",
      serviceHints: ["S3", "CloudFront", "ECS", "RDS", "ElastiCache"],
      visualTheme: "phase-deploy"
    },
    day2: {
      focusTag: "Local Verification",
      focus: "建立 production-like 本機驗證證據，找出 ingress 與端口邊界",
      serviceHints: ["Compose", "Healthcheck", "Network", "Runbook"],
      visualTheme: "phase-deploy"
    },
    day3: {
      focusTag: "Image Packaging",
      focus: "把本機 bind mount 過渡到可版本化的 deployment artifact（image）",
      serviceHints: ["Dockerfile", "Image Tag", "Build Artifact"],
      visualTheme: "phase-deploy"
    },
    day4: {
      focusTag: "EC2 First Deploy",
      focus: "把現有 stack 先上 EC2，做到最小可行可用 + rollback 路徑",
      serviceHints: ["EC2", "Security Group", "Domain / SSL", "Rollout"],
      visualTheme: "phase-ec2"
    },
    day5: {
      focusTag: "Service Separation",
      focus: "資料層與檔案、設定、監控開始從 EC2 過渡到 managed service",
      serviceHints: ["RDS", "S3", "Queue/Worker", "CloudWatch"],
      visualTheme: "phase-deploy"
    }
  };

  const deploymentDefaultMeta = {
    focusTag: "Deployment Day",
    focus: "部署落地流程（服務盤點到可交付 artifact）",
    serviceHints: ["S3", "CloudFront", "ECS", "RDS", "ElastiCache"],
    visualTheme: "phase-deploy"
  };

  const phaseMeta = lesson.phase === "Deployment"
    ? deploymentDayMeta[`day${lesson.day}` as keyof typeof deploymentDayMeta] ?? deploymentDefaultMeta
    : lesson.phase === "Advanced"
      ? {
        focusTag: "Advanced Production",
        focus: "加深 network boundary、service 分離、CI/CD 與觀測能力",
        serviceHints: ["VPC", "ECS Fargate", "ALB", "CI/CD"],
        visualTheme: "phase-advanced"
      }
      : lesson.titleEn.includes("Security")
        ? {
          focusTag: "Deep Dive: Security",
          focus: "治理、安全、最小權限、可審計的運維邊界",
          serviceHints: ["IAM", "Secrets Manager", "CloudFront", "CloudWatch"],
          visualTheme: "phase-security"
        }
        : {
          focusTag: "Deep Dive Ops",
          focus: "營運、可觀測、成本與 DR 的 production-ready 能力",
          serviceHints: ["CloudFront", "ECS Fargate", "RDS", "S3", "CloudWatch"],
          visualTheme: "phase-deep"
        };

  const deploymentDayMapping: Record<string, MappingRow[]> = {
    day1: [
      {
        local: "React Frontend",
        detail: "client 容器",
        awsServices: [{ name: "Amazon S3", type: "s3" }, { name: "CloudFront", type: "cloudfront" }],
        awsDetail: "靜態檔案先落地到 object storage 與 CDN",
        flow: "Static Assets",
        icon: <Code2 />,
        tone: "react",
        badge: "1. 前端責任",
        emphasis: "support"
      },
      {
        local: "Laravel API",
        detail: "api 容器，Port 8000",
        awsServices: [{ name: "Amazon ECS", type: "ecs" }],
        awsDetail: "先用 compute service 思考 service boundary",
        flow: "API Requests",
        icon: <Boxes />,
        tone: "laravel",
        badge: "2. API 責任",
        emphasis: "core"
      },
      {
        local: "PostgreSQL",
        detail: "db 容器，Port 5432",
        awsServices: [{ name: "Amazon RDS", type: "rds" }],
        awsDetail: "先定義狀態資料邊界",
        flow: "SQL",
        icon: <Database />,
        tone: "postgres",
        badge: "3. 資料邊界",
        emphasis: "data"
      },
      {
        local: "Redis",
        detail: "cache/session 容器，Port 6379",
        awsServices: [{ name: "ElastiCache", type: "elasticache" }],
        awsDetail: "快取與 session 分層",
        flow: "Cache / Session",
        icon: <Server />,
        tone: "redis",
        badge: "4. Session / Cache",
        emphasis: "data"
      },
      {
        local: "Uploads / Files",
        detail: "upload 資料夾與 local volume",
        awsServices: [{ name: "Amazon S3", type: "s3" }],
        awsDetail: "盤點本機持久化責任",
        flow: "File Storage",
        icon: <FolderOpen />,
        tone: "uploads",
        badge: "5. 持久化檢核",
        emphasis: "support"
      }
    ],
    day2: [
      {
        local: "Compose 全域",
        detail: "services / ports / health 檢查",
        awsServices: [{ name: "Compose Health Plan", type: "ecs" }],
        awsDetail: "先建立 production-like 運行證據",
        flow: "Local Verification",
        icon: <TerminalSquare />,
        tone: "laravel",
        badge: "1. 盤點穩定性",
        emphasis: "support"
      },
      {
        local: "Frontend + API",
        detail: "本機跨服務互通驗證",
        awsServices: [{ name: "Internal Network", type: "ecs" }],
        awsDetail: "只驗證邏輯正確，不追求第一版 AWS 完整服務",
        flow: "Service Discovery",
        icon: <Boxes />,
        tone: "react",
        badge: "2. 內網互通",
        emphasis: "core"
      },
      {
        local: "Ports / Firewall",
        detail: "對外端口與內網端口盤點",
        awsServices: [{ name: "Security Group 先導向", type: "security" }],
        awsDetail: "提前對齊 EC2/ECS 後的入站規則邏輯",
        flow: "Ingress Design",
        icon: <Lock />,
        tone: "redis",
        badge: "3. 先規劃入站規則",
        emphasis: "edge"
      },
      {
        local: "Local Volumes",
        detail: "上傳、logs、db data 先分級",
        awsServices: [{ name: "Persistence Mapping", type: "rds" }],
        awsDetail: "標註可持久化與可重建資源",
        flow: "Data Audit",
        icon: <FolderOpen />,
        tone: "postgres",
        badge: "4. 持久化分類",
        emphasis: "data"
      },
      {
        local: "環境驗收",
        detail: "健康檢查、截圖、指令輸出",
        awsServices: [{ name: "Runbook", type: "ecs" }],
        awsDetail: "產出 Day2 可交付 artifact",
        flow: "Artifact",
        icon: <BookOpen />,
        tone: "uploads",
        badge: "5. 交付與驗證",
        emphasis: "ops"
      }
    ],
    day3: [
      {
        local: "Dev bind mount",
        detail: "本機直接 mount source",
        awsServices: [{ name: "Build Host", type: "ecs" }],
        awsDetail: "識別可打包與不可打包內容",
        flow: "Build Preparation",
        icon: <TerminalSquare />,
        tone: "laravel",
        badge: "1. 區分 build/run",
        emphasis: "support"
      },
      {
        local: "Dockerfile",
        detail: "composer install、cache、entrypoint",
        awsServices: [{ name: "Production Image", type: "ecs" }, { name: "Image Tagging", type: "ecs" }],
        awsDetail: "從開發 image 到可部署 artifact",
        flow: "Packaging",
        icon: <Code2 />,
        tone: "react",
        badge: "2. Image 可追溯",
        emphasis: "core"
      },
      {
        local: "Laravel app",
        detail: "source build + runtime separation",
        awsServices: [{ name: "CI/CD Registry", type: "ecs" }],
        awsDetail: "版本化 image 交付路徑",
        flow: "Artifact",
        icon: <Boxes />,
        tone: "postgres",
        badge: "3. 打包到 CI/CD",
        emphasis: "core"
      },
      {
        local: "Frontend Build",
        detail: "npm build 輸出 dist",
        awsServices: [{ name: "React dist", type: "s3" }],
        awsDetail: "為上線前 CDN/快取做準備",
        flow: "Build Output",
        icon: <Globe2 />,
        tone: "uploads",
        badge: "4. 前端輸出",
        emphasis: "support"
      },
      {
        local: "交付清單",
        detail: "image、環境變數、health 命令",
        awsServices: [{ name: "Runbook", type: "ecs" }],
        awsDetail: "形成可回溯的 Day3 artifact",
        flow: "Delivery",
        icon: <CheckCircle2 />,
        tone: "redis",
        badge: "5. 可回溯交付",
        emphasis: "ops"
      }
    ],
    day4: [
      {
        local: "TicketFactory Stack",
        detail: "react + api + redis + db 一起遷到 EC2",
        awsServices: [{ name: "EC2", type: "ec2" }, { name: "EBS", type: "ebs" }],
        awsDetail: "EC2 First Deploy：最小服務拆解策略",
        flow: "Migration",
        icon: <Building2 />,
        tone: "laravel",
        badge: "1. EC2 主線入口",
        emphasis: "core"
      },
      {
        local: "入口流量",
        detail: "80/443 對外、內部服務走 container port",
        awsServices: [{ name: "Security Group", type: "security" }, { name: "NAT/Route", type: "security" }],
        awsDetail: "先做最小可上線的 network edge",
        flow: "Routing",
        icon: <Globe2 />,
        tone: "react",
        badge: "2. 邊界收斂",
        emphasis: "edge"
      },
      {
        local: "Web + API Runtime",
        detail: "Nginx+PHP-FPM 共存於 EC2",
        awsServices: [{ name: "EC2 Runtime", type: "ec2" }],
        awsDetail: "先完成端到端功能流",
        flow: "Request Path",
        icon: <Server />,
        tone: "postgres",
        badge: "3. Runtime 主幹",
        emphasis: "core"
      },
      {
        local: "資料與快取",
        detail: "db/queue/stored file 暫留在本機",
        awsServices: [{ name: "PostgreSQL", type: "rds" }, { name: "ElastiCache", type: "elasticache" }, { name: "S3", type: "s3" }],
        awsDetail: "Day5 及之後才正式抽離 managed 服務",
        flow: "Stateful",
        icon: <Database />,
        tone: "uploads",
        badge: "4. 還留資料責任",
        emphasis: "data"
      },
      {
        local: "部署流程",
        detail: "ssh deploy + restart + rollback",
        awsServices: [{ name: "Run Command", type: "ecs" }, { name: "Rollback", type: "ecs" }],
        awsDetail: "先可復原，不追求零停機",
        flow: "Operational",
        icon: <TerminalSquare />,
        tone: "redis",
        badge: "5. 回滾腳本",
        emphasis: "ops"
      }
    ],
    day5: [
      {
        local: "DB 資料層",
        detail: "compose 中的 db 服務抽離",
        awsServices: [{ name: "RDS", type: "rds" }],
        awsDetail: "資料庫與備份責任交給 managed service",
        flow: "Data Migration",
        icon: <Database />,
        tone: "postgres",
        badge: "1. 資料抽離",
        emphasis: "data"
      },
      {
        local: "檔案儲存",
        detail: "local /storage 搬離",
        awsServices: [{ name: "S3", type: "s3" }, { name: "Lifecycle Policy", type: "s3" }],
        awsDetail: "上傳檔與公共資源分流管理",
        flow: "Object Storage",
        icon: <FolderOpen />,
        tone: "uploads",
        badge: "2. 檔案外掛",
        emphasis: "data"
      },
      {
        local: "Queue / Worker",
        detail: "redis 與隊列邏輯獨立規劃",
        awsServices: [{ name: "ElastiCache", type: "elasticache" }, { name: "ECS Worker", type: "ecs" }],
        awsDetail: "將非同步工作逐步抽出",
        flow: "Decouple",
        icon: <Server />,
        tone: "redis",
        badge: "3. Worker 分流",
        emphasis: "core"
      },
      {
        local: "機敏設定",
        detail: "APP_KEY/DB password/env 分離",
        awsServices: [{ name: "Secrets Manager", type: "ecs" }, { name: "SSM", type: "ecs" }],
        awsDetail: "進階到可審計的 config 治理",
        flow: "Secret",
        icon: <Lock />,
        tone: "laravel",
        badge: "4. 機敏設定",
        emphasis: "ops"
      },
      {
        local: "持續營運基礎",
        detail: "監控、日誌、回滾演練",
        awsServices: [{ name: "CloudWatch", type: "ecs" }],
        awsDetail: "Day5 收斂：從 demo 到可維運",
        flow: "Ops Baseline",
        icon: <Gauge />,
        tone: "uploads",
        badge: "5. 監控與回滾",
        emphasis: "ops"
      }
    ]
  };

  const advancedOrDeepMappingByDay = (() => {
    if (lesson.phase === "Advanced") {
      return [
        {
          local: "Frontend",
          detail: "靜態檔案 / SPA",
          awsServices: [{ name: "S3", type: "s3" }, { name: "CloudFront", type: "cloudfront" }],
        awsDetail: "前端資源與快取策略",
        flow: "HTTP(S)",
        icon: <Code2 />,
        tone: "react",
        badge: "1. 前端輸出",
        emphasis: "support"
      },
        {
          local: "Laravel Web",
          detail: "前後端整合 API",
          awsServices: [{ name: "ALB", type: "ecs" }, { name: "ECS Fargate", type: "ecs" }],
        awsDetail: "API Gateway 與容器執行",
        flow: "Route 到 API",
        icon: <Boxes />,
        tone: "laravel",
        badge: "2. 分離 API",
        emphasis: "core"
      },
        {
          local: "Queue Worker",
          detail: "Queue / Scheduler",
          awsServices: [{ name: "ECS (Worker)", type: "ecs" }],
        awsDetail: "背景任務獨立服務",
        flow: "Jobs",
        icon: <Server />,
        tone: "redis",
        badge: "3. Worker",
        emphasis: "core"
      },
        {
          local: "資料層",
          detail: "RDS、S3、快取",
          awsServices: [{ name: "RDS", type: "rds" }, { name: "S3", type: "s3" }, { name: "ElastiCache", type: "elasticache" }],
        awsDetail: "交易、檔案、session 分流",
        flow: "Stateful",
        icon: <Database />,
        tone: "postgres",
        badge: "4. 資料分層",
        emphasis: "data"
      },
        {
          local: "觀測與部署",
          detail: "CI/CD 與 Logs/Metrics",
          awsServices: [{ name: "ECS", type: "ecs" }],
        awsDetail: "部署、監控、回滾",
        flow: "Operational",
        icon: <TerminalSquare />,
        tone: "uploads",
        badge: "5. 可操作性",
        emphasis: "ops"
      }
    ];
    }

    if (lesson.phase === "Deep Dive" && lesson.titleEn.includes("Security")) {
      return [
        {
          local: "Security Boundary",
          detail: "IAM、Policy、Secret、Role",
          awsServices: [{ name: "IAM", type: "security" }, { name: "Secrets Manager", type: "security" }],
        awsDetail: "最低權限與審計追蹤",
        flow: "Policy",
        icon: <ShieldCheck />,
        tone: "laravel",
        badge: "1. 政策與授權",
        emphasis: "edge"
      },
        {
          local: "Ingress / WAF / TLS",
          detail: "憑證、授權、邊界",
          awsServices: [{ name: "CloudFront", type: "cloudfront" }],
        awsDetail: "HTTPS 與 WAF 入口治理",
        flow: "Traffic",
        icon: <Globe2 />,
        tone: "react",
        badge: "2. 外部通道",
        emphasis: "edge"
      },
        {
          local: "Service Separation",
          detail: "Web / API / Worker 分工",
          awsServices: [{ name: "ECS Fargate", type: "ecs" }],
        awsDetail: "最小權限執行與可維護性",
        flow: "Role Separation",
        icon: <Boxes />,
        tone: "postgres",
        badge: "3. 分工邊界",
        emphasis: "core"
      },
        {
          local: "Storage & State",
          detail: "RDS、S3、ElastiCache",
          awsServices: [{ name: "RDS", type: "rds" }, { name: "S3", type: "s3" }, { name: "ElastiCache", type: "elasticache" }],
        awsDetail: "營運可追蹤的資料邊界",
        flow: "Data + Cache",
        icon: <Database />,
        tone: "redis",
        badge: "4. 資料與快取",
        emphasis: "data"
      },
        {
          local: "Ops & DR",
          detail: "Logs、Alarm、Cost",
          awsServices: [{ name: "CloudWatch", type: "ecs" }],
        awsDetail: "事件響應與成本治理",
        flow: "Observability",
        icon: <Gauge />,
        tone: "uploads",
        badge: "5. DR 觀測",
        emphasis: "ops"
      }
    ];
    }

    return [
      {
        local: "Traffic Ingress",
        detail: "ACM + Domain + WAF",
        awsServices: [{ name: "CloudFront", type: "cloudfront" }],
        awsDetail: "安全、憑證與快取策略",
        flow: "HTTPS",
        icon: <Globe2 />,
        tone: "react",
        badge: "1. HTTPS 首站",
        emphasis: "edge"
      },
      {
        local: "Application",
        detail: "Web/API 服務分離",
        awsServices: [{ name: "ECS Fargate", type: "ecs" }],
        awsDetail: "web、worker、scheduler 分工",
        flow: "Service Mesh / API",
        icon: <Boxes />,
        tone: "laravel",
        badge: "2. service 分層",
        emphasis: "core"
      },
      {
        local: "Storage & State",
        detail: "RDS、S3、ElastiCache",
        awsServices: [{ name: "RDS", type: "rds" }, { name: "S3", type: "s3" }, { name: "ElastiCache", type: "elasticache" }],
        awsDetail: "資料持久性與彈性",
        flow: "Data + Cache",
        icon: <Database />,
        tone: "postgres",
        badge: "3. stateful 分離",
        emphasis: "data"
      },
      {
        local: "Security & Compliance",
        detail: "Secret、IAM、Policy、Role",
        awsServices: [{ name: "Secrets Manager", type: "ecs" }, { name: "IAM", type: "ecs" }],
        awsDetail: "最小權限、審計與機密管理",
        flow: "Access Control",
        icon: <ShieldCheck />,
        tone: "redis",
        badge: "4. 機敏治理",
        emphasis: "edge"
      },
      {
        local: "Ops & DR",
        detail: "Logs、Alarm、Cost",
        awsServices: [{ name: "CloudWatch", type: "ecs" }],
        awsDetail: "故障發現、回滾與成本治理",
        flow: "Observability",
        icon: <Gauge />,
        tone: "uploads",
        badge: "5. 事件演練",
        emphasis: "ops"
      }
    ];
  })();

  const rows =
    lesson.phase === "Deployment"
      ? deploymentDayMapping[`day${lesson.day}` as keyof typeof deploymentDayMapping]
        ?? deploymentDayMapping.day1
      : advancedOrDeepMappingByDay;

  const visualSpecs: Record<number, VisualSpec> = {
    2: {
      title: "本機 production-like 驗證路徑",
      caption: "Day2 不是再盤點，而是證明 stack 能在可重現條件下啟動、互通、留下驗證證據。",
      className: "verification-visual",
      arrows: ["healthcheck", "evidence"],
      nodes: [
        { icon: <TerminalSquare />, label: "docker compose up", title: "本機啟動", detail: "先確認 stack 可重現啟動" },
        { icon: <Boxes />, label: "service network", title: "服務互通", detail: "frontend / api / db / redis 互連", featured: true },
        { icon: <ClipboardCheck />, label: "runbook proof", title: "驗證證據", detail: "指令、截圖、log 留下來" }
      ]
    },
    3: {
      title: "從開發 mount 轉成 production image",
      caption: "Day3 的圖要看懂 build-time 與 run-time 分離，並留下可回滾的 image tag。",
      className: "image-visual",
      arrows: ["Dockerfile", "tag"],
      nodes: [
        { icon: <FolderOpen />, label: "source", title: "移除 dev mount", detail: "辨識哪些檔案要進 image" },
        { icon: <Code2 />, label: "build stage", title: "Production Image", detail: "composer / npm build / cache", featured: true },
        { icon: <Boxes />, label: "artifact", title: "可回滾版本", detail: "image tag + release note" }
      ]
    },
    6: {
      title: "VPC 分層與私有網路邊界",
      caption: "Day6 從一台 EC2 的單一邊界，轉成 public / private subnet 與資料層隔離。",
      className: "network-visual",
      arrows: ["route", "private only"],
      nodes: [
        { icon: <Globe2 />, label: "Public Subnet", title: "ALB / ingress", detail: "只有入口層暴露到 Internet" },
        { icon: <ShieldCheck />, label: "Private Subnet", title: "App tasks", detail: "Laravel web / worker 放在私有層", featured: true },
        { icon: <Database />, label: "Data Subnet", title: "RDS / Redis", detail: "資料層只接受 app security group" }
      ]
    },
    7: {
      title: "ECR image 版本治理",
      caption: "Day7 關鍵不是 push image 而已，而是 commit SHA、rollback tag 與 registry 責任清楚。",
      className: "image-visual",
      arrows: ["push SHA tag", "promote"],
      nodes: [
        { icon: <Code2 />, label: "local build", title: "Production Image", detail: "由 Day3 artifact 延伸" },
        { icon: <Boxes />, label: "Amazon ECR", title: "版本倉庫", detail: "commit SHA / release tag / immutable reference", featured: true },
        { icon: <ClipboardCheck />, label: "rollback", title: "回滾依據", detail: "知道上一版 image 是哪一個" }
      ]
    },
    8: {
      title: "Laravel Web 從 EC2 搬到 ECS Fargate",
      caption: "Day8 聚焦 web runtime 的 service boundary，先把 HTTP request 跑在 ECS service。",
      className: "compute-visual",
      arrows: ["task definition", "service"],
      nodes: [
        { icon: <Building2 />, label: "EC2 compose", title: "原本 web runtime", detail: "Nginx / PHP-FPM 還在同機器思維" },
        { icon: <Boxes />, label: "ECS Fargate", title: "Web Service", detail: "task definition + desired count", featured: true },
        { icon: <Gauge />, label: "deployment", title: "Service event", detail: "用 ECS events 驗證 rollout" }
      ]
    },
    9: {
      title: "ALB health check 閘門",
      caption: "Day9 把流量入口、target group 與 readiness endpoint 串起來，解釋 502/unhealthy 的來源。",
      className: "edge-visual",
      arrows: ["/health", "healthy target"],
      nodes: [
        { icon: <Globe2 />, label: "ALB", title: "入口負載平衡", detail: "接收 HTTP(S) traffic" },
        { icon: <Target />, label: "Target Group", title: "健康檢查", detail: "path / port / SG 必須吻合", featured: true },
        { icon: <Boxes />, label: "ECS Task", title: "Laravel readiness", detail: "/health 回 200 才接流量" }
      ]
    },
    10: {
      title: "Worker / Scheduler 從 Web 拆出",
      caption: "Day10 圖表要看懂 web request、queue worker、scheduler 是三種不同 runtime。",
      className: "worker-visual",
      arrows: ["dispatch job", "process async"],
      nodes: [
        { icon: <Boxes />, label: "Web Service", title: "接收請求", detail: "只處理 HTTP request" },
        { icon: <Server />, label: "Queue", title: "Job buffer", detail: "Redis/SQS 承接非同步任務" },
        { icon: <TerminalSquare />, label: "Worker Service", title: "Horizon / Scheduler", detail: "獨立 scaling 與 restart", featured: true }
      ]
    },
    11: {
      title: "Secrets 不進 image",
      caption: "Day11 要把 APP_KEY、DB password、Redis password 從 image/env 檔轉成可審計的 secret reference。",
      className: "security-visual",
      arrows: ["reference", "inject at runtime"],
      nodes: [
        { icon: <Lock />, label: ".env secrets", title: "本機機敏設定", detail: "先分類 secret / config" },
        { icon: <ShieldCheck />, label: "Secrets Manager / SSM", title: "機敏資料來源", detail: "權限由 IAM task role 控制", featured: true },
        { icon: <Boxes />, label: "ECS Task", title: "Runtime injection", detail: "部署時讀取，不 bake into image" }
      ]
    },
    12: {
      title: "React 靜態檔案發佈到 CDN",
      caption: "Day12 是 frontend delivery：dist、S3 bucket、CloudFront cache 與 API URL 要一起看。",
      className: "frontend-visual",
      arrows: ["upload dist", "cache + invalidate"],
      nodes: [
        { icon: <Code2 />, label: "React build", title: "npm build", detail: "產出 dist artifact" },
        { icon: <FolderOpen />, label: "S3", title: "Static hosting origin", detail: "保存 build output" },
        { icon: <Globe2 />, label: "CloudFront", title: "CDN delivery", detail: "cache policy / invalidation / API base URL", featured: true }
      ]
    },
    13: {
      title: "GitHub Actions 部署管線",
      caption: "Day13 要把 build、push ECR、render task definition、deploy ECS 串成可審查流程。",
      className: "pipeline-visual",
      arrows: ["build & push", "deploy gate"],
      nodes: [
        { icon: <Code2 />, label: "Git push", title: "Source trigger", detail: "main / tag / manual dispatch" },
        { icon: <Boxes />, label: "ECR + Task Definition", title: "可追溯 artifact", detail: "commit SHA image tag", featured: true },
        { icon: <Cloud />, label: "ECS Deploy", title: "Service rollout", detail: "deploy + wait + verify" }
      ]
    },
    14: {
      title: "零停機部署的順序設計",
      caption: "Day14 關鍵是 health gate、rolling update、migration order，而不是只按 deploy。",
      className: "release-visual",
      arrows: ["rolling update", "health gate"],
      nodes: [
        { icon: <Database />, label: "migration", title: "先相容資料結構", detail: "expand-contract 或 feature flag" },
        { icon: <Boxes />, label: "ECS rolling", title: "新舊 task 並行", detail: "minimum healthy percent", featured: true },
        { icon: <Gauge />, label: "verify", title: "觀察再收斂", detail: "health / logs / rollback window" }
      ]
    },
    15: {
      title: "可觀測性 baseline",
      caption: "Day15 不是只有看 log，而是把 logs、metrics、alarms 與部署後驗收串起來。",
      className: "ops-visual",
      arrows: ["emit", "alert"],
      nodes: [
        { icon: <Boxes />, label: "App / ALB / RDS", title: "訊號來源", detail: "request / error / latency / db" },
        { icon: <Gauge />, label: "CloudWatch", title: "Logs + Metrics", detail: "log group / dashboard / alarm", featured: true },
        { icon: <ClipboardCheck />, label: "Acceptance", title: "部署後檢查", detail: "用指標決定是否 rollback" }
      ]
    },
    16: {
      title: "Production Security Hardening",
      caption: "Day16 從公開入口、IAM role、secret、Laravel runtime config 四個面向收斂風險。",
      className: "security-visual",
      arrows: ["least privilege", "harden runtime"],
      nodes: [
        { icon: <ShieldCheck />, label: "Security Group", title: "網路最小開放", detail: "ALB to ECS, ECS to RDS only" },
        { icon: <Lock />, label: "IAM / Secrets", title: "權限與機敏治理", detail: "task role / APP_DEBUG=false", featured: true },
        { icon: <ClipboardCheck />, label: "Security checklist", title: "可審查輸出", detail: "CORS / headers / Redis password" }
      ]
    },
    17: {
      title: "Multi-tenant 資料隔離",
      caption: "Day17 的圖要看 tenant context 如何流經 auth、資料查詢、progress 與 admin dashboard。",
      className: "tenant-visual",
      arrows: ["scope", "isolate"],
      nodes: [
        { icon: <Users />, label: "Tenant / User", title: "租戶上下文", detail: "登入後帶出 tenant scope" },
        { icon: <Database />, label: "Data Access", title: "資料隔離", detail: "query 必須帶 tenant_id", featured: true },
        { icon: <LayoutDashboard />, label: "Admin / Progress", title: "租戶化介面", detail: "不同 tenant 看到不同進度" }
      ]
    },
    18: {
      title: "RDS migration 與 rollback 策略",
      caption: "Day18 讓 schema change 變成可備份、可回復、可審查的操作，而不是 artisan migrate 直衝。",
      className: "data-visual",
      arrows: ["backup", "migrate safely"],
      nodes: [
        { icon: <Database />, label: "RDS snapshot", title: "變更前備份", detail: "定義 rollback point" },
        { icon: <TerminalSquare />, label: "Migration gate", title: "Expand / Contract", detail: "先相容再移除舊欄位", featured: true },
        { icon: <ClipboardCheck />, label: "Verification", title: "資料驗證", detail: "query / app / worker 都要確認" }
      ]
    },
    19: {
      title: "S3 Upload 與 Signed URL",
      caption: "Day19 要看懂 private object、短效 URL、Laravel signer 與 bucket policy 的責任分界。",
      className: "storage-visual",
      arrows: ["request URL", "direct upload"],
      nodes: [
        { icon: <Boxes />, label: "Laravel API", title: "簽發 URL", detail: "驗證 user / tenant / permission" },
        { icon: <FolderOpen />, label: "Private S3", title: "Object storage", detail: "不公開 bucket，使用 presigned URL", featured: true },
        { icon: <ShieldCheck />, label: "Policy", title: "存取治理", detail: "TTL / content type / object key" }
      ]
    },
    20: {
      title: "WebSocket / Reverb 上 AWS",
      caption: "Day20 圖表要把 HTTP API 與 WebSocket 長連線分開看，並標示 Redis pub/sub 的角色。",
      className: "edge-visual",
      arrows: ["upgrade", "publish"],
      nodes: [
        { icon: <Globe2 />, label: "ALB WebSocket", title: "連線入口", detail: "支援 upgrade 與 timeout 設定" },
        { icon: <Server />, label: "Reverb service", title: "長連線 runtime", detail: "與 web/API 分離考慮", featured: true },
        { icon: <Database />, label: "Redis Pub/Sub", title: "事件廣播", detail: "跨 task 傳遞即時事件" }
      ]
    },
    21: {
      title: "高併發訂票一致性",
      caption: "Day21 不只是 scaling，重點是 lock、transaction、queue 在搶票情境如何避免超賣。",
      className: "consistency-visual",
      arrows: ["lock", "commit / enqueue"],
      nodes: [
        { icon: <Users />, label: "Burst traffic", title: "大量搶票請求", detail: "同一座位同時被請求" },
        { icon: <Lock />, label: "Redis lock + DB tx", title: "一致性核心", detail: "鎖定、檢查、提交不可分離", featured: true },
        { icon: <Server />, label: "Queue confirmation", title: "非同步通知", detail: "付款、通知、票券發送後置" }
      ]
    },
    22: {
      title: "Autoscaling capacity model",
      caption: "Day22 圖要能說明 request count、CPU/memory、queue depth 分別觸發哪一種擴展。",
      className: "scale-visual",
      arrows: ["metric", "scale policy"],
      nodes: [
        { icon: <Gauge />, label: "Metrics", title: "負載訊號", detail: "CPU / memory / ALB request / queue depth" },
        { icon: <Boxes />, label: "ECS Scaling", title: "Web / Worker 分開擴", detail: "desired count by workload", featured: true },
        { icon: <Target />, label: "Capacity test", title: "容量驗證", detail: "知道瓶頸在哪裡" }
      ]
    },
    23: {
      title: "成本拆解與優化",
      caption: "Day23 圖表要把 NAT、RDS、Fargate、CloudWatch、CloudFront 的成本來源拆開。",
      className: "cost-visual",
      arrows: ["attribute", "optimize"],
      nodes: [
        { icon: <Search />, label: "Cost Explorer", title: "找出成本來源", detail: "service / tag / environment" },
        { icon: <Cloud />, label: "Cost drivers", title: "NAT / RDS / Fargate", detail: "拆解固定與變動成本", featured: true },
        { icon: <ClipboardCheck />, label: "Optimization plan", title: "保留效能的省錢策略", detail: "retention / sizing / schedule" }
      ]
    },
    24: {
      title: "災難復原 Runbook",
      caption: "Day24 不是只備份，而是明確 RPO/RTO、restore path、incident checklist。",
      className: "dr-visual",
      arrows: ["restore", "verify"],
      nodes: [
        { icon: <Database />, label: "Backups", title: "RDS snapshot / S3 version", detail: "知道能回到哪個時間點" },
        { icon: <TerminalSquare />, label: "Recovery runbook", title: "復原流程", detail: "DNS / DB restore / app config", featured: true },
        { icon: <ClipboardCheck />, label: "DR drill", title: "演練證據", detail: "用截圖與時間紀錄驗證 RTO" }
      ]
    },
    25: {
      title: "IaC 模組邊界",
      caption: "Day25 把手動建立的資源整理成 network、compute、data、observability 模組。",
      className: "iac-visual",
      arrows: ["module", "apply"],
      nodes: [
        { icon: <Cloud />, label: "Existing AWS", title: "手動資源盤點", detail: "把 console 操作轉成資源清單" },
        { icon: <Code2 />, label: "Terraform / CDK", title: "IaC modules", detail: "network / app / data / ops", featured: true },
        { icon: <ClipboardCheck />, label: "Plan review", title: "變更可審查", detail: "plan diff / approval / state" }
      ]
    },
    26: {
      title: "Release Governance",
      caption: "Day26 要把誰批准、何時上線、變更內容、回滾依據放進 release trail。",
      className: "release-visual",
      arrows: ["approve", "audit"],
      nodes: [
        { icon: <CalendarDays />, label: "Change request", title: "發布申請", detail: "scope / risk / rollback" },
        { icon: <ClipboardCheck />, label: "Approval gate", title: "環境晉升", detail: "staging -> production", featured: true },
        { icon: <BookOpen />, label: "Audit trail", title: "變更紀錄", detail: "release note / approver / evidence" }
      ]
    },
    27: {
      title: "Performance Review",
      caption: "Day27 聚焦 Laravel query、N+1、cache hit rate、queue latency 如何回到架構決策。",
      className: "performance-visual",
      arrows: ["profile", "optimize"],
      nodes: [
        { icon: <Search />, label: "Trace symptoms", title: "找慢點", detail: "API latency / SQL count / queue delay" },
        { icon: <Database />, label: "SQL + Cache", title: "修正資料路徑", detail: "N+1 / index / cache hit", featured: true },
        { icon: <Gauge />, label: "Measure again", title: "用指標驗收", detail: "p95 / throughput / error rate" }
      ]
    },
    28: {
      title: "Final Architecture Review",
      caption: "Day28 用審查圖把 edge、compute、data、security、ops 串成一張可答辯架構。",
      className: "review-visual",
      arrows: ["review", "risk register"],
      nodes: [
        { icon: <Cloud />, label: "Architecture", title: "最終架構圖", detail: "edge / compute / data / ops" },
        { icon: <ShieldCheck />, label: "Review checklist", title: "可審查性", detail: "安全、可靠性、成本、回滾", featured: true },
        { icon: <ClipboardCheck />, label: "Gap list", title: "剩餘風險", detail: "用清單說明 trade-off" }
      ]
    },
    29: {
      title: "Portfolio Deployment Report",
      caption: "Day29 將 30 天 artifact 整理成能展示的報告，而不是零散截圖。",
      className: "portfolio-visual",
      arrows: ["curate", "publish"],
      nodes: [
        { icon: <FolderOpen />, label: "Artifacts", title: "收集每日輸出", detail: "diagram / runbook / commands / screenshots" },
        { icon: <BookOpen />, label: "Report", title: "部署作品集", detail: "問題、決策、結果、成本", featured: true },
        { icon: <Trophy />, label: "Demo script", title: "展示腳本", detail: "用 5-10 分鐘講清楚架構" }
      ]
    },
    30: {
      title: "Capstone Defense 答辯路徑",
      caption: "Day30 圖表要幫你用 production engineer 的語言，回答為什麼這樣部署、怎麼維運、如何回復。",
      className: "defense-visual",
      arrows: ["explain", "defend"],
      nodes: [
        { icon: <Target />, label: "Problem", title: "部署問題定義", detail: "從 Docker Compose 到 AWS production" },
        { icon: <Cloud />, label: "Architecture", title: "架構與取捨", detail: "服務邊界、資料、安全、成本", featured: true },
        { icon: <Trophy />, label: "Defense", title: "20 分鐘答辯", detail: "demo、風險、rollback、下一步" }
      ]
    }
  };

  const renderMappingRows = () => (
    <div className={`mapping-diagram ${identity.className}`}>
      <div className="diagram-column-title">本地 Docker Compose</div>
      <div className="diagram-column-title">AWS 目標環境</div>
      {rows.map((row, index) => {
        const rowLabel = identity.rowLabels[index] ?? `節點 ${index + 1}`;
        const rowNote = identity.rowNotes?.[index] ?? "";
        const rowClass = row.emphasis ? `mapping-node-${row.emphasis}` : "";

        return (
          <div className="mapping-row" key={`${row.local}-${index}`}>
            <div className={`mapping-node local ${row.tone} ${rowClass}`}>
              {row.badge && <span className="mapping-badge">{row.badge}</span>}
              <span className="row-index">{index + 1}</span>
              <span className="service-icon">{row.icon}</span>
              <div>
                <span className="node-stage">{rowLabel}</span>
                <strong>{row.local}</strong>
                <small>{row.detail}</small>
                {rowNote ? <small className="row-note">{rowNote}</small> : null}
              </div>
            </div>
            <div className={`mapping-arrow ${rowClass}`}><span>{row.flow}</span><ArrowRight /></div>
            <div className={`mapping-node aws ${rowClass}`}>
              {row.badge ? <span className="mapping-badge mapping-badge-aws">{row.badge}</span> : null}
              <div className="aws-service-stack">
                {row.awsServices.map((service) => <AwsServiceBadge key={service.name} type={service.type} />)}
              </div>
              <div>
                {row.awsServices.map((service) => <strong key={service.name}>{service.name}</strong>)}
                <small>{row.awsDetail}</small>
                <span className="row-service-note">AWS 對位數：{row.awsServices.length}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderVisualSpec = (spec: VisualSpec) => (
    <div className={`course-visual course-visual-flow ${spec.className ?? ""}`}>
      <div className="visual-scenario">
        <strong>{spec.title}</strong>
        <p>{spec.caption}</p>
      </div>
      <div className="visual-flow-row">
        {spec.nodes.map((node, index) => (
          <div className="visual-flow-item" key={`${lesson.day}-${node.label}-${node.title}`}>
            <VisualNode {...node} />
            {index < spec.nodes.length - 1 ? <VisualArrow label={spec.arrows[index] ?? "next"} /> : null}
          </div>
        ))}
      </div>
    </div>
  );

  const renderLessonVisual = () => {
    if (lesson.day === 1) return renderMappingRows();
    if (lesson.day === 4) {
      return (
        <div className="course-visual ec2-path-visual">
          <div className="visual-scenario">
            <strong>EC2 First Deploy 上線路徑</strong>
            <p>Day4 要看懂「先上線可回滾」：外部流量如何進 EC2、哪些服務暫留主機、如何部署與復原。</p>
          </div>
          <div className="traffic-lane">
            <div className="ingress-steps">
              <VisualNode icon={<Globe2 />} label="User / Domain" title="使用者入口" detail="DNS 指到 EC2 public endpoint" />
              <VisualArrow label="80 / 443" />
              <VisualNode icon={<ShieldCheck />} label="Security Group" title="只開必要入口" detail="HTTP(S) + SSH restricted" />
            </div>
            <VisualArrow label="allow to host" />
            <div className="ec2-host">
              <div className="ec2-host-header">
                <AwsServiceBadge type="ec2" />
                <div>
                  <strong>Amazon EC2 Host</strong>
                  <small>今天的核心不是拆服務，而是先跑出可回滾的第一版。</small>
                </div>
              </div>
              <div className="compose-stack">
                <span><Server size={16} /> Nginx</span>
                <span><Boxes size={16} /> PHP-FPM / Laravel</span>
                <span><Database size={16} /> PostgreSQL 暫留</span>
                <span><Server size={16} /> Redis 暫留</span>
              </div>
            </div>
          </div>
          <div className="ops-lane">
            <VisualNode icon={<TerminalSquare />} label="SSH Deploy" title="部署操作" detail="pull / up -d / logs / rollback" />
            <VisualArrow label="recover" />
            <VisualNode icon={<Database />} label="EBS / backup" title="回滾保護" detail="資料與設定要能復原" />
          </div>
        </div>
      );
    }

    if (lesson.day === 5) {
      return (
        <div className="course-visual managed-split-visual">
          <div className="visual-scenario">
            <strong>Stateful services 抽離路徑</strong>
            <p>Day5 的主角是把資料庫、檔案、快取與監控從 EC2 主機責任中拆出來。</p>
          </div>
          <div className="split-source">
            <VisualNode icon={<Building2 />} label="EC2 app" title="保留 Web/API" detail="EC2 只留下運行責任" featured />
          </div>
          <div className="split-targets">
            <VisualNode icon={<Database />} label="Amazon RDS" title="資料庫抽離" detail="backup / connection / subnet" />
            <VisualNode icon={<FolderOpen />} label="Amazon S3" title="檔案抽離" detail="uploads / lifecycle / policy" />
            <VisualNode icon={<Server />} label="ElastiCache" title="快取抽離" detail="session / queue / cache" />
            <VisualNode icon={<Gauge />} label="CloudWatch" title="監控補上" detail="logs / metrics / alarm" />
          </div>
        </div>
      );
    }

    return renderVisualSpec(visualSpecs[lesson.day] ?? {
      title: `${lesson.title} 情境流程`,
      caption: "這一天會產出一份對應主題的架構 artifact，並回到部署報告中驗證。",
      arrows: ["apply", "verify"],
      nodes: [
        { icon: <BookOpen />, label: "context", title: "理解主題", detail: lesson.summary },
        { icon: <Cloud />, label: lesson.phase, title: "AWS 對位", detail: "找出此主題對應的 AWS service boundary", featured: true },
        { icon: <ClipboardCheck />, label: "artifact", title: "交付與驗收", detail: `${lesson.titleEn} artifact` }
      ]
    });
  };

  return (
    <Panel title={`架構對位示意圖（Day ${lesson.day} · ${lesson.phase}）`}>
      <div className={`diagram-identity ${identity.className}`}>
        <span className="diagram-version">{identity.versionTag}</span>
        <div>
          <strong>{identity.title}</strong>
          <p>{identity.subtitle}</p>
        </div>
      </div>
      <div className={`diagram-meta ${phaseMeta.visualTheme}`}>
        <div className="diagram-meta-header">
          <strong>今日對位主題</strong>
          <span>{phaseMeta.focusTag}</span>
        </div>
        <p>{phaseMeta.focus}</p>
        <div className="diagram-meta-hints">
          {phaseMeta.serviceHints.map((hint) => (
            <span key={hint}>{hint}</span>
          ))}
        </div>
      </div>
      <div className="diagram-legend">
        <span><i className="legend-dot local" /> 本地 Docker Compose</span>
        <span><i className="legend-dot aws" /> AWS 目標環境</span>
      </div>
      {renderLessonVisual()}
      <div className="diagram-note">此圖不是最終架構，而是幫你把本地服務對到適合調查的 AWS 服務。</div>
    </Panel>
  );
}

function VisualNode({
  icon,
  label,
  title,
  detail,
  featured = false
}: {
  icon: ReactElement;
  label: string;
  title: string;
  detail: string;
  featured?: boolean;
}) {
  return (
    <div className={`visual-node ${featured ? "featured" : ""}`}>
      <span className="visual-icon">{icon}</span>
      <div>
        <span>{label}</span>
        <strong>{title}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function VisualArrow({ label }: { label: string }) {
  return (
    <div className="visual-arrow">
      <span>{label}</span>
      <ArrowRight size={22} />
    </div>
  );
}

function AwsServiceBadge({ type }: { type: string }) {
  const icon = {
    s3: "S3",
    cloudfront: "CF",
    ecs: "ECS",
    rds: "RDS",
    elasticache: "EC",
    ec2: "EC2",
    ebs: "EBS",
    security: "SEC"
  }[type] ?? "AWS";

  return <span className={`aws-service-badge ${type}`} aria-hidden="true">{icon}</span>;
}

function buildTicketFactoryDecisionItems(lesson: Lesson) {
  const genericServiceOption = lesson.phase === "Deployment"
    ? "先保留 Docker Compose 可回滾路徑"
    : lesson.phase === "Advanced"
      ? "拆成可維運的 AWS service boundary"
      : "補上可審查的治理與營運證據";

  const buildOptions = (recommended: string, fallback: string[]) => {
    const source = [recommended, ...fallback];
    const unique: string[] = [];
    const seen = new Set<string>();
    for (const option of source) {
      if (!option) continue;
      if (seen.has(option)) continue;
      seen.add(option);
      unique.push(option);
    }
    return unique.slice(0, 3);
  };

  const dayGoal = lesson.mentorScript?.todayGoal ?? lesson.summary;
  const deliverable = lesson.mentorScript?.deliverables?.[0] ?? `${lesson.titleEn} artifact`;
  const awsAbility = lesson.examMapping?.[0] ?? genericServiceOption;

  const stageDefaults: Record<string, Array<{ id: string; question: string; context: string; recommended: string; options: string[]; feedback: string }>> = {
    advanced: [
      {
        id: `day${lesson.day}-advanced-boundary`,
        question: `Day ${lesson.day} 要優先確認的 production boundary 是什麼？`,
        context: lesson.mentorScript.scenario,
        recommended: lesson.documentSpec[0] ?? "先定義 web / api / data / worker 的邊界分工",
        options: [
          lesson.documentSpec[0] ?? "先定義 web / api / data / worker 的邊界分工",
          "只做外觀，暫時不切 service boundary",
          "先把所有設定都寫進 image 內"
        ],
        feedback: "你必須用 TicketFactory 的架構切割來定義哪一段交付可維運，否則後續調參會彼此干擾。"
      },
      {
        id: `day${lesson.day}-advanced-aws`,
        question: `Day ${lesson.day} 對 TicketFactory 最需要補上的 AWS 能力是？`,
        context: lesson.mentorScript.todayGoal,
        recommended: awsAbility,
        options: buildOptions(awsAbility, ["先看 UI 色彩再談 API", "只增加 Domain，不補運維證據", "全部依賴 dev compose 不變" ]),
        feedback: "今天不求一次到位，但每一個能力選擇都要能回答：今天解決哪個缺口、下一天怎麼接。"
      },
      {
        id: `day${lesson.day}-advanced-artifact`,
        question: `Day ${lesson.day} 回到開發機時，最要補交哪一份 artifact？`,
        context: "手機讀完可先完成決策，回到作業環境後補上驗證與指令證據。",
        recommended: deliverable,
        options: buildOptions(deliverable, ["只截圖一張頁面", "只記錄錯誤訊息", "先關掉再繼續下一天"]),
        feedback: "每一天都要有可交付輸出，這是你後續在手機之外仍能持續推進的唯一保障。"
      }
    ],
    deep: [
      {
        id: `day${lesson.day}-deep-risk`,
        question: `Day ${lesson.day} 最容易被忽略的營運風險是什麼？`,
        context: lesson.mentorScript.scenario,
        recommended: lesson.pitfall ?? "先做可回滾、可追蹤、可稽核的驗證流程",
        options: buildOptions(
          lesson.pitfall ?? "先做可回滾、可追蹤、可稽核的驗證流程",
          [
            "只追求節點多，不補觀測",
            "先壓下線上流量再處理資安",
            "一次改完再一次測試"
          ]
        ),
        feedback: "深度營運比工具更重：要把風險、影響面、回復路徑都寫進你的 decision record。"
      },
      {
        id: `day${lesson.day}-deep-goal`,
        question: `Day ${lesson.day} 的今天目標應該如何向團隊解釋？`,
        context: lesson.mentorScript.todayGoal,
        recommended: dayGoal,
        options: buildOptions(dayGoal, ["我今天做了新 UI", "我今天只把頁面跑起來了", "我先不補文檔，等最後再補"]),
        feedback: "要有一句可以被考官追問的目標敘述：今天在 TicketFactory 情境下，解決的是什麼問題。"
      },
      {
        id: `day${lesson.day}-deep-artifact`,
        question: `Day ${lesson.day} 最適合提交的證據形式是？`,
        context: "在手機上你先把答案定義好，回到實機補上截圖與指令。",
        recommended: deliverable,
        options: buildOptions(deliverable, ["只有 slack 分享", "只放一句我懂了", "只貼 Docker Compose 指令"]),
        feedback: "交付形式要可被檢查：指令、設定、影像或表格都要能指向今天決策的依據。"
      }
    ]
  };

  const daySpecific: Record<number, Array<{ id: string; question: string; context: string; recommended: string; options: string[]; feedback: string }>> = {
    1: [
      {
        id: "day1-service-boundary",
        question: "手機上沒有 docker-compose 可以看，第一步應先判斷什麼？",
        context: "TicketFactory preset：React frontend、Laravel API、PostgreSQL、Redis、uploads/storage。",
        recommended: "先把服務分成 stateless / stateful",
        options: ["先把服務分成 stateless / stateful", "先買 domain", "先設定 CloudFront cache"],
        feedback: "Day1 重點是盤點責任邊界，不是馬上部署。先知道哪些能重建、哪些需要保留。"
      },
      {
        id: "day1-stateful",
        question: "TicketFactory 哪些項目最需要先標成 stateful？",
        context: "PostgreSQL 有交易資料，uploads 有使用者檔案，Redis 多半是 cache/session/queue。",
        recommended: "PostgreSQL + uploads/storage",
        options: ["PostgreSQL + uploads/storage", "React build output", "Nginx config only"],
        feedback: "資料庫與上傳檔是最容易造成部署損失的資源，Day5 才會正式抽離到 RDS/S3。"
      },
      {
        id: "day1-artifact",
        question: "今天最該留下的 artifact 是什麼？",
        context: "後面 EC2、ECS、RDS、S3 都會沿用這份盤點。",
        recommended: "services-to-AWS mapping table",
        options: ["services-to-AWS mapping table", "只截圖首頁", "只記錄 AWS 名詞"],
        feedback: "這份 mapping table 是後面每一天的依據，手機操作也能先完成概念盤點。"
      }
    ],
    2: [
      {
        id: "day2-local-proof",
        question: "沒有開發機時，Day2 要先理解哪一種驗證證據？",
        context: "TicketFactory 需要確認 frontend、api、database、redis 能在 production-like 條件下互通。",
        recommended: "healthcheck + service connectivity checklist",
        options: ["healthcheck + service connectivity checklist", "只看首頁有沒有開", "先改 UI 顏色"],
        feedback: "Day2 是建立可重現證據，重點是用 healthcheck、logs、連線檢查證明不是感覺可跑。"
      },
      {
        id: "day2-port-boundary",
        question: "手機閱讀時，哪個 port 概念最重要？",
        context: "React dev port、Laravel API port、PostgreSQL 5432、Redis 6379 不應全部暴露到外部。",
        recommended: "分清 public ingress 與 internal service port",
        options: ["分清 public ingress 與 internal service port", "所有 port 都開 0.0.0.0", "只要 localhost 能連就好"],
        feedback: "上 AWS 前要先理解哪些流量該從 Internet 進來，哪些只能在內網互通。"
      }
    ],
    3: [
      {
        id: "day3-image",
        question: "TicketFactory 從開發到部署，image 最大差異是什麼？",
        context: "開發常用 bind mount；production image 應該 COPY source 並固定 dependency。",
        recommended: "移除 dev bind mount，產出可版本化 image",
        options: ["移除 dev bind mount，產出可版本化 image", "把整台電腦 rsync 到 EC2", "只改 docker-compose service 名稱"],
        feedback: "可部署 image 才能 rollback、重建與交給 CI/CD。"
      },
      {
        id: "day3-frontend",
        question: "React frontend 在 production packaging 後應產出什麼？",
        context: "TicketFactory frontend 最後會變成靜態 dist assets。",
        recommended: "npm build 後的 dist artifact",
        options: ["npm build 後的 dist artifact", "Vite dev server port", "PostgreSQL data volume"],
        feedback: "前端部署不是帶著 dev server 上線，而是將 build output 交給 S3/CloudFront 或 Nginx。"
      }
    ],
    4: [
      {
        id: "day4-ec2-first",
        question: "Day4 EC2 first deploy 的合理目標是什麼？",
        context: "TicketFactory 先把整條 stack 放到 EC2 + Docker Compose，建立最小可用路徑。",
        recommended: "先做到可上線、可驗證、可 rollback",
        options: ["先做到可上線、可驗證、可 rollback", "一次拆成完整微服務", "先做成本最佳化"],
        feedback: "Day4 不是最終架構，是先建立第一條可復原的上線路徑。"
      },
      {
        id: "day4-security-group",
        question: "EC2 第一版最該小心哪個邊界？",
        context: "HTTP/HTTPS 可以公開，但 SSH、DB、Redis 不應隨便開給全世界。",
        recommended: "Security Group ingress 最小化",
        options: ["Security Group ingress 最小化", "所有 port 開 0.0.0.0/0", "只看 instance type"],
        feedback: "手機上先理解這個決策，實作時才不會把 DB/Redis 暴露出去。"
      }
    ],
    5: [
      {
        id: "day5-managed-state",
        question: "Day5 開始從 EC2 抽離，優先抽哪類資源？",
        context: "TicketFactory 的 PostgreSQL、uploads、Redis 都是 stateful 或 shared dependency。",
        recommended: "DB、uploads、cache/session",
        options: ["DB、uploads、cache/session", "React button component", "README title"],
        feedback: "抽離 stateful service 才能讓 EC2/ECS compute 變得可替換。"
      },
      {
        id: "day5-secrets",
        question: "抽離 managed service 後，設定值應怎麼處理？",
        context: "DB host/password、S3 bucket、Redis endpoint 不能寫死在 image。",
        recommended: "用 env / SSM / Secrets Manager 管理",
        options: ["用 env / SSM / Secrets Manager 管理", "直接 commit .env", "寫死在 Dockerfile"],
        feedback: "設定與 secret 必須離開 image，後面 CI/CD 與安全治理才接得上。"
      }
    ]
  };

  if (lesson.phase === "Advanced") {
    return stageDefaults.advanced;
  }

  if (lesson.phase === "Deep Dive") {
    return stageDefaults.deep;
  }

  return daySpecific[lesson.day] ?? [
    {
      id: `day${lesson.day}-focus`,
      question: `Day ${lesson.day} 在 TicketFactory 情境下，第一個判斷點是什麼？`,
      context: lesson.mentorScript.scenario,
      recommended: lesson.mentorScript.guidedSteps[0]?.title ?? genericServiceOption,
      options: buildOptions(lesson.mentorScript.guidedSteps[0]?.title ?? genericServiceOption, ["先跳過驗證直接部署", "只閱讀 AWS 名詞不回到專案"]),
      feedback: "每天都先回到 TicketFactory 現況，確認今天解決哪一個部署痛點。"
    },
    {
      id: `day${lesson.day}-aws-mapping`,
      question: "這一天最該對應到哪一類 AWS / production 能力？",
      context: lesson.mentorScript.todayGoal,
      recommended: lesson.examMapping[0] ?? genericServiceOption,
      options: buildOptions(lesson.examMapping[0] ?? genericServiceOption, ["只保留本機 Docker Compose", "先做無關 UI 調整"]),
      feedback: "選項不是要背服務名，而是確認今天的 AWS 能力如何推進 TicketFactory 上線。"
    },
    {
      id: `day${lesson.day}-artifact`,
      question: "手機閱讀後，今天至少要留下哪種可交付結果？",
      context: "你稍後在開發機上實作時，會拿這個答案回去補 command、截圖或設定。",
      recommended: lesson.mentorScript.deliverables[0] ?? `${lesson.titleEn} artifact`,
      options: [lesson.mentorScript.deliverables[0] ?? `${lesson.titleEn} artifact`, "只說我懂了", "只截圖不寫驗證與 rollback"],
      feedback: "每一天都要留下 artifact，否則手機學習和實機操作會斷線。"
    }
  ];
}

function TicketFactoryDecisionLab({ lesson }: { lesson: Lesson }) {
  const decisionItems = useMemo(() => buildTicketFactoryDecisionItems(lesson), [lesson]);
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(decisionItems.map((item) => [item.id, item.recommended])));

  useEffect(() => {
    setAnswers(Object.fromEntries(decisionItems.map((item) => [item.id, item.recommended])));
  }, [decisionItems]);

  const matchedCount = decisionItems.filter((item) => answers[item.id] === item.recommended).length;

  return (
    <Panel title="TicketFactory 互動決策 / Interactive Decisions">
      <div className="decision-lab">
        <div className="decision-lab-head">
          <div>
            <strong>用 TicketFactory preset 做選擇，不依賴手機上的作業環境</strong>
            <p>先選出合理部署判斷，之後回到開發機再補 command、截圖與設定檔證據。</p>
          </div>
          <span>{matchedCount}/{decisionItems.length}</span>
        </div>

        <div className="decision-card-grid">
          {decisionItems.map((item, index) => {
            const selected = answers[item.id];
            const matched = selected === item.recommended;
            return (
              <article className={`decision-card ${matched ? "matched" : "review"}`} key={item.id}>
                <div className="decision-card-top">
                  <span>{index + 1}</span>
                  <div>
                    <strong>{item.question}</strong>
                    <small>{item.context}</small>
                  </div>
                </div>
                <div className="decision-options" role="group" aria-label={item.question}>
                  {item.options.map((option) => (
                    <button
                      type="button"
                      key={option}
                      className={selected === option ? "active" : ""}
                      onClick={() => setAnswers((current) => ({ ...current, [item.id]: option }))}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <div className={`decision-feedback ${matched ? "ok" : "warn"}`}>
                  <strong>{matched ? "建議方向" : "需要回頭驗證"}</strong>
                  <span>{matched ? item.feedback : `你選了「${selected}」，回到實機時要補證據確認它不是跳過今天主線。`}</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </Panel>
  );
}

function DeploymentInventoryTable() {
  const inventoryItems = [
    {
      id: "frontend",
      component: "frontend (React)",
      source: "client service / Vite build / public assets",
      check: "build output、public URL、API base URL",
      recommended: "S3 + CloudFront",
      options: ["S3 + CloudFront", "EC2 Nginx", "ECS Fargate"],
      feedback: "React build 後是靜態資產，優先放 S3 並用 CloudFront 做 CDN 與 HTTPS。"
    },
    {
      id: "api",
      component: "api (Laravel)",
      source: "api service / PHP-FPM + Laravel / health endpoint",
      check: "service port、healthcheck、env",
      recommended: "ECS Fargate",
      options: ["ECS Fargate", "EC2 Docker Compose", "Lambda"],
      feedback: "Laravel API 是長時間運行的 web service，Production path 優先練 ECS Fargate；Day4 會先用 EC2 起跑。"
    },
    {
      id: "database",
      component: "database",
      source: "PostgreSQL service / port 5432 / persistent data",
      check: "資料持久化、backup、連線來源",
      recommended: "RDS PostgreSQL",
      options: ["RDS PostgreSQL", "EC2 local PostgreSQL", "DynamoDB"],
      feedback: "TicketFactory 是關聯式交易資料，應先對應 RDS PostgreSQL，重點是 backup、private subnet 與連線來源。"
    },
    {
      id: "redis",
      component: "redis",
      source: "Redis service / cache、queue、session",
      check: "cache / queue / session 用途",
      recommended: "ElastiCache Redis",
      options: ["ElastiCache Redis", "RDS", "S3"],
      feedback: "Redis 是 ephemeral state，不是主要資料庫；上雲時對應 ElastiCache，並確認 session/queue 是否可重建。"
    },
    {
      id: "uploads",
      component: "uploads",
      source: "storage volume / uploaded files / public disk",
      check: "檔案大小、存取權限、生命週期",
      recommended: "S3",
      options: ["S3", "EBS only", "RDS BLOB"],
      feedback: "上傳檔案不應綁死在 container，本階段先把 Laravel storage/public disk 對應到 S3。"
    }
  ];
  const [answers, setAnswers] = useState<Record<string, string>>(() => Object.fromEntries(inventoryItems.map((item) => [item.id, item.recommended])));
  const [statuses, setStatuses] = useState<Record<string, string>>(() => Object.fromEntries(inventoryItems.map((item) => [item.id, "pending"])));
  const confirmedCount = inventoryItems.filter((item) => statuses[item.id] === "done").length;

  return (
    <Panel title="Deployment Inventory / 部署盤點表">
      <div className="inventory-wizard-head">
        <div>
          <strong>這是 Day 1 的 artifact 工作表，不是問答測驗</strong>
          <p>先用 TicketFactory 的已知結構填出第一版對位。回到電腦後再依自己的 compose、env、volume 與 port 實際修正。</p>
        </div>
        <span>{confirmedCount}/{inventoryItems.length} 已確認</span>
      </div>

      <div className="inventory-table-wrap">
        <table className="inventory-table">
          <thead>
            <tr><th>Local component</th><th>來源與檢查點</th><th>建議 AWS 方向</th><th>你的決策</th><th>狀態</th></tr>
          </thead>
          <tbody>
            {inventoryItems.map((row, index) => (
              <tr key={row.id}>
                <td data-label="Local component"><strong>{row.component}</strong><small>#{index + 1} · {row.source}</small></td>
                <td data-label="來源與檢查點">
                  <strong>{row.check}</strong>
                  <small>{row.feedback}</small>
                </td>
                <td data-label="建議 AWS 方向">{row.recommended}</td>
                <td data-label="你的決策">
                  <select value={answers[row.id]} onChange={(event) => setAnswers((current) => ({ ...current, [row.id]: event.target.value }))}>
                    {row.options.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </td>
                <td data-label="狀態">
                  <select value={statuses[row.id]} onChange={(event) => setStatuses((current) => ({ ...current, [row.id]: event.target.value }))}>
                    <option value="pending">待確認</option>
                    <option value="done">已確認</option>
                    <option value="risk">有風險</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="inventory-wizard-summary">
        <CheckCircle2 size={16} />
        <span>先完成每個 component 的第一版 AWS 對位，再帶著這張表進入 Day 2 的 production-like 驗證。</span>
      </div>
    </Panel>
  );
}

function StepContextWorkspace({
  lesson,
  step
}: {
  lesson: Lesson;
  step: Lesson["mentorScript"]["guidedSteps"][number];
}) {
  if (lesson.day === 1) {
    const dayOneWorkspace: Record<string, { title: string; note: string; items?: string[]; showInventory?: boolean }> = {
      services: {
        title: "目前工作區 / Service Inventory Draft",
        note: "先把你專案中的服務切成幾個角色，不急著上 AWS。這一步只做責任分類。",
        items: [
          "frontend / client：誰負責輸出畫面",
          "api / web：誰負責 Laravel runtime",
          "database：哪裡存交易資料",
          "redis / queue：哪裡放快取、session、佇列",
          "worker / scheduler：是否有背景任務"
        ]
      },
      ports: {
        title: "目前工作區 / Port Boundary Draft",
        note: "這一步只看流量入口，不要同時處理資料庫遷移或 image。先分清楚誰能對外、誰只能內部使用。",
        items: [
          "哪些 port 要給瀏覽器或 ALB 進來",
          "哪些 port 只應留在內部 network",
          "database / redis 是否不應對公網開放",
          "之後 Security Group 會怎麼收斂"
        ]
      },
      volumes: {
        title: "目前工作區 / Persistence Draft",
        note: "這一步只看 container 重建後不能消失的資料，找出真正的 stateful 資源。",
        items: [
          "database data 目錄",
          "uploads / storage / public disk",
          "logs 是否需要保留",
          "cache / session 是否可重建"
        ]
      },
      env: {
        title: "目前工作區 / Secret Classification",
        note: "這一步只做設定值分類，先分 secret 和 non-secret，不急著選 AWS 服務。",
        items: [
          "APP_KEY / DB_PASSWORD / API token 屬於 secret",
          "APP_URL / API_URL / public base path 屬於 config",
          "哪些值未來會進 Secrets Manager",
          "哪些值未來會進 SSM Parameter Store"
        ]
      },
      mapping: {
        title: "目前工作區 / AWS Mapping Artifact",
        note: "現在才進入真正的部署盤點表，把前面四步的觀察填進 artifact。",
        showInventory: true
      }
    };

    const workspace = dayOneWorkspace[step.id];
    if (workspace?.showInventory) {
      return <DeploymentInventoryTable />;
    }
    if (workspace) {
      return (
        <Panel title={workspace.title}>
          <p className="lesson-flow-intro">{workspace.note}</p>
          {workspace.items ? <Checklist items={workspace.items} /> : null}
        </Panel>
      );
    }
  }

  return (
    <Panel title="這一步的產出">
      <p className="lesson-flow-intro">這裡只顯示目前步驟要補上的 artifact 或檢查點，不把後續交付與完成檢查提前攤開。</p>
      <div className="lesson-support-grid">
        <div>
          <strong>這一步要產出什麼</strong>
          <div className="expected-output">{step.expectedResult}</div>
        </div>
        <div>
          <strong>這一步先檢查什麼</strong>
          <Checklist items={[step.instruction, step.mentorQuestion]} />
        </div>
      </div>
    </Panel>
  );
}

function ActiveStepPanel({
  lesson,
  step,
  stepIndex,
  commandLines,
  completed,
  completeStep,
  advanceStep,
  isLastStep,
  nextStep
}: {
  lesson: Lesson;
  step: Lesson["mentorScript"]["guidedSteps"][number];
  stepIndex: number;
  commandLines: string[];
  completed: boolean;
  completeStep: () => void;
  advanceStep: () => void;
  isLastStep: boolean;
  nextStep: Lesson["mentorScript"]["guidedSteps"][number] | null;
}) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const activeQuestion = lesson.mentorScript.quickQuestions.find((question) => question.id === activeQuestionId) ?? null;

  useEffect(() => {
    setActiveQuestionId(null);
  }, [lesson.day, step.id]);

  return (
    <Panel title={`目前這一步 / Step ${stepIndex + 1}: ${step.title}`}>
      <div className="active-step-panel">
        <div className="active-step-hero">
          <strong>目標</strong>
          <p>{step.instruction}</p>
          <div className="active-step-status">
            <span>{completed ? "這一步已完成" : "這一步進行中"}</span>
            <small>{completed ? "先看清楚下一步目的，再決定是否前往下一步" : "先完成這一步，完成後才會顯示下一步目的"}</small>
          </div>
        </div>
        <div className="active-step-grid">
          <div>
            <strong>為什麼現在做這一步</strong>
            <div className="expected-output">{step.expectedResult}</div>
          </div>
          <div>
            <strong>Cloud Mentor 提醒</strong>
            <div className="mentor-section mentor-inline-section">
              <p>{step.commonMistake}</p>
              <small>{step.mentorQuestion}</small>
            </div>
          </div>
        </div>
        <div>
          <strong>操作指令</strong>
          <pre><code>{lesson.command}</code></pre>
          {commandLines.length > 1 && <Checklist items={commandLines.map((command) => `Run: ${command}`)} />}
        </div>
        <div>
          <strong>完成條件</strong>
          <Checklist items={["能說明這一步檢查到什麼", "把結果填回 Deployment Inventory", "記錄一個可能踩雷點"]} />
        </div>
        <div className="mentor-quick-questions mentor-inline-questions">
          <strong>卡住時先問自己</strong>
          {lesson.mentorScript.quickQuestions.map((question) => (
            <button
              key={question.id}
              className={activeQuestionId === question.id ? "active" : ""}
              onClick={() => setActiveQuestionId(question.id)}
            >
              {question.question}
            </button>
          ))}
        </div>
        {activeQuestion && (
          <div className="mentor-answer">
            <strong>Cloud Mentor 回答</strong>
            <p>{activeQuestion.answer}</p>
          </div>
        )}
        {!completed ? (
          <div className="active-step-actions">
            <button className="primary" onClick={completeStep}>完成這一步</button>
          </div>
        ) : (
          <div className="step-next-preview">
            <strong>{isLastStep ? "下一段會做什麼" : "下一步的目的"}</strong>
            <p>{isLastStep ? "你已完成今天所有步驟。接下來會進入交付、自我檢查與完成確認。" : `${nextStep?.title}：${nextStep?.expectedResult ?? ""}`}</p>
            <div className="active-step-actions">
              <button className="primary" onClick={advanceStep}>{isLastStep ? "前往交付檢查" : `前往下一步：${nextStep?.title ?? "下一步"}`}</button>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
}

function RightHintRail({
  lesson,
  stepIndex,
  currentStep,
  completed,
  setStepIndex,
  toggleComplete,
  outputItems,
  outputProgress,
  isOutputDone,
  toggleOutput
}: {
  lesson: Lesson;
  stepIndex: number;
  currentStep?: Lesson["mentorScript"]["guidedSteps"][number];
  completed: boolean;
  setStepIndex: (index: number) => void;
  toggleComplete: () => void;
  outputItems: string[];
  outputProgress: string[];
  isOutputDone: (item: string) => boolean;
  toggleOutput: (item: string) => void;
}) {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const maxStepIndex = Math.max(0, lesson.mentorScript.guidedSteps.length - 1);
  const activeQuestion = lesson.mentorScript.quickQuestions.find((question) => question.id === activeQuestionId) ?? null;

  useEffect(() => {
    setActiveQuestionId(null);
  }, [lesson.day]);

  const moveStep = (nextStepIndex: number) => {
    setStepIndex(Math.min(Math.max(nextStepIndex, 0), maxStepIndex));
    setActiveQuestionId(null);
  };

  return (
    <aside className="mentor-rail">
      <div className="mentor-panel-header">
        <div>
          <span><Sparkles size={16} /> Cloud Mentor</span>
          <strong>Step {stepIndex + 1} / {lesson.mentorScript.guidedSteps.length}</strong>
        </div>
      </div>

      {currentStep ? (
        <>
          <div className="mentor-step-meta">
            <strong>{currentStep.title}</strong>
            <span>{completed ? "已完成" : "進行中"}</span>
          </div>

          <div className="mentor-section">
            <strong>小提醒</strong>
            <p>{currentStep.instruction}</p>
          </div>
          <div className="mentor-section">
            <strong>常見錯誤</strong>
            <p>{currentStep.commonMistake}</p>
          </div>

          <div className="mentor-section">
            <strong>今日交付進度</strong>
            <small>{outputProgress.length}/{outputItems.length} 已完成</small>
            <div className="mini-progress" style={{ marginTop: 8 }}>
              <span style={{ width: `${outputItems.length ? Math.round((outputProgress.length / outputItems.length) * 100) : 0}%` }} />
            </div>
            <div className="output-checklist">
              {outputItems.map((item, index) => {
                const done = isOutputDone(item);
                return (
                  <label key={`${item}-${index}`} className={`output-item ${done ? "done" : ""}`}>
                    <input type="checkbox" checked={done} onChange={() => toggleOutput(item)} />
                    <span>{item}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="mentor-quick-questions">
            <strong>Quick Questions</strong>
            {lesson.mentorScript.quickQuestions.map((question) => (
              <button
                key={question.id}
                className={activeQuestionId === question.id ? "active" : ""}
                onClick={() => setActiveQuestionId(question.id)}
              >
                {question.question}
              </button>
            ))}
          </div>

          {activeQuestion && (
            <div className="mentor-answer">
              <strong>Answer</strong>
              <p>{activeQuestion.answer}</p>
            </div>
          )}

          <div className="mentor-actions">
            <button className="secondary" onClick={() => moveStep(stepIndex - 1)} disabled={stepIndex === 0}>
              <ChevronLeft size={16} /> 上一步
            </button>
            <button className="primary" onClick={toggleComplete}>
              {completed ? "取消完成" : "完成"}
            </button>
            <button className="secondary" onClick={() => moveStep(stepIndex + 1)} disabled={stepIndex >= maxStepIndex}>
              下一步 <ChevronRight size={16} />
            </button>
          </div>
        </>
      ) : (
        <div className="mentor-section">
          <strong>Day {lesson.day}</strong>
          <p>這一天目前沒有 mentor steps。</p>
        </div>
      )}
    </aside>
  );
}

function ScenarioBuilder({ user }: { user: UserAccount }) {
  const presets = [
    {
      id: "ticketfactory",
      name: "TicketFactory 標準版",
      description: "Laravel + React + PostgreSQL + Redis + uploads，最接近課程主線。",
      target: "ECS Fargate",
      appShape: "Web + API + Worker",
      dataShape: "Mixed state",
      trafficShape: "Steady with bursts",
      flags: { uploads: true, websocket: true, multiTenant: true, scheduledJobs: true }
    },
    {
      id: "bootstrap",
      name: "先上線版",
      description: "想先用最少改動把 Docker Compose 先搬上 EC2。",
      target: "EC2",
      appShape: "Monolith on one host",
      dataShape: "Strong state",
      trafficShape: "Low steady traffic",
      flags: { uploads: true, websocket: false, multiTenant: false, scheduledJobs: false }
    },
    {
      id: "realtime",
      name: "即時互動版",
      description: "適合 Reverb、queue、登入態與推播一起考慮。",
      target: "Hybrid Static + ECS",
      appShape: "Static frontend + API + realtime",
      dataShape: "Mixed state",
      trafficShape: "Campaign spikes",
      flags: { uploads: true, websocket: true, multiTenant: true, scheduledJobs: true }
    }
  ] as const;

  const [presetId, setPresetId] = useState<typeof presets[number]["id"]>("ticketfactory");
  const [target, setTarget] = useState("ECS Fargate");
  const [appShape, setAppShape] = useState("Web + API + Worker");
  const [dataShape, setDataShape] = useState("Mixed state");
  const [trafficShape, setTrafficShape] = useState("Steady with bursts");
  const [flags, setFlags] = useState({
    uploads: true,
    websocket: true,
    multiTenant: true,
    scheduledJobs: true
  });

  const applyPreset = (preset: typeof presets[number]) => {
    setPresetId(preset.id);
    setTarget(preset.target);
    setAppShape(preset.appShape);
    setDataShape(preset.dataShape);
    setTrafficShape(preset.trafficShape);
    setFlags(preset.flags);
  };

  const toggleFlag = (flagKey: keyof typeof flags) => {
    setFlags((current) => ({ ...current, [flagKey]: !current[flagKey] }));
  };

  const recommendation = useMemo(() => {
    const entries = [
      `learner: ${user.name}`,
      `target: ${target}`,
      `app: ${appShape}`,
      `data: ${dataShape}`,
      `traffic: ${trafficShape}`
    ];

    const route =
      target === "EC2"
        ? [
            "先用 EC2 + Docker Compose 跑出第一版可回滾部署，Day 4 先處理上線與 rollback。",
            "Day 5 再把 PostgreSQL、uploads、Redis 逐步抽成 managed service。",
            "如果是手機閱讀，先把 services-to-AWS mapping 畫清楚，再回到實機補 command。"
          ]
        : target === "ECS Fargate"
          ? [
              "先做 production image，再把 Laravel web / worker / scheduler 拆成 ECS services。",
              "frontend 優先走 S3 + CloudFront，資料層走 RDS / ElastiCache。",
              "這條路最接近課程的主線 production 化節奏。"
            ]
          : [
              "frontend 先獨立成 S3 + CloudFront，API 與 worker 走 ECS。",
              "資料庫維持 RDS，檔案上傳改 S3，觀測與警示接 CloudWatch。",
              "這條路最適合多半現代化、但還沒完全切完的專案。"
            ];

    return `${entries.join(" · ")}\n${route.join(" ")}`;
  }, [appShape, dataShape, target, user.name, trafficShape]);

  const mappingRows = useMemo(() => {
    const rows = [
      {
        local: "React / Frontend",
        aws: target === "EC2" ? "EC2 Nginx or S3 + CloudFront" : "S3 + CloudFront",
        reason: "先把靜態資產與 API 入口切開。",
        highlight: "frontend"
      },
      {
        local: "Laravel API",
        aws: target === "EC2" ? "EC2 Docker Compose" : "ECS Fargate",
        reason: "API 先決定 compute boundary，再處理 scale。",
        highlight: "api"
      },
      {
        local: "PostgreSQL",
        aws: "RDS PostgreSQL",
        reason: "交易資料需要備份、私網與獨立生命週期。",
        highlight: "data"
      },
      {
        local: "Redis / Queue / Session",
        aws: "ElastiCache Redis",
        reason: "讓快取、排程與 session 和主要資料分離。",
        highlight: "cache"
      },
      {
        local: "Uploads / Files",
        aws: "S3 + presigned URL",
        reason: "上傳檔不要留在 container 或單台主機上。",
        highlight: "storage"
      }
    ];

    if (flags.websocket) {
      rows.push({
        local: "WebSocket / Reverb",
        aws: "ALB + ECS + Redis pub/sub",
        reason: "即時通道要和交易 API 分開看。",
        highlight: "realtime"
      });
    }

    return rows;
  }, [flags.websocket, target]);

  const learningPath = useMemo(() => {
    if (target === "EC2") {
      return [
        "Day 1-2：先盤點服務與 port 邊界",
        "Day 3：把 dev mount 改成可交付 image",
        "Day 4：用 EC2 先跑出第一版上線",
        "Day 5：把 stateful 資源抽離",
        "Day 6 之後：再逐步補 ECS、S3、RDS、觀測"
      ];
    }
    if (target === "ECS Fargate") {
      return [
        "Day 1-2：建立 services-to-AWS mapping 與驗證證據",
        "Day 3：產出 production image",
        "Day 4-5：先有可跑的部署，再抽 stateful service",
        "Day 6-15：補 boundary、CI/CD、observability",
        "Day 16-30：把安全、成本、DR 串進 governance"
      ];
    }
    return [
      "Day 1-2：先定義 frontend / API / data 的責任邊界",
      "Day 3：切出靜態資產與 production image",
      "Day 4-5：把 EC2 或 ECS 作為過渡部署路徑",
      "Day 6-15：把 worker、websocket、job queue 拆開",
      "Day 16-30：補 multi-tenant、DR、成本與審查能力"
    ];
  }, [target]);

  const flagsSummary = [
    flags.uploads ? "uploads heavy" : "no upload focus",
    flags.websocket ? "websocket enabled" : "no realtime",
    flags.multiTenant ? "multi-tenant" : "single tenant",
    flags.scheduledJobs ? "scheduled jobs" : "no scheduler"
  ];

  const scenarioScore = [
    target === "EC2" ? 1 : 2,
    appShape.toLowerCase().includes("realtime") ? 2 : 1,
    dataShape.includes("Mixed") ? 2 : 1,
    trafficShape.includes("spikes") ? 2 : 1,
    flags.uploads ? 2 : 0,
    flags.websocket ? 2 : 0,
    flags.multiTenant ? 1 : 0,
    flags.scheduledJobs ? 1 : 0
  ].reduce((sum, value) => sum + value, 0);

  return (
    <section className="stack">
      <SectionHeader title="情境落地引導 / Scenario Onboarding" desc="先把專案條件整理清楚，再回推 AWS 路徑、學習順序與下一步該進哪個 Day。" />
      <div className="scenario-builder-grid">
        <Panel title="1. 選擇情境模板">
          <div className="scenario-preset-grid">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className={`scenario-preset-card ${presetId === preset.id ? "active" : ""}`}
                onClick={() => applyPreset(preset)}
              >
                <strong>{preset.name}</strong>
                <span>{preset.description}</span>
                <small>{preset.target} · {preset.appShape}</small>
              </button>
            ))}
          </div>
        </Panel>

        <div className="grid two scenario-grid-rows">
          <Panel title="2. 補齊專案條件">
            <div className="scenario-field-grid">
              <label>
                <span>Deployment Target</span>
                <select value={target} onChange={(event) => setTarget(event.target.value)}>
                  <option>EC2</option>
                  <option>ECS Fargate</option>
                  <option>Hybrid Static + ECS</option>
                </select>
              </label>
              <label>
                <span>App Shape</span>
                <select value={appShape} onChange={(event) => setAppShape(event.target.value)}>
                  <option>Web + API + Worker</option>
                  <option>Monolith on one host</option>
                  <option>Static frontend + API + realtime</option>
                </select>
              </label>
              <label>
                <span>Data Shape</span>
                <select value={dataShape} onChange={(event) => setDataShape(event.target.value)}>
                  <option>Mixed state</option>
                  <option>Strong state</option>
                  <option>Mostly stateless</option>
                </select>
              </label>
              <label>
                <span>Traffic Shape</span>
                <select value={trafficShape} onChange={(event) => setTrafficShape(event.target.value)}>
                  <option>Steady with bursts</option>
                  <option>Low steady traffic</option>
                  <option>Campaign spikes</option>
                </select>
              </label>
            </div>
            <div className="scenario-toggle-grid">
              {[
                ["uploads", "Uploads / Files"],
                ["websocket", "WebSocket / Reverb"],
                ["multiTenant", "Multi-tenant"],
                ["scheduledJobs", "Scheduled Jobs"]
              ].map(([key, label]) => {
                const checked = flags[key as keyof typeof flags];
                return (
                  <button
                    key={key}
                    type="button"
                    className={`scenario-toggle ${checked ? "active" : ""}`}
                    onClick={() => toggleFlag(key as keyof typeof flags)}
                  >
                    <span>{checked ? "On" : "Off"}</span>
                    <strong>{label}</strong>
                  </button>
                );
              })}
            </div>
            <div className="scenario-meta">
              {flagsSummary.map((item) => <span key={item}>{item}</span>)}
            </div>
          </Panel>

          <Panel title="3. 落地建議">
            <div className="recommendation scenario-recommendation">
              <strong>{user.name}</strong>
              <p>{recommendation}</p>
            </div>
            <div className="scenario-score-card">
              <span>情境複雜度</span>
              <strong>{scenarioScore}/10</strong>
              <small>{scenarioScore >= 8 ? "先把邊界拆清楚，再進 ECS / DR / multi-tenant，這會是比較完整的 production-onboarding 路線。" : scenarioScore >= 4 ? "適合先做 production image + first deploy，再逐步抽離，這是典型的落地引導節奏。" : "可先用 EC2 + Docker Compose 走最小可用路徑，先把第一步走穩。"}</small>
            </div>
          </Panel>
        </div>

        <div className="grid two scenario-grid-rows">
          <Panel title="4. AWS 對應視圖">
            <div className="scenario-mapping-list">
              {mappingRows.map((row) => (
                <article className={`scenario-mapping-card ${row.highlight}`} key={row.local}>
                  <div>
                    <strong>{row.local}</strong>
                    <span>{row.aws}</span>
                  </div>
                  <small>{row.reason}</small>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="5. 下一步學習順序">
            <ol className="scenario-learning-path">
              {learningPath.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <div className="scenario-callout">
              <strong>導師提示</strong>
              <p>先在手機上把情境填清楚，再回到實機補 command、log、截圖和 rollback note。這頁的任務不是背 AWS 名詞，是幫你決定「下一步要學什麼」，也就是把專案真正帶進 AWS 的起點。</p>
            </div>
          </Panel>
        </div>
      </div>
    </section>
  );
}

function InteractiveLab({ openLesson }: { openLesson: (day: number) => void }) {
  const [selected, setSelected] = useState(0);
  const [diagnoses, setDiagnoses] = useState<Record<string, string>>({});
  const lab = labs[selected];
  const chosen = diagnoses[lab.title];
  const isCorrect = chosen === lab.correctDiagnosis;
  const primaryDay = lab.relatedDays[0] ?? 1;
  const secondaryDays = lab.relatedDays.slice(1);
  const stageLabels: Record<StageKey, string> = {
    deployment: "Deployment Day 1-5",
    advanced: "Advanced Day 6-15",
    "deep-dive": "Deep Dive Day 16-30"
  };

  return (
    <section className="stack">
      <SectionHeader title="互動模式 / Interactive Lab" desc={`${labs.length} 個真實部署故障情境。先看症狀，再做診斷，最後回到對應 Day 補強。`} />
      <div className="lab-flow-strip">
        <span>1 觀察症狀</span>
        <span>2 選擇診斷</span>
        <span>3 查看修復</span>
        <span>4 回到對應 Day</span>
      </div>
      <div className="grid two uneven">
        <Panel title="選擇故障情境">
          <details className="lab-scenario-collapse">
            <summary>展開情境清單 / Debug Scenarios</summary>
            <div className="lab-panel-note">先選一個故障情境，再到右側閱讀症狀、證據與診斷選項。</div>
            <div className="lab-summary-strip">
              <span>{labs.filter((item) => item.stageKey === "deployment").length} Deployment</span>
              <span>{labs.filter((item) => item.stageKey === "advanced").length} Advanced</span>
              <span>{labs.filter((item) => item.stageKey === "deep-dive").length} Deep Dive</span>
            </div>
            <div className="lab-scenario-list">
              {labs.map((item, index) => (
                <button key={item.title} className={`row-button ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)}>
                  <TerminalSquare size={18} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{stageLabels[item.stageKey]} · Day {item.relatedDays.join(", ")}</small>
                  </span>
                </button>
              ))}
            </div>
          </details>
        </Panel>
        <Panel title={lab.title}>
          <div className="scenario-meta">
            <span>{stageLabels[lab.stageKey]}</span>
            <span>{lab.skillArea}</span>
            <span>Day {lab.relatedDays.join(", ")}</span>
          </div>
          <div className="lab-story-grid">
            <article className="lab-story-card symptom">
              <strong>Symptom / 症狀</strong>
              <p>{lab.symptom}</p>
            </article>
            <article className="lab-story-card evidence">
              <strong>Evidence / 證據</strong>
              <p>{lab.evidence}</p>
            </article>
          </div>
          <div className="lab-coach-panel">
            <strong>Coach Prompt / 教練提示</strong>
            <p>先判斷這是網路、設定、image、資料層，還是 release 流程的問題。你選的答案會告訴你該回到哪個課程段落補強。</p>
          </div>
          <div className="diagnosis-options">
            <strong>Step 2 - 選擇你的診斷 / Choose diagnosis</strong>
            {lab.choices.map((choice) => {
              const active = chosen === choice;
              const reveal = Boolean(chosen);
              const correct = choice === lab.correctDiagnosis;
              return (
                <button
                  key={choice}
                  className={`diagnosis-choice ${active ? "active" : ""} ${reveal && correct ? "correct" : ""} ${reveal && active && !correct ? "wrong" : ""}`}
                  onClick={() => setDiagnoses({ ...diagnoses, [lab.title]: choice })}
                >
                  {choice}
                </button>
              );
            })}
          </div>
          {chosen && (
            <div className={isCorrect ? "hint success" : "hint danger"}>
              <strong>{isCorrect ? "Correct Diagnosis" : "Review Diagnosis"}</strong>
              {lab.correctDiagnosis}
            </div>
          )}
          {chosen && (
            <div className="lab-remediation-grid">
              <div className="lab-remediation-card fix">
                <strong>Fix / 修復</strong>
                <p>{lab.fix}</p>
              </div>
              <div className="lab-remediation-card prevention">
                <strong>Prevention / 預防</strong>
                <p>{lab.prevention}</p>
              </div>
            </div>
          )}
          <div className="exam-mapping-block">
            <strong>Exam Mapping / 能力對照</strong>
            <div className="exam-chip-row">
              {lab.examMapping.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="lab-next-steps">
            <div>
              <strong>回到對應課程</strong>
              <p>Day {primaryDay}{secondaryDays.length ? `、Day ${secondaryDays.join("、Day ")}` : ""}</p>
            </div>
            <button className="primary" onClick={() => openLesson(primaryDay)}>
              開啟 Day {primaryDay}
            </button>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function QuizView({
  currentDay,
  answers,
  setAnswers,
  result,
  setQuizResult,
  submitQuiz,
  openLesson
}: {
  currentDay: number;
  answers: Record<string, string>;
  setAnswers: (answers: Record<string, string>) => void;
  result: number | null;
  setQuizResult: (result: number | null) => void;
  submitQuiz: (questionIds?: string[]) => void;
  openLesson: (day: number) => void;
}) {
  const [stageFilter, setStageFilter] = useState<"all" | StageKey>("deployment");
  const [skillFilter, setSkillFilter] = useState<"all" | SkillArea>("all");
  const [mode, setMode] = useState<"today" | "daily" | "stage" | "all">("today");
  const [showChinese, setShowChinese] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const visibleQuestions = quizQuestions.filter((question) => {
    const stageMatch = mode === "today" || stageFilter === "all" || question.stageKey === stageFilter;
    const skillMatch = skillFilter === "all" || question.skillArea === skillFilter;
    const modeMatch =
      mode === "all" ||
      (mode === "today" && question.day === currentDay) ||
      (mode === "daily" && typeof question.day === "number") ||
      (mode === "stage" && typeof question.day !== "number");
    return stageMatch && skillMatch && modeMatch;
  });
  const shuffledOptionsByQuestion = useMemo(
    () =>
      Object.fromEntries(
        visibleQuestions.map((question) => [question.id, shuffleArray(question.options)])
      ) as Record<string, string[]>,
    [currentDay, mode, skillFilter, stageFilter]
  );
  const activeQuestion = visibleQuestions[activeQuestionIndex] ?? visibleQuestions[0] ?? null;
  const wrongQuestions = result === null || !activeQuestion ? [] : [activeQuestion].filter((question) => answers[question.id] !== question.answer);
  const weaknessRows = Object.entries(
    wrongQuestions.reduce<Record<string, number>>((acc, question) => {
      acc[question.skillArea] = (acc[question.skillArea] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);
  const stageCounts = {
    deployment: quizQuestions.filter((question) => question.stageKey === "deployment").length,
    advanced: quizQuestions.filter((question) => question.stageKey === "advanced").length,
    "deep-dive": quizQuestions.filter((question) => question.stageKey === "deep-dive").length
  };
  const skillAreas: SkillArea[] = ["Docker", "ECS", "Networking", "Data", "CI/CD", "Observability", "Security", "Cost/DR"];

  useEffect(() => {
    setActiveQuestionIndex(0);
    setQuizResult(null);
  }, [currentDay, mode, setQuizResult, skillFilter, stageFilter]);

  const goToQuestion = (index: number) => {
    setActiveQuestionIndex(Math.min(Math.max(index, 0), Math.max(visibleQuestions.length - 1, 0)));
    setQuizResult(null);
  };

  const answerQuestion = (questionId: string, option: string) => {
    setAnswers({ ...answers, [questionId]: option });
    setQuizResult(null);
  };

  return (
    <section className="stack">
      <SectionHeader title="測驗訓練 / Quiz Training" desc={`${quizQuestions.length} 題情境式題庫。預設先練目前 Day，再依錯題回到對應課程補強。`} />
      <Panel title="Quiz Filters / 題庫篩選">
        <div className="quiz-filter-grid">
          <div>
            <strong>Mode</strong>
            <div className="segmented">
              {[
                ["today", `今日練習 Day ${currentDay}`],
                ["daily", "每日題"],
                ["stage", "階段考"],
                ["all", "全部"]
              ].map(([value, label]) => (
                <button key={value} className={mode === value ? "active" : ""} onClick={() => setMode(value as typeof mode)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <strong>Stage</strong>
            <div className="segmented">
              {[
                ["deployment", `Deployment ${stageCounts.deployment}`],
                ["advanced", `Advanced ${stageCounts.advanced}`],
                ["deep-dive", `Deep Dive ${stageCounts["deep-dive"]}`],
                ["all", "All"]
              ].map(([value, label]) => (
                <button key={value} className={stageFilter === value ? "active" : ""} onClick={() => setStageFilter(value as typeof stageFilter)}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <strong>Skill Weakness</strong>
            <select value={skillFilter} onChange={(event) => setSkillFilter(event.target.value as typeof skillFilter)}>
              <option value="all">All skills</option>
              {skillAreas.map((area) => <option key={area} value={area}>{area}</option>)}
            </select>
            <button
              type="button"
              className={`quiz-language-toggle ${showChinese ? "active" : ""}`}
              onClick={() => setShowChinese((current) => !current)}
            >
              <span>{showChinese ? "On" : "Off"}</span>
              <strong>中文顯示 / Chinese</strong>
            </button>
          </div>
        </div>
        <div className="quiz-count-row">
          <span>目前題數：{visibleQuestions.length}</span>
          <span>Daily quick check：{quizQuestions.filter((question) => typeof question.day === "number").length}</span>
          <span>Stage exam：{quizQuestions.filter((question) => typeof question.day !== "number").length}</span>
        </div>
      </Panel>

      {result !== null && (
        <Panel title="Weakness Analysis / 弱點分析">
          <div className="weakness-grid">
            <div className="result-card">
              <strong>{result}%</strong>
              <span>Score on current filter</span>
            </div>
            <div>
              <strong>需要補強的能力</strong>
              {weaknessRows.length ? (
                <div className="exam-chip-row weakness-chips">
                  {weaknessRows.map(([area, count]) => <span key={area}>{area}: {count} wrong</span>)}
                </div>
              ) : (
                <p className="success-copy">目前篩選題組沒有錯題。保持這個節奏，很漂亮。</p>
              )}
            </div>
          </div>
        </Panel>
      )}

      <Panel title="目前題目 / Current Question">
        <div className="quiz-focus-toolbar">
          <div>
            <strong>{visibleQuestions.length ? `第 ${activeQuestionIndex + 1} / ${visibleQuestions.length} 題` : "目前沒有符合條件的題目"}</strong>
          <span>{mode === "today" ? "先練目前 Day 的題目，再依結果回課程補強。" : "篩選後每次只顯示一題，避免整頁變成題庫牆。"}</span>
          </div>
          <div className="quiz-nav-actions">
            <button className="secondary" onClick={() => goToQuestion(activeQuestionIndex - 1)} disabled={activeQuestionIndex <= 0}>上一題</button>
            <button className="secondary" onClick={() => goToQuestion(activeQuestionIndex + 1)} disabled={activeQuestionIndex >= visibleQuestions.length - 1}>下一題</button>
          </div>
        </div>
        <div className="quiz-progress-bar"><span style={{ width: `${visibleQuestions.length ? ((activeQuestionIndex + 1) / visibleQuestions.length) * 100 : 0}%` }} /></div>
      </Panel>

      {activeQuestion ? (() => {
        const question = activeQuestion as QuizQuestion;
        const answered = answers[question.id];
        const isWrong = result !== null && answered !== question.answer;
        return (
        <Panel key={question.id} title={question.prompt}>
          <div className="question-meta">
            <span>{question.day ? `Day ${question.day}` : "Stage Exam"}</span>
            <span>{question.stageKey}</span>
            <span>{question.skillArea}</span>
          </div>
          <p>{question.promptEn}</p>
          <div className="options">
            {(shuffledOptionsByQuestion[question.id] ?? question.options).map((option) => (
              <label key={option} className={`${answers[question.id] === option ? "option active-option" : "option"} ${result !== null && option === question.answer ? "correct-option" : ""} ${result !== null && answered === option && option !== question.answer ? "wrong-option" : ""}`}>
                <input type="radio" name={question.id} checked={answers[question.id] === option} onChange={() => answerQuestion(question.id, option)} />
                <span className="option-copy">
                  <span className="option-en">{quizOptionEnglish(option)}</span>
                  {showChinese && <span className="option-zh">{option}</span>}
                </span>
              </label>
            ))}
          </div>
          {result !== null && (
            <div className={isWrong ? "notice danger" : "notice success"}>
              {question.explanation}
              <div className="quiz-after-actions">
                <button className="primary" onClick={() => goToQuestion(activeQuestionIndex + 1)} disabled={activeQuestionIndex >= visibleQuestions.length - 1}>
                  下一題
                </button>
                {question.day ? <button className="secondary" onClick={() => openLesson(question.day!)}>回 Day {question.day}</button> : null}
              </div>
              {question.remediationLessonDays?.length ? (
                <div className="remediation-links">
                  {question.remediationLessonDays.map((day) => {
                    const lesson = allLessons.find((item) => item.day === day);
                    return (
                      <button key={`${question.id}-${day}`} className="secondary" onClick={() => openLesson(day)}>
                        回 Day {day}{lesson ? ` · ${lesson.title}` : ""}
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {question.examMapping?.length ? (
                <div className="exam-chip-row">
                  {question.examMapping.map((item) => <span key={item}>{item}</span>)}
                </div>
              ) : null}
            </div>
          )}
        </Panel>
        );
      })() : (
        <Panel title="沒有符合條件的題目">
          <p className="empty-state">請調整 Stage、Mode 或 Skill filter。</p>
        </Panel>
      )}
      <button className="primary wide" disabled={!activeQuestion} onClick={() => activeQuestion && submitQuiz([activeQuestion.id])}>提交本題 / Submit Current Question</button>
      {result !== null && <div className="result">Score / 分數：{result}%</div>}
    </section>
  );
}

function ReadinessEstimateBody({ readiness }: { readiness: ReadinessScore }) {
  const rubricRows = [
    ["Concept", "理解部署問題", readiness.rubric.concept],
    ["Implementation", "產出實作 artifact", readiness.rubric.implementation],
    ["Verification", "留下驗證證據", readiness.rubric.verification],
    ["Troubleshooting", "能排錯與回復", readiness.rubric.troubleshooting],
    ["Communication", "能說明架構取捨", readiness.rubric.communication]
  ] as const;

  return (
    <>
      <div className={`readiness-card ${readiness.level}`}>
        <div className="readiness-score">
          <strong>{readiness.score}</strong>
          <span>/100</span>
        </div>
        <div className="readiness-copy">
          <div className="readiness-title">
            <span>{readiness.label}</span>
            <small>{readiness.labelEn} · {readiness.awsLevel}</small>
          </div>
          <p>{readiness.summary}</p>
        </div>
      </div>
      <div className="rubric-grid">
        {rubricRows.map(([name, desc, value]) => (
          <div className="rubric-item" key={name}>
            <div>
              <strong>{name}</strong>
              <small>{desc}</small>
            </div>
            <span>{value}/4</span>
          </div>
        ))}
      </div>
      <div className="evidence-gaps">
        <strong>Evidence gaps / 待補證據</strong>
        <ul>
          {readiness.gaps.map((gap) => <li key={gap}>{gap}</li>)}
        </ul>
      </div>
    </>
  );
}

function ReadinessEstimate({ readiness, title }: { readiness: ReadinessScore; title: string }) {
  return (
    <Panel title={title}>
      <ReadinessEstimateBody readiness={readiness} />
    </Panel>
  );
}

function StageAssessmentCard({ stage }: { stage: StageReadiness }) {
  return (
    <article className={`stage-assessment-card ${stage.level}`}>
      <div className="stage-assessment-head">
        <span>{stage.range}</span>
        <strong>{stage.score}%</strong>
      </div>
      <h3>{stage.title}</h3>
      <p>{stage.titleEn}</p>
      <div className="assessment-progress-bar">
        <span style={{ width: `${stage.score}%` }} />
      </div>
      <div className="stage-level-row">
        <ShieldCheck size={16} />
        <span>{stage.label}</span>
        <small>{stage.awsLevel}</small>
      </div>
      <div className="stage-completion-row">
        <span>{stage.completedDays}/{stage.totalDays} 天完成</span>
        <span>{stage.nextDay ? `下一步 Day ${stage.nextDay}` : "進入 capstone review"}</span>
      </div>
      <ul className="stage-gap-list">
        {stage.gaps.map((gap) => <li key={gap}>{gap}</li>)}
      </ul>
    </article>
  );
}

function EvidenceHeatmap({ days, openLesson }: { days: EvidenceDay[]; openLesson: (day: number) => void }) {
  const stageLabels: Record<StageKey, string> = {
    deployment: "Deployment",
    advanced: "Advanced",
    "deep-dive": "Deep Dive"
  };

  return (
    <div className="evidence-heatmap">
      {days.map((day) => (
        <button key={day.day} className={`evidence-day ${day.status}`} onClick={() => openLesson(day.day)} title={`Day ${day.day}: ${day.title}`}>
          <strong>{day.day}</strong>
          <span>{stageLabels[day.stageKey]}</span>
          <div className="evidence-dots" aria-label="Evidence coverage">
            <i className={day.implementation ? "done" : ""} />
            <i className={day.verification ? "done" : ""} />
            <i className={day.troubleshooting ? "done" : ""} />
          </div>
        </button>
      ))}
    </div>
  );
}

function SkillRadar({ dimensions, openLesson }: { dimensions: SkillRadarDimension[]; openLesson: (day: number) => void }) {
  return (
    <div className="skill-radar-grid">
      {dimensions.map((dimension) => (
        <article className={`skill-radar-card ${dimension.level}`} key={dimension.key}>
          <div className="skill-radar-head">
            <strong>{dimension.title}</strong>
            <span>{dimension.score}%</span>
          </div>
          <div className="assessment-progress-bar">
            <span style={{ width: `${dimension.score}%` }} />
          </div>
          <div className="stage-completion-row">
            <span>{dimension.evidenceCount}/{dimension.total} days with evidence</span>
            {dimension.nextDay ? <button className="link-button" onClick={() => openLesson(dimension.nextDay!)}>補 Day {dimension.nextDay}</button> : <span>covered</span>}
          </div>
          <small>來源 Day {dimension.days.join(", ")}</small>
        </article>
      ))}
    </div>
  );
}

function ExamMappingDashboard({ mappings, openLesson }: { mappings: ExamMappingSummary[]; openLesson: (day: number) => void }) {
  return (
    <div className="exam-mapping-grid">
      {mappings.map((mapping) => (
        <article className="exam-mapping-card" key={mapping.title}>
          <div className="skill-radar-head">
            <strong>{mapping.title}</strong>
            <span>{mapping.coverage}%</span>
          </div>
          <p>{mapping.note}</p>
          <div className="assessment-progress-bar">
            <span style={{ width: `${mapping.coverage}%` }} />
          </div>
          <div className="exam-day-links">
            {mapping.days.map((day) => <button key={`${mapping.title}-${day}`} onClick={() => openLesson(day)}>Day {day}</button>)}
          </div>
        </article>
      ))}
    </div>
  );
}

function CapstoneDefensePanel({ progress }: { progress: ProgressState }) {
  const day30 = allLessons.find((lesson) => lesson.day === 30)!;
  const readiness = estimateLessonReadiness(day30, progress);
  const portfolioDays = [28, 29, 30];
  const covered = portfolioDays.filter((day) => progress.completedDays.includes(day)).length;
  const qnaItems = [
    "Docker Compose 如何拆到 AWS？",
    "stateless / stateful 邊界在哪？",
    "rollback、DR、RPO/RTO 如何說明？",
    "security group、secrets、tenant isolation 如何防守？",
    "成本最大來源與 accepted risks 是什麼？"
  ];

  return (
    <Panel title="Capstone Defense Panel / Day 30 答辯面板">
      <div className="capstone-grid">
        <div className={`readiness-card ${readiness.level}`}>
          <div className="readiness-score">
            <strong>{readiness.score}</strong>
            <span>/100</span>
          </div>
          <div className="readiness-copy">
            <div className="readiness-title">
              <span>{readiness.label}</span>
              <small>{readiness.labelEn} · {readiness.awsLevel}</small>
            </div>
            <p>Portfolio evidence coverage: {covered}/3 key days covered.</p>
          </div>
        </div>
        <div>
          <strong>Final report package</strong>
          <Checklist items={["deployment report", "architecture diagram", "cost estimate", "20-minute defense script", "Q&A bank", "final readiness rubric"]} />
        </div>
        <div>
          <strong>Defense Q&A bank</strong>
          <Checklist items={qnaItems} />
        </div>
      </div>
    </Panel>
  );
}

function ProgressView({
  completion,
  avgScore,
  progress,
  user,
  openLesson
}: {
  completion: number;
  avgScore: number;
  progress: ProgressState;
  user: UserAccount;
  openLesson: (day: number) => void;
}) {
  const [evidenceFilter, setEvidenceFilter] = useState<"all" | "completed" | "needs-work" | "current-stage">("current-stage");
  const stageReadiness = estimateStageReadiness(progress);
  const evidenceDays = buildDailyEvidenceHeatmap(progress);
  const skillRadar = buildSkillRadar(progress);
  const examMappings = buildExamMappingSummary(progress);
  const currentOverallLevel = levelForScore(Math.round(stageReadiness.reduce((sum, stage) => sum + stage.score, 0) / stageReadiness.length));
  const currentOverallMeta = assessmentLevelMeta[currentOverallLevel];
  const currentStageKey: StageKey = progress.currentDay <= 5 ? "deployment" : progress.currentDay <= 15 ? "advanced" : "deep-dive";
  const filteredEvidenceDays = evidenceDays.filter((day) => {
    if (evidenceFilter === "completed") return progress.completedDays.includes(day.day);
    if (evidenceFilter === "needs-work") return day.gaps.length > 0 || !day.verification;
    if (evidenceFilter === "current-stage") return day.stageKey === currentStageKey;
    return true;
  });
  const focusSkillRadar = [...skillRadar].sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <section className="stack">
      <SectionHeader title="學習歷程 / Learning Progress" desc={`${user.name} 的 localStorage learning progress。completed days、quiz scores、mentor steps 都保存在此瀏覽器。`} />
      <div className="metrics">
        <Metric title="Completed Days" value={`${progress.completedDays.length}/30`} sub={`${completion}% complete`} icon={<CalendarDays />} />
        <Metric title="Average Score" value={`${avgScore}%`} sub="Quiz accuracy" icon={<Target />} />
        <Metric title="Current Day" value={`Day ${progress.currentDay}`} sub="Next lesson" icon={<BookOpen />} />
        <Metric title="AWS Level" value={currentOverallMeta.labelEn} sub={currentOverallMeta.awsLevel} icon={<Gauge />} />
      </div>
      <Panel title="階段能力總覽 / Stage Assessment">
        <div className="assessment-stage-grid">
          {stageReadiness.map((stage) => <StageAssessmentCard key={stage.key} stage={stage} />)}
        </div>
      </Panel>
      <Panel title="每日完成證據 / Daily Evidence">
        <div className="progress-filter-row" role="tablist" aria-label="Evidence filter">
          {[
            ["current-stage", "目前階段"],
            ["needs-work", "待補強"],
            ["completed", "已完成"],
            ["all", "全部"]
          ].map(([value, label]) => (
            <button key={value} className={evidenceFilter === value ? "active" : ""} onClick={() => setEvidenceFilter(value as typeof evidenceFilter)}>
              {label}
            </button>
          ))}
        </div>
        <div className="heatmap-legend">
          <span><i /> Implementation</span>
          <span><i /> Verification</span>
          <span><i /> Troubleshooting</span>
          <small>點擊 day 回到課程補 artifact、驗證或排錯證據。</small>
        </div>
        <EvidenceHeatmap days={filteredEvidenceDays} openLesson={openLesson} />
      </Panel>
      <Panel title="優先補強能力 / Skill Focus">
        <p className="lesson-flow-intro">先只看最需要補強的 3 個能力。完整能力雷達收在下方，避免一進頁就變成報表牆。</p>
        <SkillRadar dimensions={focusSkillRadar} openLesson={openLesson} />
        <details className="tab-accordion">
          <summary>查看完整能力雷達 / Full Skill Radar</summary>
          <SkillRadar dimensions={skillRadar} openLesson={openLesson} />
        </details>
      </Panel>
      <details className="tab-accordion">
        <summary>認證能力對照 / Exam Mapping</summary>
        <Panel title="AWS 認證能力對照">
          <ExamMappingDashboard mappings={examMappings} openLesson={openLesson} />
        </Panel>
      </details>
      <CapstoneDefensePanel progress={progress} />
      <details className="tab-accordion">
        <summary>本機紀錄保存方式 / LocalStorage Record</summary>
        <Panel title="localStorage 學習紀錄">
          <p>目前進度屬於 <strong>{user.name}</strong>。資料保存在這台裝置的瀏覽器 localStorage，適合單人學習；清除瀏覽器資料或換裝置時需要重新建立紀錄。</p>
        </Panel>
      </details>
    </section>
  );
}

function LocalRecordsView({
  store,
  activeUser,
  progress,
  updateProfileName,
  resetLocalProfile
}: {
  store: Store;
  activeUser: UserAccount;
  progress: ProgressState;
  updateProfileName: (name: string) => void;
  resetLocalProfile: () => void;
}) {
  const [draftName, setDraftName] = useState(activeUser.name);
  const [profileMessage, setProfileMessage] = useState("");
  const completionRate = Math.round((progress.completedDays.length / 30) * 100);
  const quizAverage = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length)
    : 0;
  const completedMentorStepCount = Object.values(progress.mentor.completedStepsByLesson)
    .reduce((sum, steps) => sum + steps.length, 0);

  useEffect(() => {
    setDraftName(activeUser.name);
  }, [activeUser.name]);

  const saveProfileName = () => {
    const nextName = draftName.trim();
    if (!nextName) {
      setProfileMessage("請保留一個顯示名稱 / Display name is required");
      return;
    }
    updateProfileName(nextName);
    setProfileMessage("已更新本機顯示名稱 / Local profile updated");
  };

  const resetProfile = () => {
    if (window.confirm("這會清除本機學習者與學習進度，並回到首次設定流程。確定要繼續嗎？")) {
      resetLocalProfile();
    }
  };

  return (
    <section className="stack">
      <div className="local-records-header">
        <SectionHeader title="本機紀錄 / Local Records" desc={`${activeUser.name} 的學習紀錄保存在此瀏覽器 localStorage；這不是後台系統，也沒有伺服器權限邏輯。`} />
      </div>
      <div className="metrics">
        <Metric title="Local Profiles" value={`${store.users.length}`} sub="localStorage profiles" icon={<Users />} />
        <Metric title="Active Profile" value={activeUser.name} sub={activeUser.email ?? "localStorage profile"} icon={<UserRoundCog />} />
        <Metric title="Completion Rate" value={`${completionRate}%`} sub={`${progress.completedDays.length}/30 days completed`} icon={<Trophy />} />
        <Metric title="Quiz Average" value={`${quizAverage}%`} sub={`${progress.quizScores.length} quiz attempts`} icon={<ClipboardCheck />} />
      </div>
      <div className="grid two">
        <Panel title="LocalStorage Record / 學習紀錄">
          <table>
            <thead><tr><th>Record</th><th>Value</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td>Current Day</td><td>Day {progress.currentDay}</td><td>重新整理後會回到目前學習進度。</td></tr>
              <tr><td>Completed Days</td><td>{progress.completedDays.length}</td><td>已按下完成的課程天數。</td></tr>
              <tr><td>Quiz Attempts</td><td>{progress.quizScores.length}</td><td>測驗送出後保存的成績紀錄。</td></tr>
              <tr><td>Mentor Steps</td><td>{completedMentorStepCount}</td><td>每日互動引導中已完成的步驟數。</td></tr>
            </tbody>
          </table>
        </Panel>
        <Panel title="Profile Settings / 本機學習者設定">
          <div className="profile-settings">
            <label>Display name / 顯示名稱<input value={draftName} onChange={(event) => setDraftName(event.target.value)} /></label>
            <button className="primary" onClick={saveProfileName}>更新名稱 / Update Name</button>
            {profileMessage && <div className="notice success">{profileMessage}</div>}
            <div className="local-records-note">這不是登入帳號，只是此瀏覽器用來標記學習進度的本機 profile。</div>
            <button className="secondary danger-action" onClick={resetProfile}>清除本機紀錄 / Reset Local Record</button>
          </div>
        </Panel>
      </div>
    </section>
  );
}

function Glossary() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("全部");

  const normalizeQuery = (value: string) => value.trim().toLowerCase();

  const allTerms = useMemo<GlossaryItem[]>(() => [
    { term: "Tenant", zh: "租戶", category: "架構", descZh: "多租戶架構中的獨立組織或 workspace，資料、權限與學習進度都應彼此隔離。", descEn: "An isolated organization or workspace in a multi-tenant system where data, access, and learning progress stay separated." },
    { term: "Docker", zh: "Docker", category: "容器化", descZh: "容器化最基礎抽象，將服務打包成 image 並透過 container 運行。", descEn: "Container platform that packages applications as images and runs them in standardized containers." },
    { term: "Docker Compose", zh: "Docker Compose", category: "容器化", descZh: "以單一宣告文件同時啟動多個 container，定義 service、網路與 volumes。", descEn: "A tool to run multiple containers from a single definition by describing services, networks, and volumes together." },
    { term: "Dockerfile", zh: "Dockerfile", category: "容器化", descZh: "建置 image 的指令檔，決定 base image、copy 檔案、執行環境與啟動命令。", descEn: "A build recipe file that defines how an image is created: base image, files, dependencies, and runtime command." },
    { term: "Image", zh: "映像檔", category: "容器化", descZh: "可重複部署的 container 模板，包含 runtime、library、環境變數等設定。", descEn: "An immutable template for containers that includes OS, runtime, libraries, and app configuration." },
    { term: "Container", zh: "容器", category: "容器化", descZh: "將程式與依賴包在可搬移單元中，與主機隔離、可控資源。", descEn: "A lightweight package containing app code and dependencies, isolated from the host with controlled resources." },
    { term: "ECS", zh: "Elastic Container Service", category: "容器編排", descZh: "AWS 管理型容器執行平台，常搭配 Fargate 或 EC2 launch type。", descEn: "AWS managed container platform that supports running containers with ECS service scheduler." },
    { term: "ECS Fargate", zh: "無伺服器容器執行環境", category: "容器編排", descZh: "AWS 提供的 serverless container runtime，不需自己管理 EC2 主機。", descEn: "AWS serverless container runtime that removes EC2 host management burden." },
    { term: "ECS Service", zh: "ECS 服務", category: "容器編排", descZh: "定義想要維持的 task 數量、部署策略與 health check 行為。", descEn: "Defines desired task count, deployment strategy, and health-check behavior for running containers." },
    { term: "Task Definition", zh: "Task 定義", category: "容器編排", descZh: "ECS 運行容器的版本藍圖，包含 image、資源、環境變數與 port 映射。", descEn: "A recipe for running a container task in ECS, including image, resources, env vars, and port mapping." },
    { term: "Cluster", zh: "叢集", category: "容器編排", descZh: "ECS 托管 container 的邏輯資源群組，便於統一調度與監控。", descEn: "Logical group for ECS resources to organize scheduling and monitoring boundaries." },
    { term: "Fargate Profile", zh: "Fargate 設定檔", category: "容器編排", descZh: "定義在 Fargate 任務中可用的執行角色與網路權限控制。", descEn: "Defines execution roles and network/security controls for workloads running on Fargate." },
    { term: "RDS", zh: "受管關聯式資料庫", category: "資料層", descZh: "AWS 的 managed relational database，正式環境常用來承載 PostgreSQL 或 MySQL。", descEn: "AWS managed relational database service commonly used for production PostgreSQL or MySQL workloads." },
    { term: "Aurora", zh: "Aurora", category: "資料層", descZh: "高可用的 AWS managed 資料庫服務，效能較一般 RDS 高。", descEn: "High-performance managed relational database option from AWS with strong availability and scalability." },
    { term: "S3", zh: "物件儲存", category: "儲存", descZh: "適合存放 uploads、exports、備份與前端靜態檔，不適合直接當傳統檔案系統。", descEn: "Object storage for uploads, exports, backups, and static assets instead of mounted file-system style IO." },
    { term: "ElastiCache", zh: "ElastiCache", category: "資料層", descZh: "託管快取服務，常拿來做 session、queue cache、熱資料加速。", descEn: "Managed cache service for speeding up hot reads, session state, and transient data workloads." },
    { term: "CloudWatch", zh: "日誌與監控服務", category: "監控", descZh: "集中查看 logs、metrics、alarms，協助驗證部署狀態與排查 production 問題。", descEn: "Cloud observability service for logs, metrics, and alarms in deployment verification and troubleshooting." },
    { term: "CloudTrail", zh: "操作紀錄審計", category: "安全", descZh: "記錄 AWS API 操作，當作安全稽核、事件追蹤的重要線索。", descEn: "Records AWS API activity and serves as a key source for security audit and incident tracing." },
    { term: "Security Group", zh: "安全群組", category: "網路安全", descZh: "AWS 實例/服務的狀態封包存取控制規則。", descEn: "Stateful virtual firewall rules controlling inbound and outbound traffic for AWS resources." },
    { term: "WAF", zh: "Web Application Firewall", category: "網路安全", descZh: "防禦應用層常見 Web 攻擊，常搭配 CloudFront/ALB。", descEn: "Application firewall service for filtering web traffic and defending against common Layer 7 attacks." },
    { term: "IAM", zh: "身份與存取管理", category: "安全", descZh: "定義角色、權限與 policy，實作最小權限與跨服務授權。", descEn: "Defines users, roles, policies, and least-privilege controls for AWS resource access." },
    { term: "VPC", zh: "虛擬私有雲", category: "網路", descZh: "把 AWS 資源放進獨立邊界，做路由、IP、存取控制與隔離。", descEn: "Isolated AWS network boundary with routing, IP range, and access control design." },
    { term: "Subnet", zh: "子網路", category: "網路", descZh: "VPC 中的邏輯區段，public/private 影響對外服務能力。", descEn: "Logical subdivisions in a VPC, where public and private design determines exposure and access." },
    { term: "Route Table", zh: "路由表", category: "網路", descZh: "決定封包流向與是否能到達 IGW、NAT、私有端點。", descEn: "Controls traffic routes inside a VPC and directs where subnets can reach." },
    { term: "Internet Gateway", zh: "網際網路閘道", category: "網路", descZh: "讓 public subnet 連上公網的入口，與 route table 一起生效。", descEn: "Gateway that provides internet entry for public subnets when paired with correct routes." },
    { term: "NAT Gateway", zh: "NAT 閘道", category: "網路", descZh: "讓 private subnet 主動連外，保留 private subnet 不直接曝露。", descEn: "Lets private subnets access the internet outbound without exposing inbound public entry." },
    { term: "ALB", zh: "應用負載平衡器", category: "網路", descZh: "Layer 7 平衡 HTTP/HTTPS 流量，可做 target 檢查與路徑導向。", descEn: "Layer 7 load balancer for HTTP/HTTPS with path-based routing and target health checks." },
    { term: "NLB", zh: "網路負載平衡器", category: "網路", descZh: "高效能 Layer 4 負載平衡器，常用於 TCP/UDP 流量。", descEn: "Layer 4 load balancer optimized for TCP/UDP traffic and fast connection handling." },
    { term: "Route 53", zh: "DNS 與路由服務", category: "網路", descZh: "管理網域與路由策略，支援流量導向與故障轉移。", descEn: "DNS and routing service for domain management, traffic steering, and failover." },
    { term: "ACM", zh: "憑證管理服務", category: "網路", descZh: "管理 TLS 憑證並整合 ALB、CloudFront 做 HTTPS。", descEn: "Manages TLS certificates for HTTPS integration with ALB or CloudFront." },
    { term: "CloudFront", zh: "內容傳遞網路", category: "效能", descZh: "將靜態檔快取到邊緣節點，降低延遲並保護原始站。", descEn: "CDN service to cache content at edge locations for lower latency and origin protection." },
    { term: "CloudMap", zh: "Cloud Map", category: "網路", descZh: "服務發現機制，讓服務可透過名稱而非硬編 IP 互訪。", descEn: "Service discovery utility enabling service-to-service connectivity by name." },
    { term: "SQS", zh: "SQS", category: "資料層", descZh: "非同步訊息佇列，常用於 worker 任務解耦。", descEn: "Managed queue for asynchronous messaging and decoupling producer-consumer workloads." },
    { term: "SNS", zh: "SNS", category: "訊息", descZh: "主題訂閱式通知服務，用來推送事件與警示。", descEn: "Publish/subscribe messaging service for event notifications and fan-out architecture." },
    { term: "EventBridge", zh: "事件匯流排", category: "訊息", descZh: "彙整 AWS 與自建事件，路由至 Lambda、SQS、Step Functions。", descEn: "Event bus for routing system events across AWS services and custom targets." },
    { term: "CodeCommit", zh: "原始碼庫", category: "CI/CD", descZh: "AWS 的 Git 原始碼託管服務。", descEn: "AWS-managed Git source control service for repositories and branches." },
    { term: "CodeBuild", zh: "建置服務", category: "CI/CD", descZh: "編譯、測試與建置 image 或 artifact 的全自動建置服務。", descEn: "Managed build service for compile/test workflows and artifact generation." },
    { term: "CodePipeline", zh: "部署流程服務", category: "CI/CD", descZh: "把 build、test、deploy 串成 release pipeline。", descEn: "Managed orchestration service to connect source, build, test, and deployment stages." },
    { term: "CodeDeploy", zh: "部署推送服務", category: "CI/CD", descZh: "可控版本發布到 EC2、ECS、Lambda，支援藍綠或滾動。", descEn: "Service for controlled application deployment to EC2/ECS/Lambda with rolling or blue-green strategies." },
    { term: "Launch Template", zh: "啟動範本", category: "部署", descZh: "建立 EC2 啟動設定與版本，保證 launch 一致性。", descEn: "Template to standardize EC2 launch configuration and keep instances repeatable." },
    { term: "EC2", zh: "EC2", category: "計算", descZh: "可彈性配置的虛擬主機，適合需要完整 OS 控制的工作負載。", descEn: "Elastic virtual servers for workloads that need direct OS-level control." },
    { term: "Auto Scaling Group", zh: "自動擴縮群組", category: "運維", descZh: "依據指標調整 EC2 實例數量，保持效能與成本平衡。", descEn: "Automatically scales EC2 instances based on policies and metrics." },
    { term: "EIP", zh: "彈性 IP", category: "網路", descZh: "固定對外 IPv4 地址，避免重啟後變動。", descEn: "Static public IPv4 address retained across instance lifecycle events." },
    { term: "Bastion Host", zh: "跳板機", category: "安全", descZh: "集中管理私有網段 SSH 進入點，降低管理主機暴露面。", descEn: "Hardened jump host controlling secure access into private resources." },
    { term: "Parameter Store", zh: "參數儲存", category: "安全", descZh: "集中管理 runtime 設定值，常與 Secrets Manager 分工使用。", descEn: "Central configuration store for runtime parameters, often paired with Secrets Manager." },
    { term: "Secrets Manager", zh: "祕密管理器", category: "安全", descZh: "儲存並輪換憑證，不把密碼寫在 image 或 repo 內。", descEn: "Stores and rotates secrets so credentials are never hardcoded in image or repo." },
    { term: "Deployment", zh: "部署", category: "開發流程", descZh: "將可追蹤的程式與設定推進 staging/prod 的完整流程。", descEn: "A controlled rollout of code/config across environments with observability and verification." },
    { term: "Rollback", zh: "回滾", category: "開發流程", descZh: "發生錯誤時快速回退到上個穩定版，縮短故障影響時間。", descEn: "Fast fallback to a previously stable version when a release fails checks." },
    { term: "CloudFormation", zh: "CloudFormation", category: "基礎建設即代碼", descZh: "以宣告式模板管理 AWS 資源，幫你把環境建置流程版本化。", descEn: "Infrastructure-as-code service to define and provision AWS resources in repeatable templates." }
  ], []);

  const uniqueCategory = useMemo(() => {
    return ["全部", ...Array.from(new Set(allTerms.map((term) => term.category)))] as string[];
  }, [allTerms]);
  const normalizedQuery = normalizeQuery(query);

  const scoreMatch = (item: GlossaryItem, keywords: string[]) => {
    const term = item.term.toLowerCase();
    const zh = item.zh.toLowerCase();
    const descZh = item.descZh.toLowerCase();
    const descEn = item.descEn.toLowerCase();
    const category = item.category.toLowerCase();

    let score = 0;
    keywords.forEach((keyword, index) => {
      const weight = keywords.length - index;
      const boost = Math.max(1, weight);

      if (term.startsWith(keyword)) score += 120 * boost;
      else if (term.includes(keyword)) score += 90 * boost;

      if (zh.startsWith(keyword)) score += 90 * boost;
      else if (zh.includes(keyword)) score += 60 * boost;

      if (category.includes(keyword)) score += 40;
      if (descZh.includes(keyword)) score += 20;
      if (descEn.includes(keyword)) score += 14;
    });

    return score;
  };

  const filteredTerms = useMemo(() => {
    const terms = allTerms.filter((item) => {
      const matchCategory = categoryFilter === "全部" || item.category === categoryFilter;
      const matchQuery = !normalizedQuery || `${item.term} ${item.zh} ${item.descZh} ${item.descEn}`.toLowerCase().includes(normalizedQuery);
      return matchCategory && matchQuery;
    });

    if (!normalizedQuery) {
      return terms;
    }

    const keywords = normalizedQuery.split(/\s+/).filter(Boolean);
    return terms
      .map((item) => ({ item, score: scoreMatch(item, keywords) }))
      .sort((a, b) => b.score - a.score)
      .map(({ item }) => item);
  }, [allTerms, categoryFilter, normalizedQuery]);

  const suggestions = useMemo(() => {
    if (!normalizedQuery) return [];
    const keywords = normalizedQuery.split(/\s+/).filter(Boolean);
    return allTerms
      .filter((item) => `${item.term} ${item.zh} ${item.category}`.toLowerCase().includes(normalizedQuery))
      .map((item) => ({
        term: item.term,
        zh: item.zh,
        category: item.category,
        score: scoreMatch(item, keywords)
      }))
      .sort((a, b) => b.score - a.score)
      .map((item) => ({ term: item.term, zh: item.zh, category: item.category }))
      .slice(0, 8);
  }, [allTerms, normalizedQuery]);

  const highlight = (value: string) => {
    if (!normalizedQuery) return value;
    const parts = normalizedQuery.split(" ").filter(Boolean);
    if (!parts.length) return value;
    const safe = parts.map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
    const regex = new RegExp(`(${safe})`, "ig");
    const chunks = value.split(regex);
    return chunks.map((chunk, index) => {
      if (!chunk) return null;
      if (index % 2 === 1) {
        return <mark key={`${value}-${index}`} className="term-highlight">{chunk}</mark>;
      }
      return <span key={`${value}-${index}`}>{chunk}</span>;
    });
  };

  const suggestionCount = filteredTerms.length;

  return (
    <section className="stack">
      <SectionHeader title="名詞表 / Glossary" desc="每個術語都用 English + 繁中對照，方便對 AWS 文件、考試與課程脈絡。" />
      <div className="term-search search">
        <Search size={16} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search 直接輸入英文或中文關鍵字，例如：VPC / 租戶 / Deployment"
        />
        {query ? <button type="button" className="term-clear" onClick={() => setQuery("")}>清除</button> : null}
      </div>
      <div className="term-toolbar">
        <div className="term-meta">
          <span>{allTerms.length} 個名詞</span>
          <span>{suggestionCount} 個結果</span>
          <span>分類：{categoryFilter}</span>
        </div>
        <div className="term-filters" role="tablist" aria-label="名詞分類">
          {uniqueCategory.map((category) => (
            <button
              type="button"
              key={category}
              className={categoryFilter === category ? "term-filter selected" : "term-filter"}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      {query && (
        <div className="autocomplete-panel">
          <p className="autocomplete-title">猜你會找 / Suggestions</p>
          {suggestions.length ? suggestions.map((item) => (
            <button
              key={item.term}
              className="autocomplete-item"
              onClick={() => setQuery(item.term)}
              type="button"
            >
              <span className="autocomplete-main">{item.term}</span>
              <span className="autocomplete-sub">{item.zh}</span>
              <small className="autocomplete-category">{item.category}</small>
            </button>
          )) : <p className="term-empty">沒有找到對應名詞，試著輸入「ALB / ECS / 安全群組 / Redis」。</p>}
        </div>
      )}
      <div className="term-grid">
        {filteredTerms.map((item) => (
          <Panel key={`${item.term}-${item.zh}-${item.category}`} title={item.term}>
            <div className="term-card-copy">
              <p className="term-category">{item.category}</p>
              <div className="term-head">
                <strong>{highlight(item.zh)}</strong>
                <span>{highlight(item.term)}</span>
              </div>
              <p className="term-desc term-desc-zh">{highlight(item.descZh)}</p>
              <p className="term-desc term-desc-en">{highlight(item.descEn)}</p>
            </div>
          </Panel>
        ))}
        {!filteredTerms.length ? <p className="term-empty">尚未找到名詞，請調整關鍵字。</p> : null}
      </div>
    </section>
  );
}

function RoadmapMini({ currentDay }: { currentDay: number }) {
  const start = Math.max(0, currentDay - 2);
  return <div className="mini-roadmap">{allLessons.slice(start, start + 5).map((lesson) => <div key={lesson.day}><span>Day {lesson.day}</span><strong>{lesson.title}</strong><small>{lesson.titleEn} · {lesson.duration}</small></div>)}</div>;
}

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="detail-list">
      {items.map((item) => <li key={item}><CheckCircle2 size={16} /> <span>{item}</span></li>)}
    </ul>
  );
}

function Numbered({ items }: { items: string[] }) {
  return (
    <ol className="numbered-list">
      {items.map((item, index) => <li key={item}><strong>{index + 1}</strong><span>{item}</span></li>)}
    </ol>
  );
}

function Metric({ title, value, sub, icon }: { title: string; value: string; sub: string; icon: React.ReactNode }) {
  return <div className="metric"><div className="metric-icon">{icon}</div><span>{title}</span><strong>{value}</strong><small>{sub}</small></div>;
}

function shuffleArray<T>(items: T[]) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
}

function quizOptionEnglish(option: string) {
  const exactMap: Record<string, string> = {
    "先把服務分成 stateless / stateful": "First split services into stateless / stateful",
    "PostgreSQL + uploads/storage": "PostgreSQL + uploads/storage",
    "services-to-AWS mapping table": "services-to-AWS mapping table",
    "healthcheck + service connectivity checklist": "healthcheck + service connectivity checklist",
    "分清 public ingress 與 internal service port": "Distinguish public ingress from internal service ports",
    "移除 dev bind mount，產出可版本化 image": "Remove dev bind mounts and produce a versioned image",
    "npm build 後的 dist artifact": "The dist artifact after `npm build`",
    "先做到可上線、可驗證、可 rollback": "Make it deployable, verifiable, and rollback-ready",
    "Security Group ingress 最小化": "Minimize Security Group ingress",
    "DB、uploads、cache/session": "DB, uploads, cache/session",
    "用 env / SSM / Secrets Manager 管理": "Manage via env / SSM / Secrets Manager",
    "直接跳到下一天": "Skip directly to the next day",
    "把錯誤截圖藏起來": "Hide the failure screenshot",
    "取代所有測試": "Replace all tests",
    "重複執行排程任務": "Run scheduled jobs repeatedly",
    "字母順序": "Alphabetical order",
    "檔案大小": "File size",
    "誰先建立": "Who created it first",
    "只需要更多顏色": "Only needs more color",
    "只貼截圖": "Only attach screenshots",
    "只列服務價格": "Only list service pricing",
    "只放登入帳密": "Only include login credentials",
    "口頭印象": "Verbal impression only",
    "只連到首頁": "Only link to the homepage",
    "只連到色票": "Only link to the color palette",
    "可接受遺失多久資料": "How much data loss is acceptable",
    "可接受多快登入": "How fast login must recover",
    "按鈕顏色": "Button color"
  };

  if (exactMap[option]) return exactMap[option];

  const replacements: Array<[RegExp, string]> = [
    [/container 內/g, "inside the container"],
    [/瀏覽器打/g, "browser opens"],
    [/先用/g, "use"],
    [/先把/g, "first"],
    [/改成/g, "switch to"],
    [/回到/g, "go back to"],
    [/補齊/g, "complete"],
    [/最常見/g, "most common"],
    [/最合理/g, "most reasonable"],
    [/無法/g, "cannot"],
    [/失敗/g, "fails"],
    [/沒有/g, "missing"],
    [/不能/g, "cannot"],
    [/避免/g, "avoid"],
    [/設定/g, "configuration"],
    [/驗證/g, "verify"],
    [/資料層/g, "data layer"],
    [/網路/g, "network"],
    [/流程/g, "workflow"],
    [/路徑/g, "path"],
    [/權限/g, "permissions"],
    [/公開/g, "public"],
    [/私有/g, "private"],
    [/容器/g, "container"],
    [/資料庫/g, "database"],
    [/瀏覽器/g, "browser"],
    [/一個專案/g, "another project"],
    [/看到/g, "shows"],
    [/打/g, "opens"],
    [/被關閉/g, "is disabled"],
    [/被/g, "is"],
    [/和/g, "and"],
    [/或/g, "or"],
    [/的/g, "of"],
    [/在/g, "in"],
    [/，/g, ", "],
    [/。/g, "."],
    [/：/g, ": "]
  ];

  let translated = option;
  for (const [pattern, replacement] of replacements) {
    translated = translated.replace(pattern, replacement);
  }

  translated = translated
    .replace(/\s+/g, " ")
    .replace(/\s+([,.:;])/g, "$1")
    .replace(/\( /g, "(")
    .replace(/ \)/g, ")")
    .replace(/[\u4e00-\u9fff]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return translated || option;
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="panel"><h3>{title}</h3>{children}</article>;
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return <div className="section-header"><h2>{title}</h2><p>{desc}</p></div>;
}

export default App;
