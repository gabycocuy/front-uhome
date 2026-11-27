"use client";

import { useMemo } from "react";

import Spinner from "@/components/Spinner";
import { Button, ButtonLink } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { HeartIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { useFavorites } from "@/hooks/useFavorites";
import {
  getProperties,
  getPropertyRatings,
  type Property,
  type PropertyRating,
  type PropertySummary,
} from "@/services/properties";

import { FavoritesNotice } from "./FavoritesNotice";
import { PropertyGrid } from "./PropertyGrid";
import styles from "./FavoritesView.module.css";

interface FavoritesCatalog {
  properties: Map<number, Property> | null;
  ratings: Map<number, PropertyRating> | null;
}

async function loadCatalog(): Promise<FavoritesCatalog> {
  const [properties, ratings] = await Promise.allSettled([
    getProperties(),
    getPropertyRatings(),
  ]);

  return {
    properties:
      properties.status === "fulfilled"
        ? new Map(properties.value.map((property) => [property.id, property]))
        : null,
    ratings: ratings.status === "fulfilled" ? ratings.value : null,
  };
}

export function FavoritesView() {
  const favorites = useFavorites();
  const catalogQuery = useAsync(loadCatalog, "favorites-catalog");
  const catalog = catalogQuery.data ?? null;

  const savedProperties = useMemo(() => {
    const items: PropertySummary[] = [];
    const seen = new Set<number>();

    for (const favorite of favorites.favorites) {
      const property =
        catalog?.properties?.get(favorite.propertyId) ?? favorite.property;

      if (property && !seen.has(property.id)) {
        seen.add(property.id);
        items.push(property);
      }
    }

    return items;
  }, [favorites.favorites, catalog]);

  if (favorites.status === "unavailable") {
    return (
      <EmptyState
        icon={<HeartIcon size={26} />}
        title="Favorites aren't available for your account"
        description="Saving properties to favorites is available for student accounts."
        action={
          <ButtonLink href="/properties" variant="accent" size="sm">
            Explore properties
          </ButtonLink>
        }
      />
    );
  }

  if (favorites.status === "error") {
    return (
      <EmptyState
        tone="error"
        title="We couldn't load your favorites"
        description={favorites.error ?? undefined}
        action={
          <Button variant="accent" size="sm" onClick={favorites.reload}>
            Try again
          </Button>
        }
      />
    );
  }

  if (favorites.status === "loading" || catalogQuery.status === "loading") {
    return <Spinner message="Loading your favorites..." />;
  }

  if (savedProperties.length === 0) {
    return (
      <EmptyState
        icon={<HeartIcon size={26} />}
        title="You don't have favorites yet"
        description="Tap the heart on any property in the feed to save it here."
        action={
          <ButtonLink href="/properties" variant="accent" size="sm">
            Explore properties
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <div className={styles.notices}>
        <FavoritesNotice favorites={favorites} />
      </div>

      <p className={styles.count}>
        <strong>{savedProperties.length}</strong>{" "}
        {savedProperties.length === 1 ? "saved property" : "saved properties"}
      </p>

      <PropertyGrid
        properties={savedProperties}
        ratings={catalog?.ratings}
        favorites={favorites}
      />
    </>
  );
}
