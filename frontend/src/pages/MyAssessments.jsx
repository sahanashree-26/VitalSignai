import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function MyAssessments() {
  const [assessments, setAssessments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.history()
      .then(setAssessments)
      .catch((err) => setError(err.message || 'Unable to load assessments.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-ink-900">My Assessments</h1>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <p className="mt-6 text-ink-700">Loading…</p>
      ) : assessments.length === 0 ? (
        <p className="mt-6 text-ink-700">No assessments yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {assessments.map((a) => {
            const isRisk = a.prediction === 'Diabetes Risk Detected'
            return (
              <div key={a.id} className="card flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-700">{new Date(a.created_at).toLocaleString()}</p>
                  <p className={`mt-1 font-semibold ${isRisk ? 'text-amber-600' : 'text-green-600'}`}>
                    {a.prediction}
                  </p>
                  <p className="mt-1 text-sm text-ink-700">
                    Glucose: {a.glucose} · BMI: {a.bmi}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-ink-700">Probability</p>
                  <p className="text-lg font-bold text-ink-900">{Math.round(a.probability * 100)}%</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
