import { ArrowLeft, Compass, LockKeyhole } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/auth";
import { API_CONFIGURED, API_CONFIGURATION_MESSAGE } from "../api/config";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    try { await loginAdmin(email,password); navigate("/admin/dashboard"); }
    catch (loginError) { setError(loginError instanceof Error ? loginError.message : "Login failed"); }
    finally { setLoading(false); }
  }
  return <main className="admin-login-page">
    <section className="admin-login-visual">
      <img src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85" alt="Sri Lankan coast at golden hour" onError={(event)=>{event.currentTarget.onerror=null;event.currentTarget.src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=85";}} />
      <div className="admin-login-visual-shade" />
      <Link className="admin-login-brand" to="/"><span className="brand-mark">ct</span><span><strong>CEYLON TRAIL</strong><small>THE ISLAND, WELL FOUND</small></span></Link>
      <div className="admin-login-caption"><p className="eyebrow light">THE ISLAND, WELL FOUND</p><h1>Every good journey<br /><em>starts with care.</em></h1><p>Keep the places, stories and small details in good hands.</p></div>
      <span className="admin-login-location">SOUTH COAST · SRI LANKA</span>
    </section>
    <section className="admin-login-panel">
      <Link to="/" className="back-link"><ArrowLeft size={16} /> Back to the guide</Link>
      <div className="admin-login-form-wrap"><span className="admin-lock-mark"><LockKeyhole size={19} /></span><p className="eyebrow">CEYLON TRAIL · STUDIO</p><h2>Welcome back.</h2><p className="admin-login-lede">Sign in to manage the island guide and destination records.</p>
        <form className="admin-login-form" onSubmit={handleSubmit} aria-busy={loading}>
          <label htmlFor="admin-email">Email address</label><input id="admin-email" type="email" value={email} onChange={(event)=>setEmail(event.target.value)} autoComplete="username" disabled={loading} required />
          <label htmlFor="admin-password">Password</label><input id="admin-password" type="password" value={password} onChange={(event)=>setPassword(event.target.value)} autoComplete="current-password" disabled={loading} required />
          {!API_CONFIGURED && <p className="admin-login-error" role="status">{API_CONFIGURATION_MESSAGE}</p>}
          {error && <p className="admin-login-error" role="alert">{error}</p>}
          <button className="admin-login-submit" type="submit" disabled={loading || !API_CONFIGURED}><Compass size={16} />{loading ? "Signing in…" : "Enter the studio"}</button>
        </form><p className="admin-login-note">This area is for authorised site editors.</p>
      </div>
    </section>
  </main>;
}
