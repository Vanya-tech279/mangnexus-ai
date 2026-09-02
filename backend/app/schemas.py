"""
Request and response models for MangNexus AI prediction endpoints.
"""

from typing import List, Literal

from pydantic import BaseModel, Field


# ---------------------------------------------------------
# Zone Analysis
# ---------------------------------------------------------

class ZoneParameters(BaseModel):

    mineralReflectanceIndex: float = Field(
        ...,
        ge=0,
        le=100
    )

    geologicalFormationMatch: float = Field(
        ...,
        ge=0,
        le=100
    )

    historicalDrillingProximity: float = Field(
        ...,
        ge=0,
        le=100
    )

    ironOxideCorrelation: float = Field(
        ...,
        ge=0,
        le=100
    )

    terrainSlopeSuitability: float = Field(
        ...,
        ge=0,
        le=100
    )

    vegetationStressIndex: float = Field(
        ...,
        ge=0,
        le=100
    )


class ZoneResult(BaseModel):

    potential: Literal["High", "Medium", "Low"]
    score: int
    accuracy: int
    confidence: int

    indicators: List[str]

    insight: str
    recommendation: str


# ---------------------------------------------------------
# Production Risk
# ---------------------------------------------------------

class SiteInputs(BaseModel):

    avgMonthlyProduction: float = Field(
        ...,
        ge=0
    )

    equipmentAvailability: float = Field(
        ...,
        ge=0,
        le=100
    )

    equipmentDowntimeHours: float = Field(
        ...,
        ge=0
    )

    forecastRainfallMm: float = Field(
        ...,
        ge=0
    )


class SiteResult(BaseModel):

    risk: Literal["High", "Medium", "Low"]

    score: int
    accuracy: int
    confidence: int

    factors: List[str]

    insight: str

    actions: List[str]


# ---------------------------------------------------------
# Model Information
# ---------------------------------------------------------

class ModelSummary(BaseModel):

    classes: List[str]

    validation_accuracy: float

    train_samples: int

    test_samples: int

    model_type: str

    data_source: str


class ModelInfo(BaseModel):

    loaded: bool

    zone_model: ModelSummary | None = None

    risk_model: ModelSummary | None = None

    error: str | None = None