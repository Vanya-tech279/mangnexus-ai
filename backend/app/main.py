"""
FastAPI service for MangNexus AI.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import ml_runtime

from app.schemas import (
    ModelInfo,
    SiteInputs,
    SiteResult,
    ZoneParameters,
    ZoneResult,
)

from app.scoring import (
    score_site,
    score_zone,
)


# ---------------------------------------------------------
# FastAPI Application
# ---------------------------------------------------------

app = FastAPI(
    title="MangNexus AI — Prediction API",
    description="ML prediction API for manganese zone analysis and production risk prediction.",
    version="0.2.0",
)


# ---------------------------------------------------------
# CORS Configuration
# ---------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/health")
def health():

    return {
        "status": "ok",
        "models_loaded": ml_runtime.MODELS_LOADED,
    }


# ---------------------------------------------------------
# Model Information
# ---------------------------------------------------------

@app.get(
    "/model-info",
    response_model=ModelInfo
)
def model_info():

    return ml_runtime.model_info()


# ---------------------------------------------------------
# Zone Prediction
# ---------------------------------------------------------

@app.post(
    "/predict-zone",
    response_model=ZoneResult
)
def predict_zone(
    params: ZoneParameters
):

    return score_zone(params)


# ---------------------------------------------------------
# Production Risk Prediction
# ---------------------------------------------------------

@app.post(
    "/predict-risk",
    response_model=SiteResult
)
def predict_risk(
    inputs: SiteInputs
):

    return score_site(inputs)