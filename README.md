# Employee Management

React frontend with a FastAPI backend and MySQL database.

## Requirements

- Node.js and npm
- Python 3.10+
- MySQL Server

## Configure MySQL and start the API

Create a MySQL database:

```sql
CREATE DATABASE employee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

In a terminal, configure and run the backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
```

Edit `.env` with your MySQL username and password. Replace `SECRET_KEY`
with a long random value before using the app beyond local development. Then start
the API from the `backend` directory:

```powershell
uvicorn app.main:app --reload
```

On its first start, the API creates the tables and seeds the companies, admins,
and employees. The seed password is `1234` by default; change
`SEED_ADMIN_PASSWORD` before the first run if you want a different password.
Passwords are stored as hashes. The API docs are available at
http://localhost:8000/docs.

## Start the frontend

In a second terminal from the project root:

```powershell
npm install
npm run dev
```

The frontend calls the API at `http://localhost:8000/api` by default. To use a
different API URL, set `VITE_API_URL` before starting Vite.

## Demo logins

All demo accounts use the configured seed password (default `1234`):

- `admin@tcs.com`
- `admin@infosys.com`
- `admin@wipro.com`
- `admin@accenture.com`
- `admin@google.com`
- `admin@microsoft.com`
- `admin@amazon.com`
- `admin@ibm.com`
- `admin@cognizant.com`
- `admin@capgemini.com`
- `admin@shekrulab.com`
