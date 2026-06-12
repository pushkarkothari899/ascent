import requests

MATCHER_URL = "https://pushkarkothari-ascent.hf.space"


def match_skills_to_role(user_skills: list[str], role_slug: str) -> dict:
    response = requests.post(
        f"{MATCHER_URL}/match",
        json={
            "skills": user_skills,
            "role_slug": role_slug
        },
        timeout=60
    )

    response.raise_for_status()
    return response.json()


def get_available_roles():
    response = requests.get(
        f"{MATCHER_URL}/roles",
        timeout=30
    )

    response.raise_for_status()
    return response.json()