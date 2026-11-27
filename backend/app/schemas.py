from pydantic import BaseModel, ConfigDict
from pydantic import Field


class CompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    city: str


class LoginRequest(BaseModel):
    company_id: int
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    company: CompanyOut


class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    name: str
    role: str
    basic: int
    hra: int
    allowance: int
    deduction: int


class EmployeeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=150)
    role: str = Field(min_length=1, max_length=100)
    basic: int = Field(ge=0)
    hra: int = Field(ge=0)
    allowance: int = Field(ge=0)
    deduction: int = Field(ge=0)


class EmployeeUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=150)
    role: str | None = Field(default=None, min_length=1, max_length=100)
    basic: int | None = Field(default=None, ge=0)
    hra: int | None = Field(default=None, ge=0)
    allowance: int | None = Field(default=None, ge=0)
    deduction: int | None = Field(default=None, ge=0)
