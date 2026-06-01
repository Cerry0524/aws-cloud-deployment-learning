# AWS Learning Depth Upgrade Master Spec

## 背景

目前 `AWS Docker Compose 30-Day Lab` 已有 React/Vite 前端、30 天課程、互動導師、roadmap、progress、quiz 與 GitHub Pages 發佈。但課程內容仍有三個核心問題：

1. Day 2-30 有不少內容由共用模板產生，逐日專屬操作深度不足。
2. 部分 command 過於泛用，例如 fallback 到 `aws sts get-caller-identity`，無法支撐 VPC、RDS migration、autoscaling、DR、IaC 等主題。
3. 完成狀態與能力等級混在一起，學員知道自己完成了哪一天，卻不知道自己是否具備 AWS deployment 能力。

## 目標

把課程升級成「Docker Compose 到 AWS production deployment」實作訓練系統，讓全端工程師能從本機 compose 經驗逐步養成 AWS deployment、CloudOps、Solutions Architecture、DevOps readiness。

## 非目標

- 不把課程改成正式 AWS 題庫。
- 不使用 exam dump 或非官方題庫。
- 不追求一次完成真實 AWS 帳號部署自動化，先把課程邏輯、UI、rubric、lab artifact 做扎實。
- 不把 Cloud Practitioner 當最終目標，Cloud Practitioner 只作為基礎映射。

## AWS 認證映射

| 課程等級 | AWS 認證階級 | 學員能力 |
|---|---|---|
| L0 入門前 | Pre-Foundational | 能讀懂 Docker Compose service、network、volume，分辨 stateful/stateless |
| L1 Cloud 基礎 | Foundational | 能把 Compose 元件對應到 ECS、RDS、S3、CloudWatch 等 AWS 服務 |
| L2 部署實作者 | Associate 入門 | 能 build image、push ECR、完成 EC2/ECS first deploy、用 log/health check 驗證 |
| L3 可上線能力 | Associate | 能設計 VPC、ALB、ECS、RDS、S3、Secrets、CI/CD、Observability |
| L4 Professional 準備 | Professional prep | 能處理 rollback、zero downtime、migration、incident、DR、IaC、release governance |
| L5 專業答辯 | Professional + Specialty intro | 能做 architecture defense，說明安全、成本、可靠性、效能、替代方案與 trade-off |

官方對照來源：

- AWS Certification Exam Guides: https://docs.aws.amazon.com/aws-certification/latest/examguides/aws-certification-exam-guides.html
- AWS Certified Solutions Architect - Associate: https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html
- AWS Certified Developer - Associate: https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html
- AWS Certified CloudOps Engineer - Associate: https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html
- AWS Certified DevOps Engineer - Professional: https://docs.aws.amazon.com/aws-certification/latest/devops-engineer-professional-02/devops-engineer-professional-02.html

## 內容成功標準

每一天課程必須符合以下 contract：

| 區塊 | 成功標準 |
|---|---|
| Scenario | 有明確工程情境，說明今天為什麼存在 |
| Visual | 有對應當天主題的 diagram，不重複使用不合情境的圖 |
| Lab | 有可操作任務，不只是閱讀 |
| Commands | 有當天主題專屬 command 或 pseudo-command |
| Verification | 有驗證方式，例如 curl、AWS CLI、CloudWatch log、health check、diagram review |
| Pitfall | 有至少 3 個常見錯誤、偵測方式、修復方式 |
| Artifact | 有可保存交付物，例如 runbook、mapping table、config checklist、rollback note |
| Assessment | 能映射到 Concept、Implementation、Verification、Troubleshooting、Communication 五維評分 |

## 階段成功標準

| 階段 | 範圍 | 成功標準 |
|---|---|---|
| Stage 1 | Day 1-5 | 學員能從 Docker Compose 盤點到 first AWS deploy runbook |
| Stage 2 | Day 6-15 | 學員能設計 production-like AWS deployment boundary |
| Stage 3 | Day 16-30 | 學員能做 production architecture review 與 capstone defense |

## 執行順序

1. 建立 assessment foundation，讓能力等級先落地。
2. 強化 Day 2-5，因為這是從本機到 first deploy 的地基。
3. 強化 Day 6-15，對齊 Associate 能力。
4. 強化 Day 16-30，對齊 Professional prep。
5. 擴充 interactive labs 與 quiz。
6. 優化 UI assessment dashboard。
7. build、瀏覽器驗證、發佈 GitHub Pages。

