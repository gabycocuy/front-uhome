"use client";

import Alert from "@/components/Alert";
import { Button } from "@/components/ui/Button";
import type { FavoritesController } from "@/hooks/useFavorites";

import styles from "./FavoritesNotice.module.css";

export interface FavoritesNoticeProps {
  favorites: FavoritesController;
}

export function FavoritesNotice({ favorites }: FavoritesNoticeProps) {
  return (
    <>
      {favorites.status === "error" ? (
        <div className={styles.notice}>
          <Alert
            type="error"
            message={`We couldn't load your favorites: ${favorites.error ?? "unknown error"}.`}
          />
          <Button variant="outline" size="sm" onClick={favorites.reload}>
            Try again
          </Button>
        </div>
      ) : null}

      {favorites.actionError ? (
        <div className={styles.notice}>
          <Alert type="error" message={favorites.actionError} />
          <Button
            variant="outline"
            size="sm"
            onClick={favorites.dismissActionError}
          >
            Close
          </Button>
        </div>
      ) : null}
    </>
  );
}
