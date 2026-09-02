"""Trains both Phase 8 models. Run from backend/: python -m ml.train_all"""

from ml import train_risk_model, train_zone_model

if __name__ == "__main__":
    print("=== Training zone potential model ===")
    train_zone_model.main()
    print("\n=== Training production risk model ===")
    train_risk_model.main()
