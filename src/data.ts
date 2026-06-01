export type Phase = "Deployment" | "Advanced" | "Deep Dive";

export type Lesson = {
  day: number;
  phase: Phase;
  title: string;
  titleEn: string;
  summary: string;
  duration: string;
  intensity: string;
  lab: string;
  command: string;
  pitfall: string;
  documentSpec: string[];
  interfaceGuide: string[];
  steps: string[];
  acceptance: string[];
  expectedOutcome: string;
  sourceNotes: string[];
};

const deploymentTopics = [
  ["從0建立部署盤點", "Deployment Inventory from Zero", "盤點 TicketFactory 的 services、ports、volumes、env files，建立第一份部署規格。"],
  ["本機 Production-like 啟動", "Local Production-like Run", "用不衝突 port 啟動 compose，驗證 frontend、backend、PostgreSQL、Redis、queue、websocket。"],
  ["Production Docker Image", "Production Docker Image", "把 bind mount 開發模式轉成可部署 image，補 Laravel source packaging 與 React build artifact。"],
  ["EC2 First Deploy", "EC2 First Deploy", "用 EC2 + Docker Compose 先完成第一版雲端部署，理解 server、firewall、domain、SSL。"],
  ["RDS / S3 / Redis 抽離", "Extract RDS, S3, Redis", "把 stateful services 從主機抽離，建立可維護的 staging architecture。"]
];

const advancedTopics = [
  ["VPC 與 Subnet 設計", "VPC and Subnet Design", "把 ALB、app task、RDS、Redis 放進合理 network boundary。"],
  ["ECR 與 Image Tagging", "ECR and Image Tagging", "建立 image repository，使用 commit SHA tag，保留 rollback 能力。"],
  ["ECS Fargate Web Service", "ECS Fargate Web Service", "把 Laravel web runtime 從 EC2 compose 遷移到 ECS Fargate。"],
  ["ALB Health Check", "ALB Health Check", "建立 /health readiness endpoint，排除 502、unhealthy target 與 security group 錯誤。"],
  ["Queue Worker 與 Scheduler", "Queue Worker and Scheduler", "把 Horizon worker、scheduler 從 web container 拆成獨立 runtime。"],
  ["Secrets Manager 與 SSM", "Secrets Manager and SSM", "管理 APP_KEY、DB password、Redis password，避免 secret baked into image。"],
  ["CloudFront React Frontend", "CloudFront React Frontend", "把 React dist 發佈到 S3 + CloudFront，處理 API URL 與 cache invalidation。"],
  ["CI/CD with GitHub Actions", "CI/CD with GitHub Actions", "建立 build、push ECR、deploy ECS、migration gate 的 pipeline。"],
  ["Zero Downtime Deployment", "Zero Downtime Deployment", "設計 rolling update、health gate、migration order、worker restart strategy。"],
  ["Observability Baseline", "Observability Baseline", "建立 CloudWatch logs、metrics、alarms 與部署後驗收儀表板。"]
];

const deepDiveTopics = [
  ["Production Security Hardening", "Production Security Hardening", "審查 Security Group、IAM role、CORS、APP_DEBUG、Redis password、headers。"],
  ["Multi-tenant Architecture", "Multi-tenant Architecture", "設計 tenant、user、role、progress、course content 的資料隔離模型。"],
  ["RDS Migration Strategy", "RDS Migration Strategy", "建立 migration runbook、backup、rollback、expand-contract schema changes。"],
  ["S3 Upload 與 Signed URL", "S3 Upload and Signed URL", "把 upload storage 從 local volume 轉成 private S3 + signed URL。"],
  ["WebSocket / Reverb on AWS", "WebSocket / Reverb on AWS", "處理 ALB WebSocket routing、sticky concerns、Redis pub/sub。"],
  ["High-concurrency Ticket Booking", "High-concurrency Ticket Booking", "用 TicketFactory 搶座情境討論 Redis lock、transaction、queue consistency。"],
  ["Autoscaling and Capacity", "Autoscaling and Capacity", "以 CPU、memory、request count、queue depth 設計 ECS scaling。"],
  ["Cost Optimization", "Cost Optimization", "拆解 NAT Gateway、RDS、Fargate、CloudWatch retention、CloudFront 成本。"],
  ["Disaster Recovery Runbook", "Disaster Recovery Runbook", "設計 RPO/RTO、backup restore、incident checklist、rollback playbook。"],
  ["IaC Overview", "Infrastructure as Code Overview", "把手動資源整理成 Terraform/CDK 模組邊界。"],
  ["Release Governance", "Release Governance", "建立環境晉升、approval、change log、audit trail。"],
  ["Performance Review", "Performance Review", "檢查 Laravel query、N+1、cache hit rate、queue latency。"],
  ["Final Architecture Review", "Final Architecture Review", "用架構審查表驗證部署是否 production-ready。"],
  ["Portfolio Deployment Report", "Portfolio Deployment Report", "整理可展示的部署報告、diagram、成本估算、操作影片腳本。"],
  ["Capstone Defense", "Capstone Defense", "用 20 分鐘答辯說明你的 Docker Compose 到 AWS production 架構。"]
];

const phaseForDay = (day: number): Phase => {
  if (day <= 5) return "Deployment";
  if (day <= 15) return "Advanced";
  return "Deep Dive";
};

const intensityForDay = (day: number) => {
  if (day <= 5) return "部署落地 / Ship-first";
  if (day <= 15) return "進階 production 化 / Advanced Production";
  return "深入架構與營運 / Deep Dive Operations";
};

const minutesForDay = (day: number) => {
  if (day <= 5) return "35-55 min";
  if (day <= 15) return "45-75 min";
  return "60-90 min";
};

const commandForDay = (day: number, titleEn: string) => {
  if (day === 1) return "docker-compose config --services\nlsof -nP -iTCP -sTCP:LISTEN";
  if (day === 2) return "docker-compose up -d\ncurl -I http://localhost:18080/health";
  if (day === 3) return "docker build -t ticketfactory-api:$(git rev-parse --short HEAD) .";
  if (day === 4) return "ssh ec2-user@<ec2-public-ip>\ndocker-compose up -d";
  if (day === 5) return "aws rds describe-db-instances\naws s3 ls\nredis-cli -h <endpoint> ping";
  if (titleEn.includes("ECR")) return "aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com";
  if (titleEn.includes("ECS")) return "aws ecs update-service --cluster ticketfactory --service web --force-new-deployment";
  if (titleEn.includes("CloudWatch")) return "aws logs tail /ecs/ticketfactory-web --follow";
  if (titleEn.includes("GitHub")) return "git push origin main";
  if (titleEn.includes("Cost")) return "aws ce get-cost-and-usage --time-period Start=2026-06-01,End=2026-06-30 --granularity MONTHLY --metrics UnblendedCost";
  return "aws sts get-caller-identity";
};

const pitfallForDay = (day: number) => {
  if (day <= 5) return "Deployment-first 不代表亂上線；每一天都要留下可以 rollback 與驗收的文件。";
  if (day <= 15) return "進階階段最常失敗在 boundary 沒切清楚：web、worker、scheduler、database、storage 要分開驗證。";
  return "深入階段不要只追服務可用，要能解釋安全、成本、可靠性、擴展與事件處理。";
};

const sourceNotesForDay = (day: number, titleEn: string) => {
  const notes = [
    "AWS current note: ECS Fargate Linux LATEST platform version is documented as 1.4.0; redeploy tasks to pick up latest platform revision.",
    "Official-first rule: 優先以 AWS docs / AWS GitHub Actions / AWS Samples 作為課程來源，community posts 只作為 troubleshooting cases。"
  ];
  if (day <= 5) {
    notes.push("Chinese reference: AWS Taiwan ECS/Fargate pages are used for bilingual terminology, but commands follow official English docs.");
  }
  if (titleEn.includes("ECS") || titleEn.includes("Fargate")) {
    notes.push("ECS task definitions should be treated as code; web, worker, scheduler require separate task/service boundaries.");
  }
  if (titleEn.includes("Secrets")) {
    notes.push("Use ECS task definition `secrets` with Secrets Manager or SSM Parameter Store; do not bake APP_KEY or DB password into images.");
  }
  if (titleEn.includes("S3")) {
    notes.push("Use S3 presigned URLs for time-limited upload/download; the signer permissions bound what the URL can do.");
  }
  if (titleEn.includes("GitHub")) {
    notes.push("Use AWS-maintained GitHub Actions for ECS deploy; render task definition with commit SHA image tag before deploying.");
  }
  if (titleEn.includes("Health")) {
    notes.push("ALB health check tuning affects deployment speed; target group health settings must match the app readiness endpoint.");
  }
  return notes;
};

const buildLesson = (day: number, topic: string[]) => {
  const [title, titleEn, summary] = topic;
  const phase = phaseForDay(day);
  return {
    day,
    phase,
    title,
    titleEn,
    summary,
    duration: minutesForDay(day),
    intensity: intensityForDay(day),
    lab: day <= 5
      ? "完成一個可交付 deployment artifact，包含指令、截圖、檢查清單與 rollback note。"
      : day <= 15
        ? "完成一個 productionization lab，將 TicketFactory 的 dev compose 能力轉成雲端可維護能力。"
        : "完成一份 deep-dive review artifact，能向工程主管說明設計取捨與風險。",
    command: commandForDay(day, titleEn),
    pitfall: pitfallForDay(day),
    documentSpec: [
      `Learning note: ${titleEn} 的中文/English 概念、適用情境、與 TicketFactory 對應檔案。`,
      "Architecture spec: 畫出 before/after flow，標記 stateless service、stateful service、network boundary。",
      "Runbook: 寫出 setup、deploy、verify、rollback 四段指令，不留口頭步驟。",
      "Risk note: 至少列出 3 個踩雷點、偵測方式、修復方式。"
    ],
    interfaceGuide: [
      "Learning UI: 每日 lesson page 要顯示 Concept、Document Spec、Hands-on Steps、Acceptance Criteria。",
      "Admin UI: 這一天的完成率、卡關率、測驗通過率應能在 Dashboard 被追蹤。",
      "Scenario UI: 使用者輸入自己的 project stack 後，應能看到本日對應的 AWS service mapping。",
      "Progress UI: 完成本日 checkpoint 後，tenant-scoped progress 更新。"
    ],
    steps: [
      "Read: 先閱讀本日概念，確認你知道這個 AWS/Docker 元件解決什麼問題。",
      "Inspect: 對照 TicketFactory 的 docker-compose、Dockerfile、env、Nginx 或 Laravel config。",
      "Implement: 依照本日 lab 產出設定、指令或架構文件。",
      "Verify: 用 command、browser、logs 或 screenshot 驗證，不用感覺宣告完成。",
      "Record: 把結果寫進 deployment report，包含問題、修復與下一步。"
    ],
    acceptance: [
      "至少 20 分鐘以上可操作內容，不只閱讀文字。",
      "有一份可保存的文件或規格輸出。",
      "有一個明確 command 或 UI 操作可以驗證。",
      "有踩雷點與 rollback / recovery note。",
      "能說明此日內容如何推進 TicketFactory 上 AWS。"
    ],
    expectedOutcome: `${phase} 階段 Day ${day} 完成後，學員會得到一份 ${titleEn} artifact，並能把它放進最終 AWS deployment portfolio。`,
    sourceNotes: sourceNotesForDay(day, titleEn)
  } satisfies Lesson;
};

export const allLessons: Lesson[] = [
  ...deploymentTopics.map((topic, index) => buildLesson(index + 1, topic)),
  ...advancedTopics.map((topic, index) => buildLesson(index + 6, topic)),
  ...deepDiveTopics.map((topic, index) => buildLesson(index + 16, topic))
];

export const quizQuestions = [
  {
    id: "q1",
    prompt: "在 production 中，Laravel 上傳檔案最不應該只放在哪裡？",
    promptEn: "Where should Laravel uploads not live as the only copy in production?",
    options: ["Container local filesystem", "S3", "EFS", "Private object storage"],
    answer: "Container local filesystem",
    explanation: "Container is disposable. 容器可被重建，重要檔案應放在 S3/EFS 等持久層。"
  },
  {
    id: "q2",
    prompt: "ECS Fargate 部署 Laravel Queue Worker 時，最適合的做法是？",
    promptEn: "What is the best ECS pattern for Laravel Queue Worker?",
    options: ["Run it inside the same web request", "Create a separate ECS Service", "Use browser cron", "Store jobs in Git"],
    answer: "Create a separate ECS Service",
    explanation: "Queue Worker should scale and restart independently. Worker 應與 web API 分開管理。"
  },
  {
    id: "q3",
    prompt: "RDS production database 的 Security Group 應該允許誰連線？",
    promptEn: "Who should be allowed to connect to production RDS?",
    options: ["0.0.0.0/0", "Only ECS task security group", "Every office IP forever", "Any GitHub Actions runner"],
    answer: "Only ECS task security group",
    explanation: "Use least privilege. Database should stay private and accept traffic only from known app sources."
  }
];

export const labs = [
  {
    title: "Port Conflict Debugging",
    description: "TicketFactory uses 8080/8443/5432/6379. 你需要為教學網站避開這些 ports。",
    hint: "先用 lsof 檢查目前 listening ports。",
    diagnosis: "Docker Desktop already owns 80/443, and TicketFactory compose uses 8080/8443.",
    solution: "Use 4321 for this learning platform, and 18080/18443 override for TicketFactory labs."
  },
  {
    title: "Production Image Packaging",
    description: "docker-compose.prod.yml 掛 storage volume，但 PHP image 沒有 app source。",
    hint: "檢查 Dockerfile 是否 COPY backend source。",
    diagnosis: "Runtime image only installs extensions. Production needs code packaged into image.",
    solution: "Add multi-stage build: copy backend, composer install --no-dev, run artisan optimize."
  },
  {
    title: "ALB Health Check Failed",
    description: "ECS service 一直重啟，Target Group health check 顯示 unhealthy。",
    hint: "確認 health check path、container port、security group。",
    diagnosis: "ALB cannot reach a stable 200 response from the task.",
    solution: "Create /health endpoint, map target group to correct container port, allow ALB SG to ECS SG."
  }
];

export const members = [
  { name: "王小明", email: "xiaoming@example.com", status: "Active", progress: 65, day: 19, score: 86 },
  { name: "李思涵", email: "siyuan@example.com", status: "Active", progress: 32, day: 10, score: 74 },
  { name: "張偉", email: "wei@example.com", status: "Trial", progress: 87, day: 26, score: 92 },
  { name: "陳雅婷", email: "yating@example.com", status: "Active", progress: 12, day: 4, score: 61 },
  { name: "林志明", email: "zhiming@example.com", status: "Paused", progress: 0, day: 1, score: 0 }
];

export const zeroStartSteps = [
  {
    id: "repo-audit",
    title: "Step 1: 專案盤點 / Project Audit",
    body: "先列出你的 Docker Compose services、ports、volumes、env files，建立 deployment inventory。",
    output: "產出 services-to-AWS mapping table"
  },
  {
    id: "local-run",
    title: "Step 2: 本機啟動 / Local Run",
    body: "確認專案可以在不衝突的 ports 上啟動，並驗證 frontend、backend、database、queue。",
    output: "產出 local readiness checklist"
  },
  {
    id: "production-image",
    title: "Step 3: Production Image",
    body: "把 dev bind mount 改成 production image packaging，Laravel 要 COPY source 並執行 composer install。",
    output: "產出 Dockerfile production checklist"
  },
  {
    id: "aws-target",
    title: "Step 4: AWS Target Architecture",
    body: "選擇 EC2 first 或 ECS Fargate main path，並決定 RDS、S3、ElastiCache、CloudWatch 的使用方式。",
    output: "產出 AWS architecture diagram"
  },
  {
    id: "first-deploy",
    title: "Step 5: 第一次部署 / First Deploy",
    body: "先讓一個 health endpoint 通過，再逐步接上 database、queue、storage、domain、CI/CD。",
    output: "產出 deployment runbook"
  }
];

export const seedTenants = [
  { id: "tenant-ticketfactory", name: "TicketFactory 團隊", plan: "Team", domain: "ticketfactory.local", members: 3 },
  { id: "tenant-cerry-lab", name: "Cerry AWS Lab", plan: "Solo", domain: "cerry-lab.local", members: 1 }
];

export const seedUsers = [
  { id: "user-admin", name: "Admin Demo", email: "admin@example.com", password: "password123", role: "admin", tenantId: "tenant-ticketfactory" },
  { id: "user-student", name: "John Smith", email: "john@example.com", password: "password123", role: "student", tenantId: "tenant-ticketfactory" }
];
