import { Heart, Moon } from "lucide-react";
import { Link } from "react-router-dom";

export default function Header( ) {
    return(
        <header className="site-header">
            <a className="brand" href="#top" area-lable="Serendib Home">
                <span className ="brand-mark">s</span>
                <span>
                    <strong>serendib</strong>
                    <small>the island journal</small>
                </span>
            </a>

            <nav className="main-nav"  aria-label="Main Navigation">
                <a href="explore">Explore</a>
                <Link to="/guides">Guides</Link>
                <a href="about">About</a>
                <Link to="/saved" className="saved-link">
                    <Heart size={16} />
                    Saved
                </Link>

            </nav>

            <div className="header-actions">
                <button className="icon-button" aria-lable="Toggle dark mode">
                    <Moon size={16} />
                </button>
            </div>
        </header>
    )
}