import { useEffect, useState } from "react";
import { ArrowRight, Compass, MapPin, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAdminProfile, logoutAdmin } from "../api/auth";
import { getCategories, getDestinations, type Category, type Destination } from "../api/destinations";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState("");
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function loadDashboard() {
      try {
        setError("");
        const admin = await getAdminProfile();
        const [destinationRows, categoryRows] = await Promise.all([getDestinations(), getCategories()]);
        if (!active) return;
        setAdminEmail(admin.email);
        setDestinations(destinationRows);
        setCategories(categoryRows);
      } catch (loadError) {
        if (!active) return;
        const message = loadError instanceof Error ? loadError.message : "Could not load the dashboard.";
        if (!localStorage.getItem("adminToken")) navigate("/admin/login", { replace: true });
        else setError(message);
      } finally {
        if (active) setLoading(false);
      }
    }
    void loadDashboard();
    return () => { active = false; };
  }, [navigate]);

  function handleLogout() {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  }

  return <div className="admin-dashboard-page">
    <header className="admin-dashboard-header">
      <Link to="/" className="admin-dashboard-brand"><span className="admin-dashboard-mark">CT</span><span><b>CEYLON TRAIL</b><small>STUDIO</small></span></Link>
      <nav aria-label="Admin navigation">
        <Link to="/">View public guide</Link>
        <button type="button" onClick={handleLogout}>Sign out</button>
      </nav>
    </header>

    <main className="admin-dashboard-main">
      <section className="admin-dashboard-welcome">
        <div>
          <p className="eyebrow">SITE ADMINISTRATION</p>
          <h1>Your island guide,<br /><em>well looked after.</em></h1>
          <p>Manage the destination records that appear across Ceylon Trail.</p>
        </div>
        <div className="admin-dashboard-session"><ShieldCheck size={18} /><span>{adminEmail || "Verified admin session"}</span></div>
      </section>

      {error && <div className="admin-message admin-message-error" role="alert">{error}</div>}

      <section className="admin-dashboard-stats" aria-label="Guide overview">
        <article className="admin-dashboard-stat">
          <span className="admin-dashboard-stat-icon"><MapPin size={18} /></span>
          <p>Destinations</p>
          <strong>{loading ? "—" : destinations.length}</strong>
          <small>Published in the island guide</small>
        </article>
        <article className="admin-dashboard-stat">
          <span className="admin-dashboard-stat-icon"><Compass size={18} /></span>
          <p>Categories</p>
          <strong>{loading ? "—" : categories.length}</strong>
          <small>Ways to explore the island</small>
        </article>
      </section>

      <section className="admin-dashboard-manage">
        <div>
          <p className="eyebrow">CONTENT MANAGEMENT</p>
          <h2>Keep the guide current.</h2>
          <p>Add new places, update descriptions and categories, or remove records that are no longer useful.</p>
        </div>
        <Link className="admin-dashboard-action" to="/admin/destinations">Manage destinations <ArrowRight size={16} /></Link>
      </section>

      <section className="admin-dashboard-recent">
        <div className="admin-dashboard-section-heading">
          <div><p className="eyebrow">DATABASE</p><h2>Recent destinations</h2></div>
          <span>{loading ? "Loading…" : `${destinations.length} total`}</span>
        </div>
        {loading ? <p className="admin-dashboard-state">Loading guide records…</p> : destinations.length === 0 ? <p className="admin-dashboard-state">No destinations were returned by the database.</p> : (
          <div className="admin-dashboard-table-wrap">
            <table className="admin-dashboard-table">
              <thead><tr><th>Destination</th><th>Region</th><th>Category</th></tr></thead>
              <tbody>{destinations.slice(0, 6).map((destination) => (
                <tr key={destination.id}>
                  <td><strong>{destination.name}</strong><small>/{destination.slug}</small></td>
                  <td>{destination.location}</td>
                  <td>{destination.category?.name ?? "Uncategorized"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>
      <p className="admin-dashboard-footnote">Destination changes are saved to the connected PostgreSQL database.</p>
    </main>
  </div>;
}
