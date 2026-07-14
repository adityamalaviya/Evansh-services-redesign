from pydantic import BaseModel, Field


class CourseValidateRequest(BaseModel):
    title: str = Field(..., min_length=2, max_length=200)
    subtitle: str = Field(..., min_length=2, max_length=300)
    short_description: str = Field(..., min_length=10, max_length=500)
    about_course: str = Field(..., min_length=10, max_length=5000)
    price: int = Field(..., ge=0)
    slug: str = Field(..., min_length=2, max_length=200)
    what_you_will_learn: str = Field(default="", max_length=5000)


class CourseValidateResponse(BaseModel):
    valid: bool
    errors: dict[str, list[str]] = {}
