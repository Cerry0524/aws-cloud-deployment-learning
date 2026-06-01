import {
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Cloud,
  Code2,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogIn,
  LogOut,
  Search,
  Server,
  ShieldCheck,
  Target,
  TerminalSquare,
  Trophy,
  UserPlus,
  UserRoundCog,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allLessons, labs, members, quizQuestions, seedTenants, seedUsers, zeroStartSteps, type Lesson } from "./data";

type View = "auth" | "dashboard" | "roadmap" | "lesson" | "scenario" | "lab" | "quiz" | "progress" | "glossary" | "admin";
type Role = "student" | "admin";

type Tenant = {
  id: string;
  name: string;
  plan: string;
  domain: string;
  members: number;
};

type UserAccount = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  tenantId: string;
};

type ProgressState = {
  completedDays: number[];
  quizScores: number[];
  currentDay: number;
  onboardingDone: string[];
};

type Store = {
  users: UserAccount[];
  tenants: Tenant[];
  activeUserId: string | null;
  activeTenantId: string | null;
  progressByTenant: Record<string, ProgressState>;
};

const storageKey = "aws-lab-platform-store-v2";

const emptyProgress: ProgressState = {
  completedDays: [],
  quizScores: [],
  currentDay: 1,
  onboardingDone: []
};

const seededProgress: ProgressState = {
  completedDays: [1, 2, 3, 4, 5, 6, 7],
  quizScores: [80, 90, 76],
  currentDay: 8,
  onboardingDone: ["repo-audit", "local-run"]
};

const createInitialStore = (): Store => ({
  users: seedUsers as UserAccount[],
  tenants: seedTenants,
  activeUserId: null,
  activeTenantId: null,
  progressByTenant: {
    "tenant-ticketfactory": seededProgress,
    "tenant-cerry-lab": emptyProgress
  }
});

const loadStore = (): Store => {
  const raw = localStorage.getItem(storageKey);
  return raw ? (JSON.parse(raw) as Store) : createInitialStore();
};

function App() {
  const [store, setStore] = useState<Store>(loadStore);
  const [view, setView] = useState<View>(store.activeUserId ? "dashboard" : "auth");
  const [selectedDay, setSelectedDay] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(store));
  }, [store]);

  const activeUser = store.users.find((user) => user.id === store.activeUserId) ?? null;
  const activeTenant = store.tenants.find((tenant) => tenant.id === store.activeTenantId) ?? null;
  const progress = activeTenant ? store.progressByTenant[activeTenant.id] ?? emptyProgress : emptyProgress;
  const lesson = allLessons.find((item) => item.day === selectedDay) ?? allLessons[0];
  const completion = Math.round((progress.completedDays.length / 30) * 100);
  const avgScore = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length)
    : 0;

  const updateTenantProgress = (nextProgress: ProgressState) => {
    if (!activeTenant) return;
    setStore((prev) => ({
      ...prev,
      progressByTenant: {
        ...prev.progressByTenant,
        [activeTenant.id]: nextProgress
      }
    }));
  };

  const openLesson = (day: number) => {
    setSelectedDay(day);
    setView("lesson");
  };

  const markComplete = () => {
    const completedDays = progress.completedDays.includes(selectedDay)
      ? progress.completedDays
      : [...progress.completedDays, selectedDay].sort((a, b) => a - b);
    updateTenantProgress({
      ...progress,
      completedDays,
      currentDay: Math.min(30, Math.max(progress.currentDay, selectedDay + 1))
    });
  };

  const toggleOnboarding = (id: string) => {
    const onboardingDone = progress.onboardingDone.includes(id)
      ? progress.onboardingDone.filter((item) => item !== id)
      : [...progress.onboardingDone, id];
    updateTenantProgress({ ...progress, onboardingDone });
  };

  const submitQuiz = () => {
    const correct = quizQuestions.filter((question) => quizAnswers[question.id] === question.answer).length;
    const score = Math.round((correct / quizQuestions.length) * 100);
    setQuizResult(score);
    updateTenantProgress({ ...progress, quizScores: [...progress.quizScores, score] });
  };

  const signIn = (email: string, password: string) => {
    const user = store.users.find((item) => item.email === email && item.password === password);
    if (!user) return "帳號或密碼錯誤 / Invalid email or password";
    setStore((prev) => ({ ...prev, activeUserId: user.id, activeTenantId: user.tenantId }));
    setSelectedDay((store.progressByTenant[user.tenantId] ?? emptyProgress).currentDay);
    setView("dashboard");
    return "";
  };

  const register = (payload: { name: string; email: string; password: string; tenantName: string }) => {
    if (store.users.some((user) => user.email === payload.email)) return "Email 已被註冊 / Email already exists";
    const tenantId = `tenant-${Date.now()}`;
    const userId = `user-${Date.now()}`;
    const newTenant: Tenant = {
      id: tenantId,
      name: payload.tenantName,
      plan: "Trial",
      domain: `${payload.tenantName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.local`,
      members: 1
    };
    const newUser: UserAccount = {
      id: userId,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: "admin",
      tenantId
    };
    setStore((prev) => ({
      users: [...prev.users, newUser],
      tenants: [...prev.tenants, newTenant],
      activeUserId: userId,
      activeTenantId: tenantId,
      progressByTenant: { ...prev.progressByTenant, [tenantId]: emptyProgress }
    }));
    setSelectedDay(1);
    setView("dashboard");
    return "";
  };

  const signOut = () => {
    setStore((prev) => ({ ...prev, activeUserId: null, activeTenantId: null }));
    setView("auth");
  };

  const switchTenant = (tenantId: string) => {
    setStore((prev) => ({ ...prev, activeTenantId: tenantId }));
    setSelectedDay((store.progressByTenant[tenantId] ?? emptyProgress).currentDay);
  };

  if (!activeUser || !activeTenant || view === "auth") {
    return <AuthShell signIn={signIn} register={register} />;
  }

  const navItems = [
    ["dashboard", LayoutDashboard, "從0開始", "Start from Zero"],
    ["roadmap", CalendarDays, "30天路線圖", "30-Day Roadmap"],
    ["scenario", Cloud, "情境輸入", "Scenario Builder"],
    ["lab", TerminalSquare, "互動模式", "Interactive Lab"],
    ["quiz", ClipboardCheck, "測驗模式", "Quiz Mode"],
    ["progress", Gauge, "學習歷程", "Learning Progress"],
    ["glossary", BookOpen, "名詞表", "Glossary"],
    ["admin", UserRoundCog, "後台管理", "Admin"]
  ] as const;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><Cloud size={22} /></div>
          <div>
            <strong>CloudLearn</strong>
            <span>AWS Docker Lab</span>
          </div>
        </div>
        <div className="tenant-switcher">
          <label>Tenant / 租戶</label>
          <select value={activeTenant.id} onChange={(event) => switchTenant(event.target.value)}>
            {store.tenants.map((tenant) => <option key={tenant.id} value={tenant.id}>{tenant.name}</option>)}
          </select>
          <small>{activeTenant.plan} plan · {activeTenant.domain}</small>
        </div>
        <nav>
          {navItems.map(([id, Icon, zh, en]) => (
            <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
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
            <p>{activeTenant.name} · 從 Docker Compose 到 AWS Production Deployment</p>
          </div>
          <div className="top-actions">
            <div className="user-chip">{activeUser.name.slice(0, 2).toUpperCase()}<span>{activeUser.name}</span></div>
            <button className="secondary" onClick={signOut}><LogOut size={16} /> 登出 / Logout</button>
          </div>
        </header>

        {view === "dashboard" && <Dashboard completion={completion} avgScore={avgScore} progress={progress} openLesson={openLesson} toggleOnboarding={toggleOnboarding} />}
        {view === "roadmap" && <Roadmap progress={progress} openLesson={openLesson} />}
        {view === "lesson" && <LessonView lesson={lesson} completed={progress.completedDays.includes(selectedDay)} markComplete={markComplete} setView={setView} />}
        {view === "scenario" && <ScenarioBuilder tenant={activeTenant} />}
        {view === "lab" && <InteractiveLab />}
        {view === "quiz" && <QuizView answers={quizAnswers} setAnswers={setQuizAnswers} result={quizResult} submitQuiz={submitQuiz} />}
        {view === "progress" && <ProgressView completion={completion} avgScore={avgScore} progress={progress} tenant={activeTenant} />}
        {view === "glossary" && <Glossary />}
        {view === "admin" && <AdminDashboard store={store} activeTenant={activeTenant} onLogout={signOut} />}
      </main>
    </div>
  );
}

function AuthShell({ signIn, register }: { signIn: (email: string, password: string) => string; register: (payload: { name: string; email: string; password: string; tenantName: string }) => string }) {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("Cerry Student");
  const [tenantName, setTenantName] = useState("My AWS Lab");
  const [email, setEmail] = useState("john@example.com");
  const [password, setPassword] = useState("password123");
  const [message, setMessage] = useState("");

  const submit = () => {
    const result = mode === "login" ? signIn(email, password) : register({ name, email, password, tenantName });
    setMessage(result);
  };

  return (
    <section className="auth-shell">
      <div className="auth-intro">
        <div className="brand-mark"><Cloud size={26} /></div>
        <h1>從 0 建立你的 AWS Docker Compose 學習環境</h1>
        <p>Register a new member, create a tenant workspace, then follow guided steps from project audit to first AWS deployment.</p>
        <div className="auth-steps">
          {zeroStartSteps.slice(0, 3).map((step) => <div key={step.id}><CheckCircle2 size={18} /><span>{step.title}</span></div>)}
        </div>
      </div>
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={mode === "register" ? "active-tab" : ""} onClick={() => setMode("register")}><UserPlus size={16} /> 註冊 / Register</button>
          <button className={mode === "login" ? "active-tab" : ""} onClick={() => setMode("login")}><LogIn size={16} /> 登入 / Login</button>
        </div>
        {mode === "register" && (
          <>
            <label>Name / 姓名<input value={name} onChange={(event) => setName(event.target.value)} /></label>
            <label>Tenant / 組織名稱<input value={tenantName} onChange={(event) => setTenantName(event.target.value)} /></label>
          </>
        )}
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {message && <div className="error">{message}</div>}
        <button className="primary wide" onClick={submit}>{mode === "register" ? "建立會員與租戶 / Create Account" : "登入 / Sign In"}</button>
        <div className="notice">Demo login: john@example.com / password123 或 admin@example.com / password123</div>
      </div>
    </section>
  );
}

function Dashboard({ completion, avgScore, progress, openLesson, toggleOnboarding }: { completion: number; avgScore: number; progress: ProgressState; openLesson: (day: number) => void; toggleOnboarding: (id: string) => void }) {
  return (
    <section className="stack">
      <div className="metrics">
        <Metric title="Overall Progress" value={`${completion}%`} sub={`${progress.completedDays.length} / 30 天完成`} icon={<Gauge />} />
        <Metric title="Quiz Accuracy" value={`${avgScore}%`} sub="最近測驗平均" icon={<Target />} />
        <Metric title="Zero Start" value={`${progress.onboardingDone.length}/5`} sub="Onboarding steps" icon={<ListChecks />} />
        <Metric title="Current Day" value={`Day ${progress.currentDay}`} sub="Next lesson" icon={<BookOpen />} />
      </div>
      <Panel title="從0開始建立學習步驟 / Start From Zero">
        <div className="zero-grid">
          {zeroStartSteps.map((step) => {
            const done = progress.onboardingDone.includes(step.id);
            return (
              <button key={step.id} className={`zero-step ${done ? "done" : ""}`} onClick={() => toggleOnboarding(step.id)}>
                <CheckCircle2 size={20} />
                <strong>{step.title}</strong>
                <span>{step.body}</span>
                <small>Output: {step.output}</small>
              </button>
            );
          })}
        </div>
      </Panel>
      <div className="grid three">
        <Panel title="繼續學習 / Continue Learning">
          <div className="day-pill">Day {progress.currentDay}</div>
          <h2>{allLessons[progress.currentDay - 1]?.title}</h2>
          <p>{allLessons[progress.currentDay - 1]?.summary}</p>
          <button className="primary" onClick={() => openLesson(progress.currentDay)}>進入課程 / Open Lesson</button>
        </Panel>
        <Panel title="30天路線圖 / 30-Day Roadmap"><RoadmapMini currentDay={progress.currentDay} /></Panel>
        <Panel title="TicketFactory 案例研究 / Case Study">
          <h2>Laravel + React + Docker Compose</h2>
          <p>使用真實專案學習 ECS Fargate、RDS、S3、CloudWatch、Queue Worker 與 WebSocket deployment。</p>
          <ul className="clean-list">
            <li><Server size={16} /> Nginx, PHP-FPM, PostgreSQL, Redis</li>
            <li><ShieldCheck size={16} /> Productionization labs and security hardening</li>
            <li><Trophy size={16} /> Final deployment portfolio</li>
          </ul>
        </Panel>
      </div>
    </section>
  );
}

function Roadmap({ progress, openLesson }: { progress: ProgressState; openLesson: (day: number) => void }) {
  return (
    <section className="stack">
      <SectionHeader title="30天課程路線圖 / 30-Day Roadmap" desc="Day 1-5 部署落地，Day 6-15 進階 production 化，Day 16-30 深入架構與營運。" />
      <div className="stage-band">
        <div><strong>Day 1-5</strong><span>部署 / Deployment</span><small>每天 35-55 min，直接產出可部署 artifact。</small></div>
        <div><strong>Day 6-15</strong><span>進階 / Advanced</span><small>每天 45-75 min，處理 ECS、RDS、CI/CD、observability。</small></div>
        <div><strong>Day 16-30</strong><span>深入 / Deep Dive</span><small>每天 60-90 min，安全、租戶、效能、成本、DR、IaC。</small></div>
      </div>
      <div className="roadmap-grid">
        {allLessons.map((lessonItem) => {
          const done = progress.completedDays.includes(lessonItem.day);
          const current = lessonItem.day === progress.currentDay;
          return (
            <button key={lessonItem.day} className={`lesson-card ${done ? "done" : ""} ${current ? "current" : ""}`} onClick={() => openLesson(lessonItem.day)}>
              <span>Day {lessonItem.day}</span>
              <strong>{lessonItem.title}</strong>
              <small>{lessonItem.titleEn}</small>
              <small>{lessonItem.duration} · {lessonItem.intensity}</small>
              <em>{lessonItem.phase}</em>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function LessonView({ lesson, completed, markComplete, setView }: { lesson: Lesson; completed: boolean; markComplete: () => void; setView: (view: View) => void }) {
  return (
    <section className="stack">
      <SectionHeader title={`Day ${lesson.day}: ${lesson.title}`} desc={lesson.titleEn} />
      <div className="lesson-meta">
        <span>{lesson.phase}</span>
        <span>{lesson.intensity}</span>
        <span>{lesson.duration}</span>
      </div>
      <div className="grid two">
        <Panel title="Concept / 概念"><p>{lesson.summary}</p><div className="notice">Pitfall / 常見雷點：{lesson.pitfall}</div></Panel>
        <Panel title="Hands-on Lab / 實作任務"><p>{lesson.lab}</p><pre><code>{lesson.command}</code></pre></Panel>
      </div>
      <div className="grid two">
        <Panel title="Document Spec / 文件規格">
          <Checklist items={lesson.documentSpec} />
        </Panel>
        <Panel title="Interface Guide / 介面介紹">
          <Checklist items={lesson.interfaceGuide} />
        </Panel>
      </div>
      <div className="grid two">
        <Panel title="Learning Steps / 20+ 分鐘實作流程">
          <Numbered items={lesson.steps} />
        </Panel>
        <Panel title="Acceptance Criteria / 驗收標準">
          <Checklist items={lesson.acceptance} />
          <div className="recommendation">{lesson.expectedOutcome}</div>
        </Panel>
      </div>
      <Panel title="Current AWS References / 當前 AWS 版本與來源提醒">
        <Checklist items={lesson.sourceNotes} />
      </Panel>
      <Panel title="Checkpoint / 完成檢查">
        <div className="checkline">
          {completed ? <CheckCircle2 /> : <ListChecks />}
          <span>{completed ? "已完成 / Completed" : "完成本日 lab 後更新學習歷程 / Mark today complete"}</span>
          <button className="primary" onClick={markComplete}>標記完成 / Mark Complete</button>
          <button className="secondary" onClick={() => setView("quiz")}>開啟測驗 / Quiz</button>
        </div>
      </Panel>
    </section>
  );
}

function ScenarioBuilder({ tenant }: { tenant: Tenant }) {
  const [target, setTarget] = useState("ECS Fargate");
  const recommendation = useMemo(() => {
    if (target === "EC2") return `${tenant.name}: Start with EC2 + Docker Compose, then extract RDS and S3. 適合先理解 Linux server deployment。`;
    if (target === "ECS Fargate") return `${tenant.name}: Build Docker images, push to ECR, run Laravel web/worker/scheduler as ECS services. 最符合 container deployment 主線。`;
    return `${tenant.name}: Use S3 + CloudFront for React, ECS for API, RDS for database, and CloudWatch for logs.`;
  }, [target, tenant.name]);
  return (
    <section className="stack">
      <SectionHeader title="情境輸入 / Scenario Builder" desc="用目前 tenant 的專案條件產生 AWS deployment path。" />
      <div className="grid two">
        <Panel title="Project Stack">
          {["Laravel + React", "PostgreSQL", "Redis Queue", "Nginx Reverse Proxy", "Horizon Worker", "Reverb WebSocket"].map((item) => (
            <label className="check-option" key={item}><input type="checkbox" defaultChecked /> {item}</label>
          ))}
        </Panel>
        <Panel title="AWS Target">
          <select value={target} onChange={(event) => setTarget(event.target.value)}>
            <option>EC2</option>
            <option>ECS Fargate</option>
            <option>Hybrid Static + ECS</option>
          </select>
          <div className="recommendation">{recommendation}</div>
        </Panel>
      </div>
    </section>
  );
}

function InteractiveLab() {
  const [selected, setSelected] = useState(0);
  const lab = labs[selected];
  return (
    <section className="stack">
      <SectionHeader title="互動模式 / Interactive Lab" desc="用真實部署錯誤練習 diagnosis and solution。" />
      <div className="grid two uneven">
        <Panel title="Debug Scenarios">
          {labs.map((item, index) => (
            <button key={item.title} className={`row-button ${selected === index ? "selected" : ""}`} onClick={() => setSelected(index)}>
              <TerminalSquare size={18} /> {item.title}
            </button>
          ))}
        </Panel>
        <Panel title={lab.title}>
          <p>{lab.description}</p>
          <div className="hint"><strong>Hint</strong>{lab.hint}</div>
          <div className="hint"><strong>Diagnosis</strong>{lab.diagnosis}</div>
          <div className="hint success"><strong>Solution</strong>{lab.solution}</div>
        </Panel>
      </div>
    </section>
  );
}

function QuizView({ answers, setAnswers, result, submitQuiz }: { answers: Record<string, string>; setAnswers: (answers: Record<string, string>) => void; result: number | null; submitQuiz: () => void }) {
  return (
    <section className="stack">
      <SectionHeader title="測驗模式 / Quiz Mode" desc="測驗 Docker Compose、AWS deployment、security、cost awareness。" />
      {quizQuestions.map((question) => (
        <Panel key={question.id} title={question.prompt}>
          <p>{question.promptEn}</p>
          <div className="options">
            {question.options.map((option) => (
              <label key={option} className={answers[question.id] === option ? "option active-option" : "option"}>
                <input type="radio" name={question.id} checked={answers[question.id] === option} onChange={() => setAnswers({ ...answers, [question.id]: option })} />
                {option}
              </label>
            ))}
          </div>
          {result !== null && <div className="notice">{question.explanation}</div>}
        </Panel>
      ))}
      <button className="primary wide" onClick={submitQuiz}>提交測驗 / Submit Quiz</button>
      {result !== null && <div className="result">Score / 分數：{result}%</div>}
    </section>
  );
}

function ProgressView({ completion, avgScore, progress, tenant }: { completion: number; avgScore: number; progress: ProgressState; tenant: Tenant }) {
  return (
    <section className="stack">
      <SectionHeader title="學習歷程 / Learning Progress" desc={`${tenant.name} tenant-scoped progress。切換租戶會看到不同進度。`} />
      <div className="metrics">
        <Metric title="Completed Days" value={`${progress.completedDays.length}/30`} sub={`${completion}% complete`} icon={<CalendarDays />} />
        <Metric title="Average Score" value={`${avgScore}%`} sub="Quiz accuracy" icon={<Target />} />
        <Metric title="Current Day" value={`Day ${progress.currentDay}`} sub="Next lesson" icon={<BookOpen />} />
        <Metric title="Onboarding" value={`${progress.onboardingDone.length}/5`} sub="Start from zero" icon={<Gauge />} />
      </div>
      <Panel title="Tenant Progress Isolation / 多租戶進度隔離">
        <p>目前進度屬於 <strong>{tenant.name}</strong>。不同 tenant 有不同 completed days、quiz scores、onboarding steps。</p>
      </Panel>
    </section>
  );
}

function AdminDashboard({ store, activeTenant, onLogout }: { store: Store; activeTenant: Tenant; onLogout: () => void }) {
  const tenantUsers = store.users.filter((user) => user.tenantId === activeTenant.id);
  return (
    <section className="stack">
      <div className="admin-header">
        <SectionHeader title="管理總覽 / Admin Dashboard" desc={`${activeTenant.name} 的租戶管理、會員進度與內容品質指標。`} />
        <button className="secondary" onClick={onLogout}><LogOut size={16} /> 登出 / Logout</button>
      </div>
      <div className="metrics">
        <Metric title="Tenant Members" value={`${tenantUsers.length}`} sub={activeTenant.name} icon={<Users />} />
        <Metric title="Tenants" value={`${store.tenants.length}`} sub="Multi-tenant workspaces" icon={<Building2 />} />
        <Metric title="Completion Rate" value="42.7%" sub="Tenant average" icon={<Trophy />} />
        <Metric title="Quiz Pass Rate" value="68.9%" sub="Tenant average" icon={<ClipboardCheck />} />
      </div>
      <div className="grid two">
        <Panel title="Tenant Management / 租戶管理">
          <table>
            <thead><tr><th>Tenant</th><th>Plan</th><th>Domain</th><th>Members</th></tr></thead>
            <tbody>{store.tenants.map((tenant) => (
              <tr key={tenant.id}><td>{tenant.name}</td><td>{tenant.plan}</td><td>{tenant.domain}</td><td>{tenant.members}</td></tr>
            ))}</tbody>
          </table>
        </Panel>
        <Panel title="Member Management / 會員管理">
          <div className="search"><Search size={16} /><input placeholder="Search name or email" /></div>
          <table>
            <thead><tr><th>Name</th><th>Role</th><th>Tenant</th><th>Status</th></tr></thead>
            <tbody>{[...tenantUsers, ...members.map((member, index) => ({ id: `seed-${index}`, name: member.name, email: member.email, role: "student" as Role, tenantId: activeTenant.id, password: "" }))].map((member) => (
              <tr key={member.email}><td>{member.name}<small>{member.email}</small></td><td>{member.role}</td><td>{activeTenant.name}</td><td>Active</td></tr>
            ))}</tbody>
          </table>
        </Panel>
      </div>
    </section>
  );
}

function Glossary() {
  const terms = [
    ["Tenant", "多租戶中的組織或 workspace，資料與學習進度需要隔離。"],
    ["ECS Fargate", "免管理 EC2 主機的 container runtime。"],
    ["RDS", "Managed relational database，用於 production PostgreSQL/MySQL。"],
    ["S3", "Object storage，適合放 uploads、exports、static files。"],
    ["CloudWatch", "AWS logs and metrics observability service。"],
    ["Security Group", "AWS network firewall，限制誰可以連誰。"]
  ];
  return (
    <section className="stack">
      <SectionHeader title="名詞表 / Glossary" desc="專業名詞保留 English，搭配中文部署脈絡。" />
      <div className="term-grid">{terms.map(([term, desc]) => <Panel key={term} title={term}><p>{desc}</p></Panel>)}</div>
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

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="panel"><h3>{title}</h3>{children}</article>;
}

function SectionHeader({ title, desc }: { title: string; desc: string }) {
  return <div className="section-header"><h2>{title}</h2><p>{desc}</p></div>;
}

export default App;
