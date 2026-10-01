import { Link, Outlet } from "@tanstack/react-router";
import { Home, BookOpen, Newspaper, ClipboardList, User } from "lucide-react";
import { Logo } from "./ui";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/practice", label: "Practice", icon: BookOpen },
  { to: "/current-affairs", label: "Articles & CA", icon: Newspaper },
  { to: "/tests", label: "Tests", icon: ClipboardList },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell() {
  return (
    <div className="min-h-dvh md:flex">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r bg-sidebar p-4 md:flex">
        <Link to="/home" className="mb-8 px-2" aria-label="RK Study home"><Logo /></Link>
        <nav aria-label="Main" className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent !text-sidebar-accent-foreground" }}
            >
              <Icon className="size-5" aria-hidden /> {label}
            </Link>
          ))}
        </nav>
        <p className="mt-auto px-2 text-xs text-muted-foreground">Study Smart. Practice Better. Rank Higher.</p>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center border-b bg-background/90 px-4 py-3 backdrop-blur md:hidden">
          <Link to="/home" aria-label="RK Study home"><Logo /></Link>
        </header>
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-5 md:px-8 md:pb-12 md:pt-8">
          <Outlet />
        </main>
      </div>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold text-muted-foreground"
            activeProps={{ className: "!text-primary" }}
          >
            <Icon className="size-5" aria-hidden />
            <span className="leading-none">{label === "Articles & CA" ? "Articles" : label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
