"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { PropertyForm } from "@/components/properties/PropertyForm";
import { createProperty } from "@/services/properties";

import styles from "./new-property.module.css";

export default function NewPropertyPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <ProtectedRoute allowedRoles={["landlord", "admin"]}>
      <AppShell
        eyebrow="Landlord"
        title="Add"
        accent="property"
        description="Create a new property listing for students."
        activeHref="/properties/new"
      >
        <div className={styles.container}>
          {error ? (
            <p
              className={styles.error}
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <PropertyForm
            submitLabel="Create property"
            loading={loading}
            onSubmit={async (data) => {
              setError("");
              setLoading(true);

              try {
                await createProperty(data);
                router.push("/my-properties");
              } catch (err) {
                setError(
                  err instanceof Error
                    ? err.message
                    : "We could not create the property.",
                );
              } finally {
                setLoading(false);
              }
            }}
          />
        </div>
      </AppShell>
    </ProtectedRoute>
  );
}