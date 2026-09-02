/**
 * DEMO / SAMPLE DATA
 * ------------------
 * Everything exported from this file is illustrative sample data built for
 * the SIH prototype UI. It is NOT sourced from real MOIL operational systems.
 * Once Phase 9 wires up the FastAPI + ML backend, these mock objects are
 * replaced by live API responses — the components that consume them won't
 * need to change shape-wise, only where the data comes from.
 */

export const IS_DEMO_DATA = true

export const dashboardStats = {
  totalZonesAnalysed: 128,
  highPotentialZones: 34,
  activeHighRiskSites: 7,
  avgModelConfidence: 87,
}

export const weatherAlert = {
  level: 'Moderate',
  region: 'Zone 4B — Balaghat Belt',
  message:
    'Heavy rainfall expected over the next 72 hours. Equipment mobility and haul routes may be affected.',
}

// Monthly production: actual output vs planned target (in tonnes, demo units)
export const productionTrend = [
  { month: 'Jan', actual: 412, target: 450 },
  { month: 'Feb', actual: 438, target: 450 },
  { month: 'Mar', actual: 401, target: 460 },
  { month: 'Apr', actual: 455, target: 460 },
  { month: 'May', actual: 470, target: 470 },
  { month: 'Jun', actual: 389, target: 470 },
  { month: 'Jul', actual: 356, target: 480 },
  { month: 'Aug', actual: 372, target: 480 },
  { month: 'Sep', actual: 410, target: 480 },
]

// Breakdown of all analysed zones by potential classification
export const zoneBreakdown = [
  { name: 'High Potential', value: 34, color: '#5c9270' },
  { name: 'Medium Potential', value: 52, color: '#c1922f' },
  { name: 'Low Potential', value: 42, color: '#b1543a' },
]
// ---------------------------------------------------------------------------
// Phase 4 — Potential Zone Analysis
// ---------------------------------------------------------------------------
// Each zone bundles the geological/geospatial indicators an operator would
// review before running analysis, plus a pre-computed "result" object that
// stands in for the ML model's output until Phase 7–9 wire up the real
// FastAPI + scikit-learn pipeline. Shape-compatible with the future API
// response so ZoneAnalysis.jsx won't need to change when that happens.
export const miningZones = [
  {
    id: 'zone-4b',
    name: 'Zone 4B',
    region: 'Balaghat Belt, Madhya Pradesh',
    coordinates: '21.83°N, 80.19°E',
    parameters: {
      mineralReflectanceIndex: 82,
      geologicalFormationMatch: 88,
      historicalDrillingProximity: 76,
      ironOxideCorrelation: 79,
      terrainSlopeSuitability: 91,
      vegetationStressIndex: 64,
    },
    result: {
      potential: 'High',
      score: 84,
      accuracy: 91,
      confidence: 89,
      indicators: [
        'Strong match with known manganese-bearing geological formation',
        'High mineral reflectance signature across recent satellite passes',
        'Close proximity to historically productive drill sites',
      ],
      insight:
        'Zone 4B shows strong alignment between satellite-derived mineral indices and the regional geological formation associated with manganese ore. Combined with nearby historical drilling records, this pattern is consistent with established high-yield zones in the belt.',
      recommendation:
        'Prioritize for detailed geological survey and exploratory drilling. Field-verify satellite and geological indicators on the ground before committing capital.',
    },
  },
  {
    id: 'zone-7a',
    name: 'Zone 7A',
    region: 'Balaghat Belt, Madhya Pradesh',
    coordinates: '21.71°N, 80.34°E',
    parameters: {
      mineralReflectanceIndex: 68,
      geologicalFormationMatch: 71,
      historicalDrillingProximity: 58,
      ironOxideCorrelation: 65,
      terrainSlopeSuitability: 74,
      vegetationStressIndex: 52,
    },
    result: {
      potential: 'Medium',
      score: 66,
      accuracy: 89,
      confidence: 78,
      indicators: [
        'Moderate correlation with regional ore-bearing structures',
        'Reflectance signature weaker than the latest satellite pass',
        'Some historical drilling activity nearby, but limited yield data',
      ],
      insight:
        'Zone 7A shows a moderate correlation with the geological formations known to host manganese ore. The latest satellite pass shows a slightly weaker signature than prior estimates, and historical drilling data in the immediate area remains limited.',
      recommendation:
        'Schedule a follow-up satellite pass next cycle and cross-check with archived geological survey maps before allocating exploration budget.',
    },
  },
  {
    id: 'zone-2c',
    name: 'Zone 2C',
    region: 'Nagpur Belt, Maharashtra',
    coordinates: '21.29°N, 79.62°E',
    parameters: {
      mineralReflectanceIndex: 79,
      geologicalFormationMatch: 83,
      historicalDrillingProximity: 81,
      ironOxideCorrelation: 74,
      terrainSlopeSuitability: 69,
      vegetationStressIndex: 71,
    },
    result: {
      potential: 'High',
      score: 80,
      accuracy: 91,
      confidence: 85,
      indicators: [
        'High geological formation match with adjacent producing mines',
        'Consistent iron-oxide correlation across multiple imaging bands',
        'Steep terrain may raise access and extraction costs',
      ],
      insight:
        'Zone 2C sits within a geological formation closely matching adjacent producing mines in the Nagpur belt. Iron-oxide correlation is consistent across imaging bands, though the terrain profile suggests access costs should factor into prioritization.',
      recommendation:
        'Advance to exploratory drilling. Factor terrain access costs into the site development plan alongside the geological case.',
    },
  },
  {
    id: 'zone-9d',
    name: 'Zone 9D',
    region: 'Nagpur Belt, Maharashtra',
    coordinates: '21.05°N, 79.88°E',
    parameters: {
      mineralReflectanceIndex: 44,
      geologicalFormationMatch: 39,
      historicalDrillingProximity: 22,
      ironOxideCorrelation: 41,
      terrainSlopeSuitability: 58,
      vegetationStressIndex: 33,
    },
    result: {
      potential: 'Low',
      score: 34,
      accuracy: 88,
      confidence: 81,
      indicators: [
        'Weak correlation with known manganese-bearing formations',
        'Minimal historical drilling activity in the surrounding area',
        'Low mineral reflectance across all recent satellite passes',
      ],
      insight:
        'Zone 9D shows limited correlation with the geological and satellite indicators associated with manganese ore in this belt. Historical drilling records nearby are sparse, and reflectance values remain low across recent passes.',
      recommendation:
        'Deprioritize relative to other candidate zones. Revisit only if new geological survey data becomes available.',
    },
  },
  {
    id: 'zone-5e',
    name: 'Zone 5E',
    region: 'Balaghat Belt, Madhya Pradesh',
    coordinates: '21.95°N, 80.05°E',
    parameters: {
      mineralReflectanceIndex: 61,
      geologicalFormationMatch: 64,
      historicalDrillingProximity: 69,
      ironOxideCorrelation: 57,
      terrainSlopeSuitability: 83,
      vegetationStressIndex: 48,
    },
    result: {
      potential: 'Medium',
      score: 61,
      accuracy: 89,
      confidence: 76,
      indicators: [
        'Favorable terrain suitability for access and extraction',
        'Moderate historical drilling proximity with mixed yield records',
        'Iron-oxide correlation trails the belt average',
      ],
      insight:
        'Zone 5E benefits from favorable terrain and reasonable proximity to prior drilling activity, but its iron-oxide correlation trails the belt average, keeping it in the medium-potential range pending further data.',
      recommendation:
        'Hold as a secondary candidate. Reassess if adjacent Zone 4B or 7A surveys reveal formation continuity into this area.',
    },
  },
]


// ---------------------------------------------------------------------------
// Phase 5 — Production Shortfall Risk Prediction
// ---------------------------------------------------------------------------
// Each site bundles the operational/environmental inputs an operator would
// review before running the risk model, a short production trend (fed into
// the already-built ProductionChart component), and a pre-computed "result"
// object standing in for the ML model's output until Phase 7–9 wire up the
// real FastAPI + scikit-learn pipeline. Shape-compatible with the future API
// response so ProductionRisk.jsx won't need to change when that happens.
export const productionSites = [
  {
    id: 'site-12',
    name: 'Site 12',
    region: 'Balaghat Belt, Madhya Pradesh',
    code: 'MOIL-BAL-12',
    inputs: {
      avgMonthlyProduction: 356,
      equipmentAvailability: 68,
      equipmentDowntimeHours: 142,
      forecastRainfallMm: 210,
    },
    trend: [
      { month: 'Apr', target: 460, output: 431 },
      { month: 'May', target: 470, output: 452 },
      { month: 'Jun', target: 470, output: 402 },
      { month: 'Jul', target: 480, output: 368 },
      { month: 'Aug', target: 480, output: 372 },
      { month: 'Sep', target: 480, output: 356 },
    ],
    result: {
      risk: 'High',
      score: 78,
      accuracy: 90,
      confidence: 83,
      factors: [
        'Equipment downtime trending upward for three consecutive months',
        'Heavy rainfall forecast over the next 30 days may restrict haul routes',
        'Equipment availability has dropped below the site\u2019s operating threshold',
      ],
      insight:
        'Site 12 shows a widening gap between actual and targeted output over the last quarter. Rising equipment downtime combines with an above-average rainfall forecast to push shortfall risk into the high band this cycle.',
      actions: [
        'Prioritize maintenance on the two haulage units with the highest downtime this month',
        'Pre-position drainage and haul-route contingency plans ahead of forecast rainfall',
        'Reallocate standby equipment from Site 05 to cover projected availability gap',
      ],
    },
  },
  {
    id: 'site-05',
    name: 'Site 05',
    region: 'Balaghat Belt, Madhya Pradesh',
    code: 'MOIL-BAL-05',
    inputs: {
      avgMonthlyProduction: 428,
      equipmentAvailability: 81,
      equipmentDowntimeHours: 74,
      forecastRainfallMm: 96,
    },
    trend: [
      { month: 'Apr', target: 440, output: 425 },
      { month: 'May', target: 445, output: 438 },
      { month: 'Jun', target: 445, output: 419 },
      { month: 'Jul', target: 450, output: 431 },
      { month: 'Aug', target: 450, output: 422 },
      { month: 'Sep', target: 450, output: 428 },
    ],
    result: {
      risk: 'Medium',
      score: 52,
      accuracy: 90,
      confidence: 79,
      factors: [
        'Equipment availability is stable but trails the belt-wide average',
        'Moderate rainfall forecast poses a mild risk to haul route conditions',
        'Downtime hours remain within normal range for the site',
      ],
      insight:
        'Site 05 has held close to its production target through the quarter. Availability sits slightly below the belt average, and a moderate rainfall forecast keeps this site in the medium-risk band rather than low.',
      actions: [
        'Monitor equipment availability weekly; escalate if it falls below 75%',
        'Review haul route drainage ahead of the forecast rainfall window',
        'No schedule changes required at this time',
      ],
    },
  },
  {
    id: 'site-08',
    name: 'Site 08',
    region: 'Nagpur Belt, Maharashtra',
    code: 'MOIL-NGP-08',
    inputs: {
      avgMonthlyProduction: 391,
      equipmentAvailability: 92,
      equipmentDowntimeHours: 31,
      forecastRainfallMm: 42,
    },
    trend: [
      { month: 'Apr', target: 400, output: 396 },
      { month: 'May', target: 400, output: 404 },
      { month: 'Jun', target: 405, output: 398 },
      { month: 'Jul', target: 405, output: 401 },
      { month: 'Aug', target: 410, output: 407 },
      { month: 'Sep', target: 410, output: 391 },
    ],
    result: {
      risk: 'Low',
      score: 21,
      accuracy: 91,
      confidence: 88,
      factors: [
        'Equipment availability consistently above 90% over the last quarter',
        'Low forecast rainfall with minimal expected impact on haul routes',
        'Downtime hours well below the belt average',
      ],
      insight:
        'Site 08 has consistently tracked close to its production target, supported by high equipment availability and a low rainfall forecast. Current operating conditions do not indicate elevated shortfall risk.',
      actions: [
        'Maintain current maintenance schedule and staffing levels',
        'Continue routine equipment checks; no corrective action required',
        'Revisit forecast if regional rainfall outlook changes materially',
      ],
    },
  },
  {
    id: 'site-03',
    name: 'Site 03',
    region: 'Nagpur Belt, Maharashtra',
    code: 'MOIL-NGP-03',
    inputs: {
      avgMonthlyProduction: 274,
      equipmentAvailability: 74,
      equipmentDowntimeHours: 98,
      forecastRainfallMm: 158,
    },
    trend: [
      { month: 'Apr', target: 320, output: 288 },
      { month: 'May', target: 320, output: 301 },
      { month: 'Jun', target: 325, output: 279 },
      { month: 'Jul', target: 330, output: 265 },
      { month: 'Aug', target: 330, output: 281 },
      { month: 'Sep', target: 330, output: 274 },
    ],
    result: {
      risk: 'Medium',
      score: 58,
      accuracy: 89,
      confidence: 77,
      factors: [
        'Output has trailed target in four of the last six months',
        'Above-average rainfall forecast for the upcoming period',
        'Equipment downtime is elevated but not yet at critical levels',
      ],
      insight:
        'Site 03 has consistently underperformed against target this quarter, and the upcoming rainfall forecast adds further pressure to an already strained equipment schedule, placing it in the medium-risk band.',
      actions: [
        'Audit the two most downtime-prone equipment units this week',
        'Adjust weekly production targets to reflect forecast rainfall impact',
        'Flag site for closer monitoring alongside Site 12',
      ],
    },
  },
]

export const recentInsights = [
  {
    id: 1,
    type: 'zone',
    title: 'Zone 4B shows strong manganese indicators',
    summary:
      'Geospatial and geological markers align closely with known high-yield formations nearby.',
    confidence: 91,
  },
  {
    id: 2,
    type: 'risk',
    title: 'Elevated shortfall risk at Site 12',
    summary:
      'Equipment downtime is trending upward and combines with forecasted rainfall to raise risk.',
    confidence: 84,
  },
  {
    id: 3,
    type: 'zone',
    title: 'Zone 7A downgraded to Medium Potential',
    summary:
      'The latest satellite pass shows a weaker correlation with historical ore-bearing structures.',
    confidence: 78,
  },
]
