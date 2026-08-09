from pydantic import BaseModel, ConfigDict, Field


class ServiceValidateRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    title: str = Field(..., min_length=2, max_length=200)
    slug: str = Field(..., min_length=2, max_length=200)
    description: str = Field(default="", max_length=2000)
    icon: str = Field(default="", max_length=200)
    display_order: int = Field(default=0, ge=0)
    active: bool = Field(default=True)


class ServiceValidateResponse(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True, extra="forbid")

    valid: bool
    errors: dict[str, list[str]] = {}

