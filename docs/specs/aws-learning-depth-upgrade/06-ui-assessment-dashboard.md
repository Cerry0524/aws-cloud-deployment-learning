# Stage 06: UI Assessment Dashboard

## 目標

把 UI 從課程閱讀器升級成能力養成儀表板，讓學員知道自己目前達到哪個 AWS learning level。

## 新增 UI 區塊

| UI 區塊 | 位置 | 功能 |
|---|---|---|
| Stage Assessment Summary | Learning Progress 頂部 | 顯示三階段分數、等級、完成度、evidence 缺口 |
| Daily Evidence Heatmap | Learning Progress 中段 | 顯示 Day 1-30 哪些 day 缺 implementation/verification/troubleshooting |
| Skill Radar | Learning Progress 或 Assessment 頁 | 顯示 Docker、ECS、VPC、RDS/S3/Redis、CI/CD、Observability、Security、Cost/DR |
| Exam Mapping | Learning Progress 底部 | 顯示課程能力對應 CloudOps / SAA / DVA / DevOps Pro |
| Lesson Readiness Estimate | Lesson Deliverables tab | 顯示當日能力預估與缺少 evidence |
| Capstone Defense Panel | Day 30 | 整理 final report、diagram、Q&A、rubric |

## 顯示邏輯

- Sidebar 進入 lesson 後仍保持 `30天路線圖` focus。
- Lesson 頁面仍使用上下閱讀主線。
- 大量資訊放入 tabs、accordion、summary cards，避免整頁過長。
- 右側 mentor rail 只放當前提示，不承載主要內容。
- 圖表必須跟 day topic 對應，不可重複顯示 Day 1 inventory 圖。

## Skill Radar 維度

| 維度 | 來源 |
|---|---|
| Docker / Image Packaging | Day 1-3 |
| AWS Compute: EC2/ECS | Day 4, Day 8, Day 10 |
| Networking / ALB / Security Group | Day 6, Day 9, Day 16 |
| Data Layer: RDS/S3/Redis | Day 5, Day 18, Day 19 |
| CI/CD & Rollback | Day 7, Day 13, Day 14 |
| Observability | Day 15 |
| Security & Governance | Day 11, Day 16, Day 26 |
| Cost / DR / Architecture Defense | Day 23, Day 24, Day 28-30 |

## 最小改動路線

1. 先在 `ProgressView` 加 Stage Assessment Summary。
2. 使用現有 `completedDays`、`mentor.completedStepsByLesson`、`mentor.outputChecklistByLesson`、`quizScores` 推估 readiness。
3. 在 `LessonView` 的 deliverables tab 加 Readiness Estimate。
4. 不新增 route，不改登入架構。

## 完整產品路線

1. 新增 sidebar item：`Assessment`。
2. 新增 Lesson tab：`Assessment`。
3. 新增 rubric input。
4. Admin Dashboard 顯示 tenant/member readiness breakdown。
5. Quiz Attempts 改成可追蹤 day/stage。

## 驗收標準

- 學員能一眼看到目前是 L1/L2/L3/L4/L5。
- 學員能知道下一步該補哪個 evidence。
- Progress 不再只有 completed days 與 average score。
- UI 不被大量文字淹沒。

