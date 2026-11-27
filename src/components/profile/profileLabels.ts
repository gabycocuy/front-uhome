import type {
  PriorityLevel,
  VibePreference,
} from "@/services/studentProfile";

export const priorityLabels: Record<PriorityLevel, string> = {
  alta: "High",
  media: "Medium",
  baja: "Low",
};

export const vibeLabels: Record<VibePreference, string> = {
  tranquilo: "Quiet",
  equilibrado: "Balanced",
  social: "Social",
  estudioso: "Studious",
};

const roleLabels: Record<string, string> = {
  student: "Student",
  landlord: "Landlord",
  admin: "Administrator",
};

export function formatRole(role: string | null): string | null {
  if (!role) {
    return null;
  }

  return roleLabels[role] ?? capitalize(role);
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

const memberSinceFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export function formatMemberSince(isoDate: string): string | null {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return memberSinceFormatter.format(date);
}

export function formatStayMonths(months: number | null): string {
  if (months === null) {
    return "Not set";
  }

  return `${months} ${months === 1 ? "month" : "months"}`;
}

export function formatCount(
  count: number,
  singular: string,
  plural: string,
): string {
  return `${count} ${count === 1 ? singular : plural}`;
}