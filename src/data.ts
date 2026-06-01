export type Phase = "Docker" | "AWS" | "Runtime" | "Production" | "Capstone";

export type Lesson = {
  day: number;
  phase: Phase;
  title: string;
  titleEn: string;
  summary: string;
  duration: string;
  lab: string;
  command: string;
  pitfall: string;
};

export const lessons: Lesson[] = [
  {
    day: 1,
    phase: "Docker",
    title: "雲端部署全貌",
    titleEn: "Deployment Roadmap",
    summary: "把本機 Docker Compose 拆解成雲端服務地圖，理解 stateless 與 stateful 的分界。",
    duration: "55 min",
    lab: "畫出 TicketFactory local architecture diagram。",
    command: "docker compose ps",
    pitfall: "不要把 production database 當成 container volume 的附屬品。"
  },
  {
    day: 2,
    phase: "Docker",
    title: "TicketFactory 專案盤點",
    titleEn: "TicketFactory Audit",
    summary: "辨識 Laravel、React、PostgreSQL、Redis、Horizon、Reverb、Nginx 的服務責任。",
    duration: "70 min",
    lab: "標記 compose 中每個 service 的 AWS 對應服務。",
    command: "docker compose config --services",
    pitfall: "文件與 compose 實作可能不同，要以實際 config 作為部署來源。"
  },
  {
    day: 3,
    phase: "Docker",
    title: "Docker Compose 基礎強化",
    titleEn: "Compose Services, Networks, Volumes",
    summary: "理解 service、network、volume、depends_on healthcheck 在部署中的角色。",
    duration: "60 min",
    lab: "找出 TicketFactory 哪些資料應該持久化。",
    command: "docker compose config",
    pitfall: "depends_on 不等於 application ready，healthcheck path 要真的可靠。"
  },
  {
    day: 4,
    phase: "Docker",
    title: "Laravel Container Best Practice",
    titleEn: "Laravel Container Best Practice",
    summary: "整理 PHP-FPM、Nginx、composer install、storage permission、config cache。",
    duration: "80 min",
    lab: "設計 production PHP image packaging checklist。",
    command: "php artisan optimize",
    pitfall: "production image 不能只靠 bind mount；image 需要包含 app source。"
  },
  {
    day: 5,
    phase: "Docker",
    title: "React Build and Runtime",
    titleEn: "React Build and Runtime",
    summary: "理解 Vite build-time env、static assets 與 API endpoint strategy。",
    duration: "50 min",
    lab: "比對 local dev server 與 production static hosting。",
    command: "npm run build",
    pitfall: "Vite env 是 build-time，部署後改 env 不會自動更新已 build 的 JS。"
  },
  {
    day: 6,
    phase: "Docker",
    title: "Local Production Simulation",
    titleEn: "Production-like Compose",
    summary: "用本機 compose 模擬 production，包含 web、worker、scheduler、Redis、PostgreSQL。",
    duration: "90 min",
    lab: "建立 port conflict override plan。",
    command: "lsof -nP -iTCP -sTCP:LISTEN",
    pitfall: "多專案同時啟動時，80/443/5432/6379/8080 很容易衝突。"
  },
  {
    day: 7,
    phase: "Docker",
    title: "Week 1 Review",
    titleEn: "Local Stack Review",
    summary: "完成本機 production-like stack 的檢查、測驗與部署筆記。",
    duration: "45 min",
    lab: "提交 local deployment report。",
    command: "docker compose logs --tail=100",
    pitfall: "服務能啟動不代表 app flow 可用，要驗證 login、queue、storage。"
  },
  {
    day: 8,
    phase: "AWS",
    title: "AWS 帳戶與 IAM",
    titleEn: "AWS Account and IAM",
    summary: "建立 AWS account、IAM user、role、policy、MFA，為後續部署準備 least privilege。",
    duration: "90 min",
    lab: "設計部署用 IAM policy 邊界。",
    command: "aws sts get-caller-identity",
    pitfall: "不要用 root account 做日常部署，也不要把 access key commit 到 Git。"
  },
  {
    day: 9,
    phase: "AWS",
    title: "Networking 基礎與 VPC",
    titleEn: "VPC, Subnet, Security Group",
    summary: "用 TicketFactory 的 service dependency 理解 VPC、public/private subnet、Security Group。",
    duration: "85 min",
    lab: "畫出 ALB、ECS、RDS、Redis 的 network flow。",
    command: "aws ec2 describe-vpcs",
    pitfall: "RDS 不應公開到 0.0.0.0/0，Security Group 才是主要防線。"
  },
  {
    day: 10,
    phase: "AWS",
    title: "ECR Container Registry",
    titleEn: "Amazon ECR",
    summary: "建立 ECR repository，為 Laravel、Nginx、frontend image 建立版本化流程。",
    duration: "75 min",
    lab: "把 image tag 從 latest 改為 commit SHA。",
    command: "aws ecr get-login-password",
    pitfall: "永遠只用 latest 會讓 rollback 與問題追蹤變得很痛苦。"
  },
  {
    day: 11,
    phase: "AWS",
    title: "ECS vs EC2 vs Elastic Beanstalk",
    titleEn: "Compute Deployment Options",
    summary: "比較自管 VM、managed platform、container orchestration，選定 ECS Fargate 主線。",
    duration: "60 min",
    lab: "為 TicketFactory 選擇 web、worker、scheduler runtime。",
    command: "aws ecs list-clusters",
    pitfall: "選 ECS 不代表不用理解 network、health check、logs 與 task lifecycle。"
  },
  {
    day: 12,
    phase: "AWS",
    title: "ECS Fargate 第一次部署",
    titleEn: "First ECS Fargate Deploy",
    summary: "建立 Cluster、Task Definition、Service，讓 Laravel container 在雲端啟動。",
    duration: "100 min",
    lab: "把 container port 與 task port 對齊。",
    command: "aws ecs update-service --force-new-deployment",
    pitfall: "container port、target group port、security group 任一錯位都會造成 502。"
  },
  {
    day: 13,
    phase: "AWS",
    title: "ALB and Health Check",
    titleEn: "Application Load Balancer",
    summary: "設定 ALB、Target Group、Health Check path，讓服務可以穩定對外。",
    duration: "70 min",
    lab: "設計 /health endpoint 與 Laravel readiness check。",
    command: "curl -I https://api.example.com/health",
    pitfall: "health check 回 200 但 app dependency 壞掉，會產生假健康。"
  },
  {
    day: 14,
    phase: "AWS",
    title: "Week 2 Review",
    titleEn: "First Cloud Endpoint",
    summary: "完成第一個雲端 API endpoint，整理部署紀錄與 rollback plan。",
    duration: "50 min",
    lab: "建立 deployment verification checklist。",
    command: "aws ecs describe-services",
    pitfall: "部署成功不等於可用，要同時看 ALB target health 與 CloudWatch logs。"
  }
];

const phaseCycle: Phase[] = ["Runtime", "Runtime", "Runtime", "Runtime", "Runtime", "Runtime", "Runtime", "Production", "Production", "Production", "Production", "Production", "Production", "Production", "Capstone", "Capstone"];

export const allLessons: Lesson[] = [
  ...lessons,
  ...Array.from({ length: 16 }, (_, index) => {
    const day = index + 15;
    const titles = [
      ["RDS PostgreSQL", "Managed Database"],
      ["Laravel Migration on AWS", "Migration Strategy"],
      ["Secrets Manager", "Runtime Secrets"],
      ["ElastiCache Redis", "Queue and Cache"],
      ["S3 File Storage", "Object Storage"],
      ["CloudFront Frontend", "Static Frontend"],
      ["Week 3 Review", "Working Staging System"],
      ["Route 53 and ACM", "Domain and HTTPS"],
      ["CloudWatch Logs", "Observability"],
      ["GitHub Actions CI/CD", "Deployment Pipeline"],
      ["Zero Downtime Deployment", "Rolling Update"],
      ["Auto Scaling", "Performance and Scale"],
      ["Security Hardening", "Production Security"],
      ["Cost Optimization", "AWS Cost Control"],
      ["Architecture Review", "Advanced AWS Review"],
      ["Capstone Demo", "Deployment Portfolio"]
    ][index];
    return {
      day,
      phase: phaseCycle[index],
      title: titles[0],
      titleEn: titles[1],
      summary: "使用 TicketFactory 逐步把 local Docker Compose 能力轉成 AWS production deployment 能力。",
      duration: day < 29 ? "75 min" : "120 min",
      lab: day === 30 ? "完成 final deployment report and portfolio demo。" : "完成本日 AWS deployment checkpoint。",
      command: day === 24 ? "git push && gh workflow run deploy.yml" : "aws --version",
      pitfall: day === 28 ? "小專案最常忽略 NAT Gateway 與 CloudWatch retention 成本。" : "先驗證 dependency，再宣告 deployment 完成。"
    };
  })
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
  {
    id: "tenant-ticketfactory",
    name: "TicketFactory 團隊",
    plan: "Team",
    domain: "ticketfactory.local",
    members: 3
  },
  {
    id: "tenant-cerry-lab",
    name: "Cerry AWS Lab",
    plan: "Solo",
    domain: "cerry-lab.local",
    members: 1
  }
];

export const seedUsers = [
  {
    id: "user-admin",
    name: "Admin Demo",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
    tenantId: "tenant-ticketfactory"
  },
  {
    id: "user-student",
    name: "John Smith",
    email: "john@example.com",
    password: "password123",
    role: "student",
    tenantId: "tenant-ticketfactory"
  }
];
