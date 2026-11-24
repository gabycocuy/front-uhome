"use client";

import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { RatingStars } from "@/components/ui/RatingStars";
import { getPropertyReviews, type PropertyReview } from "@/services/properties";
import {
  createReview,
  deleteReview,
  updateReview,
  type ReviewInput,
} from "@/services/reviews";
import { toast } from "@/store/notificationStore";
import { useSessionStore } from "@/store/sessionStore";

import { ReviewForm } from "./ReviewForm";

import styles from "./PropertyReviews.module.css";

const REVIEW_ROLES = ["student", "admin"];

export interface PropertyReviewsProps {
  propertyId: number;
  initialReviews: PropertyReview[];
}

export function PropertyReviews({
  propertyId,
  initialReviews,
}: PropertyReviewsProps) {
  const user = useSessionStore((state) => state.user);
  const hydrate = useSessionStore((state) => state.hydrate);

  const [reviews, setReviews] = useState(initialReviews);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PropertyReview | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const refresh = useCallback(async () => {
    try {
      setReviews(await getPropertyReviews(propertyId));
    } catch {
      toast.error(
        "Couldn't refresh the reviews",
        "Reload the page to see the latest ones.",
      );
    }
  }, [propertyId]);

  const canReview =
    user !== null && (!user.role || REVIEW_ROLES.includes(user.role));

  const ownReview = user
    ? reviews.find(
        (review) =>
          review.user !== null && String(review.user.id) === String(user.id),
      )
    : undefined;

  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  function canManage(review: PropertyReview) {
    if (!user) return false;
    if (user.role === "admin") return true;

    return review.user !== null && String(review.user.id) === String(user.id);
  }

  async function handleCreate(values: ReviewInput) {
    await createReview(propertyId, values);
    await refresh();
    setFormKey((key) => key + 1);
    toast.success("Review published", "Thanks for sharing your experience.");
  }

  async function handleUpdate(values: ReviewInput) {
    if (editingId === null) return;

    await updateReview(editingId, values);
    setEditingId(null);
    await refresh();
    toast.success("Review updated");
  }

  async function handleDelete() {
    if (!deleteTarget) return;

    setDeleting(true);

    try {
      await deleteReview(deleteTarget.id);
      await refresh();
      toast.success("Review deleted");
    } catch (err) {
      toast.error(
        "Couldn't delete the review",
        err instanceof Error ? err.message : undefined,
      );
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reviews ({reviews.length})</h2>

        {reviews.length > 0 ? (
          <RatingStars value={average} count={reviews.length} />
        ) : null}
      </div>

      {canReview && !ownReview ? (
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Share your experience</h3>
          <ReviewForm
            key={formKey}
            submitLabel="Publish review"
            onSubmit={handleCreate}
          />
        </div>
      ) : null}

      {reviews.length === 0 ? (
        <p className={styles.empty}>No reviews yet for this property.</p>
      ) : (
        <ul className={styles.list}>
          {reviews.map((review) => (
            <li key={review.id} className={styles.item}>
              {editingId === review.id ? (
                <ReviewForm
                  initialRating={review.rating}
                  initialComment={review.comment}
                  submitLabel="Save changes"
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className={styles.itemHeader}>
                    <strong className={styles.author}>
                      {review.user?.fullName ??
                        review.user?.username ??
                        "Student"}
                    </strong>
                    <RatingStars
                      value={review.rating}
                      size="sm"
                      showValue={false}
                    />
                  </div>

                  <p className={styles.comment}>{review.comment}</p>

                  <div className={styles.itemFooter}>
                    <span className={styles.date}>
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      })}
                    </span>

                    {canManage(review) ? (
                      <div className={styles.actions}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(review.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteTarget(review)}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete this review?"
        description="This can't be undone."
        confirmLabel="Delete"
        cancelLabel="Keep it"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </section>
  );
}
