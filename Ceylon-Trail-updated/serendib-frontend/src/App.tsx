import { useEffect, useState } from "react";
import { Search, ArrowRight } from "lucide-react";
import { Navigate, Route, Routes } from "react-router-dom";

import Header from "./components/Header";
import DestinationCard from "./components/DestinationCard";
import DestinationDetails from "./pages/DestinationDetails";
import SavedPlaces from "./pages/SavedPlaces";
import Guides from "./pages/Guides";
import GuideDetails from "./pages/GuideDetails";
import AdminDestinations from "./pages/AdminDestinations";
import AdminLogin from "./pages/AdminLogin";
import Explore from "./pages/Explore";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";

import {
  getDestinations,
  type Destination,
} from "./api/destinations";

type HomePageProps = {
  favoriteIds: number[];
  onToggleFavorite: (destinationId: number) => void;
};

function HomePage({
  favoriteIds,
  onToggleFavorite,
}: HomePageProps) {
	 const [searchTerm, setSearchTerm] = useState("");
	  const [selectedCategory, setSelectedCategory] = useState("All");
	  const [sortOrder, setSortOrder] = useState("name-asc");
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
            : "Could not load destinations",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadDestinations();
  }, []);

  const categories = [
    "All",
    ...Array.from(
      new Set(
        destinations.map(
          (destination) =>
            destination.category?.name ?? "Uncategorized",
        ),
      ),
    ),
  ];


  const filteredDestinations = destinations.filter(
  (destination) => {
    const searchText = searchTerm.toLowerCase();

    const categoryName =
      destination.category?.name ?? "Uncategorized";

    const matchesSearch =
      destination.name.toLowerCase().includes(searchText) ||
      destination.location.toLowerCase().includes(searchText) ||
      categoryName.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "All" ||
      categoryName === selectedCategory;

    return matchesSearch && matchesCategory;
  },
);
  const sortedDestinations = [...filteredDestinations].sort((a, b) => {
    if (sortOrder === "name-desc") return b.name.localeCompare(a.name);
    if (sortOrder === "location-asc") return a.location.localeCompare(b.location);
    if (sortOrder === "newest") return b.id - a.id;
    return a.name.localeCompare(b.name);
  });
if (loading) {
  return (
    <main className="not-found-page">
      <p>Loading destinations...</p>
    </main>
  );
}

if (error) {
  return (
    <main className="not-found-page">
      <h1>Unable to load destinations</h1>
      <p>{error}</p>
    </main>
  );
}

  return (
    <div className="app" id="top">
      <Header />

      <main>
        <section className="hero">
          <div className="hero-overlay" />

          <div className="hero-content">
            <p className="eyebrow light">
              A SLOWER WAY TO SEE THE ISLAND
            </p>

            <h1>
              Go where the
                

              <em>green</em> things are.
            </h1>

            <p className="hero-description">
              Thoughtful guides to Sri Lanka&apos;s wild coastlines,
              misty hills and ancient roads.
            </p>

            <form
              className="hero-search"
              onSubmit={(event) => event.preventDefault()}
            >
              <Search size={19} />

              <input
                type="search"
                placeholder="Search destinations, things to do..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              <button type="submit">
                Explore
                <ArrowRight size={16} />
              </button>
            </form>

            <div className="hero-facts">
              <span>
                <i />
                10 places worth the detour
              </span>

              <span>Updated for 2025</span>
            </div>
          </div>

          <span className="hero-location">
            01 / 04&nbsp;&nbsp;·&nbsp;&nbsp;Central Highlands
          </span>
        </section>

        <section className="intro-section" id="about">
          <div>
            <p className="eyebrow">THE SERENDIB EDIT</p>

            <h2>
              One island,
                

              <em>many ways in.</em>
            </h2>
          </div>

          <p className="intro-copy">
            From the first train ride into the hills to the last
            swim at sunset, Sri Lanka rewards the curious. Start with
            the places we keep coming back to.
          </p>
        </section>

        <section className="explore-section" id="explore">
          <div className="section-heading">
            <div>
              <p className="eyebrow">PLACES TO BEGIN</p>

              <h2>
                Find your next <em>good place.</em>
              </h2>
            </div>

            <a
              className="text-link"
              href="#all-destinations"
            >
              See all places <ArrowRight size={16} />
            </a>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={
                  selectedCategory === category
                    ? "category-button active"
                    : "category-button"
                }
                onClick={() =>
                  setSelectedCategory(category)
                }
              >
                {category}
              </button>
            ))}
          </div>

          <div className="listing-tools">
            <label htmlFor="destination-sort">Sort by</label>
            <select
              id="destination-sort"
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.value)}
            >
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
              <option value="location-asc">Location A–Z</option>
              <option value="newest">Newest first</option>
            </select>
          </div>

          <div className="destination-grid">
            {sortedDestinations.length > 0 ? (
              sortedDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  isFavorite={favoriteIds.includes(
                    destination.id,
                  )}
                  onToggleFavorite={onToggleFavorite}
                />
              ))
            ) : (
              <p className="empty-message">
                No destinations found. Try another search.
              </p>
            )}
          </div>
        </section>

        <section className="guide-banner" id="guides">
          <div>
            <p className="eyebrow light">THE NOTEBOOK</p>

            <h2>
              Ideas for
                

              <em>the long way.</em>
            </h2>
          </div>

          <p>
            Field notes, practical help and small stories from
            around Sri Lanka.
          </p>

          <button
            type="button"
            className="outline-light-button"
          >
            Read the guides <ArrowRight size={16} />
          </button>
        </section>
      </main>

      <footer className="site-footer">
        <span>© 2025 Serendib Journal</span>
        <span>Made for slow travellers</span>
      </footer>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("serendib-theme");
    document.documentElement.dataset.theme = savedTheme === "dark" ? "dark" : "light";
  }, []);

  const [favoriteIds, setFavoriteIds] = useState<number[]>(
    () => {
      const savedFavorites = localStorage.getItem(
        "serendib-favorites",
      );

      if (!savedFavorites) {
        return [];
      }

      try {
        return JSON.parse(savedFavorites) as number[];
      } catch {
        return [];
      }
    },
  );

  const toggleFavorite = (destinationId: number) => {
    setFavoriteIds((currentFavorites) => {
      const isAlreadyFavorite =
        currentFavorites.includes(destinationId);

      const updatedFavorites = isAlreadyFavorite
        ? currentFavorites.filter(
            (id) => id !== destinationId,
          )
        : [...currentFavorites, destinationId];

      localStorage.setItem(
        "serendib-favorites",
        JSON.stringify(updatedFavorites),
      );

      return updatedFavorites;
    });
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        }
      />
      <Route
        path="/saved"
        element={
          <SavedPlaces
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        }
      />
      <Route path="/explore" element={<Explore />} />
      <Route path="/about" element={<About />} />
      <Route
        path="/guides"
        element={<Guides />}
      />

      <Route
        path="/guides/:slug"
        element={<GuideDetails />}
      />

      <Route
        path="/destinations/:id"
        element={
          <DestinationDetails
            favoriteIds={favoriteIds}
            onToggleFavorite={toggleFavorite}
          />
        }
      />
<Route
  path="/admin/login"
  element={<AdminLogin />}
/>

<Route
  path="/admin/destinations"
  element={
    <ProtectedRoute>
      <AdminDestinations />
    </ProtectedRoute>
  }
/>

    <Route
      path="/admin"
      element={
        <Navigate
          to="/admin/destinations"
          replace
        />
      }
    />


    </Routes>
  );
}
