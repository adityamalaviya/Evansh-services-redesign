import os
from dotenv import load_dotenv

load_dotenv()

PIPELINE_SERVICE_TOKEN: str = os.environ.get("PIPELINE_SERVICE_TOKEN", "")

if not PIPELINE_SERVICE_TOKEN:
    raise RuntimeError("PIPELINE_SERVICE_TOKEN environment variable is not set")
