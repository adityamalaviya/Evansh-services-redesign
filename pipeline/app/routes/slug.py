import re
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.middleware.auth import verify_service_token

router = APIRouter(dependencies=[Depends(verify_service_token)])


class SlugRequest(BaseModel):
    title: str


class SlugResponse(BaseModel):
    slug: str


def generate_slug(title: str) -> str:
    """Convert a title to a URL-safe slug."""
    slug = title.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)      # remove non-alphanumeric (except - and _)
    slug = re.sub(r"[\s_]+", "-", slug)         # spaces and underscores → hyphens
    slug = re.sub(r"-{2,}", "-", slug)           # collapse multiple hyphens
    slug = slug.strip("-")                        # trim leading/trailing hyphens
    return slug[:200]                             # enforce max length


@router.post("/slug", response_model=SlugResponse)
async def create_slug(payload: SlugRequest) -> SlugResponse:
    return SlugResponse(slug=generate_slug(payload.title))
