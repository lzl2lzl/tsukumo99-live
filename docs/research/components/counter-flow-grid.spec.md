# COUNTER Flow Grid Specification

- Target: `claude design/motion-elements/exact-02-counter-grid.html`
- Interaction model: time-driven; original pauses offscreen.
- Original: orthographic Three.js scene using repeated `grid.glb` groups, not a perspective floor.
- Five named planes use scan speed multipliers `10/6`, `10/1.5`, `10`, `5`, `2.5`.
- Shader defaults: base color `rgb(255,85,43)`, `baseSpeed=.4`, `scanWidth=1.2`, `scrollSpeed=.2`.
- Scan is a local-X smoothstep band; geometry groups wrap horizontally and reverse in the center depth group.
- A multiply noise layer sits over the canvas.
- Standalone recreation procedurally redraws the orthographic rectangular wall without copying `grid.glb`.
