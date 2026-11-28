import { apiRequest, getErrorMessage } from "./api";

export interface PropertyAmenity {
  id: number;
  name: string;
}

export interface PropertyType {
  id: number;
  name: string;
}

export interface Property {
  id: number;
  name: string;
  description: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  price: number;
  propertyTypeId: number;
  propertyType: PropertyType | null;
  distanceToCampus: number;
  available: boolean;
  landlordId?: number | null;
  amenities: PropertyAmenity[];
  characteristics?: string[] | null;
  contractConditions?: string | null;
}

export type PropertySummary = Omit<Property, "propertyType" | "amenities"> &
  Partial<Pick<Property, "propertyType" | "amenities">>;

export interface PropertyReview {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  propertyId: number;
  user: {
    id: number;
    username: string;
    fullName: string;
  } | null;
}

export interface VibeAnalysis {
  id: number;
  studentDensity: number;
  nightlife: number;
  studySpots: number;
  quietness: number;
  essentialSpots: number;
  source: string;
  propertyId: number;
}

export interface PropertyQuery {
  maxPrice?: number;
  maxDistance?: number;
}

export interface PropertyRating {
  average: number;
  count: number;
}

export interface PropertyInput {
  name: string;
  description: string;
  address: string;
  latitude?: number;
  longitude?: number;
  price: number;
  propertyTypeId: number;
  distanceToCampus: number;
  available: boolean;
  characteristics?: string[];
  contractConditions?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await apiRequest(path, options);

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as T;
}

export function getProperties(
  query: PropertyQuery = {},
): Promise<Property[]> {
  const params = new URLSearchParams();

  if (query.maxPrice !== undefined) {
    params.set("maxPrice", String(query.maxPrice));
  }

  if (query.maxDistance !== undefined) {
    params.set("maxDistance", String(query.maxDistance));
  }

  const search = params.toString();

  return request<Property[]>(`/properties${search ? `?${search}` : ""}`);
}

export function getMyProperties(): Promise<Property[]> {
  return request<Property[]>("/properties/my");
}

export function getPropertyById(
  id: number | string,
): Promise<Property> {
  return request<Property>(`/properties/${id}`);
}

export function createProperty(
  data: PropertyInput,
): Promise<Property> {
  return request<Property>("/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function updateProperty(
  id: number | string,
  data: Partial<PropertyInput>,
): Promise<Property> {
  return request<Property>(`/properties/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function deleteProperty(
  id: number | string,
): Promise<{ message: string }> {
  return request<{ message: string }>(`/properties/${id}`, {
    method: "DELETE",
  });
}

export function getPropertyTypes(): Promise<PropertyType[]> {
  return request<PropertyType[]>("/property-types");
}

export function getPropertyReviews(
  propertyId: number | string,
): Promise<PropertyReview[]> {
  return request<PropertyReview[]>(
    `/reviews?propertyId=${encodeURIComponent(String(propertyId))}`,
  );
}

export async function getPropertyRatings(): Promise<
  Map<number, PropertyRating>
> {
  const reviews = await request<PropertyReview[]>("/reviews");
  const totals = new Map<number, { sum: number; count: number }>();

  for (const review of reviews) {
    const current = totals.get(review.propertyId) ?? {
      sum: 0,
      count: 0,
    };

    totals.set(review.propertyId, {
      sum: current.sum + review.rating,
      count: current.count + 1,
    });
  }

  const ratings = new Map<number, PropertyRating>();

  totals.forEach(({ sum, count }, propertyId) => {
    ratings.set(propertyId, {
      average: sum / count,
      count,
    });
  });

  return ratings;
}

export function getVibeAnalyses(): Promise<VibeAnalysis[]> {
  return request<VibeAnalysis[]>("/vibe-analysis");
}

export async function getPropertyVibe(
  propertyId: number | string,
): Promise<VibeAnalysis | null> {
  const analyses = await getVibeAnalyses();

  return (
    analyses.find(
      (analysis) => analysis.propertyId === Number(propertyId),
    ) ?? null
  );
}