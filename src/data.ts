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
  examMapping: string[];
  mentorScript: MentorScript;
};

type AssociateLabSpec = {
  scenario: string;
  whyItMatters: string;
  todayGoal: string;
  previousContext: string;
  nextContext: string;
  command: string;
  pitfall: string;
  documentSpec: string[];
  steps: string[];
  acceptance: string[];
  examMapping: string[];
  deliverables: string[];
  quickQuestions: MentorQuestion[];
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

const associateLabSpecs: Record<number, AssociateLabSpec> = {
  6: {
    scenario:
      "Day 5 已經把資料責任拆到 RDS、S3、ElastiCache 草圖。今天要先畫出 network boundary：ALB 在 public subnet，Laravel/ECS task 在 private subnet，RDS 與 Redis 只接受 app security group。",
    whyItMatters:
      "VPC 不是雲端版本的資料夾，而是流量、隔離、路由與安全邊界。VPC 畫錯，後面 ECS、RDS、ALB、CloudFront 都會被迫用危險的公開設定補洞。",
    todayGoal:
      "產出 public/private subnet diagram、route table note 與 security group matrix。",
    previousContext:
      "Day 5 已經決定 DB、uploads、Redis 要抽離；今天決定它們放在哪個 network boundary 裡。",
    nextContext:
      "Day 7 會建立 ECR image repository；有了 network 邊界後，後續 ECS service 才知道要部署到哪些 subnet。",
    command:
      "aws ec2 describe-vpcs\naws ec2 describe-subnets --filters Name=vpc-id,Values=<vpc-id>\naws ec2 describe-route-tables --filters Name=vpc-id,Values=<vpc-id>\naws ec2 describe-security-groups --group-ids <alb-sg> <app-sg> <db-sg>",
    pitfall:
      "不要把 private subnet 畫完又讓 RDS public accessible；路由表、NAT、security group、public IP 必須一起檢查。",
    documentSpec: [
      "Public/private subnet diagram: 標出 ALB、ECS task、RDS、Redis 各自所在 subnet。",
      "Route table note: 說明 public subnet 走 Internet Gateway，private subnet 是否需要 NAT 出網。",
      "Security Group matrix: Browser -> ALB、ALB -> app、app -> RDS/Redis，禁止 DB/Redis 對外。",
      "Failure note: 若 ECS task 拉不到 image 或連不到 DB，列出可能是 route、NAT、SG、DNS 哪一層。"
    ],
    steps: [
      "Read: 先看懂 public subnet、private subnet、route table、security group 的角色差異。",
      "Inspect: 對照 Day 5 stateful extraction plan，決定 RDS/Redis 不公開、app task 放 private subnet。",
      "Implement: 畫出 Browser -> ALB -> ECS -> RDS/Redis 的 network flow，補上 route table 與 SG matrix。",
      "Verify: 用 AWS CLI describe VPC/subnet/route-table/security-groups，確認設計能被實際資源對應。",
      "Record: 保存 network diagram、route note、SG matrix 與故障診斷順序。"
    ],
    acceptance: [
      "能說明 public subnet 與 private subnet 的差異，不只背名稱。",
      "能畫出 ALB、ECS、RDS、Redis 的 network boundary。",
      "Security Group matrix 只開必要來源與 port。",
      "能指出 RDS public accessible 為什麼通常是錯誤方向。",
      "有 route table/NAT/SG 的故障診斷 note。"
    ],
    examMapping: [
      "SAA-C03: Design Secure Architectures - network boundary、least privilege access、private data layer。",
      "SAA-C03: Design Resilient Architectures - multi-AZ subnet planning and traffic path reasoning。",
      "CloudOps Engineer Associate (SOA-C03): Networking and Content Delivery - VPC route table、security group、subnet troubleshooting。"
    ],
    deliverables: [
      "public/private subnet diagram",
      "route table note",
      "security group matrix",
      "ALB -> ECS -> RDS/Redis traffic path",
      "network troubleshooting checklist"
    ],
    quickQuestions: [
      {
        id: "why-private",
        question: "RDS 為什麼不應該直接 public？",
        answer: "正式環境通常讓 RDS 只接受 app security group。public DB 會把資料層暴露到網路，風險和攻擊面都變大。"
      },
      {
        id: "alb-position",
        question: "ALB 和 ECS task 要放同一種 subnet 嗎？",
        answer: "通常 Internet-facing ALB 放 public subnet，ECS task 放 private subnet，讓外部只進 ALB，再由 ALB 轉給 app。"
      }
    ]
  },
  7: {
    scenario:
      "Day 6 已決定 ECS 未來會跑在 private subnet。今天要把 Day 3 的 production image 放進 ECR，並建立 commit SHA tag、release tag 與 rollback tag 表。",
    whyItMatters:
      "ECS 不應該依賴你本機的 image。ECR 是 image artifact 的交付中心；tag policy 決定你能不能追蹤、審查與 rollback。",
    todayGoal:
      "產出 ECR repository plan、commit SHA tag policy、rollback tag table。",
    previousContext:
      "Day 3 已做 production image，Day 6 已定義網路邊界；今天把 image 交給 AWS registry。",
    nextContext:
      "Day 8 會把 ECR image 放進 ECS task definition，建立第一個 Fargate web service。",
    command:
      "aws ecr create-repository --repository-name ticketfactory-api\naws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com\ndocker tag ticketfactory-api:<sha> <account>.dkr.ecr.<region>.amazonaws.com/ticketfactory-api:<sha>\ndocker push <account>.dkr.ecr.<region>.amazonaws.com/ticketfactory-api:<sha>\naws ecr describe-images --repository-name ticketfactory-api",
    pitfall:
      "不要只推 latest；latest 會移動，出事時很難知道 ECS 目前跑的 image 是否就是你以為的那一版。",
    documentSpec: [
      "ECR repository plan: repository name、region、lifecycle policy、scan on push 策略。",
      "Image tag policy: commit SHA 為不可變部署 tag，release tag 只作為人類可讀標記。",
      "Rollback tag table: current、previous、candidate 三欄，標出 ECS task definition revision。",
      "Security note: GitHub Actions 使用 OIDC/role，不把 long-lived AWS key 寫進 repo secret。"
    ],
    steps: [
      "Read: 先理解 ECR 在部署鏈中的位置：保存可被 ECS 拉取的 image artifact。",
      "Inspect: 檢查 Day 3 image tag 是否可追蹤到 commit SHA，並確認 repository 命名規則。",
      "Implement: 建立 ECR repository、login、tag、push，保存 image digest。",
      "Verify: 用 aws ecr describe-images 確認 tag、digest、pushedAt 都存在。",
      "Record: 建立 rollback tag table，標記 current/previous image 與對應 task definition。"
    ],
    acceptance: [
      "能說明 tag 與 digest 的差異。",
      "ECR repository plan 包含 region、命名、lifecycle、掃描策略。",
      "image 使用 commit SHA tag，不只依賴 latest。",
      "能用 describe-images 驗證 image 已存在。",
      "有 rollback tag table 可供 Day 8/14 使用。"
    ],
    examMapping: [
      "DVA-C02: Deployment - container image versioning、deployment artifact traceability。",
      "DVA-C02: Security - IAM/OIDC access to AWS services from CI。",
      "CloudOps Engineer Associate (SOA-C03): Deployment and provisioning - release artifact governance。"
    ],
    deliverables: [
      "ECR repository plan",
      "commit SHA tag policy",
      "image digest evidence",
      "rollback tag table",
      "CI credential risk note"
    ],
    quickQuestions: [
      {
        id: "tag-vs-digest",
        question: "tag 和 digest 差在哪？",
        answer: "tag 是可讀標籤，可能被移動；digest 指向 image content，比較適合做不可變追蹤與審查。"
      },
      {
        id: "why-ecr",
        question: "為什麼 ECS 需要 ECR？",
        answer: "ECS 需要從可存取的 registry 拉 image。ECR 提供 AWS 內建 IAM、區域、掃描與 lifecycle 管理。"
      }
    ]
  },
  8: {
    scenario:
      "EC2 compose 可以跑，但主機維運與單機風險開始變重。今天把 Laravel web runtime 轉成 ECS Fargate service，讓 compute 變成 task definition、service、log group、desired count。",
    whyItMatters:
      "ECS Fargate 是從 Docker Compose 走向 AWS managed container 的核心轉折。你要理解 image、CPU/memory、env/secrets、port mapping、log driver 與 service desired count 如何組成一個可維運 web runtime。",
    todayGoal:
      "產出 task definition sketch、service boundary diagram、CloudWatch log group mapping、rollback revision note。",
    previousContext:
      "Day 7 已把 image 放進 ECR；今天把 image 放到 ECS task definition 並建立 web service。",
    nextContext:
      "Day 9 會把 ECS service 接到 ALB health check，驗證從使用者入口進來是否健康。",
    command:
      "aws ecs describe-clusters\naws ecs register-task-definition --cli-input-json file://task-definition.json\naws ecs create-service --cluster ticketfactory --service-name web --task-definition ticketfactory-web --desired-count 2\naws ecs describe-services --cluster ticketfactory --services web\naws logs tail /ecs/ticketfactory-web --follow",
    pitfall:
      "不要把 web、worker、scheduler 全塞同一個 ECS service；它們的擴展、restart、health check、部署節奏都不同。",
    documentSpec: [
      "Task definition sketch: image、CPU/memory、port mapping、environment、secrets、logConfiguration。",
      "Service boundary diagram: web service、desired count、subnet、security group、target group attachment。",
      "Log group mapping: /ecs/ticketfactory-web 對應 container name 與 stream prefix。",
      "Rollback revision note: 記錄目前 task definition revision 與上一版 revision。"
    ],
    steps: [
      "Read: 先把 Docker Compose service 對應到 ECS task definition 與 ECS service。",
      "Inspect: 檢查 image URI、container port、env、secret、log group 是否齊全。",
      "Implement: register task definition，create service，desired count 先設 2 以練習 service health。",
      "Verify: describe-services 檢查 runningCount、desiredCount、deployment status，並 tail CloudWatch logs。",
      "Record: 保存 service boundary diagram、log mapping 與 rollback task revision。"
    ],
    acceptance: [
      "能分辨 task definition、task、service、cluster 的角色。",
      "task definition sketch 包含 image、port、env/secrets、logs。",
      "web service 與 worker/scheduler 邊界沒有混在一起。",
      "能用 describe-services 和 logs tail 驗證 ECS service。",
      "有 rollback task definition revision note。"
    ],
    examMapping: [
      "SAA-C03: Design High-Performing Architectures - managed container service and scaling boundary。",
      "SAA-C03: Design Resilient Architectures - desired count、multi-AZ placement、service recovery。",
      "CloudOps Engineer Associate (SOA-C03): Monitoring and deployment operations - ECS service status and logs。"
    ],
    deliverables: [
      "task definition sketch",
      "ECS service boundary diagram",
      "CloudWatch log group mapping",
      "service status evidence",
      "rollback task definition revision note"
    ],
    quickQuestions: [
      {
        id: "task-vs-service",
        question: "task definition 和 service 差在哪？",
        answer: "task definition 是 container 執行規格；service 負責讓指定數量的 task 持續運作、部署新版本與接 ALB。"
      },
      {
        id: "why-log-group",
        question: "為什麼 Day 8 就要規劃 logs？",
        answer: "ECS 啟動失敗時，CloudWatch logs 是第一個診斷入口。沒有 log mapping，服務壞了只會看到 stopped task。"
      }
    ]
  },
  9: {
    scenario:
      "ECS service 可以啟動，但使用者不是直接打 task IP，而是經過 ALB。今天要建立 /health readiness endpoint、target group health check table 與 502/unhealthy 診斷矩陣。",
    whyItMatters:
      "很多 AWS 初學者看到 ECS running 就以為部署成功，但 ALB target unhealthy 時使用者仍然打不進來。ALB 是外部可用性的第一道真相。",
    todayGoal:
      "產出 target group health check table、failure diagnosis matrix、ALB traffic path note。",
    previousContext:
      "Day 8 已建立 ECS Fargate web service；今天把 service 和 ALB target group 接起來驗證。",
    nextContext:
      "Day 10 會把 queue worker 和 scheduler 從 web runtime 拆出來，避免健康檢查與背景工作互相干擾。",
    command:
      "aws elbv2 describe-target-groups --names ticketfactory-web\naws elbv2 describe-target-health --target-group-arn <target-group-arn>\ncurl -I http://<alb-dns-name>/health\naws ecs describe-services --cluster ticketfactory --services web",
    pitfall:
      "ALB 502 不一定是 ALB 壞；常見原因是 container port、health path、security group、app listen address 或 Laravel 回 500。",
    documentSpec: [
      "Target group health check table: path、port、matcher、interval、healthy/unhealthy threshold。",
      "Failure diagnosis matrix: 502、503、unhealthy、timeout、redirect loop 對應診斷指令。",
      "Traffic path note: Browser -> ALB listener -> target group -> ECS task -> Laravel /health。",
      "Recovery note: health check path 修正、SG rule 修正、rollback target/task revision。"
    ],
    steps: [
      "Read: 先理解 ALB listener、target group、health check、ECS service attachment 的關係。",
      "Inspect: 檢查 Laravel /health 是否不依賴登入、不 redirect、不過度檢查外部服務。",
      "Implement: 設定 target group health check，確認 ALB SG 能到 app SG 的 container port。",
      "Verify: describe-target-health + curl ALB /health，交叉確認 target 狀態與 HTTP status。",
      "Record: 完成 failure diagnosis matrix 與 recovery note。"
    ],
    acceptance: [
      "能說明 ECS task running 不等於 ALB 可用。",
      "target group health check table 有 path、port、matcher、threshold。",
      "能從 502/503/unhealthy 判斷下一個檢查點。",
      "能用 describe-target-health 和 curl /health 驗證。",
      "有 health check rollback/recovery note。"
    ],
    examMapping: [
      "SAA-C03: Design Resilient Architectures - load balancing, health checks, failure isolation。",
      "SAA-C03: Design Secure Architectures - security group path from ALB to app。",
      "CloudOps Engineer Associate (SOA-C03): Monitoring and troubleshooting - target health diagnostics。"
    ],
    deliverables: [
      "target group health check table",
      "ALB traffic path note",
      "failure diagnosis matrix",
      "curl health evidence",
      "target recovery note"
    ],
    quickQuestions: [
      {
        id: "running-vs-healthy",
        question: "ECS running 和 ALB healthy 差在哪？",
        answer: "running 代表 task process 還活著；ALB healthy 代表 ALB 能從指定 path/port 得到符合 matcher 的回應。"
      },
      {
        id: "health-path",
        question: "/health 要避免什麼？",
        answer: "避免需要登入、redirect、太慢或過度依賴非必要外部服務。它應該穩定反映 app readiness。"
      }
    ]
  },
  10: {
    scenario:
      "Web service 已能接 ALB，但 Laravel queue worker、scheduler 不能永遠躲在 web container 裡。今天要把 web、worker、scheduler 拆成三種 ECS runtime。",
    whyItMatters:
      "Web request、queue job、scheduled command 的生命週期不同。混在一起會讓部署、擴展、健康檢查、重啟策略全部變得模糊。",
    todayGoal:
      "產出 web/worker/scheduler split diagram、restart strategy、queue failure recovery note。",
    previousContext:
      "Day 9 已讓 web service 通過 ALB health check；今天處理背景工作與排程。",
    nextContext:
      "Day 11 會處理 APP_KEY、DB_PASSWORD、Redis password 等 secrets/config 分類，讓三種 runtime 都能安全取用設定。",
    command:
      "aws ecs create-service --cluster ticketfactory --service-name worker --task-definition ticketfactory-worker --desired-count 1\naws ecs create-service --cluster ticketfactory --service-name scheduler --task-definition ticketfactory-scheduler --desired-count 1\naws ecs describe-services --cluster ticketfactory --services web worker scheduler\naws logs tail /ecs/ticketfactory-worker --follow",
    pitfall:
      "不要讓 scheduler 在多個 task 同時跑同一個 cron；重複排程可能造成重複寄信、重複扣款或重複派 job。",
    documentSpec: [
      "Runtime split diagram: web、worker、scheduler 各自的 command、desired count、health/restart 策略。",
      "Queue strategy note: queue connection、retry、timeout、dead letter 或 failed_jobs 處理方式。",
      "Scheduler strategy note: desired count、single runner、避免多重排程的機制。",
      "Recovery note: worker 卡住、job retry storm、scheduler 重複執行時的處置。"
    ],
    steps: [
      "Read: 先分辨 web request、queue worker、scheduler command 的生命週期。",
      "Inspect: 對照 Laravel queue connection、Horizon/supervisor 設定、schedule:run command。",
      "Implement: 草擬 worker task definition 與 scheduler task/service，分開 desired count 與 command。",
      "Verify: describe-services 檢查 web/worker/scheduler，並查看 worker logs 是否處理 job。",
      "Record: 完成 runtime split diagram、restart strategy 與 recovery note。"
    ],
    acceptance: [
      "能說明 web、worker、scheduler 為什麼要分開。",
      "runtime split diagram 有 command、desired count、restart/health 策略。",
      "能指出 scheduler 多副本的風險。",
      "能用 describe-services/logs 驗證 worker 狀態。",
      "有 queue failure 與 scheduler duplication recovery note。"
    ],
    examMapping: [
      "DVA-C02: Development with AWS Services - asynchronous workloads and application runtime separation。",
      "DVA-C02: Troubleshooting and Optimization - failed job, retry, log-driven diagnosis。",
      "CloudOps Engineer Associate (SOA-C03): Deployment operations - service restart and scaling strategy。"
    ],
    deliverables: [
      "web/worker/scheduler split diagram",
      "worker task command note",
      "scheduler single-runner strategy",
      "queue failure recovery note",
      "runtime scaling boundary"
    ],
    quickQuestions: [
      {
        id: "why-worker-service",
        question: "worker 為什麼不能塞在 web service？",
        answer: "worker 和 web 的擴展、重啟、log、health check 不同。拆開後才能獨立調整 desired count 與排錯。"
      },
      {
        id: "scheduler-risk",
        question: "scheduler 最大風險是什麼？",
        answer: "多個副本同時執行同一批排程，造成重複動作。要設計 single runner 或 distributed lock。"
      }
    ]
  },
  11: {
    scenario:
      "ECS web/worker/scheduler 都需要 APP_KEY、DB_HOST、DB_PASSWORD、REDIS_HOST、API_URL，但不是所有設定都一樣敏感。今天要把 secret 和 config 分類，接到 Secrets Manager 或 SSM Parameter Store。",
    whyItMatters:
      "把 APP_KEY、DB password、token 打包進 image 或 commit 到 repo，是部署系統最容易留下的長期風險。Secret 管理要和 IAM task role、execution role、task definition 一起看。",
    todayGoal:
      "產出 secret/config classification、task definition secrets mapping、IAM role access note。",
    previousContext:
      "Day 10 已把 runtime 拆成 web、worker、scheduler；今天讓不同 runtime 安全取得設定與秘密。",
    nextContext:
      "Day 12 會發布 React frontend，處理 public config、API URL、CORS 與 CloudFront cache。",
    command:
      "aws secretsmanager list-secrets\naws ssm describe-parameters\naws ecs describe-task-definition --task-definition ticketfactory-web\naws iam get-role --role-name ecsTaskExecutionRole",
    pitfall:
      "不要把所有 env 都當 secret，也不要把 secret 當普通 env；分類錯會造成權限過大、輪替困難或敏感資料進 logs。",
    documentSpec: [
      "Secret/config classification: secret、sensitive config、public runtime config 三類。",
      "Task definition secrets mapping: APP_KEY、DB_PASSWORD、REDIS_PASSWORD 對應 Secrets Manager/SSM ARN。",
      "IAM access note: execution role 與 task role 的責任差異與最小權限。",
      "Rotation/recovery note: secret 輪替後如何 redeploy task 並驗證連線。"
    ],
    steps: [
      "Read: 先分辨 secret、sensitive config、public config。",
      "Inspect: 檢查 Laravel .env、React build env、ECS task definition environment/secrets 欄位。",
      "Implement: 草擬 Secrets Manager/SSM parameter 命名與 task definition secrets mapping。",
      "Verify: 用 describe-task-definition 檢查 secret reference，不在 logs 或 image 裡暴露值。",
      "Record: 寫出 IAM role access note 與 rotation recovery note。"
    ],
    acceptance: [
      "能分辨 APP_KEY、DB_PASSWORD、API_URL 分別屬於哪一類設定。",
      "task definition secrets mapping 不包含明文 secret。",
      "能說明 execution role 與 task role 的差異。",
      "能驗證 image/repo/logs 沒有 secret 值。",
      "有 secret rotation 後 redeploy/recovery note。"
    ],
    examMapping: [
      "DVA-C02: Security - use Secrets Manager/SSM and IAM roles in application deployments。",
      "DVA-C02: Deployment - task definition configuration and environment handling。",
      "Security intro: least privilege, secret rotation, avoiding hardcoded credentials。"
    ],
    deliverables: [
      "secret/config classification",
      "task definition secrets mapping",
      "IAM role access note",
      "secret exposure checklist",
      "rotation recovery note"
    ],
    quickQuestions: [
      {
        id: "secret-or-config",
        question: "API URL 是 secret 嗎？",
        answer: "通常不是。API URL 多半是 public config；DB_PASSWORD、APP_KEY、third-party token 才是 secret。"
      },
      {
        id: "role-diff",
        question: "execution role 和 task role 差在哪？",
        answer: "execution role 幫 ECS 拉 image、寫 logs、取 secret；task role 是 app runtime 呼叫 AWS API 時使用的權限。"
      }
    ]
  },
  12: {
    scenario:
      "Backend 已在 ECS 路徑上成形，今天把 React frontend 從 dev server 變成 S3 + CloudFront 靜態發布，並處理 API URL、CORS、cache invalidation。",
    whyItMatters:
      "React dev server 不該是 production frontend。CloudFront 會帶來快取、HTTPS、全球邊緣節點，但也會放大錯誤的 API URL、CORS 與 cache 設定。",
    todayGoal:
      "產出 S3/CloudFront/API URL/cache invalidation checklist。",
    previousContext:
      "Day 11 已分類 secret/config；今天特別處理哪些 config 可以公開進 React build。",
    nextContext:
      "Day 13 會把 frontend/backend build 和 deploy 串進 GitHub Actions pipeline。",
    command:
      "npm run build\naws s3 sync dist/ s3://<frontend-bucket> --delete\naws cloudfront create-invalidation --distribution-id <distribution-id> --paths \"/*\"\ncurl -I https://<cloudfront-domain>/",
    pitfall:
      "不要把 secret 放進 React build env；前端 bundle 會被使用者下載，所有 build-time env 都應視為公開。",
    documentSpec: [
      "Frontend delivery checklist: S3 bucket、CloudFront distribution、OAC/OAI、default root object。",
      "API URL and CORS note: React public API URL、ALB/API domain、allowed origins。",
      "Cache invalidation checklist: dist sync、asset hash、index.html cache policy、invalidation path。",
      "Rollback note: 回復前一版 dist artifact 或 CloudFront origin/cache policy。"
    ],
    steps: [
      "Read: 先理解 React static build、S3 object、CloudFront cache 的關係。",
      "Inspect: 檢查 React env，確認只有 public config 進 bundle，API URL 指向正式 API domain。",
      "Implement: build dist、sync S3、建立 CloudFront invalidation。",
      "Verify: curl CloudFront domain，檢查 HTTP status、cache header、頁面是否呼叫正確 API。",
      "Record: 完成 API URL/CORS/cache invalidation checklist 與 rollback note。"
    ],
    acceptance: [
      "能說明 React build env 為什麼不是 secret。",
      "frontend checklist 包含 S3、CloudFront、OAC/OAI、default root object。",
      "API URL 與 CORS allowed origins 有明確記錄。",
      "能用 curl / browser 驗證 CloudFront 發佈結果。",
      "有 cache invalidation 與 rollback note。"
    ],
    examMapping: [
      "SAA-C03: Design High-Performing Architectures - CloudFront caching and content delivery。",
      "SAA-C03: Design Secure Architectures - private S3 origin with CloudFront access control。",
      "DVA-C02: Deployment - frontend artifact build and release validation。"
    ],
    deliverables: [
      "S3/CloudFront delivery checklist",
      "public frontend config table",
      "API URL and CORS note",
      "cache invalidation evidence",
      "frontend rollback note"
    ],
    quickQuestions: [
      {
        id: "frontend-secret",
        question: "React env 可以放 secret 嗎？",
        answer: "不可以。React build 後的 bundle 會被使用者下載，build-time env 應視為公開資訊。"
      },
      {
        id: "cache-risk",
        question: "CloudFront cache 最大雷點是什麼？",
        answer: "index.html 被長時間 cache，導致使用者拿到舊 bundle reference。通常要搭配 asset hash 與 index.html cache policy。"
      }
    ]
  },
  13: {
    scenario:
      "手動部署可以學概念，但不能長期維運。今天要把 build、test、push ECR、render task definition、deploy ECS 與 migration gate 串成 GitHub Actions pipeline。",
    whyItMatters:
      "CI/CD 是把前面所有 artifact 串起來的地方：image tag、ECR、task definition、ECS service、migration、rollback 都要在 pipeline 中留下證據。",
    todayGoal:
      "產出 deployment workflow diagram、environment promotion checklist、migration gate rule、rollback command note。",
    previousContext:
      "Day 12 已完成 frontend delivery path；今天把 frontend/backend 發布流程制度化。",
    nextContext:
      "Day 14 會強化 zero downtime deployment，處理 rolling update、health gate、migration order 與 rollback。",
    command:
      "- uses: aws-actions/configure-aws-credentials@v4\n- uses: aws-actions/amazon-ecr-login@v2\n- uses: aws-actions/amazon-ecs-render-task-definition@v1\n- uses: aws-actions/amazon-ecs-deploy-task-definition@v2",
    pitfall:
      "不要讓 pipeline 一邊 deploy 一邊直接跑不可逆 migration；migration gate 要能阻擋危險變更並保留 rollback path。",
    documentSpec: [
      "Deployment workflow diagram: test -> build image -> push ECR -> render task definition -> deploy ECS -> verify。",
      "Environment promotion checklist: dev/staging/prod trigger、approval、artifact promotion 規則。",
      "Migration gate rule: backward-compatible migration、manual approval、backup checkpoint。",
      "Rollback command note: deploy previous task definition revision、restore previous image tag、frontend artifact rollback。"
    ],
    steps: [
      "Read: 先理解 GitHub Actions 在 AWS deploy path 中扮演 orchestrator，不是隨便塞 shell script。",
      "Inspect: 檢查 repository secrets/OIDC、ECR repo、task definition template、service name、cluster name。",
      "Implement: 草擬 workflow，串接 configure-aws-credentials、ECR login、render/deploy task definition。",
      "Verify: 用 dry-run checklist 或 workflow log 驗證每一段 artifact 都有輸出。",
      "Record: 寫出 migration gate、approval、rollback command note。"
    ],
    acceptance: [
      "能說明 pipeline 中每一步的輸入/輸出 artifact。",
      "使用 AWS-maintained GitHub Actions 而不是整段不可讀 shell。",
      "image tag 來自 commit SHA 並被 render 到 task definition。",
      "migration gate 有阻擋規則與人工確認點。",
      "有回上一版 task definition/image/frontend artifact 的 rollback note。"
    ],
    examMapping: [
      "DVA-C02: Deployment - CI/CD pipeline, deployment artifacts, application release automation。",
      "DVA-C02: Security - OIDC/IAM role access instead of static long-lived credentials。",
      "DevOps intro: approval gates, migration safety, release traceability。"
    ],
    deliverables: [
      "deployment workflow diagram",
      "GitHub Actions workflow sketch",
      "environment promotion checklist",
      "migration gate rule",
      "rollback command note"
    ],
    quickQuestions: [
      {
        id: "why-actions",
        question: "為什麼不用手動部署就好？",
        answer: "手動部署難以追蹤、重複與審查。CI/CD 讓 build、push、deploy、verify、rollback 都留下紀錄。"
      },
      {
        id: "migration-gate",
        question: "migration gate 要防什麼？",
        answer: "防止不可逆 schema change 直接進 production。要先確認 backup、相容性、approval 與 rollback path。"
      }
    ]
  },
  14: {
    scenario:
      "Pipeline 可以部署，但部署過程不能讓使用者一直撞到 502。今天要設計 ECS rolling update、ALB health gate、migration order、worker restart strategy 與 rollback path。",
    whyItMatters:
      "Zero downtime 不是一句口號，而是 capacity、health check、deployment config、migration 相容性、rollback 的組合。缺一塊就可能變成半夜救火。",
    todayGoal:
      "產出 rolling update decision table、migration order checklist、rollback path。",
    previousContext:
      "Day 13 已有 pipeline；今天讓 pipeline 的部署行為更接近 production 運維需求。",
    nextContext:
      "Day 15 會把 logs、metrics、alarms、dashboard 建起來，讓部署後有可觀測性與驗收標準。",
    command:
      "aws ecs update-service --cluster ticketfactory --service web --force-new-deployment\naws ecs wait services-stable --cluster ticketfactory --services web\naws elbv2 describe-target-health --target-group-arn <target-group-arn>\naws logs tail /ecs/ticketfactory-web --since 10m",
    pitfall:
      "不要把 breaking migration 和新程式同時推上線；要優先使用 expand-contract 或 backward-compatible migration。",
    documentSpec: [
      "Rolling update decision table: desired count、minimum healthy percent、maximum percent、health grace period。",
      "Migration order checklist: expand schema、deploy compatible app、backfill、contract cleanup。",
      "Worker restart strategy: draining、queue visibility timeout、failed job recovery。",
      "Rollback path: previous task definition revision、previous image tag、migration rollback/forward fix。"
    ],
    steps: [
      "Read: 先理解 zero downtime 依賴 ALB health gate 與 ECS deployment config。",
      "Inspect: 檢查 desired count、min/max percent、health check grace period、migration 類型。",
      "Implement: 草擬 rolling update decision table 與 migration order checklist。",
      "Verify: update-service 後等待 services-stable，檢查 target health 與 logs。",
      "Record: 完成 rollback path，說明哪些情況只能 forward fix。"
    ],
    acceptance: [
      "能說明 desired count、minimum healthy percent、maximum percent 的影響。",
      "migration order 使用 backward-compatible 思維。",
      "能用 services-stable、target health、logs 驗證部署。",
      "worker restart strategy 不會造成大量重複 job。",
      "rollback path 明確列出 task/image/migration 的限制。"
    ],
    examMapping: [
      "CloudOps Engineer Associate (SOA-C03): Deployment operations - service stability, health gates, rollback。",
      "DVA-C02: Deployment - safe application deployment and release strategies。",
      "DevOps intro: expand-contract migration, approval, rollback limitations。"
    ],
    deliverables: [
      "rolling update decision table",
      "migration order checklist",
      "ALB health gate note",
      "worker restart strategy",
      "rollback path"
    ],
    quickQuestions: [
      {
        id: "zero-downtime",
        question: "zero downtime 最容易誤解什麼？",
        answer: "以為只要 ECS rolling update 就好。實際上還要搭配 health check、capacity、migration 相容性與 rollback。"
      },
      {
        id: "migration-risk",
        question: "為什麼 breaking migration 危險？",
        answer: "新舊程式可能短時間並存。若 schema 變更不相容，舊 task 還沒退場就會開始報錯。"
      }
    ]
  },
  15: {
    scenario:
      "部署能跑，但沒有 logs、metrics、alarms、dashboard，就無法判斷 production 是否健康。今天建立 observability baseline，讓每次部署後都能被驗收。",
    whyItMatters:
      "Production readiness 不是『我打開網頁看起來可以』。你需要用 CloudWatch logs、ECS metrics、ALB 5xx、target health、queue depth、alarm 去判斷系統狀態。",
    todayGoal:
      "產出 log group、metric、alarm、dashboard checklist 與 post-deploy acceptance dashboard。",
    previousContext:
      "Day 14 已設計安全部署流程；今天補上部署後的可觀測性與告警。",
    nextContext:
      "Day 16 會進入安全強化，開始審查 Security Group、IAM、headers、APP_DEBUG 等 production risk。",
    command:
      "aws logs tail /ecs/ticketfactory-web --follow\naws cloudwatch list-metrics --namespace AWS/ECS\naws cloudwatch put-metric-alarm --alarm-name ticketfactory-5xx-rate --metric-name HTTPCode_Target_5XX_Count --namespace AWS/ApplicationELB\naws cloudwatch get-dashboard --dashboard-name ticketfactory-production",
    pitfall:
      "不要等出事才找 log；如果 log group、retention、metric、alarm 沒先定義，事故當下只會變成猜謎。",
    documentSpec: [
      "Log group checklist: web、worker、scheduler log group、retention、stream prefix。",
      "Metric checklist: ECS CPU/memory、ALB 5xx/latency、target health、queue depth、RDS connections。",
      "Alarm checklist: 5xx rate、unhealthy target、task stopped、queue backlog、RDS storage/connection。",
      "Dashboard checklist: release version、service health、traffic、error、latency、queue、database。"
    ],
    steps: [
      "Read: 先理解 logs、metrics、alarms、dashboard 分別回答什麼問題。",
      "Inspect: 檢查 ECS/ALB/RDS/queue 哪些訊號最能代表 TicketFactory 健康。",
      "Implement: 草擬 CloudWatch dashboard 與 alarm checklist，定義部署後驗收門檻。",
      "Verify: 用 logs tail、list-metrics、get-dashboard 或 pseudo-command 檢查訊號可取得。",
      "Record: 建立 post-deploy acceptance dashboard，讓 Day 16 以後的風險審查有依據。"
    ],
    acceptance: [
      "能說明 logs、metrics、alarms、dashboard 的不同用途。",
      "log group checklist 包含 web、worker、scheduler 與 retention。",
      "metrics 不只看 CPU，也包含 ALB、queue、RDS、target health。",
      "alarm checklist 有實際事件與處置方向。",
      "有 post-deploy acceptance dashboard 可供後續課程使用。"
    ],
    examMapping: [
      "CloudOps Engineer Associate (SOA-C03): Monitoring and incident response - CloudWatch logs, metrics, alarms, dashboards。",
      "SAA-C03: Design Resilient Architectures - observability for availability and failure response。",
      "DVA-C02: Troubleshooting and Optimization - log/metric based application diagnosis。"
    ],
    deliverables: [
      "CloudWatch log group checklist",
      "metric and alarm checklist",
      "post-deploy dashboard sketch",
      "deployment acceptance thresholds",
      "incident triage note"
    ],
    quickQuestions: [
      {
        id: "log-vs-metric",
        question: "log 和 metric 差在哪？",
        answer: "log 幫你看事件細節；metric 幫你看趨勢與門檻。告警通常依賴 metric，調查細節才回到 log。"
      },
      {
        id: "dashboard-scope",
        question: "dashboard 要放什麼？",
        answer: "放能回答 production 是否健康的訊號：traffic、error、latency、target health、ECS resource、queue、database。"
      }
    ]
  }
};

const buildAssociateGuidedSteps = (spec: AssociateLabSpec): MentorStep[] => {
  const questions = [
    "今天這個 artifact 之後會被哪一天使用？",
    "如果這一步失敗，你下一個檢查點是哪一層？",
    "這份表格或圖能不能讓另一位工程師接手？",
    "你如何證明這不是只停留在概念？",
    "如果要 rollback，哪個 artifact 會幫你回到上一版？"
  ];

  return spec.steps.map((step, index) => {
    const [rawTitle, ...instructionParts] = step.split(": ");
    return {
      id: rawTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: rawTitle,
      instruction: instructionParts.join(": ") || step,
      expectedResult: spec.documentSpec[index] ?? spec.deliverables[index] ?? spec.todayGoal,
      commonMistake: index === 0 ? spec.pitfall : `只完成操作，沒有留下 ${spec.deliverables[Math.min(index, spec.deliverables.length - 1)]}。`,
      mentorQuestion: questions[index] ?? questions[0]
    };
  });
};

const deepDiveLabSpecs: Record<number, AssociateLabSpec> = {
  16: {
    scenario:
      "Production 版本已經能部署，但主管問：這套系統現在有哪些安全風險？今天要用 Security Specialty intro 的角度審查 IAM、Security Group、CORS、APP_DEBUG、Redis password 與 security headers。",
    whyItMatters:
      "安全強化不是等到上線後才補。APP_DEBUG、過寬 Security Group、長期 AWS key、過度 CORS、secret 出現在 image/logs，都是 production review 會直接被打回的風險。",
    todayGoal: "產出 IAM/SG/CORS/APP_DEBUG audit checklist 與 security risk register。",
    previousContext: "Day 15 已建立 observability baseline；今天用它作為安全審查時的 evidence 入口。",
    nextContext: "Day 17 會進入 multi-tenant architecture，安全邊界會延伸到租戶與資料隔離。",
    command:
      "aws ec2 describe-security-groups --group-ids <alb-sg> <app-sg> <db-sg>\naws ecs describe-task-definition --task-definition ticketfactory-web\naws iam list-attached-role-policies --role-name <ecs-task-role>\ncurl -I https://<domain>",
    pitfall: "只把安全理解成加密或 WAF，卻沒有檢查 APP_DEBUG、CORS、IAM role、security group、secret exposure 這些實際會被掃到的點。",
    documentSpec: [
      "Production risk: APP_DEBUG=true、CORS=*、DB/Redis SG public、task role 權限過大、secret 出現在 image/log。",
      "Detection: describe-security-groups、describe-task-definition、curl headers、repo/env/image secret scan。",
      "Remediation: 收斂 SG、關閉 debug、限制 CORS origin、拆 execution role/task role、改用 Secrets Manager/SSM。",
      "Preventive control: release 前 security checklist、least privilege review、secret rotation、headers/CORS regression check。"
    ],
    steps: [
      "Risk: 列出 TicketFactory production security risk register，至少含 IAM、SG、CORS、APP_DEBUG、Secrets。",
      "Detect: 用 AWS CLI 與 curl headers 收集目前可觀測證據。",
      "Remediate: 對每個風險寫出修復方式與 rollback/impact。",
      "Prevent: 建立 release 前 security gate，不讓 debug、public DB、wildcard CORS 進 production。",
      "Defend: 用 3 分鐘回答：這套系統目前最可能被攻擊的入口是什麼？"
    ],
    acceptance: [
      "有 IAM/SG/CORS/APP_DEBUG audit checklist。",
      "能說明 execution role、task role、human deploy role 的權限邊界。",
      "能用證據指出 DB/Redis 沒有 public exposure。",
      "有至少 5 個 security risk、偵測方式、修復方式、預防控制。",
      "能回答主管：目前還有哪些 security gap 不阻擋上線、哪些必須先修。"
    ],
    examMapping: [
      "Security Specialty intro: IAM least privilege、secret management、network exposure review。",
      "SAA-C03: Design Secure Architectures - secure access and application workloads。",
      "DevOps Pro prep: automated security gates before release."
    ],
    deliverables: [
      "IAM/SG/CORS/APP_DEBUG audit checklist",
      "security risk register",
      "secret exposure checklist",
      "security remediation plan",
      "defense question answer"
    ],
    quickQuestions: [
      { id: "debug-risk", question: "APP_DEBUG=true 最大問題是什麼？", answer: "錯誤頁可能暴露 env、stack trace、路徑、SQL 或 secret 線索，production 必須關閉。" },
      { id: "sg-defense", question: "如何證明 DB 沒有公開？", answer: "用 SG matrix 和 describe-security-groups 證明 DB 只接受 app security group，而不是 0.0.0.0/0。" }
    ]
  },
  17: {
    scenario:
      "課程平台開始支援多 tenant。今天要把 tenant isolation 從 UI selector 變成資料、API、admin、progress 都一致遵守的 boundary。",
    whyItMatters:
      "Multi-tenant 最大風險不是畫面選錯 tenant，而是 API query、admin dashboard、progress、export 忘了 tenant scope，造成跨租戶資料外洩。",
    todayGoal: "產出 tenant isolation model、data boundary table、cross-tenant leakage test plan。",
    previousContext: "Day 16 已審查安全邊界；今天把安全邊界延伸到租戶與資料隔離。",
    nextContext: "Day 18 會處理 RDS migration，tenant-aware schema change 會影響資料隔離。",
    command:
      "rg \"tenant_id|tenant\" app resources src\npsql \"$DATABASE_URL\" -c \"select tenant_id, count(*) from learning_progress group by tenant_id;\"\nphp artisan test --filter=TenantIsolation\ncurl -H \"X-Tenant: cerry-lab\" https://<api-domain>/api/progress",
    pitfall: "只在前端顯示 tenant selector，後端 query 沒有強制 tenant scope，資料外洩時 UI 看起來仍然正常。",
    documentSpec: [
      "Production risk: user 可透過 API、admin、export 或 progress endpoint 讀到其他 tenant 資料。",
      "Detection: tenant_id query audit、API test、admin dashboard scope check、資料匯出檢查。",
      "Remediation: middleware 注入 tenant context、repository/query scope、DB unique/index 加 tenant key。",
      "Preventive control: tenant isolation tests、seeded cross-tenant fixtures、PR checklist。"
    ],
    steps: [
      "Risk: 寫出 tenant context 從 auth 到 DB query 的傳遞路徑。",
      "Detect: 搜尋 tenant_id 使用點，找出 query/export/admin 是否漏 scope。",
      "Remediate: 草擬 middleware、policy、repository scope、DB index 的修復策略。",
      "Prevent: 建立 cross-tenant leakage test plan。",
      "Defend: 回答：你的 tenant isolation 是 UI 層、API 層還是資料層保證？"
    ],
    acceptance: [
      "有 tenant isolation model。",
      "data boundary table 覆蓋 user、role、progress、course、admin/export。",
      "能說明 tenant_id 應在哪些 query/index/unique key 出現。",
      "有 cross-tenant leakage test plan。",
      "能回答如果 tenant context 缺失，系統應該 fail closed 還是 fail open。"
    ],
    examMapping: [
      "SaaS architecture: tenant context propagation and isolation controls。",
      "Security Specialty intro: authorization boundary and data access controls。",
      "SA Pro prep: multi-tenant tradeoff between shared schema and isolated resources."
    ],
    deliverables: [
      "tenant isolation model",
      "data boundary table",
      "cross-tenant leakage test plan",
      "tenant-aware index checklist",
      "defense answer"
    ],
    quickQuestions: [
      { id: "tenant-ui-risk", question: "只靠前端 tenant selector 夠嗎？", answer: "不夠。後端 API、query、policy、DB constraint 都要能阻擋跨租戶資料存取。" },
      { id: "fail-mode", question: "tenant context 缺失時應該怎麼做？", answer: "除非是明確 public resource，否則應 fail closed，拒絕請求或回空集合。" }
    ]
  },
  18: {
    scenario:
      "Production database 要做 schema change。今天不是直接 `php artisan migrate --force`，而是設計 backup、expand-contract、verification、rollback/forward-fix runbook。",
    whyItMatters:
      "資料庫 migration 是最難 rollback 的部署風險之一。沒有 snapshot、相容策略、驗證 query 和回復路徑，部署失敗會變成資料事故。",
    todayGoal: "產出 migration runbook、backup/rollback plan、expand-contract checklist。",
    previousContext: "Day 17 建立 tenant boundary；今天確保 migration 不破壞 tenant data 與 production traffic。",
    nextContext: "Day 19 會處理 S3 uploads，繼續把 stateful data flow 變成可控流程。",
    command:
      "aws rds describe-db-snapshots --db-instance-identifier ticketfactory-prod\naws rds create-db-snapshot --db-instance-identifier ticketfactory-prod --db-snapshot-identifier pre-migration-<date>\nphp artisan migrate --pretend\nphp artisan migrate --force",
    pitfall: "把所有 migration 都當成可 rollback；drop column、data transform、rename 欄位常需要 forward fix 或 expand-contract。",
    documentSpec: [
      "Production risk: 不相容 schema change 讓新舊 ECS task 或 worker 同時失敗。",
      "Detection: migrate --pretend、schema diff、snapshot existence、smoke query、worker log。",
      "Remediation: expand-contract、feature flag、backfill job、restore snapshot 或 forward fix。",
      "Preventive control: migration gate、DB backup checkpoint、tenant fixture verification。"
    ],
    steps: [
      "Risk: 分類 migration 是 additive、destructive、data transform 還是 long-running。",
      "Detect: 檢查 snapshot、pretend SQL、受影響 query、worker job。",
      "Remediate: 寫出 expand-contract 或 restore/forward-fix 路徑。",
      "Prevent: 建立 migration gate 和 production approval checklist。",
      "Defend: 回答：這次 migration 能 rollback 嗎？不能的部分如何處理？"
    ],
    acceptance: [
      "有 migration runbook。",
      "有 RDS snapshot/backup checkpoint。",
      "能分辨 reversible rollback 與 forward fix。",
      "有 migration validation query 與 app/worker smoke test。",
      "有 tenant-aware migration risk note。"
    ],
    examMapping: [
      "DevOps Pro prep: deployment safety, migration gates, rollback strategy。",
      "Reliability pillar: backup and restore planning for stateful services。",
      "DVA-C02: deployment and troubleshooting of application changes."
    ],
    deliverables: [
      "migration runbook",
      "backup/rollback plan",
      "expand-contract checklist",
      "validation query list",
      "forward-fix decision note"
    ],
    quickQuestions: [
      { id: "rollback-limit", question: "為什麼 migration rollback 特別危險？", answer: "因為資料可能已被寫入新 schema，drop/rename/data transform 往往不能安全倒回。" },
      { id: "expand-contract", question: "expand-contract 是什麼？", answer: "先新增相容結構並部署相容 app，完成 backfill 後，下一版再移除舊結構。" }
    ]
  },
  19: {
    scenario:
      "Uploads 不能留在 container local disk，也不能為了方便把 bucket public。今天設計 private S3 upload flow、signed URL policy、tenant-aware object key。",
    whyItMatters:
      "檔案上傳同時牽涉安全、成本、效能與資料隔離。public bucket、無限制 presigned URL、錯誤 CORS、object key 沒 tenant scope 都會變成 production 事故。",
    todayGoal: "產出 private upload flow、signed URL policy、bucket access checklist。",
    previousContext: "Day 18 處理 DB state；今天處理 object storage state。",
    nextContext: "Day 20 會處理 WebSocket/Reverb，讓即時事件和 storage/data flow 分開維運。",
    command:
      "aws s3api get-public-access-block --bucket <uploads-bucket>\naws s3api get-bucket-policy-status --bucket <uploads-bucket>\naws s3 presign s3://<uploads-bucket>/<tenant-id>/sample.png --expires-in 300\ncurl -I \"<presigned-url>\"",
    pitfall: "把 bucket 設 public 來修前端顯示問題，等於繞過 Laravel authorization 與 tenant isolation。",
    documentSpec: [
      "Production risk: public bucket、過長 TTL、object key 無 tenant scope、CORS 過寬。",
      "Detection: public access block、policy status、signed URL TTL、CORS rule、object key audit。",
      "Remediation: private bucket、短效 presigned URL、content-type/size limit、tenant-scoped key。",
      "Preventive control: upload policy test、bucket policy review、lifecycle/retention policy。"
    ],
    steps: [
      "Risk: 畫出 Browser -> Laravel signer -> S3 private object 的責任分界。",
      "Detect: 檢查 bucket public access、policy status、CORS、URL TTL。",
      "Remediate: 寫出 signed URL policy 與 tenant object key convention。",
      "Prevent: 建立 upload regression checklist。",
      "Defend: 回答：使用者如何下載私有檔案但 bucket 仍不公開？"
    ],
    acceptance: [
      "有 private upload flow。",
      "signed URL policy 包含 TTL、content type、size、tenant object key。",
      "能證明 bucket public access block 開啟。",
      "CORS 只允許必要 origin/method/header。",
      "有檔案誤刪或 URL 過期 recovery note。"
    ],
    examMapping: [
      "Security / SAA: private S3 access, presigned URLs, least privilege object access。",
      "SAA-C03: secure data access and resilient storage design。",
      "SaaS architecture: tenant-aware object key and authorization."
    ],
    deliverables: [
      "private upload flow",
      "signed URL policy",
      "bucket access checklist",
      "tenant object key convention",
      "upload recovery note"
    ],
    quickQuestions: [
      { id: "public-bucket", question: "為什麼不能直接 public bucket？", answer: "public bucket 會繞過 app authorization，可能暴露私有檔案與跨租戶資料。" },
      { id: "url-ttl", question: "signed URL 的 TTL 為什麼要短？", answer: "URL 持有人可在有效期內執行授權動作，TTL 太長會擴大洩漏後的影響。" }
    ]
  },
  20: {
    scenario:
      "TicketFactory 需要即時通知與 WebSocket/Reverb。今天要設計 ALB WebSocket routing、timeout、Redis pub/sub、service separation。",
    whyItMatters:
      "WebSocket 是長連線，不應被當成普通 HTTP request。ALB idle timeout、sticky/session、Reverb runtime、Redis pub/sub 都會影響穩定性。",
    todayGoal: "產出 ALB WebSocket routing、Redis pub/sub diagram、long-connection runbook。",
    previousContext: "Day 19 完成 private upload flow；今天處理即時事件通道。",
    nextContext: "Day 21 會進入高併發訂票一致性，WebSocket 只負責通知，不應取代交易一致性。",
    command:
      "aws elbv2 describe-listeners --load-balancer-arn <alb-arn>\naws elbv2 describe-target-groups --names ticketfactory-reverb\naws logs tail /ecs/ticketfactory-reverb --follow\nredis-cli -h <redis-endpoint> pubsub channels",
    pitfall: "把 WebSocket 通知當作交易成功依據；真正一致性仍要靠 DB transaction、lock、queue，而不是前端收到事件。",
    documentSpec: [
      "Production risk: ALB timeout、target unhealthy、Redis pub/sub 中斷、web/API 與 Reverb 混在同 service。",
      "Detection: listener rule、target health、Reverb logs、Redis pubsub channels、client reconnect rate。",
      "Remediation: separate Reverb service、ALB timeout tuning、Redis connectivity check、client reconnect/backoff。",
      "Preventive control: WebSocket smoke test、connection metric、broadcast failure alarm。"
    ],
    steps: [
      "Risk: 畫出 HTTP API 與 WebSocket long connection 的差異。",
      "Detect: 檢查 ALB listener/target group、Reverb logs、Redis pub/sub。",
      "Remediate: 規劃 Reverb service boundary 與 timeout/reconnect 策略。",
      "Prevent: 建立 WebSocket smoke test 與 alarm。",
      "Defend: 回答：WebSocket 掛掉時，訂票交易是否仍正確？"
    ],
    acceptance: [
      "有 ALB WebSocket routing diagram。",
      "有 Redis pub/sub diagram。",
      "能分辨即時通知與交易一致性。",
      "有 connection timeout/reconnect strategy。",
      "有 Reverb service logs/target health 驗證方式。"
    ],
    examMapping: [
      "Advanced app deployment: long-running connection routing and service separation。",
      "SAA-C03: resilient traffic routing and application integration。",
      "Performance/reliability prep: graceful degradation for real-time features."
    ],
    deliverables: [
      "ALB WebSocket routing diagram",
      "Redis pub/sub diagram",
      "Reverb service boundary",
      "timeout/reconnect strategy",
      "WebSocket degradation note"
    ],
    quickQuestions: [
      { id: "ws-not-tx", question: "WebSocket 可以當作交易成功依據嗎？", answer: "不行。WebSocket 是通知通道，交易一致性仍要由 DB transaction/lock/queue 保證。" },
      { id: "timeout", question: "WebSocket 上 ALB 最常見雷點？", answer: "idle timeout、target health、client reconnect/backoff 沒設計，導致長連線不穩。" }
    ]
  },
  21: {
    scenario:
      "TicketFactory 搶票情境遇到大量併發。今天要設計 lock、DB transaction、queue consistency，避免 oversell 與重複確認。",
    whyItMatters:
      "高併發不是只把 ECS desired count 拉高。若資料一致性設計錯，scale out 只會讓超賣更快發生。",
    todayGoal: "產出 lock/transaction/queue consistency decision table 與 oversell failure analysis。",
    previousContext: "Day 20 已把 WebSocket 當成通知通道；今天處理真正的交易一致性。",
    nextContext: "Day 22 會把 web/worker scaling policy 建立在可量測負載上。",
    command:
      "redis-cli -h <redis-endpoint> --scan --pattern 'lock:*'\npsql \"$DATABASE_URL\" -c \"select ticket_id, count(*) from orders group by ticket_id having count(*) > capacity;\"\naws logs tail /ecs/ticketfactory-worker --since 15m",
    pitfall: "用 queue 取代 transaction，以為排進 queue 就代表庫存安全；真正的庫存扣減仍要在一致性邊界內完成。",
    documentSpec: [
      "Production risk: oversell、duplicate job、lock timeout、transaction deadlock、queue retry storm。",
      "Detection: oversell query、failed_jobs、lock key scan、worker logs、p95 latency。",
      "Remediation: Redis lock + DB transaction、idempotency key、unique constraint、retry/backoff。",
      "Preventive control: load test, concurrency test, invariant query, queue retry policy。"
    ],
    steps: [
      "Risk: 定義訂票 invariants：不能超賣、不能重複確認、不能遺失訂單。",
      "Detect: 寫出 oversell/duplicate 檢查 query 與 worker log 檢查方式。",
      "Remediate: 設計 lock、transaction、idempotency、unique constraint 的使用邊界。",
      "Prevent: 建立 concurrency test 與 queue retry policy。",
      "Defend: 回答：scale out 到 10 個 worker 後，為什麼不會超賣？"
    ],
    acceptance: [
      "有 consistency decision table。",
      "能說明 lock、transaction、queue、idempotency 各自保護什麼。",
      "有 oversell detection query。",
      "有 queue retry/backoff 與 failed job recovery 策略。",
      "能回答 scale out 不破壞一致性的原因。"
    ],
    examMapping: [
      "Performance / reliability: concurrency control and invariant protection。",
      "DVA-C02: troubleshooting async workflows and retries。",
      "SA Pro prep: tradeoff between throughput, consistency, and user experience."
    ],
    deliverables: [
      "lock/transaction/queue consistency decision table",
      "oversell detection query",
      "idempotency strategy",
      "queue retry policy",
      "load test note"
    ],
    quickQuestions: [
      { id: "queue-limit", question: "queue 能不能保證不超賣？", answer: "queue 只能排隊處理，不能自動保證資料一致性；庫存扣減仍需要 transaction/lock/constraint。" },
      { id: "idempotency", question: "idempotency key 解決什麼？", answer: "避免重試、重送或 worker retry 造成重複建立同一筆交易結果。" }
    ]
  },
  22: {
    scenario:
      "系統開始有流量變化。今天要把 autoscaling 從『CPU 高就加機器』改成 web request、CPU/memory、queue depth、worker latency 的 capacity model。",
    whyItMatters:
      "web 和 worker 的瓶頸不同。只看 CPU 可能看不到 queue backlog，只看 request count 也可能忽略 DB connection 或 memory pressure。",
    todayGoal: "產出 ECS scaling policy、queue depth scaling model、capacity test checklist。",
    previousContext: "Day 21 已定義併發一致性邊界；今天設計擴展策略時不能破壞它。",
    nextContext: "Day 23 會把 capacity decision 轉成 cost review。",
    command:
      "aws application-autoscaling describe-scalable-targets --service-namespace ecs\naws application-autoscaling describe-scaling-policies --service-namespace ecs\naws cloudwatch get-metric-data --metric-data-queries file://capacity-metrics.json\naws ecs describe-services --cluster ticketfactory --services web worker",
    pitfall: "web service 和 worker service 用同一個 scaling signal，結果 web 擴了但 queue 堆積，或 worker 擴太多打爆 DB。",
    documentSpec: [
      "Production risk: under-scaling、over-scaling、queue backlog、DB connection exhaustion、cold start delay。",
      "Detection: ALB request count、ECS CPU/memory、queue depth、worker latency、RDS connections。",
      "Remediation: web target tracking、worker queue depth scaling、max capacity guardrail、DB connection pool tuning。",
      "Preventive control: capacity test、scaling alarm、scheduled scaling、cost guardrail。"
    ],
    steps: [
      "Risk: 分別定義 web、worker、scheduler 的 scaling risk。",
      "Detect: 選擇每個 workload 對應的 metrics。",
      "Remediate: 草擬 ECS target tracking 與 queue depth scaling policy。",
      "Prevent: 設計 capacity test 與 max/min guardrail。",
      "Defend: 回答：你的 worker scaling 為什麼不會打爆 RDS？"
    ],
    acceptance: [
      "有 ECS scaling policy 草案。",
      "有 queue depth scaling model。",
      "能分辨 web request scaling 與 worker backlog scaling。",
      "有 DB connection/cost guardrail。",
      "有 capacity test checklist。"
    ],
    examMapping: [
      "CloudOps Engineer Associate (SOA-C03): monitoring, scaling, capacity operations。",
      "DevOps Pro prep: automated scaling with guardrails。",
      "SAA-C03: high-performing and resilient architecture design."
    ],
    deliverables: [
      "ECS scaling policy",
      "queue depth scaling model",
      "capacity metric map",
      "DB connection guardrail",
      "capacity test checklist"
    ],
    quickQuestions: [
      { id: "cpu-not-enough", question: "為什麼 CPU 不一定是好 scaling signal？", answer: "queue backlog、request count、latency、DB connection 才可能是真正瓶頸；CPU 可能正常但使用者已經等待。" },
      { id: "worker-risk", question: "worker 擴太多有什麼風險？", answer: "可能造成 DB connection exhaustion、lock contention、第三方 API rate limit 或 job retry storm。" }
    ]
  },
  23: {
    scenario:
      "架構能跑也能擴，但成本開始累積。今天要拆 NAT Gateway、RDS、Fargate、CloudWatch、CloudFront 成本來源，提出不犧牲安全/可靠性的優化。",
    whyItMatters:
      "成本優化不是把服務關掉，而是理解固定成本、流量成本、儲存成本、log retention、過度配置與架構取捨。",
    todayGoal: "產出 NAT/RDS/Fargate/CloudWatch cost review 與 cost optimization decision table。",
    previousContext: "Day 22 已定義 capacity model；今天檢查 capacity 是否造成不必要成本。",
    nextContext: "Day 24 會進入 DR，成本和 RPO/RTO 會互相拉扯。",
    command:
      "aws ce get-cost-and-usage --time-period Start=2026-06-01,End=2026-06-30 --granularity MONTHLY --metrics UnblendedCost --group-by Type=DIMENSION,Key=SERVICE\naws logs describe-log-groups\naws rds describe-db-instances\naws ecs describe-services --cluster ticketfactory --services web worker",
    pitfall: "為了省 NAT 或 RDS 成本，把 private resource 改 public；這是用安全風險換帳單下降，通常不可接受。",
    documentSpec: [
      "Production risk: NAT data processing、RDS overprovisioning、Fargate idle desired count、CloudWatch retention 過長。",
      "Detection: Cost Explorer by service/tag、log retention、RDS size/utilization、ECS desired count。",
      "Remediation: rightsizing、scheduled scaling、log retention policy、VPC endpoint、reserved/savings options 評估。",
      "Preventive control: budget alarm、tagging policy、monthly cost review、cost per environment report。"
    ],
    steps: [
      "Risk: 列出成本來源與它們保護的可靠性/安全價值。",
      "Detect: 用 Cost Explorer 與服務 describe 指令找出 top cost drivers。",
      "Remediate: 寫出 rightsizing、retention、scaling、VPC endpoint 等優化選項。",
      "Prevent: 建立 budget alarm 與 tag policy。",
      "Defend: 回答：哪一項成本不能省，因為省了會提高 production risk？"
    ],
    acceptance: [
      "有 NAT/RDS/Fargate/CloudWatch cost review。",
      "能分辨固定成本、流量成本、儲存/log 成本。",
      "有 cost optimization decision table。",
      "有 budget/tagging/monthly review control。",
      "能說明哪些成本是為了安全或可靠性必須保留。"
    ],
    examMapping: [
      "Cost pillar: cost visibility, right sizing, budget controls。",
      "SAA-C03: Design Cost-Optimized Architectures。",
      "SA Pro prep: tradeoff between cost, security, and reliability."
    ],
    deliverables: [
      "NAT/RDS/Fargate/CloudWatch cost review",
      "cost optimization decision table",
      "budget alarm plan",
      "tagging policy",
      "cost tradeoff defense"
    ],
    quickQuestions: [
      { id: "bad-saving", question: "最危險的省錢方式是什麼？", answer: "把原本 private 的 DB/Redis/app resource 改 public，這是用安全風險換成本下降。" },
      { id: "cost-signal", question: "成本 review 要先看什麼？", answer: "先用服務、環境、tag 分組找 top drivers，再判斷是固定成本、流量成本還是保留策略問題。" }
    ]
  },
  24: {
    scenario:
      "Production database 收到壞 migration 或資料誤刪。今天要設計 RPO/RTO、RDS snapshot restore、S3 versioning、incident communication。",
    whyItMatters:
      "備份存在不等於可以復原。DR 要證明 restore path、驗證方式、切換方式、溝通節奏都能在 RTO 內完成。",
    todayGoal: "產出 RPO/RTO table、restore runbook、restore validation checklist、incident communication note。",
    previousContext: "Day 23 已討論成本；今天明確說明為了達成 RPO/RTO 需要付出哪些成本。",
    nextContext: "Day 25 會把手動 DR/部署資源整理成 IaC module boundary。",
    command:
      "aws rds describe-db-snapshots --db-instance-identifier ticketfactory-prod\naws rds restore-db-instance-from-db-snapshot --db-instance-identifier ticketfactory-restore --db-snapshot-identifier <snapshot-id>\naws s3api get-bucket-versioning --bucket <uploads-bucket>\naws route53 list-resource-record-sets --hosted-zone-id <zone-id>",
    pitfall: "只有自動備份但從未 restore drill；真正事故時才發現 snapshot 太舊、restore 太慢、app env/DNS 切換沒文件。",
    documentSpec: [
      "Production risk: bad migration、資料誤刪、RDS failure、S3 object overwrite、region/service incident。",
      "Detection: alarm、audit log、bad deploy correlation、data validation query、user report。",
      "Remediation: RDS snapshot restore、S3 version restore、DNS/app env switch、read-only mode。",
      "Preventive control: DR drill、backup retention policy、restore validation checklist、incident comms template。"
    ],
    steps: [
      "Risk: 定義 TicketFactory 的 RPO/RTO 與資料重要性。",
      "Detect: 建立資料事故偵測訊號與決策點。",
      "Remediate: 寫出 RDS restore、S3 version restore、app switch runbook。",
      "Prevent: 設計 DR drill 與 incident communication note。",
      "Defend: 回答：如果壞 migration 已寫入 10 分鐘，你能接受遺失多少資料？"
    ],
    acceptance: [
      "有 RPO/RTO table。",
      "有 restore runbook。",
      "有 restore validation checklist。",
      "有 incident communication note。",
      "能說明 backup retention、restore time、資料遺失容忍度。"
    ],
    examMapping: [
      "Reliability pillar: RPO/RTO, backup, restore, disaster recovery drills。",
      "SA Pro prep: business continuity tradeoffs。",
      "CloudOps Engineer Associate (SOA-C03): backup/restore operations and incident response."
    ],
    deliverables: [
      "RPO/RTO table",
      "restore runbook",
      "restore validation checklist",
      "incident communication note",
      "DR drill evidence plan"
    ],
    quickQuestions: [
      { id: "backup-vs-restore", question: "有備份等於有 DR 嗎？", answer: "不等於。DR 要證明能在 RTO 內 restore、驗證、切換並溝通。" },
      { id: "rpo", question: "RPO 問的是什麼？", answer: "可以接受遺失多久的資料，例如最後 5 分鐘、15 分鐘或 1 小時。" }
    ]
  },
  25: {
    scenario:
      "前面多數 AWS 資源可能是手動建立。今天把 network、compute、data、observability、security 整理成 Terraform/CDK module boundary。",
    whyItMatters:
      "手動 console 建資源很適合學習，但不適合 production 長期維運。IaC 讓變更可審查、可重建、可追蹤，也讓環境差異更可控。",
    todayGoal: "產出 Terraform/CDK module boundary map、state/secrets decision note、plan review checklist。",
    previousContext: "Day 24 已定義 DR runbook；今天把可重建性提升到 infrastructure 層。",
    nextContext: "Day 26 會把 IaC plan、approval、release note 串進 release governance。",
    command:
      "terraform init\nterraform plan -out=tfplan\nterraform show tfplan\naws resourcegroupstaggingapi get-resources --tag-filters Key=Project,Values=TicketFactory",
    pitfall: "一開始就把所有資源塞進單一 Terraform module，導致 network、data、app、ops 生命週期互相綁死。",
    documentSpec: [
      "Production risk: console drift、不可重建、環境差異、state 機敏資料、module 邊界混亂。",
      "Detection: resource inventory、terraform plan drift、tag audit、state review。",
      "Remediation: module boundary、remote state、import strategy、secrets 不進 state 的處理。",
      "Preventive control: plan review、approval gate、module ownership、drift detection schedule。"
    ],
    steps: [
      "Risk: 列出手動資源與不可重建風險。",
      "Detect: 用 tagging/resource inventory 找出 AWS resource 清單。",
      "Remediate: 畫出 network/app/data/ops/security module boundary。",
      "Prevent: 建立 plan review 與 drift detection checklist。",
      "Defend: 回答：為什麼 RDS 和 app service 不一定放同一個 module？"
    ],
    acceptance: [
      "有 Terraform/CDK module boundary map。",
      "能說明 state、secret、import 的風險。",
      "有 resource inventory/tagging strategy。",
      "有 plan review checklist。",
      "有 drift detection 和 ownership note。"
    ],
    examMapping: [
      "DevOps Pro prep: IaC, change review, drift management。",
      "CloudOps Engineer Associate (SOA-C03): provisioning and automation。",
      "SA Pro prep: module boundaries and environment consistency."
    ],
    deliverables: [
      "Terraform/CDK module boundary map",
      "resource inventory",
      "state/secrets decision note",
      "plan review checklist",
      "drift detection note"
    ],
    quickQuestions: [
      { id: "module-boundary", question: "module 邊界怎麼切？", answer: "依生命週期和責任切，例如 network、data、app、observability、安全，而不是全部塞一起。" },
      { id: "state-risk", question: "Terraform state 有什麼風險？", answer: "state 可能包含資源資訊甚至敏感值，要使用 remote backend、權限控制和 secret 管理策略。" }
    ]
  },
  26: {
    scenario:
      "系統可以部署，也有 IaC plan。今天要補 release governance：誰批准、何時上線、改了什麼、如何 rollback、證據在哪。",
    whyItMatters:
      "沒有 governance 的 deployment 很難被團隊信任。Production change 需要 scope、risk、approval、evidence、audit trail，不只是工程師自己按 deploy。",
    todayGoal: "產出 approval flow、change log、audit trail、release checklist。",
    previousContext: "Day 25 已把 infrastructure change 變成可審查 plan；今天把審查流程制度化。",
    nextContext: "Day 27 會進入 performance review，把 release 後的效能驗收納入 evidence。",
    command:
      "gh run list --workflow deploy-pages.yml --limit 5\ngh run view <run-id> --log\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=UpdateService\naws ecs describe-services --cluster ticketfactory --services web",
    pitfall: "只有 CI 綠燈但沒有 release note、approval、rollback owner、post-deploy evidence，出事後沒人知道變更脈絡。",
    documentSpec: [
      "Production risk: unauthorized change、missing rollback owner、no release evidence、audit trail incomplete。",
      "Detection: GitHub run log、CloudTrail event、ECS deployment event、release note completeness。",
      "Remediation: approval gate、change template、rollback owner、post-deploy evidence checklist。",
      "Preventive control: environment protection rule、required review、release calendar、audit retention。"
    ],
    steps: [
      "Risk: 定義 production change 的 scope/risk/owner。",
      "Detect: 收集 GitHub Actions run、CloudTrail、ECS deployment event。",
      "Remediate: 寫出 approval flow 與 rollback ownership。",
      "Prevent: 建立 release checklist 與 audit trail policy。",
      "Defend: 回答：誰批准這次 production change？證據在哪？"
    ],
    acceptance: [
      "有 approval flow。",
      "有 change log template。",
      "有 audit trail checklist。",
      "能追到 deploy run、ECS service event、CloudTrail event。",
      "有 rollback owner 與 post-deploy evidence。"
    ],
    examMapping: [
      "Governance: approval, change log, audit trail, production controls。",
      "DevOps Pro prep: release management and deployment governance。",
      "Security Specialty intro: auditability and least privilege change access."
    ],
    deliverables: [
      "approval flow",
      "change log template",
      "audit trail checklist",
      "rollback ownership matrix",
      "post-deploy evidence checklist"
    ],
    quickQuestions: [
      { id: "green-not-enough", question: "CI 綠燈為什麼不夠？", answer: "CI 只證明流程成功，不代表變更被批准、有風險紀錄、有 rollback owner 或 post-deploy evidence。" },
      { id: "audit-evidence", question: "audit trail 要包含什麼？", answer: "誰改、改什麼、何時改、誰批准、部署結果、驗收證據、rollback 路徑。" }
    ]
  },
  27: {
    scenario:
      "Production 可以跑，但使用者覺得慢。今天用 Laravel query、N+1、cache hit rate、queue latency、p95 來做 performance review。",
    whyItMatters:
      "效能問題常被誤判成加機器。若根因是 N+1 query、缺 index、cache miss、queue latency，擴 ECS 只會增加成本，不會修好體驗。",
    todayGoal: "產出 N+1/cache/queue latency checklist、performance remediation plan。",
    previousContext: "Day 26 建立 release evidence；今天把效能指標加入 release 後驗收。",
    nextContext: "Day 28 會把所有架構面向整合成 final architecture review。",
    command:
      "aws logs tail /ecs/ticketfactory-web --since 30m\naws cloudwatch get-metric-data --metric-data-queries file://performance-metrics.json\nphp artisan model:show Order\npsql \"$DATABASE_URL\" -c \"select query, calls, mean_exec_time from pg_stat_statements order by mean_exec_time desc limit 10;\"",
    pitfall: "看到慢就加 Fargate task，卻沒有先看 SQL count、p95、cache hit、queue delay，成本上升但瓶頸仍在。",
    documentSpec: [
      "Production risk: N+1 query、missing index、cache stampede、queue latency、slow external API。",
      "Detection: p95 latency、SQL slow query、pg_stat_statements、cache hit rate、queue wait time。",
      "Remediation: eager loading、index、query rewrite、cache key strategy、queue concurrency tuning。",
      "Preventive control: performance budget、load test、query regression test、post-release latency gate。"
    ],
    steps: [
      "Risk: 定義使用者感受到慢的路徑：API、DB、cache、queue、frontend。",
      "Detect: 收集 p95、slow query、cache hit、queue latency。",
      "Remediate: 寫出 N+1/index/cache/worker tuning 修復方案。",
      "Prevent: 建立 performance budget 和 regression checklist。",
      "Defend: 回答：這個慢問題應該加機器還是修 query？"
    ],
    acceptance: [
      "有 N+1/cache/queue latency checklist。",
      "能用 p95 而不是平均值討論使用者體驗。",
      "有 slow query / index / cache remediation plan。",
      "有 queue latency 與 worker concurrency 檢查。",
      "能說明何時 scaling、何時優化程式。"
    ],
    examMapping: [
      "Performance pillar: latency, throughput, caching, database optimization。",
      "DVA-C02: troubleshooting and optimizing cloud applications。",
      "SA Pro prep: distinguish scaling from application-level optimization."
    ],
    deliverables: [
      "N+1/cache/queue latency checklist",
      "performance metric map",
      "slow query remediation plan",
      "performance budget",
      "scaling vs optimization decision"
    ],
    quickQuestions: [
      { id: "p95", question: "為什麼看 p95？", answer: "平均值會掩蓋尾端使用者體驗；p95 更能看出大多數使用者是否穩定。" },
      { id: "scale-or-query", question: "什麼情況不該先 scaling？", answer: "如果瓶頸是 N+1、缺 index、cache miss，先 scaling 只會提高成本，不會根治。" }
    ]
  },
  28: {
    scenario:
      "30 天快結束，你需要用 Well-Architected 角度審查整體架構。今天把 security、reliability、performance、cost、operations 的 gap 整理成 final review。",
    whyItMatters:
      "能部署不代表 production-ready。Final Architecture Review 要能指出已完成證據、剩餘風險、取捨理由與下一步，而不是畫一張漂亮圖。",
    todayGoal: "產出 Well-Architected review checklist、risk register、architecture decision record。",
    previousContext: "Day 27 已補 performance review；今天把所有 pillar 整合。",
    nextContext: "Day 29 會把 review 內容整理成 portfolio deployment report。",
    command:
      "aws wellarchitected list-workloads\naws wellarchitected get-lens --lens-alias wellarchitected\naws ecs describe-services --cluster ticketfactory --services web worker\naws cloudwatch describe-alarms",
    pitfall: "Final review 只列服務名稱，不列 evidence、risk owner、remediation priority，導致無法判斷是否能上 production。",
    documentSpec: [
      "Production risk: architecture gap 未被記錄、無 owner、無 severity、無 remediation priority。",
      "Detection: evidence checklist、Well-Architected questions、alarm/log/deploy artifact review。",
      "Remediation: risk register、ADR、priority roadmap、explicit accepted risks。",
      "Preventive control: recurring architecture review、pre-release review gate、owner assignment。"
    ],
    steps: [
      "Risk: 依 security/reliability/performance/cost/operations 建立 review table。",
      "Detect: 對照 Day 1-27 artifact，標記哪些有 evidence、哪些只是想法。",
      "Remediate: 寫出 gap priority、owner、target date。",
      "Prevent: 建立 recurring architecture review checklist。",
      "Defend: 回答：這套架構目前最大的 accepted risk 是什麼？"
    ],
    acceptance: [
      "有 Well-Architected review checklist。",
      "有 risk register。",
      "每個 gap 有 severity、owner、remediation priority。",
      "能引用前面課程 artifact 當 evidence。",
      "能清楚說明 accepted risk。"
    ],
    examMapping: [
      "SAA / SA Pro prep: Well-Architected tradeoff and architecture review。",
      "Professional prep: risk register and remediation planning。",
      "Operations pillar: evidence-based production readiness review."
    ],
    deliverables: [
      "Well-Architected review checklist",
      "risk register",
      "architecture decision record",
      "accepted risk note",
      "remediation roadmap"
    ],
    quickQuestions: [
      { id: "ready", question: "production-ready 是什麼意思？", answer: "不是零風險，而是主要風險被辨識、可監控、可回復，且剩餘風險被明確接受。" },
      { id: "evidence", question: "review 裡最重要的是什麼？", answer: "證據。每個 claim 都應連到 diagram、runbook、command output、dashboard 或 test。" }
    ]
  },
  29: {
    scenario:
      "你已經有 28 天的 artifacts。今天要整理成 portfolio deployment report：問題、架構、部署流程、成本、安全、DR、demo script。",
    whyItMatters:
      "作品集不是截圖集合，而是一份能讓主管或面試官快速理解你如何從 Docker Compose 推進到 AWS production 的工程敘事。",
    todayGoal: "產出 deployment report、architecture diagram、cost estimate、demo script。",
    previousContext: "Day 28 已完成 final architecture review；今天把它整理成可展示作品集。",
    nextContext: "Day 30 會用這份 report 進行 20 分鐘 capstone defense。",
    command:
      "git log --oneline --decorate -n 10\nfind docs -maxdepth 3 -type f | sort\naws ce get-cost-and-usage --time-period Start=2026-06-01,End=2026-06-30 --granularity MONTHLY --metrics UnblendedCost\nopen docs/deployment-report.md",
    pitfall: "報告只貼 AWS service list，沒有問題脈絡、決策理由、驗證證據、成本估算和下一步，讀者看不出你的工程判斷。",
    documentSpec: [
      "Production risk: portfolio 無法被審查，claim 沒證據，成本/DR/rollback 缺失。",
      "Detection: report coverage checklist、artifact links、diagram completeness、demo timing。",
      "Remediation: 補問題敘事、artifact references、cost estimate、risk and next-step section。",
      "Preventive control: report template、review checklist、demo rehearsal。"
    ],
    steps: [
      "Risk: 列出 report 必須回答的主管/面試官問題。",
      "Detect: 盤點 Day 1-28 artifacts，標記缺圖、缺證據、缺成本。",
      "Remediate: 整理 deployment report 與 demo script。",
      "Prevent: 建立 portfolio review checklist。",
      "Defend: 用 5 分鐘講完 Docker Compose 到 AWS 的主線。"
    ],
    acceptance: [
      "有 deployment report outline。",
      "有 architecture diagram 與 artifact links。",
      "有 cost estimate 與 risk/next-step section。",
      "有 5-10 分鐘 demo script。",
      "能把技術選型說成 problem -> decision -> evidence -> tradeoff。"
    ],
    examMapping: [
      "Portfolio: demonstrate production deployment evidence and engineering judgment。",
      "SA Pro prep: explain architecture tradeoffs to technical reviewers。",
      "Career readiness: concise full-stack cloud deployment narrative."
    ],
    deliverables: [
      "deployment report",
      "architecture diagram",
      "cost estimate",
      "artifact index",
      "demo script"
    ],
    quickQuestions: [
      { id: "portfolio-value", question: "作品集最重要的是什麼？", answer: "工程判斷和證據，不是服務清單。要能說出問題、決策、結果、風險。" },
      { id: "demo-time", question: "demo script 要多長？", answer: "建議 5-10 分鐘版本，另備 20 分鐘答辯版本給 Day 30。" }
    ]
  },
  30: {
    scenario:
      "今天做 Capstone Defense。你要用 20 分鐘說明 Docker Compose 如何拆到 AWS、怎麼部署、如何 rollback、如何保護資料、如何監控、還有哪些風險。",
    whyItMatters:
      "真正的雲端能力不是背 AWS service，而是能在追問下 defend 你的架構。Day 30 要把前面所有 artifact 變成清楚、有證據、有取捨的答辯。",
    todayGoal: "產出 20-minute defense script、Q&A bank、final readiness rubric。",
    previousContext: "Day 29 已整理 portfolio report；今天把它轉成口頭答辯與 Q&A。",
    nextContext: "30 天完成後，下一步是補真實 AWS execution evidence，從 L4 Professional Prep 走向 L5 Defense Ready。",
    command:
      "printf '1. compose mapping\\n2. deployment path\\n3. rollback\\n4. security\\n5. DR\\n6. cost\\n'\nopen docs/deployment-report.md\nopen docs/capstone-defense.md\naws ecs describe-services --cluster ticketfactory --services web worker",
    pitfall: "答辯只講做了什麼，沒有回答為什麼、怎麼驗證、出事怎麼復原、哪些風險接受，聽起來就像照教學做完。",
    documentSpec: [
      "Production risk: defense 無法承受追問，缺 rollback、DR、cost、security、evidence。",
      "Detection: Q&A rehearsal、rubric scoring、missing evidence list、timing check。",
      "Remediation: 補強弱點答案、連回 artifact、標明 accepted risk 與 next steps。",
      "Preventive control: final readiness rubric、Q&A bank、evidence index。"
    ],
    steps: [
      "Risk: 列出 10 個 capstone 必答問題。",
      "Detect: 用 rubric 檢查每題是否有 artifact/evidence 支撐。",
      "Remediate: 補缺失答案，將回答整理成 20-minute script。",
      "Prevent: 建立 final Q&A bank 和 next-step learning plan。",
      "Defend: 完整演練一次：這套架構能上 production 嗎？"
    ],
    acceptance: [
      "有 20-minute defense script。",
      "有至少 10 題 Q&A bank。",
      "每個回答都連到 diagram、runbook、command、dashboard 或 report。",
      "有 final readiness rubric，能評估 L4/L5 差距。",
      "能回答：如果主管問這能上 production 嗎，你如何有條件地回答。"
    ],
    examMapping: [
      "Defense Ready: architecture explanation, tradeoff defense, operational readiness。",
      "SA Pro prep: answer cross-domain architecture questions under scrutiny。",
      "Professional portfolio: convert implementation evidence into senior engineering narrative."
    ],
    deliverables: [
      "20-minute defense script",
      "Q&A bank",
      "final readiness rubric",
      "evidence index",
      "next-step learning plan"
    ],
    quickQuestions: [
      { id: "production-answer", question: "主管問能上 production 嗎，能直接說可以嗎？", answer: "應該有條件回答：哪些已滿足、哪些風險已接受、哪些 blocker 必須先修、如何監控和 rollback。" },
      { id: "defense-evidence", question: "答辯最怕什麼？", answer: "只有口頭描述沒有 evidence。每個 claim 都要能指到 artifact、command output、diagram 或 dashboard。" }
    ]
  }
};

const labSpecForDay = (day: number) => associateLabSpecs[day] ?? deepDiveLabSpecs[day];

const commandForDay = (day: number, titleEn: string) => {
  const labSpec = labSpecForDay(day);
  if (day === 1) return "docker-compose config --services\nlsof -nP -iTCP -sTCP:LISTEN";
  if (day === 2) return "docker compose config\ndocker compose --env-file .env.production.local up -d\ndocker compose ps\ncurl -I http://localhost:18080/health\ndocker compose logs --tail=80 api";
  if (day === 3) return "docker build -t ticketfactory-api:$(git rev-parse --short HEAD) .\ndocker run --rm ticketfactory-api:$(git rev-parse --short HEAD) php artisan --version\ndocker image inspect ticketfactory-api:$(git rev-parse --short HEAD)";
  if (day === 4) return "ssh ec2-user@<ec2-public-ip>\nsudo dnf update -y\nsudo dnf install -y docker\nsudo systemctl enable --now docker\ndocker compose version\ndocker compose up -d\ndocker compose ps\ncurl -I http://<ec2-public-ip>/health";
  if (day === 5) return "aws rds describe-db-instances\naws s3 ls\naws elasticache describe-cache-clusters\nredis-cli -h <redis-endpoint> ping";
  if (labSpec) return labSpec.command;
  if (titleEn.includes("ECR")) return "aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com";
  if (titleEn.includes("ECS")) return "aws ecs update-service --cluster ticketfactory --service web --force-new-deployment";
  if (titleEn.includes("CloudWatch")) return "aws logs tail /ecs/ticketfactory-web --follow";
  if (titleEn.includes("GitHub")) return "git push origin main";
  if (titleEn.includes("Cost")) return "aws ce get-cost-and-usage --time-period Start=2026-06-01,End=2026-06-30 --granularity MONTHLY --metrics UnblendedCost";
  return "aws sts get-caller-identity";
};

const pitfallForDay = (day: number) => {
  const labSpec = labSpecForDay(day);
  if (day === 2) return "Production-like 不等於本機隨便跑；port、env、health endpoint、logs 都要留下證據，否則 Day4 上 EC2 只會把問題搬到雲端。";
  if (day === 3) return "Production image 不是 dev container；不要依賴 bind mount、latest tag、dev dependency 或 container local storage。";
  if (day === 4) return "EC2 first deploy 不是最終架構；重點是先建立可理解的 server/firewall/runtime/rollback 路徑，Security Group 不可為了方便全開。";
  if (day === 5) return "抽離 stateful service 時不要只改 endpoint；要同時處理 security boundary、backup/restore、migration rollback 與檔案權限。";
  if (labSpec) return labSpec.pitfall;
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
  if (day >= 16) {
    notes.push("Well-Architected note: Deep Dive days use AWS Well-Architected pillars to organize risk, detection, remediation, preventive control, and defense evidence.");
    notes.push("Certification note: AWS operations associate content is aligned to AWS Certified CloudOps Engineer - Associate (SOA-C03), not the older SysOps naming.");
  }
  if (titleEn.includes("Signed URL")) {
    notes.push("S3 presigned URL note: a presigned URL grants temporary access to a specific operation and object; bucket policy and object key scope still matter.");
  }
  if (titleEn.includes("Disaster Recovery")) {
    notes.push("RDS restore note: restoring from a DB snapshot creates a new DB instance, so endpoint switch, validation, and communication must be part of the runbook.");
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
  const labSpec = labSpecForDay(day);
  if (labSpec) {
    return {
      scenario: labSpec.scenario,
      whyItMatters: labSpec.whyItMatters,
      todayGoal: labSpec.todayGoal,
      previousContext: labSpec.previousContext,
      nextContext: labSpec.nextContext,
      guidedSteps: buildAssociateGuidedSteps(labSpec),
      quickQuestions: labSpec.quickQuestions,
      deliverables: labSpec.deliverables
    };
  }

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

const examMappingForDay = (day: number, phase: Phase, titleEn: string) => {
  const labSpec = labSpecForDay(day);
  if (labSpec) return labSpec.examMapping;
  if (day <= 5) {
    return [
      "Cloud Practitioner / Foundational: understand shared responsibility, deployment basics, and core AWS service categories.",
      "Associate prep bridge: convert Docker Compose inventory into evidence used later for SAA/DVA/CloudOps labs."
    ];
  }
  if (phase === "Deep Dive") {
    return [
      `Professional prep: ${titleEn} strengthens architecture tradeoff explanation, operational risk review, and defense readiness.`,
      "Senior full-stack deployment portfolio: connect AWS service choices to reliability, security, cost, and maintainability."
    ];
  }
  return [
    "Associate prep: map this lab to at least one AWS exam domain and one production artifact."
  ];
};

const buildLesson = (day: number, topic: string[]) => {
  const [title, titleEn, summary] = topic;
  const phase = phaseForDay(day);
  const labSpec = labSpecForDay(day);
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
    documentSpec: labSpec?.documentSpec ?? deploymentDocumentSpecByDay[day] ?? [
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
    steps: labSpec?.steps ?? deploymentStepsByDay[day] ?? [
      "Read: 先閱讀本日概念，確認你知道這個 AWS/Docker 元件解決什麼問題。",
      "Inspect: 對照 TicketFactory 的 docker-compose、Dockerfile、env、Nginx 或 Laravel config。",
      "Implement: 依照本日 lab 產出設定、指令或架構文件。",
      "Verify: 用 command、browser、logs 或 screenshot 驗證，不用感覺宣告完成。",
      "Record: 把結果寫進 deployment report，包含問題、修復與下一步。"
    ],
    acceptance: labSpec?.acceptance ?? deploymentAcceptanceByDay[day] ?? [
      "至少 20 分鐘以上可操作內容，不只閱讀文字。",
      "有一份可保存的文件或規格輸出。",
      "有一個明確 command 或 UI 操作可以驗證。",
      "有踩雷點與 rollback / recovery note。",
      "能說明此日內容如何推進 TicketFactory 上 AWS。"
    ],
    expectedOutcome: `${phase} 階段 Day ${day} 完成後，學員會得到一份 ${titleEn} artifact，並能把它放進最終 AWS deployment portfolio。`,
    sourceNotes: sourceNotesForDay(day, titleEn),
    examMapping: examMappingForDay(day, phase, titleEn),
    mentorScript
  } satisfies Lesson;
};

export const allLessons: Lesson[] = [
  ...deploymentTopics.map((topic, index) => buildLesson(index + 1, topic)),
  ...advancedTopics.map((topic, index) => buildLesson(index + 6, topic)),
  ...deepDiveTopics.map((topic, index) => buildLesson(index + 16, topic))
];

export type StageKey = "deployment" | "advanced" | "deep-dive";
export type SkillArea = "Docker" | "ECS" | "Networking" | "Data" | "CI/CD" | "Observability" | "Security" | "Cost/DR";

export type QuizQuestion = {
  id: string;
  day?: number;
  stageKey?: StageKey;
  skillArea: SkillArea;
  prompt: string;
  promptEn?: string;
  options: string[];
  answer: string;
  explanation: string;
  examMapping?: string[];
  remediationLessonDays?: number[];
};

export type InteractiveScenario = {
  title: string;
  stageKey: StageKey;
  relatedDays: number[];
  skillArea: SkillArea;
  symptom: string;
  evidence: string;
  choices: string[];
  correctDiagnosis: string;
  fix: string;
  prevention: string;
  examMapping: string[];
};

const stageKeyForDay = (day: number): StageKey => {
  if (day <= 5) return "deployment";
  if (day <= 15) return "advanced";
  return "deep-dive";
};

const skillAreaForDay = (day: number): SkillArea => {
  if (day <= 3) return "Docker";
  if ([4, 8, 10, 14, 22].includes(day)) return "ECS";
  if ([6, 9, 20].includes(day)) return "Networking";
  if ([5, 18, 19, 21, 27].includes(day)) return "Data";
  if ([7, 13, 25, 26, 29, 30].includes(day)) return "CI/CD";
  if ([15, 28].includes(day)) return "Observability";
  if ([11, 16, 17].includes(day)) return "Security";
  return "Cost/DR";
};

const stageExamMapping: Record<StageKey, string[]> = {
  deployment: ["Cloud Practitioner bridge", "Docker production readiness", "EC2 first deploy"],
  advanced: ["SAA-C03", "DVA-C02", "CloudOps Engineer Associate (SOA-C03)"],
  "deep-dive": ["AWS Well-Architected", "DevOps Pro prep", "SA Pro prep"]
};

const dailyQuizQuestions: QuizQuestion[] = allLessons.flatMap((lesson) => {
  const stageKey = stageKeyForDay(lesson.day);
  const skillArea = skillAreaForDay(lesson.day);
  const firstCommand = lesson.command.split("\n")[0];
  const primaryDeliverable = lesson.mentorScript.deliverables[0] ?? `${lesson.titleEn} artifact`;
  const primarySpec = lesson.documentSpec[0] ?? "本日規格文件";
  const remediation = [lesson.day];

  return [
    {
      id: `day-${lesson.day}-artifact`,
      day: lesson.day,
      stageKey,
      skillArea,
      prompt: `Day ${lesson.day} 的情境中，最能證明你不是只看完文字的交付物是什麼？`,
      promptEn: `Which artifact best proves Day ${lesson.day} is practiced, not only read?`,
      options: [primaryDeliverable, "只記住 AWS service 名稱", "直接跳到下一天", "把所有 port 都開成 public"],
      answer: primaryDeliverable,
      explanation: `本日應留下 ${primaryDeliverable}。這份 artifact 會銜接後續 lesson 與 final deployment portfolio。`,
      examMapping: lesson.examMapping,
      remediationLessonDays: remediation
    },
    {
      id: `day-${lesson.day}-evidence`,
      day: lesson.day,
      stageKey,
      skillArea,
      prompt: `你在 Day ${lesson.day} 遇到「${lesson.pitfall}」這類問題時，第一步最應該做什麼？`,
      promptEn: "What should you do first when this pitfall appears?",
      options: [`先用本日驗證指令收集 evidence：${firstCommand}`, "先把 AWS 服務全部換掉", "先關閉 health check", "先把 Security Group 全開"],
      answer: `先用本日驗證指令收集 evidence：${firstCommand}`,
      explanation: "部署訓練的重點是用 command、logs、diagram 或 checklist 取得證據，不用猜測宣告完成。",
      examMapping: lesson.examMapping,
      remediationLessonDays: remediation
    },
    {
      id: `day-${lesson.day}-remediation`,
      day: lesson.day,
      stageKey,
      skillArea,
      prompt: `如果 Day ${lesson.day} 的驗收沒有通過，最合理的 remediation path 是？`,
      promptEn: "What is the best remediation path if this day's acceptance criteria fail?",
      options: [`回到 Day ${lesson.day} 補齊：${primarySpec}`, "只重新整理瀏覽器", "把錯誤截圖藏起來", "略過 artifact 等最後一天再補"],
      answer: `回到 Day ${lesson.day} 補齊：${primarySpec}`,
      explanation: `錯題要回到對應 lesson 補 artifact、驗證與 troubleshooting note。Day ${lesson.day} 的核心規格是：${primarySpec}`,
      examMapping: lesson.examMapping,
      remediationLessonDays: remediation
    }
  ];
});

const makeStageQuestion = (
  id: string,
  stageKey: StageKey,
  skillArea: SkillArea,
  prompt: string,
  answer: string,
  options: string[],
  explanation: string,
  remediationLessonDays: number[]
): QuizQuestion => ({
  id: `stage-${stageKey}-${id}`,
  stageKey,
  skillArea,
  prompt,
  promptEn: `Stage exam question for ${stageKey}`,
  options,
  answer,
  explanation,
  examMapping: stageExamMapping[stageKey],
  remediationLessonDays
});

const stageExamQuestions: QuizQuestion[] = [
  makeStageQuestion("deploy-1", "deployment", "Docker", "本機 Docker Compose 可跑，但 Day 2 production-like run 失敗，最常見原因是？", "container 內仍用 localhost 連 DB/Redis", ["container 內仍用 localhost 連 DB/Redis", "ECS desired count 太低", "CloudFront cache 太久", "RDS snapshot 太舊"], "container 內的 localhost 指向自己，不是你的 host，也不是另一個 service。", [2]),
  makeStageQuestion("deploy-2", "deployment", "Docker", "Production image build 成功但雲端跑起來沒有 Laravel app source，該回哪個概念？", "dev bind mount 沒有被 production image packaging 取代", ["dev bind mount 沒有被 production image packaging 取代", "ALB matcher 太嚴格", "RDS public access 關閉", "CloudWatch dashboard 不存在"], "Day 3 要移除 dev-only bind mount 依賴，把 source/dependency 打進 image。", [3]),
  makeStageQuestion("deploy-3", "deployment", "Networking", "EC2 first deploy public health 失敗，最合理的診斷順序是？", "Security Group、host port、container port、app logs 逐層查", ["Security Group、host port、container port、app logs 逐層查", "先改成 public RDS", "先刪掉 Dockerfile", "先開 CloudFront invalidation"], "Day 4 的外部流量會經過多層邊界，要逐層收證據。", [4]),
  makeStageQuestion("deploy-4", "deployment", "Data", "EC2 可以跑，但 uploads 和 database 都在同一台主機。正式化下一步是？", "設計 RDS/S3/ElastiCache stateful extraction plan", ["設計 RDS/S3/ElastiCache stateful extraction plan", "把 EC2 volume 當永久備份", "把 bucket 設 public", "只加大 EC2 instance"], "Day 5 要把資料責任抽離到 managed services，並補 backup/rollback。", [5]),
  makeStageQuestion("deploy-5", "deployment", "Security", "為了快速測試，把 DB port 對 0.0.0.0/0 開放會違反什麼？", "least privilege network boundary", ["least privilege network boundary", "React build hash", "queue idempotency", "CloudFront invalidation"], "資料層通常只接受 app security group，不直接公開。", [4, 5]),
  makeStageQuestion("deploy-6", "deployment", "Docker", "Day 1 inventory 最重要的用途是？", "讓後續 EC2/ECS/RDS/S3 mapping 有依據", ["讓後續 EC2/ECS/RDS/S3 mapping 有依據", "取代所有測試", "避免寫 runbook", "讓 production 可以不用 rollback"], "沒有 inventory，後續 service boundary 和資料責任會變成猜測。", [1]),
  makeStageQuestion("deploy-7", "deployment", "Observability", "container 顯示 Up 是否等於 service ready？", "不是，還要驗證 health endpoint 和 dependencies", ["不是，還要驗證 health endpoint 和 dependencies", "是，Up 就代表 production ready", "只要 image 有 latest tag 就 ready", "只要 EC2 能 SSH 就 ready"], "running process 不等於 HTTP/DB/Redis 都 ready。", [2]),
  makeStageQuestion("deploy-8", "deployment", "CI/CD", "image 只用 latest tag 最大風險是？", "rollback 時不知道上一版是哪個 artifact", ["rollback 時不知道上一版是哪個 artifact", "ALB 不能支援 HTTPS", "S3 不能存檔", "VPC 不能建 private subnet"], "commit SHA/release tag 才能讓部署可追蹤。", [3, 7]),
  makeStageQuestion("deploy-9", "deployment", "Data", "抽離 RDS/S3/Redis 時，只改 endpoint 為什麼不夠？", "還要處理 security boundary、backup、migration、rollback", ["還要處理 security boundary、backup、migration、rollback", "還要把 bucket public", "還要刪除 health check", "還要把 worker 放進 web process"], "Managed service extraction 是資料責任與網路邊界的改造。", [5]),
  makeStageQuestion("deploy-10", "deployment", "Docker", "部署文件最少應包含哪四段？", "setup、deploy、verify、rollback", ["setup、deploy、verify、rollback", "logo、顏色、字型、動畫", "signup、login、logout、profile", "cache、cookie、session、browser"], "Runbook 要能讓另一位工程師接手操作和復原。", [1, 4]),

  makeStageQuestion("adv-1", "advanced", "Networking", "ALB 放 public subnet、ECS/RDS 放 private subnet的主因是？", "外部只進 ALB，app/data 留在私有邊界", ["外部只進 ALB，app/data 留在私有邊界", "讓 RDS 更容易被任何人連線", "讓 task 不需要 Security Group", "讓 CloudWatch 不能收 logs"], "Day 6 的 network boundary 是 Advanced 階段基礎。", [6]),
  makeStageQuestion("adv-2", "advanced", "CI/CD", "ECR image tag policy 最不該只依賴什麼？", "latest", ["latest", "commit SHA", "image digest", "release note"], "latest 會移動，難以審查與 rollback。", [7]),
  makeStageQuestion("adv-3", "advanced", "ECS", "ECS task definition 和 service 差異是？", "task definition 是規格，service 維持 desired count 和 rollout", ["task definition 是規格，service 維持 desired count 和 rollout", "service 是 Dockerfile", "task definition 是 S3 bucket", "service 只負責 billing"], "Day 8 必須分清規格、task、service、cluster。", [8]),
  makeStageQuestion("adv-4", "advanced", "Networking", "ECS task running 但 ALB target unhealthy，代表什麼？", "process 活著，但 ALB health path/port/SG/readiness 未通過", ["process 活著，但 ALB health path/port/SG/readiness 未通過", "CloudFront 一定壞了", "RDS 一定 public", "CI 一定沒有 OIDC"], "Day 9 的真相入口是 target health，不只是 runningCount。", [9]),
  makeStageQuestion("adv-5", "advanced", "ECS", "Laravel worker 和 scheduler 為什麼不該塞在 web service？", "擴展、restart、health、部署節奏不同", ["擴展、restart、health、部署節奏不同", "因為 worker 只能跑在 browser", "因為 scheduler 不能寫 logs", "因為 ALB 不能連 ECS"], "Day 10 需要 web/worker/scheduler runtime split。", [10]),
  makeStageQuestion("adv-6", "advanced", "Security", "React build env 可以放 DB password 嗎？", "不可以，前端 bundle 會被使用者下載", ["不可以，前端 bundle 會被使用者下載", "可以，只要變數名很長", "可以，CloudFront 會加密 JS", "可以，因為 React 在 AWS 上"], "Day 12/11 要分 public config 和 secret。", [11, 12]),
  makeStageQuestion("adv-7", "advanced", "Security", "ECS secret 最合理的做法是？", "task definition 使用 Secrets Manager/SSM reference", ["task definition 使用 Secrets Manager/SSM reference", "寫進 Dockerfile ENV", "寫進 GitHub README", "放進 React build"], "Secret 不應 bake into image 或 repo。", [11]),
  makeStageQuestion("adv-8", "advanced", "CI/CD", "GitHub Actions deploy ECS 時，哪個 artifact 應被 render 進 task definition？", "commit SHA image URI", ["commit SHA image URI", "瀏覽器 history", "S3 bucket public flag", "RDS master password"], "Day 13 要讓 pipeline 可追蹤、可 rollback。", [13]),
  makeStageQuestion("adv-9", "advanced", "ECS", "Zero downtime deployment 不能只靠 rolling update，還要搭配什麼？", "health gate、capacity、migration compatibility、rollback", ["health gate、capacity、migration compatibility、rollback", "只把 desired count 設 0", "只清空 CloudFront cache", "只改 README"], "Day 14 的重點是部署順序和驗證門檻。", [14]),
  makeStageQuestion("adv-10", "advanced", "Observability", "CloudWatch alarm 應該服務哪個目的？", "在使用者大量回報前偵測錯誤或容量風險", ["在使用者大量回報前偵測錯誤或容量風險", "取代所有 logs", "讓部署不用 rollback", "讓 RDS 可以 public"], "Day 15 讓 deployment acceptance 有指標。", [15]),
  makeStageQuestion("adv-11", "advanced", "Data", "S3 + CloudFront 發布 React 時，index.html 快取最常造成什麼？", "使用者拿到舊 bundle reference", ["使用者拿到舊 bundle reference", "RDS 無法連線", "worker job 重複", "APP_KEY 消失"], "Day 12 要處理 asset hash、cache policy、invalidation。", [12]),
  makeStageQuestion("adv-12", "advanced", "Networking", "ALB 502 的常見診斷點不包含哪個？", "把所有 AWS service 改名", ["把所有 AWS service 改名", "container port", "health path", "security group"], "502 要回到 traffic path 與 target health 診斷。", [9]),
  makeStageQuestion("adv-13", "advanced", "CI/CD", "migration gate 要防止什麼？", "不可逆 schema change 未審查就進 production", ["不可逆 schema change 未審查就進 production", "React 使用 TypeScript", "ECR image 有 digest", "CloudWatch 有 dashboard"], "CI/CD 不能盲目自動化破壞性 migration。", [13, 14]),
  makeStageQuestion("adv-14", "advanced", "ECS", "scheduler 多副本最可能造成什麼？", "重複執行排程任務", ["重複執行排程任務", "ALB DNS 消失", "S3 無法 presign", "RDS snapshot 自動刪除"], "Scheduler 需要 single runner 或 distributed lock。", [10]),
  makeStageQuestion("adv-15", "advanced", "Observability", "部署後驗收不該只看什麼？", "工程師覺得網頁打得開", ["工程師覺得網頁打得開", "ALB 5xx", "target health", "ECS logs"], "Production readiness 要用 logs/metrics/alarms/dashboard 驗證。", [15]),

  makeStageQuestion("deep-1", "deep-dive", "Security", "Security hardening review 看到 APP_DEBUG=true，正確判斷是？", "production blocker，可能暴露 stack/env/secret 線索", ["production blocker，可能暴露 stack/env/secret 線索", "可以接受，只要 ALB 有 HTTPS", "只影響 UI 顏色", "只需要清 CloudFront cache"], "Day 16 必須關閉 debug 並檢查 headers/CORS/IAM。", [16]),
  makeStageQuestion("deep-2", "deep-dive", "Security", "多租戶資料隔離最不能只靠哪一層？", "前端 tenant selector", ["前端 tenant selector", "後端 policy", "DB tenant-aware query", "cross-tenant tests"], "Day 17 要讓 API/query/policy/DB 都遵守 tenant boundary。", [17]),
  makeStageQuestion("deep-3", "deep-dive", "Data", "destructive migration 最安全的策略通常是？", "expand-contract 或 forward-fix plan", ["expand-contract 或 forward-fix plan", "直接 drop column 並祈禱", "只清 browser cache", "只重啟 ALB"], "Day 18 要先相容、驗證、再收斂。", [18]),
  makeStageQuestion("deep-4", "deep-dive", "Data", "signed URL 最大原則是？", "bucket 保持 private，URL 短效且綁定授權操作", ["bucket 保持 private，URL 短效且綁定授權操作", "bucket 設 public 方便下載", "URL 永久有效", "把 DB password 放 query string"], "Day 19 要避免 public bucket 和過長 TTL。", [19]),
  makeStageQuestion("deep-5", "deep-dive", "Networking", "WebSocket 通知能不能作為交易成功依據？", "不能，交易一致性仍靠 DB transaction/lock/queue", ["不能，交易一致性仍靠 DB transaction/lock/queue", "可以，只要前端收到 event", "可以，只要 ALB 支援 HTTPS", "可以，只要 Redis public"], "Day 20/21 分開通知和交易一致性。", [20, 21]),
  makeStageQuestion("deep-6", "deep-dive", "Data", "高併發搶票 scale out 前一定要先確保什麼？", "lock/transaction/idempotency/constraint 保護 invariants", ["lock/transaction/idempotency/constraint 保護 invariants", "CloudFront invalidation", "GitHub Pages deploy", "README 完整"], "Day 21 的一致性比單純加 worker 更重要。", [21]),
  makeStageQuestion("deep-7", "deep-dive", "ECS", "worker scaling 只看 CPU 可能漏掉什麼？", "queue backlog 和 worker latency", ["queue backlog 和 worker latency", "S3 object key", "tenant selector 顏色", "Git log"], "Day 22 要用 queue depth 與 workload-specific metrics。", [22]),
  makeStageQuestion("deep-8", "deep-dive", "Cost/DR", "最危險的成本優化是？", "把 private data resource 改 public 省 NAT/網路成本", ["把 private data resource 改 public 省 NAT/網路成本", "調整 log retention", "rightsizing RDS", "加 budget alarm"], "Day 23 要保留安全/可靠性底線。", [23]),
  makeStageQuestion("deep-9", "deep-dive", "Cost/DR", "有 RDS snapshot 是否等於 DR 完成？", "不是，還要 restore、驗證、切換、溝通演練", ["不是，還要 restore、驗證、切換、溝通演練", "是，有 snapshot 就能保證 RTO", "是，CloudFront 會自動還原 DB", "是，ECS desired count 會復原資料"], "Day 24 要用 RPO/RTO 和 restore drill 證明。", [24]),
  makeStageQuestion("deep-10", "deep-dive", "CI/CD", "IaC module boundary 應依什麼切？", "生命週期與責任，例如 network/data/app/ops/security", ["生命週期與責任，例如 network/data/app/ops/security", "字母順序", "檔案大小", "誰先建立"], "Day 25 要避免所有資源塞進單一 module。", [25]),
  makeStageQuestion("deep-11", "deep-dive", "CI/CD", "Release governance 除了 CI 綠燈，還需要什麼？", "approval、change log、rollback owner、post-deploy evidence", ["approval、change log、rollback owner、post-deploy evidence", "只需要更多顏色", "只需要 localStorage", "只需要關閉 alarms"], "Day 26 讓 production change 可審計。", [26]),
  makeStageQuestion("deep-12", "deep-dive", "Data", "API 慢時不該第一時間假設什麼？", "只要加 ECS task 就會解決", ["只要加 ECS task 就會解決", "可能是 N+1", "可能缺 index", "可能 queue latency"], "Day 27 要先看 p95、SQL、cache、queue。", [27]),
  makeStageQuestion("deep-13", "deep-dive", "Observability", "Final Architecture Review 最重要的不是服務清單，而是？", "evidence、risk owner、severity、remediation priority", ["evidence、risk owner、severity、remediation priority", "logo", "hero 文案", "只列 AWS 名稱"], "Day 28 要用 Well-Architected 方式審查。", [28]),
  makeStageQuestion("deep-14", "deep-dive", "CI/CD", "Portfolio report 最能展現工程判斷的格式是？", "problem -> decision -> evidence -> tradeoff", ["problem -> decision -> evidence -> tradeoff", "只貼截圖", "只列服務價格", "只放登入帳密"], "Day 29 是把 artifact 轉成可展示敘事。", [29]),
  makeStageQuestion("deep-15", "deep-dive", "CI/CD", "Capstone Defense 回答『能上 production 嗎』最好的方式是？", "有條件回答已滿足、blocker、accepted risks、monitoring、rollback", ["有條件回答已滿足、blocker、accepted risks、monitoring、rollback", "直接說可以，不需證據", "直接說不可以，不需分析", "只回答用了 ECS"], "Day 30 要能 defend 取捨和剩餘風險。", [30]),
  makeStageQuestion("deep-16", "deep-dive", "Security", "tenant context 缺失時，安全設計應偏向？", "fail closed", ["fail closed", "fail open", "自動切到第一個 tenant", "顯示所有資料方便 debug"], "Day 17 的 tenant isolation 應避免跨租戶洩漏。", [17]),
  makeStageQuestion("deep-17", "deep-dive", "Observability", "Well-Architected review claim 應該連到什麼？", "diagram、runbook、command output、dashboard 或 test", ["diagram、runbook、command output、dashboard 或 test", "口頭印象", "只連到首頁", "只連到色票"], "Day 28/30 的答辯要 evidence-backed。", [28, 30]),
  makeStageQuestion("deep-18", "deep-dive", "Cost/DR", "RPO 問的是什麼？", "可接受遺失多久資料", ["可接受遺失多久資料", "可接受多快登入", "可接受多少 CSS", "可接受多少 tenant"], "Day 24 要明確 RPO/RTO。", [24]),
  makeStageQuestion("deep-19", "deep-dive", "ECS", "Autoscaling 的 max capacity guardrail 是為了？", "避免擴展打爆 DB 或造成成本失控", ["避免擴展打爆 DB 或造成成本失控", "讓所有 task 永遠為 0", "讓 Redis public", "讓 CloudFront 停止 cache"], "Day 22 需要 capacity 與成本/DB guardrail。", [22, 23]),
  makeStageQuestion("deep-20", "deep-dive", "Security", "Audit trail 最少要能回答什麼？", "誰改、改什麼、何時改、誰批准、結果與 rollback", ["誰改、改什麼、何時改、誰批准、結果與 rollback", "按鈕顏色", "瀏覽器尺寸", "localStorage key 名稱"], "Day 26 的治理讓 production change 可追溯。", [26])
];

export const quizQuestions: QuizQuestion[] = [...dailyQuizQuestions, ...stageExamQuestions];

const diagnose = (correct: string, choices: string[] = []) => [correct, ...choices.filter((choice) => choice !== correct)].slice(0, 4);

export const labs: InteractiveScenario[] = [
  {
    title: "Local Compose: port collision",
    stageKey: "deployment",
    relatedDays: [1, 2],
    skillArea: "Docker",
    symptom: "docker compose up 失敗，Nginx 無法 bind 8080，瀏覽器打 localhost 看到另一個專案。",
    evidence: "lsof 顯示 8080/8443 已被 TicketFactory 或 Docker Desktop 使用；docker compose ps 顯示 web exited。",
    correctDiagnosis: "host port collision，compose override 沒有避開既有服務。",
    choices: diagnose("host port collision，compose override 沒有避開既有服務。", ["RDS public access 被關閉。", "CloudFront cache stale。", "APP_DEBUG=false 導致 port 被佔用。"]),
    fix: "改用 .env.production.local 或 compose override，把教學/專案 ports 分離，例如 4321、18080、18443。",
    prevention: "Day 1/2 保存 port map，deploy 前固定跑 lsof 與 docker compose config。",
    examMapping: ["Docker production readiness", "Cloud Practitioner bridge"]
  },
  {
    title: "Local Compose: container uses localhost",
    stageKey: "deployment",
    relatedDays: [2],
    skillArea: "Docker",
    symptom: "API container 回 500，Laravel log 顯示 SQLSTATE connection refused on 127.0.0.1。",
    evidence: "DB container healthy，但 API env 的 DB_HOST=localhost；container-to-container DNS 應使用 service name。",
    correctDiagnosis: "container 內 localhost 指向自己，不是 database service。",
    choices: diagnose("container 內 localhost 指向自己，不是 database service。", ["ALB target group matcher 設錯。", "S3 signed URL 過期。", "CloudWatch alarm 門檻太低。"]),
    fix: "將 DB_HOST 改成 compose service name，例如 db 或 postgres，並重新跑 health check。",
    prevention: "Day 2 checklist 必須檢查 container network env，不只看 browser 可不可以開。",
    examMapping: ["Docker networking", "DVA-C02 troubleshooting"]
  },
  {
    title: "Local Compose: volume permission",
    stageKey: "deployment",
    relatedDays: [2, 3],
    skillArea: "Docker",
    symptom: "Laravel 上傳或 cache 失敗，log 顯示 storage 或 bootstrap/cache permission denied。",
    evidence: "container user 無法寫入 bind mount；local owner 和 runtime user 不一致。",
    correctDiagnosis: "runtime writable directory 權限和 production image user 不一致。",
    choices: diagnose("runtime writable directory 權限和 production image user 不一致。", ["VPC 沒有 Internet Gateway。", "ECR repository 不存在。", "ALB idle timeout 太短。"]),
    fix: "在 Dockerfile/entrypoint 設定 storage、bootstrap/cache 權限，避免只靠本機 bind mount。",
    prevention: "Day 3 image smoke test 加入 writable directory 檢查。",
    examMapping: ["Docker image packaging", "DVA-C02 deployment troubleshooting"]
  },
  {
    title: "Docker Image: source missing",
    stageKey: "deployment",
    relatedDays: [3],
    skillArea: "Docker",
    symptom: "image build 成功，但 docker run php artisan 回傳 Could not open input file: artisan。",
    evidence: "Dockerfile 只安裝 extensions，沒有 COPY Laravel source；dev compose 靠 bind mount 才能跑。",
    correctDiagnosis: "production image 沒有打包 app source。",
    choices: diagnose("production image 沒有打包 app source。", ["ALB health check path 太嚴格。", "RDS snapshot restore 太慢。", "CloudFront origin 設錯。"]),
    fix: "改成 multi-stage production Dockerfile，COPY source、composer install --no-dev、php artisan optimize。",
    prevention: "Day 3 必須跑 docker run smoke test，不能只看 docker build passed。",
    examMapping: ["Docker image packaging", "ECS container image readiness"]
  },
  {
    title: "Docker Image: composer dependency missing",
    stageKey: "deployment",
    relatedDays: [3],
    skillArea: "Docker",
    symptom: "container 啟動後 PHP fatal error，找不到 vendor/autoload.php 或 package class。",
    evidence: "production build 沒有 composer install，或把 vendor 放在 .dockerignore。",
    correctDiagnosis: "production image 缺少 runtime dependencies。",
    choices: diagnose("production image 缺少 runtime dependencies。", ["Security Group 開太小。", "CloudFront invalidation 缺失。", "RDS public access 關閉。"]),
    fix: "在 build stage 執行 composer install --no-dev --optimize-autoloader，並確認 vendor 進入 runtime image。",
    prevention: "image inspect 與 smoke test 要檢查 composer dependencies。",
    examMapping: ["DVA-C02 deployment", "container artifact traceability"]
  },
  {
    title: "Docker Image: APP_KEY missing",
    stageKey: "advanced",
    relatedDays: [3, 11, 16],
    skillArea: "Security",
    symptom: "Laravel production container 回 500：No application encryption key has been specified。",
    evidence: "task definition environment 沒有 APP_KEY，或 secret reference ARN 錯誤。",
    correctDiagnosis: "APP_KEY 沒有透過 Secrets Manager/SSM 注入 runtime。",
    choices: diagnose("APP_KEY 沒有透過 Secrets Manager/SSM 注入 runtime。", ["ALB listener 沒支援 HTTP/2。", "CloudWatch dashboard 太少圖。", "S3 CORS 太寬。"]),
    fix: "把 APP_KEY 放 Secrets Manager/SSM，ECS task definition 使用 secrets reference。",
    prevention: "Day 11 secret/config classification 和 Day 16 secret exposure checklist 要納入 release gate。",
    examMapping: ["DVA-C02 Security", "Security Specialty intro"]
  },
  {
    title: "EC2: Security Group wrong",
    stageKey: "deployment",
    relatedDays: [4, 6],
    skillArea: "Networking",
    symptom: "EC2 上 docker compose ps 全部 Up，但外部 curl /health timeout。",
    evidence: "EC2 Security Group 未開 HTTP/HTTPS，或 app listen port 未映射到 host。",
    correctDiagnosis: "外部入口的 Security Group/host port/container port 沒有串通。",
    choices: diagnose("外部入口的 Security Group/host port/container port 沒有串通。", ["composer dependency missing。", "CloudFront cache stale。", "RDS migration rollback 失敗。"]),
    fix: "只開必要 HTTP/HTTPS 來源，確認 host port 到 container port mapping，SSH 限制可信來源。",
    prevention: "Day 4 runbook 必須保存 inbound rule checklist。",
    examMapping: ["SAA-C03 secure architectures", "CloudOps Engineer Associate (SOA-C03)"]
  },
  {
    title: "EC2: SSH key permission",
    stageKey: "deployment",
    relatedDays: [4],
    skillArea: "Security",
    symptom: "ssh ec2-user@ip 失敗，client 顯示 WARNING: UNPROTECTED PRIVATE KEY FILE。",
    evidence: "pem 權限太寬；或 Security Group 沒允許你的來源 IP 到 port 22。",
    correctDiagnosis: "SSH key file permission 或 SSH inbound source 不符合安全要求。",
    choices: diagnose("SSH key file permission 或 SSH inbound source 不符合安全要求。", ["ALB target unhealthy。", "S3 object key 沒 tenant scope。", "GitHub Actions OIDC 缺失。"]),
    fix: "chmod 400 key.pem，並限制 SSH inbound 到可信來源 IP。",
    prevention: "EC2 first deploy runbook 記錄 key 權限與 SG 臨時規則到期時間。",
    examMapping: ["Security least privilege", "EC2 operations"]
  },
  {
    title: "EC2: compose restart policy missing",
    stageKey: "deployment",
    relatedDays: [4],
    skillArea: "ECS",
    symptom: "EC2 reboot 後服務沒有恢復，public health 變成 connection refused。",
    evidence: "docker compose ps 沒有 containers；compose file 沒有 restart policy，Docker daemon 未 enable。",
    correctDiagnosis: "EC2 compose stack 缺少 restart strategy 和 daemon enablement。",
    choices: diagnose("EC2 compose stack 缺少 restart strategy 和 daemon enablement。", ["RDS public access 太嚴格。", "CloudFront OAC 缺失。", "tenant_id query 沒加 index。"]),
    fix: "設定 Docker daemon enable、compose restart policy，或進一步遷移到 ECS service desired count。",
    prevention: "Day 4 rollback/recovery note 要包含 reboot recovery。",
    examMapping: ["CloudOps operations", "EC2 first deploy"]
  },
  {
    title: "ECS: task cannot start",
    stageKey: "advanced",
    relatedDays: [7, 8, 11],
    skillArea: "ECS",
    symptom: "ECS service desiredCount=2，但 runningCount=0，task 一直 stopped。",
    evidence: "stopped reason 顯示 CannotPullContainerError 或 secret access denied。",
    correctDiagnosis: "task execution role 無法拉 ECR image 或讀取 secret。",
    choices: diagnose("task execution role 無法拉 ECR image 或讀取 secret。", ["CloudFront index.html cache 太久。", "NAT/RDS 成本太高。", "S3 URL TTL 太短。"]),
    fix: "檢查 execution role、ECR image URI、Secrets Manager/SSM ARN、subnet/NAT route。",
    prevention: "Day 8 task definition checklist 加入 image pull、secret reference、logs 權限檢查。",
    examMapping: ["SAA-C03", "DVA-C02", "CloudOps Engineer Associate (SOA-C03)"]
  },
  {
    title: "ECS: target unhealthy",
    stageKey: "advanced",
    relatedDays: [8, 9],
    skillArea: "Networking",
    symptom: "ECS task running，但 ALB target group 顯示 unhealthy，使用者看到 503。",
    evidence: "describe-target-health reason: Health checks failed with these codes: [500]。",
    correctDiagnosis: "health endpoint、container port、SG path 或 app readiness 不符合 target group 設定。",
    choices: diagnose("health endpoint、container port、SG path 或 app readiness 不符合 target group 設定。", ["ECR lifecycle policy 太短。", "Portfolio report 沒截圖。", "RPO 設太長。"]),
    fix: "修 /health、target group port/matcher、ALB SG -> app SG rule，並檢查 Laravel logs。",
    prevention: "Day 9 failure diagnosis matrix 必須列 502/503/unhealthy 對應檢查點。",
    examMapping: ["SAA-C03 resilient architectures", "CloudOps troubleshooting"]
  },
  {
    title: "ECS: log driver missing",
    stageKey: "advanced",
    relatedDays: [8, 15],
    skillArea: "Observability",
    symptom: "task 失敗後找不到 CloudWatch logs，只看到 stopped task。",
    evidence: "task definition 沒有 awslogs logConfiguration 或 log group 不存在。",
    correctDiagnosis: "task definition 缺少 log driver/log group mapping。",
    choices: diagnose("task definition 缺少 log driver/log group mapping。", ["ALB DNS 沒 CNAME。", "tenant_id scope 過寬。", "S3 bucket policy 太嚴格。"]),
    fix: "在 containerDefinition 加 awslogs driver、log group、region、stream prefix，並給 execution role logs 權限。",
    prevention: "Day 8/15 將 log group mapping 設為 deploy gate。",
    examMapping: ["CloudOps Engineer Associate (SOA-C03)", "Observability"]
  },
  {
    title: "RDS: public access enabled",
    stageKey: "deep-dive",
    relatedDays: [5, 6, 16],
    skillArea: "Security",
    symptom: "安全審查發現 RDS public accessible=true，SG 還開 0.0.0.0/0:5432。",
    evidence: "describe-db-instances 和 describe-security-groups 顯示資料庫暴露在 Internet。",
    correctDiagnosis: "資料層違反 private subnet 與 least privilege 原則。",
    choices: diagnose("資料層違反 private subnet 與 least privilege 原則。", ["CloudWatch alarm 太敏感。", "React env 沒有 API URL。", "GitHub Pages base path 錯。"]),
    fix: "關閉 public access，RDS 放 private subnet，只允許 app security group。",
    prevention: "Day 6 SG matrix 和 Day 16 security audit 必須阻擋 public DB。",
    examMapping: ["SAA-C03 secure architectures", "Security Specialty intro"]
  },
  {
    title: "RDS: SG not reachable",
    stageKey: "advanced",
    relatedDays: [5, 6, 18],
    skillArea: "Data",
    symptom: "ECS app log 顯示 DB connection timeout，但 RDS instance 狀態 available。",
    evidence: "RDS SG 沒有允許 app SG 到 5432；或 app task 在錯誤 subnet。",
    correctDiagnosis: "app-to-RDS security group/subnet path 不通。",
    choices: diagnose("app-to-RDS security group/subnet path 不通。", ["S3 signed URL 過期。", "WebSocket idle timeout。", "Release note 缺 approver。"]),
    fix: "允許 app SG 到 RDS SG 的 DB port，檢查 subnet route 和 DNS resolution。",
    prevention: "Day 6 network diagram 和 Day 5 extraction plan 要包含 connectivity test。",
    examMapping: ["Networking", "RDS operations"]
  },
  {
    title: "RDS: migration failed",
    stageKey: "deep-dive",
    relatedDays: [18, 24],
    skillArea: "Data",
    symptom: "deploy 後 Laravel API 500，worker 也開始失敗，migration log 顯示 column not found。",
    evidence: "新舊 task 並存期間 schema 不相容；沒有 expand-contract 或 rollback plan。",
    correctDiagnosis: "breaking migration 沒有經過 migration gate。",
    choices: diagnose("breaking migration 沒有經過 migration gate。", ["ALB health check 太寬鬆。", "ECR image digest 不存在。", "CloudFront OAC 關閉。"]),
    fix: "採用 expand-contract、restore snapshot 或 forward-fix，並檢查 affected queries。",
    prevention: "Day 18 migration runbook + Day 14 deployment gate 必須擋 destructive change。",
    examMapping: ["DevOps Pro prep", "Reliability pillar"]
  },
  {
    title: "S3: bucket public",
    stageKey: "deep-dive",
    relatedDays: [19],
    skillArea: "Security",
    symptom: "任何人拿到 object URL 都能下載使用者上傳檔案。",
    evidence: "get-public-access-block 未啟用；bucket policy status 顯示 public。",
    correctDiagnosis: "private uploads 被 public bucket policy 繞過 authorization。",
    choices: diagnose("private uploads 被 public bucket policy 繞過 authorization。", ["ALB target group 不健康。", "worker desired count 太低。", "RDS migration 太慢。"]),
    fix: "啟用 Block Public Access，改由 Laravel 驗證後簽 presigned URL。",
    prevention: "Day 19 bucket access checklist 必須檢查 public access、policy、CORS、TTL。",
    examMapping: ["Security / SAA", "S3 secure access"]
  },
  {
    title: "S3: CORS wrong",
    stageKey: "deep-dive",
    relatedDays: [12, 19],
    skillArea: "Data",
    symptom: "frontend 取得 presigned upload URL 後，browser preflight 被 S3 擋下。",
    evidence: "OPTIONS request 回 CORS error；bucket CORS 沒允許 CloudFront/frontend origin 或 PUT header。",
    correctDiagnosis: "S3 CORS rule 不符合前端 direct upload request。",
    choices: diagnose("S3 CORS rule 不符合前端 direct upload request。", ["APP_DEBUG=false。", "ECS task role 太小。", "RPO 太短。"]),
    fix: "設定必要 origin、method、headers，不使用 wildcard 放寬所有來源。",
    prevention: "Day 19 signed URL policy 加上 CORS regression test。",
    examMapping: ["S3 CORS", "frontend deployment"]
  },
  {
    title: "S3: signed URL expired",
    stageKey: "deep-dive",
    relatedDays: [19],
    skillArea: "Security",
    symptom: "使用者上傳大檔到一半收到 403 SignatureDoesNotMatch 或 ExpiredToken。",
    evidence: "presigned URL expires-in 太短，或 client clock/request method/header 和簽名不一致。",
    correctDiagnosis: "signed URL TTL 或簽名條件不符合實際 upload 行為。",
    choices: diagnose("signed URL TTL 或簽名條件不符合實際 upload 行為。", ["RDS SG public。", "ECS desired count 太高。", "CloudTrail 沒有 event。"]),
    fix: "依檔案大小調整 TTL，固定 method/content-type，失敗時重新請求 URL。",
    prevention: "Day 19 policy 要明確 TTL、content-type、size 和 retry flow。",
    examMapping: ["S3 presigned URL", "Security / SAA"]
  },
  {
    title: "CloudFront: cache stale",
    stageKey: "advanced",
    relatedDays: [12],
    skillArea: "CI/CD",
    symptom: "部署 React 新版後，使用者仍看到舊畫面或舊 JS bundle reference。",
    evidence: "CloudFront HIT 舊 index.html；asset hash 已變但 index.html cache policy 太長。",
    correctDiagnosis: "index.html cache policy/invalidation 沒處理。",
    choices: diagnose("index.html cache policy/invalidation 沒處理。", ["RDS snapshot restore 失敗。", "worker idempotency 缺失。", "tenant query scope 缺失。"]),
    fix: "dist sync 後 invalidation index.html 或 /*，asset 使用 hash 並調整 cache policy。",
    prevention: "Day 12 checklist 包含 cache invalidation evidence。",
    examMapping: ["SAA-C03 content delivery", "DVA-C02 deployment"]
  },
  {
    title: "CloudFront: API URL wrong",
    stageKey: "advanced",
    relatedDays: [12],
    skillArea: "Networking",
    symptom: "前端頁面可載入，但 API calls 打到 localhost 或 staging domain。",
    evidence: "browser network tab 顯示 VITE_API_URL 被 build 成錯誤 endpoint。",
    correctDiagnosis: "React public runtime config/API URL 在 build/deploy 階段錯誤。",
    choices: diagnose("React public runtime config/API URL 在 build/deploy 階段錯誤。", ["RDS migration rollback 不完整。", "CloudWatch alarm 沒 threshold。", "SSH key 權限太寬。"]),
    fix: "在 CI build 明確注入 production API URL，並把 frontend config 視為 public config。",
    prevention: "Day 12 API URL/CORS note 和 Day 13 pipeline env gate 必須檢查。",
    examMapping: ["Frontend deployment", "DVA-C02"]
  },
  {
    title: "CloudFront: invalidation missing",
    stageKey: "advanced",
    relatedDays: [12, 13],
    skillArea: "CI/CD",
    symptom: "GitHub Actions deploy 成功，但 CDN 還是回舊版 index。",
    evidence: "workflow 沒有 aws cloudfront create-invalidation step；CloudFront edge cache 未更新。",
    correctDiagnosis: "frontend pipeline 缺少 cache invalidation 或 cache policy 控制。",
    choices: diagnose("frontend pipeline 缺少 cache invalidation 或 cache policy 控制。", ["ECS task role 無法讀 secret。", "S3 bucket public。", "DB_HOST=localhost。"]),
    fix: "在 pipeline 加入 CloudFront invalidation，或設定 index.html 短 cache/版本策略。",
    prevention: "Day 13 workflow sketch 要包含 frontend deploy verification。",
    examMapping: ["CI/CD", "CloudFront operations"]
  },
  {
    title: "CI/CD: latest tag rollback",
    stageKey: "advanced",
    relatedDays: [7, 13, 14],
    skillArea: "CI/CD",
    symptom: "部署出錯後想 rollback，但 ECS task definition 只記錄 image:latest。",
    evidence: "ECR 有多個 image，但 latest 已被覆蓋，不知道前一版內容。",
    correctDiagnosis: "pipeline 沒有使用 immutable commit SHA image tag。",
    choices: diagnose("pipeline 沒有使用 immutable commit SHA image tag。", ["RDS SG 沒開。", "CloudFront origin path 錯。", "APP_DEBUG=false。"]),
    fix: "使用 commit SHA tag/digest render task definition，保存 previous task definition revision。",
    prevention: "Day 7 image tag policy 和 Day 13 deploy workflow 必須保存 rollback table。",
    examMapping: ["DVA-C02 deployment", "DevOps governance"]
  },
  {
    title: "CI/CD: OIDC/IAM permission",
    stageKey: "advanced",
    relatedDays: [11, 13, 26],
    skillArea: "Security",
    symptom: "GitHub Actions 在 configure-aws-credentials 失敗，或使用長期 AWS key 被審查退回。",
    evidence: "role trust policy 沒允許 repo/ref，或 repo secrets 放 long-lived key。",
    correctDiagnosis: "CI/CD AWS access 沒使用正確 OIDC trust/IAM least privilege。",
    choices: diagnose("CI/CD AWS access 沒使用正確 OIDC trust/IAM least privilege。", ["ALB health path 回 500。", "S3 URL TTL 太短。", "N+1 query 太多。"]),
    fix: "設定 GitHub OIDC provider、role trust condition、least privilege deploy policy。",
    prevention: "Day 13/26 將 OIDC 和 approval gate 放入 release governance。",
    examMapping: ["DVA-C02 Security", "Governance"]
  },
  {
    title: "Observability: logs missing",
    stageKey: "advanced",
    relatedDays: [8, 15],
    skillArea: "Observability",
    symptom: "production 500 發生，但 CloudWatch 找不到 web/worker logs。",
    evidence: "log group 不存在、retention 未設定、task definition 沒 awslogs。",
    correctDiagnosis: "observability baseline 沒有在 task definition 和 log group 建立。",
    choices: diagnose("observability baseline 沒有在 task definition 和 log group 建立。", ["S3 bucket public。", "Route table 沒 IGW。", "tenant selector 錯。"]),
    fix: "建立 web/worker/scheduler log group，設定 awslogs driver 和 retention。",
    prevention: "Day 15 post-deploy acceptance 必須檢查 logs 可用。",
    examMapping: ["CloudOps Engineer Associate (SOA-C03)", "Observability"]
  },
  {
    title: "Observability: alarm threshold wrong",
    stageKey: "deep-dive",
    relatedDays: [15, 22, 27],
    skillArea: "Observability",
    symptom: "使用者已大量回報 500，但 alarm 沒有觸發；或少量測試就一直 alarm。",
    evidence: "threshold 沒考慮 request volume、evaluation periods、ALB 5xx rate。",
    correctDiagnosis: "alarm 門檻沒有對齊實際 SLO/traffic pattern。",
    choices: diagnose("alarm 門檻沒有對齊實際 SLO/traffic pattern。", ["Dockerfile 沒 COPY source。", "SSH key 權限太寬。", "CloudFront API URL 錯。"]),
    fix: "用 rate/ratio、evaluation period、severity 分級調整 alarm，並連到 runbook。",
    prevention: "Day 15/27 設定 deployment acceptance thresholds 和 performance budget。",
    examMapping: ["CloudOps Engineer Associate (SOA-C03)", "Performance pillar"]
  },
  {
    title: "Observability: dashboard unavailable",
    stageKey: "deep-dive",
    relatedDays: [15, 28],
    skillArea: "Observability",
    symptom: "incident 發生時，團隊不知道看哪個 dashboard 或哪些 metric。",
    evidence: "dashboard 缺少 release version、traffic、error、latency、queue、database。",
    correctDiagnosis: "dashboard 沒有對齊 production readiness 和 incident triage。",
    choices: diagnose("dashboard 沒有對齊 production readiness 和 incident triage。", ["S3 CORS 太窄。", "ECR latest tag 太舊。", "DB_HOST=service name。"]),
    fix: "建立 post-deploy dashboard，涵蓋 ALB/ECS/RDS/queue/logs/release version。",
    prevention: "Day 28 architecture review 要把 observability evidence 列入風險表。",
    examMapping: ["Well-Architected operations pillar", "CloudOps"]
  },
  {
    title: "DR: snapshot restore not verified",
    stageKey: "deep-dive",
    relatedDays: [24],
    skillArea: "Cost/DR",
    symptom: "RDS 有自動備份，但事故時 restore 後 app 無法連線，DNS/env 切換也沒文件。",
    evidence: "沒有 restore drill、沒有 validation checklist、restore instance endpoint 沒接到 app config。",
    correctDiagnosis: "只有 backup，沒有被驗證過的 restore runbook。",
    choices: diagnose("只有 backup，沒有被驗證過的 restore runbook。", ["ALB target group matcher 太寬。", "React env 是 public config。", "worker scaling 太慢。"]),
    fix: "演練 restore-db-instance-from-db-snapshot，驗證資料、切換 endpoint、記錄 RTO。",
    prevention: "Day 24 DR drill evidence plan 必須定期執行。",
    examMapping: ["Reliability pillar", "DR runbook"]
  },
  {
    title: "DR: RTO/RPO unrealistic",
    stageKey: "deep-dive",
    relatedDays: [23, 24, 30],
    skillArea: "Cost/DR",
    symptom: "主管要求 5 分鐘 RTO/RPO，但目前只有每日 snapshot 和手動 restore。",
    evidence: "backup frequency、restore time、DNS propagation、app validation 都無法滿足 5 分鐘。",
    correctDiagnosis: "RTO/RPO 目標和目前架構/成本不匹配。",
    choices: diagnose("RTO/RPO 目標和目前架構/成本不匹配。", ["APP_KEY 沒有注入。", "CloudFront invalidation 太慢。", "Docker port collision。"]),
    fix: "重新定義 business RTO/RPO，或投資更高等級 DR 架構與成本。",
    prevention: "Day 23 cost review 和 Day 24 DR table 要一起答辯 trade-off。",
    examMapping: ["Reliability pillar", "Cost optimization", "Capstone defense"]
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
