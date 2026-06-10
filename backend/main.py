print("MAIN.PY LOADED")
import json
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from extractor import extract_skills
from matcher import match_skills_to_role
import pdfplumber
import io
from fastapi import FastAPI, UploadFile, File
from typing import Any, Optional
from fastapi import FastAPI, UploadFile, File, Request
import requests
import os
from dotenv import load_dotenv
import supabase
from supabase import create_client, Client

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.getenv("SUPABASE_SECRET_KEY")

print("KEY LOADED:", bool(GROQ_API_KEY))
print("SUPABASE LOADED:", bool(SUPABASE_URL and SUPABASE_SECRET_KEY))

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

app = FastAPI(title="Ascent API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
    expose_headers=["*"],
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

class ReportRequest(BaseModel):
    role: str = ""
    match_percent: float = 0
    matched_skills: list = []
    missing_core: list = []
    missing_good_to_have: list = []
    extracted_skills: list = []


@app.get("/")
def root():
    return {"message": "Ascent API is running"}


@app.get("/roles")
def get_roles():
    return {"roles": VALID_ROLES}


@app.post("/extract-pdf")
async def extract_pdf(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        with pdfplumber.open(io.BytesIO(contents)) as pdf:
            text = ""
            for page in pdf.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        if not text.strip():
            return {"error": "Could not extract text from PDF. Try a text-based PDF."}
        return {"text": text.strip()}
    except Exception as e:
        return {"error": f"Failed to process PDF: {str(e)}"}


@app.post("/analyze")
def analyze(request: AnalyzeRequest):
    if request.role not in VALID_ROLES:
        return {"error": f"Invalid role. Choose from: {VALID_ROLES}"}

    skills = extract_skills(request.text)
    result = match_skills_to_role(skills, request.role)
    result["extracted_skills"] = skills

    return result


# ─── helper: get user_id from the JWT the frontend sends ───────────────────────
def get_user_id(authorization: Optional[str]) -> Optional[str]:
    """
    Extracts user_id from the Bearer token sent by the React frontend.
    Returns None if no token is present (unauthenticated / guest).
    """
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token = authorization.split(" ", 1)[1]
    try:
        user = supabase.auth.get_user(token)
        return user.user.id
    except Exception as e:
        print("Auth error (non-fatal):", e)
        return None


print("Registering report endpoint")

@app.post("/report")
async def generate_report(
    request: Request,
    authorization: Optional[str] = Header(default=None)
):
    try:
        payload = await request.json()

        role = payload.get("role", "")
        match_percent = payload.get("match_percent", 0)
        matched = payload.get("matched_skills", [])
        missing_core = payload.get("missing_core", [])
        missing_gth = payload.get("missing_good_to_have", [])
        extracted_skills = payload.get("extracted_skills", [])
        resume_text = payload.get("resume_text", "")

        matched_str = ", ".join(matched[:5]) if matched else "none"
        missing_core_str = ", ".join(missing_core[:4]) if missing_core else "none"
        missing_gth_str = ", ".join(missing_gth[:3]) if missing_gth else "none"

        prompt = f"""
You are a senior ML engineering mentor at a top tech company doing a brutally honest but encouraging career gap analysis.

Return ONLY this exact JSON structure. No markdown. No explanation.

{{
    "verdict_title": "",
    "current_standing": "",
    "biggest_bottleneck": "",
    "priority_action": "",
    "estimated_time_to_ready": "",
    "encouragement": ""
}}

Candidate Profile:
- Target Role: {role}
- Skill Match: {match_percent}%
- Matched Skills: {matched_str}
- Critical Gaps: {missing_core_str}
- Nice-to-Have Gaps: {missing_gth_str}

Instructions per field:
- verdict_title: A sharp 6-10 word title that captures their exact situation. Not generic.
- current_standing: 2-3 sentences. Be specific about what they have and what's missing. Reference their actual matched and missing skills by name.
- biggest_bottleneck: The single most critical missing skill that is blocking them from getting hired. One sentence, name the skill explicitly.
- priority_action: A concrete, specific first step they can take THIS WEEK. Not "learn PyTorch" — something like "Build a binary image classifier using PyTorch on the CIFAR-10 dataset and deploy it as a FastAPI endpoint."
- estimated_time_to_ready: Break it into 3 milestones. Format: "Month 1-2: X. Month 3-4: Y. Month 5-6: Z."
- encouragement: 2 sentences. Reference something specific from their profile. Sound like a real mentor, not a chatbot.
"""

        response = requests.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "llama-3.3-70b-versatile",
                "messages": [
                    {"role": "system", "content": "Return valid JSON only. No markdown. No explanations."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 600
            },
            timeout=40
        )

        print("GROQ STATUS:", response.status_code)

        data = response.json()

        if "choices" not in data:
            print("NO CHOICES IN RESPONSE:", data)
            return {"report": {"verdict_title": "Report Unavailable", "current_standing": str(data), "biggest_bottleneck": "", "priority_action": "", "estimated_time_to_ready": "", "encouragement": ""}}

        content = data["choices"][0]["message"]["content"]
        print("RAW CONTENT:", content)

        clean = content.strip()
        if clean.startswith("```"):
            clean = clean.split("```")[1]
            if clean.startswith("json"):
                clean = clean[4:]
            clean = clean.strip()

        report_json = json.loads(clean)

        # ─── SAVE TO SUPABASE ──────────────────────────────────────────────────
        user_id = get_user_id(authorization)

        if user_id:
            try:
                # 1. Insert the analysis row
                analysis_insert = supabase.table("analyses").insert({
                    "user_id": user_id,
                    "target_role": role,
                    "match_percentage": int(match_percent),
                    "verdict": report_json,
                    "resume_text": resume_text,
                }).execute()

                analysis_id = analysis_insert.data[0]["id"]
                print("Analysis saved, id:", analysis_id)

                # 2. Insert all skills into analysis_gaps
                gap_rows = []
                for skill in matched:
                    gap_rows.append({"analysis_id": analysis_id, "skill": skill, "status": "matched"})
                for skill in missing_core:
                    gap_rows.append({"analysis_id": analysis_id, "skill": skill, "status": "core_gap"})
                for skill in missing_gth:
                    gap_rows.append({"analysis_id": analysis_id, "skill": skill, "status": "good_to_have_gap"})

                if gap_rows:
                    supabase.table("analysis_gaps").insert(gap_rows).execute()
                    print(f"Saved {len(gap_rows)} skill gaps")

            except Exception as db_err:
                # DB save failing should NOT break the report response
                print("DB save error (non-fatal):", db_err)
        else:
            print("No user token — skipping DB save (guest mode)")
        # ──────────────────────────────────────────────────────────────────────

        return {"report": report_json}

    except Exception as e:
        import traceback
        print("\n========== REPORT ERROR ==========")
        traceback.print_exc()
        print("==================================\n")
        return {
            "report": {
                "verdict_title": "Report Unavailable",
                "current_standing": str(e),
                "biggest_bottleneck": "",
                "priority_action": "",
                "estimated_time_to_ready": "",
                "encouragement": ""
            }
        }


# ─── NEW: fetch a user's analysis history ─────────────────────────────────────
@app.get("/history")
async def get_history(authorization: Optional[str] = Header(default=None)):
    user_id = get_user_id(authorization)
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        result = supabase.table("analyses")\
            .select("id, target_role, match_percentage, verdict, created_at")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .execute()
        return {"history": result.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))