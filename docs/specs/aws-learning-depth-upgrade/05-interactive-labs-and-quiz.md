# Stage 05: Interactive Labs and Quiz Expansion

## 目標

把互動模式與測驗模式從展示型內容升級成真正能檢查理解的練習系統。

## 目前問題

- Interactive Lab 題數太少，且偏 hint/diagnosis/solution 展示。
- Quiz 只有少數題目，無法覆蓋 30 天課程。
- Quiz 沒有 day/stage mapping，無法知道弱點在哪個階段。
- 錯題解析沒有連回 lesson、artifact、pitfall。

## Interactive Lab 規格

每個故障情境要包含：

| 欄位 | 說明 |
|---|---|
| title | 故障標題 |
| stageKey | 對應 deployment / advanced / deep-dive |
| relatedDays | 對應 day list |
| symptom | 使用者看到的症狀 |
| evidence | log、status、CLI output、UI screenshot 描述 |
| choices | 可選診斷步驟 |
| correctDiagnosis | 正確原因 |
| fix | 修復方式 |
| prevention | 如何避免再發 |
| examMapping | 對應 AWS exam domain |

## 必備故障題庫

| 類型 | 情境 |
|---|---|
| Local Compose | port collision、container env 使用 localhost、volume permission |
| Docker Image | image 沒有 source、composer dependency 錯、APP_KEY 缺失 |
| EC2 | security group 開錯、SSH key 權限、compose restart policy |
| ECS | task 無法啟動、target unhealthy、log driver 缺失 |
| RDS | public access、SG 不通、migration 失敗 |
| S3 | bucket public、CORS 錯、signed URL 過期 |
| CloudFront | cache stale、API URL 錯、invalidation 缺失 |
| CI/CD | latest tag rollback 困難、OIDC/IAM permission 錯 |
| Observability | logs 找不到、alarm 門檻錯、dashboard 不可用 |
| DR | snapshot restore 沒驗證、RTO/RPO 不合理 |

## Quiz 規格

每日：

- 每天至少 3 題 quick check。
- 題型以情境判斷為主，不是背服務名稱。

階段：

- Day 1-5 stage exam：10 題。
- Day 6-15 stage exam：15 題。
- Day 16-30 stage exam：20 題。

資料模型建議：

```ts
type QuizQuestion = {
  id: string;
  day?: number;
  stageKey?: string;
  prompt: string;
  promptEn?: string;
  options: string[];
  answer: string;
  explanation: string;
  examMapping?: string[];
  remediationLessonDays?: number[];
};

type QuizAttempt = {
  id: string;
  score: number;
  day?: number;
  stageKey?: string;
  submittedAt: string;
  wrongQuestionIds: string[];
};
```

## 驗收標準

- Quiz 能告訴學員弱點在 Docker、ECS、Networking、Data、CI/CD、Observability、Security 哪一塊。
- Interactive Lab 讓學員做診斷選擇，不只是看答案。
- 錯題能連回 lesson day 與 pitfall。

