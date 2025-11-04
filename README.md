# Tree Explorer

A small React + Vite app that renders a collapsible JSON/object tree (Explorer-like). You can import JSON, add/rename/delete nodes, undo recent changes (in-memory), and view the selected node and full object as formatted JSON. Changes persist to the browser via localStorage.

Live demo
---------

- Replace the placeholder below with your deployed Vercel/Netlify URL after you deploy. I intentionally left this as a placeholder so you can paste your live URL.

**LIVE DEMO:** https://tree-explore-task.vercel.app/

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
# Tree Explorer

A compact React + Vite app for exploring and editing JSON as a collapsible tree.

Live demo
---------

**LIVE DEMO:** https://tree-explore-task.vercel.app/

Quick summary
-------------
- Import JSON and render it as a collapsible tree
- Add / Rename / Delete nodes (root delete prevented)
- Undo stack (in-memory), keyboard navigation, and accessibility improvements
- Persistence via localStorage (key: `tree-explorer:data`)

Quickstart
----------

Prerequisites: Node.js 18+ and npm

Development (PowerShell):

```powershell
npm install
npm run dev
# open http://localhost:5173 (or the port Vite reports)
```

Build & preview:

```powershell
npm run build
npm run preview
```

Docker
------

Build and run the included two-stage image:

```powershell
docker build -t tree-explorer .
docker run -p 8080:80 tree-explorer
# open http://localhost:8080
```

Deploy
------
- Netlify: build and drag the `dist/` folder onto Netlify's deploy panel.
- Vercel: connect the repo in the dashboard or run `vercel` from the project root.

Files of interest
-----------------
- `src/App.jsx` — app shell, state and layout
- `src/components/TreeNode.jsx` — recursive tree renderer and actions
- `src/utils/tree.js` — immutable helpers for tree operations
- `src/index.css` — Tailwind + small visual tweaks

Notes & next steps
------------------
- Persistence is local only. For multi-user or server persistence, wire an API/backend.
- Recommended extras: unit tests for `src/utils/tree.js`, search/virtualization for very large JSON, and an accessible tooltip for long labels.

If you want this README even shorter or tailored for a portfolio page, tell me which details to remove or highlight.
````
Recommended next improvements (optional)
