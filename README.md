# Tree Explorer

A small React + Vite app that renders a collapsible JSON/object tree (Explorer-like). You can import JSON, add/rename/delete nodes, undo recent changes (in-memory), and view the selected node and full object as formatted JSON. Changes persist to the browser via localStorage.

Live demo
---------

- Replace the placeholder below with your deployed Vercel URL after you deploy.

**LIVE DEMO:** https://tree-explore-task.vercel.app/

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
- Full Object panel (formatted JSON)
- Persistence via localStorage (key: `tree-explorer:data`)

Bonus (nice-to-have)
-------------------

The project includes three of the four listed bonus items:

- [x] Add and Rename option in each node (and Add Root)
- [x] Undo for the last action (add/delete/rename) — in-memory history
- [x] Show formatted JSON (Full Object panel)
- [ ] Drag-and-drop to move nodes (re-parenting) — not implemented yet (can be added with dnd-kit)

Quickstart
----------

Prerequisites: Node.js 18+ and npm

Development (PowerShell):

```powershell
npm install
npm run dev
# open the URL Vite reports (usually http://localhost:5173)
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
- Vercel: connect the repo in the dashboard or run `vercel` from the project root.

Files of interest
-----------------
- `src/App.jsx` — app shell, state and layout
- `src/components/TreeNode.jsx` — recursive tree renderer and actions
- `src/utils/tree.js` — immutable helpers for tree operations
- `src/index.css` — Tailwind + small visual tweaks

