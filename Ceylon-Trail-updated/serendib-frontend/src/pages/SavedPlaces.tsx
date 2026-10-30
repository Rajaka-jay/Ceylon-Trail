import { useEffect, useState } from "react";
import { ArrowLeft, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";

import DestinationCard from "../components/DestinationCard";
import {
  getDestinations,
  type Destination,
} from "../api/destinations";

type SavedPlacesProps = {
  favoriteIds: number[];
  onToggleFavorite: (destinationId: number) => void;
};

export default function SavedPlaces({
  favoriteIds,
  onToggleFavorite,
}: SavedPlacesProps) {
  const [destinations, setDestinations] = useState<
    Destination[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDestinations() {
      try {
        setLoading(true);
        setError("");

        const data = await getDestinations();
        setDestinations(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Could not load saved destinations",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDestinations();
  }, []);

  const savedDestinations = destinations.filter(
    (destination) => favoriteIds.includes(destination.id),
  );

  if (loading) {
    return (
      <main className="saved-page">
        <div className="saved-page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to explore
          </Link>

          <p className="eyebrow">YOUR TRAVEL LIST</p>

          <h1>
            Saved <em>places.</em>
          </h1>

          <p className="saved-page-intro">
            Loading your saved destinations...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="saved-page">
        <div className="saved-page-header">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to explore
          </Link>

          <p className="eyebrow">YOUR TRAVEL LIST</p>

          <h1>
            Saved <em>places.</em>
          </h1>

          <p className="saved-page-intro">
            {error}
          </p>

          <Link to="/" className="primary-button">
            Back to explore
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="saved-page">
      <div className="saved-page-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to explore
        </Link>

        <p className="eyebrow">YOUR TRAVEL LIST</p>

        <h1>
          Saved <em>places.</em>
        </h1>

        <p className="saved-page-intro">
          Keep the places you want to remember for your next
          Sri Lankan adventure.
        </p>
      </div>

      {savedDestinations.length === 0 ? (
        <section className="saved-empty-state">
          <Bookmark size={38} strokeWidth={1.4} />

          <h2>No saved places yet</h2>

          <p>
            Tap the heart on any destination to save it here.
          </p>

          <Link to="/" className="primary-button">
            Explore destinations
          </Link>
        </section>
      ) : (
        <section className="saved-results">
          <div className="saved-results-heading">
            <p className="eyebrow">
              {savedDestinations.length}{" "}
              {savedDestinations.length === 1
                ? "PLACE"
                : "PLACES"}{" "}
              SAVED
            </p>
          </div>

          <div className="destination-grid">
            {savedDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
