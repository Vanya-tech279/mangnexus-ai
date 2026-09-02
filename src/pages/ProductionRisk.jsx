import { useState } from 'react'
import {
  Factory,
  MapPin,
  Info,
  Gauge,
  Loader2,
  CheckCircle2,
  Sparkles,
  ClipboardCheck,
  ShieldAlert,
  Activity,
  AlertTriangle,
  Wrench,
  Timer,
  CloudRain,
} from 'lucide-react'

import Header from '../components/Header'
import StatCard from '../components/StatCard'
import ProductionChart from '../components/ProductionChart'
import { productionSites } from '../data/mockData'


// Risk tone maps directly to the shared status colors.
const RISK_TONE = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
}


// FastAPI backend URL
const API_BASE_URL = 'http://127.0.0.1:8000'


export default function ProductionRisk() {

  // Selected mining site
  const [selectedSiteId, setSelectedSiteId] = useState(
    productionSites[0].id
  )


  // idle | predicting | done | error
  const [status, setStatus] = useState('idle')


  // Live ML prediction returned from FastAPI
  const [result, setResult] = useState(null)


  // API error message
  const [error, setError] = useState(null)


  // Currently selected production site
  const selectedSite = productionSites.find(
    (site) => site.id === selectedSiteId
  )


  // Change selected site
  function handleSelectSite(siteId) {

    if (siteId === selectedSiteId) return

    setSelectedSiteId(siteId)

    // Clear previous prediction
    setStatus('idle')
    setResult(null)
    setError(null)
  }


  // Call FastAPI production risk prediction endpoint
  async function handlePredict() {

    try {

      setStatus('predicting')
      setResult(null)
      setError(null)


      // Send site inputs to the ML backend
      const response = await fetch(
        `${API_BASE_URL}/predict-risk`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify(
            selectedSite.inputs
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
          'Unable to predict production risk. Please try again.'
        )
      }


      // Receive live ML prediction
      const data = await response.json()


      // Store prediction in React state
      setResult(data)

      setStatus('done')

    } catch (err) {

      console.error(
        'Production risk prediction error:',
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
        title="Production Risk"
        subtitle="AI-powered production shortfall risk prediction"
      />


      {/* ================= INFORMATION NOTE ================= */}

      <div className="info-note">

        <Info
          size={15}
          strokeWidth={2}
        />

        <span>

          Model Accuracy reflects how the model performs on validated
          historical data overall. Prediction Confidence reflects how
          confident the model is in this specific site's result — the two
          numbers are not the same thing.

        </span>

      </div>



      {/* ================= STEP 1: SELECT SITE ================= */}

      <div className="panel">

        <div className="panel-title">
          Select Site
        </div>


        <div className="zone-select-grid">

          {productionSites.map((site) => (

            <button
              key={site.id}
              type="button"
              className={`zone-card${
                site.id === selectedSiteId
                  ? ' zone-card-active'
                  : ''
              }`}
              onClick={() =>
                handleSelectSite(site.id)
              }
            >

              <div className="zone-card-icon">

                <Factory
                  size={17}
                  strokeWidth={1.75}
                />

              </div>


              <div className="zone-card-body">

                <div className="zone-card-name">

                  {site.name}

                </div>


                <div className="zone-card-region">

                  <MapPin
                    size={11}
                    strokeWidth={2}
                  />

                  {site.region}

                </div>

              </div>

            </button>

          ))}

        </div>

      </div>



      {/* ================= STEP 2: INPUT FACTORS ================= */}

      <div className="panel">

        <div className="panel-title">

          Operational &amp; Environmental Factors —
          {' '}
          {selectedSite.name}


          <span className="panel-title-meta">

            {selectedSite.code}

          </span>

        </div>



        <div className="stat-grid">


          {/* Monthly Production */}

          <StatCard
            icon={Activity}
            label="Avg. Monthly Production"
            value={`${selectedSite.inputs.avgMonthlyProduction} t`}
            hint="Trailing 3-month average"
          />


          {/* Equipment Availability */}

          <StatCard
            icon={Wrench}
            label="Equipment Availability"
            value={`${selectedSite.inputs.equipmentAvailability}%`}
            tone={
              selectedSite.inputs.equipmentAvailability >= 85
                ? 'low'
                : selectedSite.inputs.equipmentAvailability >= 70
                  ? 'medium'
                  : 'high'
            }
          />


          {/* Equipment Downtime */}

          <StatCard
            icon={Timer}
            label="Equipment Downtime"
            value={`${selectedSite.inputs.equipmentDowntimeHours} hrs`}
            hint="This month"
          />


          {/* Rainfall */}

          <StatCard
            icon={CloudRain}
            label="Forecast Rainfall"
            value={`${selectedSite.inputs.forecastRainfallMm} mm`}
            hint="Next 30 days"
          />

        </div>

      </div>



      {/* ================= HISTORICAL TREND ================= */}

      <ProductionChart
        data={selectedSite.trend}
      />



      {/* ================= PREDICT BUTTON ================= */}

      <div className="panel">

        <button
          type="button"
          className="analyse-button"
          onClick={handlePredict}
          disabled={status === 'predicting'}
        >

          {status === 'predicting' ? (

            <>

              <Loader2
                size={16}
                strokeWidth={2}
                className="spin-icon"
              />

              Predicting with ML Model…

            </>

          ) : (

            <>

              <Gauge
                size={16}
                strokeWidth={2}
              />

              Predict Risk

            </>

          )}

        </button>

      </div>



      {/* ================= LOADING STATE ================= */}

      {status === 'predicting' && (

        <div className="panel analysing-panel">

          <Loader2
            size={18}
            strokeWidth={2}
            className="spin-icon"
          />


          <div>

            <div className="analysing-title">

              Running Production Shortfall Model

            </div>


            <div className="analysing-subtitle">

              Analysing equipment availability,
              operational downtime, forecast rainfall
              and historical production data for
              {' '}
              {selectedSite.name}…

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

                Prediction Failed

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
              RISK_TONE[result.risk]
            }`}
          >

            <div className="result-header-icon">

              <ShieldAlert
                size={22}
                strokeWidth={1.75}
              />

            </div>


            <div>

              <div className="result-header-eyebrow">

                {selectedSite.name}
                {' '}
                — ML Prediction Result

              </div>


              <div className="result-header-level">

                {result.risk}
                {' '}
                Risk

              </div>

            </div>

          </div>



          {/* ================= SCORE CARDS ================= */}

          <div className="stat-grid stat-grid-3">


            {/* Risk Score */}

            <StatCard
              icon={Gauge}
              label="Risk Score"
              value={`${result.score}/100`}
              tone={
                RISK_TONE[
                  result.risk
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



          {/* ================= MAIN RISK FACTORS ================= */}

          <div className="panel">

            <div className="panel-title">

              Main Risk Factors

            </div>


            <ul className="indicator-list indicator-list-risk">

              {result.factors.map(
                (factor) => (

                  <li
                    className="indicator-item"
                    key={factor}
                  >

                    <AlertTriangle
                      size={15}
                      strokeWidth={2}
                    />

                    <span>

                      {factor}

                    </span>

                  </li>

                )
              )}

            </ul>

          </div>



          {/* ================= AI INSIGHT + ACTIONS ================= */}

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



            {/* RECOMMENDED ACTIONS */}

            <div className="panel recommendation-panel">

              <div className="panel-title">

                <ClipboardCheck
                  size={15}
                  strokeWidth={2}
                />

                Recommended Corrective Actions

              </div>


              <ol className="action-list">

                {result.actions.map(
                  (action, i) => (

                    <li
                      className="action-item"
                      key={action}
                    >

                      <span className="action-item-index">

                        {i + 1}

                      </span>


                      <span>

                        {action}

                      </span>

                    </li>

                  )
                )}

              </ol>

            </div>


          </div>


        </>

      )}


    </>

  )
}