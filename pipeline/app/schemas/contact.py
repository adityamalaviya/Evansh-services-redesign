from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ContactValidateRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(default="", max_length=20)
    subject: str = Field(..., min_length=3, max_length=200)
    message: str = Field(..., min_length=10, max_length=5000)


class ContactValidateResponse(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    valid: bool
    errors: dict[str, list[str]] = {}

