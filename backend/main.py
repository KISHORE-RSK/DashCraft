from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import json
import io

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

# Pre-made mock data matching the requested light-theme student dashboard
MOCK_DATA = {
    "kpis": {
        "total_students": "2,450",
        "total_students_trend": "+12% vs last month",
        "average_score": "78.4",
        "average_score_trend": "+4.2% vs last month",
        "top_score": "98",
        "top_score_trend": "+2.1% vs last month",
        "pass_rate": "86%",
        "pass_rate_trend": "+5.1% vs last month",
        "active_students": "2,120",
        "active_students_trend": "+8.3% vs last month"
    },
    "clustered_column": [
        {"name": "C++", "Average Score": 84.6},
        {"name": "Java", "Average Score": 82.3},
        {"name": "Python", "Average Score": 83.7},
    ],
    "histogram": [
        {"range": "0-20", "Students": 5},
        {"range": "21-40", "Students": 30},
        {"range": "41-60", "Students": 38},
        {"range": "61-79", "Students": 79},
        {"range": "79-100", "Students": 45},
    ],
    "stacked_column": [
        {"name": "C++", "Theory": 14, "Practice": 10, "Frameworks": 17, "Assignment": 16, "Quiz": 18, "Coding": 14},
        {"name": "Java", "Theory": 12, "Practice": 19, "Frameworks": 15, "Assignment": 16, "Quiz": 17, "Coding": 13},
        {"name": "Python", "Theory": 19, "Practice": 15, "Frameworks": 15, "Assignment": 16, "Quiz": 16, "Coding": 13},
    ],
    "horizontal_bar": [
        {"name": "Alice Brown", "Score": 98},
        {"name": "John Doe", "Score": 95},
        {"name": "Mary Smith", "Score": 92},
        {"name": "David Wilson", "Score": 90},
        {"name": "Chris Lee", "Score": 87},
        {"name": "Kavita Reddy", "Score": 85},
        {"name": "Sam Green", "Score": 83},
        {"name": "Priya Sen", "Score": 81},
        {"name": "Daniel Kim", "Score": 79},
        {"name": "Aarav Patel", "Score": 78},
    ],
    "radar": [
        {"subject": "Coding", "Score": 85, "fullMark": 100},
        {"subject": "Quiz", "Score": 75, "fullMark": 100},
        {"subject": "Assignment", "Score": 90, "fullMark": 100},
        {"subject": "Practical", "Score": 88, "fullMark": 100},
        {"subject": "Homework", "Score": 92, "fullMark": 100},
        {"subject": "Theory", "Score": 78, "fullMark": 100},
    ],
    "donut": [
        {"name": "Passed", "value": 2107},
        {"name": "Failed", "value": 343},
    ],
    "smooth_line": [
        {"name": "Assessment 1", "Score": 72.4},
        {"name": "Assessment 2", "Score": 74.8},
        {"name": "Assessment 3", "Score": 76.9},
        {"name": "Assessment 4", "Score": 78.4},
        {"name": "Final", "Score": 79.6},
    ]
}

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        content = await file.read()
        filename = file.filename.lower()

        # Try to parse the data
        df = None
        if filename.endswith(".csv"):
            df = pd.read_csv(io.BytesIO(content))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(io.BytesIO(content))
        elif filename.endswith(".json"):
            df = pd.read_json(io.BytesIO(content))
        else:
            return MOCK_DATA

        if df is None or df.empty:
            return MOCK_DATA

        custom_data = MOCK_DATA.copy()
        custom_data["kpis"]["total_students"] = str(len(df))
        return custom_data

    except Exception as e:
        print(f"Error processing file: {e}")
        return MOCK_DATA
