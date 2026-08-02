# Claude Design input package

Attach `Claude Design Hero Motion Input.html` together with the current hero art and the design prompt.

## Instruction to Claude Design

Use the attached HTML as a **motion and layering reference**, not as a locked final layout. Redesign and refine the existing homepage Hero while preserving the current TSUKUMO99 / DiŹ identity, copy, navigation, disclaimer, CTA, and `assets/hero.avif` key visual.

The key visual is the five-member act itself and must remain the dominant focal point. Build one authored moment: theatrical spotlights discover and frame the group visual. The moving flow field and Profile-inspired kinetic typography only create depth behind it.

Keep these layer relationships:

1. dark wine atmosphere;
2. low-opacity moving flow field;
3. sparse oversized typographic ribbons;
4. the existing hero key visual;
5. theatrical spotlights and rim light;
6. readable interface and CTA.

The reference intentionally uses offline CSS instead of Three.js. You may improve the Flow effect with self-hosted WebGL only if the result still works as a static GitHub Pages site, pauses offscreen, caps device pixel ratio at 1.5, and includes the existing CSS version as fallback.

Do not copy the colors, assets, copy, robot, grid model, or layout of the external reference sites. Do not replace the hero art. Do not add generic particles, star fields, audio visualizers, glass cards, or cyberpunk decoration. Keep the result believable as a premium Japanese artist/tour site rather than a technology demo.

Return a complete runnable HTML/CSS/JS prototype with desktop, mobile, `prefers-reduced-motion`, and offline behavior. Keep all content visible if JavaScript fails.
