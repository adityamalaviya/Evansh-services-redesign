from fastapi import APIRouter, Depends
from app.middleware.auth import verify_service_token
from app.schemas.course import CourseValidateRequest, CourseValidateResponse
from app.schemas.contact import ContactValidateRequest, ContactValidateResponse
from app.schemas.service import ServiceValidateRequest, ServiceValidateResponse
from app.schemas.enrollment import EnrollmentValidateRequest, EnrollmentValidateResponse

router = APIRouter(dependencies=[Depends(verify_service_token)])


@router.post("/validate/course", response_model=CourseValidateResponse)
async def validate_course(payload: CourseValidateRequest) -> CourseValidateResponse:
    return CourseValidateResponse(valid=True)


@router.post("/validate/contact", response_model=ContactValidateResponse)
async def validate_contact(payload: ContactValidateRequest) -> ContactValidateResponse:
    return ContactValidateResponse(valid=True)


@router.post("/validate/service", response_model=ServiceValidateResponse)
async def validate_service(payload: ServiceValidateRequest) -> ServiceValidateResponse:
    return ServiceValidateResponse(valid=True)


@router.post("/validate/enrollment", response_model=EnrollmentValidateResponse)
async def validate_enrollment(payload: EnrollmentValidateRequest) -> EnrollmentValidateResponse:
    return EnrollmentValidateResponse(valid=True)
