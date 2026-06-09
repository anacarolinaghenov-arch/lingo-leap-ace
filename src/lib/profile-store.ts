import { useEffect, useState } from "react";

export type AccentKey = "lime" | "violet" | "coral" | "cyan" | "tangerine" | "mono";

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
  violet: {
    label: "Violeta",
    swatch: "#B591FF",
    accent: "oklch(0.74 0.2 295)",
    accentSoft: "oklch(0.74 0.2 295 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  coral: {
    label: "Coral",
    swatch: "#FF7A8A",
    accent: "oklch(0.76 0.2 15)",
    accentSoft: "oklch(0.76 0.2 15 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  cyan: {
    label: "Ciano",
    swatch: "#7FE3FF",
    accent: "oklch(0.85 0.13 220)",
    accentSoft: "oklch(0.85 0.13 220 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  tangerine: {
    label: "Tangerina",
    swatch: "#FFB347",
    accent: "oklch(0.8 0.18 60)",
    accentSoft: "oklch(0.8 0.18 60 / 0.14)",
    accentFg: "oklch(0.12 0 0)",
  },
  mono: {
    label: "Branco",
    swatch: "#FFFFFF",
    accent: "oklch(0.98 0 0)",
    accentSoft: "oklch(0.98 0 0 / 0.1)",
    accentFg: "oklch(0.12 0 0)",
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
