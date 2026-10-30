import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import type { Destination } from "../api/destinations";

type Props = {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (destinationId: number) => void;
};

const fallbackImage =
  "https://images.unsplash.com/photo-1586613835647-31d8a5e2c33e?auto=format&fit=crop&w=1200&q=85";

export default function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const categoryName =
    destination.category?.name ?? "Uncategorized";

  const imageSource =
    destination.imageUrl || fallbackImage;

  return (
    <article className="destination-card">
      <div className="card-image-wrap">
        <Link to={`/destinations/${destination.id}`}>
          <img
            src={imageSource}
            alt={destination.name}
            loading="lazy"
          />
        </Link>

        <button
          type="button"
          className={`save-button ${
            isFavorite ? "is-favorite" : ""
          }`}
          aria-label={
            isFavorite
              ? `Remove ${destination.name} from saved places`
              : `Save ${destination.name}`
          }
          aria-pressed={isFavorite}
          onClick={() =>
            onToggleFavorite(destination.id)
          }
        >
          <Heart
            size={17}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span>{categoryName}</span>

          <span className="dot">·</span>

          <span className="destination-location">
            <MapPin size={13} aria-hidden="true" />
            {destination.location}
          </span>
        </div>

        <h3>{destination.name}</h3>

        <p>{destination.shortDescription}</p>

        <Link
          className="text-link"
          to={`/destinations/${destination.id}`}
        >
          Explore place <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
