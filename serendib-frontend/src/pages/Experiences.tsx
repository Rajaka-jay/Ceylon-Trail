import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Bookmark, Check, Compass, MapPin, Search } from "lucide-react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { places } from "../data/travelPlaces";

type Experience = {
  id: string;
  title: string;
  category: string;
  destinationId: number;
  location: string;
  duration: string;
  description: string;
  image: string;
};

const experiences: Experience[] = [
  { id: "hill-rail", title: "Take the slow train through tea country", category: "Slow journeys", destinationId: 102, location: "Kandy to Ella · Hill Country", duration: "A day on the rails", description: "Trade the road for an open window, changing light and long views across the highlands.", image: "https://cdn.kimkim.com/files/a/images/5b45731b3cd0909d725e57fa311ddb109d87fecb/original-287ed71f475c9270e007a20f899e5c11.jpg" },
  { id: "sigiriya", title: "Walk through an ancient sky kingdom", category: "Culture & heritage", destinationId: 101, location: "Sigiriya · Cultural Triangle", duration: "Half day", description: "Trace the gardens, water features and rock-top story of one of the island’s most remarkable places.", image: "https://traveltaleslanka.com/wp-content/uploads/2023/09/final-dl.beatsnoop.com-cjRkNX5r0K.jpg" },
  { id: "galle", title: "Follow the sea wall around Galle Fort", category: "Culture & heritage", destinationId: 103, location: "Galle · South Coast", duration: "Half day", description: "Explore a living coastal quarter of ramparts, small lanes, local shops and ocean views.", image: "https://cdn.audleytravel.com/752/537/55/1333686-galle.jpg" },
  { id: "minneriya", title: "Look for elephants in the dry zone", category: "Wildlife & safari", destinationId: 112, location: "Minneriya · Cultural Triangle", duration: "Half day", description: "Spend time in the open landscapes and wetlands where wildlife viewing is part of the journey.", image: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Elephants_by_the_water_%287568684536%29.jpg" },
  { id: "horton", title: "Walk the high plateau at first light", category: "Nature & adventure", destinationId: 109, location: "Horton Plains · Hill Country", duration: "Half day", description: "Follow a highland trail through open grassland, cloud forest and far-reaching views.", image: "https://cdn.kimkim.com/files/a/images/6ba718a8f84c9b837bef3df0c7e8e1da956b587f/original-509176cf8378ab1408a3dafb1e74f719.jpg" },
  { id: "mirissa", title: "Give the southern shore a slow morning", category: "Beach & coast", destinationId: 105, location: "Mirissa · South Coast", duration: "A morning or more", description: "Make space for a swim, a shoreline walk and an unhurried meal by the water.", image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85" },
  { id: "trinco", title: "Find the blue of the east coast", category: "Beach & coast", destinationId: 108, location: "Trincomalee · East Coast", duration: "A day by the sea", description: "Explore the eastern shore, where coastal scenery and local heritage sit side by side.", image: "https://travelnation.fr/sites/default/files/sri_lanka_nilaveli_beach_trincmalee.jpg" },
  { id: "arugam", title: "Spend a day around Arugam Bay", category: "Beach & coast", destinationId: 111, location: "Arugam Bay · East Coast", duration: "A day or more", description: "Follow the surf town’s easy rhythm, then leave time for the lagoons and villages nearby.", image: "https://static.wixstatic.com/media/1f9c98_26dea2141ace4719b0e2b153519aae77~mv2.jpg/v1/fill/w_960%2Ch_639%2Cal_c%2Cq_85%2Cenc_avif%2Cquality_auto/1f9c98_26dea2141ace4719b0e2b153519aae77~mv2.jpg" },
];
const categories = ["All", ...Array.from(new Set(experiences.map((item) => item.category)))];
const fallbackImages: Record<string, string> = {
  "Culture & heritage": "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=85",
  "Beach & coast": "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85",
  "Nature & adventure": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
  "Wildlife & safari": "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85",
  "Slow journeys": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
};

function readPlan() {
  try { return JSON.parse(localStorage.getItem("ceylon-trail-plan") ?? "[]") as number[]; } catch { return []; }
}

export default function Experiences() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [planned, setPlanned] = useState<number[]>(readPlan);
  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    return experiences.filter((item) =>
      (category === "All" || item.category === category) &&
      (!text || [item.title, item.category, item.location, item.description].join(" ").toLowerCase().includes(text)),
    );
  }, [category, query]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".reveal-on-scroll"));
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [category, query, filtered.length]);

  function addToPlan(id: number) {
    setPlanned((current) => {
      const next = current.includes(id) ? current : [...current, id];
      localStorage.setItem("ceylon-trail-plan", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="experiences-page page-enter">
        <section className="experiences-hero">
          <img src="https://cdn.kimkim.com/files/a/images/5b45731b3cd0909d725e57fa311ddb109d87fecb/original-287ed71f475c9270e007a20f899e5c11.jpg" alt="A blue train winding through Sri Lanka’s green tea country" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImages["Slow journeys"]; }} />
          <div className="experiences-hero-shade" />
          <div className="experiences-hero-copy">
            <p className="eyebrow light">SEE IT YOUR WAY · SRI LANKA</p>
            <h1>Find the moments<br /><em>that make the trip.</em></h1>
            <p>From a train window in the hills to a late walk along the fort walls, choose experiences that fit your kind of journey.</p>
            <a className="outline-light-button" href="#experience-list">Explore experiences <ArrowRight size={16} /></a>
          </div>
        </section>

        <section className="experiences-content section-wrap">
          <div className="section-heading-row reveal-on-scroll">
            <div><p className="section-overline">A FEW GOOD WAYS IN</p><h2>Island moments, <em>curated.</em></h2></div>
            <p className="section-aside">Choose a mood, find a place, then save a stop for your trip sketch.</p>
          </div>
          <div className="experience-controls reveal-on-scroll" id="experience-list">
            <label className="experience-search"><Search size={17} /><span className="sr-only">Search experiences</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by place or feeling" /></label>
            <div className="experience-filters">{categories.map((item) => <button key={item} className={category === item ? "experience-filter active" : "experience-filter"} onClick={() => setCategory(item)}>{item}</button>)}</div>
          </div>
          <div className="experience-grid">
            {filtered.map((item, index) => {
              const destination = places.find((place) => place.id === item.destinationId);
              const saved = planned.includes(item.destinationId);
              return <article className="experience-card reveal-on-scroll" key={item.id} style={{transitionDelay: `${(index % 3) * 80}ms`}}>
                <div className="experience-photo"><img src={item.image} alt={item.title} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackImages[item.category]; }} /><span>{item.category}</span></div>
                <div className="experience-card-copy"><div className="experience-location"><MapPin size={14} />{item.location}</div><h2>{item.title}</h2><p>{item.description}</p><div className="experience-card-bottom"><small><Compass size={14} />{item.duration}</small><button onClick={() => addToPlan(item.destinationId)} aria-pressed={saved}>{saved ? <><Check size={15} /> In your route</> : <><Bookmark size={15} /> Add to route</>}</button></div>{destination && <span className="sr-only">Suggested destination: {destination.name}</span>}</div>
              </article>;
            })}
          </div>
          {filtered.length === 0 && <div className="experiences-empty"><h2>No experiences match</h2><p>Try another search or category.</p><button onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</button></div>}
          {planned.length > 0 && <div className="experience-route-callout"><div><p className="section-overline">YOUR JOURNEY IS TAKING SHAPE</p><h2>{planned.length} {planned.length === 1 ? "stop" : "stops"} saved for your route</h2></div><button className="dark-cta" onClick={() => navigate("/?planner=1")}>Continue planning <ArrowRight size={16} /></button></div>}
        </section>
      </main>
    </div>
  );
}
