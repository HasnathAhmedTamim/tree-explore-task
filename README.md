# Tree Explorer

A small React + Vite app that renders a collapsible JSON/object tree (Explorer-like). You can import JSON, add/rename/delete nodes, undo recent changes (in-memory), and view the selected node and full object as formatted JSON. Changes persist to the browser via localStorage.

Live demo
---------

- Replace the placeholder below with your deployed Vercel/Netlify URL after you deploy. I intentionally left this as a placeholder so you can paste your live URL.

**LIVE DEMO:** https://YOUR_VERCEL_OR_NETLIFY_URL

If you'd like, I can deploy this repository to Vercel for you and update this link.

Implemented features
--------------------

- Collapsible tree view (nested objects)
- Import JSON (modal)
- Add node, Rename node
- Delete node with confirmation (root deletion prevented)
- Undo (in-memory history stack, up to 50 changes)
- Keyboard navigation: ArrowUp / ArrowDown to move, ArrowLeft / ArrowRight to collapse/expand, Enter to toggle
- Accessible focus rings and aria labels on action buttons
- Breadcrumb for the selected node
- JSON details panel and full object panel
- Persistence via localStorage (key: 	ree-explorer:data)

Why these choices
------------------

- **Framework:** React + Vite  chosen for fast local development (Vite HMR) and a lightweight SPA scaffold.
- **Styling:** Tailwind CSS  utility-first, fast to iterate UI changes.
- **Icons:** react-icons  convenient, lightweight icon set for action buttons.

Quickstart (local development)
-----------------------------

**Prerequisites**
- Node.js 18+ and npm

**Development (PowerShell):**
# Tree Explorer

A small React + Vite app that renders a collapsible JSON/object tree (Explorer-like). You can import JSON, add/rename/delete nodes, undo recent changes (in-memory), and view the selected node and full object as formatted JSON. Changes persist to the browser via localStorage.

Live demo
---------

- Replace the placeholder URL below with your deployed Vercel/Netlify URL after you deploy. The file intentionally contains a placeholder so you can paste your live URL.

**LIVE DEMO:** https://YOUR_VERCEL_OR_NETLIFY_URL

If you'd like, I can help deploy this to Vercel and update this link once you give the deployment URL or authorize a deploy.

Implemented features
--------------------

- Collapsible tree view (nested objects)
- Import JSON (modal)
- Add node, Rename node
- Delete node with confirmation (root deletion prevented)
- Undo (in-memory history stack, up to 50 changes)
- Keyboard navigation: ArrowUp / ArrowDown to move, ArrowLeft / ArrowRight to collapse/expand, Enter to toggle
- Accessible focus rings and aria labels on action buttons
- Breadcrumb for the selected node
- JSON details panel and full object panel
- Persistence via localStorage (key: `tree-explorer:data`)

Bonus features implemented
--------------------------

- Keyboard navigation, Undo history, Docker multi-stage build, and accessibility improvements (focus rings, aria-labels)

Why these choices
------------------

- Framework: React + Vite — chosen for fast local development (Vite HMR) and a lightweight SPA scaffold.
- Styling: Tailwind CSS — utility-first, fast to iterate UI changes.
- Icons: react-icons — convenient, lightweight icon set for action buttons.

Quickstart (local development)
-----------------------------

Prerequisites

- Node.js 18+ and npm

Development (PowerShell)

```powershell
npm install
npm run dev
# open http://localhost:5173
```

Build & preview (production bundle locally)

```powershell
npm run build
npm run preview
# preview serves the built dist static assets
```

Docker (build and run)
----------------------

This repo includes a two-stage Dockerfile that builds the app with Node and serves it with nginx.

```powershell
docker build -t tree-explorer .
docker run -p 8080:80 tree-explorer
# open http://localhost:8080
```

Deploy to Netlify / Vercel (quick)
---------------------------------

Netlify (drag & drop)

1. Run `npm run build` locally.
2. Drag the generated `dist/` folder onto Netlify's site deploy panel.
3. Netlify will host it and provide a public URL.

Vercel (CLI or dashboard)

1. Install Vercel CLI or connect the repo from the Vercel dashboard.
2. Run `vercel` in the project root and follow prompts, or connect the Git repo in the dashboard for automatic deploys.

Files of interest
-----------------

- `src/App.jsx` — main app and layout (grid, sidebar, panels)
- `src/components/TreeNode.jsx` — recursive tree node renderer and action buttons
- `src/utils/tree.js` — immutable helpers for add/rename/delete/get/set operations on the object tree
- `src/index.css` — Tailwind import + custom connector / panel styling
- `Dockerfile`, `.dockerignore` — containerization

Notes, trade-offs & missing features
-----------------------------------

- Persistence is local only (localStorage). For real multi-user collaboration or server-side persistence you would wire an API/backend.
- Undo is an in-memory stack (kept in the page session). It is not persisted across page reloads.
- Arrays are supported in a limited way (deleting by index may work), but array-specific editing UX (insert at index, reordering) is not implemented.
- Drag-and-drop reordering of nodes is not implemented.
- Unit tests and CI are not included in this repository; adding tests (Jest or vitest) for `src/utils/tree.js` is recommended for production hardening.

Accessibility & keyboard support
--------------------------------

- Nodes and action buttons are keyboard-focusable and include visible focus rings.
- Keyboard navigation (Arrow keys + Enter) is supported for tree traversal and collapsing.
- Long labels include `title` and `aria-label`. An optional focus-visible tooltip component could be added for better keyboard discoverability.

Development notes
-----------------

- Local state is serialized under localStorage key `tree-explorer:data`.
- Tailwind classes are used across components. Small visual tuning is done in `src/index.css` (connectors, panel padding, mono JSON wrapping).

Recommended next improvements (optional)
---------------------------------------

- Add unit tests for `src/utils/tree.js` and a small CI pipeline (GitHub Actions) to run lint/build/tests on PRs.
- Replace native `title` with an accessible tooltip component visible on focus for keyboard users.
- Add a mobile drawer for the sidebar if you want a more compact phone UX.
- Add an optional server-backed persistence layer and make undo operate across sessions.

If you'd like, I can apply any of the recommended improvements (tests, tooltip, mobile drawer, CI, or a live deploy). Tell me which and I'll implement it.

``` 
