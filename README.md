# IITM Rainfall Visualization Platform

An interactive, full-stack web application designed to process, analyze, and visualize high-resolution NetCDF (.nc) meteorological rainfall datasets from the Indian Meteorological Department (IMD). 

The platform allows researchers and climate analysts to seamlessly select specific climate datasets, filter by temporal boundaries (down to a specific year/month), and view precise grid-cell rainfall intensity overlays mapped directly onto a geographical boundary map of India.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS, Zustand (State Management), React Leaflet / Leaflet.js
- **Backend:** FastAPI (Python), Uvicorn, Xarray, NetCDF4, NumPy, Pydantic
- **Development Tools:** Git, VS Code, Conda/Python Virtual Environments

---

## 🚀 What's Done (Phase 1 MVP)

We have successfully built and verified the core end-to-end MVP architecture:

### Backend (Data Processing & API)
* **Dynamic Data Discovery:** Built an auto-discovery API endpoint (`/dataset/list`) that dynamically scans the backend data directory for available `.nc` cluster files.
* **Robust NetCDF Parsing:** Implemented an automated dimension and variable detection service (`nc_reader.py`) that maps variant IMD naming conventions (e.g., `TIME`, `LATITUDE`, `rf`, `rain`) into a standard internal matrix.
* **Lazy Loading & Slicing:** Optimized processing using `xarray` to lazily load heavy datasets, executing temporal slicing and spatial coordinate cleanups in memory *only after* filtering to ensure minimal API latency.
* **Debug & Inspection Utilities:** Integrated a dedicated `/dataset/debug/{name}` endpoint to quickly inspect raw coordinate shapes, dimensions, and time samples directly via the browser.

### Frontend (Map Visualization UI)
* **Interactive Leaflet Map:** Structured a dedicated React-Leaflet container centered geographically on India with fixed bounding and map opacity configurations.
* **Dynamic Grid Rendering:** Developed a custom `RainfallLayer` that maps multi-dimensional JSON response arrays into perfectly scaled, geographical coordinate rectangles over the map.
* **Interactive Tooltips:** Added hovering tooltips to each grid cell to dynamically display precise localized rainfall readings in millimeters (`mm`).
* **Global State Flow:** Configured a centralized Zustand store (`useMapStore`) to cleanly handle synchronization between dataset pickers, HTML5 month selectors, loading states, and the map canvas layer.

---

## 📂 Current Repository Structure

```text
iitm-rainfall-platform/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app initialization & CORS middleware
│   │   ├── config.py            # Base environment settings & data path tracking
│   │   ├── routers/
│   │   │   └── dataset.py       # Core API routes (/list, /query, /debug)
│   │   ├── services/
│   │   │   └── nc_reader.py     # Xarray NetCDF extraction logic & NaN handling
│   │   └── schemas/
│   │       └── query.py         # Pydantic validation models
│   ├── data/                    # Storage directory for .nc files (Git-ignored)
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   └── page.tsx         # Sidebar controls and layout architecture
│   │   ├── components/
│   │   │   ├── map/             # IndiaMap and RainfallLayer Leaflet modules
│   │   │   ├── controls/        # Date and dataset picker controls
│   │   │   └── legend/          # Color mapping visual reference
│   │   ├── lib/
│   │   │   ├── api.ts           # Axios backend API client
│   │   │   └── colorScale.ts    # Rainfall threshold hex values mapping
│   │   ├── store/
│   │   │   └── useMapStore.ts   # Zustand global state coordinator
│   │   └── types/
│   │       └── rainfall.ts      # Shared TypeScript interfaces
│   └── .env.local               # Environment variable targeting local backend
├── .gitignore                   # Safety rules ensuring raw data files remain un-tracked
└── README.md
