"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import type { UserRole } from "../../services/auth";
import { useSessionStore } from "../../store/sessionStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const hydrate = useSessionStore((state) => state.hydrate);
  const hydrated = useSessionStore((state) => state.hydrated);
  const token = useSessionStore((state) => state.token);
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    if (!token || !user) {
      router.replace("/login");
      return;
    }

    if (
      allowedRoles &&
      allowedRoles.length > 0 &&
      (!user.role || !allowedRoles.includes(user.role))
    ) {
      router.replace("/properties");
    }
  }, [hydrated, token, user, allowedRoles, router]);

  if (!hydrated || !token || !user) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--font-sans)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!user.role || !allowedRoles.includes(user.role))
  ) {
    return null;
  }

  return <>{children}</>;
}
