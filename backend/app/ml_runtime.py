"""
Phase 8 — loads the trained scikit-learn models once at import time and
exposes plain predict_* functions that scoring.py calls.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import TypedDict

import joblib


MODELS_DIR = Path(__file__).resolve().parent / "models"


class ClassificationResult(TypedDict):
    label: str
    confidence: int
    model_accuracy: int


def _load(name: str):
    model = joblib.load(MODELS_DIR / f"{name}.joblib")
    meta = json.loads(
        (MODELS_DIR / f"{name}_meta.json").read_text()
    )
    return model, meta


try:
    _zone_model, _zone_meta = _load("zone_model")
    _risk_model, _risk_meta = _load("risk_model")
    MODELS_LOADED = True

except FileNotFoundError as exc:
    MODELS_LOADED = False
    _load_error = exc


def _predict(
    model,
    meta,
    feature_values: dict[str, float]
) -> ClassificationResult:

    if not MODELS_LOADED:
        raise RuntimeError(
            "ML models are not trained yet. "
            "Run `python -m ml.train_all` from the backend directory."
        ) from _load_error

    ordered = [
        feature_values[name]
        for name in meta["feature_order"]
    ]

    probabilities = model.predict_proba([ordered])[0]

    predicted_index = probabilities.argmax()

    label = model.classes_[predicted_index]

    confidence = round(
        float(probabilities[predicted_index]) * 100
    )

    accuracy = round(
        meta["validation_accuracy"] * 100
    )

    return {
        "label": label,
        "confidence": confidence,
        "model_accuracy": accuracy,
    }


def predict_zone_potential(
    feature_values: dict[str, float]
) -> ClassificationResult:

    return _predict(
        _zone_model,
        _zone_meta,
        feature_values
    )


def predict_production_risk(
    feature_values: dict[str, float]
) -> ClassificationResult:

    return _predict(
        _risk_model,
        _risk_meta,
        feature_values
    )


def model_info() -> dict:
    """Returns metadata about the trained ML models."""

    if not MODELS_LOADED:
        return {
            "loaded": False,
            "error": str(_load_error),
        }

    return {
        "loaded": True,

        "zone_model": {
            key: value
            for key, value in _zone_meta.items()
            if key != "feature_order"
        },

        "risk_model": {
            key: value
            for key, value in _risk_meta.items()
            if key != "feature_order"
        },
    }