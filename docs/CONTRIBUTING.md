# Contributing

## Setup

Follow the [quick start](../README.md#quick-start). You need Node ≥ 22.12 and Docker for Postgres.

## Workflow

1. Branch off `main`: `git checkout -b feat/short-name`.
2. Make the change and keep it focused — one feature or fix per pull request.
3. Run the checks below.
4. Open a pull request describing what changed and how you tested it. Include a screenshot (desktop and phone width) for UI changes.

## Checks

```sh
npm run build        # must succeed
npm run test:e2e     # Playwright, desktop + mobile specs
npm run db:seed      # afterwards: the review tests post reviews into your dev database
```

Every user-facing change needs an end-to-end test in `tests/e2e/`. Prefer role- and label-based locators (`getByRole`, `getByLabel`) over CSS selectors, and use the helpers in `tests/e2e/helpers.ts` (`open()` waits for React islands to hydrate).

## Code conventions

- **Styling** — Tailwind utilities with the tokens in `src/styles/global.css` (`ink`, `canvas`, `accent`, `hairline`…). Reuse the `eyebrow`, `h-display` and `link-line` utilities instead of restyling text by hand. Square corners only.
- **Responsive** — check every page at 390 px wide. Nothing may scroll sideways; `tests/e2e/mobile.spec.ts` enforces this for the main pages.
- **Islands** — use React only for interactive parts. Overlays (modals, menus) must render through `createPortal(…, document.body)`; see [ARCHITECTURE.md](ARCHITECTURE.md#performance-notes) for why.
- **Motion** — every animation needs a `prefers-reduced-motion` fallback in `global.css`.
- **Data** — schema changes go in `src/db/schema.ts`, then `npm run db:push`. Update `scripts/seed.ts` so a fresh seed still works, and document new endpoints in [API.md](API.md).
- **Products** — ids are prefixed with the gender (`w-`, `m-`, `u-`); tests rely on it.

## Commit messages

Imperative mood, short subject line, e.g. `Add half-star ratings to reviews`. Explain the why in the body when it isn't obvious.
