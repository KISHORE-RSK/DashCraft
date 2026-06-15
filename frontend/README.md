# Dynamic Analytics & Visualization Dashboard

## 📊 Project Overview
The **Dynamic Analytics Dashboard** is a full-stack web application designed to automatically ingest, analyze, and visualize structured data (CSV, Excel, JSON). It eliminates the need for manual chart configuration by utilizing a smart backend engine that detects column types, computes aggregations, and dictates the optimal visualization strategies. The frontend dynamically consumes this structured metadata to render an interactive, aesthetically pleasing dashboard.

## 🚀 Key Features

*   **Smart Data Analysis (Backend):** Automatically cleanses data, aggressively casts numeric columns, detects categorical variables, and computes essential KPIs directly from raw uploads.
*   **Dynamic Chart Rendering Engine:** The frontend maps over a dynamically generated `charts` array, seamlessly deciding which React component (Bar, Stacked Bar, Area, Radar, etc.) to render based on the API response.
*   **Hybrid Visualization Stack:** Combines the declarative ease of **Recharts** for Cartesian grids (Line, Area, Radar, Bar) with the low-level customizability of **D3.js** for radial layouts (Donut and Pie charts).
*   **Premium UI/UX:** Features a cohesive "Coffee and Olive" glassmorphic color scheme, animated hover states, and fully responsive layouts built using Tailwind CSS.
*   **Multi-format Support:** Accepts `.csv`, `.xlsx`, `.xls`, and `.json` file formats effortlessly.

---

## 🛠️ Technology Stack

**Frontend**
*   **React + Vite:** For lighting-fast hot module replacement and component-based architecture.
*   **Tailwind CSS:** For rapid, utility-first styling and responsive grid layouts.
*   **Recharts:** For declarative SVG charts (Clustered Column, Stacked Bar, Histogram, Line, Area, Radar).
*   **D3.js (v7):** For bespoke, highly animated radial visualizations (`D3DonutChart`, `D3PieChart`).
*   **Lucide React:** For sleek, modern iconography.

**Backend**
*   **FastAPI:** High-performance async Python web framework for API routing and file handling.
*   **Pandas:** For robust dataframe manipulation, missing value imputation, and statistical aggregation.
*   **Uvicorn:** ASGI web server implementation.

---

## 🧠 System Architecture

### 1. Data Ingestion & Processing (`backend/main.py`)
When a user uploads a file, the FastAPI `/api/upload` endpoint intercepts the file bytes into a Pandas DataFrame. The `smart_analyze()` function is invoked to:
1.  **Cleanse**: Drop fully empty columns and strip erratic characters (like `$`, `%`) to force numeric casting.
2.  **Categorize**: Segregate columns into `num_cols` (numeric) and `cat_cols` (categorical/dimensions).
3.  **Aggregate**: Generate up to 8 different chart data structures (e.g., grouping by the primary category and calculating the mean for numeric keys).
4.  **Format**: Return a unified JSON schema containing a `kpis` array and a `charts` array specifying the `type`, `data`, `xAxisKey`, and `dataKeys`.

### 2. Dynamic Frontend Rendering (`Dashboard.jsx`)
Instead of hardcoding individual chart sections, the dashboard utilizes a mapping function over `data.charts`.
A `switch(type)` statement dictates the rendering logic:
*   **`bar` / `stacked_bar` / `horizontal_bar`**: Renders standard Cartesian comparisons.
*   **`area` / `line`**: Renders trend analyses with SVG gradients.
*   **`radar`**: Plots multivariate profiles on a polar grid.
*   **`donut` / `pie`**: Bypasses Recharts entirely and mounts custom React components (`D3DonutChart`, `D3PieChart`) that manipulate the DOM using D3's `d3.pie()` and `d3.arc()` generators.

---

## 🎨 D3.js Integration Details
To achieve a higher level of control over animations and tooltips for radial charts, the project includes custom D3 wrappers:
*   **React Lifecycle Sync:** Uses `useRef` to target DOM nodes and `useEffect` to trigger D3 rendering cycles only when the underlying `data` prop changes.
*   **Cleanup Phase:** Clears the previous SVG (`d3.select(svgRef.current).selectAll('*').remove()`) to prevent memory leaks during React re-renders.
*   **Custom Interactions:** Implements scale transformations (`scale(1.05)`) on arc hover and absolute positioned HTML tooltips for superior styling compared to standard SVG text.

---

## ⚙️ Setup and Installation

### Running the Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # (or `venv\Scripts\activate` on Windows)
pip install fastapi uvicorn pandas openpyxl python-multipart
python -m uvicorn main:app --reload
```
*Backend will be available at `http://localhost:8000`*

### Running the Frontend
```bash
cd frontend
npm install
npm run dev
```
*Frontend will be available at `http://localhost:5173`*

---

## 🔮 Future Enhancements
*   **Export Functionality:** Allow users to export the generated dashboard to PDF or PNG.
*   **Custom Chart Palettes:** Let users pick color themes natively from the UI.
*   **Drill-down Capabilities:** Click on a bar or pie slice to filter the underlying Pandas dataframe and re-calculate all other KPIs contextually.
