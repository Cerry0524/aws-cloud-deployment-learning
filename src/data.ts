export type Phase = "Deployment" | "Advanced" | "Deep Dive";

export type RoadmapSection = {
  key: string;
  title: string;
  titleEn: string;
  startDay: number;
  endDay: number;
  objective: string;
};

export const roadmapSections: RoadmapSection[] = [
  {
    key: "deployment",
    title: "部署落地",
    titleEn: "Deployment",
    startDay: 1,
    endDay: 5,
    objective: "把 Docker Compose 專案變成可驗證、可回滾、可交付的部署資產。"
  },
  {
    key: "advanced",
    title: "進階 Production 化",
    titleEn: "Advanced Production",
    startDay: 6,
    endDay: 15,
    objective: "把 container、網路、資料層與 CI/CD 拆成 AWS 可維運邊界。"
  },
  {
    key: "deep-dive",
    title: "深入營運與治理",
    titleEn: "Deep Dive Operations",
    startDay: 16,
    endDay: 30,
    objective: "強化安全、可靠性、成本與答辯能力，形成能被審查的 production-ready 作品。"
  }
];

export type MentorStep = {
  id: string;
  title: string;
  instruction: string;
  expectedResult: string;
  commonMistake: string;
  mentorQuestion: string;
};

export type MentorQuestion = {
  id: string;
  question: string;
  answer: string;
};

export type MentorScript = {
  scenario: string;
  whyItMatters: string;
  todayGoal: string;
  previousContext: string;
  nextContext: string;
  guidedSteps: MentorStep[];
  quickQuestions: MentorQuestion[];
  deliverables: string[];
};

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
  mentorScript: MentorScript;
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
  if (day === 2) return "docker compose config\ndocker compose --env-file .env.production.local up -d\ndocker compose ps\ncurl -I http://localhost:18080/health\ndocker compose logs --tail=80 api";
  if (day === 3) return "docker build -t ticketfactory-api:$(git rev-parse --short HEAD) .\ndocker run --rm ticketfactory-api:$(git rev-parse --short HEAD) php artisan --version\ndocker image inspect ticketfactory-api:$(git rev-parse --short HEAD)";
  if (day === 4) return "ssh ec2-user@<ec2-public-ip>\nsudo dnf update -y\nsudo dnf install -y docker\nsudo systemctl enable --now docker\ndocker compose version\ndocker compose up -d\ndocker compose ps\ncurl -I http://<ec2-public-ip>/health";
  if (day === 5) return "aws rds describe-db-instances\naws s3 ls\naws elasticache describe-cache-clusters\nredis-cli -h <redis-endpoint> ping";
  if (titleEn.includes("ECR")) return "aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com";
  if (titleEn.includes("ECS")) return "aws ecs update-service --cluster ticketfactory --service web --force-new-deployment";
  if (titleEn.includes("CloudWatch")) return "aws logs tail /ecs/ticketfactory-web --follow";
  if (titleEn.includes("GitHub")) return "git push origin main";
  if (titleEn.includes("Cost")) return "aws ce get-cost-and-usage --time-period Start=2026-06-01,End=2026-06-30 --granularity MONTHLY --metrics UnblendedCost";
  return "aws sts get-caller-identity";
};

const pitfallForDay = (day: number) => {
  if (day === 2) return "Production-like 不等於本機隨便跑；port、env、health endpoint、logs 都要留下證據，否則 Day4 上 EC2 只會把問題搬到雲端。";
  if (day === 3) return "Production image 不是 dev container；不要依賴 bind mount、latest tag、dev dependency 或 container local storage。";
  if (day === 4) return "EC2 first deploy 不是最終架構；重點是先建立可理解的 server/firewall/runtime/rollback 路徑，Security Group 不可為了方便全開。";
  if (day === 5) return "抽離 stateful service 時不要只改 endpoint；要同時處理 security boundary、backup/restore、migration rollback 與檔案權限。";
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
  if (day === 3) {
    notes.push("Official AWS ECS image guidance: create immutable container images and verify the runtime before using them in ECS or EC2 deployments.");
  }
  if (day === 4) {
    notes.push("Amazon Linux 2023 note: AWS ECS image guide documents Docker installation on EC2 with AL2023; use dnf-based commands instead of older amazon-linux-extras flow.");
  }
  if (day === 5) {
    notes.push("Managed service extraction note: RDS, S3, and ElastiCache require network/security boundaries and backup or lifecycle policy decisions, not only endpoint replacement.");
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

const dayOneMentorScript: MentorScript = {
  scenario:
    "你手上有一個 Laravel + React + PostgreSQL + Redis 的 Docker Compose 專案。有人問你：這個可以部署到 AWS 嗎？今天先不要急著回答可以，因為你還不知道哪些東西是 app、哪些是資料、哪些不能丟。",
  whyItMatters:
    "AWS 部署不是把 docker-compose.yml 丟到雲端就結束。你需要先知道服務、port、volume、env 與資料責任，後面才能判斷什麼要進 ECS、什麼要進 RDS、什麼要進 S3。",
  todayGoal:
    "產出第一份 Deployment Inventory，讓後面的 EC2、ECS、RDS、S3、Secrets Manager 都有依據。",
  previousContext:
    "這是第一天，所以我們從本機 Docker Compose 專案盤點開始。",
  nextContext:
    "Day 2 會用這份盤點啟動 production-like 本機環境，確認服務能被穩定驗證。",
  guidedSteps: [
    {
      id: "services",
      title: "找出 services",
      instruction: "打開 docker-compose.yml，列出每個 top-level service，先不要急著判斷 AWS 架構。",
      expectedResult: "得到一張 service name 與責任說明表，例如 frontend、api、database、redis、worker。",
      commonMistake: "把所有 container 都當成同一種 workload，導致後面 ECS service、RDS、Redis 的責任切不清楚。",
      mentorQuestion: "哪些 service 是 application runtime？哪些 service 是 data infrastructure？"
    },
    {
      id: "ports",
      title: "找出 ports",
      instruction: "檢查 compose 裡的 ports，並執行 docker-compose config --services 輔助確認服務清單。",
      expectedResult: "列出哪些 port 是給瀏覽器或 ALB 進來，哪些只應該在內部 network 使用。",
      commonMistake: "看到 service 有 port 就以為它一定要公開到網路，結果 security group 開太大。",
      mentorQuestion: "未來 ALB 需要打到哪一個 port？資料庫 port 需要公開嗎？"
    },
    {
      id: "volumes",
      title: "找出 volumes",
      instruction: "檢查 named volumes、bind mounts、storage 目錄與 database data 目錄。",
      expectedResult: "列出 container 重建後不能消失的資料，例如 database、uploads、logs 或 cache。",
      commonMistake: "把 uploads 或 database files 只放在 disposable container 裡，重建後資料就不見。",
      mentorQuestion: "哪些資料之後應該搬到 RDS、S3、EFS 或 ElastiCache？"
    },
    {
      id: "env",
      title: "找出環境變數",
      instruction: "檢查 .env、compose environment 與 Laravel / React config，分出 secret 與 non-secret。",
      expectedResult: "得到一份 secret/config classification，例如 APP_KEY、DB_PASSWORD、API_URL。",
      commonMistake: "把 APP_KEY、database password 或 API token 打包進 image 或 commit 到 Git。",
      mentorQuestion: "哪些值未來應該放到 Secrets Manager 或 SSM Parameter Store？"
    },
    {
      id: "mapping",
      title: "草擬 AWS mapping",
      instruction: "把每個本機元件映射到未來 AWS service，先寫草稿，不追求最終答案。",
      expectedResult: "得到第一版 AWS deployment map，例如 React -> S3/CloudFront、Laravel -> ECS、PostgreSQL -> RDS。",
      commonMistake: "還沒理解 stateful dependencies 就直接跳到 ECS，最後 database、storage、queue 全部卡住。",
      mentorQuestion: "哪些東西可以跑在 container？哪些應該改用 AWS managed infrastructure？"
    }
  ],
  quickQuestions: [
    {
      id: "why-inventory",
      question: "為什麼 Day 1 不直接部署？",
      answer:
        "因為部署前要先知道專案由哪些服務和資料組成。沒有 inventory，就無法正確設計 ECS service、RDS、S3、Redis、security group，也無法 rollback。"
    },
    {
      id: "what-is-port",
      question: "port 到底要看什麼？",
      answer:
        "你要分辨誰需要對外、誰只能內部使用。未來 ALB 只應該打到 web/API runtime，database 和 Redis 通常不應公開。"
    },
    {
      id: "what-is-volume",
      question: "volume 為什麼重要？",
      answer:
        "container 可以被重建，所以資料不能只靠 container filesystem。volume 代表你要特別處理的持久化責任，後面通常會映射到 RDS、S3、EFS 或其他 managed service。"
    }
  ],
  deliverables: [
    "Deployment Inventory table",
    "Port map",
    "Volume 與 persistence map",
    "Secret / config classification",
    "第一版 AWS service mapping",
    "Risk 與 rollback notes"
  ]
};

const deploymentMentorScripts: Record<number, MentorScript> = {
  1: dayOneMentorScript,
  2: {
    scenario:
      "你已經完成 Day 1 的 Deployment Inventory，但 dev compose 能跑不代表 production-like 能跑。今天要用接近上線的 env、port、health endpoint 與 logs，證明本機 stack 能被穩定啟動與驗證。",
    whyItMatters:
      "如果 Day 2 沒有先抓出 port collision、container env、health endpoint 與 log visibility 問題，Day 4 搬到 EC2 時只會把本機問題變成雲端問題，而且更難排查。",
    todayGoal:
      "產出 local production-like readiness checklist，包含 port mapping、env 檢查、health check result 與 log inspection note。",
    previousContext:
      "Day 1 已經列出 services、ports、volumes、env 與第一版 AWS mapping；今天要把它變成可驗證的本機啟動證據。",
    nextContext:
      "Day 3 會把這個可跑的 stack 轉成 production image，所以今天要先知道哪些設定不能依賴 dev-only 行為。",
    guidedSteps: [
      {
        id: "compose-config",
        title: "確認 compose 合成結果",
        instruction: "執行 docker compose config，檢查 service、ports、volumes、environment 是否和 Day 1 inventory 一致。",
        expectedResult: "得到一份可保存的 compose config 摘要，標記 frontend、api、db、redis、worker 的 runtime 邊界。",
        commonMistake: "只看 docker-compose.yml 原檔，忘記 override、env interpolation 會改變最終設定。",
        mentorQuestion: "最終 config 裡哪些 port 會對外？哪些只應該保留在 compose network？"
      },
      {
        id: "production-env",
        title: "用 production-like env 啟動",
        instruction: "建立 .env.production.local 草稿，使用非 dev port 與接近 production 的 APP_ENV、API_URL、DB_HOST、REDIS_HOST。",
        expectedResult: "docker compose --env-file .env.production.local up -d 能啟動，且不與既有專案 port 衝突。",
        commonMistake: "在 container 內仍使用 localhost 連 database 或 redis，導致本機 browser 可用但 container-to-container 失敗。",
        mentorQuestion: "在 container 裡 localhost 指向誰？DB_HOST 應該填 localhost 還是 service name？"
      },
      {
        id: "health-endpoint",
        title: "建立 health check 證據",
        instruction: "用 curl -I http://localhost:18080/health 檢查 readiness endpoint，並記錄 HTTP status、response time 與錯誤時的 log。",
        expectedResult: "得到 health check result，能判斷服務是真的 ready，而不是 container 只是 running。",
        commonMistake: "只看 docker compose ps 顯示 Up，就宣告服務可用，沒有驗證 HTTP endpoint。",
        mentorQuestion: "如果 health endpoint 回 500，下一個診斷指令是什麼？"
      },
      {
        id: "log-inspection",
        title: "讀取 API logs",
        instruction: "執行 docker compose logs --tail=80 api，找出啟動錯誤、DB connection、permission 或 config cache 問題。",
        expectedResult: "完成 log inspection note，至少記錄一個正常訊號與一個可能故障訊號。",
        commonMistake: "log 沒有集中、不知道 service name，未來上 CloudWatch 時完全找不到錯誤入口。",
        mentorQuestion: "你能從 log 判斷 Laravel 是否已連上 DB/Redis 嗎？"
      },
      {
        id: "readiness-checklist",
        title: "整理 local readiness checklist",
        instruction: "把 ports、env、health、logs、rollback command 整理成一份 Day 2 artifact。",
        expectedResult: "產出 local readiness checklist，Day 3 production image packaging 可直接引用。",
        commonMistake: "沒有留下指令輸出與檢查表，導致 Day 3 不知道 production image 要滿足哪些 runtime 條件。",
        mentorQuestion: "如果明天 image build 成功但跑不起來，你會回來檢查 Day 2 的哪一項？"
      }
    ],
    quickQuestions: [
      {
        id: "why-prod-like",
        question: "為什麼 dev compose 能跑還不夠？",
        answer: "因為 dev compose 常依賴 bind mount、localhost、debug env 與寬鬆 port。production-like run 會提早暴露 container network、health endpoint、env 與 log 問題。"
      },
      {
        id: "health-vs-running",
        question: "container running 和 service ready 差在哪？",
        answer: "running 只代表 process 還活著；ready 代表 HTTP endpoint、DB/Redis dependency 與 application config 都能正確工作。"
      },
      {
        id: "day2-output",
        question: "Day 2 最重要交付物是什麼？",
        answer: "local readiness checklist。它會成為 Day 3 production image smoke test 與 Day 4 EC2 first deploy 的驗收基準。"
      }
    ],
    deliverables: [
      "local production-like readiness checklist",
      "port mapping table",
      "health check result",
      "API log inspection note",
      "env risk note",
      "local rollback command"
    ]
  },
  3: {
    scenario:
      "Day 2 已證明 stack 能用 production-like 設定跑起來，但 dev bind mount 不能上線。今天要把 Laravel source、Composer dependencies、React dist、entrypoint 與 storage permission 做成可追蹤、可回滾的 production image。",
    whyItMatters:
      "Production image 是 EC2/ECS 部署的交付單位。如果 image 依賴本機檔案、latest tag 或 dev dependency，部署看似成功，實際 runtime 會在雲端啟動失敗。",
    todayGoal:
      "產出 production Dockerfile checklist、image tag policy、smoke test output 與 rollback image note。",
    previousContext:
      "Day 2 已經定義 production-like runtime 需要哪些 ports、env、health 與 logs；今天要讓 image 滿足這些條件。",
    nextContext:
      "Day 4 會把這個 image 或 compose stack 放到 EC2，所以今天必須確定 image 可獨立啟動，不靠 dev bind mount。",
    guidedSteps: [
      {
        id: "remove-bind-mount",
        title: "辨識 dev bind mount 依賴",
        instruction: "檢查 compose 與 Dockerfile，標記哪些 source、storage、vendor、node_modules 目前靠 bind mount 或本機檔案存在。",
        expectedResult: "得到 bind mount replacement checklist，知道哪些檔案必須 COPY 或 build 進 image。",
        commonMistake: "image build 成功但裡面沒有 app source，因為本機 dev 是靠 volume 掛進去。",
        mentorQuestion: "如果拿掉 volumes，Laravel app source 還存在於 container 裡嗎？"
      },
      {
        id: "build-image",
        title: "建立 commit SHA image",
        instruction: "執行 docker build -t ticketfactory-api:$(git rev-parse --short HEAD) .，避免使用 latest 作為唯一版本。",
        expectedResult: "得到可追蹤 image tag，能在 release note 中知道這版 image 對應哪個 commit。",
        commonMistake: "production 永遠用 latest，出事時不知道上一版是哪一個 image。",
        mentorQuestion: "rollback 時你要如何指定前一版 image？"
      },
      {
        id: "smoke-test",
        title: "執行 image smoke test",
        instruction: "用 docker run --rm ticketfactory-api:<sha> php artisan --version 或等效 command 驗證 runtime 裡有 Laravel app。",
        expectedResult: "得到 smoke test command output，證明 image 內有 app source 與 PHP runtime。",
        commonMistake: "只相信 docker build passed，沒有實際 run 一個最小命令。",
        mentorQuestion: "如果 artisan 不存在，代表 Dockerfile 哪一段可能漏掉？"
      },
      {
        id: "runtime-permission",
        title: "檢查 storage/cache 權限",
        instruction: "確認 storage、bootstrap/cache、config cache 的 runtime permission 與 production env 行為。",
        expectedResult: "完成 Laravel runtime permission note，標記哪些目錄需要 writable，哪些 config 需要 cache。",
        commonMistake: "production image 內 storage 不可寫，結果上線後 session、cache、logs 出錯。",
        mentorQuestion: "哪些目錄需要 writable？哪些資料不應寫進 container filesystem？"
      },
      {
        id: "image-runbook",
        title: "整理 image delivery runbook",
        instruction: "記錄 build、smoke test、inspect、rollback tag 四段指令。",
        expectedResult: "產出 production image runbook，可供 Day 4 EC2 或 Day 7 ECR 直接使用。",
        commonMistake: "沒有 image inspect 與 rollback note，導致部署後無法追蹤 image 內容與版本。",
        mentorQuestion: "你能用一句話說明這個 image 是否可以交給 EC2/ECS 執行嗎？"
      }
    ],
    quickQuestions: [
      {
        id: "why-image",
        question: "為什麼不能直接把 dev container 上線？",
        answer: "dev container 常依賴 bind mount、debug 設定與本機檔案。production image 必須把 runtime 需要的 app source 和 dependencies 打包成可重建 artifact。"
      },
      {
        id: "why-sha",
        question: "為什麼 image tag 要用 commit SHA？",
        answer: "commit SHA 讓部署與 rollback 可追蹤。latest 會移動，出事時很難知道目前環境到底跑哪一版。"
      },
      {
        id: "what-smoke",
        question: "image smoke test 要證明什麼？",
        answer: "證明 image 裡有 app source、runtime command 可執行，並且不是只在 build 階段看起來成功。"
      }
    ],
    deliverables: [
      "production Dockerfile checklist",
      "bind mount replacement checklist",
      "commit SHA image tag policy",
      "image smoke test output",
      "storage/cache permission note",
      "rollback image note"
    ]
  },
  4: {
    scenario:
      "今天不是最終 ECS 架構，而是用 EC2 + Docker Compose 完成第一版可理解的 cloud deploy。你要看懂使用者如何進到 EC2、Security Group 如何保護入口、Docker runtime 如何啟動，以及出事時如何 rollback。",
    whyItMatters:
      "EC2 first deploy 是全端工程師理解雲端部署最直覺的橋：server、firewall、SSH、Docker、domain、SSL、logs 都會在這一天碰到。它不是終點，但能建立後續 ECS/RDS/S3 抽離的真實感。",
    todayGoal:
      "產出 EC2 first deploy runbook，包含 inbound rule checklist、deployment verification note 與 rollback steps。",
    previousContext:
      "Day 3 已經產出可追蹤 production image 或 image runbook；今天要把部署單位放到 EC2 上跑出第一版雲端路徑。",
    nextContext:
      "Day 5 會把資料庫、檔案、Redis 等 stateful responsibility 從 EC2 主機抽離成 managed service plan。",
    guidedSteps: [
      {
        id: "connect-ec2",
        title: "連線到 EC2",
        instruction: "用 ssh ec2-user@<ec2-public-ip> 連線，記錄 instance OS、public endpoint 與 key 權限。",
        expectedResult: "能進入 EC2 shell，並留下 connection note，包含使用者、IP、region 與 security group 名稱。",
        commonMistake: "SSH key 權限錯或 Security Group 沒限制來源 IP，為了方便直接開 0.0.0.0/0。",
        mentorQuestion: "SSH 入口應該開給全世界，還是只開給你的可信來源？"
      },
      {
        id: "install-runtime",
        title: "安裝並驗證 Docker runtime",
        instruction: "在 Amazon Linux 2023 使用 dnf 安裝 Docker，啟動服務後檢查 docker --version 與 docker compose version。",
        expectedResult: "EC2 上 Docker daemon 已啟動，docker compose version 可被驗證。",
        commonMistake: "照舊文章使用 amazon-linux-extras，結果在 Amazon Linux 2023 上流程不符合目前文件。",
        mentorQuestion: "如果 docker daemon 沒啟動，docker compose up 會出現什麼類型錯誤？"
      },
      {
        id: "deploy-compose",
        title: "部署 compose stack",
        instruction: "將 compose file 與 env 放到 EC2，執行 docker compose up -d，並用 docker compose ps 確認 service 狀態。",
        expectedResult: "EC2 上 web/api/db/redis 或最小替代 stack 能啟動，並能列出 container 狀態。",
        commonMistake: "只開 EC2 Security Group port，卻忘記 compose ports 或 app listen port，導致外部仍無法連線。",
        mentorQuestion: "外部流量要經過 Security Group、host port、container port，哪一層最容易漏掉？"
      },
      {
        id: "verify-public-health",
        title: "驗證 public health endpoint",
        instruction: "用 curl -I http://<ec2-public-ip>/health 或 domain health URL 確認 HTTP status，並同步檢查 compose logs。",
        expectedResult: "得到 deployment verification note，包含 HTTP status、target URL、log 摘要與失敗時的診斷方向。",
        commonMistake: "部署指令成功就宣布上線，沒有從使用者入口驗證服務可用。",
        mentorQuestion: "如果 public health 失敗，你會先看 Security Group、Nginx、Laravel 還是 container logs？"
      },
      {
        id: "rollback-runbook",
        title: "寫出 rollback steps",
        instruction: "記錄如何回到前一版 compose file、image tag 或 env，並寫出 stop/restart/revert 指令。",
        expectedResult: "完成 EC2 rollback steps，可說明出事時如何恢復上一版。",
        commonMistake: "沒有保存上一版 image tag、compose file 或 env，rollback 只能靠猜。",
        mentorQuestion: "你現在能在 5 分鐘內說明如何 rollback 嗎？"
      }
    ],
    quickQuestions: [
      {
        id: "why-ec2-first",
        question: "為什麼不直接跳 ECS？",
        answer: "EC2 first deploy 讓你先看懂 server、firewall、Docker runtime、domain、SSL 與 rollback 的基本關係。理解後再進 ECS，service boundary 會更清楚。"
      },
      {
        id: "sg-risk",
        question: "Security Group 最大雷點是什麼？",
        answer: "為了快速測試而把 SSH、DB、Redis 或所有 port 對 0.0.0.0/0 開放。正式環境應最小開放，只讓必要來源連必要 port。"
      },
      {
        id: "ec2-output",
        question: "Day 4 要交付什麼？",
        answer: "EC2 first deploy runbook，包含連線、安裝、部署、驗證與 rollback，不能只留下口頭描述。"
      }
    ],
    deliverables: [
      "EC2 first deploy runbook",
      "Security Group inbound rule checklist",
      "Docker runtime verification note",
      "public health check result",
      "compose logs inspection note",
      "rollback steps"
    ]
  },
  5: {
    scenario:
      "EC2 first deploy 可以跑，但如果 DB、uploads、Redis 全部留在同一台主機，正式環境會在備份、擴展、安全與故障復原上卡住。今天要把 stateful services 抽離成 RDS、S3、ElastiCache 的 managed service plan。",
    whyItMatters:
      "AWS production 的關鍵不是把 container 原封不動搬上雲，而是把資料責任交給適合的 managed services。抽離資料層時，endpoint、security group、backup、migration、rollback 必須一起設計。",
    todayGoal:
      "產出 stateful extraction plan，包含 RDS/S3/Redis responsibility table、security boundary note 與 migration rollback note。",
    previousContext:
      "Day 4 已經讓 app 在 EC2 上有第一版可用路徑；今天要找出哪些資料責任不能長期留在 EC2。",
    nextContext:
      "Day 6 會正式進入 VPC 與 subnet 設計，把 ALB、app、RDS、Redis 放到合理 network boundary。",
    guidedSteps: [
      {
        id: "stateful-inventory",
        title: "列出 EC2 上的 stateful responsibility",
        instruction: "從 Day 4 compose stack 找出 database files、uploads、Redis session/cache、logs 與 env secrets。",
        expectedResult: "得到 EC2 stateful responsibility table，標記哪些資料會因主機重建而遺失。",
        commonMistake: "把 EC2 disk 當作正式資料層，沒有備份、restore 或 lifecycle 計畫。",
        mentorQuestion: "如果 EC2 壞掉，哪些資料會消失？哪些資料可以重建？"
      },
      {
        id: "rds-plan",
        title: "設計 RDS 抽離",
        instruction: "用 aws rds describe-db-instances 查詢資料庫狀態，草擬 DB endpoint、subnet、security group、backup 與 migration plan。",
        expectedResult: "得到 RDS extraction note，說明 DB 不 public、只允許 app security group 連線。",
        commonMistake: "RDS 開 public access，再靠密碼保護，忽略 network boundary。",
        mentorQuestion: "RDS 應該接受誰連線？GitHub Actions runner 需要直連 DB 嗎？"
      },
      {
        id: "s3-plan",
        title: "設計 S3 uploads 抽離",
        instruction: "用 aws s3 ls 確認 bucket 命名與權限策略，規劃 private uploads、signed URL、lifecycle 與 CORS。",
        expectedResult: "得到 S3 upload responsibility note，避免為了顯示圖片直接 public bucket。",
        commonMistake: "把 bucket 設 public 解決前端顯示問題，結果暴露不該公開的檔案。",
        mentorQuestion: "使用者下載 private upload 時，應該直接 public object 還是用 signed URL？"
      },
      {
        id: "redis-plan",
        title: "設計 Redis / ElastiCache 抽離",
        instruction: "用 aws elasticache describe-cache-clusters 或 redis-cli -h <redis-endpoint> ping 驗證快取 endpoint 與連線邊界。",
        expectedResult: "得到 Redis extraction note，說明 session/cache/queue 使用方式與 security group。",
        commonMistake: "只改 REDIS_HOST，沒有確認 subnet/security group/TLS/timeout，worker 上線後才開始 timeout。",
        mentorQuestion: "Redis 服務是給 browser 連，還是只給 app/worker 連？"
      },
      {
        id: "migration-rollback",
        title: "寫 migration rollback note",
        instruction: "整理 EC2 local state 移到 managed service 的順序：backup、copy/migrate、switch endpoint、verify、rollback。",
        expectedResult: "完成 migration rollback note，能說明切換失敗時如何回 EC2 舊路徑或 restore backup。",
        commonMistake: "只更新 endpoint，沒有備份與切回計畫，導致 migration 失敗時無法恢復服務。",
        mentorQuestion: "切換到 RDS/S3/Redis 後，你如何證明資料沒有遺失？"
      }
    ],
    quickQuestions: [
      {
        id: "why-extract",
        question: "為什麼 EC2 能跑還要抽離？",
        answer: "因為 EC2 first deploy 只證明可跑，不能證明可維護。DB、uploads、Redis 需要備份、權限、擴展與故障復原，通常應改用 managed services。"
      },
      {
        id: "endpoint-is-not-enough",
        question: "只改 endpoint 為什麼不夠？",
        answer: "資料抽離同時牽涉 network boundary、security group、backup/restore、migration order、application env 與 rollback。endpoint 只是其中一項。"
      },
      {
        id: "day5-output",
        question: "Day 5 完成後要能說什麼？",
        answer: "你要能說明 EC2 上哪些責任被抽到 RDS/S3/ElastiCache，為什麼這樣更安全、可備份、可擴展、可回復。"
      }
    ],
    deliverables: [
      "stateful extraction plan",
      "RDS/S3/Redis responsibility table",
      "RDS security boundary note",
      "S3 private upload and signed URL note",
      "ElastiCache connection note",
      "migration rollback note"
    ]
  }
};

const buildMentorScript = (day: number, title: string, titleEn: string, summary: string, phase: Phase): MentorScript => {
  if (deploymentMentorScripts[day]) return deploymentMentorScripts[day];

  const stageIntro = day <= 5
    ? "我們還在部署落地階段，重點是把本機 Docker Compose 專案變成可以被驗證、交付、rollback 的部署 artifact。"
    : day <= 15
      ? "我們進入 production 化階段，重點是把本機服務拆成 AWS 上可維護的邊界。"
      : "我們進入深入營運階段，重點是安全、可靠性、成本、擴展、治理與可說服人的架構取捨。";

  return {
    scenario: `${stageIntro} 今天的情境是：${summary}`,
    whyItMatters: `${title} 會影響後續 AWS deployment path。如果這一天只看概念不產出 artifact，後面的架構會缺少可驗證依據。`,
    todayGoal: `完成 ${titleEn} artifact，讓這一天的學習能被檢查、保存並延續到後續課程。`,
    previousContext: `Day ${day - 1} 已經完成前一個部署決策或 artifact，今天要在它的基礎上繼續推進。`,
    nextContext: day < 30
      ? `Day ${day + 1} 會使用今天的結果繼續處理下一個 AWS deployment concern。`
      : "這是最後一天，今天的輸出會整理成完整的部署答辯與 portfolio。",
    guidedSteps: [
      {
        id: "read",
        title: "理解今天的部署問題",
        instruction: `先閱讀 ${title} 的情境，確認它在 Docker Compose 到 AWS 的路徑中解決什麼問題。`,
        expectedResult: "你能用自己的話說出今天的問題、影響範圍與不處理會發生什麼事。",
        commonMistake: "只背 AWS service 名稱，但不知道它解決哪一個部署痛點。",
        mentorQuestion: "如果今天跳過，後面的部署流程哪裡會失去依據？"
      },
      {
        id: "inspect",
        title: "對照 TicketFactory 現況",
        instruction: "回到 docker-compose、Dockerfile、env、Nginx、Laravel config 或 React build 設定，找出今天主題對應的真實位置。",
        expectedResult: "你能指出至少一個本機檔案、設定或 runtime 行為和今天主題有關。",
        commonMistake: "把課程當成雲端名詞介紹，沒有回到自己的專案驗證。",
        mentorQuestion: "這個主題在目前專案中對應到哪個檔案或哪個 runtime 行為？"
      },
      {
        id: "produce",
        title: "產出今天 artifact",
        instruction: "依照本日 lab 產出設定、表格、runbook、diagram 或 command result。",
        expectedResult: "今天有一份可以保存的輸出，而不是只看完文字。",
        commonMistake: "沒有留下 artifact，導致後面無法追蹤決策原因。",
        mentorQuestion: "你今天留下的 artifact 是什麼？後面誰會用到它？"
      }
    ],
    quickQuestions: [
      {
        id: "why-today",
        question: "今天為什麼重要？",
        answer: `${title} 是 ${phase} 階段的一個部署決策點。它讓你把抽象概念轉成可驗證的設定、文件或操作。`
      },
      {
        id: "what-output",
        question: "我今天要交什麼？",
        answer: `你今天要交付 ${titleEn} artifact，並且能說明它如何推進 Docker Compose 到 AWS production deployment。`
      }
    ],
    deliverables: [
      `${titleEn} learning note`,
      "一份可保存的設定、表格、diagram 或 runbook",
      "驗證指令或畫面截圖",
      "常見雷點與 rollback / recovery note"
    ]
  };
};

const deploymentDocumentSpecByDay: Record<number, string[]> = {
  2: [
    "Local readiness checklist: 記錄 docker compose config、service status、port mapping、env 檢查結果。",
    "Health evidence: 保存 curl -I /health 的 HTTP status、target URL、時間與失敗時 log。",
    "Log inspection note: 至少列出 API 啟動成功訊號、DB/Redis connection 訊號與一個可能故障訊號。",
    "Rollback note: 寫出 docker compose down、回復 env、回復 ports 的操作。"
  ],
  3: [
    "Production Dockerfile checklist: 標記 source COPY、composer install、npm build、entrypoint、storage permission。",
    "Image tag policy: 使用 commit SHA / release tag，禁止只依賴 latest。",
    "Smoke test evidence: 保存 docker run --rm <image> php artisan --version 或等效 runtime command output。",
    "Rollback image note: 寫出如何回到前一個 image tag。"
  ],
  4: [
    "EC2 first deploy runbook: setup、deploy、verify、rollback 四段指令完整寫出。",
    "Security Group checklist: SSH/HTTP/HTTPS 來源、DB/Redis 是否禁止公開、臨時規則移除時間。",
    "Public verification note: 保存 public endpoint /health 檢查結果與 docker compose logs 摘要。",
    "Rollback steps: 記錄前一版 compose/env/image tag 與恢復流程。"
  ],
  5: [
    "Stateful extraction plan: 標記 DB、uploads、Redis、logs、secrets 從 EC2 抽離到哪個 managed service。",
    "RDS/S3/Redis responsibility table: 說明每個 service 的資料責任、安全邊界與驗證方式。",
    "Migration sequence: backup、copy/migrate、switch endpoint、verify、rollback 五段流程。",
    "Security boundary note: RDS/Redis 不 public，S3 uploads 不直接公開，使用 least privilege。"
  ]
};

const deploymentStepsByDay: Record<number, string[]> = {
  2: [
    "Read: 先確認 Day 1 inventory，知道哪些 service 與 port 要被驗證。",
    "Inspect: 執行 docker compose config，檢查 override/env interpolation 後的最終設定。",
    "Implement: 使用 .env.production.local 啟動 production-like stack，避開本機 port collision。",
    "Verify: 用 docker compose ps、curl /health、docker compose logs 確認服務 ready。",
    "Record: 整理 local readiness checklist，留下 health、log、port、env 證據。"
  ],
  3: [
    "Read: 先分辨 dev bind mount 和 production image 的差異。",
    "Inspect: 檢查 Dockerfile、compose volumes、Laravel storage/cache、React build output。",
    "Implement: build commit SHA image，移除對本機 bind mount 的 runtime 依賴。",
    "Verify: 用 docker run smoke test 和 docker image inspect 驗證 image 內容。",
    "Record: 寫出 image tag policy、smoke test output、rollback image note。"
  ],
  4: [
    "Read: 先理解 EC2 first deploy 的目的：不是最終架構，而是建立可上線、可驗證、可回滾路徑。",
    "Inspect: 檢查 EC2 OS、security group、SSH key、Docker runtime、compose file 與 env。",
    "Implement: 在 EC2 啟動 Docker Compose stack，限制 inbound 規則，只開必要入口。",
    "Verify: 從 public endpoint curl /health，並用 docker compose logs 交叉確認。",
    "Record: 寫出 EC2 first deploy runbook 與 rollback steps。"
  ],
  5: [
    "Read: 先列出 Day 4 EC2 stack 中所有 stateful responsibility。",
    "Inspect: 檢查 DB、uploads、Redis、logs、secrets 分別需要的 backup/security/rollback。",
    "Implement: 草擬 RDS、S3、ElastiCache endpoint 與 security group mapping。",
    "Verify: 用 AWS CLI 或 pseudo-command 確認 managed service 可被查詢與連線設計可驗證。",
    "Record: 完成 stateful extraction plan、migration sequence 與 security boundary note。"
  ]
};

const deploymentAcceptanceByDay: Record<number, string[]> = {
  2: [
    "能說明 docker compose config 和原始 compose file 可能不同。",
    "能使用 production-like env 啟動 stack，並避開 port collision。",
    "有 health endpoint 驗證與 API log inspection 證據。",
    "能指出 localhost 在 browser 與 container 內代表不同位置。",
    "有 local readiness checklist 可供 Day 3 使用。"
  ],
  3: [
    "能說明 production image 為什麼不能依賴 dev bind mount。",
    "能 build commit SHA image，並保存 image tag policy。",
    "有 docker run smoke test output 或等效 runtime 驗證。",
    "有 Laravel storage/cache permission 與 React dist artifact 檢查。",
    "有 rollback image note 可供 Day 4 使用。"
  ],
  4: [
    "能用自己的話說明 Browser -> Security Group -> EC2 -> Docker Compose 的流量路徑。",
    "能列出 EC2 setup、Docker runtime、compose deploy、verify、rollback 指令。",
    "有 inbound rule checklist，並避免 DB/Redis 對外公開。",
    "有 public health check 與 docker compose logs 驗證證據。",
    "能說明 EC2 first deploy 是學習橋接，不是最終 production 架構。"
  ],
  5: [
    "能分辨 EC2 上哪些資料是 stateful，哪些可重建。",
    "能把 DB、uploads、Redis 對應到 RDS、S3、ElastiCache，並說明原因。",
    "能說明 RDS/Redis 的 security group 邊界與 S3 private upload 策略。",
    "有 backup、switch endpoint、verify、rollback 的 migration sequence。",
    "能說明可跑和可維護的差異。"
  ]
};

const buildLesson = (day: number, topic: string[]) => {
  const [title, titleEn, summary] = topic;
  const phase = phaseForDay(day);
  const mentorScript = buildMentorScript(day, title, titleEn, summary, phase);
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
    documentSpec: deploymentDocumentSpecByDay[day] ?? [
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
    steps: deploymentStepsByDay[day] ?? [
      "Read: 先閱讀本日概念，確認你知道這個 AWS/Docker 元件解決什麼問題。",
      "Inspect: 對照 TicketFactory 的 docker-compose、Dockerfile、env、Nginx 或 Laravel config。",
      "Implement: 依照本日 lab 產出設定、指令或架構文件。",
      "Verify: 用 command、browser、logs 或 screenshot 驗證，不用感覺宣告完成。",
      "Record: 把結果寫進 deployment report，包含問題、修復與下一步。"
    ],
    acceptance: deploymentAcceptanceByDay[day] ?? [
      "至少 20 分鐘以上可操作內容，不只閱讀文字。",
      "有一份可保存的文件或規格輸出。",
      "有一個明確 command 或 UI 操作可以驗證。",
      "有踩雷點與 rollback / recovery note。",
      "能說明此日內容如何推進 TicketFactory 上 AWS。"
    ],
    expectedOutcome: `${phase} 階段 Day ${day} 完成後，學員會得到一份 ${titleEn} artifact，並能把它放進最終 AWS deployment portfolio。`,
    sourceNotes: sourceNotesForDay(day, titleEn),
    mentorScript
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
