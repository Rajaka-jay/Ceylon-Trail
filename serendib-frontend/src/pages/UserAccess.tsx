import { ArrowLeft, Compass, LockKeyhole, LogOut } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getUserSession, loginUser, logoutUser, registerUser, USER_SESSION_EVENT, type UserSession } from "../api/userAuth";

export default function UserAccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.pathname === "/register" ? "register" : location.pathname === "/account" ? "account" : "login";
  const [session, setSession] = useState<UserSession | null>(() => getUserSession());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const refresh = () => setSession(getUserSession());
    window.addEventListener(USER_SESSION_EVENT, refresh);
    return () => window.removeEventListener(USER_SESSION_EVENT, refresh);
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    if (mode === "register" && password !== confirmation) {
      setError("The passwords do not match."); setLoading(false); return;
    }
    try {
      const result = mode === "register" ? await registerUser(email, password) : await loginUser(email, password);
      setSession(result); navigate("/account");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not sign in.");
    } finally { setLoading(false); }
  }

  function signOut() {
    logoutUser(); setSession(null); navigate("/");
  }

  return <div className="page-shell">
    <Header />
    <main className="user-access-page page-enter">
      <Link to="/" className="user-access-back"><ArrowLeft size={16} /> Back to the island guide</Link>
      <section className="user-access-card">
        <div className="user-access-art">
          <img src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1400&q=85" alt="Sri Lankan coastline in warm evening light" onError={(event)=>{event.currentTarget.onerror=null;event.currentTarget.src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=85";}} />
          <div className="user-access-art-shade" />
          <div><p className="eyebrow light">YOUR ISLAND, YOUR WAY</p><h1>Keep the places<br /><em>you love close.</em></h1><p>Sign in to return to your Ceylon Trail account.</p></div>
        </div>
        <div className="user-access-panel">
          {mode === "account" && session ? <>
            <span className="user-access-icon"><UserRoundIcon /></span><p className="eyebrow">TRAVELER ACCOUNT</p><h2>Good to have you back.</h2><p className="user-access-lede">You’re signed in as</p><p className="user-access-email">{session.user.email}</p>
            <div className="user-account-note"><Compass size={17} /><span>Your saved places and route are available on this browser.</span></div>
            <button type="button" className="user-access-submit" onClick={signOut}><LogOut size={16} /> Sign out</button>
          </> : mode === "account" ? <>
            <span className="user-access-icon"><LockKeyhole size={19} /></span><p className="eyebrow">TRAVELER ACCOUNT</p><h2>Your island, saved.</h2><p className="user-access-lede">Sign in to your account or create one to get started.</p><Link className="user-access-submit" to="/login">Sign in</Link><p className="user-access-switch">New to Ceylon Trail? <Link to="/register">Create an account</Link></p>
          </> : <>
            <span className="user-access-icon"><LockKeyhole size={19} /></span>
            <p className="eyebrow">{mode === "register" ? "JOIN CEYLON TRAIL" : "TRAVELER ACCOUNT"}</p>
            <h2>{mode === "register" ? "Start your island story." : "Welcome back."}</h2>
            <p className="user-access-lede">{mode === "register" ? "Create an account to return to your saved places and route on this browser." : "Sign in to your traveler account."}</p>
            <form className="user-access-form" onSubmit={submit} aria-busy={loading}>
              <label htmlFor="traveler-email">Email address</label>
              <input id="traveler-email" type="email" value={email} onChange={(event)=>setEmail(event.target.value)} autoComplete="email" maxLength={254} required disabled={loading} />
              <label htmlFor="traveler-password">Password</label>
              <input id="traveler-password" type="password" value={password} onChange={(event)=>setPassword(event.target.value)} autoComplete={mode === "register" ? "new-password" : "current-password"} minLength={8} maxLength={128} required disabled={loading} />
              {mode === "register" && <><label htmlFor="traveler-confirm">Confirm password</label><input id="traveler-confirm" type="password" value={confirmation} onChange={(event)=>setConfirmation(event.target.value)} autoComplete="new-password" minLength={8} maxLength={128} required disabled={loading} /></>}
              {error && <p className="user-access-error" role="alert">{error}</p>}
              <button className="user-access-submit" type="submit" disabled={loading}><Compass size={16} />{loading ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}</button>
            </form>
            <p className="user-access-switch">{mode === "register" ? "Already have an account?" : "New to Ceylon Trail?"} <Link to={mode === "register" ? "/login" : "/register"}>{mode === "register" ? "Sign in" : "Create an account"}</Link></p>
          </>}
        </div>
      </section>
    </main>
  </div>;
}

function UserRoundIcon() { return <Compass size={19} />; }
