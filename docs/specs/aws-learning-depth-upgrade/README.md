# AWS Learning Depth Upgrade Spec Index

本目錄是 `AWS Docker Compose 30-Day Lab` 的深度強化規格包。目標是把目前偏文字與模板化的課程，升級成可驗證、可評分、可對應 AWS 認證階級的實作型學習系統。

## 使用方式

1. 先閱讀 `00-master-spec.md` 理解整體目標、缺口與成功標準。
2. 依序執行 `01` 到 `06` 的階段文件，每個階段都可以獨立成一個 goal。
3. 使用 `07-goal-prompt.md` 的提示詞建立長期 goal，讓 Codex 依照 spec 持續推進。
4. 每完成一個階段，要 build、檢查 UI、更新 GitHub Pages。

## 文件順序

| 順序 | 文件 | 目的 |
|---|---|---|
| 00 | `00-master-spec.md` | 總控規格：定義目標、缺口、等級、執行原則 |
| 01 | `01-assessment-foundation.md` | 建立能力評估骨架與 AWS 認證等級對照 |
| 02 | `02-day-2-5-deployment-labs.md` | 強化 Day 2-5，補齊從本機到 first deploy 的真實 lab |
| 03 | `03-day-6-15-associate-labs.md` | 強化 Day 6-15，對齊 Associate 等級主線 |
| 04 | `04-day-16-30-professional-prep-labs.md` | 強化 Day 16-30，對齊 Professional prep / Specialty intro |
| 05 | `05-interactive-labs-and-quiz.md` | 擴充互動故障 lab、每日 quiz、階段測驗 |
| 06 | `06-ui-assessment-dashboard.md` | 建立 Stage Assessment、Skill Radar、Exam Mapping UI |
| 07 | `07-goal-prompt.md` | 可直接使用的 goal 驅動提示詞 |

## 核心原則

- 不再只做漂亮課程頁，要讓學員真的能操作、驗證、排錯、答辯。
- 每一天必須有專屬情境，不可只靠共用模板替換標題。
- 每一天必須產出 artifact，例如 diagram、runbook、config checklist、CLI output、rollback note。
- 每一階段必須能映射到 AWS 認證能力層級。
- 所有 AWS 版本與考試方向以 official AWS docs / AWS Certification guides 優先。

