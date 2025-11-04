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

Bonus (Implemented)
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

Development (run inside a container with hot-reload):

```powershell
# Build a dev image that runs the Vite dev server
docker build -t tree-explorer-dev .

# Run with your project mounted so edits on the host update in the container.
# Make Vite listen on all interfaces so the host can reach it (--host 0.0.0.0).
docker run --rm -it -p 5173:5173 -v ${PWD}:/app -v /app/node_modules tree-explorer-dev npm run dev -- --host 0.0.0.0
# open http://localhost:5173
```

Using docker-compose for dev (convenience):

```powershell
docker compose -f docker-compose.dev.yml up --build
# open http://localhost:5173
```

Production
----------

This repo previously contained a multi-stage production `Dockerfile` approach. The current `Dockerfile` runs the Vite dev server. For a production image we recommend building the static `dist/` (locally or in CI) and serving it with nginx.

Options:
- Build & preview locally:

```powershell
npm ci
npm run build
npm run preview
```

- Use the included GitHub Actions workflow to build the image and upload an OCI image + `dist/` artifact (see the Actions tab).


CI build (no local Docker required)
---------------------------------

If your machine cannot run Docker (virtualization disabled), this repo includes a GitHub Actions workflow that builds the image and uploads it as an artifact on push to `main` (or when manually dispatched).

To run the workflow manually: go to the repo's Actions tab, choose "Build Docker image and artifacts" and click "Run workflow". When it completes you'll be able to download two artifacts: `image.oci` (an OCI image archive) and the `dist` folder.

To load the image locally (once you have Docker):

```powershell
# download the image.oci from Actions artifacts, then
docker pull --help # if needed
docker buildx imagetools inspect image.oci # optional inspect
# load as OCI image (Docker 20.10+ with buildx)
docker buildx build --load --platform linux/amd64 - < image.oci
# or use 'ctr' or other tools to import an OCI archive
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


One-click PowerShell helper
---------------------------

To make running the dev container from Windows easy (and to use from Docker Desktop GUI), a small helper script `dev-docker.ps1` is included at the project root. It wraps the same run arguments we used interactively and provides simple actions:

- Start the dev container and follow logs
- Stop and remove the container
- Show status or follow logs for an existing container

Usage (PowerShell):

```powershell
# Start and follow logs
.\dev-docker.ps1 -Action start

# Stop and remove
.\dev-docker.ps1 -Action stop

# Show status (is container up?)
.\dev-docker.ps1 -Action status

# Follow logs
.\dev-docker.ps1 -Action logs

# Restart the container
.\dev-docker.ps1 -Action restart
```

If you prefer Docker Desktop GUI, open the `Images` pane, find `tree-explorer-dev`, click Run and provide the same port mapping (5173) and a bind mount for your project folder if you want live reload. The PowerShell helper is handy if you want one-liners instead of clicking through the GUI.

Assessment implementation notes
--------------------------------

This repository contains a working implementation of the Tree Explorer assessment described in the prompt. Summary of what is implemented:

- Framework: React (Vite) — chosen because the project already used React and Vite provides a fast dev loop.
- Left pane: Collapsible JSON tree (Explorer-style) implemented in `src/components/TreeNode.jsx` and rendered from `src/App.jsx`.
- Import: `Import` button opens a modal (SweetAlert2) where you can paste JSON to replace the current tree.
- Select & Breadcrumb: Clicking a node selects it and the path is shown in the breadcrumb component (`src/components/Breadcrumb.jsx`). Clicking breadcrumb segments navigates.
- Delete: Nodes can be deleted (delete button in each node). Deleting shows a confirmation modal and root cannot be deleted.
- Add & Rename: Each node has Add and Rename actions implemented via SweetAlert2 modal inputs.
- Undo: Undo for the last action (add/delete/rename/import) is implemented and accessible through the Undo button in the header (history up to 50 actions).
- Persistence: Tree state persists to `localStorage` (key: `tree-explorer:data`) so page refresh preserves changes.
- Right pane: Dashed panel shows the breadcrumb and a formatted, read-only JSON view of the full object (`src/components/JSONView.jsx`).

Bonus / Notes
-------------
- Implemented bonuses: Add, Rename, Undo, formatted JSON view, breadcrumb navigation.
- Not implemented in this iteration: Drag-and-drop reparenting. This can be added with a lightweight library like `dnd-kit` or a custom drag/drop implementation.

How to run (short)
------------------
- Development (fast): `npm install` then `npm run dev` and open the URL Vite reports (usually http://localhost:5173).
- Production (Docker): `docker build -f Dockerfile.prod -t tree-explorer-prod .` then `docker run -d --name tree-explorer-prod -p 8080:80 tree-explorer-prod` (then open http://localhost:8080).

Notes / trade-offs
------------------
- The app stores state in `localStorage` for simplicity and portability. For very large JSON payloads a more robust storage (IndexedDB) or streaming parsing would be advisable.
- The undo stack stores up to 50 history snapshots. This is simple and reliable, but snapshots may be memory-heavy for very large objects.
- Drag-and-drop reparenting was left out to keep the implementation focused and small; it can be added with a controlled DnD library.


