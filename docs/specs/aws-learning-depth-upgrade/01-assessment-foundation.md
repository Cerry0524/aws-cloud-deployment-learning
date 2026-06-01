# Stage 01: Assessment Foundation

## 目標

建立能力評估基礎，讓課程從「完成第幾天」升級成「具備哪個 AWS deployment 能力等級」。

## 要解決的問題

目前 `completedDays` 只能表示完成狀態，不代表學員能否解釋、實作、驗證、排錯、答辯。這會讓課程看起來完整，但無法判斷是否真的達到 Associate 或 Professional prep。

## 評分模型

每日分數使用五維 rubric：

| 維度 | 權重 | 通過標準 |
|---|---:|---|
| Concept | 20% | 能說明今天主題解決哪個 production deployment 問題 |
| Implementation | 25% | 有 config、diagram、command、runbook 或 lab artifact |
| Verification | 25% | 有 health check、CLI output、log、screenshot 或驗證描述 |
| Troubleshooting | 15% | 有常見錯誤、偵測方式、修復方式、rollback/recovery |
| Communication | 15% | 能用架構審查或面試語言說明取捨 |

每日能力等級：

| 分數 | 等級 | 說明 |
|---:|---|---|
| 0-39 | Not Started | 無有效 evidence |
| 40-59 | Aware | 看懂概念但證據不足 |
| 60-74 | Practiced | 有實作，但驗證或說明不足 |
| 75-89 | Production Ready | 能交付、驗證、回滾 |
| 90-100 | Defense Ready | 能答辯、排錯、說明 trade-off |

## 資料模型規格

建議新增型別：

```ts
type AssessmentLevel =
  | "not-started"
  | "aware"
  | "practiced"
  | "production-ready"
  | "defense-ready";

type RubricScore = 0 | 1 | 2 | 3 | 4;

type LessonAssessment = {
  day: number;
  concept: RubricScore;
  implementation: RubricScore;
  verification: RubricScore;
  troubleshooting: RubricScore;
  communication: RubricScore;
  evidenceNotes: string;
  artifactRefs: string[];
  reviewedAt?: string;
  reviewer?: "self" | "mentor" | "admin";
};

type StageAssessment = {
  stageKey: string;
  capstoneScore?: number;
  capstoneNotes?: string;
  levelOverride?: AssessmentLevel;
};
```

建議擴充 `ProgressState`：

```ts
type ProgressState = {
  completedDays: number[];
  currentDay: number;
  quizScores: number[];
  onboardingDone: string[];
  mentor: MentorProgress;
  assessmentsByDay: Record<number, LessonAssessment>;
  stageAssessments: Record<string, StageAssessment>;
};
```

## UI 規格

先以最小改動實作：

- 在 `Learning Progress` 內新增 `Stage Assessment Summary`。
- 在 lesson 的 `Deliverables` tab 補 `Readiness Estimate`。
- 暫時根據現有資料推估分數：
  - completed day
  - completed mentor steps
  - completed output checklist
  - quiz average

完整產品版再新增：

- 獨立 sidebar item：`Assessment`
- Lesson tab：`評估 / Assessment`
- 每日 rubric input
- Admin readiness breakdown

## 驗收標準

- 學員能看到三階段能力等級。
- 每日完成不再等於能力通過。
- 能明確看出缺少 implementation、verification 或 troubleshooting evidence。
- UI 能說明此課程對應 Foundational、Associate、Professional prep 的位置。

