from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from appwrite.client import Client
from appwrite.id import ID
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
from appwrite.input_file import InputFile

from app.config import APPWRITE_API_KEY, APPWRITE_BUCKET_ID, APPWRITE_DB_ID, APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID
from app.middleware.auth import require_admin_media

router = APIRouter(dependencies=[Depends(require_admin_media)])
MAX_SIZE = 2 * 1024 * 1024
ALLOWED = {"image/jpeg", "image/png"}

client = Client().set_endpoint(APPWRITE_ENDPOINT).set_project(APPWRITE_PROJECT_ID).set_key(APPWRITE_API_KEY)
storage = Storage(client)
databases = Databases(client)

async def _upload(category: str, file: UploadFile):
    if file.content_type not in ALLOWED:
        raise HTTPException(415, "Only JPG and PNG images are allowed.")
    content = await file.read(MAX_SIZE + 1)
    if len(content) > MAX_SIZE:
        raise HTTPException(413, "Image must be 2MB or smaller.")
    if not content:
        raise HTTPException(400, "An image file is required.")
    file_id = ID.unique()
    uploaded = storage.create_file(
        bucket_id=APPWRITE_BUCKET_ID,
        file_id=file_id,
        file=InputFile.from_bytes(content, f"{category}/{file.filename or 'image.jpg'}", file.content_type),
        permissions=[Permission.read(Role.any())],
    )
    url = f"{APPWRITE_ENDPOINT}/storage/buckets/{APPWRITE_BUCKET_ID}/files/{uploaded['$id']}/view?project={APPWRITE_PROJECT_ID}"
    return {"file_id": uploaded["$id"], "image_url": url, "category": category}

@router.post("/courses/upload-image")
async def upload_course_image(file: UploadFile = File(...)): return await _upload("courses", file)

@router.post("/portfolio/upload-image")
async def upload_portfolio_image(file: UploadFile = File(...)): return await _upload("portfolio", file)

@router.post("/services/upload-image")
async def upload_service_image(file: UploadFile = File(...)): return await _upload("services", file)

@router.delete("/{entity}/delete-image")
async def delete_image(entity: str, file_id: str = Form(...)):
    if entity not in {"courses", "portfolio", "services"}:
        raise HTTPException(404, "Unknown image collection.")
    storage.delete_file(APPWRITE_BUCKET_ID, file_id)
    return {"file_id": file_id, "deleted": True}

@router.put("/{entity}/update-image")
async def update_image(entity: str, file: UploadFile = File(...), old_file_id: str | None = Form(None)):
    result = await _upload(entity, file)
    if old_file_id:
        storage.delete_file(APPWRITE_BUCKET_ID, old_file_id)
    return result
