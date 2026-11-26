import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowRight, Bookmark, Check, ChevronRight, Compass, Heart, MapPin, Menu, Mountain, Search, Sparkles, TrainFront, Waves, X } from "lucide-react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import DestinationDetails from "./pages/DestinationDetails";
import Guides from "./pages/Guides";
import GuideDetails from "./pages/GuideDetails";
import AdminDestinations from "./pages/AdminDestinations";
import AdminLogin from "./pages/AdminLogin";
import Explore from "./pages/Explore";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import { getDestinations, type Destination } from "./api/destinations";

type Place = Destination & { tags: string[]; duration: string; bestFor: string; region: string };
const places: Place[] = [
  { id: 101, name: "Sigiriya", slug: "sigiriya", location: "Matale District · Cultural Triangle", shortDescription: "Climb the ancient rock citadel above a sea of green, then explore the water gardens at its foot.", imageUrl: "https://images.unsplash.com/photo-1588598198321-9735fd524c0b?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 1, category: { id: 1, name: "Culture & heritage", slug: "heritage" }, tags: ["culture", "history", "heritage"], duration: "Half day", bestFor: "History, views", region: "Cultural Triangle" },
  { id: 102, name: "Ella", slug: "ella", location: "Badulla District · Hill Country", shortDescription: "A mountain town of tea-scented walks, cloud forests and long, slow mornings.", imageUrl: "https://images.unsplash.com/photo-1588598198321-9735fd524c0b?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 2, category: { id: 2, name: "Nature & adventure", slug: "nature" }, tags: ["nature", "hiking", "tea", "adventure"], duration: "1–2 days", bestFor: "Hiking, tea", region: "Hill Country" },
  { id: 103, name: "Galle Fort", slug: "galle-fort", location: "Galle District · South Coast", shortDescription: "Wander ramparts, quiet lanes and independent shops inside a living coastal fort.", imageUrl: "https://images.unsplash.com/photo-1580974852861-c381510bc98a?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 1, category: { id: 1, name: "Culture & heritage", slug: "heritage" }, tags: ["culture", "history", "coast", "heritage"], duration: "Half day", bestFor: "Architecture, food", region: "South Coast" },
  { id: 104, name: "Yala National Park", slug: "yala", location: "Hambantota District · Southeast", shortDescription: "Track elephants, crocodiles and birdlife through a patchwork of scrub, lagoons and forest.", imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 3, category: { id: 3, name: "Wildlife & safari", slug: "wildlife" }, tags: ["wildlife", "safari", "nature"], duration: "1 day", bestFor: "Wildlife, photography", region: "Southeast" },
  { id: 105, name: "Mirissa", slug: "mirissa", location: "Matara District · South Coast", shortDescription: "Golden sand, palm-lined coves and small cafés make a gentle base by the sea.", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 4, category: { id: 4, name: "Beach & coast", slug: "coast" }, tags: ["beach", "coast", "surf", "whales"], duration: "1–2 days", bestFor: "Swimming, slow days", region: "South Coast" },
  { id: 106, name: "Anuradhapura", slug: "anuradhapura", location: "North Central Province · Cultural Triangle", shortDescription: "A vast sacred city of ancient stupas, monastery ruins and shade beneath the bodhi tree.", imageUrl: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 1, category: { id: 1, name: "Culture & heritage", slug: "heritage" }, tags: ["culture", "history", "heritage"], duration: "1 day", bestFor: "History, cycling", region: "Cultural Triangle" },
  { id: 107, name: "Kandy", slug: "kandy", location: "Central Province · Hill Country", shortDescription: "A lakeside city where temple traditions, markets and botanical gardens meet the hills.", imageUrl: "https://images.unsplash.com/photo-1590123732197-e7079d7a7c3e?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 1, category: { id: 1, name: "Culture & heritage", slug: "heritage" }, tags: ["culture", "history", "heritage", "tea"], duration: "1 day", bestFor: "Culture, gardens", region: "Hill Country" },
  { id: 108, name: "Trincomalee", slug: "trincomalee", location: "Eastern Province · East Coast", shortDescription: "A bright-blue bay, temple views and laid-back beaches on the island's east coast.", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 4, category: { id: 4, name: "Beach & coast", slug: "coast" }, tags: ["beach", "coast", "culture", "diving"], duration: "1–2 days", bestFor: "Sea, history", region: "East Coast" },
  { id: 109, name: "Horton Plains", slug: "horton-plains", location: "Nuwara Eliya District · Hill Country", shortDescription: "Walk the high plateau through cloud forest to an immense escarpment above the lowlands.", imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 2, category: { id: 2, name: "Nature & adventure", slug: "nature" }, tags: ["nature", "hiking", "adventure"], duration: "Half day", bestFor: "Hiking, sunrise", region: "Hill Country" },
  { id: 110, name: "Polonnaruwa", slug: "polonnaruwa", location: "North Central Province · Cultural Triangle", shortDescription: "Follow a cycle trail through the elegant stone remains of a medieval capital.", imageUrl: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 1, category: { id: 1, name: "Culture & heritage", slug: "heritage" }, tags: ["culture", "history", "heritage"], duration: "1 day", bestFor: "Ruins, cycling", region: "Cultural Triangle" },
  { id: 111, name: "Arugam Bay", slug: "arugam-bay", location: "Ampara District · East Coast", shortDescription: "A surf town with a relaxed rhythm, warm shallows and wildlife lagoons nearby.", imageUrl: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 4, category: { id: 4, name: "Beach & coast", slug: "coast" }, tags: ["beach", "coast", "surf", "adventure"], duration: "1–3 days", bestFor: "Surf, nature", region: "East Coast" },
  { id: 112, name: "Minneriya", slug: "minneriya", location: "North Central Province · Cultural Triangle", shortDescription: "Seasonal wetlands and open grasslands known for memorable elephant gatherings.", imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1100&q=85", seoDescription: null, categoryId: 3, category: { id: 3, name: "Wildlife & safari", slug: "wildlife" }, tags: ["wildlife", "safari", "nature"], duration: "Half day", bestFor: "Elephants, birds", region: "Cultural Triangle" },
];

const categories = [
  { name: "Culture & heritage", line: "Ancient cities, temples & living traditions", icon: "heritage", tag: "culture" },
  { name: "Beach & coast", line: "Warm water, surf breaks & quiet coves", icon: "coast", tag: "beach" },
  { name: "Nature & adventure", line: "Tea trails, waterfalls & highland walks", icon: "nature", tag: "nature" },
  { name: "Wildlife & safari", line: "National parks & wild encounters", icon: "wildlife", tag: "wildlife" },
];
const packages = [
  { title: "The island in a week", days: "7 days", route: "Colombo · Sigiriya · Kandy · Ella · Galle", image: "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1100&q=85", tag: "First visit" },
  { title: "Wild places, slow mornings", days: "5 days", route: "Wilpattu · Cultural Triangle · Yala", image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1100&q=85", tag: "Wildlife" },
  { title: "The east coast escape", days: "10 days", route: "Trincomalee · Pasikudah · Arugam Bay", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1100&q=85", tag: "Sea & surf" },
];
const aliases: Record<string, string> = { "thresch-incomalee": "trincomalee", trinco: "trincomalee", "sri lanka": "" };
const interests = ["Culture", "Beach", "Nature", "Wildlife", "Adventure"];
const fallbackData = places as Destination[];

function readIds(key: string): number[] {
  try { return JSON.parse(localStorage.getItem(key) ?? "[]") as number[]; } catch { return []; }
}

function HomePage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>(fallbackData);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [favorites, setFavorites] = useState<number[]>(() => readIds("serendib-favorites"));
  const [planned, setPlanned] = useState<number[]>(() => readIds("ceylon-trail-plan"));
  const [activePlace, setActivePlace] = useState<Place | null>(null);
  const [showPlanner, setShowPlanner] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [tripDays, setTripDays] = useState(7);
  const [pace, setPace] = useState("Balanced");
  const [budget, setBudget] = useState("Mid-range");
  const [travellers, setTravellers] = useState("Couple");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Culture", "Nature"]);
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAllPlaces, setShowAllPlaces] = useState(false);

  useEffect(() => {
    getDestinations().then((data) => { if (data.length) setDestinations(data); }).catch(() => undefined);
  }, []);

  const enrichedPlaces = useMemo(() => {
    const known = new Map(places.map((place) => [place.name.toLowerCase(), place]));
    const additional = destinations.filter((item) => !known.has(item.name.toLowerCase()));
    const curated = places.map((place) => {
      const remote = destinations.find((item) => item.name.toLowerCase() === place.name.toLowerCase());
      return remote ? { ...place, ...remote, id: place.id, category: place.category, tags: place.tags } : place;
    });
    return [...curated, ...additional.map((item) => ({
      ...item, tags: [item.category?.name?.toLowerCase() ?? "explore"], duration: "Half day", bestFor: item.category?.name ?? "Exploring", region: item.location.split("·").pop()?.trim() ?? "Sri Lanka",
    } as Place))];
  }, [destinations]);

  const filtered = useMemo(() => {
    const rawQuery = query.trim().toLowerCase();
    const normalizedQuery = aliases[rawQuery] ?? rawQuery;
    return enrichedPlaces.filter((place) => {
      const text = [place.name, place.location, place.shortDescription, place.category?.name, ...place.tags].join(" ").toLowerCase();
      const matchQuery = !normalizedQuery || text.includes(normalizedQuery) || (normalizedQuery === "" && rawQuery === "sri lanka");
      const matchCategory = category === "All" || place.category?.name === category;
      return matchQuery && matchCategory;
    });
  }, [category, enrichedPlaces, query]);

  const suggestions = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (text.length < 2 || !suggestionsOpen) return [];
    const normalized = aliases[text] ?? text;
    return enrichedPlaces.filter((place) => place.name.toLowerCase().includes(normalized) || place.location.toLowerCase().includes(normalized)).slice(0, 4);
  }, [enrichedPlaces, query, suggestionsOpen]);

  function toggleFavorite(id: number) {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("serendib-favorites", JSON.stringify(next));
      return next;
    });
  }
  function togglePlan(id: number) {
    setPlanned((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("ceylon-trail-plan", JSON.stringify(next));
      return next;
    });
  }
  function startSearch(event: FormEvent) {
    event.preventDefault();
    setSuggestionsOpen(false);
    document.getElementById("discover")?.scrollIntoView({ behavior: "smooth" });
  }
  function buildTrip() {
    const wanted = selectedInterests.map((item) => item.toLowerCase());
    const matches = enrichedPlaces.filter((place) => place.tags.some((tag) => wanted.some((interest) => tag.includes(interest) || interest.includes(tag))));
    const pool = matches.length ? matches : enrichedPlaces;
    const countPerDay = pace === "Relaxed" ? 1 : pace === "Fast-paced" ? 3 : 2;
    const limit = Math.min(tripDays * countPerDay, pool.length);
    const ordered = [...pool].sort((a, b) => {
      const order = ["Cultural Triangle", "Hill Country", "South Coast", "East Coast", "Southeast"];
      return order.indexOf(a.region) - order.indexOf(b.region);
    });
    const pinned = planned.map((id) => enrichedPlaces.find((place) => place.id === id)).filter((place): place is Place => Boolean(place));
    const selected = [...new Map([...pinned, ...ordered].map((place) => [place.id, place])).values()].slice(0, Math.max(limit, pinned.length));    setItinerary(selected);
  }
  const shownPlaces = showAllPlaces ? filtered : filtered.slice(0, 6);

  return (
    <div className="trail-app">
      <div className="announcement"><span className="announcement-dot" /> A little island with a lot of ways to get lost <span className="announcement-sep">·</span> Find your own way in <ArrowRight size={13} /></div>
      <header className="trail-header">
        <a href="#top" className="trail-brand" aria-label="Ceylon Trail home"><span className="brand-emblem">ct</span><span><b>CEYLON TRAIL</b><small>THE ISLAND, WELL FOUND</small></span></a>
        <button className="mobile-menu-trigger" type="button" aria-label="Open menu" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X /> : <Menu />}</button>
        <nav className={mobileOpen ? "trail-nav is-open" : "trail-nav"} aria-label="Main navigation">
          <a href="#discover" onClick={() => setMobileOpen(false)}>Places</a><a href="#journeys" onClick={() => setMobileOpen(false)}>Journeys</a><a href="#planner" onClick={() => setMobileOpen(false)}>Trip planner</a><a href="#field-notes" onClick={() => setMobileOpen(false)}>Field notes</a>
        </nav>
        <div className="trail-header-actions"><button className="saved-shortcut" onClick={() => navigate("/saved")}><Bookmark size={15} /> Saved <span>{favorites.length}</span></button><button className="plan-top-button" onClick={() => { setShowPlanner(true); setMobileOpen(false); }}>Plan my trip <ArrowRight size={15} /></button></div>
      </header>

      <main id="top">
        <section className="trail-hero">
          <img className="hero-photo" src="https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=2200&q=90" alt="Lush mountain valley and tea country in Sri Lanka" />
          <div className="hero-shade" />
          <div className="hero-copy">
            <p className="hero-kicker"><span /> SRI LANKA · 6°N 80°E</p>
            <h1>A small island.<br /><em>A thousand</em><br />ways to feel it.</h1>
            <p className="hero-subcopy">Find the quiet beach, the train window seat, the little place you’ll still talk about years from now.</p>
            <form className="hero-searchbox" onSubmit={startSearch}>
              <Search size={19} />
              <div className="search-field"><label htmlFor="hero-search">WHERE TO?</label><input id="hero-search" value={query} onChange={(event) => { setQuery(event.target.value); setSuggestionsOpen(true); }} onFocus={() => setSuggestionsOpen(true)} onBlur={() => window.setTimeout(() => setSuggestionsOpen(false), 140)} placeholder="Try Ella, Sigiriya, or the coast" autoComplete="off" /></div>
              <button type="submit">Find your place <ArrowRight size={17} /></button>
              {suggestions.length > 0 && <div className="search-suggestions">{suggestions.map((place) => <button type="button" key={place.id} onMouseDown={(event) => event.preventDefault()} onClick={() => { setQuery(place.name); setSuggestionsOpen(false); const match = places.find((item) => item.name === place.name); setActivePlace(match ?? { ...place, tags: [], duration: "Half day", bestFor: place.category?.name ?? "Exploring", region: place.location }); }}>{place.name}<small>{place.location}</small></button>)}</div>}
            </form>
            <div className="hero-notes"><span><Check size={14} /> Made for curious travellers</span><span>Scroll to wander <ArrowDown size={13} /></span></div>
          </div>
          <div className="hero-caption"><span>01 / 04</span><span>HILL COUNTRY · SRI LANKA</span></div>
          <div className="hero-stamp"><Compass size={20} /><span>GOOD PLACES.<br />GOOD PACE.</span></div>
        </section>

        <section className="intro-strip"><span className="intro-mark">✳</span><p>Not just a list of places.<br /><strong>A little help finding your kind of island.</strong></p><span className="intro-side">CURATED WITH CARE<br />UPDATED FOR YOUR NEXT JOURNEY</span></section>

        <section className="interest-section section-wrap" id="discover">
          <div className="section-heading-row"><div><p className="section-overline">PICK A PATH</p><h2>What are you <em>in the mood for?</em></h2></div><p className="section-aside">The island is small enough to cross, and big enough to surprise you at every turn.</p></div>
          <div className="interest-grid">{categories.map((item, index) => <button className="interest-card" key={item.name} onClick={() => { setCategory(item.name); document.getElementById("places")?.scrollIntoView({ behavior: "smooth" }); }}><span className="interest-count">0{index + 1}</span><span className="interest-icon">{item.icon === "coast" ? <Waves /> : item.icon === "nature" ? <Mountain /> : item.icon === "wildlife" ? <Sparkles /> : <Compass />}</span><b>{item.name}</b><small>{item.line}</small><span className="interest-arrow"><ArrowRight size={18} /></span></button>)}</div>
        </section>

        <section className="places-section" id="places">
          <div className="section-wrap">
            <div className="section-heading-row places-title-row"><div><p className="section-overline">THE ISLAND, YOUR WAY</p><h2>Places that <em>stay with you.</em></h2></div><button className="quiet-link" onClick={() => { setShowAllPlaces(true); document.getElementById("places")?.scrollIntoView({ behavior: "smooth" }); }}>Explore the full guide <ArrowRight size={16} /></button></div>
            <div className="place-filters"><button className={category === "All" ? "filter-pill active" : "filter-pill"} onClick={() => setCategory("All")}>Everything</button>{categories.map((item) => <button key={item.name} className={category === item.name ? "filter-pill active" : "filter-pill"} onClick={() => setCategory(item.name)}>{item.name}</button>)}</div>
            <div className="curated-grid">{shownPlaces.map((place, index) => {
              const known = places.find((item) => item.name.toLowerCase() === place.name.toLowerCase());
              const image = place.imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1100&q=85";
              return <article className={index === 0 ? "place-card place-card-feature" : "place-card"} key={place.id}>
                <button className="place-image-button" onClick={() => setActivePlace(known ?? { ...place, tags: [], duration: "Half day", bestFor: place.category?.name ?? "Exploring", region: place.location })} aria-label={"View " + place.name}><img src={image} alt={place.name} loading="lazy" /><span className="place-label">{place.category?.name ?? "Island guide"}</span></button>
                <button className={favorites.includes(place.id) ? "place-save is-saved" : "place-save"} onClick={() => toggleFavorite(place.id)} aria-label={favorites.includes(place.id) ? "Remove saved place" : "Save place"} aria-pressed={favorites.includes(place.id)}><Heart size={17} fill={favorites.includes(place.id) ? "currentColor" : "none"} /></button>
                <div className="place-card-body"><div className="place-location"><MapPin size={13} />{place.location}</div><h3>{place.name}</h3><p>{place.shortDescription}</p><button className="place-read" onClick={() => setActivePlace(known ?? { ...place, tags: [], duration: "Half day", bestFor: place.category?.name ?? "Exploring", region: place.location })}>Get to know it <ArrowRight size={15} /></button></div>
              </article>;
            })}</div>
            {shownPlaces.length === 0 && <div className="no-results"><Compass /><h3>No places found yet</h3><p>Try another search or choose a different island mood.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
            {filtered.length > 6 && !showAllPlaces && <button className="load-more-button" onClick={() => setShowAllPlaces(true)}>See all {filtered.length} places <ArrowRight size={16} /></button>}
          </div>
        </section>

        <section className="journeys-section section-wrap" id="journeys">
          <div className="section-heading-row"><div><p className="section-overline">A GOOD PLACE TO START</p><h2>Journeys, <em>already taking shape.</em></h2></div><p className="section-aside">A few thoughtful routes for your first sketch. Make them yours with the trip planner.</p></div>
          <div className="journey-grid">{packages.map((item, index) => <article className="journey-card" key={item.title}><div className="journey-image"><img src={item.image} alt="" loading="lazy" /><span>{item.tag}</span></div><div className="journey-body"><div className="journey-meta"><span>{item.days}</span><span>0{index + 1}</span></div><h3>{item.title}</h3><p>{item.route}</p><button onClick={() => { setTripDays(Number.parseInt(item.days, 10)); setShowPlanner(true); }}>Make it your own <ArrowRight size={15} /></button></div></article>)}</div>
        </section>

        <section className="planner-banner" id="planner"><div className="planner-banner-art"><div className="sun-disc" /><div className="hill hill-back" /><div className="hill hill-front" /><span className="tiny-path">✳</span></div><div className="planner-banner-copy"><p className="section-overline">YOUR TRIP, YOUR RHYTHM</p><h2>Somewhere between<br /><em>a plan and a detour.</em></h2><p>Tell us what you love and how long you have. We’ll sketch a route that keeps the long drives in check.</p><button className="dark-cta" onClick={() => setShowPlanner(true)}>Build my island route <ArrowRight size={16} /></button></div><div className="planner-number">02 <span>/ 04</span></div></section>

        <section className="travel-notes section-wrap" id="field-notes"><div className="notes-head"><p className="section-overline">BEFORE YOU GO</p><h2>A few useful <em>little things.</em></h2><p>Thoughtful travel begins with simple, up-to-date information.</p></div><div className="notes-grid"><a href="https://www.srilanka.travel/" target="_blank" rel="noreferrer"><span>01</span><b>Official visitor information</b><p>Entry guidance, destination information and travel resources from Sri Lanka Tourism.</p><ChevronRight /></a><a href="https://railway.gov.lk/" target="_blank" rel="noreferrer"><span>02</span><b>Railway updates</b><p>Check the official railway site for current services and passenger information.</p><ChevronRight /></a><a href="https://www.srilanka.travel/plan-your-trip" target="_blank" rel="noreferrer"><span>03</span><b>Travel responsibly</b><p>Support local businesses, respect sacred places and leave wildlife its space.</p><ChevronRight /></a></div></section>
      </main>
      <footer className="trail-footer"><div className="footer-brand"><span className="brand-emblem">ct</span><span><b>CEYLON TRAIL</b><small>THE ISLAND, WELL FOUND</small></span></div><p>A field guide to the island we call home.</p><div className="footer-links"><a href="#discover">Explore</a><a href="#planner">Trip planner</a><a href="/Ceylon-Trail/#/about">About</a><a href="https://www.srilanka.travel/" target="_blank" rel="noreferrer">Sri Lanka Tourism ↗</a></div><small className="copyright">© 2026 Ceylon Trail · Made with care in Sri Lanka</small></footer>

      {activePlace && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActivePlace(null); }}><section className="place-modal" role="dialog" aria-modal="true" aria-label={activePlace.name}><button className="modal-close" onClick={() => setActivePlace(null)} aria-label="Close details"><X /></button><img src={activePlace.imageUrl || ""} alt={activePlace.name} /><div className="modal-content"><p className="section-overline">{activePlace.category?.name} · {activePlace.region}</p><h2>{activePlace.name}</h2><p>{activePlace.shortDescription}</p><div className="modal-facts"><span><MapPin />{activePlace.location}</span><span><Compass />{activePlace.duration}</span><span><Sparkles />{activePlace.bestFor}</span></div><div className="modal-actions"><button className="dark-cta" onClick={() => { if (!planned.includes(activePlace.id)) togglePlan(activePlace.id); setShowPlanner(true); setActivePlace(null); }}>Add to my route <ArrowRight size={16} /></button><button className="modal-save" onClick={() => toggleFavorite(activePlace.id)}><Heart size={16} fill={favorites.includes(activePlace.id) ? "currentColor" : "none"} /> {favorites.includes(activePlace.id) ? "Saved" : "Save place"}</button></div></div></section></div>}

      {showPlanner && <div className="modal-backdrop planner-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowPlanner(false); }}><section className="planner-modal" role="dialog" aria-modal="true" aria-label="Build your trip"><button className="modal-close" onClick={() => setShowPlanner(false)} aria-label="Close planner"><X /></button><div className="planner-modal-heading"><p className="section-overline">A ROUTE THAT FEELS LIKE YOU</p><h2>Let’s plan a <em>little escape.</em></h2><p>Start with a few choices. You can change everything later.</p></div><div className="planner-form"><label className="days-label">How many days? <span>{tripDays} days</span><input type="range" min="1" max="30" value={tripDays} onChange={(event) => { setTripDays(Number(event.target.value)); setItinerary([]); }} /></label><fieldset><legend>What calls to you?</legend><div className="interest-options">{interests.map((item) => <button type="button" key={item} className={selectedInterests.includes(item) ? "option-chip selected" : "option-chip"} onClick={() => setSelectedInterests((current) => current.includes(item) ? current.filter((interest) => interest !== item) : [...current, item])}>{selectedInterests.includes(item) && <Check size={14} />}{item}</button>)}</div></fieldset><div className="planner-selects"><label>Your pace<select value={pace} onChange={(event) => setPace(event.target.value)}><option>Relaxed</option><option>Balanced</option><option>Fast-paced</option></select></label><label>Travel style<select value={budget} onChange={(event) => setBudget(event.target.value)}><option>Backpacker</option><option>Mid-range</option><option>Comfort</option></select></label><label>Who’s going?<select value={travellers} onChange={(event) => setTravellers(event.target.value)}><option>Solo</option><option>Couple</option><option>Family</option><option>Group</option></select></label></div><button className="dark-cta generate-trip" onClick={buildTrip}>Sketch my route <Sparkles size={16} /></button>{itinerary.length > 0 && <div className="itinerary-result"><div className="itinerary-title"><div><p className="section-overline">YOUR FIRST DRAFT · {budget.toUpperCase()} · {travellers.toUpperCase()}</p><h3>A route with room to breathe</h3></div><button onClick={() => setItinerary([])}>Edit choices</button></div><p className="itinerary-note"><TrainFront size={15} /> Travel time varies by road and rail. Leave space between regions and check current transport updates.</p><ol>{itinerary.map((place, index) => <li key={place.id}><span className="day-number">DAY {Math.floor(index / (pace === "Relaxed" ? 1 : pace === "Fast-paced" ? 3 : 2)) + 1}</span><div><b>{place.name}</b><small>{place.region} · {place.duration}</small></div><button onClick={() => togglePlan(place.id)} aria-label="Save this stop">{planned.includes(place.id) ? <Check size={17} /> : <Bookmark size={17} />}</button></li>)}</ol><p className="planner-disclaimer">A planning sketch, not a live booking or transport schedule. Confirm opening days, seasonal conditions and transport before setting out.</p></div>}</div></section></div>}
    </div>
  );
}


function SavedPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => readIds("serendib-favorites"));
  const [remotePlaces, setRemotePlaces] = useState<Destination[]>([]);
  useEffect(() => { getDestinations().then(setRemotePlaces).catch(() => undefined); }, []);
  const savedPlaces = favoriteIds.map((id) => places.find((place) => place.id === id) ?? remotePlaces.find((place) => place.id === id)).filter((place): place is Destination => Boolean(place));
  function remove(id: number) {
    const next = favoriteIds.filter((item) => item !== id);
    setFavoriteIds(next);
    localStorage.setItem("serendib-favorites", JSON.stringify(next));
  }
  return <div className="trail-app"><header className="trail-header"><a href="/Ceylon-Trail/#/" className="trail-brand"><span className="brand-emblem">ct</span><span><b>CEYLON TRAIL</b><small>THE ISLAND, WELL FOUND</small></span></a><a className="plan-top-button" href="/Ceylon-Trail/#/">Back to the island <ArrowRight size={15} /></a></header><main className="saved-page"><div className="section-wrap" style={{paddingTop:64,paddingBottom:90}}><p className="section-overline">YOUR TRAVEL LIST</p><h1 style={{font:"500 clamp(42px,7vw,70px) var(--serif)",color:"var(--trail-forest)"}}>Saved <em style={{color:"#b66a4c"}}>places.</em></h1><p style={{color:"#718078",fontSize:13}}>Keep the places you want to remember for your next island journey.</p>{savedPlaces.length === 0 ? <div className="no-results"><Bookmark /><h3>No saved places yet</h3><p>Tap the heart on a place to keep it here for later.</p><a className="dark-cta" href="/Ceylon-Trail/#/">Explore places <ArrowRight size={15} /></a></div> : <div className="curated-grid">{savedPlaces.map((place) => { const known=places.find((item)=>item.id===place.id); const image=place.imageUrl || "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1100&q=85"; return <article className="place-card" key={place.id}><img src={image} alt={place.name} style={{width:"100%",height:220,objectFit:"cover"}}/><div className="place-card-body"><div className="place-location"><MapPin size={13}/>{place.location}</div><h3>{place.name}</h3><p>{place.shortDescription}</p><button className="place-read" onClick={()=>remove(place.id)}><Heart size={15} fill="currentColor"/> Remove from saved</button>{known && <a className="place-read" href="/Ceylon-Trail/#/">Back to island guide <ArrowRight size={15}/></a>}</div></article>; })}</div>}</div></main></div>;
}

export default function App() {
  return <Routes><Route path="/" element={<HomePage />} /><Route path="/saved" element={<SavedPage />} /><Route path="/explore" element={<Explore />} /><Route path="/about" element={<About />} /><Route path="/guides" element={<Guides />} /><Route path="/guides/:slug" element={<GuideDetails />} /><Route path="/destinations/:id" element={<DestinationDetails favoriteIds={readIds("serendib-favorites")} onToggleFavorite={() => undefined} />} /><Route path="/admin/login" element={<AdminLogin />} /><Route path="/admin/destinations" element={<ProtectedRoute><AdminDestinations /></ProtectedRoute>} /><Route path="/admin" element={<Navigate to="/admin/destinations" replace />} /></Routes>;
}
