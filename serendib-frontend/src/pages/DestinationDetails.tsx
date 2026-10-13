import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { destinations } from "../data/destinations";
import { destinationDetails } from "../data/destinationDetails";

type DestinationDetailsProps = {
  favoriteIds: number[];
  onToggleFavorite: (destinationId: number) => void;
};

export default function DestinationDetails({
  favoriteIds,
  onToggleFavorite,
}: DestinationDetailsProps) {
  const { id } = useParams();

  const destination = destinations.find(
    (item) => item.id === Number(id),
  );

  if (!destination) {
    return (
      <main className="not-found-page">
        <h1>Destination not found</h1>

        <Link to="/" className="text-link">
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </main>
    );
  }

  const detail = destinationDetails.find(
    (item) => item.destinationId === destination.id,
  );

  const isFavorite = favoriteIds.includes(destination.id);

  if (!detail) {
    return (
      <main className="destination-details">
        <div className="details-topbar">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to destinations
          </Link>

          <button
            type="button"
            className={`details-save-button ${
              isFavorite ? "is-favorite" : ""
            }`}
            onClick={() =>
              onToggleFavorite(destination.id)
            }
          >
            <Heart
              size={18}
              fill={isFavorite ? "currentColor" : "none"}
            />

            {isFavorite ? "Saved" : "Save place"}
          </button>
        </div>

        <div className="details-hero">
          <img
            src={destination.image}
            alt={destination.name}
          />

          <div className="details-hero-overlay">
            <div>
              <p className="eyebrow light">
                {destination.category} · {destination.location}
              </p>

              <h1>{destination.name}</h1>
            </div>
          </div>
        </div>

        <section className="details-content">
          <div>
            <p className="eyebrow">ABOUT THIS PLACE</p>
            <h2>{destination.name}</h2>
          </div>

          <div className="details-copy">
            <p>{destination.description}</p>

            <div className="details-location">
              <MapPin size={17} />
              <span>
                {destination.location}, Sri Lanka
              </span>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="destination-details">
      <div className="details-topbar">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to destinations
        </Link>

        <button
          type="button"
          className={`details-save-button ${
            isFavorite ? "is-favorite" : ""
          }`}
          onClick={() =>
            onToggleFavorite(destination.id)
          }
        >
          <Heart
            size={18}
            fill={isFavorite ? "currentColor" : "none"}
          />

          {isFavorite ? "Saved" : "Save place"}
        </button>
      </div>

      <div className="details-hero">
        <img
          src={destination.image}
          alt={destination.name}
        />

        <div className="details-hero-overlay">
          <div>
            <p className="eyebrow light">
              {destination.category} · {destination.location}
            </p>

            <h1>{destination.name}</h1>
          </div>
        </div>
      </div>

      <section className="details-content">
        <div>
          <p className="eyebrow">ABOUT THIS PLACE</p>

          <h2>{detail.title}</h2>

          <p className="details-short-description">
            {detail.shortDescription}
          </p>
        </div>

        <div className="details-copy">
          {detail.sections.map((section) => (
            <section
              className="details-section"
              key={section.heading}
            >
              <h3>{section.heading}</h3>

              {section.paragraphs.map(
                (paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ),
              )}
            </section>
          ))}

          <div className="details-location">
            <MapPin size={17} />
            <span>
              {destination.location}, Sri Lanka
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
