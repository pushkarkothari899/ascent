import json
import numpy as np
from pathlib import Path
from sentence_transformers import SentenceTransformer

ROLES_DIR = Path(__file__).parent / "roles"

model = SentenceTransformer("all-MiniLM-L6-v2")


def load_role_skills() -> dict:
    """Load core + good_to_have skills for each role."""
    roles = {}
    for role_file in ROLES_DIR.glob("*.json"):
        with open(role_file, "r") as f:
            role = json.load(f)
            slug = role["slug"]
            roles[slug] = {
                "name": role["role"],
                "core_skills": role["core_skills"],
                "good_to_have": role["good_to_have"],
                "all_skills": role["core_skills"] + role["good_to_have"]
            }
    return roles


def cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """Compute cosine similarity between two vectors."""
    return float(np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2) + 1e-10))


def match_skills_to_role(user_skills: list[str], role_slug: str) -> dict:
    """
    Match user skills against a specific role.
    Returns match %, matched skills, and missing skills.
    """
    roles = load_role_skills()
    if role_slug not in roles:
        return {"error": f"Role '{role_slug}' not found"}

    role = roles[role_slug]
    role_skills = role["all_skills"]
    core_skills = role["core_skills"]

    if not user_skills:
        return {
            "role": role["name"],
            "match_percent": 0,
            "matched_skills": [],
            "missing_core": core_skills,
            "missing_good_to_have": role["good_to_have"]
        }

    # Embed everything
    user_embeddings = model.encode(user_skills)
    role_embeddings = model.encode(role_skills)

    # For each role skill, find best matching user skill
    matched = []
    unmatched = []
    THRESHOLD = 0.5

    for i, role_skill in enumerate(role_skills):
        best_score = 0
        best_match = None
        for j, user_skill in enumerate(user_skills):
            score = cosine_similarity(role_embeddings[i], user_embeddings[j])
            if score > best_score:
                best_score = score
                best_match = user_skill
        if best_score >= THRESHOLD:
            matched.append(role_skill)
        else:
            unmatched.append(role_skill)

    match_percent = round(len(matched) / len(role_skills) * 100, 1)

    missing_core = [s for s in unmatched if s in core_skills]
    missing_gth = [s for s in unmatched if s not in core_skills]

    return {
        "role": role["name"],
        "match_percent": match_percent,
        "matched_skills": matched,
        "missing_core": missing_core,
        "missing_good_to_have": missing_gth
    }


if __name__ == "__main__":
    sample_skills = ["Python", "FastAPI", "Docker", "SQL", "scikit-learn",
                     "XGBoost", "REST APIs", "Git", "AWS", "Transformers"]
    result = match_skills_to_role(sample_skills, "ml_engineer")
    print(f"\nRole: {result['role']}")
    print(f"Match: {result['match_percent']}%")
    print(f"Matched: {result['matched_skills']}")
    print(f"Missing Core: {result['missing_core']}")
    print(f"Missing Good to Have: {result['missing_good_to_have']}")