# Standalone motion elements

These files are isolated motion references. They contain no TSUKUMO99 layout, hero image, navigation, CTA, or final art direction. Give Claude Design only the effects you want it to consider.

- `01-stage-spotlights.html` — two autonomous theatrical beams with restrained pointer influence.
- `02-flow-field.html` — transparent perspective flow grid rendered with Canvas 2D.
- `03-kinetic-type.html` — reusable drifting type ribbons; replace the sample words.
- `04-organic-wobble.html` — native WebGL organic deformation inspired by the motion mechanism observed on redandgreen.jp, rebuilt without its assets, colors, source shaders, or Three.js dependency.

All files are standalone, dependency-free, transparent or near-transparent layers, pause when hidden, and honor `prefers-reduced-motion`.

## Prompt fragment

Treat the attached HTML files as independent motion primitives, not as a proposed homepage composition. Inspect how each primitive behaves, then decide which one or two support the supplied key visual. Do not preserve the demo colors, positions, text, scale, or layer order. Do not combine every effect by default. The key visual must remain dominant.
