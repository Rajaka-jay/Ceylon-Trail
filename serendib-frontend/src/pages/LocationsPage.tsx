import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import TripRouteMap from "../components/TripRouteMap";
import { places } from "../data/travelPlaces";

const categories = ["All places", ...Array.from(new Set(places.map((place) => place.category?.name ?? "Other")))];

export default function LocationsPage() {
  const [activeCategory, setActiveCategory] = useState("All places");
  const [query, setQuery] = useState("");
  const filteredPlaces = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return places.filter((place) => {
      const matchesCategory = activeCategory === "All places" || place.category?.name === activeCategory;
      const searchable = [place.name, place.location, place.region, place.shortDescription, ...place.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [activeCategory, query]);

  return (
    <div className="page-shell locations-page page-enter">
      <Header />
      <main className="locations-main">
        <section className="locations-hero">
          <div className="locations-hero-copy">
            <p className="desk-kicker">PLACES, BY YOUR KIND OF ISLAND</p>
            <h1>Find your <em>somewhere.</em></h1>
            <p>From old cities and hill trails to coastlines and wild places, explore Sri Lanka on one live map.</p>
          </div>
          <Link className="locations-plan-link" to="/?planner=1">Plan a route <ArrowRight size={16} /></Link>
        </section>

        <section className="locations-browser" aria-label="Explore destinations on the map">
          <div className="locations-toolbar">
            <label className="locations-search">
              <Search size={18} />
              <span className="sr-only">Search destinations</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a place, region or interest" />
              {query && <button type="button" onClick={() => setQuery("")} aria-label="Clear destination search"><X size={16} /></button>}
            </label>
            <p className="locations-result-count"><b>{filteredPlaces.length}</b> {filteredPlaces.length === 1 ? "place" : "places"} on the map</p>
          </div>

          <div className="locations-filters" role="group" aria-label="Filter destinations by category">
            {categories.map((category) => <button key={category} type="button" className={activeCategory === category ? "locations-filter is-active" : "locations-filter"} aria-pressed={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
          </div>

          {filteredPlaces.length > 0
            ? <div className="locations-map-wrap"><TripRouteMap itinerary={filteredPlaces} showDirections fullPage eyebrow="EXPLORE SRI LANKA" title="Places across the island" /></div>
            : <div className="locations-empty"><Search size={23} /><h2>No places match that search</h2><p>Try another name, region, or category.</p><button type="button" onClick={() => { setQuery(""); setActiveCategory("All places"); }}>Clear filters</button></div>}
        </section>

        <section className="locations-note"><p>Choose a destination marker or a place in the list to view its details. Google directions open only when you choose a directions link.</p></section>
      </main>
    </div>
  );
}
