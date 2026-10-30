import { useEffect, useState } from "react";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getDestination,
  type Destination,
} from "../api/destinations";


type DestinationDetailsProps = {
  favoriteIds: number[];
  onToggleFavorite: (destinationId: number) => void;
};

export default function DestinationDetails({
  favoriteIds,
  onToggleFavorite,
}: DestinationDetailsProps) {
  const { id } = useParams<{ id: string }>();

  const [destination, setDestination] =
    useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDestination() {
      const destinationId = Number(id);

      if (!Number.isInteger(destinationId)) {
        setError("Invalid destination ID");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getDestination(destinationId);
        setDestination(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load destination",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDestination();
  }, [id]);

  if (loading) {
    return (
      <main className="destination-details">
        <p>Loading destination...</p>
      </main>
    );
  }

  if (error || !destination) {
    return (
      <main className="not-found-page">
        <h1>Destination not found</h1>

        <p>{error || "This destination does not exist."}</p>

        <Link to="/" className="text-link">
          <ArrowLeft size={16} />
          Back to destinations
        </Link>
      </main>
    );
  }

  const isFavorite = favoriteIds.includes(
    destination.id,
  );

  const categoryName =
    destination.category?.name ?? "Uncategorized";

  const imageSource =
    destination.imageUrl ||
    "https://images.unsplash.com/photo-1586613835647-31d8a5e2c33e?auto=format&fit=crop&w=1400&q=85";

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
          src={imageSource}
          alt={destination.name}
        />

        <div className="details-hero-overlay">
          <div>
            <p className="eyebrow light">
              {categoryName} · {destination.location}
            </p>

            <h1>{destination.name}</h1>
          </div>
        </div>
      </div>

      <section className="details-content">
        <div>
          <p className="eyebrow">ABOUT THIS PLACE</p>

          <h2>{destination.name}</h2>

          <p className="details-short-description">
            {destination.shortDescription}
          </p>
        </div>

        <div className="details-copy">
          {destination.sections &&
            destination.sections.length > 0 &&
            destination.sections.map((section) => (
              <section
                className="details-section"
                key={section.id}
              >
                <h3>{section.heading}</h3>
                <p>{section.content}</p>
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
