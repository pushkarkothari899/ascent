import json
import os
import re
import requests
import spacy
from pathlib import Path
from spacy.matcher import PhraseMatcher
from dotenv import load_dotenv

load_dotenv()

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
ROLES_DIR = Path(__file__).parent / "roles"

_nlp = None

def get_nlp():
    global _nlp
    if _nlp is None:
        _nlp = spacy.load("en_core_web_sm")
    return _nlp

def load_all_skills() -> list[str]:
    """Load every skill from all role JSONs into a master list."""
    skills = set()
    for role_file in ROLES_DIR.glob("*.json"):
        with open(role_file, "r") as f:
            role = json.load(f)
            skills.update(role.get("core_skills", []))
            skills.update(role.get("good_to_have", []))
    return list(skills)


def build_phrase_matcher(skills: list[str]) -> PhraseMatcher:
    """Build a spaCy PhraseMatcher from the master skill list."""
    nlp = get_nlp()
    matcher = PhraseMatcher(nlp.vocab, attr="LOWER")
    patterns = [nlp.make_doc(skill.lower()) for skill in skills]
    matcher.add("SKILLS", patterns)
    return matcher


def extract_with_spacy(text: str, matcher: PhraseMatcher) -> list[str]:
    """Run PhraseMatcher on user text, return matched skills."""
    nlp = get_nlp()
    doc = nlp(text.lower())
    matches = matcher(doc)
    found = set()
    for _, start, end in matches:
        span = doc[start:end].text.strip()
        found.add(span)
    return list(found)


def extract_with_llm(text: str, already_found: list[str]) -> list[str]:
    """Send unmatched text to OpenRouter LLM to catch remaining skills."""
    already_str = ", ".join(already_found) if already_found else "none"

    prompt = f"""You are a technical skill extractor.

Extract all technical skills, tools, frameworks, and programming languages mentioned in the text below.
Already extracted skills (do NOT repeat these): {already_str}

Return ONLY a JSON array of skill name strings. No explanation, no markdown, no extra text.
Example output: ["Docker", "FastAPI", "PostgreSQL"]

Text:
{text}"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "openrouter/auto",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 500
        },
        timeout=8
    )

    result = response.json()

    if "choices" not in result:
        return []

    content = result["choices"][0]["message"].get("content") or ""
    raw = content.strip()

    # Strip markdown code blocks if LLM adds them
    raw = re.sub(r"```json|```", "", raw).strip()

    try:
        skills = json.loads(raw)
        if isinstance(skills, list):
            return [s.strip() for s in skills if isinstance(s, str)]
    except json.JSONDecodeError:
        pass

    return []


def extract_skills(user_text: str) -> list[str]:
    """
    Main extraction function.
    Layer 1: spaCy PhraseMatcher
    Layer 2: LLM fallback for anything missed
    Returns deduplicated merged skill list.
    """
    all_skills = load_all_skills()
    matcher = build_phrase_matcher(all_skills)

    spacy_skills = extract_with_spacy(user_text, matcher)
    llm_skills = extract_with_llm(user_text, spacy_skills)

    # Merge and deduplicate (case-insensitive)
    combined = {s.lower(): s for s in spacy_skills}
    for skill in llm_skills:
        if skill.lower() not in combined:
            combined[skill.lower()] = skill

    return list(combined.values())


if __name__ == "__main__":
    sample = """
    I have 2 years of experience working with Python and FastAPI to build REST APIs.
    I've used Docker for containerization and deployed models on AWS.
    My ML work involves scikit-learn, XGBoost, and some experimentation with transformers.
    I also know SQL and have worked with PostgreSQL databases.
    """
    skills = extract_skills(sample)
    print("Extracted skills:", skills)