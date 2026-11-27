import type { Metadata } from "next";

import { AppShell } from "@/components/layout/AppShell";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = {
  title: "Profile | UHome",
};

export default function ProfilePage() {
  return (
    <AppShell
      eyebrow="Your account"
      title="My"
      accent="profile."
      description="Review and adjust your preferences so UHome shows you the places that fit you best."
      activeHref="/profile"
    >
      <ProfileView />
    </AppShell>
  );
}
