# ProjectNav Specification

## Overview

- **Target file:** `script.js` (`renderHeader`)
- **Screenshot:** `original-desktop.png`
- **Interaction model:** click-driven anchor navigation

## DOM structure

Fixed header → brand link + pill nav links + language switcher.

## Reference styles

- Reference wrapper: fixed; display flex; 16px gap.
- Controls: compact, rounded, high-contrast fill/outline states.
- Local adaptation: wine glass surface, paper text, pink accent, 999px radius.

## States & behaviors

- Hover/focus: surface brightens, border becomes pink, item rises 1px.
- Active destination is represented by the filled CTA-style Tour pill.
- Tablet/mobile: horizontal pill strip remains scrollable; labels do not wrap.

## Responsive behavior

- Desktop: brand, center pills, and language controls share one row.
- Mobile: compact brand and horizontally scrollable pills; language control remains available.

