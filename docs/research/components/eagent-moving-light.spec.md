# E-agent Moving Light Specification

- Target: `claude design/motion-elements/exact-01-eagent-light.html`
- Interaction model: time-driven.
- Two full-viewport layers share one moving zero-size center.
- Foreground layer: `z-index:3`, `mix-blend-mode:soft-light`; white circle, opacity `.6`.
- Background layer: normal blend; circle color `#fffbe0`.
- Circle size: `60vw`; desktop scale `.35 → 1`, mobile `.8 → 1.3`; `5s linear infinite alternate`.
- Center path: `x=((sin(a)+1)/2)*width`, `y=cos(b)*height/2`, anchored at `top:50%;left:0`.
- Desktop increments per frame: `.012/.024`; mobile: `.02/.04`.
- No canvas, cone beam, blur, pointer tracking, or random path.
