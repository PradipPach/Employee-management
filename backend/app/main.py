import os
from contextlib import asynccontextmanager
from datetime import datetime, timedelta, timezone

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from sqlalchemy import select
from sqlalchemy.orm import Session

from .database import Base, SessionLocal, engine, get_db
from .models import Admin, Company, Employee
from .schemas import CompanyOut, EmployeeOut, LoginRequest, LoginResponse

SECRET_KEY = os.getenv("SECRET_KEY")
if (
    not SECRET_KEY
    or len(SECRET_KEY) < 32
    or SECRET_KEY == "replace-this-with-a-long-random-secret"
):
    raise RuntimeError("Set SECRET_KEY to at least 32 characters in backend/.env")
TOKEN_LIFETIME_MINUTES = 60
password_hasher = PasswordHash.recommended()
bearer_scheme = HTTPBearer()

COMPANY_SEEDS = [
    ("Tata Consultancy Services", "Mumbai", "admin@tcs.com"),
    ("Infosys", "Bengaluru", "admin@infosys.com"),
    ("Wipro", "Bengaluru", "admin@wipro.com"),
    ("Accenture India", "Pune", "admin@accenture.com"),
    ("Google India", "Hyderabad", "admin@google.com"),
    ("Microsoft India", "Hyderabad", "admin@microsoft.com"),
    ("Amazon India", "Bengaluru", "admin@amazon.com"),
    ("IBM India", "Pune", "admin@ibm.com"),
    ("Cognizant", "Chennai", "admin@cognizant.com"),
    ("Capgemini India", "Mumbai", "admin@capgemini.com"),
    ("Shekru Lab", "Maharashtra", "admin@shekrulab.com"),
]
EMPLOYEE_SEEDS = [
    ("Amit Patil", "Manager", 60000),
    ("Sneha Joshi", "Accountant", 40000),
    ("Rahul More", "Developer", 50000),
    ("Priya Deshmukh", "HR", 35000),
    ("Kiran Dhangar", "Sales Officer", 30000),
]


def seed_database(db: Session) -> None:
    if db.scalar(select(Company.id).limit(1)) is not None:
        return

    seed_password = os.getenv("SEED_ADMIN_PASSWORD", "1234")
    for company_index, (name, city, email) in enumerate(COMPANY_SEEDS):
        company = Company(name=name, city=city)
        db.add(company)
        db.flush()
        db.add(
            Admin(
                company_id=company.id,
                email=email,
                password_hash=password_hasher.hash(seed_password),
            )
        )
        for employee_name, role, basic in EMPLOYEE_SEEDS:
            db.add(
                Employee(
                    company_id=company.id,
                    name=employee_name,
                    role=role,
                    basic=basic + company_index * 1000,
                    hra=int(basic * 0.2),
                    allowance=3000,
                    deduction=2000,
                )
            )
    db.commit()


@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_database(db)
    yield


app = FastAPI(title="Employee Management API", lifespan=lifespan)
allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)


def get_current_company_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> int:
    unauthorized = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        company_id = payload.get("company_id")
        if not isinstance(company_id, int):
            raise unauthorized
        return company_id
    except jwt.InvalidTokenError as exc:
        raise unauthorized from exc


@app.get("/api/companies", response_model=list[CompanyOut])
def list_companies(db: Session = Depends(get_db)):
    return db.scalars(select(Company).order_by(Company.id)).all()


@app.post("/api/auth/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    admin = db.scalar(
        select(Admin).where(
            Admin.company_id == request.company_id,
            Admin.email == request.email.strip().lower(),
        )
    )
    if admin is None or not password_hasher.verify(request.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong email or password",
        )

    company = db.get(Company, admin.company_id)
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_LIFETIME_MINUTES)
    token = jwt.encode(
        {"sub": admin.email, "company_id": admin.company_id, "exp": expires_at},
        SECRET_KEY,
        algorithm="HS256",
    )
    return LoginResponse(access_token=token, token_type="bearer", company=company)


@app.get("/api/employees", response_model=list[EmployeeOut])
def list_employees(
    company_id: int = Depends(get_current_company_id),
    db: Session = Depends(get_db),
):
    return db.scalars(
        select(Employee)
        .where(Employee.company_id == company_id)
        .order_by(Employee.id)
    ).all()
