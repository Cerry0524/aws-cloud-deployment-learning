# 互動式導師使用說明

`Cloud Mentor` 是課程引導介面，不是 AI chatbot。

## 目的

`Cloud Mentor` 的目的是讓學生在 30 天 AWS Docker Compose 課程中，知道每天的情境、目前要做的第一步，以及完成每個 lesson 時應該留下哪些可驗證成果。

它會：

- 幫學生理解每天的學習情境。
- 告訴學生現在第一步要做什麼。
- 提供預設常見問題。
- 引導學生完成 step-by-step 任務。
- 記住每個 tenant 的導師步驟進度。

## 使用方式

1. 登入後進入任一 lesson。
2. 點右下角 `Cloud Mentor`。
3. 按照「現在請做」完成目前步驟。
4. 使用「我完成這一步」記錄 mentor step。
5. 使用「下一步」繼續。
6. 卡住時點預設問題。

## Day 1 學習主線

Day 1 的重點不是部署，而是產出 `Deployment Inventory`。

你需要找出：

- services
- ports
- volumes
- environment variables
- AWS service mapping

這份 inventory 會在後續 EC2、ECS、RDS、S3、Secrets Manager 設計中重複使用。

## 非 AI 設計

第一版不接 LLM、不做自由問答、不需要後端 API。

所有回答來自 `mentorScript.quickQuestions`，所有步驟來自 `mentorScript.guidedSteps`。學生看到的是 deterministic UI 與課程內容系統，不是即時生成的 AI chatbot。
