import { Heart, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const THEME_KEY = "serendib-theme";

export default function Header() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return <header className="site-header">
    <Link className="brand" to="/" aria-label="Ceylon Trail home"><span className="brand-mark">ct</span><span><strong>CEYLON TRAIL</strong><small>THE ISLAND, WELL FOUND</small></span></Link>
    <nav className="main-nav" aria-label="Main navigation"><Link to="/">Home</Link><Link to="/explore">Explore</Link><Link to="/experiences">Experiences</Link><Link to="/guides">Field notes</Link><Link to="/about">About</Link><Link to="/saved" className="saved-link"><Heart size={16} />Saved</Link></nav>
    <div className="header-actions"><button className="icon-button theme-toggle" type="button" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} onClick={() => setIsDark((current) => !current)}>{isDark ? <Sun size={16} /> : <Moon size={16} />}</button></div>
  </header>;
}
