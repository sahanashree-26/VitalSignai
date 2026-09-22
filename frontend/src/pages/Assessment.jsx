import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'

const initialForm = {
  name: '', age: '', gender: '',
  pregnancies: '', glucose: '', blood_pressure: '', skin_thickness: '',
  insulin: '', bmi: '', diabetes_pedigree: '',
}

const FIELD_RANGES = {
  pregnancies: [0, 20], glucose: [1, 300], blood_pressure: [1, 250],
  skin_thickness: [0, 100], insulin: [0, 900], bmi: [1, 80], diabetes_pedigree: [0.01, 3],
}

export default function Assessment() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function validate() {
    const required = ['name', 'age', 'gender', 'pregnancies', 'glucose', 'blood_pressure', 'skin_thickness', 'insulin', 'bmi', 'diabetes_pedigree']
    for (const key of required) {
      if (form[key] === '' || form[key] === null) return 'Please fill in all required fields.'
    }
    for (const [key, [min, max]] of Object.entries(FIELD_RANGES)) {
      const val = Number(form[key])
      if (Number.isNaN(val) || val < min || val > max) {
        return `Please enter a reasonable value for ${key.replace('_', ' ')}.`
      }
    }
    return ''
  }

  async function onSubmit(e) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    setLoading(true)

    try {
      const result = await api.predict({
        pregnancies: Number(form.pregnancies),
        glucose: Number(form.glucose),
        blood_pressure: Number(form.blood_pressure),
        skin_thickness: Number(form.skin_thickness),
        insulin: Number(form.insulin),
        bmi: Number(form.bmi),
        diabetes_pedigree: Number(form.diabetes_pedigree),
        age: Number(form.age),
      })
      navigate('/result', { state: { result, name: form.name } })
    } catch (err) {
      setError(err.message || 'Unable to complete the assessment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="card">
        <h1 className="text-2xl font-bold text-ink-900">Health Assessment</h1>
        <p className="mt-1 text-sm text-ink-700">
          Enter your health information below for an ML-based diabetes risk prediction.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">Basic Information</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="label">Name</label>
                <input className="input-field" name="name" value={form.name} onChange={onChange} placeholder="Jane Doe" />
              </div>
              <div>
                <label className="label">Age</label>
                <input className="input-field" type="number" name="age" value={form.age} onChange={onChange} placeholder="35" />
              </div>
              <div>
                <label className="label">Gender</label>
                <select className="input-field" name="gender" value={form.gender} onChange={onChange}>
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700">Diabetes Health Data</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Pregnancies</label>
                <input className="input-field" type="number" name="pregnancies" value={form.pregnancies} onChange={onChange} placeholder="e.g. 2" />
              </div>
              <div>
                <label className="label">Glucose (mg/dL)</label>
                <input className="input-field" type="number" name="glucose" value={form.glucose} onChange={onChange} placeholder="e.g. 120" />
              </div>
              <div>
                <label className="label">Blood Pressure (mm Hg)</label>
                <input className="input-field" type="number" name="blood_pressure" value={form.blood_pressure} onChange={onChange} placeholder="e.g. 72" />
              </div>
              <div>
                <label className="label">Skin Thickness (mm)</label>
                <input className="input-field" type="number" name="skin_thickness" value={form.skin_thickness} onChange={onChange} placeholder="e.g. 22" />
              </div>
              <div>
                <label className="label">Insulin (mu U/ml)</label>
                <input className="input-field" type="number" name="insulin" value={form.insulin} onChange={onChange} placeholder="e.g. 85" />
              </div>
              <div>
                <label className="label">BMI</label>
                <input className="input-field" type="number" step="0.1" name="bmi" value={form.bmi} onChange={onChange} placeholder="e.g. 27.5" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Diabetes Pedigree Function</label>
                <input className="input-field" type="number" step="0.001" name="diabetes_pedigree" value={form.diabetes_pedigree} onChange={onChange} placeholder="e.g. 0.45" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Predicting…' : 'Predict Diabetes Risk'}
          </button>
        </form>
      </div>
    </div>
  )
}
