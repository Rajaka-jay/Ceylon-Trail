import {useState} from "react";
import { Search, ArrowRight } from "lucide-react";
import Header from "./components/Header";
import DestinationCard from "./components/DestinationCard";
import { destinations } from "./data/destinations";

export default function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDestinations = destinations.filter((destination) => {
    const searchText = searchTerm.toLowerCase();

    return (
      destination.name.toLowerCase().includes(searchText) ||
      destination.location.toLowerCase().includes(searchText) ||
      destination.category.toLowerCase().includes(searchText)
    );
  });
  return (
    <div className="app" id="top">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow light">A SLOWER WAY TO SEE THE ISLAND</p>
            <h1>
              Go where the  

              <em>green</em> things are.
            </h1>
            <p className="hero-description">
              Thoughtful guides to Sri Lanka's wild coastlines, misty hills
              and ancient roads.
            </p>
            <form className="hero-search" onSubmit={(event) => event.preventDefault()}>
              <Search size={19} />
              <input
                type="search"
                placeholder="Search destinations, things to do..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />

              <button type="submit">Explore <ArrowRight size={16} /></button>
            </form>
            <div className="hero-facts">
              <span><i /> 10 places worth the detour</span>
              <span>Updated for 2025</span>
            </div>
          </div>
          <span className="hero-location">01 / 04 &nbsp; · &nbsp; Central Highlands</span>
        </section>

        <section className="intro-section" id="about">
          <div>
            <p className="eyebrow">THE SERENDIB EDIT</p>
            <h2>One island,  
            <em>many ways in.</em></h2>
          </div>
          <p className="intro-copy">
            From the first train ride into the hills to the last swim at sunset,
            Sri Lanka rewards the curious. Start with the places we keep coming back to.
          </p>
        </section>

        <section className="explore-section" id="explore">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PLACES TO BEGIN</p>
              <h2>Find your next <em>good place.</em></h2>
            </div>
            <a className="text-link" href="#all-destinations">See all places <ArrowRight size={16} /></a>
          </div>
          <div className="destination-grid">
            {filteredDestinations.length > 0 ? (
              filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                />
            ))
          ) : (
            <p className="empty-message">
              No destinations found. Try another search.
            </p>
          )}

          </div>
        </section>

        <section className="guide-banner" id="guides">
          <div>
            <p className="eyebrow light">THE NOTEBOOK</p>
            <h2>Ideas for  
<em>the long way.</em></h2>
          </div>
          <p>Field notes, practical help and small stories from around Sri Lanka.</p>
          <button className="outline-light-button">Read the guides <ArrowRight size={16} /></button>
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2025 Serendib Journal</span>
        <span>Made for slow travellers</span>
      </footer>
    </div>
  );
}