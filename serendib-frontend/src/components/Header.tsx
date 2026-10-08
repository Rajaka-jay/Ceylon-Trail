import {Heart, Moon, Search}from "lucide-react";

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
                <a href="guides">Guides</a>
                <a href="about">About</a>
                <a href="saved"><Heart size={16} /></a>
            </nav>

            <div className="header-actions">
                <button className="icon-button" aria-lable="Toggle dark mode">
                    <Moon size={16} />
                </button>
            </div>
        </header>
    )
}