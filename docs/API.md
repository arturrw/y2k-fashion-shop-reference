# API

Two JSON endpoints, both served by the Astro app under `/api`. There is no authentication.

## `GET /api/search`

Product suggestions for the search box. Matches the name or description, case-insensitive. `%` and `_` in the query are matched literally.

| Query param | Required | Notes |
| --- | --- | --- |
| `q` | yes | at least 2 characters after trimming, otherwise the result is `[]` |

**200**, at most 6 items:

```json
[
  { "id": "w-hood-1", "name": "Star Motif Zip Hoodie", "price": 46 },
  { "id": "m-hood-5", "name": "Spider Web Zip Hoodie", "price": 54 }
]
```

```sh
curl "http://localhost:4321/api/search?q=hoodie"
```

## `POST /api/reviews`

Adds a review and returns the product's updated rating.

Request body (`Content-Type: application/json`):

| Field | Type | Rules |
| --- | --- | --- |
| `productId` | string | must be an existing product id |
| `rating` | number | 0.5 – 5 in steps of 0.5 |
| `author` | string | 1 – 40 characters after trimming |
| `body` | string | 3 – 1000 characters after trimming |

```sh
curl -X POST http://localhost:4321/api/reviews \
  -H "Content-Type: application/json" \
  -d '{"productId":"w-jeans-1","rating":4.5,"author":"Mia","body":"Perfect low rise."}'
```

**201**

```json
{
  "review": {
    "id": 612,
    "author": "Mia",
    "rating": 4.5,
    "body": "Perfect low rise.",
    "imageUrl": null,
    "createdAt": "2026-10-02T12:00:00.000Z"
  },
  "summary": { "avg": 4.6, "count": 7 }
}
```

`summary.avg` is rounded to one decimal.

**Errors** — the body is always `{ "error": "<message>" }`:

| Status | When |
| --- | --- |
| 400 | body is not JSON, or a field breaks the rules above (e.g. `"Choose a rating from 0.5 to 5 stars."`) |
| 404 | `productId` does not exist |

Validation lives in `validateReview()` in `src/lib/reviews.ts`.
