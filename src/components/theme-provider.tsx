import { useEffect, type ReactNode } from "react";
import { ACCENT_PRESETS, useProfile, type AccentKey } from "@/lib/profile-store";

export function applyAccent(key: AccentKey) {
  const preset = ACCENT_PRESETS[key];
  if (!preset) return;
  const root = document.documentElement;
  root.style.setProperty("--accent", preset.accent);
  root.style.setProperty("--accent-soft", preset.accentSoft);
  root.style.setProperty("--accent-foreground", preset.accentFg);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const profile = useProfile();
  useEffect(() => {
    if (profile?.accent) applyAccent(profile.accent);
  }, [profile?.accent]);
  return <>{children}</>;
}
