from pydantic import BaseModel, ConfigDict, EmailStr, Field


class EnrollmentValidateRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    id: str = Field(..., min_length=1, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    phone_number: str = Field(..., pattern=r"^[6-9]\d{9}$")
    age: int = Field(..., ge=5, le=100)
    city: str = Field(..., min_length=2, max_length=100)
    qualification: str = Field(..., min_length=2, max_length=150)
    prior_experience: str = Field(default="", max_length=500)
    additional_message: str = Field(default="", max_length=2000)


class EnrollmentValidateResponse(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    valid: bool
    errors: dict[str, list[str]] | None = None

