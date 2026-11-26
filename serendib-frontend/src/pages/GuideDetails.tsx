import { ArrowLeft, Clock, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Header from "../components/Header";
import { guides } from "../data/guides";

export default function GuideDetails() {
  const { slug } = useParams<{ slug: string }>();
  const guide = guides.find((item) => item.slug === slug);

  if (!guide) return <div className="page-shell"><Header /><main className="guide-detail-missing"><p className="eyebrow">FIELD NOTES</p><h1>This note wandered off.</h1><p>Choose another practical guide for the island.</p><Link to="/guides" className="dark-cta"><ArrowLeft size={16} /> Back to field notes</Link></main></div>;

  return <div className="page-shell">
    <Header />
    <main className="guide-detail-page page-enter">
      <Link to="/guides" className="back-link guide-back"><ArrowLeft size={16} /> All field notes</Link>
      <section className="guide-detail-hero">
        <img src={guide.image} alt={guide.title} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1600&q=85"; }} />
        <div className="guide-detail-shade" />
        <div className="guide-detail-title"><p className="eyebrow light">{guide.category} · SRI LANKA</p><h1>{guide.title}</h1><p>{guide.excerpt}</p></div>
      </section>
      <article className="guide-article">
        <div className="guide-article-meta"><span><Clock size={15} /> {guide.readTime}</span><span><MapPin size={15} /> Notes from the island</span></div>
        <p className="guide-article-intro">{guide.excerpt}</p>
        {guide.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <div className="guide-article-end"><span>Take the long way.</span><Link to="/experiences">Find an experience</Link></div>
      </article>
      <section className="guide-more"><p className="eyebrow">KEEP WANDERING</p><h2>More from <em>the notebook.</em></h2><div className="guide-more-grid">
        {guides.filter((item) => item.id !== guide.id).map((item) => <Link className="guide-more-card" to={`/guides/${item.slug}`} key={item.id}><img src={item.image} alt={item.title} loading="lazy" /><span>{item.category} · {item.readTime}</span><h3>{item.title}</h3><b>Read the note</b></Link>)}
      </div></section>
    </main>
  </div>;
}
