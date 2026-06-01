# Goal Prompt

以下提示詞可直接用來建立長期 goal。它會讓 Codex 依照本 spec 規格包執行，直到課程深度強化完成。

## 一次掌握全程的 Goal 提示詞

```text
請建立並執行一個長期 goal：

目標：
依照 `/Users/cerry/Documents/學習 amazon 雲端/docs/specs/aws-learning-depth-upgrade/` 規格包，將 AWS Docker Compose 30-Day Lab 從目前偏文字/模板化的課程，升級成具備實作深度、能力評估、AWS 認證階級對照、互動故障 lab、quiz 與 assessment dashboard 的完整學習系統。

必須遵守：
1. 先閱讀以下文件，並以它們作為任務範圍：
   - `docs/specs/aws-learning-depth-upgrade/00-master-spec.md`
   - `docs/specs/aws-learning-depth-upgrade/01-assessment-foundation.md`
   - `docs/specs/aws-learning-depth-upgrade/02-day-2-5-deployment-labs.md`
   - `docs/specs/aws-learning-depth-upgrade/03-day-6-15-associate-labs.md`
   - `docs/specs/aws-learning-depth-upgrade/04-day-16-30-professional-prep-labs.md`
   - `docs/specs/aws-learning-depth-upgrade/05-interactive-labs-and-quiz.md`
   - `docs/specs/aws-learning-depth-upgrade/06-ui-assessment-dashboard.md`
2. 每個階段都必須獨立完成、build 驗證、瀏覽器檢查，必要時更新 GitHub Pages。
3. 優先順序固定：
   - Stage 01：Assessment foundation
   - Stage 02：Day 2-5 deployment labs
   - Stage 03：Day 6-15 Associate labs
   - Stage 04：Day 16-30 Professional prep labs
   - Stage 05：Interactive labs and quiz expansion
   - Stage 06：UI assessment dashboard
4. 每一天課程都必須有：
   - 專屬 scenario
   - 對應主題的 diagram，不可重複不合情境的 Day 1 圖
   - 操作 lab
   - command 或 pseudo-command
   - verification
   - pitfalls with detection/fix
   - artifact
   - assessment mapping
5. AWS 版本、考試階級與服務行為必須優先參考 official AWS docs / AWS Certification exam guides。
6. 每次修改後都要執行：
   - `npm run build`
   - 如果 UI 有變更，使用瀏覽器檢查主要畫面
7. 不要只做文件。目標完成時，前端 UI 與課程資料都必須反映這套 assessment/depth upgrade。

完成定義：
- Day 2-30 不再只是共用模板內容。
- Learning Progress 或 Assessment UI 能顯示 L0-L5 能力等級。
- Quiz / Interactive Lab 能對應 day/stage/exam domain。
- Day 30 能產出 capstone defense。
- GitHub Pages 可正常看到最新版本。
```

## 短版 Goal 提示詞

```text
請依照 `docs/specs/aws-learning-depth-upgrade/` 的 00-06 規格，持續執行直到 AWS Docker Compose 30-Day Lab 完成深度升級：補強 Day 2-30 專屬 lab、建立 assessment 等級、擴充 quiz/interactive labs、完成 UI assessment dashboard，並在每階段 build + browser 驗證 + 發佈 GitHub Pages。
```

