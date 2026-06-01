# AWS Learning Depth Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade AWS Docker Compose 30-Day Lab into an implementation-driven learning system with AWS certification-aligned assessment, deeper daily labs, interactive troubleshooting, and readiness dashboards.

**Architecture:** The plan is spec-first. The source of truth is the staged spec package in `docs/specs/aws-learning-depth-upgrade/`; implementation should update `src/data.ts`, `src/App.tsx`, and `src/styles.css` in small stages, with build and browser verification after each stage.

**Tech Stack:** React 19, TypeScript, Vite, localStorage state, GitHub Pages, AWS official documentation references.

---

## Spec Package

Read these files before implementation:

- `docs/specs/aws-learning-depth-upgrade/00-master-spec.md`
- `docs/specs/aws-learning-depth-upgrade/01-assessment-foundation.md`
- `docs/specs/aws-learning-depth-upgrade/02-day-2-5-deployment-labs.md`
- `docs/specs/aws-learning-depth-upgrade/03-day-6-15-associate-labs.md`
- `docs/specs/aws-learning-depth-upgrade/04-day-16-30-professional-prep-labs.md`
- `docs/specs/aws-learning-depth-upgrade/05-interactive-labs-and-quiz.md`
- `docs/specs/aws-learning-depth-upgrade/06-ui-assessment-dashboard.md`

## File Structure

- Modify `src/data.ts`: lesson data, assessment metadata, quiz/lab models.
- Modify `src/App.tsx`: assessment UI, lesson readiness, quiz/lab interactions.
- Modify `src/styles.css`: assessment dashboard, radar, heatmap, rubric UI.
- Modify `README.md`: explain assessment levels and GitHub Pages usage.
- Create or update docs under `docs/specs/aws-learning-depth-upgrade/` when scope changes.

## Task 1: Assessment Foundation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/data.ts`
- Modify: `src/styles.css`

- [ ] Add assessment level and rubric types.
- [ ] Extend progress normalization to support daily assessments.
- [ ] Add derived readiness scoring from existing progress.
- [ ] Render Stage Assessment Summary in Learning Progress.
- [ ] Run `npm run build`.
- [ ] Check Learning Progress in browser.
- [ ] Commit: `git commit -m "Add learning assessment foundation"`

## Task 2: Day 2-5 Deployment Labs

**Files:**
- Modify: `src/data.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Replace generic Day 2-5 mentor scripts with dedicated scenarios.
- [ ] Add Day 2-5 specific diagrams and visual specs.
- [ ] Add commands, verification, pitfalls, and artifacts for Day 2-5.
- [ ] Verify Day 4 no longer shows Day 1 inventory diagram as the main visual.
- [ ] Run `npm run build`.
- [ ] Check Day 2, Day 3, Day 4, Day 5 in browser.
- [ ] Commit: `git commit -m "Deepen deployment labs for days 2 to 5"`

## Task 3: Day 6-15 Associate Labs

**Files:**
- Modify: `src/data.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Add Associate exam mapping metadata for Day 6-15.
- [ ] Replace fallback commands with day-specific commands or pseudo-commands.
- [ ] Add dedicated diagrams for VPC, ECR, ECS, ALB, worker, secrets, CloudFront, CI/CD, zero downtime, observability.
- [ ] Add pitfalls with detection and fix.
- [ ] Run `npm run build`.
- [ ] Check representative days: Day 6, Day 8, Day 13, Day 15.
- [ ] Commit: `git commit -m "Align advanced labs with associate AWS skills"`

## Task 4: Day 16-30 Professional Prep Labs

**Files:**
- Modify: `src/data.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Add failure-mode based structure for Day 16-30.
- [ ] Add artifacts for security, migration, signed URL, WebSocket, concurrency, autoscaling, cost, DR, IaC, governance, performance, capstone.
- [ ] Add Day 30 capstone defense panel.
- [ ] Run `npm run build`.
- [ ] Check representative days: Day 16, Day 18, Day 24, Day 30.
- [ ] Commit: `git commit -m "Add professional prep labs and capstone defense"`

## Task 5: Interactive Labs and Quiz Expansion

**Files:**
- Modify: `src/data.ts`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] Add day/stage/exam mapping to quiz questions.
- [ ] Expand quiz data to cover daily quick checks and stage exams.
- [ ] Convert interactive labs into troubleshooting diagnosis scenarios.
- [ ] Add wrong-answer remediation links to related days.
- [ ] Run `npm run build`.
- [ ] Check Quiz Mode and Interactive Lab in browser.
- [ ] Commit: `git commit -m "Expand interactive labs and certification quizzes"`

## Task 6: UI Assessment Dashboard

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Modify: `README.md`

- [ ] Add Skill Radar.
- [ ] Add Daily Evidence Heatmap.
- [ ] Add Exam Mapping summary.
- [ ] Add Lesson Readiness Estimate.
- [ ] Update README with assessment level explanation.
- [ ] Run `npm run build`.
- [ ] Check desktop and mobile layouts.
- [ ] Commit: `git commit -m "Add assessment dashboard and readiness UI"`

## Task 7: Release

**Files:**
- Modify only if needed after verification.

- [ ] Run `npm run build -- --base=/aws-cloud-deployment-learning/`.
- [ ] Push `main`.
- [ ] Confirm GitHub Actions Pages deploy succeeds.
- [ ] Verify `https://cerry0524.github.io/aws-cloud-deployment-learning/` returns HTTP 200.
- [ ] Check deployed JS/CSS assets return HTTP 200.

## Self-Review Checklist

- [ ] Every stage in the spec package has a matching implementation task.
- [ ] No stage depends only on completed days as a proxy for skill.
- [ ] Day 2-30 no longer rely on generic mentor script content only.
- [ ] Deep Dive days include failure mode, detection, remediation, and evidence.
- [ ] UI does not flood the page with long text; tabs, cards, heatmaps, and summaries are used.

