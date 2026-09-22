from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app import models, schemas
from app.routers.auth import get_current_user
from app.ml.predictor import predict_diabetes_risk

router = APIRouter(prefix="/api/assessment", tags=["assessment"])


@router.post("/predict", response_model=schemas.AssessmentResponse)
def predict(
    payload: schemas.AssessmentRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        prediction_int, probability = predict_diabetes_risk({
            "pregnancies": payload.pregnancies,
            "glucose": payload.glucose,
            "blood_pressure": payload.blood_pressure,
            "skin_thickness": payload.skin_thickness,
            "insulin": payload.insulin,
            "bmi": payload.bmi,
            "diabetes_pedigree": payload.diabetes_pedigree,
            "age": payload.age,
        })
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        raise HTTPException(status_code=500, detail="Unable to complete the assessment. Please try again.")

    prediction_label = "Diabetes Risk Detected" if prediction_int == 1 else "No Diabetes Risk Detected"

    assessment = models.Assessment(
        user_id=current_user.id,
        pregnancies=payload.pregnancies,
        glucose=payload.glucose,
        blood_pressure=payload.blood_pressure,
        skin_thickness=payload.skin_thickness,
        insulin=payload.insulin,
        bmi=payload.bmi,
        diabetes_pedigree=payload.diabetes_pedigree,
        age=payload.age,
        prediction=prediction_label,
        probability=probability,
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return assessment


@router.get("/history", response_model=list[schemas.AssessmentResponse])
def history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(models.Assessment)
        .filter(models.Assessment.user_id == current_user.id)
        .order_by(desc(models.Assessment.created_at))
        .all()
    )
