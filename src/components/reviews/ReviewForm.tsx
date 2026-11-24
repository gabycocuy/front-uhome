"use client";

import { useId, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import type { ReviewInput } from "@/services/reviews";

import styles from "./ReviewForm.module.css";

const MIN_COMMENT = 10;
const MAX_COMMENT = 500;
const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

interface FormErrors {
  rating?: string;
  comment?: string;
}

export interface ReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  submitLabel: string;
  onSubmit: (values: ReviewInput) => Promise<void>;
  onCancel?: () => void;
}

function validate(rating: number, comment: string): FormErrors {
  const errors: FormErrors = {};
  const trimmed = comment.trim();

  if (rating < 1 || rating > 5) {
    errors.rating = "Select a rating from 1 to 5.";
  }

  if (trimmed.length < MIN_COMMENT) {
    errors.comment = `Write at least ${MIN_COMMENT} characters.`;
  } else if (trimmed.length > MAX_COMMENT) {
    errors.comment = `Keep your review under ${MAX_COMMENT} characters.`;
  }

  return errors;
}

export function ReviewForm({
  initialRating = 0,
  initialComment = "",
  submitLabel,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const uid = useId();
  const ratingLabelId = `${uid}-rating`;
  const commentId = `${uid}-comment`;

  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    const nextErrors = validate(rating, comment);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      await onSubmit({ rating, comment: comment.trim() });
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.field}>
        <span id={ratingLabelId} className={styles.label}>
          Overall rating
        </span>

        <div
          className={styles.ratingRow}
          role="radiogroup"
          aria-labelledby={ratingLabelId}
        >
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              className={`${styles.ratingButton} ${
                rating === value ? styles.ratingActive : ""
              }`}
              onClick={() => {
                setRating(value);
                setErrors((current) => ({ ...current, rating: undefined }));
              }}
            >
              {value}
            </button>
          ))}

          <span className={styles.ratingText}>
            {rating > 0
              ? `${rating} / 5 · ${RATING_LABELS[rating]}`
              : "Select a rating"}
          </span>
        </div>

        {errors.rating ? (
          <p className={styles.error} role="alert">
            {errors.rating}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label htmlFor={commentId} className={styles.label}>
          Your review
        </label>

        <textarea
          id={commentId}
          className={`${styles.textarea} ${
            errors.comment ? styles.textareaError : ""
          }`}
          rows={4}
          value={comment}
          placeholder="Tell other students what living here is like"
          aria-invalid={Boolean(errors.comment)}
          aria-describedby={errors.comment ? `${commentId}-error` : undefined}
          onChange={(event) => {
            setComment(event.target.value);
            setErrors((current) => ({ ...current, comment: undefined }));
          }}
        />

        <div className={styles.meta}>
          {errors.comment ? (
            <p id={`${commentId}-error`} className={styles.error} role="alert">
              {errors.comment}
            </p>
          ) : (
            <span />
          )}

          <span className={styles.counter}>
            {comment.trim().length}/{MAX_COMMENT}
          </span>
        </div>
      </div>

      {submitError ? (
        <p className={styles.submitError} role="alert">
          {submitError}
        </p>
      ) : null}

      <div className={styles.actions}>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}

        <Button type="submit" variant="accent" loading={submitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
