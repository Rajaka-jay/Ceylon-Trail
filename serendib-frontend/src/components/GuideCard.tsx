import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Guide } from "../data/guides";

type GuideCardProps = {
  guide: Guide;
};

function guideFallbackImage(category: string) {
  const normalized = category.toLowerCase();
  if (normalized.includes("field notes")) {
    return "https://cdn.kimkim.com/files/a/images/5b45731b3cd0909d725e57fa311ddb109d87fecb/original-287ed71f475c9270e007a20f899e5c11.jpg";
  }
  if (normalized.includes("coast")) {
    return "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=85";
  }
  if (normalized.includes("practical")) {
    return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";
  }
  return "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85";
}

export default function GuideCard({
  guide,
}: GuideCardProps ) {
  return (
    <article className="guide-card tilt-card">
      <Link to={`/guides/${guide.slug}`}>
        <div className="guide-card-image">
          <img src={guide.image || guideFallbackImage(guide.category)} alt={guide.title} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = guideFallbackImage(guide.category); }} />
        </div>
      </Link>

      <div className="guide-card-content">
        <div className="guide-card-meta">
          <span>{guide.category}</span>
          <span>·</span>
          <span>{guide.readTime}</span>
        </div>

        <h2>{guide.title}</h2>

        <p>{guide.excerpt}</p>

        <Link
          to={`/guides/${guide.slug}`}
          className="text-link"
        >
          Read guide
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
