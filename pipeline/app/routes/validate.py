from fastapi import APIRouter, Depends
from pydantic import ValidationError
from app.middleware.auth import verify_service_token
from app.schemas.course import CourseValidateRequest, CourseValidateResponse
from app.schemas.contact import ContactValidateRequest, ContactValidateResponse
from app.schemas.service import ServiceValidateRequest, ServiceValidateResponse

router = APIRouter(dependencies=[Depends(verify_service_token)])


def _extract_errors(exc: ValidationError) -> dict[str, list[str]]:
    errors: dict[str, list[str]] = {}
    for e in exc.errors():
        field = ".".join(str(loc) for loc in e["loc"])
        errors.setdefault(field, []).append(e["msg"])
    return errors


@router.post("/validate/course", response_model=CourseValidateResponse)
async def validate_course(payload: dict) -> CourseValidateResponse:
    try:
        CourseValidateRequest(**payload)
        return CourseValidateResponse(valid=True)
    except ValidationError as exc:
        return CourseValidateResponse(valid=False, errors=_extract_errors(exc))


@router.post("/validate/contact", response_model=ContactValidateResponse)
async def validate_contact(payload: dict) -> ContactValidateResponse:
    try:
        ContactValidateRequest(**payload)
        return ContactValidateResponse(valid=True)
    except ValidationError as exc:
        return ContactValidateResponse(valid=False, errors=_extract_errors(exc))


@router.post("/validate/service", response_model=ServiceValidateResponse)
async def validate_service(payload: dict) -> ServiceValidateResponse:
    try:
        ServiceValidateRequest(**payload)
        return ServiceValidateResponse(valid=True)
    except ValidationError as exc:
        return ServiceValidateResponse(valid=False, errors=_extract_errors(exc))
