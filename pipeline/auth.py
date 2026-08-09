import os
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

bearer_scheme = HTTPBearer(auto_error=False)

def verify_service_token(
    credentials: HTTPAuthorizationCredentials = Security(bearer_scheme)
):
    secret = os.getenv("SERVICE_JWT_SECRET")
    if not secret:
        # Fallback or strict check if set
        return
    if not credentials or not credentials.credentials:
        raise HTTPException(status_code=401, detail="Missing Authorization Bearer token")
    try:
        jwt.decode(credentials.credentials, secret, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Service token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid service token")
