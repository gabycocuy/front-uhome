import type { NavbarLink } from "../components/ui/Navbar";

export const studentNavLinks: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/properties" },
  { label: "Favorites", href: "/favorites" },
  { label: "Profile", href: "/profile" },
];

export const landlordNavLinks: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "My properties", href: "/my-properties" },
  { label: "Add property", href: "/properties/new" },
  { label: "Profile", href: "/profile" },
];

export const adminNavLinks: NavbarLink[] = [
  { label: "Home", href: "/" },
  { label: "Search", href: "/properties" },
  { label: "My properties", href: "/my-properties" },
  { label: "Profile", href: "/profile" },
];