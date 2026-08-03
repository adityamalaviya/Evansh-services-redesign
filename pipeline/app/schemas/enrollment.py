from pydantic import BaseModel, EmailStr, Field

class EnrollmentValidateRequest(BaseModel):
    id: str
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone_number: str = Field(..., pattern=r"^[6-9]\d{9}$")
    age: int = Field(..., ge=5, le=100)
    city: str = Field(..., min_length=2, max_length=100)
    qualification: str = Field(..., min_length=2, max_length=150)
    prior_experience: str
    additional_message: str = Field(default="", max_length=2000)

class EnrollmentValidateResponse(BaseModel):
    valid: bool
    errors: dict[str, list[str]] | None = None
