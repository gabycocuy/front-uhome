import { Suspense } from "react";
import type { Metadata } from "next";

import Spinner from "@/components/Spinner";
import { AppShell } from "@/components/layout/AppShell";
import { PropertiesFeed } from "@/components/properties/PropertiesFeed";

export const metadata: Metadata = {
  title: "Properties | UHome",
};

export default function PropertiesPage() {
  return (
    <AppShell
      eyebrow="Find your next home"
      title="Housing near your"
      accent="campus."
      description="Search, filter and compare housing options. Save your favorites to review them later."
      activeHref="/properties"
    >
      {/* useSearchParams requiere un límite de Suspense en build. */}
      <Suspense fallback={<Spinner message="Loading properties..." />}>
        <PropertiesFeed />
      </Suspense>
    </AppShell>
  );
}
