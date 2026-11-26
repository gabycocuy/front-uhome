"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import Spinner from "@/components/Spinner";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, type BadgeTone } from "@/components/ui/Badge";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { HomeIcon } from "@/components/ui/icons";
import { useAsync } from "@/hooks/useAsync";
import { getUser } from "@/services/session";
import {
  getMyProfile,
  getUserAccount,
  type StudentProfile,
} from "@/services/studentProfile";
import { cx } from "@/utils/classNames";
import { formatDistance, formatPrice } from "@/utils/format";

import { PreferencesForm } from "./PreferencesForm";
import {
  capitalize,
  formatCount,
  formatMemberSince,
  formatRole,
  formatStayMonths,
  priorityLabels,
  vibeLabels,
} from "./profileLabels";
import styles from "./ProfileView.module.css";

interface ProfilePageData {
  profile: StudentProfile | null;
  fullName: string;
  role: string | null;
  memberSince: string | null;
}

type ChipColor = "university" | "preferences" | "name" | "member";

interface PreferenceItem {
  label: string;
  value: string;
  tone?: BadgeTone;
  chip?: ChipColor;
}

async function loadProfilePage(): Promise<ProfilePageData> {
  const user = getUser();

  const [profile, account] = await Promise.all([
    getMyProfile(),
    user ? getUserAccount(user.id).catch(() => null) : Promise.resolve(null),
  ]);

  return {
    profile,
    fullName: account?.fullName ?? user?.fullName ?? "User",
    role: account?.role?.name ?? user?.role ?? null,
    memberSince: account ? formatMemberSince(account.createdAt) : null,
  };
}

function buildPreferenceItems(profile: StudentProfile): PreferenceItem[] {
  return [
    { label: "Universidad", value: profile.university, chip: "university" },
    {
      label: "Maximum budget",
      value: `${formatPrice(profile.maxBudget)} al mes`,
      tone: "price",
    },
    {
      label: "Maximum distance to campus",
      value: formatDistance(profile.maxDistanceToCampus),
      tone: "distance",
    },
    {
      label: "Prioridad de seguridad",
      value: priorityLabels[profile.safetyPriority],
      chip: "preferences",
    },
    {
      label: "Prioridad de vida nocturna",
      value: priorityLabels[profile.nightlifePriority],
      chip: "preferences",
    },
    {
      label: "Amenities priority",
      value: priorityLabels[profile.amenitiesPriority],
      chip: "preferences",
    },
    {
      label: "Vibra del barrio",
      value: vibeLabels[profile.vibePreference],
      tone: "lifestyle",
    },
    {
      label: "Estancia deseada",
      value: formatStayMonths(profile.desiredStayMonths),
      chip: "preferences",
    },
    profile.preferredPropertyType
      ? {
          label: "Housing type",
          value: capitalize(profile.preferredPropertyType.name),
          tone: "type",
        }
      : {
          label: "Housing type",
          value: "No preference",
          chip: "preferences",
        },
    {
      label: "Minimum bedrooms",
      value: formatCount(profile.minBedrooms, "bedroom", "bedrooms"),
      chip: "preferences",
    },
    {
      label: "Minimum bathrooms",
      value: formatCount(profile.minBathrooms, "bathroom", "bathrooms"),
      chip: "preferences",
    },
    {
      label: "Mascotas",
      value: profile.petFriendly ? "Needs pet-friendly" : "Not needed",
      chip: "preferences",
    },
  ];
}

function Chip({ item }: { item: PreferenceItem }) {
  return (
    <Badge
      tone={item.tone ?? "neutral"}
      className={item.chip ? cx(styles.chip, styles[item.chip]) : undefined}
    >
      {item.value}
    </Badge>
  );
}

interface AccountHeaderProps {
  fullName: string;
  role: string | null;
  memberSince: string | null;
}

function AccountHeader({ fullName, role, memberSince }: AccountHeaderProps) {
  const roleLabel = formatRole(role);

  return (
    <Card as="section" className={styles.account} aria-label="Your account">
      <Avatar name={fullName} size="lg" />
      <div className={styles.accountInfo}>
        <h2 className={styles.accountName}>{fullName}</h2>
        <div className={styles.chips}>
          {roleLabel ? (
            <Badge className={cx(styles.chip, styles.name)}>{roleLabel}</Badge>
          ) : null}
          {memberSince ? (
            <Badge className={cx(styles.chip, styles.member)}>
              Miembro desde {memberSince}
            </Badge>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

function PreferencesSummary({ profile }: { profile: StudentProfile }) {
  return (
    <Card as="section" aria-labelledby="preferences-title">
      <CardHeader>
        <h2 id="preferences-title" className={styles.sectionTitle}>
          Your preferences
        </h2>
      </CardHeader>
      <CardBody>
        <dl className={styles.preferenceList}>
          {buildPreferenceItems(profile).map((item) => (
            <div key={item.label} className={styles.preference}>
              <dt className={styles.preferenceLabel}>{item.label}</dt>
              <dd className={styles.preferenceValue}>
                <Chip item={item} />
              </dd>
            </div>
          ))}
        </dl>
      </CardBody>
    </Card>
  );
}

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Card as="section" aria-labelledby="form-title">
      <CardHeader>
        <h2 id="form-title" className={styles.sectionTitle}>
          {title}
        </h2>
      </CardHeader>
      <CardBody>{children}</CardBody>
    </Card>
  );
}

export function ProfileView() {
  const query = useAsync(loadProfilePage, "profile");
  const [savedProfile, setSavedProfile] = useState<StudentProfile | null>(
    null,
  );

  if (query.status === "loading") {
    return <Spinner message="Loading your profile..." />;
  }

  if (query.status === "error" || !query.data) {
    return (
      <EmptyState
        tone="error"
        title="We couldn't load your profile"
        description={query.error ?? undefined}
        action={
          <Button variant="accent" size="sm" onClick={query.retry}>
            Try again
          </Button>
        }
      />
    );
  }

  const { fullName, role, memberSince } = query.data;
  const profile = savedProfile ?? query.data.profile;

  if (!profile && role !== "student") {
    return (
      <div className={styles.layout}>
        <AccountHeader
          fullName={fullName}
          role={role}
          memberSince={memberSince}
        />
        <EmptyState
          icon={<HomeIcon size={26} />}
          title="Your account does not have a student profile"
          description="The housing preferences profile is only available for student accounts. With your account you can keep exploring the published properties."
          action={
            <ButtonLink href="/properties" variant="accent" size="sm">
              Explore properties
            </ButtonLink>
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <AccountHeader fullName={fullName} role={role} memberSince={memberSince} />

      {profile ? (
        <PreferencesSummary profile={profile} />
      ) : (
        <EmptyState
          icon={<HomeIcon size={26} />}
          title="You do not have a profile yet"
          description="Tell us what you are looking for in a place. Fill in the form below to create your preferences profile."
        />
      )}

      <FormSection title={profile ? "Edit preferences" : "Create your profile"}>
        <PreferencesForm profile={profile} onSaved={setSavedProfile} />
      </FormSection>
    </div>
  );
}
