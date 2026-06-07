import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from extractor import extract_skills
from matcher import match_skills_to_role

app = FastAPI(title="Ascent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VALID_ROLES = [
    "ml_engineer",
    "data_scientist",
    "full_stack_developer",
    "backend_developer",
    "mlops_engineer",
    "forward_deployed_engineer"
]


class AnalyzeRequest(BaseModel):
    text: str
    role: str


@app.get("/")
def root():
    return {"message": "Ascent API is running"}


@app.get("/roles")
def get_roles():
    return {"roles": VALID_ROLES}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    if request.role not in VALID_ROLES:
        return {"error": f"Invalid role. Choose from: {VALID_ROLES}"}

    skills = extract_skills(request.text)
    result = match_skills_to_role(skills, request.role)
    result["extracted_skills"] = skills

    return result