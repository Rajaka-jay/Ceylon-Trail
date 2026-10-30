import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Guide } from "../data/guides";

type GuideCardProps = {
  guide: Guide;
};

export default function GuideCard({
  guide,
}: GuideCardProps ) {
  return (
    <article className="guide-card">
      <Link to={`/guides/${guide.slug}`}>
        <div className="guide-card-image">
          <img src={guide.image} alt={guide.title} />
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
