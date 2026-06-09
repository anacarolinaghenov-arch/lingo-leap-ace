import { useEffect, useState } from "react";

export type AccentKey =
  | "lime"
  | "mint"
  | "emerald"
  | "violet"
  | "lavender"
  | "grape"
  | "coral"
  | "rose"
  | "peach"
  | "cyan"
  | "sky"
  | "ocean"
  | "tangerine"
  | "mustard"
  | "terracotta"
  | "mono"
  | "graphite"
  | "magenta";

export const ACCENT_PRESETS: Record<
  AccentKey,
  { label: string; swatch: string; accent: string; accentSoft: string; accentFg: string }
> = {
  lime: {
    label: "Lima",
    swatch: "#C8F542",
    accent: "oklch(0.92 0.22 122)",
    accentSoft: "oklch(0.92 0.22 122 / 0.12)",
    accentFg: "oklch(0.12 0 0)",
  },
  mint: {
    label: "Menta",
    swatch: "#7FFFB8",
    accent: "oklch(0.9 0.17 160)",
    accentSoft: "oklch(0.9 0.17 160 / 0.13)",
    accentFg: "oklch(0.12 0 0)",
  },
  emerald: {
    label: "Esmeralda",
    swatch: "#2ECC71",
    accent: "oklch(0.72 0.22 145)",
    accentSoft: "oklch(0.72 0.22 145 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  violet: {
    label: "Violeta",
    swatch: "#B591FF",
    accent: "oklch(0.74 0.2 295)",
    accentSoft: "oklch(0.74 0.2 295 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  lavender: {
    label: "Lavanda",
    swatch: "#E2B0FF",
    accent: "oklch(0.83 0.14 310)",
    accentSoft: "oklch(0.83 0.14 310 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  grape: {
    label: "Uva",
    swatch: "#7B61FF",
    accent: "oklch(0.62 0.25 285)",
    accentSoft: "oklch(0.62 0.25 285 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  coral: {
    label: "Coral",
    swatch: "#FF7A8A",
    accent: "oklch(0.76 0.2 15)",
    accentSoft: "oklch(0.76 0.2 15 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  rose: {
    label: "Rosa",
    swatch: "#FF5C8D",
    accent: "oklch(0.7 0.24 10)",
    accentSoft: "oklch(0.7 0.24 10 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  peach: {
    label: "Pêssego",
    swatch: "#FFBC97",
    accent: "oklch(0.84 0.13 50)",
    accentSoft: "oklch(0.84 0.13 50 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  cyan: {
    label: "Ciano",
    swatch: "#7FE3FF",
    accent: "oklch(0.85 0.13 220)",
    accentSoft: "oklch(0.85 0.13 220 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  sky: {
    label: "Céu",
    swatch: "#6BB5FF",
    accent: "oklch(0.74 0.15 245)",
    accentSoft: "oklch(0.74 0.15 245 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  ocean: {
    label: "Oceano",
    swatch: "#3A7BD5",
    accent: "oklch(0.58 0.18 250)",
    accentSoft: "oklch(0.58 0.18 250 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  tangerine: {
    label: "Tangerina",
    swatch: "#FFB347",
    accent: "oklch(0.8 0.18 60)",
    accentSoft: "oklch(0.8 0.18 60 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  mustard: {
    label: "Mostarda",
    swatch: "#FFD54F",
    accent: "oklch(0.86 0.18 85)",
    accentSoft: "oklch(0.86 0.18 85 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  terracotta: {
    label: "Terracota",
    swatch: "#E07A5F",
    accent: "oklch(0.66 0.17 40)",
    accentSoft: "oklch(0.66 0.17 40 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  mono: {
    label: "Branco",
    swatch: "#FFFFFF",
    accent: "oklch(0.98 0 0)",
    accentSoft: "oklch(0.98 0 0 / 0.1)",
    accentFg: "oklch(0.12 0 0)",
  },
  graphite: {
    label: "Grafite",
    swatch: "#6C7A89",
    accent: "oklch(0.52 0.05 245)",
    accentSoft: "oklch(0.52 0.05 245 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
  magenta: {
    label: "Magenta",
    swatch: "#FF3CAC",
    accent: "oklch(0.68 0.26 350)",
    accentSoft: "oklch(0.68 0.26 350 / 0.14)",
    accentFg: "oklch(0.98 0 0)",
  },
};

export type Profile = {
  name: string;
  age: string;
  language: string;
  level: string;
  goal: string;
  dailyMinutes: number;
  accent: AccentKey;
};

const KEY = "flui_profile_v1";

export function readProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function writeProfile(p: Profile) {
  localStorage.setItem(KEY, JSON.stringify(p));
  window.dispatchEvent(new Event("flui:profile"));
}

export function updateProfile(patch: Partial<Profile>) {
  const cur = readProfile();
  if (!cur) return;
  writeProfile({ ...cur, ...patch });
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  useEffect(() => {
    setProfile(readProfile());
    const handler = () => setProfile(readProfile());
    window.addEventListener("flui:profile", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("flui:profile", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return profile;
}
