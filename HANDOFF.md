# TSUKUMO99 · DiŹ WORLD TOUR — Handoff Brief

> Self-contained context for any AI/collaborator continuing this project.
> Companion files in repo: `PRODUCT.md` (product truth), `DESIGN_BRIEF.md` (original creator brief),
> `proto/` (agreed design prototype), `proto/logos/` (logo SVGs).

---

## 1. What this is

**TSUKUMO99 DiŹ LIVE** — an **unofficial doujin (fan) project**: a fictional five-member band and its **DiŹ world tour**, presented *as if it were the band's real official site*, to introduce the 企划 to fellow fans (同好).

**North star:** *"a believable real-band official site, made by one fan"* — impressive enough that **scanning a shared QR code, opening it, and showing it off (装b)** is the whole point. Realism sells it; a few interactive toys/keepsakes reward it.

**Primary users:** Chinese-speaking 同好 (小红书 circle), mostly on **phone** (desktop must also look good), often arriving via a **shared QR code**.

---

## 2. Hard boundaries (do not cross)

- **Static site only:** plain HTML/CSS/JS, **no build step**, must run **offline**, hosted **free** on GitHub Pages. No framework, no paid service.
- **No real commerce/payment** anywhere. All "checkout" flows are pure front-end simulation collecting **only a name** (printed on the artifact). Never add real payment/data-collection fields.
- **Everything fictional & obviously so:** venues (fictional chain "SIXFACE + city"), addresses, dates, seats, tickets. Tour = **11 cities / 17 shows** across CN·JP·CA·UK·IT.
- **A non-official disclaimer must exist**, but per creator: **NOT prominent on the first screen** — a short `TSUKUMO99 · UNOFFICIAL FANWEB` mark up top + the full disclaimer in the footer. Exported artifacts carry `UNOFFICIAL / FAN-MADE, NOT A REAL TICKET`.
- **⚠️ IP safety:** the earlier working band name **"ŹOOĻ" is DROPPED** — it collides with a real IP (IDOLiSH7's ŹOOĻ). Lead identity is **TSUKUMO99 + DiŹ**. Any future act name must avoid real/existing IP names.
- **Two behaviours must NOT change** from the current live site: (1) the **floating 应援/荧光棒 (cheer) widget stays draggable** (drag = move, tap = wave, no label text); (2) the **PNG ticket export** logic/style (in `script.js`) is untouched.

## 3. Scope corrections (optimized boundaries)

- The site is **NOT a printable object.** Only **specific items export an authorized PNG** to save/print as a 无料 (free fan giveaway): the **ticket**, and the **Shop** flow (shopping → printable PNG collectible: sticker / card / receipt). Everything else is just a nice web page.
- **Language:** key visuals (**TSUKUMO99 / DiŹ wordmarks, hero, tour branding**) are **never in Chinese** (stay Latin/stylised). All other copy/UI **defaults to Chinese**, switchable to **JP / EN**.
- **Text rule (strict): keep it minimal, no unnecessary info.** No counts/stats as decoration, no helper/label filler, plain button copy ("购票", not "掷骰购票"). This rule keeps the "believable & premium" feel.

---

## 4. Identity & visual system (agreed)

- **Names:** `TSUKUMO99` = project/series & lead identity (primary wordmark). `DiŹ` = this tour (co-lead, the hero wordmark). Tagline: **"Once and for all, dice away."** Band/act name = **TBD** (5 members, names TBD).
- **Dice is the through-line motif** (favicon = five-pip die; DiŹ; "dice away"). Reuse pips/dice everywhere. Insight: idol tickets are **抽選 (lottery)** → a dice roll for a seat is thematically perfect.
- **Palette (CSS vars):** `--ink #170006` `--wine #3a0014` `--crimson #8d002c` `--hot #ec0050` `--pink #ff86bd` `--paper #fff4f7` `--muted #e4afbf`. Dark, wine/neon-pink. Color owns whole regions, not scattered accents.
- **Fonts (self-hosted in `assets/fonts/`):** `Oswald` (display), `Space Mono` (mono), Noto Sans SC/JP fallback for CJK body.
- **Key art:** `assets/hero.*` is **fan art of the band's five members** — treat as the band's "real" group photo, not decoration. It is **portrait/vertical**: on desktop use a **top crop** (fills, faces visible, no empty space); on mobile full-bleed.
- **Logos:** designed in `Logo Lab (offline).html`, extracted to `proto/logos/`:
  - `diz.svg` — DiŹ "blade" wordmark (italic, i-dot = die pip, Ź = slash accent). **Stroke-based → ideal for a DrawSVG self-drawing animation.** Hero mark.
  - `tsukumo99.svg` — TSUKUMO99 stamp/enclosed sub-mark. Footer/topbar.
  - `lockup.svg` — "TSUKUMO99 LIVE · DiŹ" + a 5-pip die icon. Splash. (viewBox `0 0 760 300`.)
  - Colouring: set `#fff`→`currentColor`; put the pip + accent in `--hot/--pink`. Logos may still iterate.

## 5. Design rules / preferences (from the creator)

- Text minimal (see §3). Disclaimer not prominent (see §2).
- Cheer widget draggable, no extra text (see §2).
- Menu style = **A: semi-transparent full-screen** takeover (blurred hero behind), staggered item reveal, hamburger→× morph. (Right-panel variant B was rejected.)
- No Chinese sub-labels under English nav items.
- Home should be a **long scrolling page** (like sixtones.jp): hero → section overviews with jump links → an Index quick-jump → footer. Nav = **Top / News / Ticket / Shop** (Profile/乐队简介 removed for now — members & band name undecided; restore later).

---

## 6. Reference sites → interactions to build (be creative, don't hard-copy)

The creator shared these to **borrow interaction feel**, in our own colours/content:

| Reference | What to take | Mechanics captured (real, measured) |
|---|---|---|
| **sixtones.jp** | Loading screen; full-screen staggered menu; long home w/ section overviews + jump links; scroll-reveal | Loader: hold ~1s → logo fades (0.6s) → layer fades → blackout curtain. Menu: full-screen dark, big serif items **cascade in** (per-item delay ~0.1s step), hamburger→× (0.6s), ease `cubic-bezier(.215,.61,.355,1)`. Scroll-reveal via IntersectionObserver. **Easing signature: 0.3s micro / 0.6s structural / 1–3s atmospheric.** |
| **gsap-webflow-offbrand.webflow.io** | GSAP **Flip** click→layout-morph | Click → items **travel + scale + settle** between layouts, staggered, easeInOut ~0.6–0.8s (FLIP technique). Use for the **dice-roll → seat settle** and card reflows. |
| **CodePen qBedXpg** (osublake fork) | **Wavy multi-layer curtain** transition on click | 2 SVG layers, 10 control points each, random per-point (`delayPointsMax .3`) + per-path (`delayPerPath .25`) delays, `duration .9`, ease `power2.inOut`; GSAP timeline tweens points 100→0, `render()` redraws the bezier path. Use as **page / mode / menu transition** and later the JAM-MODE enter. |
| **CodePen OJeOewJ** | **DrawSVG** self-drawing stroke | `drawSVG '0% 0%' → '100% 100%'`, 3s `power1.inOut`. Use to **animate-draw the DiŹ/TSUKUMO99 logos** (already stroke-based). **Draw once on load, then hold** — do NOT loop infinitely on the real site. |
| **imreallyatrex.com / awwwards.com** | FUTURE "JAM MODE" playable toy | **Deferred** until the creator's friend supplies audio/音效. Not an exact copy (that site is heavy WebGL). Scope a light on-theme toy (canvas/CSS: draggable physics dice, neon particle taps, penlight rhythm). The qBedXpg curtain is its enter-transition. |

**Signature feature — 投骰子 (dice roll):** re-skin the **existing hidden `Math.random()` seat assignment** (in `script.js` `issue()`) as a **visible dice roll → tumble → settle → reveal ROW-SEAT → issue ticket**. Thematically = 抽選. Note **VIP is standing (no seat)** → decide separate treatment (e.g. roll for entry order) — **TODO**.

## 7. Tech approach

- **Foundation = vanilla** (no dependency): splash, menu, contact, draggable dice tumble, DrawSVG-style draw-on (native `stroke-dasharray/offset`), scroll-reveal.
- **GSAP** (self-hosted `gsap.min.js`, ~28KB gz, **free**; DrawSVG/Flip plugins now free too) is optional and **deferred to the wavy-curtain / complex-timeline phase** — decide vanilla-vs-GSAP after comparing a small sample of each. Nothing before that needs it.
- **Mobile-first, desktop must also look good.** All effects transform/SVG (no WebGL). Honour `prefers-reduced-motion`. Test mobile via Chrome DevTools device mode (F12 → Ctrl+Shift+M).

## 8. Repo, deploy & current state

- Repo: `github.com/lzl2lzl/tsukumo99-live`. Live: `https://lzl2lzl.github.io/tsukumo99-live/`.
- **Branch workflow:** work on `dev`, merge to `main` only when verified. GitHub Pages is **temporarily pointed at `dev`** for continuous preview (switch back to `main` when stable).
- **Base real work on `main`.** The `dev` commit `df6d81e` ("taste-skill" hero/tour redesign) is **disliked — discard it** (e.g. `git checkout main -- script.js styles.css` before integrating).
- **Real site:** `index.html` (just `<div id="app">`) + `script.js` (1000+ lines, client-renders everything: hero, tour, booking→ticket flow, PNG export, cheer widget, i18n) + `styles.css`.
- **Prototype (agreed direction):** `proto/index.html` (standalone) at `/proto/`. Built: splash (lockup), topbar (TSUKUMO99 / UNOFFICIAL FANWEB + CN/JP/EN + hamburger), hero (DiŹ blade logo, desktop top-crop / mobile full-bleed portrait), **menu A** (translucent full-screen, staggered), long home (News / Live / Shop overviews + Index jump + footer disclaimer), draggable cheer, scroll-reveal. **This proto is the look to port into the real `script.js` site.**

## 9. Next steps (roadmap)

1. **Port the proto look into the real script.js site**, starting from `main` (keep booking flow + PNG export + cheer intact).
2. **Ticket / 购票 (priority):** the buy flow ending in the **unchanged PNG ticket**; add the **投骰子 → seat** dice moment.
3. **News** page/section (real copy TBD).
4. **Shop:** 云购物 experience → **printable PNG collectible** (same take-home pattern as ticket).
5. Motion polish: DrawSVG logo draw-on; wavy-curtain transition (decide GSAP vs vanilla via samples); menu/scroll interactions from the reference table.
6. **Later:** Profile (when members/name exist); JAM MODE (when audio exists).

## 10. Open decisions / TODO (need creator input)

- Band/act name (ŹOOĻ dropped) — a new original name, or run everything under TSUKUMO99?
- Real 小红书 handle (placeholder `@TSUKUMO99`).
- Real copy: News items, Shop products (+ Profile later). Fictional placeholders are OK meanwhile.
- VIP-standing dice handling (no seat number).
- GSAP vs vanilla for the curtain.
- Final logo files (may iterate from Logo Lab).
