from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_cv(file: UploadFile = File(...)):

    content = await file.read()
    text = content.decode("utf-8")

    score = 100
    suggestions = []
    strengths = []

    # Strengths
    if "python" in text.lower():
        strengths.append("Strong Python skills")

    if "fastapi" in text.lower():
        strengths.append("FastAPI experience")

    if "javascript" in text.lower():
        strengths.append("JavaScript skills")

    if "project" in text.lower():
        strengths.append("Has project experience")

    # Suggestions
    if "internship" not in text.lower():
        suggestions.append("Add internship experience")
        score -= 20

    if "certification" not in text.lower():
        suggestions.append("Add certifications")
        score -= 15

    if "github" not in text.lower():
        suggestions.append("Add GitHub profile")
        score -= 10

    if "linkedin" not in text.lower():
        suggestions.append("Add LinkedIn profile")
        score -= 10

    if score < 0:
        score = 0

    return {
        "message": text,
        "score": score,
        "strengths": strengths,
        "suggestions": suggestions
    }