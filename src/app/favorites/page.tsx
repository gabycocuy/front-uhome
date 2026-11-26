import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { FavoritesView } from "@/components/properties/FavoritesView";

export const metadata: Metadata = {
  title: "Favorites | UHome",
};

export default function FavoritesPage() {
  return (
    <AppShell
      eyebrow="Your selection"
      title="My"
      accent="favorites."
      description="The properties you save are linked to your account so you can compare them whenever you want."
      activeHref="/favorites"
    >
      <FavoritesView />
    </AppShell>
  );
}
