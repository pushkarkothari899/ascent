# Ascent — Know Your Gaps. Climb Faster.

Most college students applying for tech roles have no idea what's actually blocking them from getting hired. They apply, get rejected, and don't know why. Ascent fixes that.

Paste your resume or describe your skills, pick the role you're targeting, and get a brutally honest AI-generated gap report — matched skills, critical gaps, and a concrete action plan. Your match percentage is your benchmark. Learn something new, run it again, watch the number climb.

**[Live Demo →](https://ascent-demo.vercel.app)**

---

## How It Works

Ascent runs a three-stage pipeline on your input:

1. **Skill Extraction** — spaCy NER parses your resume or bio and pulls out technical skills
2. **Semantic Matching** — sentence-transformers embeds your skills and matches them against role-specific skill definitions using cosine similarity
3. **AI Mentor Report** — Groq (llama-3.3-70b-versatile) generates a personalized verdict: current standing, biggest bottleneck, a specific week-one action, and a 6-month milestone roadmap

Every analysis is saved to Supabase. Returning users land on their history dashboard and can track how their match percentage improves over time.

## Target Roles

ML Engineer · Data Scientist · Full Stack Developer · Backend Developer · MLOps Engineer · Forward Deployed Engineer

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Framer Motion |
| Backend | FastAPI, uvicorn |
| NLP | spaCy, sentence-transformers |
| AI | Groq API — llama-3.3-70b-versatile |
| Auth + DB | Supabase (PostgreSQL + Row Level Security) |
| PDF Parsing | pdfplumber |

## Local Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Create `backend/.env`:

```
GROQ_API_KEY=your_groq_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_SECRET_KEY=your_supabase_service_role_key
```

```bash
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## Project Structure
```
ascent/
├── backend/
│   ├── main.py          # FastAPI app, all endpoints
│   ├── extractor.py     # spaCy NER skill extraction
│   ├── matcher.py       # sentence-transformers role matching
│   └── roles/           # JSON role definitions (one per target role)
└── frontend/
└── src/
└── pages/
├── Landing.js
├── Auth.js
├── Input.js
├── Evaluating.js
├── Output.js
└── Dashboard.js
```

## Author

**Pushkar Kothari** — 2nd year CS student at WIT Solapur, building toward ML engineering.

[GitHub](https://github.com/pushkarkothari899) · [LinkedIn](https://linkedin.com/in/pushkar-kothari)