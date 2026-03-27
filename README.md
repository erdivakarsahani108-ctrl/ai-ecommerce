## AI-powered E-Commerce (Full Stack)

### Stack
- **Backend**: Django + Django REST Framework, PostgreSQL + **pgvector**, JWT auth
- **Frontend**: React (Vite) + Tailwind CSS, Axios, JWT handling
- **AI Search**: Embeddings + pgvector cosine similarity

---

## Backend setup (Windows)

### 1) Postgres + pgvector

You need PostgreSQL with the `vector` extension enabled in your database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### 2) Configure env

Copy `backend/.env.example` → `backend/.env` and update values as needed.

### 3) Install + run

From `backend/`:

```powershell
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

Backend API: `http://localhost:8000/api/`

---

## Frontend setup

### 1) Configure env

Copy `frontend/.env.example` → `frontend/.env`

### 2) Install + run

From `frontend/`:

```powershell
npm install
npm run dev
```

Frontend: `http://localhost:5173`

---

## API overview

### Auth
- `POST /api/auth/register/`
- `POST /api/auth/login/` (JWT)
- `POST /api/auth/refresh/`
- `GET /api/auth/me/`

### Catalog
- `GET /api/catalog/categories/`
- `GET /api/catalog/products/`
- `GET /api/catalog/products/:id/`

### Cart (JWT required)
- `GET /api/cart/`
- `POST /api/cart/items/add/`
- `PATCH /api/cart/items/:item_id/`
- `DELETE /api/cart/items/:item_id/remove/`

### Orders (JWT required)
- `GET /api/orders/`
- `GET /api/orders/:id/`
- `POST /api/orders/checkout/`

### AI search
- `GET /api/search/semantic/?q=...`

