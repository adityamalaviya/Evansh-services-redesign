import os
import jwt
from fastapi import Request, HTTPException
from appwrite.client import Client
from appwrite.services.account import Account
from app.config import APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, PIPELINE_SERVICE_TOKEN, ADMIN_EMAIL
import secrets


async def verify_service_token(request: Request) -> None:
    """Dependency: validates the X-Service-Token header and optional service JWT on all pipeline requests."""
    token = request.headers.get("X-Service-Token", "")
    if not token or not secrets.compare_digest(token, PIPELINE_SERVICE_TOKEN):
        raise HTTPException(
            status_code=403,
            detail={"code": "FORBIDDEN", "message": "Invalid or missing service token."},
        )
    
    secret = os.getenv("SERVICE_JWT_SECRET")
    if secret:
        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Bearer service token")
        jwt_token = auth_header[7:]
        try:
            jwt.decode(jwt_token, secret, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise HTTPException(status_code=401, detail="Service token expired")
        except jwt.InvalidTokenError:
            raise HTTPException(status_code=401, detail="Invalid service token")


async def require_admin_media(request: Request) -> None:
    """Require the internal token and independently verify the Appwrite admin identity."""
    await verify_service_token(request)
    authorization = request.headers.get("Authorization", "")
    cookie_header = request.headers.get("Cookie", "")
    session_cookie = next(
        (part.strip().split("=", 1)[1] for part in cookie_header.split(";")
         if part.strip().startswith(f"a_session_{APPWRITE_PROJECT_ID}=")),
        None,
    )
    if not authorization.startswith("Bearer ") and not session_cookie:
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Authentication required."})
    try:
        auth_client = Client().set_endpoint(APPWRITE_ENDPOINT).set_project(APPWRITE_PROJECT_ID)
        if authorization.startswith("Bearer "):
            auth_client.set_jwt(authorization[7:])
        else:
            auth_client.set_session(session_cookie)
        user = Account(auth_client).get()
    except Exception as error:
        raise HTTPException(status_code=401, detail={"code": "UNAUTHORIZED", "message": "Invalid Appwrite session."}) from error
    if not ADMIN_EMAIL or user.get("email", "").lower().strip() != ADMIN_EMAIL:
        raise HTTPException(status_code=403, detail={"code": "FORBIDDEN", "message": "Admin access required."})
