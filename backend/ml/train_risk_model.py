"""
Trains the Production Shortfall Risk Prediction model.

Run from the backend/ directory:

    python -m ml.train_risk_model

Outputs:
    app/models/risk_model.joblib       -- trained sklearn Pipeline
    app/models/risk_model_meta.json    -- feature order, classes, validation accuracy
"""

from __future__ import annotations

import json
from pathlib import Path

import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

from ml.datasets import RANDOM_SEED, RISK_FEATURES, generate_risk_dataset

MODELS_DIR = Path(__file__).resolve().parent.parent / "app" / "models"


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    df = generate_risk_dataset(n_samples=4000, seed=RANDOM_SEED)
    X = df[RISK_FEATURES]
    y = df["risk"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=RANDOM_SEED, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=120,
        max_depth=8,
        min_samples_leaf=5,
        random_state=RANDOM_SEED,
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)

    joblib.dump(model, MODELS_DIR / "risk_model.joblib")

    meta = {
        "feature_order": RISK_FEATURES,
        "classes": list(model.classes_),
        "validation_accuracy": round(accuracy, 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "model_type": "RandomForestClassifier",
        "data_source": "synthetic_demo",
    }
    (MODELS_DIR / "risk_model_meta.json").write_text(json.dumps(meta, indent=2))

    print(f"Risk model validation accuracy: {accuracy:.4f}")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
