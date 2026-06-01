import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Cloud,
  Code2,
  Gauge,
  LayoutDashboard,
  ListChecks,
  Lock,
  LogOut,
  Search,
  Server,
  ShieldCheck,
  Target,
  TerminalSquare,
  Trophy,
  UserRoundCog,
  Users
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { allLessons, labs, members, quizQuestions, type Lesson } from "./data";

type View = "dashboard" | "roadmap" | "lesson" | "scenario" | "lab" | "quiz" | "progress" | "glossary" | "admin-login" | "admin";

type ProgressState = {
  completedDays: number[];
  quizScores: number[];
  currentDay: number;
};

const initialProgress: ProgressState = {
  completedDays: [1, 2, 3, 4, 5, 6, 7],
  quizScores: [80, 90, 76],
  currentDay: 8
};

const loadProgress = () => {
  const raw = localStorage.getItem("aws-lab-progress");
  return raw ? (JSON.parse(raw) as ProgressState) : initialProgress;
};

function App() {
  const [view, setView] = useState<View>("dashboard");
  const [selectedDay, setSelectedDay] = useState(8);
  const [progress, setProgress] = useState<ProgressState>(loadProgress);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);
  const [adminAuthed, setAdminAuthed] = useState(localStorage.getItem("aws-lab-admin") === "true");

  useEffect(() => {
    localStorage.setItem("aws-lab-progress", JSON.stringify(progress));
  }, [progress]);

  const lesson = allLessons.find((item) => item.day === selectedDay) ?? allLessons[7];
  const completion = Math.round((progress.completedDays.length / 30) * 100);
  const avgScore = progress.quizScores.length
    ? Math.round(progress.quizScores.reduce((sum, score) => sum + score, 0) / progress.quizScores.length)
    : 0;

  const openLesson = (day: number) => {
    setSelectedDay(day);
    setView("lesson");
  };

  const markComplete = () => {
    setProgress((prev) => {
      const completedDays = prev.completedDays.includes(selectedDay) ? prev.completedDays : [...prev.completedDays, selectedDay].sort((a, b) => a - b);
      return { ...prev, completedDays, currentDay: Math.min(30, Math.max(prev.currentDay, selectedDay + 1)) };
    });
  };

  const submitQuiz = () => {
    const correct = quizQuestions.filter((question) => quizAnswers[question.id] === question.answer).length;
    const score = Math.round((correct / quizQuestions.length) * 100);
    setQuizResult(score);
    setProgress((prev) => ({ ...prev, quizScores: [...prev.quizScores, score] }));
  };

  const navItems = [
    ["dashboard", LayoutDashboard, "學習總覽", "Dashboard"],
    ["roadmap", CalendarDays, "30天路線圖", "30-Day Roadmap"],
    ["scenario", Cloud, "情境輸入", "Scenario Builder"],
    ["lab", TerminalSquare, "互動模式", "Interactive Lab"],
    ["quiz", ClipboardCheck, "測驗模式", "Quiz Mode"],
    ["progress", Gauge, "學習歷程", "Learning Progress"],
    ["glossary", BookOpen, "名詞表", "Glossary"],
    ["admin-login", UserRoundCog, "後台管理", "Admin"]
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
            <p>從 Docker Compose 到 AWS Production Deployment</p>
          </div>
          <div className="user-chip">JS<span>John Smith</span></div>
        </header>

        {view === "dashboard" && <Dashboard completion={completion} avgScore={avgScore} openLesson={openLesson} />}
        {view === "roadmap" && <Roadmap progress={progress} openLesson={openLesson} />}
        {view === "lesson" && <LessonView lesson={lesson} completed={progress.completedDays.includes(selectedDay)} markComplete={markComplete} setView={setView} />}
        {view === "scenario" && <ScenarioBuilder />}
        {view === "lab" && <InteractiveLab />}
        {view === "quiz" && (
          <QuizView answers={quizAnswers} setAnswers={setQuizAnswers} result={quizResult} submitQuiz={submitQuiz} />
        )}
        {view === "progress" && <ProgressView completion={completion} avgScore={avgScore} progress={progress} />}
        {view === "glossary" && <Glossary />}
        {view === "admin-login" && (
          <AdminLogin
            adminAuthed={adminAuthed}
            onLogin={() => {
              localStorage.setItem("aws-lab-admin", "true");
              setAdminAuthed(true);
              setView("admin");
            }}
          />
        )}
        {view === "admin" && <AdminDashboard onLogout={() => {
          localStorage.removeItem("aws-lab-admin");
          setAdminAuthed(false);
          setView("admin-login");
        }} />}
      </main>
    </div>
  );
}

function Dashboard({ completion, avgScore, openLesson }: { completion: number; avgScore: number; openLesson: (day: number) => void }) {
  return (
    <section className="stack">
      <div className="metrics">
        <Metric title="Overall Progress" value={`${completion}%`} sub="7 / 30 天完成" icon={<Gauge />} />
        <Metric title="Quiz Accuracy" value={`${avgScore}%`} sub="最近測驗平均" icon={<Target />} />
        <Metric title="Lab Time" value="12h 15m" sub="Hands-on practice" icon={<Code2 />} />
        <Metric title="Deploys" value="3" sub="Successful deploys" icon={<CheckCircle2 />} />
      </div>
      <div className="grid three">
        <Panel title="繼續學習 / Continue Learning">
          <div className="day-pill">Day 8</div>
          <h2>AWS 帳戶與 IAM</h2>
          <p>Create an AWS account, configure IAM users and roles, and prepare least privilege for secure deployments.</p>
          <div className="progress-line"><span style={{ width: "40%" }} /></div>
          <button className="primary" onClick={() => openLesson(8)}>繼續學習 / Continue</button>
        </Panel>
        <Panel title="30天路線圖 / 30-Day Roadmap">
          <RoadmapMini />
        </Panel>
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
      <div className="grid two">
        <Panel title="情境輸入 / Scenario Builder">
          <p>Choose your project stack and receive a deployment path.</p>
          <div className="choice-row"><span>Laravel + React</span><span>PostgreSQL</span><span>Redis Queue</span></div>
        </Panel>
        <Panel title="測驗模式 / Quiz Mode">
          <p>Reinforce knowledge through debugging, command order, architecture choice, and security review.</p>
          <button className="secondary">開始測驗 / Start Quiz</button>
        </Panel>
      </div>
    </section>
  );
}

function Roadmap({ progress, openLesson }: { progress: ProgressState; openLesson: (day: number) => void }) {
  return (
    <section className="stack">
      <SectionHeader title="30天課程路線圖 / 30-Day Roadmap" desc="從 Local Docker Compose 到 AWS Production Deployment。" />
      <div className="roadmap-grid">
        {allLessons.map((lessonItem) => {
          const done = progress.completedDays.includes(lessonItem.day);
          const current = lessonItem.day === progress.currentDay;
          return (
            <button key={lessonItem.day} className={`lesson-card ${done ? "done" : ""} ${current ? "current" : ""}`} onClick={() => openLesson(lessonItem.day)}>
              <span>Day {lessonItem.day}</span>
              <strong>{lessonItem.title}</strong>
              <small>{lessonItem.titleEn}</small>
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
      <div className="grid two">
        <Panel title="Concept / 概念">
          <p>{lesson.summary}</p>
          <div className="notice">Pitfall / 常見雷點：{lesson.pitfall}</div>
        </Panel>
        <Panel title="Hands-on Lab / 實作任務">
          <p>{lesson.lab}</p>
          <pre><code>{lesson.command}</code></pre>
        </Panel>
      </div>
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

function ScenarioBuilder() {
  const [target, setTarget] = useState("ECS Fargate");
  const recommendation = useMemo(() => {
    if (target === "EC2") return "Start with EC2 + Docker Compose, then extract RDS and S3. 適合先理解 Linux server deployment。";
    if (target === "ECS Fargate") return "Build Docker images, push to ECR, run Laravel web/worker/scheduler as ECS services. 最符合 container deployment 主線。";
    return "Use S3 + CloudFront for React, ECS for API, RDS for database, and CloudWatch for logs.";
  }, [target]);
  return (
    <section className="stack">
      <SectionHeader title="情境輸入 / Scenario Builder" desc="用你的專案條件產生 AWS deployment path。" />
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

function ProgressView({ completion, avgScore, progress }: { completion: number; avgScore: number; progress: ProgressState }) {
  return (
    <section className="stack">
      <SectionHeader title="學習歷程 / Learning Progress" desc="追蹤 30 天進度、技能熟練度與測驗紀錄。" />
      <div className="metrics">
        <Metric title="Completed Days" value={`${progress.completedDays.length}/30`} sub={`${completion}% complete`} icon={<CalendarDays />} />
        <Metric title="Average Score" value={`${avgScore}%`} sub="Quiz accuracy" icon={<Target />} />
        <Metric title="Current Day" value={`Day ${progress.currentDay}`} sub="Next lesson" icon={<BookOpen />} />
        <Metric title="Skill Map" value="5 areas" sub="Docker, AWS, Runtime, Security, Cost" icon={<Gauge />} />
      </div>
      <Panel title="Skill Progress / 技能熟練度">
        {["Docker Compose", "AWS Networking", "ECS Deployment", "RDS / Redis / S3", "Monitoring / Security"].map((skill, index) => (
          <div className="skill-row" key={skill}><span>{skill}</span><div className="progress-line"><span style={{ width: `${72 - index * 8}%` }} /></div></div>
        ))}
      </Panel>
    </section>
  );
}

function AdminLogin({ adminAuthed, onLogin }: { adminAuthed: boolean; onLogin: () => void }) {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  if (adminAuthed) return <AdminDashboard onLogout={() => undefined} />;
  return (
    <section className="auth-page">
      <div className="auth-card">
        <Lock size={28} />
        <h2>後台登入 / Admin Login</h2>
        <p>Demo account: admin@example.com / password123</p>
        <label>Email<input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
        {error && <div className="error">{error}</div>}
        <button className="primary wide" onClick={() => {
          if (email === "admin@example.com" && password === "password123") onLogin();
          else setError("帳號或密碼錯誤 / Invalid credentials");
        }}>登入 / Sign In</button>
      </div>
    </section>
  );
}

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  return (
    <section className="stack">
      <div className="admin-header">
        <SectionHeader title="管理總覽 / Admin Dashboard" desc="課程營運、會員進度與內容品質指標。" />
        <button className="secondary" onClick={onLogout}><LogOut size={16} /> 登出 / Logout</button>
      </div>
      <div className="metrics">
        <Metric title="Total Students" value="1,248" sub="+8.6% vs last 30 days" icon={<Users />} />
        <Metric title="Active Learners" value="632" sub="+12.4%" icon={<Gauge />} />
        <Metric title="Completion Rate" value="42.7%" sub="+5.3pp" icon={<Trophy />} />
        <Metric title="Quiz Pass Rate" value="68.9%" sub="-2.1pp" icon={<ClipboardCheck />} />
      </div>
      <div className="grid two">
        <Panel title="Member Management / 會員管理">
          <div className="search"><Search size={16} /><input placeholder="Search name or email" /></div>
          <table>
            <thead><tr><th>Name</th><th>Status</th><th>Progress</th><th>Score</th></tr></thead>
            <tbody>{members.map((member) => (
              <tr key={member.email}><td>{member.name}<small>{member.email}</small></td><td>{member.status}</td><td>{member.progress}% / Day {member.day}</td><td>{member.score}%</td></tr>
            ))}</tbody>
          </table>
        </Panel>
        <Panel title="Most Blocked Lessons / 最常卡關章節">
          {["Day 10: ECR image tag", "Day 13: ALB Health Check", "Day 18: Queue Worker", "Day 24: GitHub Actions"].map((item, index) => (
            <div className="blocked" key={item}><span>{index + 1}</span>{item}<strong>{29 - index * 4}%</strong></div>
          ))}
        </Panel>
      </div>
    </section>
  );
}

function Glossary() {
  const terms = [
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

function RoadmapMini() {
  return <div className="mini-roadmap">{allLessons.slice(6, 11).map((lesson) => <div key={lesson.day}><span>Day {lesson.day}</span><strong>{lesson.title}</strong><small>{lesson.titleEn}</small></div>)}</div>;
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
