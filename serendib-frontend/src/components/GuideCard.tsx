import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Guide } from "../data/guides";

type GuideCardProps = {
  guide: Guide;
};

const guideFallbackImage =
  "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=1200&q=85";

export default function GuideCard({
  guide,
}: GuideCardProps ) {
  return (
    <article className="guide-card tilt-card">
      <Link to={`/guides/${guide.slug}`}>
        <div className="guide-card-image">
          <img src={guide.image || guideFallbackImage} alt={guide.title} loading="lazy" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = guideFallbackImage; }} />
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
