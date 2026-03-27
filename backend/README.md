## Backend (Django + DRF + Postgres + pgvector)

### Setup

- Create `.env` from `.env.example`:
  - Copy `backend/.env.example` → `backend/.env`
  - Update Postgres credentials
- Ensure Postgres has pgvector enabled:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Install dependencies

From `backend/`:

```bash
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### Migrate + run

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API base: `http://localhost:8000/api/`

