import os
from dotenv import load_dotenv

load_dotenv()

PIPELINE_SERVICE_TOKEN: str = os.environ.get("PIPELINE_SERVICE_TOKEN", "")

APPWRITE_ENDPOINT = os.environ.get("APPWRITE_ENDPOINT", os.environ.get("NEXT_PUBLIC_APPWRITE_ENDPOINT", ""))
APPWRITE_PROJECT_ID = os.environ.get("APPWRITE_PROJECT_ID", os.environ.get("NEXT_PUBLIC_APPWRITE_PROJECT_ID", ""))
APPWRITE_API_KEY = os.environ.get("APPWRITE_API_KEY", "")
APPWRITE_DB_ID = os.environ.get("APPWRITE_DB_ID", os.environ.get("NEXT_PUBLIC_APPWRITE_DB_ID", ""))
APPWRITE_BUCKET_ID = os.environ.get("APPWRITE_BUCKET_ID", os.environ.get("NEXT_PUBLIC_APPWRITE_BUCKET_ID", ""))
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", os.environ.get("NEXT_PUBLIC_ADMIN_EMAIL", "")).lower().strip()

if not PIPELINE_SERVICE_TOKEN:
    raise RuntimeError("PIPELINE_SERVICE_TOKEN environment variable is not set")
