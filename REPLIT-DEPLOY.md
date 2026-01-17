# Command Claude and Conquer - Replit Deployment Guide

## Quick Start

### 1. Configure Environment Variables

In Replit, add these secrets:

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="generate-a-secure-random-string-here"
NEXT_PUBLIC_APP_URL=https://your-replit-url.replit.app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Deploy

Use Replit's Deploy button to deploy to production.

---

## Project Structure

```
command-claude-conquer/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── auth/          # Auth endpoints (login, signup, logout)
│   │   ├── agents/        # Agent CRUD
│   │   ├── missions/      # Mission CRUD
│   │   ├── zones/         # Map zones
│   │   ├── keys/          # API key management
│   │   └── profile/       # User profile
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main command center
│   └── onboarding/        # New user onboarding
├── components/
│   ├── 3d/               # React Three Fiber components
│   ├── agents/           # Agent-related components
│   ├── layout/           # Layout components (sidebar, topbar)
│   ├── map/              # Map components (minimap)
│   ├── missions/         # Mission-related components
│   └── ui/               # Generic UI components
├── data/                 # Static data (agent templates, skills)
├── hooks/                # Custom React hooks
├── lib/
│   ├── auth.ts          # JWT authentication utilities
│   └── db.ts            # Prisma client
├── prisma/              # Prisma schema
├── store/               # Zustand state management
└── types/               # TypeScript type definitions
```

---

## Features

### MVP Features (Implemented)

- [x] 3D Command Map with React Three Fiber
- [x] Agent visualization and selection
- [x] Zone-based map layout
- [x] JWT authentication (email/password)
- [x] User onboarding flow
- [x] Agent management sidebar
- [x] Mission list and details panel
- [x] Minimap for navigation
- [x] Real-time state with Zustand

### Coming Soon

- [ ] WebSocket real-time updates
- [ ] Mission execution with Claude API
- [ ] MCP integrations (GitHub, Slack, etc.)
- [ ] Agent leveling and XP
- [ ] Achievements system
- [ ] Team collaboration

---

## Database Schema

The Prisma schema (SQLite) includes:

- **User** - User profiles with gamification data
- **Agent** - AI agents with stats, skills, and position
- **Mission** - Missions with blueprints and progress
- **MissionAgent** - Agent-mission assignments
- **MapZone** - Map zones (barracks, mission zones)
- **UserApiKey** - Encrypted API key storage
- **McpConnection** - MCP server connections
- **ActivityLog** - User activity tracking
- **MissionTemplate** - Reusable mission templates

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **3D Engine**: React Three Fiber + Three.js
- **UI**: Tailwind CSS + shadcn/ui patterns
- **State**: Zustand
- **Database**: SQLite (via Prisma)
- **Auth**: JWT (jose + bcryptjs)
- **Animations**: Framer Motion

---

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx prisma generate` | Generate Prisma client |
| `npx prisma db push` | Push schema to database |
| `npx prisma studio` | Open Prisma Studio |

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Click | Select single agent |
| Shift+Click | Add/remove from selection |
| Drag | Box select agents |
| Escape | Clear selection |
| Space | Reset camera |
| Tab | Toggle minimap |

---

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/session` - Check session

### Resources
- `GET /api/profile` - Get user profile
- `PATCH /api/profile` - Update profile
- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `GET /api/missions` - List missions
- `POST /api/missions` - Create mission
- `PATCH /api/missions/[id]` - Update mission
- `DELETE /api/missions/[id]` - Delete mission
- `GET /api/zones` - List map zones
- `GET /api/keys` - List API keys
- `POST /api/keys` - Add API key
- `DELETE /api/keys` - Remove API key

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with Claude Code
