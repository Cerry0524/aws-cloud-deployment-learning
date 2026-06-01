# AWS Current Reference Notes

Last checked: 2026-06-01

這份文件記錄課程內容需要對齊的官方 / community / GitHub 參考來源。課程內容以 official AWS docs 為準，community 與 fan-style resources 只用來設計 troubleshooting scenario，不作為權威版本來源。

## Official AWS Sources

| Area | Current Note | Source |
|---|---|---|
| ECS Fargate platform | 官方文件顯示 Linux `LATEST` platform version 是 `1.4.0`。課程應提醒 redeploy 才能取得最新 revision。 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform-fargate.html |
| Fargate changelog | `1.4.0` 支援 Secrets Manager JSON key/version injection、environmentFiles、EFS、ECS Exec 等重要能力。 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform-versions-changelog.html |
| ECS health checks | ALB target group health check 設定會影響 ECS deployment speed 與 task 是否被視為 healthy。 | https://docs.aws.amazon.com/AmazonECS/latest/developerguide/load-balancer-healthcheck.html |
| ECS secrets | Task definition 可用 `secrets` / `ValueFrom` 從 Secrets Manager 或 SSM Parameter Store 注入敏感值。 | https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ecs-taskdefinition-secret.html |
| S3 presigned URL | Presigned URL 提供 time-limited upload/download，不需要讓使用者持有 AWS credential。 | https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html |
| AWS Well-Architected | 深入階段應對齊 security、reliability、performance、cost optimization、operational excellence。 | https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html |

## Chinese / Taiwan References

| Area | Use |
|---|---|
| AWS Fargate Taiwan page: https://aws.amazon.com/tw/fargate/ | 中文術語與高層概念，讓學員能用中文理解 Fargate positioning。 |
| Amazon ECS Getting Started Taiwan page: https://aws.amazon.com/tw/ecs/getting-started/ | 學習路徑參考，但具體指令仍以 developer guide 為準。 |
| AWS Config ECS Fargate latest platform version zh-TW: https://docs.aws.amazon.com/zh_tw/config/latest/developerguide/ecs-fargate-latest-platform-version.html | 用來說明可以用 AWS Config 檢查 Fargate platform version compliance。 |

## GitHub / Community Sources

| Area | Use |
|---|---|
| AWS ECS deploy task definition GitHub Action: https://github.com/aws-actions/amazon-ecs-deploy-task-definition | CI/CD 課程應使用 AWS-maintained GitHub Action，並示範 task definition as code。 |
| AWS Containers Roadmap: https://github.com/aws/containers-roadmap | 用來提醒學員追蹤 ECS/ECR/Fargate/EKS roadmap，不把過時 blog 當成最新事實。 |
| AWS re:Post ECS / ALB health check cases | 可作為 troubleshooting scenario，但答案必須回到 official docs 與實測驗證。 |

## Course Rules

1. `Day 1-5 Deployment` 可以快速上線，但每一天都要留下 artifact。
2. `Day 6-15 Advanced` 必須對齊 ECS / RDS / S3 / CloudWatch / GitHub Actions 的官方做法。
3. `Day 16-30 Deep Dive` 必須用 Well-Architected 角度檢查安全、可靠性、成本、效能與營運。
4. 不教過時 ECS CLI v1 workflow 作為主線。
5. 不把 `latest` image tag 當 production 主線，建議使用 commit SHA。
6. 不把 secret 寫入 image、repo、或 frontend build artifact。
7. Community/fan-style content 僅可當「常見踩雷案例」，不可取代官方文件。

