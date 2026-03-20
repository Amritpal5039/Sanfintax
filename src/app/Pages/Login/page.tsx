"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [Name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/login", { email, password }, { withCredentials: true });
      if (response.status === 200) router.push("/Pages/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/register", { Name, email, password }, { withCredentials: true });
      alert("Account created successfull");
      if (response.status === 201) router.push("/Pages/dashboard");
    } catch (error: any) {
      alert(error.response?.data?.message || error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body { background: #020d07; }

        .login-root {
          min-height: 100vh;
          background: linear-gradient(135deg, #020d07 0%, #041a0e 40%, #021408 70%, #010a05 100%);
          display: flex;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Radial glow blobs */
        .glow-blob {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .glow-blob-1 {
          width: 600px; height: 600px;
          top: -200px; right: -100px;
          background: radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 70%);
        }
        .glow-blob-2 {
          width: 400px; height: 400px;
          bottom: -100px; left: 20%;
          background: radial-gradient(circle, rgba(52,211,153,0.05) 0%, transparent 70%);
        }

        /* Left panel */
        .left-panel {
          display: none;
          width: 52%;
          flex-direction: column;
          justify-content: space-between;
          padding: 56px 64px;
          border-right: 1px solid rgba(52,211,153,0.08);
          position: relative;
        }
        @media (min-width: 1024px) { .left-panel { display: flex; } }

        .brand-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(52,211,153,0.1);
          border: 1px solid rgba(52,211,153,0.2);
          border-radius: 100px;
          padding: 6px 14px;
          width: fit-content;
        }
        .brand-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #34d399;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .brand-badge-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #34d399;
        }

        .hero-headline {
          font-family: 'Instrument Serif', serif;
          font-size: clamp(2.8rem, 4vw, 3.8rem);
          font-weight: 400;
          line-height: 1.1;
          color: #f0fdf4;
          margin-bottom: 20px;
        }
        .hero-headline em {
          font-style: italic;
          background: linear-gradient(90deg, #34d399, #6ee7b7, #a7f3d0, #34d399);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 4s linear infinite;
        }
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        .hero-sub {
          font-size: 1.05rem;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(167,243,208,0.6);
          max-width: 380px;
          margin-bottom: 48px;
        }

        /* Stats row */
        .stats-row {
          display: flex;
          gap: 40px;
          margin-bottom: 48px;
        }
        .stat-item {}
        .stat-value {
          font-size: 1.4rem;
          font-weight: 600;
          color: #34d399;
          letter-spacing: -0.01em;
        }
        .stat-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.45);
          margin-top: 4px;
        }

        /* Module preview cards */
        .modules-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .module-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 12px;
          padding: 16px 18px;
          transition: all 0.25s ease;
          cursor: default;
        }
        .module-card:hover {
          background: rgba(52,211,153,0.05);
          border-color: rgba(52,211,153,0.3);
          transform: translateY(-1px);
        }
        .module-card-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.4);
          margin-bottom: 8px;
        }
        .module-card-value {
          font-size: 1rem;
          font-weight: 600;
          color: #e2fdf0;
          letter-spacing: 0.05em;
        }
        .module-card-change {
          font-size: 11px;
          font-weight: 500;
          color: #34d399;
          margin-top: 4px;
        }
        .module-card-change.neg { color: #f87171; }

        .left-footer {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.25);
        }

        /* Right panel — form */
        .right-panel {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 32px;
        }

        .form-wrapper {
          width: 100%;
          max-width: 400px;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .form-wrapper.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .form-eyebrow {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #34d399;
          margin-bottom: 12px;
        }

        .form-headline {
          font-family: 'Instrument Serif', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #f0fdf4;
          line-height: 1.2;
          margin-bottom: 32px;
        }
        .form-headline em {
          font-style: italic;
          color: rgba(167,243,208,0.7);
        }

        /* Tab switcher */
        .tab-switcher {
          display: flex;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(52,211,153,0.12);
          border-radius: 100px;
          padding: 4px;
          margin-bottom: 36px;
        }
        .tab-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 100px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.4);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn.active {
          background: linear-gradient(135deg, #059669, #34d399);
          color: #022c22;
        }

        /* Form fields */
        .field-group {
          margin-bottom: 24px;
        }
        .field-label {
          display: block;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.4);
          margin-bottom: 8px;
        }
        .field-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(52,211,153,0.2);
          padding: 10px 0;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 300;
          color: #f0fdf4;
          outline: none;
          transition: border-color 0.2s ease;
        }
        .field-input::placeholder {
          color: rgba(167,243,208,0.2);
        }
        .field-input:focus {
          border-bottom-color: #34d399;
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 100px;
          background: linear-gradient(135deg, #059669, #34d399);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          color: #022c22;
          cursor: pointer;
          transition: opacity 0.2s ease, transform 0.15s ease;
          margin-top: 8px;
        }
        .submit-btn:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
        .submit-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        /* Divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 28px 0;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: rgba(52,211,153,0.2);
        }
        .divider-text {
          font-size: 10px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.3);
        }

        /* Footer note */
        .form-footer {
          text-align: center;
          font-size: 11px;
          color: rgba(167,243,208,0.3);
          margin-top: 24px;
          line-height: 1.75;
        }

        /* Home link */
        .home-link {
          position: absolute;
          top: 24px;
          left: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(52,211,153,0.08);
          border: 1px solid rgba(52,211,153,0.15);
          border-radius: 100px;
          padding: 8px 16px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(167,243,208,0.5);
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          z-index: 10;
        }
        .home-link:hover {
          background: rgba(52,211,153,0.12);
          color: #34d399;
          border-color: rgba(52,211,153,0.3);
        }
      `}</style>

      <div className="login-root">
        {/* Glow blobs */}
        <div className="glow-blob glow-blob-1" />
        <div className="glow-blob glow-blob-2" />

        {/* Home link */}
        <a className="home-link" onClick={() => router.push("/")}>
          ← Home
        </a>

        {/* Left accent panel */}
        <div className="left-panel">
          <div>
            <div className="brand-badge">
              <div className="brand-badge-dot" />
              <span className="brand-badge-text">Sanfintax</span>
            </div>
          </div>

          <div>
            <h1 className="hero-headline">
              Your finances,<br />
              <em>clarified.</em>
            </h1>
            <p className="hero-sub">
              Track fixed deposits, SIPs, liabilities and goals — all in one intelligent dashboard built for serious planners.
            </p>

            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-value">₹4.2L+</div>
                <div className="stat-label">Avg. Portfolio</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">4</div>
                <div className="stat-label">Modules</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">100%</div>
                <div className="stat-label">Secure</div>
              </div>
            </div>

            <div className="modules-grid">
              <div className="module-card">
                <div className="module-card-label">Fixed Deposits</div>
                <div className="module-card-value">FD Tracker</div>
                <div className="module-card-change">+ Maturity calc</div>
              </div>
              <div className="module-card">
                <div className="module-card-label">SIP</div>
                <div className="module-card-value">Step-Up SIP</div>
                <div className="module-card-change">+ Projections</div>
              </div>
              <div className="module-card">
                <div className="module-card-label">Liabilities</div>
                <div className="module-card-value">EMI & Expenses</div>
                <div className="module-card-change neg">− Net outflow</div>
              </div>
              <div className="module-card">
                <div className="module-card-label">Goals</div>
                <div className="module-card-value">Goal Planner</div>
                <div className="module-card-change">+ Savings path</div>
              </div>
            </div>
          </div>

          <div className="left-footer">© 2025 Sanfintax · All rights reserved</div>
        </div>

        {/* Right form panel */}
        <div className="right-panel">
          <div className={`form-wrapper ${mounted ? "mounted" : ""}`}>

            <div className="form-eyebrow">Welcome back</div>
            <h2 className="form-headline">
              {mode === "login" ? <>Sign in to your<br /><em>account</em></> : <>Create your<br /><em>account</em></>}
            </h2>

            {/* Tab switcher */}
            <div className="tab-switcher">
              <button
                className={`tab-btn ${mode === "login" ? "active" : ""}`}
                onClick={() => setMode("login")}
              >
                Login
              </button>
              <button
                className={`tab-btn ${mode === "register" ? "active" : ""}`}
                onClick={() => setMode("register")}
              >
                Register
              </button>
            </div>

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLogin}>
                <div className="field-group">
                  <label className="field-label">Email address</label>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Password</label>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Signing in…" : "Sign in →"}
                </button>
              </form>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={handleRegister}>
                <div className="field-group">
                  <label className="field-label">Full name</label>
                  <input
                    className="field-input"
                    type="text"
                    placeholder="John Doe"
                    value={Name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Email address</label>
                  <input
                    className="field-input"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="field-group">
                  <label className="field-label">Password</label>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Creating account…" : "Create account →"}
                </button>
              </form>
            )}

            <div className="divider">
              <div className="divider-line" />
              <span className="divider-text">Sanfintax</span>
              <div className="divider-line" />
            </div>

            <div className="form-footer">
              Your data is encrypted and stored securely.<br />
              We never share your financial information.
            </div>

          </div>
        </div>
      </div>
    </>
  );
}