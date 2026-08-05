# The Rest Is Retro — Design source of truth

This file is the single canonical design reference for the app. The old brand docs
(two READMEs, Retro Brand Kit, wireframes) and the AI-generated logos in `concepts/`
were placeholder work and have been deleted. The real design system is being built in
Claude Design (claude.ai/design) from Martim's new palette and style reference.

## Palette & typography

Palette confirmed by Martim 2026-08-05 (taken from the presentation deck, so slides
and app match). Mockups applying all of this live in `concepts/mockups/` — open
`concepts/mockups/index.html` for the gallery.

The four decided screens (browse in Direction B, item detail, login, confirm) plus
`tokens.css` and sample item photos are synced to the Claude Design project
**"The Rest Is Retro"** at claude.ai/design — iterate on them there; implementation
pulls from that project.

| Name | Hex | Use |
| --- | --- | --- |
| Cream | `#FFFBED` | Page background |
| Ink | `#211B12` | Text, dark chips |
| Burnt Orange | `#D34A24` | Primary buttons, headline accent, 70s era badge |
| Deep Orange | `#992800` | Button hover state |
| Teal | `#3C7F72` | Verified badges, secondary accent, 90s era badge |
| Amber | `#FFC107` | Highlights, stamps, avatars, 80s era badge |
| White | `#FFFFFF` | Cards |

Era badge colours: 1970s orange · 1980s amber · 1990s teal · 2000s/Y2K ink.

**Typography** (Google Fonts): body is **Inter**. Headline font is the ONE open
decision, two directions mocked up:

- **Direction A "Poster"** — Archivo Black: THR!FT-style bold poster energy
  (`concepts/mockups/browse-a-poster.html`).
- **Direction B "Cooper"** — Fraunces 900: softer 70s Cooper-Black warmth
  (`concepts/mockups/browse-b-cooper.html`).

**DECIDED (Martim, 2026-08-05): Direction B — Fraunces 900 headlines.** Components (rounded cards, pill chips/buttons,
1px warm borders, sticky cream header) are shared across both and defined in
`concepts/mockups/tokens.css`.

## Ground truth data (what the seeded database actually contains)

These are facts from `server/seeds/` — designs must match them, not the other way round.

- **Eras (4):** 1970s, 1980s, 1990s, 2000s — 12 items each, 48 items total.
- **Categories (5):** Clothing, Electronics, Furniture, Vinyl & Music, Toys & Games.
- **Item fields:** `item_id` (e.g. `TRR-70S-CLO-1001`), `title`, `description`, `era`,
  `price`, `currency` (GBP), `status`, `seller_id`, `category_id`.
- **Item images:** `client/public/item-images/<item_id>.jpg` — one per item, 1:1 match.
  In the client, reference them as `/item-images/${item.item_id}.jpg`.
- **Seeded users (3):** `vintage_vera`, `disco_dan`, `y2k_yasmin` — password `password123`
  (emails are in `server/seeds/user.json`).

## Screens (build in this order)

1. **Login / Signup** — working; needs styling.
2. **Browse** (`/`) — grid of item cards with image, title, era, price.
3. **Item detail** (`/item/:id`) — image, description, price, Buy button.
4. **Buy flow** — does not exist yet (no order model/route on the server). This is the
   headline feature to build. Simplest acceptable version: Buy sets the item's `status`
   to `sold` and confirms to the user.
5. **List an item** (`/create-item`) — working basic form; needs styling.

## Deferred / known gaps (punch list)

- No order/purchase model or route — Buy button currently only logs to console.
- `SavedItems.jsx` has no backing endpoint and is not routed.
- Item photo uploads (ported from the teacher's `jason/backup-plan` branch): POST/PUT
  `/api/items` accept a multipart `image` file; files land in `server/uploads/`
  (gitignored) and are served at `/uploads/`. Seeded items keep the
  `/item-images/<item_id>.jpg` convention; `image_url` wins when present.
- Sequelize associations in `server/models/index.js` use camelCase foreign keys
  (`categoryId`, `userId`) while models declare snake_case columns — works, but creates
  confusing duplicate-ish columns; tidy if it causes trouble.
- JWT secret is hardcoded in `server/utils/auth.js` — move to `.env` before deploy.
- `server/.env` was removed from git tracking but its password remains in git history —
  rotate or purge history before the repo is submitted publicly.
- No CSS framework chosen; styling comes from the Claude Design system.
