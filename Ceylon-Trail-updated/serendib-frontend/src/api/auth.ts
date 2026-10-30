type LoginResponse = {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    email: string;
    role: string;
  };
  message?: string;
};

async function readLoginResponse(
  response: Response,
): Promise<LoginResponse | null> {
  const contentType =
    response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    return null;
  }

  try {
    return (await response.json()) as LoginResponse;
  } catch {
    return null;
  }
}

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

  const result = await readLoginResponse(response);

  if (!response.ok) {
    throw new Error(
      result?.message ?? "Login failed",
    );
  }

  if (!result?.success) {
    throw new Error(result?.message ?? "Login failed");
  }

  if (!result.token || typeof result.token !== "string") {
    throw new Error("Login failed: invalid token");
  }

  const user =
    result.user && typeof result.user === "object"
      ? result.user
      : null;

  if (!user) {
    throw new Error("Login failed: invalid user");
  }

  localStorage.setItem("adminToken", result.token);
  localStorage.setItem(
    "adminUser",
    JSON.stringify(user),
  );

  return {
    ...result,
    token: result.token,
    user,
  };
}

export function logoutAdmin() {
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

export function getAdminToken() {
  return localStorage.getItem("adminToken");
}