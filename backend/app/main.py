import os
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("vitalsignai")

from app.database import engine, Base
from app import models  # noqa: F401  (ensures models are registered before create_all)
from app.routers import auth, profile, assessment
from app.ml.predictor import get_metrics

app = FastAPI(title="VitalSignAI API", version="1.0.0")

# ---------- CORS ----------
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173")
origins = [o.strip() for o in cors_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Global error handling (never leak stack traces) ----------
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error on %s %s", request.method, request.url)
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong on our end. Please try again."},
    )


# ---------- Startup: create tables ----------
@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables verified/created successfully.")
    except Exception as e:
        logger.error("Could not connect to / initialize MySQL: %s", e)
        logger.error(
            "Check backend/.env DATABASE_URL, that MySQL is running, and that "
            "the 'vitalsignai' database exists (see database/create_database.sql)."
        )


# ---------- Routers ----------
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(assessment.router)


# ---------- Health & ML info ----------
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "VitalSignAI API"}


@app.get("/api/ml/info")
def ml_info():
    metrics = get_metrics()
    return {
        "algorithm": "Logistic Regression",
        "library": "scikit-learn",
        "features": metrics.get("features", []),
        "metrics": {
            "accuracy": metrics.get("accuracy"),
            "precision": metrics.get("precision"),
            "recall": metrics.get("recall"),
            "f1_score": metrics.get("f1_score"),
        },
        "note": "Metrics computed on a held-out test set during training. Not a medical diagnosis.",
    }
