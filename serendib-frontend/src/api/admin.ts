export function adminHeaders(): HeadersInit {
  const token = localStorage.getItem("adminToken");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? ""}`,
  };
}