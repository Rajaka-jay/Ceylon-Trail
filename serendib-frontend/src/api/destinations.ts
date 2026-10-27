export type Destination = {
  id: number;
  name: string;
  slug: string;
  location: string;
  shortDescription: string;
  imageUrl: string | null;
  categoryId: number;
  category: {
    id: number;
    name: string;
    slug: string;
  };
};

type DestinationResponse = {
  success: boolean;
  data: Destination[];
};

const API_URL = "http://localhost:5000/api";

export async function getDestinations(): Promise<Destination[]> {
  const response = await fetch(`${API_URL}/destinations`);

  if (!response.ok) {
    throw new Error("Failed to load destinations");
  }

  const result = (await response.json()) as DestinationResponse;

  return result.data;
}
