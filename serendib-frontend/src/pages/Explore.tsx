import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import Header from "../components/Header";
import DestinationCard from "../components/DestinationCard";
import { getDestinations, type Destination } from "../api/destinations";

export default function Explore() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("serendib-favorites") ?? "[]") as number[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    getDestinations()
      .then(setDestinations)
      .catch((loadError: unknown) => {
        setError(loadError instanceof Error ? loadError.message : "Could not load destinations");
      })
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => [
    "All",
    ...Array.from(new Set(destinations.map((item) => item.category?.name ?? "Uncategorized"))),
  ], [destinations]);

  const visibleDestinations = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    return destinations
      .filter((item) => {
        const itemCategory = item.category?.name ?? "Uncategorized";
        const matchesQuery = !query || [item.name, item.location, item.shortDescription, itemCategory]
          .some((value) => value.toLowerCase().includes(query));
        return matchesQuery && (category === "All" || itemCategory === category);
      })
      .sort((a, b) => {
        if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
        if (sortOrder === "location-asc") return a.location.localeCompare(b.location);
        if (sortOrder === "newest") return b.id - a.id;
        return a.name.localeCompare(b.name);
      });
  }, [category, destinations, searchTerm, sortOrder]);

  function toggleFavorite(id: number) {
    setFavoriteIds((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem("serendib-favorites", JSON.stringify(next));
      return next;
    });
  }

  return (
    <div className="page-shell">
      <Header />
      <main className="explore-page">
        <section className="page-intro">
          <p className="eyebrow">THE SERENDIB INDEX</p>
          <h1>Find a good place<br /><em>to begin.</em></h1>
          <p>Search the island by mood, landscape or the next place you want to remember.</p>
        </section>

        <section className="explore-controls" aria-label="Destination controls">
          <label className="explore-search">
            <Search size={18} />
            <span className="sr-only">Search destinations</span>
            <input
              type="search"
              placeholder="Search destinations, locations..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </label>
          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? "category-button active" : "category-button"}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="sort-control">
            Sort by
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="location-asc">Location A–Z</option>
              <option value="newest">Newest first</option>
            </select>
          </label>
        </section>

        {loading && <p className="state-message">Loading destinations...</p>}
        {error && <p className="state-message error-text">{error}</p>}
        {!loading && !error && (
          <section className="destination-grid explore-grid">
            {visibleDestinations.length > 0 ? visibleDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                isFavorite={favoriteIds.includes(destination.id)}
                onToggleFavorite={toggleFavorite}
              />
            )) : <p className="empty-message">No destinations match your search.</p>}
          </section>
        )}
      </main>
    </div>
  );
}
