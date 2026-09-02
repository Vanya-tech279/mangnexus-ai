import { useState } from 'react'
import {
  Mountain,
  MapPin,
  Info,
  ScanSearch,
  Loader2,
  CheckCircle2,
  Sparkles,
  ClipboardCheck,
  Target,
  Gauge,
  Activity,
  AlertTriangle,
} from 'lucide-react'

import Header from '../components/Header'
import StatCard from '../components/StatCard'
import { miningZones } from '../data/mockData'


// High potential is GOOD, so we invert the normal risk-style tones.
const POTENTIAL_TONE = {
  High: 'low',
  Medium: 'medium',
  Low: 'high',
}


// Human-readable labels for backend input parameters.
const PARAMETER_LABELS = {
  mineralReflectanceIndex: 'Mineral Reflectance Index',
  geologicalFormationMatch: 'Geological Formation Match',
  historicalDrillingProximity: 'Historical Drilling Proximity',
  ironOxideCorrelation: 'Iron Oxide Correlation',
  terrainSlopeSuitability: 'Terrain Slope Suitability',
  vegetationStressIndex: 'Vegetation Stress Index',
}


// FastAPI backend URL
const API_BASE_URL = 'http://127.0.0.1:8000'


export default function ZoneAnalysis() {

  // Selected mining zone
  const [selectedZoneId, setSelectedZoneId] = useState(
    miningZones[0].id
  )


  // idle | analysing | done | error
  const [status, setStatus] = useState('idle')


  // Live result returned from FastAPI
  const [result, setResult] = useState(null)


  // API error message
  const [error, setError] = useState(null)


  // Find currently selected zone
  const selectedZone = miningZones.find(
    (zone) => zone.id === selectedZoneId
  )


  // Change selected zone
  function handleSelectZone(zoneId) {

    if (zoneId === selectedZoneId) return

    setSelectedZoneId(zoneId)

    // Reset previous prediction
    setStatus('idle')
    setResult(null)
    setError(null)
  }


  // Call FastAPI ML prediction endpoint
  async function handleAnalyse() {

    try {

      setStatus('analysing')
      setResult(null)
      setError(null)


      // Send zone parameters to ML backend
      const response = await fetch(
        `${API_BASE_URL}/predict-zone`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(
            selectedZone.parameters
          ),
        }
      )


      // Handle backend errors
      if (!response.ok) {

        const errorData = await response
          .json()
          .catch(() => null)

        throw new Error(
          errorData?.detail ||
          'Unable to analyse this zone. Please try again.'
        )
      }


      // Receive ML prediction
      const data = await response.json()


      // Store live API result
      setResult(data)

      setStatus('done')

    } catch (err) {

      console.error(
        'Zone analysis error:',
        err
      )

      setError(
        err.message ||
        'Unable to connect to the prediction server.'
      )

      setStatus('error')
    }
  }


  return (

    <>

      {/* ================= HEADER ================= */}

      <Header
        title="Zone Analysis"
        subtitle="AI-powered manganese potential zone identification"
      />


      {/* ================= INFORMATION NOTE ================= */}

      <div className="info-note">

        <Info
          size={15}
          strokeWidth={2}
        />

        <span>
          Satellite and geospatial indicators do not confirm underground
          manganese reserves on their own. They are combined with geological
          and historical data to prioritize zones for further ground
          investigation.
        </span>

      </div>


      {/* ================= STEP 1: SELECT AREA ================= */}

      <div className="panel">

        <div className="panel-title">
          Select Area
        </div>


        <div className="zone-select-grid">

          {miningZones.map((zone) => (

            <button
              key={zone.id}
              type="button"
              className={`zone-card ${
                zone.id === selectedZoneId
                  ? 'zone-card-active'
                  : ''
              }`}
              onClick={() =>
                handleSelectZone(zone.id)
              }
            >

              <div className="zone-card-icon">

                <Mountain
                  size={17}
                  strokeWidth={1.75}
                />

              </div>


              <div className="zone-card-body">

                <div className="zone-card-name">
                  {zone.name}
                </div>


                <div className="zone-card-region">

                  <MapPin
                    size={11}
                    strokeWidth={2}
                  />

                  {zone.region}

                </div>

              </div>

            </button>

          ))}

        </div>

      </div>



      {/* ================= STEP 2: PARAMETERS ================= */}

      <div className="panel">

        <div className="panel-title">

          Geological &amp; Geospatial Parameters —
          {' '}
          {selectedZone.name}


          <span className="panel-title-meta">
            {selectedZone.coordinates}
          </span>

        </div>


        <div className="param-list">

          {Object.entries(
            selectedZone.parameters
          ).map(([key, value]) => (

            <div
              className="param-row"
              key={key}
            >

              <span className="param-label">

                {PARAMETER_LABELS[key]}

              </span>


              <div className="param-bar-track">

                <div
                  className="param-bar-fill"
                  style={{
                    width: `${value}%`,
                  }}
                />

              </div>


              <span className="param-value">
                {value}
              </span>

            </div>

          ))}

        </div>



        {/* ANALYSE BUTTON */}

        <button
          type="button"
          className="analyse-button"
          onClick={handleAnalyse}
          disabled={status === 'analysing'}
        >

          {status === 'analysing' ? (

            <>

              <Loader2
                size={16}
                strokeWidth={2}
                className="spin-icon"
              />

              Analysing with ML Model…

            </>

          ) : (

            <>

              <ScanSearch
                size={16}
                strokeWidth={2}
              />

              Analyse Zone

            </>

          )}

        </button>

      </div>



      {/* ================= ML LOADING STATE ================= */}

      {status === 'analysing' && (

        <div className="panel analysing-panel">

          <Loader2
            size={18}
            strokeWidth={2}
            className="spin-icon"
          />


          <div>

            <div className="analysing-title">
              Running Manganese Potential Model
            </div>


            <div className="analysing-subtitle">

              Processing geological indicators,
              satellite observations and historical
              drilling data…

            </div>

          </div>

        </div>

      )}



      {/* ================= ERROR STATE ================= */}

      {status === 'error' && (

        <div className="panel">

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >

            <AlertTriangle
              size={20}
              strokeWidth={2}
            />


            <div>

              <strong>
                Analysis Failed
              </strong>


              <p
                style={{
                  margin: '4px 0 0',
                }}
              >
                {error}
              </p>

            </div>

          </div>

        </div>

      )}



      {/* ================= STEP 3: LIVE ML RESULT ================= */}

      {status === 'done' && result && (

        <>


          {/* RESULT HEADER */}

          <div
            className={`panel result-header result-header-${
              POTENTIAL_TONE[result.potential]
            }`}
          >

            <div className="result-header-icon">

              <Target
                size={22}
                strokeWidth={1.75}
              />

            </div>


            <div>

              <div className="result-header-eyebrow">

                {selectedZone.name}
                {' '}
                — ML Analysis Result

              </div>


              <div className="result-header-level">

                {result.potential}
                {' '}
                Potential

              </div>

            </div>

          </div>



          {/* SCORES */}

          <div className="stat-grid stat-grid-3">


            {/* Potential Score */}

            <StatCard
              icon={Gauge}
              label="Potential Score"
              value={`${result.score}/100`}
              tone={
                POTENTIAL_TONE[
                  result.potential
                ]
              }
            />


            {/* Model Accuracy */}

            <StatCard
              icon={Activity}
              label="Model Accuracy"
              value={`${result.accuracy}%`}
              hint="Validation performance"
              tone="neutral"
            />


            {/* Prediction Confidence */}

            <StatCard
              icon={CheckCircle2}
              label="Prediction Confidence"
              value={`${result.confidence}%`}
              hint="Confidence in this prediction"
              tone="neutral"
            />

          </div>



          {/* ================= KEY INDICATORS ================= */}

          <div className="panel">

            <div className="panel-title">
              Key Indicators
            </div>


            <ul className="indicator-list">

              {result.indicators.map(
                (indicator) => (

                  <li
                    className="indicator-item"
                    key={indicator}
                  >

                    <CheckCircle2
                      size={15}
                      strokeWidth={2}
                    />

                    <span>
                      {indicator}
                    </span>

                  </li>

                )
              )}

            </ul>

          </div>



          {/* ================= AI INSIGHT + RECOMMENDATION ================= */}

          <div className="insight-grid">


            {/* AI INSIGHT */}

            <div className="panel insight-panel">

              <div className="panel-title">

                <Sparkles
                  size={15}
                  strokeWidth={2}
                />

                AI Insight

              </div>


              <p className="insight-text">

                {result.insight}

              </p>

            </div>



            {/* RECOMMENDATION */}

            <div className="panel recommendation-panel">

              <div className="panel-title">

                <ClipboardCheck
                  size={15}
                  strokeWidth={2}
                />

                Recommendation

              </div>


              <p className="insight-text">

                {result.recommendation}

              </p>

            </div>


          </div>


        </>

      )}

    </>

  )
}