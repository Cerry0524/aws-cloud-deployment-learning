# Stage 03: Day 6-15 Associate Labs

## 目標

把 Day 6-15 對齊 AWS Associate 能力，特別是 Solutions Architect Associate、Developer Associate、CloudOps Engineer Associate 的交集。

## 階段能力

完成本階段後，學員應能：

- 設計 VPC、subnet、security group、ALB、ECS、RDS、S3、CloudFront 的邊界。
- 把 web、worker、scheduler、migration 拆成不同 runtime。
- 建立 Secrets Manager / SSM 使用規則。
- 建立 GitHub Actions -> ECR -> ECS 的 deployment path。
- 用 CloudWatch logs、metrics、alarms 驗證 production readiness。

## Day 6-15 規格表

| Day | 主題 | 必備 lab artifact | AWS 認證對應 |
|---:|---|---|---|
| 6 | VPC and Subnet Design | public/private subnet diagram、route table note、SG matrix | SAA / CloudOps |
| 7 | ECR and Image Tagging | ECR repository plan、commit SHA tag policy、rollback tag table | DVA / CloudOps |
| 8 | ECS Fargate Web Service | task definition sketch、service boundary、log group mapping | SAA / CloudOps |
| 9 | ALB Health Check | target group health check table、failure diagnosis matrix | SAA / CloudOps |
| 10 | Queue Worker and Scheduler | web/worker/scheduler split diagram、restart strategy | DVA / CloudOps |
| 11 | Secrets Manager and SSM | secret/config classification、task definition secrets mapping | DVA / Security intro |
| 12 | CloudFront React Frontend | S3/CloudFront/API URL/cache invalidation checklist | SAA / DVA |
| 13 | CI/CD with GitHub Actions | workflow sketch、ECR push、ECS deploy、migration gate | DVA / DevOps intro |
| 14 | Zero Downtime Deployment | rolling update decision table、migration order、rollback path | CloudOps / DevOps intro |
| 15 | Observability Baseline | log group、metric、alarm、dashboard checklist | CloudOps |

## 每日 Lab 結構

每一天必須包含：

```text
情境
-> 今日 AWS 架構圖
-> 設定表
-> 操作命令或 pseudo-command
-> 驗證方法
-> 故障案例
-> rollback/recovery
-> artifact
```

## Day 8 ECS Fargate 範例規格

Scenario：

EC2 compose 已能跑，但主機維運成本高。今天要把 Laravel web runtime 轉成 ECS Fargate service。

Commands：

```bash
aws ecs describe-clusters
aws ecs register-task-definition --cli-input-json file://task-definition.json
aws ecs create-service --cluster ticketfactory --service-name web --task-definition ticketfactory-web
aws logs tail /ecs/ticketfactory-web --follow
```

Artifact：

- task definition checklist
- ECS service boundary diagram
- log group mapping
- rollback task definition revision note

## Day 13 CI/CD 範例規格

Scenario：

手動部署無法長期維運。今天要把 build、test、push ECR、render task definition、deploy ECS 串成 GitHub Actions pipeline。

Commands / workflow concepts：

```yaml
- uses: aws-actions/configure-aws-credentials@v4
- uses: aws-actions/amazon-ecr-login@v2
- uses: aws-actions/amazon-ecs-render-task-definition@v1
- uses: aws-actions/amazon-ecs-deploy-task-definition@v2
```

Artifact：

- deployment workflow diagram
- environment promotion checklist
- migration gate rule
- rollback command note

## 驗收標準

- Day 6-15 不再只有 generic `aws sts get-caller-identity`。
- 每一天能對應至少一個 AWS Associate exam domain。
- 完成本階段後，學員能產出一份 production-like AWS architecture draft。

