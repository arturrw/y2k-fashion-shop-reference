# Pinly Design System

A photography-first discovery-and-marketing design system, built from a third-party design analysis of Pinterest's public web surfaces (home, search results, and the creator/business marketing site). It is **not** an export of Pinterest's real code, Figma files, or brand assets — no logo, icon set, imagery, or component source was available. Everything here is reconstructed from a written design specification, and the system is branded "Pinly" (not "Pinterest") to keep that distinction clear.

**Sources**
- [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — `design-md/pinterest/DESIGN.md` (the design analysis this system is built from) and `design-md/pinterest/README.md`.
- The analysis itself points to [getdesign.md/pinterest](https://getdesign.md/pinterest/design-md) for previews and downloads — worth exploring directly for more source detail, dark-mode variants, and anything not captured here.

If you have access to Pinterest's actual codebase, Figma files, or brand assets, use those instead of this reconstruction for anything production-facing — this system is a best-effort recreation from prose, intended for prototyping and mockups.

## Content fundamentals

- **Voice:** friendly, encouraging, low-key — instructional copy ("Create the life you love", "Bring your favorite ideas to life") rather than sales-y superlatives.
- **Person:** second person ("your favorite ideas", "your brand") in marketing copy; first person only in transactional UI ("I already have an account").
- **Casing:** sentence case everywhere — headlines, buttons, nav links. No title case, no all-caps except tiny button labels where uppercase is a type-scale choice, not a copy rule.
- **Length:** short. Headlines are 3–6 words; body copy is one or two sentences max. No long-form marketing paragraphs.
- **Emoji:** none observed in chrome or button copy — the system relies on photography, not emoji, for expressiveness.
- **Vibe:** warm, editorial, quietly confident — a magazine talking about the things you might want to try, not a tech product pitching itself.

## Visual foundations

- **Color:** one saturated accent (Pinterest Red `#e60023`) reserved for primary CTAs and the active/selected state; everything else is warm neutral (cream surfaces, near-black ink, warm grays). No gradients anywhere.
- **Type:** proprietary "Pin Sans" (substituted here — see Fonts below). Steep jump from 70px display straight to 16px body with no intermediate tier. Negative letter-spacing (-1.2px / -0.8px) only at the two largest display sizes.
- **Spacing:** 8px base unit. Marketing sections sit 64px apart; the pin masonry grid tightens to 8px gutters so photography nearly touches.
- **Backgrounds:** flat warm-cream or white chrome — no photographic backgrounds behind text, no illustrations, no repeating patterns/textures. The photography lives inside pin cards and feature images, never as page background.
- **Animation:** not documented in the source analysis. Treat as minimal — simple opacity/color transitions on press states (see below), no bounce or spring easing observed.
- **Hover states:** not documented by the source's own policy ("no hover states documented per system policy"). Components here add a conservative background-darken on hover as a sane default; treat it as an addition, not a captured rule.
- **Press states:** solid color step-down — `primary` → `primary-pressed` (#cc001f), `secondary-bg` → `secondary-pressed` (#c8c8c1). No scale/shrink transforms.
- **Borders:** hairline 1px borders only, and only on inputs and structural dividers (footer top rule, in-list rows). Cards and buttons never have a border by default.
- **Shadows:** effectively none. The *only* shadow in the system is a soft 16px ambient shadow under the login/signup modal card, paired with a 50%-opacity scrim. Pin cards, feature cards, and the footer are all flat.
- **Corner radius:** exactly three values — 16px (buttons, inputs, standard cards — the workhorse radius), 32px (large pin cards, modals — reserved for "big" surfaces), and pill/9999px (search bar, chips, avatars, overlay pills). Never sharp corners on an interactive element, never a radius between 16 and 32.
- **Cards:** pin cards have zero internal padding — the photograph *is* the card, clipped straight to the radius. Feature/category cards use 16–32px internal padding and sit flat with no border or shadow.
- **Transparency/blur:** the only translucency is the 50%-opacity dark scrim behind the login modal. No backdrop-blur, no glassmorphism anywhere else.
- **Imagery vibe:** warm-toned lifestyle/editorial photography (food, fashion, interiors) at natural aspect ratios — square, 3:4, 2:3, 4:5. Landscape crops are rare since content is vertically oriented. No black-and-white treatment, no heavy grain.
- **Layout:** sticky top nav (64px) with the red Sign-up CTA always visible; content capped around 1280px; masonry column grid (4-up desktop, collapsing at breakpoints) for discovery pages, alternating left/right feature rows for marketing pages.

### Fonts — substitution flagged

Pin Sans is Pinterest's proprietary typeface and no font files were available in the source. **Inter** (400/500/600/700) is used as the body/UI substitute and **Manrope** (600/700) as the display substitute, per the source analysis's own recommendation — both are loaded from Google Fonts in `tokens/fonts.css`. If you have real Pin Sans font files, drop them into an `assets/fonts/` folder, add `@font-face` rules pointing at them, and swap the `--font-display` / `--font-body` values in `tokens/typography.css` — everything else in the system will pick it up automatically.

## Iconography

No icon assets (SVG, icon font, or sprite) were available in the source analysis — it only describes icon *usage* (a magnifier in the search bar, a hamburger on mobile, a close glyph on the modal), not the actual icon set Pinterest ships. This system substitutes **[Lucide](https://lucide.dev)** icons loaded from CDN (`unpkg.com/lucide`), using its `data-lucide="name"` + `lucide.createIcons()` pattern — same stroke-based, single-weight style that reads closest to Pinterest's own minimal glyphs. No emoji or Unicode characters are used as icons anywhere in the system.

## Components

| Component | Family |
|---|---|
| `Button` | primary / secondary / tertiary / on-image pill / disabled |
| `IconButton` | circular 40px icon button |
| `TextInput` | labeled field with double-ring focus |
| `SearchBar` | pill search field |
| `InlineLink` | body-prose anchor |
| `FilterChip` | pill chip, inverts when active |
| `PinCard` | masonry pin tile (md/lg radius) |
| `PinOverlayPill` | floating label pill on pin imagery |
| `CategoryTile` | square category thumbnail + label |
| `FeatureCard` | alternating image + copy + CTA row |
| `Modal` | scrim + login/signup card |
| `HeroCtaStrip` | dark full-width CTA band |
| `PrimaryNav` | 64px top nav |
| `FooterSection` | 4-column footer |

No additions beyond the source's own component inventory were made — every component above corresponds directly to a `components:` entry in the source `DESIGN.md`.

## Index

- `styles.css` — root stylesheet, imports everything under `tokens/`.
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `fonts.css`.
- `components/` — `buttons/`, `forms/`, `chips/`, `cards/`, `overlays/`, `navigation/`, `marketing/` (see table above).
- `guidelines/` — foundation specimen cards (colors, type, spacing, shape/elevation, brand focus ring, wordmark).
- `assets/` — `image-slot.js` (drag-and-drop image placeholder used throughout the UI kit; no real photography or logo assets were available to copy in).
- `ui_kits/discovery-web/` — click-through recreation: Home, Search Results, Creator Marketing, with a working sign-up modal.
- `thumbnail.html` — project tile.
- `SKILL.md` — Claude Code-compatible skill wrapper for this system.
- `github.md` — source repo association for sync.

## Caveats

- Built entirely from a prose design analysis, not real code/Figma/assets — treat colors, spacing, and component behavior as a faithful *reconstruction*, not a byte-exact export.
- No logo, icon set, or photography assets exist in the source; Lucide icons, Inter/Manrope fonts, and flat color placeholders stand in (see Fonts and Iconography above).
- Hover states, mobile screenshots, authenticated/logged-in chrome, and form-validation states are explicitly undocumented in the source and are only loosely approximated here.
