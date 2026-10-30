import { ArrowRight, Compass, Leaf, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";

export default function About() {
  return (
    <div className="page-shell">
      <Header />
      <main className="about-page">
        <section className="about-hero">
          <p className="eyebrow">ABOUT SERENDIB</p>
          <h1>A slower way<br /><em>to see the island.</em></h1>
          <p className="about-lead">
            Serendib is an independent guide to Sri Lanka for curious travellers who prefer the long way around.
          </p>
        </section>

        <section className="about-story">
          <div>
            <p className="eyebrow">OUR POINT OF VIEW</p>
            <h2>Small roads.<br /><em>Deep days.</em></h2>
          </div>
          <div className="about-copy">
            <p>We collect the places that make you want to stay a little longer: misty train rides, quiet beaches, ancient paths and meals shared at the end of a long day.</p>
            <p>Every destination is selected to help you travel with more curiosity and less hurry. Use the journal to plan your route, save the places that speak to you and make the island your own.</p>
          </div>
        </section>

        <section className="about-values">
          <article>
            <span className="value-icon"><Compass size={22} /></span>
            <p className="eyebrow">01 / CURIOUS</p>
            <h3>Follow the feeling</h3>
            <p>There is more to Sri Lanka than a checklist. Leave room for the unexpected turn.</p>
          </article>
          <article>
            <span className="value-icon"><Leaf size={22} /></span>
            <p className="eyebrow">02 / CONSIDERED</p>
            <h3>Travel lightly</h3>
            <p>Choose slower journeys and support the people, landscapes and communities that make each place special.</p>
          </article>
          <article>
            <span className="value-icon"><MapPin size={22} /></span>
            <p className="eyebrow">03 / LOCAL</p>
            <h3>Stay a while</h3>
            <p>The best memories are often found beyond the main road, one conversation at a time.</p>
          </article>
        </section>

        <section className="about-cta">
          <p className="eyebrow light">READY WHEN YOU ARE</p>
          <h2>Start with<br /><em>one good place.</em></h2>
          <Link className="outline-light-button" to="/explore">
            Explore destinations <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}
