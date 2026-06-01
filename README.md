# AWS Docker Compose 30-Day Lab

一個給全端工程師的 30 天教學網站：從既有 `Docker Compose` 專案出發，逐步部署到 `Amazon Web Services`。

案例專案：`~/SideProject/TicketFactory/`

## Features

- `Register / 新會員註冊`
- `Login / Logout / 登入登出`
- `Tenant Workspace / 多租戶工作區`
- `Teaching Mode / 教學模式`
- `Scenario Input / 情境輸入`
- `Interactive Mode / 互動模式`
- `Quiz Mode / 測驗模式`
- `Learning Progress / 學習歷程`
- `Admin Login / 後台登入`
- `Admin Dashboard / 數據儀表板`
- `Member Management / 會員管理`

## Local Development

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:4321
```

## Docker Compose

Recommended compatible flow for this machine:

```bash
docker build -t aws-docker-compose-learning-platform:local .
docker-compose up
```

If your Docker Compose build integration is available:

```bash
docker-compose up --build
```

If your Docker installation supports the Compose plugin, this also works:

```bash
docker compose up --build
```

The app uses port `4321` to avoid common conflicts with TicketFactory:

- `8080`
- `8443`
- `5432`
- `6379`
- `5173`
- `5174`
- `80`
- `443`

## Admin Demo Account

```text
email: admin@example.com
password: password123
```

## Student Demo Account

```text
email: john@example.com
password: password123
```

## Learning Flow

1. Register a new member and create a new tenant workspace.
2. Use `從0開始 / Start from Zero` to complete the first five setup steps:
   - Project Audit
   - Local Run
   - Production Image
   - AWS Target Architecture
   - First Deploy
3. Continue into the 30-day roadmap.
4. Mark lessons complete and review `Learning Progress`.
5. Open `Quiz Mode` and submit answers.
6. Switch tenants from the sidebar to see tenant-scoped progress.
7. Open `Admin` to view tenant management and member management.

## Curriculum Intensity

The 30-day course is split by depth:

- `Day 1-5 Deployment / 部署落地`: 35-55 minutes per day, focused on shipping a working cloud deployment artifact.
- `Day 6-15 Advanced / 進階`: 45-75 minutes per day, focused on ECS, RDS, S3, CI/CD, observability, and productionization.
- `Day 16-30 Deep Dive / 深入`: 60-90 minutes per day, focused on security, multi-tenancy, migrations, performance, cost, DR, IaC, and final architecture defense.

Every lesson includes:

- `Document Spec / 文件規格`
- `Interface Guide / 介面介紹`
- `Learning Steps / 20+ 分鐘實作流程`
- `Acceptance Criteria / 驗收標準`
- `Current AWS References / 當前 AWS 版本與來源提醒`

See:

- [Curriculum Intensity Spec](docs/curriculum-intensity-spec.md)
- [AWS Current Reference Notes](docs/aws-current-reference-notes.md)

## Build

```bash
npm run build
```
