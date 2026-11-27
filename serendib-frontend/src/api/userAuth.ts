import { API_CONFIGURED, API_URL } from "./config";

export type Traveler = { id: number; email: string; role: "traveler" };
export type UserSession = { token: string; user: Traveler };
const SESSION_KEY = "ceylon-trail-user-session";
export const USER_SESSION_EVENT = "ceylon-trail-user-session";

function parseSession(value: unknown): UserSession | null {
  if (!value || typeof value !== "object") return null;
  const session = value as Partial<UserSession>;
  if (typeof session.token !== "string" || !session.user || typeof session.user.id !== "number" || typeof session.user.email !== "string") return null;
  return { token: session.token, user: { id: session.user.id, email: session.user.email, role: "traveler" } };
}

export function getUserSession(): UserSession | null {
  try { return parseSession(JSON.parse(localStorage.getItem(SESSION_KEY) || "null")); }
  catch { return null; }
}

function saveSession(value: unknown): UserSession {
  const session = parseSession(value);
  if (!session) throw new Error("The sign-in response was incomplete. Please try again.");
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event(USER_SESSION_EVENT));
  return session;
}

async function readResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("The account service returned an unexpected response.");
  const result = await response.json() as { success?: boolean; token?: string; user?: Traveler; message?: string };
  if (!response.ok || !result.success) throw new Error(result.message || "Could not complete sign-in.");
  return saveSession(result);
}

function requireConfiguredApi() {
  if (!API_CONFIGURED) throw new Error("Sign-in is not connected on the published site yet. " + "Set the GitHub Actions variable VITE_API_URL to your deployed backend API URL ending in /api, then redeploy GitHub Pages.");
}

async function postAuth(path: string, email: string, password: string) {
  requireConfiguredApi();
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    throw new Error("Could not reach the account service. Check that the backend is online and try again.");
  }
  return readResponse(response);
}

export async function registerUser(email: string, password: string) {
  return postAuth("/auth/register", email, password);
}

export async function loginUser(email: string, password: string) {
  return postAuth("/auth/user/login", email, password);
}

export async function getCurrentUser(): Promise<Traveler> {
  requireConfiguredApi();
  const session = getUserSession();
  if (!session) throw new Error("Sign in to view this account.");
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
  } catch {
    throw new Error("Could not verify your account because the account service is offline.");
  }
  if (response.status === 401) logoutUser();
  if (!response.ok) throw new Error("Could not verify your account. Please sign in again.");
  const result = await response.json() as { success?: boolean; user?: Traveler };
  if (!result.success || !result.user || typeof result.user.id !== "number" || typeof result.user.email !== "string") {
    throw new Error("The account service returned an incomplete profile.");
  }
  return { id: result.user.id, email: result.user.email, role: "traveler" };
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(USER_SESSION_EVENT));
}
