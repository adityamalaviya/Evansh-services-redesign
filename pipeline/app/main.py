from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.slug import router as slug_router
from app.routes.validate import router as validate_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("INFO: Evansh Pipeline service started")
    yield
    print("INFO: Evansh Pipeline service shutting down")


app = FastAPI(
    title="Evansh Pipeline Service",
    description="Internal processing pipeline — not publicly accessible",
    version="1.0.0",
    docs_url=None,     # disable Swagger UI in production
    redoc_url=None,
    lifespan=lifespan,
)

# No CORS — this service is internal only
# If needed for dev, add localhost only:
# app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:3001"], ...)

@app.get("/health")
async def health():
    return {"status": "ok", "service": "evansh-pipeline"}


# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(slug_router, prefix="/pipeline", tags=["pipeline"])
app.include_router(validate_router, prefix="/pipeline", tags=["pipeline"])
