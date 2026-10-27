export type Destination = {
  id: number;
  name: string;
  slug: string;
  location: string;
  shortDescription: string;
  imageUrl: string | null;
  seoDescription: string | null;
  categoryId: number;

  category?: {
    id: number;
    name: string;
    slug: string;
  };

  sections?: {
    id: number;
    heading: string;
    content: string;
    sortOrder: number;
  }[];
};


type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
};

async function request<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const result = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !result.success) {
    throw new Error(
      result.message || "Something went wrong",
    );
  }

  return result.data;
}

export function getDestinations() {
  return request<Destination[]>("/api/destinations");
}

export function getDestination(id: number) {
  return request<Destination>(
    `/api/destinations/${id}`,
  );
}

export function createDestination(data: {
  name: string;
  slug: string;
  location: string;
  shortDescription: string;
  imageUrl: string;
  seoDescription: string;
  categoryId: number;
}) {
  return request<Destination>("/api/destinations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateDestination(
  id: number,
  data: {
    name: string;
    slug: string;
    location: string;
    shortDescription: string;
    imageUrl: string;
    seoDescription: string;
    categoryId: number;
  },
) {
  return request<Destination>(`/api/destinations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteDestination(
  id: number,
): Promise<void> {
  await request<null>(`/api/destinations/${id}`, {
    method: "DELETE",
  });
}

