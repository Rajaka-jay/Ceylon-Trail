import { Heart, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Destination } from "../data/destinations";

type Props = {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (destinationId: number) => void;
};

export default function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <article className="destination-card">
      <div className="card-image-wrap">
        <Link to={`/destinations/${destination.id}`}>
          <img src={destination.image} alt={destination.name} />
        </Link>

        <button
          className={`save-button ${isFavorite ? "is-favorite" : ""}`}
          aria-label={`Save ${destination.name}`}
          onClick={() => onToggleFavorite(destination.id)}
        >
          <Heart
            size={17}
            fill={isFavorite ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="card-content">
        <div className="card-meta">
          <span>{destination.category}</span>
          <span className="dot">·</span>
          <span>
            <MapPin size={13} />
            {destination.location}
          </span>
        </div>

        <h3>{destination.name}</h3>

        <p>{destination.description}</p>

        <Link
          className="text-link"
          to={`/destinations/${destination.id}`}
        >
          Explore place <span>↗</span>
        </Link>
      </div>
    </article>
  );
}
