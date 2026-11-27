import { API_CONFIGURED, API_URL } from "./config";

type AdminUser = {
  id: number;
  email: string;
  role: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  user?: AdminUser;
  message?: string;
};

async function readLoginResponse(response: Response): Promise<LoginResponse | null> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  try { return (await response.json()) as LoginResponse; }
  catch { return null; }
}

function requireConfiguredApi() {
  if (!API_CONFIGURED) {
    throw new Error("Admin sign-in needs a deployed backend. Set the GitHub Actions variable VITE_API_URL to your backend API URL ending in /api, then redeploy GitHub Pages.");
  }
}

export async function loginAdmin(email: string, password: string) {
  requireConfiguredApi();
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Could not reach the admin service. Check that the backend is online and try again.");
  }
  const result = await readLoginResponse(response);
  if (!response.ok || !result?.success) throw new Error(result?.message ?? "Login failed");
  if (!result.token || typeof result.token !== "string") throw new Error("Login failed: invalid token");
  if (!result.user || typeof result.user !== "object" || result.user.role !== "admin") {
    throw new Error("Login failed: this account does not have administrator access.");
  }
  localStorage.setItem("adminToken", result.token);
  localStorage.setItem("adminUser", JSON.stringify(result.user));
  return { ...result, token: result.token, user: result.user };
}

export async function getAdminProfile(): Promise<AdminUser> {
  requireConfiguredApi();
  const token = getAdminToken();
  if (!token) throw new Error("Admin sign-in required.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/admin/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new Error("Could not reach the admin service. Check that the backend is online.");
  }
  if (response.status === 401) logoutAdmin();
  if (!response.ok) throw new Error(response.status === 403 ? "Administrator access is required." : "Your admin session expired. Sign in again.");
  const result = await readLoginResponse(response);
  if (!result?.success || !result.user || result.user.role !== "admin") throw new Error("The admin service returned an incomplete profile.");
  return result.user;
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}
