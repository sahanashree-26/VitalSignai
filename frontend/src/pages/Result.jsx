import { useLocation, Link, Navigate } from 'react-router-dom'

export default function Result() {
  const location = useLocation()
  const result = location.state?.result

  if (!result) {
    return <Navigate to="/assessment" replace />
  }

  const isRisk = result.prediction === 'Diabetes Risk Detected'
  const probabilityPct = Math.round(result.probability * 100)

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card text-center">
        <span className="text-sm font-semibold uppercase tracking-wide text-brand-700">
          Diabetes Risk Prediction
        </span>

        <h1 className={`mt-3 text-3xl font-bold ${isRisk ? 'text-amber-600' : 'text-green-600'}`}>
          {result.prediction}
        </h1>

        <div className="mt-4">
          <div className="mx-auto h-3 w-full max-w-sm overflow-hidden rounded-full bg-ink-100">
            <div
              className={`h-full ${isRisk ? 'bg-amber-500' : 'bg-green-500'}`}
              style={{ width: `${probabilityPct}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-ink-700">
            Predicted Probability (model confidence): <span className="font-semibold">{probabilityPct}%</span>
          </p>
        </div>

        <div className="mt-6 rounded-lg bg-ink-50 p-4 text-left">
          <h2 className="mb-2 text-sm font-semibold text-ink-800">Assessment Summary</h2>
          <div className="grid grid-cols-2 gap-y-1 text-sm text-ink-700">
            <span>Glucose</span><span className="text-right">{result.glucose} mg/dL</span>
            <span>BMI</span><span className="text-right">{result.bmi}</span>
            <span>Blood Pressure</span><span className="text-right">{result.blood_pressure} mm Hg</span>
            <span>Age</span><span className="text-right">{result.age}</span>
          </div>
        </div>

        <p className="mt-6 text-xs text-ink-700">
          This result is an ML-based prediction and is not a medical diagnosis.
        </p>

        <Link to="/my-assessments" className="btn-primary mt-6 inline-flex">
          View My Assessments
        </Link>
      </div>
    </div>
  )
}
