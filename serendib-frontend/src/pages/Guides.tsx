import { ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

import GuideCard from "../components/GuideCard";
import { guides } from "../data/guides";

export default function Guides() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(guides.map((guide) => guide.category)),
    ),
  ];

  const filteredGuides = useMemo(() => {
    const searchText = searchTerm.toLowerCase();

    return guides.filter((guide) => {
      const matchesSearch =
        guide.title.toLowerCase().includes(searchText) ||
        guide.excerpt.toLowerCase().includes(searchText) ||
        guide.category.toLowerCase().includes(searchText);

      const matchesCategory =
        selectedCategory === "All" ||
        guide.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <main className="guides-page">
      <div className="guides-page-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          Back to explore
        </Link>

        <p className="eyebrow">THE NOTEBOOK</p>

        <h1>
          Ideas for
            

          <em>the long way.</em>
        </h1>

        <p className="guides-intro">
          Field notes, practical help and small stories from
          around Sri Lanka.
        </p>
      </div>

      <div className="guides-controls">
        <div className="guides-search">
          <Search size={17} />

          <input
            type="search"
            placeholder="Search guides..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />
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
      </div>

      {filteredGuides.length > 0 ? (
        <section className="guides-grid">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </section>
      ) : (
        <section className="guides-empty">
          <h2>No guides found</h2>
          <p>Try another search or category.</p>
        </section>
      )}
    </main>
  );
}

