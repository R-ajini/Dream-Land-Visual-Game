# Dream Island 🏝️

**Explore. Discover. Collect. Dream.**

A 3D browser-based tropical island exploration and adventure game built with React, Three.js, and Node.js.

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 19 · Vite · React Router     |
| 3D Engine  | Three.js · React Three Fiber · Drei |
| Backend    | Node.js · Express 5                 |
| Database   | PostgreSQL                          |
| Auth       | JWT · bcrypt                        |

## Project Structure

```
Dream-Island/
├── client/          # React frontend
│   ├── public/      # Static assets (models, textures, sounds, images)
│   └── src/
│       ├── components/  # Reusable UI & game components
│       ├── pages/       # Route pages
│       ├── game/        # 3D game logic (Phase 2)
│       ├── hooks/       # Custom React hooks
│       ├── contexts/    # React context providers
│       ├── services/    # API service layer
│       ├── styles/      # Global styles & design tokens
│       └── utils/       # Helper utilities
├── server/          # Express backend
│   ├── config/      # App & database config
│   ├── controllers/ # Route handlers
│   ├── middleware/   # Auth & validation middleware
│   ├── routes/      # API route definitions
│   ├── models/      # Database query helpers
│   ├── services/    # Business logic
│   └── utils/       # Helper utilities
└── database/        # SQL schema & seed data
```

## Getting Started

### Prerequisites

- **Node.js** 18+ — [nodejs.org](https://nodejs.org)
- **PostgreSQL** 14+ — [postgresql.org](https://www.postgresql.org) (needed for Phase 4)

### Install & Run

```bash
# 1. Clone the repo
git clone <your-repo-url>
cd Dream-Island

# 2. Install frontend dependencies
cd client
npm install

# 3. Install backend dependencies
cd ../server
npm install

# 4. Start the frontend (in one terminal)
cd client
npm run dev

# 5. Start the backend (in another terminal)
cd server
npm run dev
```

The frontend runs at **http://localhost:5173** and the backend at **http://localhost:5000**.

## Development Phases

- [x] **Phase 1** — Project setup, UI foundation, landing page, auth pages, character select
- [ ] **Phase 2** — 3D island environment, character controller, camera, movement
- [ ] **Phase 3** — Collectibles, missions, inventory, scoring, achievements
- [ ] **Phase 4** — Authentication, PostgreSQL, REST APIs, saved progress, leaderboard
- [ ] **Phase 5** — Integration, testing, optimization, deployment

## Colour Palette

| Colour         | Hex       |
|----------------|-----------|
| Ocean Turquoise| `#55C6C2` |
| Soft Green     | `#8BCB88` |
| Cream          | `#FFF5E6` |
| Coral Pink     | `#FF8F87` |
| Sky Blue       | `#A8D8F0` |
| Dark Text      | `#34495E` |

## License

MIT
