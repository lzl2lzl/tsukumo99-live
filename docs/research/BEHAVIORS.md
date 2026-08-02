# Behaviors

## Corrected reference scope
The requested target is the full first-screen toggle composition, not the List/Grid section below it.

## Hero interaction
- Default state: toggle ON, matching the supplied screenshot.
- Click toggle: alternates between the stripe/media poster and the quiet typographic hero.
- ON: five diagonal text bands slide in from alternating horizontal directions. The base title and paragraph exit.
- OFF: bands leave toward alternating sides. The base title and paragraph return.
- The runner asset plays only while ON.
- Project navigation stays hidden over the cloned first viewport and appears after scrolling beyond it.
- prefers-reduced-motion is honored.

## Responsive behavior
- Desktop uses 15vw Anton stripe text and the 288×160 reference toggle.
- Tablet increases stripe text to 20vw.
- Mobile uses 25vw stripe text and a 160×80 toggle.