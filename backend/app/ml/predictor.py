"""
predictor.py — loads the already-trained model + scaler ONCE and exposes
predict_diabetes_risk(). The model is never retrained here.
"""
import os
import json
import joblib
import numpy as np

FEATURES = [
    "pregnancies", "glucose", "blood_pressure", "skin_thickness",
    "insulin", "bmi", "diabetes_pedigree", "age",
]

HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(HERE, "..", "..", "ml_models")
MODEL_PATH = os.path.join(MODEL_DIR, "diabetes_logistic_regression.pkl")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

_model = None
_scaler = None
_metrics = None


def _load():
    global _model, _scaler, _metrics
    if _model is None or _scaler is None:
        if not (os.path.exists(MODEL_PATH) and os.path.exists(SCALER_PATH)):
            raise RuntimeError(
                "Trained model not found. Run: python app/ml/train.py "
                "(from the backend/ directory) before starting the API."
            )
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        if os.path.exists(METRICS_PATH):
            with open(METRICS_PATH) as f:
                _metrics = json.load(f)
    return _model, _scaler


def get_metrics():
    _load()
    return _metrics or {}


def predict_diabetes_risk(payload: dict):
    """
    payload keys must match FEATURES (see above), e.g.:
    {
      "pregnancies": 2, "glucose": 130, "blood_pressure": 72,
      "skin_thickness": 22, "insulin": 85, "bmi": 29.5,
      "diabetes_pedigree": 0.45, "age": 35
    }
    Returns (prediction: int 0/1, probability: float 0-1)
    """
    model, scaler = _load()

    ordered = [payload[f] for f in FEATURES]
    X = np.array(ordered, dtype=float).reshape(1, -1)
    X_scaled = scaler.transform(X)

    prediction = int(model.predict(X_scaled)[0])
    probability = float(model.predict_proba(X_scaled)[0][1])  # P(class=1)

    return prediction, round(probability, 4)
