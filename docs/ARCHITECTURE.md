# Architecture

DCS Y2K is a server-rendered Astro app. Every page is rendered on request from PostgreSQL; interactive parts (bag, search, account modal, hero slider, reviews, mobile menu) are React islands hydrated in the browser. Navigation between pages uses Astro view transitions, so the header and the bag drawer persist without a full reload.

## Request flow

```mermaid
flowchart LR
    U([Browser]) -->|HTML request| H{Host}
    H -->|Vercel| VF[Vercel function<br/>@astrojs/vercel]
    H -->|Docker| NG[nginx :80] --> NS[Node server<br/>@astrojs/node :4321]

    VF --> A
    NS --> A

    subgraph A[Astro app]
        P[Pages<br/>/ · /shop · /product/:id · /:page]
        API[API routes<br/>GET /api/search<br/>POST /api/reviews]
        L[lib/reviews.ts<br/>ratings + validation]
    end

    P --> L
    API --> L
    P --> D[(PostgreSQL<br/>products · reviews)]
    L --> D
    API --> D

    A -->|HTML + island props| U
    U -->|hydrate| I[React islands<br/>cart · search · account<br/>hero · reviews · menu]
    I -->|fetch| API
    I <-->|nanostores| S[(Client state<br/>bag in localStorage<br/>live ratings)]
```

## Pages

| Route | Source | Data |
| --- | --- | --- |
| `/` | `src/pages/index.astro` | featured products + their ratings |
| `/shop` | `src/pages/shop.astro` | products filtered by `gender`, `category`, `q` |
| `/product/:id` | `src/pages/product/[id].astro` | product, 4 related items of the same gender, reviews |
| `/:page` | `src/pages/[page].astro` | help & about content from `src/lib/pages.ts`; 404 for unknown slugs |
| `/privacy-policy`, `/terms-of-service`, `/cookie-policy` | static Astro pages | — |

Filtering is done in SQL. A gender filter returns that gender plus `unisex`; the seed currently assigns every product a gender, so both sides stay strictly separate.

## Data model

```mermaid
erDiagram
    products ||--o{ reviews : has
    products {
        text id PK "w-… women, m-… men, u-… unisex"
        text name
        text category "jeans, hoodies, jackets, tops, sunglasses, belts, jewelry, bags"
        text gender "women | men | unisex"
        int price "whole USD"
        text description
        bool featured "shown on the home page"
        text image_url
    }
    reviews {
        serial id PK
        text product_id FK "on delete cascade"
        text author
        real rating "0.5 – 5, half steps"
        text body
        text image_url "optional customer photo"
        timestamptz created_at
    }
```

A product's rating is never stored. `ratingSummaries()` in `src/lib/reviews.ts` computes the average and count with one grouped query, so it is always live.

## Posting a review

```mermaid
sequenceDiagram
    participant B as Reviews island
    participant API as POST /api/reviews
    participant DB as PostgreSQL
    participant R as RatingSummary island

    B->>API: { productId, rating, author, body }
    API->>API: validateReview()
    alt invalid
        API-->>B: 400 { error }
    else ok
        API->>DB: insert review
        API->>DB: avg + count for product
        API-->>B: 201 { review, summary }
        B->>B: prepend review, update breakdown
        B->>R: liveRatings.setKey(productId, summary)
        R->>R: re-render stars next to the price
    end
```

## Client state

- **Bag** — `src/lib/cart.ts`. A nanostore mirrored to `localStorage` (`y2k-cart`). The drawer is `transition:persist`, so it survives page navigation.
- **Live ratings** — `src/lib/reviewStore.ts`. Lets the reviews block at the bottom of the product page update the rating next to the price.

## Performance notes

- Links prefetch on hover (`prefetch` in `astro.config.mjs`).
- Only the clicked product card gets a `view-transition-name`; naming every card made the browser snapshot ~100 images per navigation.
- Modals and the mobile menu render through a portal into `<body>`: the header uses `backdrop-filter` once the page scrolls, which would otherwise trap `position: fixed` children inside it.
- The product page runs its related-items and reviews queries in parallel.

## Deployment targets

| Target | Adapter | Entry |
| --- | --- | --- |
| Vercel | `@astrojs/vercel` (selected when `VERCEL=1`) | `.vercel/output` |
| Docker / any Node host | `@astrojs/node` standalone | `node dist/server/entry.mjs` |

In Docker, nginx caches hashed `/_astro/` assets forever and proxies everything else to the Node server. `docker-compose.yml` pins the project name to `shop` so the database volume (`shop_pgdata`) is reused regardless of the folder name.
