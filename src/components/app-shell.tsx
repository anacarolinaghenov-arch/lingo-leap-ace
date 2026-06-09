import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessagesSquare, Mic, Compass, Plane, User } from "lucide-react";
import type { ReactNode } from "react";

const tabs = [
  { to: "/", label: "Início", icon: Home },
  { to: "/conversa", label: "Conversa", icon: MessagesSquare },
  { to: "/shadowing", label: "Shadow", icon: Mic },
  { to: "/imersao", label: "Imersão", icon: Compass },
  { to: "/intercambio", label: "Plano", icon: Plane },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground flex justify-center">
      <div className="relative w-full max-w-[440px] min-h-screen border-x border-border/40 pb-28">
        <div className="grain absolute inset-0 pointer-events-none opacity-60" />
        <div className="relative">{children}</div>

        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-4 pb-5 pt-3 z-50">
          <div className="flex items-center justify-between rounded-full bg-surface/90 backdrop-blur-xl border border-border px-3 py-2.5">
            {tabs.map((t) => {
              const active = pathname === t.to;
              const Icon = t.icon;
              return (
                <Link
                  key={t.to}
                  to={t.to}
                  className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-full transition-all ${
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="size-[18px]" strokeWidth={active ? 2.4 : 2} />
                  <span className="text-[9px] font-medium tracking-wide uppercase">
                    {t.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <header className="px-5 pt-8 pb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-3xl font-semibold text-balance leading-[1.05]">
          {title}
        </h1>
      </div>
      {action}
    </header>
  );
}
