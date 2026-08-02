# HeroToggle Specification

## Overview
- Target: script.js (renderCloneHero, setHeroMode)
- Reference: docs/design-references/reference-hero-on.png
- Interaction model: click-driven toggle, default ON

## DOM Structure
Full-viewport hero → quiet base title/content → five fixed-looking stripe bands → embedded media layers → centered toggle → bottom CTA.

## Exact reference values
- Hero: 100svh, overflow clipped, background #ffe9cf.
- Ink: #270f03.
- Stripe text: Anton 400, 15vw desktop, line-height 1.1, uppercase, cream.
- Stripe: dark ink background, 0.4rem padding, 2rem gap.
- Toggle: 18rem × 10rem, z-index 3.
- Slider: cream fill, 0.55rem cream border, 10rem radius, 0.5rem padding.
- Ball: 8rem, green ON color #10cd00, 0.4rem border.
- Reference desktop ball displacement: 128px.
- Mobile toggle: 10rem × 5rem; ball 4rem.

## ON State
- Five stripes span beyond the viewport and enter from alternating sides.
- Vertical offsets create the overlapping poster composition.
- Embedded assets: letter bundle, three image cards, runner video/frame.
- Base heading and paragraph are hidden.
- Toggle remains centered and interactive.

## OFF State
- Stripes translate out to alternating sides.
- Base heading “MAKE IT MEAN MORE WITH GSAP” and explanatory copy fade and rise in.
- Toggle ball returns left and becomes blue.

## Motion
- Stripe duration: 1.1–1.55 seconds, staggered.
- Easing: cubic-bezier(.16,1,.3,1), matching expo-out character.
- Toggle duration: 0.7 seconds.
- Reduced motion: transitions collapse to near-instant.

## Responsive
- Desktop: stripe font 15vw; toggle 18×10rem.
- Tablet: stripe font 20vw.
- Mobile: stripe font 25vw; embedded media widened to 20–26vw; toggle 10×5rem.