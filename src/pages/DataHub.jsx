import { useEffect, useState } from 'react'
import {
  Database,
  Satellite,
  Map,
  Factory,
  CloudRain,
  Brain,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Layers,
  BarChart3,
  FileText,
  Info,
}  from 'lucide-react'

import Header from '../components/Header'
import StatCard from '../components/StatCard'


const API_BASE_URL = import.meta.env.VITE_API_URL


export default function DataHub() {

  const [modelInfo, setModelInfo] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)


  useEffect(() => {

    async function fetchModelInfo() {

      try {

        setStatus('loading')
        setError(null)


        const response = await fetch(
          `${API_BASE_URL}/model-info`
        )


        if (!response.ok) {

          throw new Error(
            'Unable to retrieve model information.'
          )

        }


        const data = await response.json()

        setModelInfo(data)

        setStatus('done')

      } catch (err) {

        console.error(
          'Model information error:',
          err
        )

        setError(
          err.message ||
          'Unable to connect to the prediction server.'
        )

        setStatus('error')
      }
    }


    fetchModelInfo()

  }, [])


  return (

    <>

      <Header
        title="Data Hub"
        subtitle="Data sources and machine learning model overview"
      />


      {/* ================= INTRO ================= */}

      <div className="info-note">

        <Database
          size={15}
          strokeWidth={2}
        />

        <span>

          MangNexus AI combines geological,
          geospatial, environmental and operational
          indicators to support manganese exploration
          and production risk analysis.

        </span>

      </div>



      {/* ================= DATA SOURCE OVERVIEW ================= */}

      <div className="panel">

        <div className="panel-title">

          Data Source Overview

        </div>


        <div className="zone-select-grid">


          {/* SATELLITE DATA */}

          <div className="zone-card">

            <div className="zone-card-icon">

              <Satellite
                size={18}
                strokeWidth={1.75}
              />

            </div>


            <div className="zone-card-body">

              <div className="zone-card-name">

                Satellite & Remote Sensing

              </div>


              <div className="zone-card-region">

                Mineral reflectance •
                vegetation indicators •
                terrain observations

              </div>

            </div>

          </div>



          {/* GEOLOGICAL DATA */}

          <div className="zone-card">

            <div className="zone-card-icon">

              <Map
                size={18}
                strokeWidth={1.75}
              />

            </div>


            <div className="zone-card-body">

              <div className="zone-card-name">

                Geological Data

              </div>


              <div className="zone-card-region">

                Geological formations •
                mineral occurrence patterns •
                historical drilling information

              </div>

            </div>

          </div>



          {/* OPERATIONAL DATA */}

          <div className="zone-card">

            <div className="zone-card-icon">

              <Factory
                size={18}
                strokeWidth={1.75}
              />

            </div>


            <div className="zone-card-body">

              <div className="zone-card-name">

                Mining Operations

              </div>


              <div className="zone-card-region">

                Production records •
                equipment availability •
                downtime indicators

              </div>

            </div>

          </div>



          {/* ENVIRONMENTAL DATA */}

          <div className="zone-card">

            <div className="zone-card-icon">

              <CloudRain
                size={18}
                strokeWidth={1.75}
              />

            </div>


            <div className="zone-card-body">

              <div className="zone-card-name">

                Environmental Data

              </div>


              <div className="zone-card-region">

                Rainfall •
                weather conditions •
                monsoon patterns

              </div>

            </div>

          </div>


        </div>

      </div>



      {/* ================= HOW DATA IS USED ================= */}

      <div className="panel">

        <div className="panel-title">

          Data Processing Pipeline

        </div>


        <div className="stat-grid stat-grid-3">


          <StatCard
            icon={Database}
            label="Data Collection"
            value="4 Sources"
            hint="Geospatial, geological, operational and environmental indicators"
          />


          <StatCard
            icon={Layers}
            label="Feature Processing"
            value="10+ Features"
            hint="Relevant indicators prepared for ML prediction"
          />


          <StatCard
            icon={Brain}
            label="ML Analysis"
            value="2 Models"
            hint="Zone potential and production risk prediction"
          />


        </div>

      </div>



      {/* ================= MODEL STATUS ================= */}

      <div className="panel">

        <div className="panel-title">

          Machine Learning Model Status

        </div>



        {status === 'loading' && (

          <div className="analysing-panel">

            <Loader2
              size={18}
              strokeWidth={2}
              className="spin-icon"
            />


            <div>

              <div className="analysing-title">

                Loading model information

              </div>


              <div className="analysing-subtitle">

                Retrieving trained model metadata
                from the MangNexus AI backend…

              </div>

            </div>

          </div>

        )}



        {status === 'error' && (

          <div className="analysing-panel">

            <AlertTriangle
              size={18}
              strokeWidth={2}
            />


            <div>

              <div className="analysing-title">

                Unable to load model information

              </div>


              <div className="analysing-subtitle">

                {error}

              </div>

            </div>

          </div>

        )}



        {status === 'done' &&
          modelInfo?.loaded && (

          <>

            <div className="stat-grid">


              {/* ZONE MODEL */}

              <StatCard
                icon={Brain}
                label="Zone Potential Model"
                value={`${Math.round(
                  modelInfo.zone_model.validation_accuracy * 100
                )}%`}
                hint="Validation accuracy"
                tone="neutral"
              />


              {/* RISK MODEL */}

              <StatCard
                icon={BarChart3}
                label="Production Risk Model"
                value={`${Math.round(
                  modelInfo.risk_model.validation_accuracy * 100
                )}%`}
                hint="Validation accuracy"
                tone="neutral"
              />

            </div>



            {/* MODEL DETAILS */}

            <div
              style={{
                marginTop: '20px',
              }}
            >


              <div className="panel-title">

                Model Details

              </div>


              <div className="indicator-list">


                <div className="indicator-item">

                  <CheckCircle2
                    size={15}
                    strokeWidth={2}
                  />


                  <span>

                    Zone model:
                    {' '}
                    {modelInfo.zone_model.model_type}

                  </span>

                </div>



                <div className="indicator-item">

                  <CheckCircle2
                    size={15}
                    strokeWidth={2}
                  />


                  <span>

                    Production risk model:
                    {' '}
                    {modelInfo.risk_model.model_type}

                  </span>

                </div>



                <div className="indicator-item">

                  <FileText
                    size={15}
                    strokeWidth={2}
                  />


                  <span>

                    Prototype dataset:
                    {' '}
                    {modelInfo.zone_model.data_source}

                  </span>

                </div>


              </div>

            </div>

          </>

        )}

      </div>



      {/* ================= DATA TRANSPARENCY ================= */}

      <div className="panel">

        <div className="panel-title">

          Data Transparency

        </div>


        <div className="info-note">

          <Info
            size={15}
            strokeWidth={2}
          />

          <span>

            The current MangNexus AI prototype uses
            synthetic demonstration data to validate
            the end-to-end ML prediction workflow.
            In a production deployment, the models can
            be trained and continuously updated using
            verified mining, geological, operational
            and satellite datasets.

          </span>

        </div>

      </div>


    </>

  )
}