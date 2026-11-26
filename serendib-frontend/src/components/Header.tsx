import { Heart, Menu, Moon, Sun, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import UserAccountLink from "./UserAccountLink";

const THEME_KEY = "serendib-theme";

export default function Header() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return <header className="site-header">
    <Link className="brand" to="/" aria-label="Ceylon Trail home"><span className="brand-mark">ct</span><span><strong>CEYLON TRAIL</strong><small>THE ISLAND, WELL FOUND</small></span></Link>
    <button className="icon-button mobile-nav-toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen((current) => !current)}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
    <nav id="main-navigation" className={menuOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><Link to="/">Home</Link><Link to="/explore">Explore</Link><Link to="/experiences">Experiences</Link><Link to="/travel-desk">Travel desk</Link><Link to="/guides">Field notes</Link><Link to="/about">About</Link><Link to="/saved" className="saved-link"><Heart size={16} />Saved</Link></nav>
    <div className="header-actions"><UserAccountLink /><button className="icon-button theme-toggle" type="button" aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"} aria-pressed={isDark} onClick={() => setIsDark((current) => !current)}>{isDark ? <Sun size={16} /> : <Moon size={16} />}</button></div>
  </header>;
}
