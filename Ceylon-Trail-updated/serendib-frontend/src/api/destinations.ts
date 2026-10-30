import { adminHeaders } from "./admin";

export type DestinationSection = {
  id: number;
  heading: string;
  content: string;
  sortOrder: number;
};

export type Destination = {
  id: number;
  name: string;
  slug: string;
  location: string;
  shortDescription: string;
  imageUrl: string | null;
  seoDescription: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
  sections?: DestinationSection[];
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};

export type DestinationFormValues = {
  name: string;
  slug: string;
  location: string;
  shortDescription: string;
  imageUrl: string;
  seoDescription: string;
  categoryId: number;
};

type DestinationResponse = {
  success: boolean;
  data: Destination;
  message?: string;
};

type DestinationsResponse = {
  success: boolean;
  data: Destination[];
  message?: string;
};

type CategoriesResponse = {
  success: boolean;
  data: Category[];
  message?: string;
};

const API_URL = "/api";

async function getErrorMessage(
  response: Response,
): Promise<string> {
  try {
    const result = (await response.json()) as {
      message?: string;
      errors?: Record<string, string[] | undefined>;
    };
    if (result.errors) {
      const details = Object.entries(result.errors)
        .flatMap(([field, messages]) =>
          (messages ?? []).map((message) => `${field}: ${message}`),
        )
        .join("; ");
      if (details) return details;
    }
    return result.message ?? "Request failed";
  } catch {
    return "Request failed";
  }
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }
  const result = (await response.json()) as CategoriesResponse;
  return result.data;
}

export async function getDestinations(): Promise<
  Destination[]
> {
  const response = await fetch(
    `${API_URL}/destinations`,
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const result =
    (await response.json()) as DestinationsResponse;

  return result.data;
}

export async function getDestination(
  id: number,
): Promise<Destination> {
  const response = await fetch(
    `${API_URL}/destinations/${id}`,
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const result =
    (await response.json()) as DestinationResponse;

  return result.data;
}

export async function createDestination(
  form: DestinationFormValues,
): Promise<Destination> {
  const response = await fetch(
    `${API_URL}/destinations`,
    {
      method: "POST",
      headers: adminHeaders(),
      body: JSON.stringify(form),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const result =
    (await response.json()) as DestinationResponse;

  return result.data;
}

export async function updateDestination(
  id: number,
  form: DestinationFormValues,
): Promise<Destination> {
  const response = await fetch(
    `${API_URL}/destinations/${id}`,
    {
      method: "PUT",
      headers: adminHeaders(),
      body: JSON.stringify(form),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }

  const result =
    (await response.json()) as DestinationResponse;

  return result.data;
}

export async function deleteDestination(
  id: number,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/destinations/${id}`,
    {
      method: "DELETE",
      headers: adminHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(
      await getErrorMessage(response),
    );
  }
}
