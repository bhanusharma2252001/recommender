# Help Study Abroad — Frontend (Simple React)

This is a minimalist React frontend for the assignment. It is plain JavaScript (no TypeScript) and designed to work with the backend microservices proxied via Nginx at the same origin.

## Features
- Admin login (calls `/auth/login`)
- Courses listing and CSV upload (calls `/api/courses/*`)
- Search bar (calls `/api/courses/search`)
- Gemini recommendations (calls `/api/recommendations`)
- Simple state management via React Context
- Client-side caching of course list using localStorage
- Responsive & minimalist UI (mobile, tablet, desktop)

## Run locally
1. From frontend folder, install deps:
```bash
npm install
```
2. Start dev server:
```bash
npm start
```
> Note: The frontend expects backend routes to be available at the same host (no CORS). If you use the provided Docker Compose + Nginx from backend, open `http://localhost` to access the app.

## Where to tweak
- `src/services/api.js` — change `base` if your proxy uses a subpath or different host.
- `src/context/AuthContext.js` — session handling.
- `src/components/*` — main UI components.

