# 🚀 Ascent — AI-Powered Career Gap Analyzer

> Upload your resume. Pick a target role. Get a personalized, AI-generated roadmap showing exactly what's missing between where you are and where you want to be.

**Live App:** [ascent1-rust.vercel.app](https://ascent1-rust.vercel.app)
**Backend API:** [ascent1.onrender.com](https://ascent1.onrender.com)
**Matching Engine:** [Hugging Face Space](https://huggingface.co/spaces/Pushkarkothari/Ascent)

---

## What is Ascent?

Ascent is a full-stack web application that performs **semantic skill-gap analysis** between a candidate's resume and a target tech role (e.g. ML Engineer, Backend Developer, Data Scientist). Unlike keyword-matching ATS tools, Ascent uses **sentence embeddings** to understand that "PyTorch" and "deep learning frameworks" are related concepts — then uses an LLM to turn that raw gap data into a personalized, mentor-style action plan.

In short: it's the career coach you wish you had, except it's an API.

---

## How It Works — The Pipeline

```
┌──────────────┐
│  React UI     │  User uploads PDF resume + selects target role
└──────┬────────┘
       │
       ▼
┌──────────────────────────┐
│  FastAPI Backend (Render) │
│  - Supabase Auth          │
│  - PDF parsing            │
└──────┬────────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Skill Extractor          │  spaCy NLP pulls structured
│  (spaCy + NER)            │  skills/technologies from raw
└──────┬────────────────────┘  resume text
       │
       │  ["Python", "FastAPI", "Docker", "Git", ...]
       ▼
┌──────────────────────────────────┐
│  Semantic Matcher                 │
│  (Hugging Face Space - Docker)    │
│  - sentence-transformers          │
│  - cosine similarity vs role DB   │
└──────┬─────────────────────────────┘
       │
       │  { match_percent, matched_skills,
       │    missing_core, missing_good_to_have }
       ▼
┌──────────────────────────┐
│  AI Mentor (Groq/LLaMA)   │  Turns raw numbers into a
│  - Verdict generation     │  human, readable roadmap with
│  - Roadmap planning       │  priorities and timelines
└──────┬────────────────────┘
       │
       ▼
┌──────────────────────────┐
│  Gap Analysis Report      │  Rendered in the UI
└──────────────────────────┘
```

---

## The Tech Stack — and Why Each Piece Exists

| Layer | Tech | Why |
|---|---|---|
| **Frontend** | React + Vite, deployed on Vercel | Fast, modern SPA experience |
| **Backend API** | FastAPI on Render | Handles auth, file uploads, orchestrates the pipeline |
| **Auth & DB** | Supabase | User accounts, session management, Postgres storage |
| **NLP Extraction** | spaCy | Parses unstructured resume text into structured skill lists |
| **Semantic Matching** | sentence-transformers (`paraphrase-MiniLM-L3-v2`), deployed as a standalone microservice on Hugging Face Spaces | Embeds skills and role requirements into vector space, computes cosine similarity — so "ML pipelines" and "model deployment" are recognized as related even without exact keyword overlap |
| **AI Report Generation** | Groq (LLaMA) | Converts raw match percentages and skill lists into a personalized, prioritized learning roadmap with realistic timelines |

---

## Why a Microservice Architecture?

The semantic matching engine (sentence-transformers + PyTorch) is memory-hungry — too heavy for a free-tier API server. Rather than compromise on either cost or capability, the matching logic was **split into its own containerized service on Hugging Face Spaces** (16GB RAM, free), while the lightweight orchestration (auth, parsing, API routing) stays on Render.

This means:
- The core API stays fast and cheap to run
- The ML-heavy component scales independently
- Each piece can be swapped, upgraded, or redeployed without touching the others

```
Frontend (Vercel) ──► Backend (Render) ──► Matcher Microservice (Hugging Face)
                            │
                            ▼
                        Supabase
                            │
                            ▼
                       Groq LLM API
```

---

## Core Features

- 🔐 **Secure auth** — Supabase-backed signup/login
- 📄 **Resume parsing** — extracts skills from PDF resumes automatically
- 🎯 **Role-targeted analysis** — compares against curated skill profiles for ML Engineer, Data Scientist, Backend Developer, Full-Stack Developer, MLOps Engineer, and Forward Deployed Engineer
- 🧠 **Semantic matching, not keyword matching** — understands conceptually related skills
- 📊 **Match percentage + categorized gaps** — core skills vs. nice-to-haves
- 🗺️ **AI-generated roadmap** — personalized priority actions and realistic timelines, written like a mentor would

---

## API Overview

**Backend (`ascent1.onrender.com`)**
- `POST /analyze` — accepts resume + role, returns full gap analysis report
- `GET /roles` — lists available target roles

**Matcher Microservice (Hugging Face)**
- `POST /match` — given a skill list + role slug, returns match %, matched/missing skills
- `GET /roles` — lists role definitions available to the matcher
- `GET /docs` — interactive Swagger API docs

---

## Roadmap / What's Next

- [ ] Learning resource recommendations per missing skill
- [ ] Multi-role comparison view
- [ ] Resume version history & progress tracking over time

---

## Built By

Pushkar Kothari — ML Engineering student, building toward an AI/ML internship.