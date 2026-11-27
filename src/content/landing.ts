import type { FooterColumn, FooterContact } from "../components/ui/Footer";
import type { NavbarLink } from "../components/ui/Navbar";

export type Tone =
  | "green"
  | "blue"
  | "orange"
  | "lilac"
  | "periwinkle"
  | "tan"
  | "crimson"
  | "blueStrong"
  | "peach"
  | "pink"
  | "purple"
  | "sky";

export const navLinks: NavbarLink[] = [
  { label: "Funciones", href: "#funciones" },
  { label: "How it works", href: "#como-funciona" },
  { label: "Opiniones", href: "#opiniones" },
];

export const hero = {
  title: "Find student housing with",
  accent: "confidence.",
  text: "Compare price, distance, safety and real student reviews, all in one place.",
  primaryCta: "Start searching",
  secondaryCta: "How it works",
};

export const heroCards: Array<{
  tone: Tone;
  label: string;
  value: string;
  unit: string;
  note: string;
}> = [
  {
    tone: "green",
    label: "Price",
    value: "$450.000",
    unit: "/ mes",
    note: "Seguridad: 8,7",
  },
  {
    tone: "blue",
    label: "Distance",
    value: "12 min",
    unit: "caminando",
    note: "900 m del campus",
  },
  {
    tone: "orange",
    label: "Rating",
    value: "4,5",
    unit: "de 5",
    note: "Based on 32 students",
  },
];

export const problem = {
  title: "El problema",
  items: [
    { tone: "blue" as Tone, text: "Is it safe?" },
    { tone: "green" as Tone, text: "Is it well located?" },
    { tone: "orange" as Tone, text: "Is it worth the price?" },
  ],
  note: "Traditional platforms only show ads.",
  strong: "UHome te ayuda a decidir.",
};

export const features = {
  title: "Funciones principales",
  items: [
    {
      tone: "green" as Tone,
      title: "Smart search",
      text: "Dynamic filters by price, distance to campus and housing type.",
    },
    {
      tone: "blue" as Tone,
      title: "Analizador de ambiente",
      text: "What the area around each place is like: quietness, nightlife and study spots.",
    },
    {
      tone: "orange" as Tone,
      title: "Favorites",
      text: "Save the places you like and come back to them whenever you want.",
    },
    {
      tone: "lilac" as Tone,
      title: "Student reviews",
      text: "Opinions from other students about each place.",
    },
  ],
};

export const steps = {
  title: "How it works",
  items: [
    { tone: "periwinkle" as Tone, text: "Create your profile" },
    { tone: "green" as Tone, text: "Set your priorities" },
    { tone: "orange" as Tone, text: "Choose with confidence" },
  ],
};

export const vibe = {
  title: "What is the Student Vibe Analyzer?",
  paragraphs: [
    "The Student Vibe Analyzer is a lifestyle indicator that helps you understand the surroundings of a place, beyond distance or price.",
    "Instead of only showing how far it is from campus, it analyzes the atmosphere of the area and how well it fits your day-to-day life.",
  ],
  tags: [
    "Percentage of students living nearby",
    "Acceso a servicios esenciales",
    "Quietness and places to study",
    "Nearby cafés and study spots",
    "Nivel de vida nocturna",
  ],
};

export const testimonials = {
  title: "Opiniones de nuestros usuarios",
  items: [
    {
      tone: "green" as Tone,
      text: "I love how clear the listings are. It saved me a lot of time.",
    },
    {
      tone: "tan" as Tone,
      text: "This app helped me find a place that really fits what I need.",
    },
    {
      tone: "crimson" as Tone,
      text: "With this app it was much easier to find a room near the university.",
    },
    {
      tone: "blueStrong" as Tone,
      text: "I moved in less than a week after starting with this app.",
    },
    {
      tone: "peach" as Tone,
      text: "Spacious room and plenty of privacy.",
    },
    {
      tone: "pink" as Tone,
      text: "It turned a complicated search into a simple experience.",
    },
    {
      tone: "purple" as Tone,
      text: "I love how easy it is to navigate.",
    },
    {
      tone: "sky" as Tone,
      text: "I appreciate how detailed and transparent the listings are.",
    },
  ],
};

export const footer: {
  tagline: string;
  columns: FooterColumn[];
  contact: FooterContact;
  copyright: string;
} = {
  tagline: "Find your place. Fit your lifestyle.",
  columns: [
    {
      title: "Quick links",
      links: [
        { label: "Browse places", href: "/properties" },
        { label: "How it works", href: "/#como-funciona" },
        { label: "Log in", href: "/login" },
        { label: "Create account", href: "/register" },
      ],
    },
    {
      title: "Recursos",
      links: [
        { label: "Student guides" },
        { label: "Blog" },
        { label: "Consejos de seguridad" },
        { label: "Soporte" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy policy" },
        { label: "Terms of service" },
        { label: "Refund policy" },
      ],
    },
  ],
  contact: {
    email: "info@uhome.com",
    phone: "+57 300 000 0000",
    address: "Bogotá, Colombia",
  },
  copyright: "© 2026 UHome. All rights reserved.",
};
