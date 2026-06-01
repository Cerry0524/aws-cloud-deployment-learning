# Mobile RWD Design Spec

## Goal

Fix the AWS Docker Compose 30-Day Lab mobile experience so a learner can enter any Day page on a phone, understand the current lesson, follow one next action, read diagrams, and access mentor guidance without losing orientation.

## Recommended Pattern

Use a Mobile App Shell. The desktop sidebar remains a left rail, but phone/tablet layouts convert it into a sticky top shell with horizontally scrollable navigation chips. Lesson tabs become a compact horizontal segmented control. The mentor rail stops behaving like a right sidebar on mobile and becomes a normal learning panel below the active lesson content.

## Mobile Information Order

1. Compact brand and current navigation.
2. Horizontal app navigation chips with a clear active state.
3. Lesson title and metadata.
4. Stepper chips.
5. Day-specific visual or architecture diagram.
6. One active lesson tab.
7. Mentor guidance, quick questions, and step controls.

## Required Changes

- Keep only one sticky top layer on mobile: the app shell. Lesson tabs may stick directly under it on lesson pages.
- Disable sticky `topbar` and right-side `mentor-rail` on mobile.
- Convert diagrams from desktop comparison columns into vertical flow cards under 640px.
- Convert inventory tables into stacked cards with visible field labels on mobile.
- Keep tappable controls at least 44px tall.
- Avoid horizontal page overflow at 390px, 430px, and 768px widths.

## Acceptance

- At 390x844, the first lesson screen shows the Day title, current step, and a usable next action.
- Side navigation active state remains visible after entering a Day lesson.
- Lesson tabs do not stack into four large full-width blocks on mobile.
- Day 4 EC2 diagram appears as a vertical flow, not a squeezed desktop diagram.
- Inventory rows are readable without horizontal scrolling.
- Browser console has no relevant runtime errors.
