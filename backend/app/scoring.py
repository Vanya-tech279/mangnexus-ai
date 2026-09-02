"""
Phase 8 — classification (potential / risk level, confidence, accuracy) now
comes from the trained scikit-learn models in app/models/ via
app/ml_runtime.py. The 0-100 "score" shown alongside each classification,
and the indicators/factors/insight/recommendation text, stay as transparent
weighted-average + rule-based logic — that layer is about explaining the
result to a mine operator, which is a separate job from the classification
itself, and keeping it rule-based keeps it auditable.

Note: because the trained risk model also learns from avgMonthlyProduction
(the Phase 7 heuristic collected it but never weighted it in), the risk
*label* it returns for a given input can differ slightly from the label
the Phase 7 heuristic would have picked from the score alone — the display
score's formula is unchanged, only the classification source is new.
"""

from app import ml_runtime
from app.schemas import SiteInputs, SiteResult, ZoneParameters, ZoneResult

# ---------------------------------------------------------------------------
# Zone Analysis
# ---------------------------------------------------------------------------

# Relative importance of each geological/geospatial parameter in the
# 0-100 potential score. Formation match and reflectance are the strongest
# ore-presence signals in the domain write-up the mock data was based on;
# vegetation stress is the weakest (most indirect) signal, so it's weighted
# lowest.
ZONE_WEIGHTS = {
    "geologicalFormationMatch": 0.25,
    "mineralReflectanceIndex": 0.22,
    "ironOxideCorrelation": 0.18,
    "historicalDrillingProximity": 0.17,
    "terrainSlopeSuitability": 0.10,
    "vegetationStressIndex": 0.08,
}


def _zone_indicators(params: ZoneParameters) -> list[str]:
    ranked = sorted(
        ZONE_WEIGHTS.items(), key=lambda item: params.__dict__[item[0]], reverse=True
    )
    labels = {
        "mineralReflectanceIndex": "mineral reflectance signature",
        "geologicalFormationMatch": "match with known manganese-bearing geological formations",
        "historicalDrillingProximity": "proximity to historically productive drill sites",
        "ironOxideCorrelation": "iron-oxide correlation across imaging bands",
        "terrainSlopeSuitability": "terrain suitability for access and extraction",
        "vegetationStressIndex": "vegetation stress signature",
    }
    indicators = []
    for key, _weight in ranked[:2]:
        value = params.__dict__[key]
        tone = "Strong" if value >= 70 else "Moderate" if value >= 45 else "Weak"
        indicators.append(f"{tone} {labels[key]} ({round(value)}/100)")

    weakest_key, _ = ranked[-1]
    weakest_value = params.__dict__[weakest_key]
    if weakest_value < 45:
        indicators.append(f"Below-average {labels[weakest_key]} tempers the overall signal")
    return indicators


def score_zone(params: ZoneParameters) -> ZoneResult:
    values = params.model_dump()
    weighted_score = sum(values[key] * weight for key, weight in ZONE_WEIGHTS.items())
    score = round(weighted_score)

    prediction = ml_runtime.predict_zone_potential(values)
    potential = prediction["label"]
    confidence = prediction["confidence"]
    accuracy = prediction["model_accuracy"]

    insight = {
        "High": (
            f"Satellite-derived mineral indices and geological formation match align "
            f"strongly (score {score}/100), consistent with established high-yield zones "
            f"in the belt."
        ),
        "Medium": (
            f"Indicators show a moderate correlation with known ore-bearing structures "
            f"(score {score}/100) — promising, but not yet a clear high-confidence case."
        ),
        "Low": (
            f"Indicators show limited correlation with the geological and satellite "
            f"signatures associated with manganese ore in this belt (score {score}/100)."
        ),
    }[potential]

    recommendation = {
        "High": (
            "Prioritize for detailed geological survey and exploratory drilling. "
            "Field-verify satellite and geological indicators before committing capital."
        ),
        "Medium": (
            "Schedule a follow-up satellite pass and cross-check against archived "
            "geological survey maps before allocating exploration budget."
        ),
        "Low": (
            "Deprioritize relative to other candidate zones. Revisit only if new "
            "geological survey data becomes available."
        ),
    }[potential]

    return ZoneResult(
        potential=potential,
        score=score,
        accuracy=accuracy,
        confidence=confidence,
        indicators=_zone_indicators(params),
        insight=insight,
        recommendation=recommendation,
    )


# ---------------------------------------------------------------------------
# Production Risk
# ---------------------------------------------------------------------------

DOWNTIME_CAP_HOURS = 200
RAINFALL_CAP_MM = 250


def _risk_score(inputs: SiteInputs) -> float:
    availability_risk = (100 - inputs.equipmentAvailability) * 0.40
    downtime_risk = min(inputs.equipmentDowntimeHours / DOWNTIME_CAP_HOURS, 1.0) * 100 * 0.35
    rainfall_risk = min(inputs.forecastRainfallMm / RAINFALL_CAP_MM, 1.0) * 100 * 0.25
    return availability_risk + downtime_risk + rainfall_risk


def _risk_factors(inputs: SiteInputs) -> list[str]:
    factors = []
    if inputs.equipmentAvailability < 75:
        factors.append(
            f"Equipment availability ({round(inputs.equipmentAvailability)}%) has dropped "
            f"below the site's operating threshold"
        )
    else:
        factors.append(
            f"Equipment availability ({round(inputs.equipmentAvailability)}%) is holding at "
            f"a healthy level"
        )

    if inputs.equipmentDowntimeHours > 100:
        factors.append(
            f"Equipment downtime ({round(inputs.equipmentDowntimeHours)} hrs) is elevated "
            f"this period"
        )
    else:
        factors.append(
            f"Downtime hours ({round(inputs.equipmentDowntimeHours)} hrs) remain within "
            f"normal range"
        )

    if inputs.forecastRainfallMm > 120:
        factors.append(
            f"Heavy rainfall forecast ({round(inputs.forecastRainfallMm)} mm) may restrict "
            f"haul routes"
        )
    else:
        factors.append(
            f"Forecast rainfall ({round(inputs.forecastRainfallMm)} mm) poses minimal risk "
            f"to haul route conditions"
        )
    return factors


def score_site(inputs: SiteInputs) -> SiteResult:
    score = round(_risk_score(inputs))

    prediction = ml_runtime.predict_production_risk(inputs.model_dump())
    risk = prediction["label"]
    confidence = prediction["confidence"]
    accuracy = prediction["model_accuracy"]

    insight = {
        "High": (
            f"Rising equipment downtime combined with an above-average rainfall forecast "
            f"pushes shortfall risk into the high band this cycle (score {score}/100)."
        ),
        "Medium": (
            f"Operating conditions are mixed — some strain on equipment or weather, but not "
            f"enough on their own to push this site into the high-risk band (score {score}/100)."
        ),
        "Low": (
            f"Current operating conditions do not indicate elevated shortfall risk "
            f"(score {score}/100)."
        ),
    }[risk]

    actions = {
        "High": [
            "Prioritize maintenance on the highest-downtime equipment this month",
            "Pre-position drainage and haul-route contingency plans ahead of forecast rainfall",
            "Reallocate standby equipment from a lower-risk site to cover the availability gap",
        ],
        "Medium": [
            "Monitor equipment availability weekly; escalate if it falls below 75%",
            "Review haul route drainage ahead of the forecast rainfall window",
        ],
        "Low": [
            "Maintain current maintenance schedule and staffing levels",
            "Continue routine equipment checks; no corrective action required",
        ],
    }[risk]

    return SiteResult(
        risk=risk,
        score=score,
        accuracy=accuracy,
        confidence=confidence,
        factors=_risk_factors(inputs),
        insight=insight,
        actions=actions,
    )
