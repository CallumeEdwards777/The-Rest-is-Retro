# The Rest Is Retro

A vintage marketplace web app: log in, browse retro items from the 1970s to the 2000s,
view details, and buy. Built as a bootcamp group project.

**Stack:** React (Vite) client · Express + Sequelize server · MySQL database.

## Screenshot

> _Coming soon — UI is being built with Claude Design._

## Run it locally

You need Node.js and a running MySQL server.

1. **Configure the database connection** — copy `server/.env.example` to `server/.env`
   and fill in your local MySQL username/password.
2. **Install dependencies:**

   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

3. **Create and seed the database** (from `server/`):

   ```bash
   mysql -u <your-user> -p < db/schema.sql   # creates the empty vintage_db
   npm run seed                              # creates tables + 48 items, 5 categories, 3 users
   ```

4. **Start both apps** (two terminals):

   ```bash
   cd server && npm run dev    # API on http://localhost:3001
   cd client && npm run dev    # app on http://localhost:5173
   ```

5. Open http://localhost:5173 and log in with a seeded user, e.g.
   `vintage_vera` (see `server/seeds/user.json` for emails; password `password123`).

## Project layout

- `client/` — React app (components in `client/src/components/`)
- `server/` — Express API (`routes/`, `models/`, `seeds/`)
- `markdowns/DESIGN.md` — design source of truth
- `concepts/W11_TRACKER.md` — team task tracker

## Live URL

> _Not deployed yet._
