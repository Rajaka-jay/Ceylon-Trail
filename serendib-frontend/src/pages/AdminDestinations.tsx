import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import {
  createDestination,
  deleteDestination,
  getCategories,
  getDestinations,
  updateDestination,
  type Category,
  type Destination,
} from "../api/destinations";
import { logoutAdmin } from "../api/auth";

type FormValues = {
  name: string;
  slug: string;
  location: string;
  shortDescription: string;
  imageUrl: string;
  seoDescription: string;
  categoryId: number;
};

const emptyForm: FormValues = {
  name: "",
  slug: "",
  location: "",
  shortDescription: "",
  imageUrl: "",
  seoDescription: "",
  categoryId: 0,
};

export default function AdminDestinations() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<
    Destination[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  async function loadCategories() {
    try {
      setCategories(await getCategories());
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load categories",
      );
    }
  }

  useEffect(() => {
    void loadDestinations();
    void loadCategories();
  }, []);

  function updateField(
    field: keyof FormValues,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]:
        field === "categoryId" ? Number(value) : value,
    }));
  }

  function startEditing(destination: Destination) {
    setEditingId(destination.id);

    setForm({
      name: destination.name,
      slug: destination.slug,
      location: destination.location,
      shortDescription: destination.shortDescription,
      imageUrl: destination.imageUrl || "",
      seoDescription: destination.seoDescription || "",
      categoryId: destination.categoryId,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleLogout() {
    logoutAdmin();
    navigate("/admin/login");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (
      form.name.trim().length < 2 ||
      form.location.trim().length < 2 ||
      form.shortDescription.trim().length < 20 ||
      form.categoryId <= 0
    ) {
      setError(
        "Enter a name, choose a category, and provide a description of at least 20 characters.",
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId === null) {
        await createDestination(form);
        setMessage("Destination created successfully.");
      } else {
        await updateDestination(editingId, form);
        setMessage("Destination updated successfully.");
      }

      resetForm();
      await loadDestinations();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Could not save destination",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(destination: Destination) {
    const confirmed = window.confirm(
      `Delete "${destination.name}"? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await deleteDestination(destination.id);

      setMessage("Destination deleted successfully.");
      await loadDestinations();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete destination",
      );
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <p className="eyebrow">SERENDIB STUDIO</p>
        <h1>Manage destinations</h1>
        <p>
          Create, edit and remove destinations stored in
          PostgreSQL.
        </p>
        <button
          type="button"
          className="secondary-button"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      {error && (
        <div className="admin-message admin-message-error">
          {error}
        </div>
      )}

      {message && (
        <div className="admin-message admin-message-success">
          {message}
        </div>
      )}

      <section className="admin-form-section">
        <div>
          <p className="eyebrow">
            {editingId === null ? "NEW RECORD" : "EDIT RECORD"}
          </p>
          <h2>
            {editingId === null
              ? "Add a destination"
              : "Edit destination"}
          </h2>
        </div>

        <form
          className="destination-form"
          onSubmit={handleSubmit}
        >
          <label>
            Name
            <input
              value={form.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              placeholder="Sigiriya"
              required
            />
          </label>

          <label>
            Slug
            <input
              value={form.slug}
              onChange={(event) =>
                updateField("slug", event.target.value)
              }
              placeholder="sigiriya"
              pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
              required
            />
          </label>

          <label>
            Location
            <input
              value={form.location}
              onChange={(event) =>
                updateField("location", event.target.value)
              }
              placeholder="Cultural Triangle"
              required
            />
          </label>

          <label>
            Category
            <select
              value={form.categoryId || ""}
              onChange={(event) =>
                updateField("categoryId", event.target.value)
              }
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <small>No categories found. Run the database seed command.</small>
            )}
          </label>

          <label className="form-field-wide">
            Short description
            <textarea
              value={form.shortDescription}
              onChange={(event) =>
                updateField(
                  "shortDescription",
                  event.target.value,
                )
              }
              minLength={20}
              rows={4}
              required
            />
          </label>

          <label>
            Image URL
            <input
              type="url"
              value={form.imageUrl}
              onChange={(event) =>
                updateField(
                  "imageUrl",
                  event.target.value,
                )
              }
              placeholder="https://example.com/image.jpg"
            />
          </label>

          <label>
            SEO description
            <input
              value={form.seoDescription}
              onChange={(event) =>
                updateField(
                  "seoDescription",
                  event.target.value,
                )
              }
              maxLength={320}
            />
          </label>

          <div className="form-actions form-field-wide">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId === null
                  ? "Create destination"
                  : "Update destination"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel editing
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-list-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">DATABASE RECORDS</p>
            <h2>Destinations</h2>
          </div>

          <span>{destinations.length} records</span>
        </div>

        {loading ? (
          <p>Loading destinations...</p>
        ) : destinations.length === 0 ? (
          <p>No destinations have been added yet.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {destinations.map((destination) => (
                  <tr key={destination.id}>
                    <td>{destination.name}</td>
                    <td>{destination.location}</td>
                    <td>
                      {destination.category?.name ||
                        destination.categoryId}
                    </td>
                    <td className="table-actions">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(destination)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() =>
                          void handleDelete(destination)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
