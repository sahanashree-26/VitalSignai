import { useEffect, useState } from 'react'
import { api } from '../services/api'

export default function Profile() {
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', age: '', gender: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.getProfile()
      .then((data) => {
        setProfile(data)
        setForm({ name: data.name, age: data.age, gender: data.gender })
      })
      .catch((err) => setError(err.message || 'Unable to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.name || !form.age || !form.gender) {
      setError('Please fill in all required fields.')
      return
    }

    setSaving(true)
    try {
      const updated = await api.updateProfile({ ...form, age: Number(form.age) })
      setProfile(updated)
      setSuccess('Profile updated successfully.')
    } catch (err) {
      setError(err.message || 'Unable to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-ink-700">Loading…</p>

  return (
    <div className="mx-auto max-w-md">
      <div className="card">
        <h1 className="text-2xl font-bold text-ink-900">Profile</h1>
        <p className="mt-1 text-sm text-ink-700">{profile?.email}</p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="mt-4 rounded-lg bg-green-50 px-3.5 py-2.5 text-sm text-green-700">{success}</div>
        )}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="label">Name</label>
            <input className="input-field" name="name" value={form.name} onChange={onChange} />
          </div>
          <div>
            <label className="label">Age</label>
            <input className="input-field" type="number" name="age" value={form.age} onChange={onChange} />
          </div>
          <div>
            <label className="label">Gender</label>
            <select className="input-field" name="gender" value={form.gender} onChange={onChange}>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </form>
      </div>
    </div>
  )
}
