# Mobile RWD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the mobile layout for the AWS Docker Compose 30-Day Lab so lessons, navigation, diagrams, and mentor guidance are usable on phone viewports.

**Architecture:** Keep the current React component structure and add targeted class names plus responsive CSS. Desktop keeps the two-column app shell; mobile converts sidebar, tabs, diagrams, and tables into touch-friendly stacked or horizontally scrollable patterns.

**Tech Stack:** React 19, TypeScript, Vite, CSS media queries, Browser plugin verification.

---

### Task 1: Mobile Shell And Navigation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Add mobile shell class hooks**

Add `app-nav` to the main nav and keep the existing active logic for lesson pages.

- [x] **Step 2: Convert sidebar at mobile widths**

Use CSS under `max-width: 767px` to make the sidebar a sticky top app shell, hide tenant details, and make navigation chips horizontally scrollable.

### Task 2: Lesson Flow

**Files:**
- Modify: `src/styles.css`

- [x] **Step 1: Make lesson stepper horizontal on phones**

Mobile steppers become scrollable chips instead of full-width stacked blocks.

- [x] **Step 2: Make lesson tabs compact**

Mobile tabs become a sticky horizontal segmented control below the app shell.

- [x] **Step 3: Move mentor out of right-rail behavior**

On mobile, mentor guidance becomes a normal panel below lesson content, with compact actions and readable sections.

### Task 3: Mobile Diagrams And Tables

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [x] **Step 1: Add table `data-label` attributes**

Inventory table cells expose labels for mobile card rendering.

- [x] **Step 2: Convert mapping diagrams to vertical cards**

Under 640px, each mapping row becomes a single flow card: local node, arrow, AWS node.

- [x] **Step 3: Convert inventory table to cards**

Under 640px, table header is hidden and rows become labeled cards.

### Task 4: Verification

**Files:**
- Test command: `npm run build`
- Browser target: `http://localhost:4321/`

- [x] **Step 1: Run production build**

Expected: TypeScript and Vite build pass.

- [x] **Step 2: Validate with Browser**

Check 390x844, 430x932, 768x1024, and desktop when practical. Verify no horizontal overflow, no framework overlay, and lesson interaction works.
