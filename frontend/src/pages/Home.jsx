import { Link } from 'react-router-dom'
import { isLoggedIn } from '../services/api'

export default function Home() {
  const loggedIn = isLoggedIn()

  return (
    <div className="flex flex-col items-center py-12 text-center">
      <span className="mb-4 rounded-full bg-brand-100 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
        Final-Year ML Project
      </span>
      <h1 className="text-4xl font-bold text-ink-900 sm:text-5xl">VitalSignAI</h1>
      <p className="mt-2 text-lg font-medium text-brand-700">
        AI-Based Early Diabetes Risk Prediction
      </p>
      <p className="mt-4 max-w-xl text-ink-700">
        VitalSignAI uses Logistic Regression and health information to provide an early
        diabetes risk prediction.
      </p>

      <div className="mt-8 flex gap-4">
        <Link to={loggedIn ? '/assessment' : '/register'} className="btn-primary">
          Start Health Assessment
        </Link>
        <Link to="/about" className="btn-secondary">
          Learn More
        </Link>
      </div>

      <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card text-left">
          <div className="text-2xl">🩺</div>
          <h3 className="mt-2 font-semibold">8 Health Inputs</h3>
          <p className="mt-1 text-sm text-ink-700">Standard clinical screening features.</p>
        </div>
        <div className="card text-left">
          <div className="text-2xl">📈</div>
          <h3 className="mt-2 font-semibold">Logistic Regression</h3>
          <p className="mt-1 text-sm text-ink-700">A trained, evaluated ML classifier.</p>
        </div>
        <div className="card text-left">
          <div className="text-2xl">🗂️</div>
          <h3 className="mt-2 font-semibold">Saved History</h3>
          <p className="mt-1 text-sm text-ink-700">Every assessment stored in MySQL.</p>
        </div>
      </div>
    </div>
  )
}
