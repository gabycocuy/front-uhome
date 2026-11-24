import { ApiError, apiRequest, getErrorMessage } from "./api";
import type { PropertyReview } from "./properties";

export interface ReviewInput {
  rating: number;
  comment: string;
}

async function ensureOk(response: Response): Promise<void> {
  if (!response.ok) {
    throw new ApiError(await getErrorMessage(response), response.status);
  }
}

export async function createReview(
  propertyId: number,
  input: ReviewInput,
): Promise<PropertyReview> {
  const response = await apiRequest("/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...input, propertyId }),
  });

  await ensureOk(response);

  return (await response.json()) as PropertyReview;
}

export async function updateReview(
  reviewId: number,
  input: ReviewInput,
): Promise<PropertyReview> {
  const response = await apiRequest(`/reviews/${reviewId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  await ensureOk(response);

  return (await response.json()) as PropertyReview;
}

export async function deleteReview(reviewId: number): Promise<void> {
  const response = await apiRequest(`/reviews/${reviewId}`, {
    method: "DELETE",
  });

  await ensureOk(response);
}
