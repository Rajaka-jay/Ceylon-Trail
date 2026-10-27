type LoginResponse = {
  success: boolean;
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
  message?: string;
};

export async function loginAdmin(
  email: string,
  password: string,
) {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result =
    (await response.json()) as LoginResponse;

  if (!response.ok) {
    throw new Error(
      result.message ?? "Login failed",
    );
  }

  localStorage.setItem("adminToken", result.token);
  localStorage.setItem(
    "adminUser",
    JSON.stringify(result.user),
  );

  return result;
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}