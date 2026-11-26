import { API_URL } from "./config";

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
  if (!contentType.includes("application/json")) throw new Error("The account service is not available. Please try again later.");
  const result = await response.json() as { success?: boolean; token?: string; user?: Traveler; message?: string };
  if (!response.ok || !result.success) throw new Error(result.message || "Could not complete sign-in.");
  return saveSession(result);
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return readResponse(response);
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/user/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return readResponse(response);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(USER_SESSION_EVENT));
}
