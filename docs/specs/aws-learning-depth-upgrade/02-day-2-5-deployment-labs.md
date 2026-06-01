# Stage 02: Day 2-5 Deployment Labs

## 目標

把 Day 2-5 從引導式文字升級成真正可操作的 deployment labs，建立 Day 6-15 的地基。

## 範圍

| Day | 主題 | 強化目標 |
|---:|---|---|
| 2 | Local Production-like Run | 本機 production-like compose、port override、env 檢查、health endpoint |
| 3 | Production Docker Image | Laravel/React production image packaging、build artifact、image smoke test |
| 4 | EC2 First Deploy | EC2 + Docker Compose first deploy、security group、SSH、rollback |
| 5 | Extract RDS, S3, Redis | stateful service extraction plan、RDS/S3/Redis mapping、migration risk |

## Day 2 規格

Scenario：

你已經盤點完 Docker Compose，但本機 dev compose 不能代表 production。今天要讓專案用 production-like settings 啟動，確認 port、env、health check、logs 都可驗證。

必備內容：

- Diagram：Dev compose -> Production-like compose 的差異圖。
- Commands：

```bash
docker compose config
docker compose --env-file .env.production.local up -d
docker compose ps
curl -I http://localhost:18080/health
docker compose logs --tail=80 api
```

- Pitfalls：
  - port collision
  - `.env` 使用 localhost 造成 container 內連線錯誤
  - health endpoint 不存在
  - React build API URL 還指向 dev server

Artifact：

- local readiness checklist
- port mapping table
- health check result
- log inspection note

## Day 3 規格

Scenario：

Dev bind mount 不能直接上 production。今天要把 Laravel source、composer dependencies、React dist、entrypoint、storage permission 做成可部署 image。

必備內容：

- Diagram：Dev bind mount -> immutable production image。
- Commands：

```bash
docker build -t ticketfactory-api:$(git rev-parse --short HEAD) .
docker run --rm ticketfactory-api:$(git rev-parse --short HEAD) php artisan --version
docker image inspect ticketfactory-api:$(git rev-parse --short HEAD)
```

- Pitfalls：
  - image 裡沒有 app source
  - composer install 用 dev dependencies
  - Laravel storage/cache permission 錯
  - image tag 使用 latest 導致 rollback 困難

Artifact：

- production Dockerfile checklist
- image tag policy
- smoke test command output
- rollback image note

## Day 4 規格

Scenario：

今天不是最終 ECS 架構，而是用 EC2 + Docker Compose 完成第一版可理解的 cloud deploy，讓學員先理解 server、firewall、SSH、Docker runtime、domain、SSL 的關係。

必備內容：

- Diagram：Browser -> Security Group -> EC2 -> Docker Compose services。
- Commands：

```bash
ssh ec2-user@<ec2-public-ip>
sudo yum update -y
docker --version
docker compose version
docker compose up -d
docker compose ps
curl -I http://<ec2-public-ip>/health
```

- Pitfalls：
  - Security Group inbound 開太大
  - 只開 EC2 port，container port 沒 expose
  - EC2 disk 存放 uploads/database，未設 backup
  - 沒有 rollback compose file 或 image tag

Artifact：

- EC2 first deploy runbook
- inbound rule checklist
- deployment verification note
- rollback steps

## Day 5 規格

Scenario：

EC2 first deploy 可以跑，但資料層不能長期放在同一台主機。今天要把 RDS、S3、Redis 抽離成 AWS managed service plan。

必備內容：

- Diagram：EC2 compose stateful services -> RDS/S3/ElastiCache。
- Commands：

```bash
aws rds describe-db-instances
aws s3 ls
aws elasticache describe-cache-clusters
redis-cli -h <redis-endpoint> ping
```

- Pitfalls：
  - RDS public access
  - S3 bucket 為了顯示圖片直接 public
  - Redis 沒有 subnet/security group 邊界
  - migration 沒有 backup/restore plan

Artifact：

- stateful extraction plan
- RDS/S3/Redis responsibility table
- security boundary note
- migration rollback note

## 驗收標準

- Day 2-5 每一天都有專屬 diagram、commands、pitfalls、artifact。
- Day 4 不再顯示 Day 1 的 Docker Compose 專案盤點圖作為主圖。
- 學員完成 Day 5 後能說明「可跑」和「可維護」的差異。

