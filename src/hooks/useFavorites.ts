"use client";

import { useCallback, useEffect, useState } from "react";

import type { Favorite } from "@/services/favorites";
import { getUser } from "@/services/session";
import {
  useFavoritesStore,
  type FavoritesStatus,
} from "@/store/favoritesStore";

const FAVORITE_ROLES = ["student", "admin"];

export type { FavoritesStatus };

export interface FavoritesController {
  favorites: Favorite[];
  status: FavoritesStatus;
  error: string | null;
  actionError: string | null;
  isFavorite: (propertyId: number) => boolean;
  isPending: (propertyId: number) => boolean;
  toggleFavorite: (propertyId: number) => Promise<void>;
  reload: () => void;
  dismissActionError: () => void;
}

export function useFavorites(): FavoritesController {
  const [user] = useState(getUser);
  const canFavorite =
    user !== null && (!user.role || FAVORITE_ROLES.includes(user.role));

  const favorites = useFavoritesStore((state) => state.favorites);
  const storeStatus = useFavoritesStore((state) => state.status);
  const error = useFavoritesStore((state) => state.error);
  const actionError = useFavoritesStore((state) => state.actionError);
  const pendingIds = useFavoritesStore((state) => state.pendingIds);
  const loadedUserId = useFavoritesStore((state) => state.loadedUserId);
  const load = useFavoritesStore((state) => state.load);
  const toggle = useFavoritesStore((state) => state.toggle);
  const dismissActionError = useFavoritesStore(
    (state) => state.dismissActionError,
  );

  useEffect(() => {
    if (user && canFavorite && loadedUserId !== user.id) {
      void load(user.id);
    }
  }, [user, canFavorite, loadedUserId, load]);

  const reload = useCallback(() => {
    if (user && canFavorite) {
      void load(user.id);
    }
  }, [user, canFavorite, load]);

  const isFavorite = useCallback(
    (propertyId: number) =>
      favorites.some((favorite) => favorite.propertyId === propertyId),
    [favorites],
  );

  const isPending = useCallback(
    (propertyId: number) => pendingIds.includes(propertyId),
    [pendingIds],
  );

  const toggleFavorite = useCallback(
    async (propertyId: number) => {
      if (!user || !canFavorite) {
        return;
      }

      await toggle(user.id, propertyId);
    },
    [user, canFavorite, toggle],
  );

  return {
    favorites,
    status: canFavorite ? storeStatus : "unavailable",
    error,
    actionError,
    isFavorite,
    isPending,
    toggleFavorite,
    reload,
    dismissActionError,
  };
}
