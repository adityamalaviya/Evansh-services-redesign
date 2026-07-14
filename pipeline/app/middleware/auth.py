from fastapi import Request, HTTPException
from app.config import PIPELINE_SERVICE_TOKEN


async def verify_service_token(request: Request) -> None:
    """Dependency: validates the X-Service-Token header on all pipeline requests."""
    token = request.headers.get("X-Service-Token", "")
    if not token or token != PIPELINE_SERVICE_TOKEN:
        raise HTTPException(
            status_code=403,
            detail={"code": "FORBIDDEN", "message": "Invalid or missing service token."},
        )
