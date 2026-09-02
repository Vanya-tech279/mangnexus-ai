"""
Synthetic demo/sample datasets for the Phase 8 ML models.

IMPORTANT — DEMO DATA DISCLAIMER
---------------------------------
MOIL/real operational manganese exploration and production data was not
available for this SIH prototype. These generators produce *realistic*
synthetic data: feature ranges and label boundaries are grounded in the
same domain weights used by the Phase 7 heuristic (app/scoring.py's
original ZONE_WEIGHTS / risk formula), but labels are derived from a
noisy version of that formula rather than a hard threshold — so the
trained models are genuinely learning a pattern with some irreducible
uncertainty, not just memorizing a deterministic rule.

Before real MOIL data is available, swap `generate_zone_dataset` /
`generate_risk_dataset` for a loader that reads verified historical
records, keeping the same output columns so train_*.py doesn't change.
"""

from __future__ import annotations

import numpy as np
import pandas as pd

RANDOM_SEED = 42

ZONE_FEATURES = [
    "mineralReflectanceIndex",
    "geologicalFormationMatch",
    "historicalDrillingProximity",
    "ironOxideCorrelation",
    "terrainSlopeSuitability",
    "vegetationStressIndex",
]

ZONE_WEIGHTS = {
    "geologicalFormationMatch": 0.25,
    "mineralReflectanceIndex": 0.22,
    "ironOxideCorrelation": 0.18,
    "historicalDrillingProximity": 0.17,
    "terrainSlopeSuitability": 0.10,
    "vegetationStressIndex": 0.08,
}

ZONE_HIGH_THRESHOLD = 75
ZONE_MEDIUM_THRESHOLD = 50

RISK_FEATURES = [
    "avgMonthlyProduction",
    "equipmentAvailability",
    "equipmentDowntimeHours",
    "forecastRainfallMm",
]

# Normalization caps so unbounded inputs land on a comparable 0-100 scale
# before weighting — same idea as the Phase 7 heuristic, extended to fold
# avgMonthlyProduction in as a real weighted feature (Phase 7 collected it
# but didn't use it; the trained model does).
TARGET_MONTHLY_PRODUCTION = 460  # tonnes, matches the mock dashboard's target band
DOWNTIME_CAP_HOURS = 200
RAINFALL_CAP_MM = 250

RISK_WEIGHTS = {
    "availability": 0.35,
    "downtime": 0.30,
    "rainfall": 0.20,
    "production_deficit": 0.15,
}

RISK_HIGH_THRESHOLD = 55
RISK_MEDIUM_THRESHOLD = 25


def _bucket(score: np.ndarray, high: float, medium: float) -> np.ndarray:
    labels = np.where(score >= high, "High", np.where(score >= medium, "Medium", "Low"))
    return labels


def generate_zone_dataset(n_samples: int = 4000, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """
    Each sample is built from a shared latent "geological quality" factor
    plus per-feature noise, rather than drawing every feature
    independently. Independent per-feature draws regress the weighted
    score toward the middle (classic sum-of-independent-variables effect)
    and starve the High class; a shared latent factor is what real ore
    zones actually look like — a genuinely good zone tends to score well
    across *most* indicators at once — and it gives a realistically
    balanced spread across High/Medium/Low.
    """
    rng = np.random.default_rng(seed)

    latent_quality = rng.normal(0, 1, n_samples)
    correlation = 0.85  # how strongly each feature tracks the shared latent factor

    features = {}
    for name in ZONE_FEATURES:
        own_noise = rng.normal(0, 1, n_samples)
        combined = correlation * latent_quality + np.sqrt(1 - correlation**2) * own_noise
        features[name] = np.clip(56 + 28 * combined, 0, 100)
    df = pd.DataFrame(features)

    true_score = sum(df[name] * weight for name, weight in ZONE_WEIGHTS.items())
    noisy_score = np.clip(true_score + rng.normal(0, 5, n_samples), 0, 100)

    df["potential"] = _bucket(noisy_score, ZONE_HIGH_THRESHOLD, ZONE_MEDIUM_THRESHOLD)
    return df


def generate_risk_dataset(n_samples: int = 4000, seed: int = RANDOM_SEED) -> pd.DataFrame:
    """
    Same shared-latent approach as the zone dataset, using an "operational
    stress" factor: a site under strain tends to see lower equipment
    availability, higher downtime, and lower production *together*, not as
    independent coincidences. Rainfall is kept mostly independent (weather
    doesn't follow equipment condition) with only a mild seasonal link.
    """
    rng = np.random.default_rng(seed)

    stress = rng.normal(0, 1, n_samples)

    availability_noise = rng.normal(0, 1, n_samples)
    equipment_availability = np.clip(
        72 - 16 * stress + 10 * availability_noise, 0, 100
    )

    downtime_noise = rng.normal(0, 1, n_samples)
    downtime_hours = np.clip(
        90 + 55 * stress + 45 * downtime_noise, 0, 400
    )

    production_noise = rng.normal(0, 1, n_samples)
    avg_production = np.clip(
        430 - 55 * stress + 70 * production_noise, 50, 600
    )

    rainfall_noise = rng.normal(0, 1, n_samples)
    rainfall_mm = np.clip(
        110 + 15 * stress + 75 * np.abs(rainfall_noise), 0, 500
    )

    df = pd.DataFrame(
        {
            "avgMonthlyProduction": avg_production,
            "equipmentAvailability": equipment_availability,
            "equipmentDowntimeHours": downtime_hours,
            "forecastRainfallMm": rainfall_mm,
        }
    )

    availability_risk = (100 - df["equipmentAvailability"]) * RISK_WEIGHTS["availability"]
    downtime_risk = (
        np.minimum(df["equipmentDowntimeHours"] / DOWNTIME_CAP_HOURS, 1.0)
        * 100
        * RISK_WEIGHTS["downtime"]
    )
    rainfall_risk = (
        np.minimum(df["forecastRainfallMm"] / RAINFALL_CAP_MM, 1.0)
        * 100
        * RISK_WEIGHTS["rainfall"]
    )
    production_deficit = (
        np.maximum(0, (TARGET_MONTHLY_PRODUCTION - df["avgMonthlyProduction"]) / TARGET_MONTHLY_PRODUCTION)
        * 100
        * RISK_WEIGHTS["production_deficit"]
    )

    true_score = availability_risk + downtime_risk + rainfall_risk + production_deficit
    noisy_score = np.clip(true_score + rng.normal(0, 6, n_samples), 0, 100)

    df["risk"] = _bucket(noisy_score, RISK_HIGH_THRESHOLD, RISK_MEDIUM_THRESHOLD)
    return df
