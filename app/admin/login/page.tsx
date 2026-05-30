'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/admin'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/admin/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push(from)
      router.refresh()
    } else {
      setError('Incorrect password')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-shell">
      {/* Ambient leaks */}
      <div className="al-leak al-leak-1" />
      <div className="al-leak al-leak-2" />

      {/* Eclipse rings (from hero) */}
      <div className="al-rings" aria-hidden>
        <div className="al-ring" />
        <div className="al-ring" style={{ inset: '8%', opacity: 0.5 }} />
        <div className="al-ring" style={{ inset: '16%', opacity: 0.28 }} />
      </div>

      <form className="al-form" onSubmit={handleSubmit} noValidate>
        {/* Wordmark */}
        <div className="al-brand">
          <div className="al-brand-dim">ECLIPSE</div>
          <div className="al-brand-lit">ECLIPSE</div>
        </div>

        <p className="al-eyebrow">Admin Access</p>

        <div className="al-rule" />

        {/* Field */}
        <div className="al-field">
          <label className="al-label" htmlFor="admin-pw">Password</label>
          <input
            id="admin-pw"
            type="password"
            className="al-input"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            autoFocus
            autoComplete="current-password"
          />
          <div className={`al-input-line ${password ? 'al-input-line--filled' : ''}`} />
        </div>

        {error && (
          <p className="al-error">
            <span className="al-error-dash">—</span> {error}
          </p>
        )}

        <button type="submit" className="al-submit" disabled={loading}>
          <span className="al-submit-label">
            {loading ? 'Entering…' : 'Enter'}
          </span>
          <span className="al-submit-bg" />
        </button>

        <p className="al-hint">Eclipse Bar · Tel Aviv</p>
      </form>

      <style>{`
        .admin-login-shell {
          min-height: 100svh;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        /* ── Ambient leaks ── */
        .al-leak {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
          animation: alLeakShift 14s ease-in-out infinite alternate;
        }
        .al-leak-1 {
          width: 480px; height: 280px;
          top: 8%; right: 8%;
          background: radial-gradient(ellipse, rgba(244,196,133,0.07), transparent 70%);
          animation-delay: 0s;
        }
        .al-leak-2 {
          width: 320px; height: 320px;
          bottom: 10%; left: 6%;
          background: radial-gradient(ellipse, rgba(120,100,180,0.05), transparent 70%);
          animation-delay: 5s;
        }
        @keyframes alLeakShift {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(24px,-16px) scale(1.08); }
        }

        /* ── Rings ── */
        .al-rings {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: min(88vh, 88vw);
          aspect-ratio: 1;
          pointer-events: none;
          opacity: 0.035;
        }
        .al-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.55);
        }

        /* ── Form card ── */
        .al-form {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 400px;
          padding: 0 24px;
          gap: 0;
        }

        /* ── Brand wordmark ── */
        .al-brand {
          position: relative;
          margin-bottom: 12px;
          line-height: 1;
          user-select: none;
        }
        .al-brand-dim,
        .al-brand-lit {
          font-family: var(--display);
          font-weight: 700;
          font-size: clamp(52px, 10vw, 80px);
          letter-spacing: 0.12em;
          line-height: 1;
          white-space: nowrap;
        }
        .al-brand-dim {
          color: rgba(255,255,255,0.06);
        }
        .al-brand-lit {
          position: absolute;
          top: 0; left: 0;
          color: #F4C485;
          clip-path: circle(0% at 50% 50%);
          animation: alReveal 2s cubic-bezier(0.4,0,0.1,1) 0.3s forwards;
        }
        @keyframes alReveal {
          to { clip-path: circle(150% at 50% 50%); }
        }

        /* ── Eyebrow ── */
        .al-eyebrow {
          font-family: var(--sans);
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.28);
          margin-bottom: 32px;
        }

        /* ── Rule ── */
        .al-rule {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.18), transparent);
          margin-bottom: 36px;
        }

        /* ── Field ── */
        .al-field {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 8px;
          position: relative;
        }
        .al-label {
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .al-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          padding: 12px 0;
          font-family: var(--sans);
          font-size: 15px;
          font-weight: 300;
          color: rgba(255,255,255,0.85);
          outline: none;
          transition: border-color 0.3s;
          -webkit-font-smoothing: antialiased;
        }
        .al-input::placeholder { color: rgba(255,255,255,0.2); }
        .al-input:focus { border-color: rgba(255,255,255,0.4); }
        .al-input-line {
          position: absolute;
          bottom: 0; left: 0;
          height: 1px;
          width: 0%;
          background: #F4C485;
          transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
          pointer-events: none;
        }
        .al-input-line--filled { width: 100%; }

        /* ── Error ── */
        .al-error {
          font-family: var(--sans);
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(244,196,133,0.7);
          margin-top: 10px;
          margin-bottom: 4px;
          align-self: flex-start;
        }
        .al-error-dash { margin-right: 4px; opacity: 0.5; }

        /* ── Submit ── */
        .al-submit {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          width: 100%;
          margin-top: 32px;
          height: 52px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.22);
          font-family: var(--sans);
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          transition: color 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.4s;
        }
        .al-submit:hover:not(:disabled) {
          color: #000;
          border-color: #F4C485;
        }
        .al-submit:disabled { opacity: 0.45; }
        .al-submit-bg {
          position: absolute;
          inset: 0;
          background: #F4C485;
          z-index: -1;
          transform: translateY(101%);
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .al-submit:hover:not(:disabled) .al-submit-bg { transform: none; }
        .al-submit-label { position: relative; z-index: 1; pointer-events: none; }

        /* ── Hint ── */
        .al-hint {
          margin-top: 28px;
          font-family: var(--sans);
          font-size: 9px;
          font-weight: 300;
          letter-spacing: 0.22em;
          color: rgba(255,255,255,0.12);
          text-transform: uppercase;
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
