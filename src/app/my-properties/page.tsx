"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppShell } from "@/components/layout/AppShell";
import { PropertyGrid } from "@/components/properties/PropertyGrid";
import {
  getMyProperties,
  type Property,
} from "@/services/properties";

import styles from "./my-properties.module.css";

function MyPropertiesContent() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProperties() {
      try {
        const data = await getMyProperties();

        if (active) {
          setProperties(data);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "We could not load your properties.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadProperties();

    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell
      eyebrow="Landlord"
      title="My"
      accent="properties"
      description="Manage the properties you have published on UHome."
      activeHref="/my-properties"
    >
      <div className={styles.actions}>
        <Link
          href="/properties/new"
          className={styles.addButton}
        >
          Add property
        </Link>
      </div>

      {loading ? (
        <p className={styles.message}>
          Loading your properties...
        </p>
      ) : null}

      {error ? (
        <p className={styles.error} role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error && properties.length === 0 ? (
        <div className={styles.empty}>
          <h2>No properties yet</h2>
          <p>
            Create your first property to start showing it to students.
          </p>
        </div>
      ) : null}

      {!loading && !error && properties.length > 0 ? (
        <PropertyGrid properties={properties} />
      ) : null}
    </AppShell>
  );
}

export default function MyPropertiesPage() {
  return (
    <ProtectedRoute allowedRoles={["landlord", "admin"]}>
      <MyPropertiesContent />
    </ProtectedRoute>
  );
}