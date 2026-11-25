from pydantic import BaseModel, ConfigDict


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
