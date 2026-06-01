# Curriculum Intensity Spec

這份規格定義 `AWS Docker Compose 30-Day Lab` 的課程強度。核心調整是：30 天不是每天平均鋪陳，而是用三段式強度推進，讓學員一開始就能部署，後面逐步進入 production-grade 思維。

## Stage Model

| Days | Stage | Goal | Daily Time |
|---|---|---|---|
| Day 1-5 | Deployment / 部署落地 | 先把 Docker Compose 專案放上雲端，建立可驗證 deployment artifact | 35-55 min |
| Day 6-15 | Advanced / 進階 production 化 | 把可跑的系統改成可維護、可擴展、可 rollback 的 production architecture | 45-75 min |
| Day 16-30 | Deep Dive / 深入架構與營運 | 深入安全、租戶、資料、效能、成本、DR、IaC、release governance | 60-90 min |

## Daily Content Contract

每一天至少要有以下內容，避免只有簡短文章：

1. `Concept / 概念`：中文說明 + English technical terms。
2. `Hands-on Lab / 實作任務`：可操作，不只是閱讀。
3. `Command Block / 指令區塊`：至少一組可執行或可替換變數的指令。
4. `Document Spec / 文件規格`：當天要產出的文件或架構規格。
5. `Interface Guide / 介面介紹`：學習平台或後台應如何呈現該主題。
6. `Learning Steps / 實作流程`：至少 5 個步驟。
7. `Acceptance Criteria / 驗收標準`：明確判斷完成與否。
8. `Pitfall / 踩雷點`：至少一個工程師常犯錯誤。
9. `Expected Outcome / 預期輸出`：可放進 final deployment portfolio。

## Stage 1: Day 1-5 Deployment

重點不是先教完整 AWS，而是讓學員知道「部署到底需要哪些可驗證的東西」。

- Day 1：Deployment Inventory from Zero
- Day 2：Local Production-like Run
- Day 3：Production Docker Image
- Day 4：EC2 First Deploy
- Day 5：Extract RDS, S3, Redis

每一天都必須產出一份 artifact，例如 service mapping、readiness checklist、Dockerfile checklist、runbook、stateful service extraction plan。

## Stage 2: Day 6-15 Advanced

進階階段處理 production-grade 的核心結構。

- VPC and Subnet Design
- ECR and Image Tagging
- ECS Fargate Web Service
- ALB Health Check
- Queue Worker and Scheduler
- Secrets Manager and SSM
- CloudFront React Frontend
- CI/CD with GitHub Actions
- Zero Downtime Deployment
- Observability Baseline

這一段的重點是把「可跑」變成「可維護」。

## Stage 3: Day 16-30 Deep Dive

深入階段要求學員能對架構負責，而不是只會照指令操作。

- Production Security Hardening
- Multi-tenant Architecture
- RDS Migration Strategy
- S3 Upload and Signed URL
- WebSocket / Reverb on AWS
- High-concurrency Ticket Booking
- Autoscaling and Capacity
- Cost Optimization
- Disaster Recovery Runbook
- Infrastructure as Code Overview
- Release Governance
- Performance Review
- Final Architecture Review
- Portfolio Deployment Report
- Capstone Defense

這一段的重點是能對安全、成本、可靠性、效能與營運說出取捨。

