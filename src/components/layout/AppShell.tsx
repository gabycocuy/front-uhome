"use client";

import { useEffect, type ReactNode } from "react";

import {
  adminNavLinks,
  landlordNavLinks,
  studentNavLinks,
} from "@/content/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { UserMenu } from "@/components/ui/UserMenu";
import { useSessionStore } from "@/store/sessionStore";

import styles from "./AppShell.module.css";

export interface AppShellProps {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  activeHref?: string;
  children: ReactNode;
}

export function AppShell({
  eyebrow,
  title,
  accent,
  description,
  activeHref,
  children,
}: AppShellProps) {
  const hydrate = useSessionStore((state) => state.hydrate);
  const user = useSessionStore((state) => state.user);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const links =
    user?.role === "landlord"
      ? landlordNavLinks
      : user?.role === "admin"
        ? adminNavLinks
        : studentNavLinks;

  return (
    <div className={styles.shell}>
      <Navbar
        links={links}
        account={<UserMenu />}
        activeHref={activeHref}
      />

      <main className={styles.main}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>

          <h1 className={styles.title}>
            {title}
            {accent ? (
              <>
                {" "}
                <span className={styles.accent}>{accent}</span>
              </>
            ) : null}
          </h1>

          {description ? (
            <p className={styles.description}>
              {description}
            </p>
          ) : null}
        </header>

        {children}
      </main>
    </div>
  );
}