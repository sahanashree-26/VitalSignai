# VitalSignAI

**AI-Based Early Diabetes Risk Prediction System Using Machine Learning**

A final-year project: React + FastAPI + MySQL + Logistic Regression (scikit-learn).

---

## ⚠️ Read this first: dataset note

This environment had no internet access while the project was built, so the
real "Pima Indians Diabetes Dataset" could not be downloaded. A **synthetic**
dataset with the same 8 features and realistic clinical relationships was
generated instead (`backend/app/ml/generate_dataset.py`), and the model was
trained and evaluated on it for real (see metrics below — not invented).

**If your college requires the original dataset:** download `diabetes.csv`
(Pima Indians Diabetes Database, Kaggle) and place it at
`backend/data/diabetes.csv` with the same column names, then re-run:
```
python app/ml/train.py
```
No other code changes are needed.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS + React Router |
| Backend | Python + FastAPI + SQLAlchemy + Pydantic |
| ML | scikit-learn Logistic Regression + Pandas + NumPy + joblib |
| Database | MySQL (PyMySQL driver) |
| Auth | PBKDF2-SHA256 password hashing (stdlib) + JWT (PyJWT) |

## Real trained-model metrics (held-out test set, 180 rows)

```
accuracy:  0.80
precision: 0.7925
recall:    0.6269
f1_score:  0.70
```

## Project structure

```
vitalsignai/
├── backend/
│   ├── app/
│   │   ├── main.py            FastAPI app, CORS, startup table creation
│   │   ├── database.py        SQLAlchemy engine/session (DATABASE_URL from .env)
│   │   ├── models.py          User, Assessment ORM models
│   │   ├── schemas.py         Pydantic request/response schemas
│   │   ├── auth_utils.py      Password hashing + JWT
│   │   ├── routers/           auth.py, profile.py, assessment.py
│   │   └── ml/                generate_dataset.py, train.py, predictor.py
│   ├── ml_models/             Trained model + scaler + metrics.json (generated)
│   ├── data/                  diabetes.csv (generated)
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   └── src/{pages,components,services}
├── database/create_database.sql
├── docs/  project_documentation.md, presentation_content.md, viva_questions.md
├── setup.bat, run.bat
```

## Setup (Windows)

1. Install MySQL locally (MySQL Workbench or MySQL Server) if you haven't.
2. Run `database/create_database.sql` in MySQL Workbench (or `mysql -u root -p < database/create_database.sql`) to create the `vitalsignai` database.
3. Double-click / run **`setup.bat`**. It will:
   - create a Python venv and install backend requirements
   - copy `.env.example` → `.env` (edit this file and put your real MySQL password in `DATABASE_URL`)
   - generate the training dataset and train the Logistic Regression model
   - install frontend dependencies (`npm install`)
4. Run **`run.bat`** — opens two windows: backend (`localhost:8000`) and frontend (`localhost:5173`).

Tables (`users`, `assessments`) are created automatically on backend startup — no manual migrations needed.

## URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Swagger / API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

## Manual setup (if not on Windows / not using the .bat files)

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate      # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env          # then edit DATABASE_URL
python app/ml/generate_dataset.py
python app/ml/train.py
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
echo "VITE_API_URL=http://localhost:8000" > .env
npm run dev
```

## Deployment (later, cloud-ready)

- Frontend → Vercel (set `VITE_API_URL` to your deployed backend URL)
- Backend → Render (set `DATABASE_URL` and `CORS_ORIGINS` env vars)
- Database → any managed MySQL provider (PlanetScale, Railway, AWS RDS, etc.) — just change `DATABASE_URL`, no code changes needed.

## Limitations

- Training data is synthetic (see note above), not the original Pima dataset.
- This sandbox had no MySQL server or internet access, so the full stack (MySQL connection, `npm install`, live register→login→predict flow) could not be executed end-to-end *inside the environment this was built in*. All code was written to be correct and is ready to run in a normal local/cloud environment with MySQL, pip, and npm available. The ML training pipeline itself **was** actually run, with real metrics above.
- Not a medical diagnosis tool — for educational/screening purposes only.
