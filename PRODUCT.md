# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **同好 (fellow doujin/fan-culture enthusiasts)**, mostly Chinese-speaking (小红书 circle), browsing on both phone and desktop, **often arriving by scanning a shared QR code**. They come to discover the creator's fan project and to be impressed — the site is something to show off (装 b): "look, it's like a real band's official site." Secondary audiences read in Japanese or English via a language switch.

## Product Purpose

**TSUKUMO99 DiŹ LIVE** is the creator's **unofficial doujin (fan) project**: a fictional five-member act whose lead identity is **TSUKUMO99** and its **DiŹ world tour**, presented *as if it were the band's real official site*. Its purpose is to introduce this 企划 to fellow fans — to make an invented band feel like it genuinely exists, while staying openly playful. **Success = someone scans a shared QR code, opens it, and is impressed enough to show it off ("this looks like a real band's official site").** A few features go further and let you export an authorized PNG artifact (the ticket, maybe a Shop collectible) to save/print — but that is a bonus on specific items, **not** the whole site being printable.

## Positioning

The defining play is a **believable official-band site made by one fan** — impressive enough at a glance that scanning the QR and showing it around is the point (装 b). Realism sells it (looks legit), playfulness rewards it (a few interactive toys inside). On **specific items only** — the ticket, maybe a Shop collectible — the experience ends in an **authorized exportable PNG** you can save/print as a 无料 (free fan giveaway). The site as a whole is not a printable object; the printable bits are deliberate, bounded keepsakes.

## Operating Context

- Runs entirely in the browser, desktop and mobile, as a static site on **GitHub Pages**; must work **offline** and cost **nothing**.
- No real commerce or payment anywhere; the checkout/purchase flows are pure front-end simulation that collect only a name (for printing on the artifact).
- Language: **key visuals (TSUKUMO99 / DiŹ wordmarks, hero, tour branding) are never in Chinese** — they stay Latin/stylized. Everything outside the key visuals (body copy, UI, section content) **defaults to Chinese and is switchable to Japanese / English**.

## Capabilities and Constraints

Surfaces / features:
1. **Live 云买票 (cloud ticket-buying)** — choose tour stop → tier → name → issue. **The existing PNG ticket export style must stay unchanged.** The ticket doubles as a printable 无料.
2. **乐队简介 / Band Profile** — intro to the **five-member act** (band/act name is TBD — the earlier working name "ŹOOĻ" is dropped, see Brand Commitments; copy/member details supplied by creator later; placeholder/fictional content OK for now).
3. **News** — ongoing announcements (copy supplied later; placeholder/fictional OK for now).
4. **Shop** — non-traditional "云购物" experience; a shopping flow that **produces a printable PNG collectible** (sticker / receipt / postcard-style), same take-home pattern as the ticket. Placeholder/fictional merch OK for now.
5. **Future: real music-interaction web mini-game** — build **only if** the creator's friend supplies audio/音效; deferred; will not be an exact copy of any reference.

Hard constraints: static, no build step, offline-capable, free hosting; no real payment fields or data collection beyond a name; all venues/addresses/seats/tickets are obviously fictional (fictional venue brand e.g. "SIXFACE + city"); tour spans 11 cities / 17 shows across CN·JP·CA·UK·IT.

Terminology: **TSUKUMO99** = the project's lead identity / series name (primary wordmark); **DiŹ** = this tour (co-lead wordmark); tagline **"Once and for all, dice away."** The five-member act's own name is not yet decided.

Open decisions: the DiŹ wordmark is to be **redesigned** (recorded as intent; the new mark itself is visual work for new-work, not product truth).

## Brand Commitments

- **Lead identity = TSUKUMO99 + DiŹ** (these two carry the wordmarks and the hero). **"ŹOOĻ" must NOT be used** — it collides with a real existing project (IDOLiSH7's ŹOOĻ), so it is an IP risk; drop it everywhere. Any future act name must likewise avoid real/existing IP names.
- **Dice is the through-line motif** (favicon already a five-pip die; tagline "dice away"; tour named DiŹ).
- A **non-official / fan-made disclaimer must be prominent** in the first viewport — not buried in the footer.
- Exported artifacts must carry **"UNOFFICIAL / FAN-MADE, NOT A REAL TICKET"**.
- The main key art (`assets/hero.*`) is **fan art of the act's five members** — it depicts the band itself, not a decorative hero image, and should be treated as the band's "real" group visual.

## Evidence on Hand

- `DESIGN_BRIEF.md` — the creator's own brief (band relationship, tour list, flow, ticket requirements).
- Working incumbent site: `index.html` + `script.js` (client-rendered) + `styles.css`; `assets/hero.*` = fan art of the act's five members, dice favicon, cheer/荧光棒 widget, working ticket PNG export.
- **Absent, must not be fabricated as final:** the five members' real names/details, real News copy, real Band Profile copy, and the audio for the future mini-game. Placeholder/fictional stand-ins are explicitly allowed until the creator supplies real copy.

## Product Principles

1. **Believable *and* playful** — never sacrifice one for the other; realism sells the world, play is the payoff.
2. **Every feature ends in a keepsake or a moment** — prefer "you can take this home / you can play with this" over passive display.
3. **Honest fiction** — the illusion is total in craft but the "unofficial / not real" truth is always one glance away.
4. **Light, free, offline, universal** — works on any phone or desktop, no build, no cost, no dependency it can't self-host.
5. **Key visuals stay in the band's own (non-Chinese) voice; the human copy meets the reader in their language.**

## Accessibility & Inclusion

- Multilingual by requirement (CN default / JP / EN switch) for all non-key-visual content.
- Honor `prefers-reduced-motion` (already partially in place) across all new motion.
- Must remain usable and legible on small mobile screens as a first-class case, not an afterthought.
