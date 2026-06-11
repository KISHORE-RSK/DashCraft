import io
import json

import numpy as np
import pandas as pd
from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/api/login")
async def login(req: LoginRequest):
    if req.username == "admin" and req.password == "admin123":
        return {"token": "mock-jwt-token-12345"}
    raise HTTPException(status_code=401, detail="Invalid credentials")


def smart_analyze(df: pd.DataFrame) -> dict:
    """Dynamically analyze any uploaded DataFrame and produce 8-chart dashboard data."""

    # --- Clean up ---
    df = df.dropna(axis=1, how="all")
    df.columns = [str(c).strip() for c in df.columns]

    # --- Aggressively convert to numeric ---
    for c in df.columns:
        if df[c].dtype == 'object' or str(df[c].dtype) == 'category':
            cleaned = df[c].astype(str).str.replace(r'[$,% ]', '', regex=True)
            converted = pd.to_numeric(cleaned, errors='coerce')
            non_empty = (cleaned != '') & (cleaned != 'nan') & (cleaned != 'NaN')
            if non_empty.sum() > 0 and converted.notna().sum() / non_empty.sum() > 0.5:
                df[c] = converted

    # --- Detect column types ---
    num_cols = [c for c in df.columns if pd.api.types.is_numeric_dtype(df[c])]
    cat_cols = [c for c in df.columns if not pd.api.types.is_numeric_dtype(df[c])]

    # If every col is numeric but one has few unique values, treat it as categorical
    if not cat_cols:
        for col in num_cols[:]:
            if df[col].nunique() <= 15:
                cat_cols = [col]
                num_cols = [c for c in num_cols if c != col]
                break

    primary_cat = cat_cols[0] if cat_cols else None
    primary_num = num_cols[0] if num_cols else None
    total_rows = len(df)

    # ── 1. KPIs ──────────────────────────────────────────────────────────────
    kpi_list = []
    kpi_list.append({
        "label": "Total Records",
        "value": f"{total_rows:,}",
        "trend": f"{len(df.columns)} columns",
        "color": "blue",
    })

    for col in num_cols[:4]:
        mean_val = df[col].mean()
        max_val  = df[col].max()
        min_val  = df[col].min()
        kpi_list.append({
            "label": f"Avg {col}",
            "value": f"{mean_val:.1f}",
            "trend": f"Max: {max_val:.1f} | Min: {min_val:.1f}",
            "color": ["emerald", "amber", "purple", "cyan"][len(kpi_list) % 4],
        })

    # Pad to at least 2 KPIs
    while len(kpi_list) < 2:
        kpi_list.append({"label": "–", "value": "–", "trend": "", "color": "slate"})

    # ── 2. Clustered Column ───────────────────────────────────────────────────
    clustered_column = []
    cluster_keys = num_cols[:2] if len(num_cols) >= 2 else num_cols[:1]

    if primary_cat and cluster_keys:
        grp = df.groupby(primary_cat)[cluster_keys].mean().round(2).reset_index().head(8)
        for _, row in grp.iterrows():
            item = {"name": str(row[primary_cat])[:20]}
            for k in cluster_keys:
                item[k] = round(float(row[k]), 2)
            clustered_column.append(item)
    elif cluster_keys:
        sample = df[cluster_keys].head(8).reset_index(drop=True)
        for i, row in sample.iterrows():
            item = {"name": f"Row {i+1}"}
            for k in cluster_keys:
                item[k] = round(float(row[k]), 2)
            clustered_column.append(item)

    # ── 3. Histogram ─────────────────────────────────────────────────────────
    histogram = []
    hist_key = primary_num
    hist_col_label = primary_num or "Count"

    if hist_key:
        col_data = df[hist_key].dropna()
        counts, bin_edges = np.histogram(col_data, bins=min(8, col_data.nunique()))
        for i in range(len(counts)):
            histogram.append({
                "range": f"{bin_edges[i]:.1f}–{bin_edges[i+1]:.1f}",
                hist_col_label: int(counts[i]),
            })

    # ── 4. Stacked Column ────────────────────────────────────────────────────
    stacked_column = []
    stacked_keys = num_cols[:6]

    if primary_cat and stacked_keys:
        grp = df.groupby(primary_cat)[stacked_keys].mean().round(2).reset_index().head(6)
        for _, row in grp.iterrows():
            item = {"name": str(row[primary_cat])[:20]}
            for k in stacked_keys:
                item[k] = round(float(row[k]), 2)
            stacked_column.append(item)
    elif stacked_keys:
        sample = df[stacked_keys].head(6).reset_index(drop=True)
        for i, row in sample.iterrows():
            item = {"name": f"Row {i+1}"}
            for k in stacked_keys:
                item[k] = round(float(row[k]), 2)
            stacked_column.append(item)

    # ── 5. Horizontal Bar (Top N) ─────────────────────────────────────────────
    horizontal_bar = []
    horiz_key = primary_num

    if primary_cat and horiz_key:
        top = df.nlargest(10, horiz_key)[[primary_cat, horiz_key]]
        for _, row in top.iterrows():
            horizontal_bar.append({"name": str(row[primary_cat])[:20], horiz_key: round(float(row[horiz_key]), 2)})
    elif horiz_key:
        top = df.nlargest(10, horiz_key)[[horiz_key]].reset_index()
        for _, row in top.iterrows():
            horizontal_bar.append({"name": f"Row {int(row['index'])+1}", horiz_key: round(float(row[horiz_key]), 2)})

    # ── 6. Radar ─────────────────────────────────────────────────────────────
    radar = []
    radar_cols = num_cols[:6]

    for col in radar_cols:
        col_max = df[col].max()
        col_mean = df[col].mean()
        normalized = round((col_mean / col_max * 100) if col_max and col_max != 0 else 0, 1)
        radar.append({"subject": col[:14], "Score": normalized, "fullMark": 100})

    # ── 7. Donut ─────────────────────────────────────────────────────────────
    donut = []

    if primary_cat:
        counts = df[primary_cat].value_counts().head(5)
        for name, count in counts.items():
            donut.append({"name": str(name)[:20], "value": int(count)})
    elif primary_num:
        median = df[primary_num].median()
        above  = int((df[primary_num] >= median).sum())
        below  = int((df[primary_num] < median).sum())
        donut = [
            {"name": f"≥ {median:.1f}", "value": above},
            {"name": f"< {median:.1f}", "value": below},
        ]

    # ── 8. Line / Trend ──────────────────────────────────────────────────────
    smooth_line = []
    line_keys = num_cols[:2]
    line_x_label = primary_cat

    if line_x_label and line_keys:
        # Use categorical as x-axis
        grp = df.groupby(line_x_label)[line_keys].mean().round(2).reset_index().head(12)
        for _, row in grp.iterrows():
            item = {"name": str(row[line_x_label])[:15]}
            for k in line_keys:
                item[k] = round(float(row[k]), 2)
            smooth_line.append(item)
    elif line_keys:
        # Sample evenly across all rows
        step = max(1, total_rows // 12)
        sampled = df.iloc[::step].head(12).reset_index(drop=True)
        for i, row in sampled.iterrows():
            item = {"name": f"#{i+1}"}
            for k in line_keys:
                item[k] = round(float(row[k]), 2)
            smooth_line.append(item)

    # ── Meta (sent to frontend so it knows dynamic key names) ─────────────────
    meta = {
        "primary_cat":    primary_cat,
        "primary_num":    primary_num,
        "cluster_keys":   cluster_keys,
        "stacked_keys":   stacked_keys,
        "hist_key":       hist_col_label,
        "horiz_key":      horiz_key,
        "line_keys":      line_keys,
        "radar_cols":     radar_cols,
        "total_rows":     total_rows,
    }

    return {
        "meta": meta,
        "kpis": kpi_list,
        "clustered_column": clustered_column,
        "histogram":        histogram,
        "stacked_column":   stacked_column,
        "horizontal_bar":   horizontal_bar,
        "radar":            radar,
        "donut":            donut,
        "smooth_line":      smooth_line,
    }


@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content  = await file.read()
        filename = file.filename.lower()

        df = None
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        elif filename.endswith(".json"):
            data = json.loads(content)
            df   = pd.DataFrame(data if isinstance(data, list) else [data])
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type. Use CSV, Excel, or JSON.")

        if df is None or df.empty:
            raise HTTPException(status_code=400, detail="File is empty or could not be parsed.")

        return smart_analyze(df)

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error processing file: {e}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}") from e
