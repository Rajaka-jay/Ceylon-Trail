import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../api/auth";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginAdmin(email, password);
      navigate("/admin/destinations");
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : "Login failed",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Admin Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </div>

        <div>
          <label htmlFor="password">
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </div>

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}