# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Basketball Substitution Manager - A React-based web application for managing basketball team substitutions with drag-and-drop functionality. Players can be added to a team, moved between bench and court positions, and substitutions can be queued and executed as a batch.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build production bundle (output to dist/)
npm run build

# Preview production build
npm run preview

# Or use Makefile shortcuts:
make dev          # Install deps and start dev server
make build        # Build production bundle
```

## Docker & Deployment

```bash
# Build Docker image
make build-image
# or: docker build -t basketball-sub:latest .

# Run container locally on port 8080
make docker-run
# or: docker run --rm -p 8080:80 basketball-sub:latest

# Build Helm chart
make build-chart

# Deploy to Kubernetes with Helm
helm install basketball-sub helm/basketball-sub
```

## Architecture

### State Management (App.jsx)

The application uses React useState hooks with localStorage persistence. All state (players, courtPlayers, pendingSubstitutions) is automatically saved to localStorage on every change via useEffect.

**Core State:**
- `players[]` - Array of all players with id, name, onCourt status, and optional lastRemovedTime
- `courtPlayers{}` - Object mapping 5 positions to player objects or null
- `pendingSubstitutions[]` - Array of queued substitutions with playerOut, playerIn, position

**Player Lifecycle:**
1. Added via AddPlayer component → added to players[] with onCourt: false
2. Dragged to court → courtPlayers[position] set, player.onCourt = true
3. Removed from court → courtPlayers[position] = null, player.onCourt = false, player.lastRemovedTime set
4. Deleted → removed from players[], courtPlayers, and pendingSubstitutions

### Component Structure

```
App (main state & logic)
├── AddPlayer (left panel - add new players)
├── Bench (left panel - draggable bench players, sorted by lastRemovedTime)
├── Court (center - 5 positions with drag-and-drop)
│   └── Shows position numbers 1-5 (PG, SG, SF, PF, C)
└── SubstitutionManager (right panel - pending subs queue)
```

### Drag-and-Drop Behavior

Implemented using HTML5 Drag and Drop API:
- **Bench → Empty Court Position**: Player moves to court
- **Bench → Occupied Court Position**: Creates a pending substitution (does not execute immediately)
- **Court → Court**: Player moves positions
- Data transfer via JSON.stringify/parse of player object

### Substitution System

Two ways to create substitutions:
1. **Sub button**: Click "Sub" on court player → select bench player from dropdown → adds to queue
2. **Drag to occupied position**: Drag bench player onto occupied court position → adds to queue

Substitutions are batched and executed together when "Execute All Substitutions" is clicked. This updates courtPlayers and player statuses in a single atomic operation.

### Bench Sorting

Bench players are sorted with most recently removed players at the bottom:
- Players never on court appear first
- Players previously on court sorted by lastRemovedTime (oldest → newest)
- This helps coaches track who rested longest

## Key Files

- `src/App.jsx` - Main component with all state management and business logic
- `src/components/Court.jsx` - Court positions, drag-and-drop handlers, substitution menu
- `src/components/Bench.jsx` - Bench players list with drag capability
- `src/components/SubstitutionManager.jsx` - Pending substitutions queue UI
- `src/components/AddPlayer.jsx` - Player creation form
- `Dockerfile` - Multi-stage build with nginx serving
- `Makefile` - Build automation for Docker and Helm
- `helm/basketball-sub/` - Helm chart with support for ClusterIP, NodePort, LoadBalancer, Ingress, and Gateway API

## Important Implementation Details

- **IDs**: All players and substitutions use `Date.now()` for unique IDs
- **Deletion confirmation**: Deleting a player from bench requires window.confirm
- **Position constants**: Defined as array in App.jsx: `['Point Guard', 'Shooting Guard', 'Small Forward', 'Power Forward', 'Center']`
- **Position numbers**: Mapped in Court.jsx (PG=1, SG=2, SF=3, PF=4, C=5)
- **LocalStorage key**: `'basketball-sub-data'`

## Deployment Options

The Helm chart supports multiple Kubernetes exposure methods:
- **ClusterIP** (default) - Internal only
- **NodePort** - Exposed on node ports
- **LoadBalancer** - Cloud load balancer
- **Ingress** - HTTP/HTTPS routing with nginx
- **Gateway API** - Service mesh integration

See README.md for detailed Helm deployment examples.
